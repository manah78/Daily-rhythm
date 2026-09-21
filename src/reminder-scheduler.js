import webpush from 'web-push';

const MAX_REMINDERS = 100;
const MAX_FUTURE_MS = 48 * 60 * 60 * 1000;

function cleanText(value, max = 120) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function validClientId(value) {
  const v = cleanText(value, 100);
  return /^[A-Za-z0-9._:-]{8,100}$/.test(v) ? v : '';
}

function validToken(value) {
  const v = cleanText(value, 160);
  return /^[A-Fa-f0-9]{32,160}$/.test(v) ? v : '';
}

function cleanSubscription(sub) {
  if (!sub || typeof sub !== 'object') return null;
  const endpoint = cleanText(sub.endpoint, 2048);
  const p256dh = cleanText(sub.keys?.p256dh, 256);
  const auth = cleanText(sub.keys?.auth, 128);
  if (!endpoint.startsWith('https://') || !p256dh || !auth) return null;
  return { endpoint, expirationTime: Number.isFinite(Number(sub.expirationTime)) ? Number(sub.expirationTime) : null, keys: { p256dh, auth } };
}

function cleanReminder(raw) {
  const now = Date.now();
  const id = cleanText(raw?.id, 160);
  const activityId = cleanText(raw?.activityId, 120);
  const scheduledAt = Number(raw?.scheduledAt);
  const activityTime = Number(raw?.activityTime);
  if (!id || !activityId || !Number.isFinite(scheduledAt) || !Number.isFinite(activityTime)) return null;
  if (scheduledAt < now - 10 * 60 * 1000 || scheduledAt > now + MAX_FUTURE_MS) return null;
  return {
    id,
    activityId,
    title: cleanText(raw?.title, 100) || 'Activity',
    titleEn: cleanText(raw?.titleEn, 100),
    titleAr: cleanText(raw?.titleAr, 100),
    scheduledAt,
    activityTime,
    minutesBefore: Math.max(0, Math.min(120, Number(raw?.minutesBefore) || 0)),
    snoozeMinutes: Math.max(1, Math.min(60, Number(raw?.snoozeMinutes) || 10)),
    locale: raw?.locale === 'ar' ? 'ar' : 'en',
    sent: false,
    sentAt: null
  };
}

export class ReminderScheduler {
  constructor(state, env) {
    this.state = state;
    this.storage = state.storage;
    this.env = env;
  }

  async authenticate(requestBody, allowCreate = false) {
    const clientToken = validToken(requestBody?.clientToken);
    if (!clientToken) return false;
    const saved = await this.storage.get('clientToken');
    if (!saved && allowCreate) {
      await this.storage.put('clientToken', clientToken);
      return true;
    }
    return saved === clientToken;
  }

  async rescheduleAlarm(reminders) {
    const pending = reminders.filter(r => !r.sent).sort((a, b) => a.scheduledAt - b.scheduledAt);
    if (!pending.length) {
      await this.storage.deleteAlarm();
      return;
    }
    await this.storage.setAlarm(Math.max(Date.now() + 250, pending[0].scheduledAt));
  }

  async fetch(request) {
    const url = new URL(request.url);
    let body = {};
    if (request.method !== 'GET') {
      try { body = await request.json(); } catch (_) { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
    }

    if (url.pathname.endsWith('/subscribe')) {
      if (!(await this.authenticate(body, true))) return Response.json({ error: 'Unauthorized reminder client.' }, { status: 401 });
      const subscription = cleanSubscription(body.subscription);
      if (!subscription) return Response.json({ error: 'Invalid push subscription.' }, { status: 400 });
      await this.storage.put('subscription', subscription);
      return Response.json({ ok: true });
    }

    if (url.pathname.endsWith('/unsubscribe')) {
      if (!(await this.authenticate(body))) return Response.json({ error: 'Unauthorized reminder client.' }, { status: 401 });
      await this.storage.delete('subscription');
      await this.storage.put('reminders', []);
      await this.storage.deleteAlarm();
      return Response.json({ ok: true });
    }

    if (url.pathname.endsWith('/sync')) {
      if (!(await this.authenticate(body))) return Response.json({ error: 'Unauthorized reminder client.' }, { status: 401 });
      const incoming = (Array.isArray(body.reminders) ? body.reminders : []).slice(0, MAX_REMINDERS).map(cleanReminder).filter(Boolean);
      const existing = (await this.storage.get('reminders')) || [];
      const previousById = new Map(existing.map(r => [r.id, r]));
      const reminders = incoming.map(r => {
        const previous = previousById.get(r.id);
        // Preserve delivery state when the same reminder is merely re-synced.
        // A changed time/preference is a genuinely new reminder and may fire again.
        if (previous && previous.sent && previous.scheduledAt === r.scheduledAt && previous.activityTime === r.activityTime && previous.minutesBefore === r.minutesBefore) {
          r.sent = true;
          r.sentAt = previous.sentAt || Date.now();
        }
        return r;
      });
      await this.storage.put('reminders', reminders);
      await this.rescheduleAlarm(reminders);
      return Response.json({ ok: true, scheduled: reminders.filter(r => !r.sent).length });
    }

    if (url.pathname.endsWith('/snooze')) {
      if (!(await this.authenticate(body))) return Response.json({ error: 'Unauthorized reminder client.' }, { status: 401 });
      const reminderId = cleanText(body.reminderId, 160);
      const minutes = Math.max(1, Math.min(60, Number(body.minutes) || 10));
      const reminders = (await this.storage.get('reminders')) || [];
      const target = reminders.find(r => r.id === reminderId);
      if (!target) return Response.json({ error: 'Reminder not found.' }, { status: 404 });
      target.sent = false;
      target.sentAt = null;
      target.scheduledAt = Date.now() + minutes * 60 * 1000;
      await this.storage.put('reminders', reminders);
      await this.rescheduleAlarm(reminders);
      return Response.json({ ok: true, scheduledAt: target.scheduledAt });
    }

    return Response.json({ error: 'Not found.' }, { status: 404 });
  }

  async alarm() {
    const reminders = (await this.storage.get('reminders')) || [];
    const subscription = await this.storage.get('subscription');
    const now = Date.now();
    const due = reminders.filter(r => !r.sent && r.scheduledAt <= now + 1500);

    if (!subscription || !due.length) {
      await this.rescheduleAlarm(reminders);
      return;
    }

    if (!this.env.VAPID_PUBLIC_KEY || !this.env.VAPID_PRIVATE_KEY) {
      throw new Error('VAPID keys are not configured.');
    }

    webpush.setVapidDetails(
      this.env.VAPID_SUBJECT || 'https://daily-rhythm.manah78.workers.dev',
      this.env.VAPID_PUBLIC_KEY,
      this.env.VAPID_PRIVATE_KEY
    );

    for (const reminder of due) {
      const ar = reminder.locale === 'ar';
      const activity = ar ? (reminder.titleAr || reminder.title) : (reminder.titleEn || reminder.title);
      const minutes = reminder.minutesBefore;
      const body = ar
        ? (minutes === 0 ? 'حان وقت هذا النشاط.' : `يبدأ خلال ${minutes} دقيقة.`)
        : (minutes === 0 ? 'It is time for this activity.' : `Starts in ${minutes} minutes.`);
      try {
        await webpush.sendNotification(subscription, JSON.stringify({
          title: activity,
          body,
          tag: `daily-rhythm-${reminder.activityId}`,
          data: { reminderId: reminder.id, blockId: reminder.activityId, snoozeMinutes: reminder.snoozeMinutes },
          lang: reminder.locale
        }));
        reminder.sent = true;
        reminder.sentAt = Date.now();
      } catch (error) {
        const status = Number(error?.statusCode || 0);
        if (status === 404 || status === 410) {
          await this.storage.delete('subscription');
          reminder.sent = true;
          reminder.sentAt = Date.now();
        } else if (status >= 500 || status === 0) {
          reminder.scheduledAt = Date.now() + 60 * 1000;
        } else {
          reminder.sent = true;
          reminder.sentAt = Date.now();
        }
      }
    }

    await this.storage.put('reminders', reminders);
    await this.rescheduleAlarm(reminders);
  }
}

export function reminderClientName(body) {
  return validClientId(body?.clientId);
}
