(function () {
  'use strict';

  const CLIENT_KEY = 'dailyRhythmPushClient_v1';
  const ENABLED_KEY = 'dailyRhythmPushEnabled_v1';
  let syncTimer = null;
  let lastActivities = [];
  let statusListener = null;

  function randomToken(bytes = 24) {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  }

  function getClient() {
    let value = null;
    try { value = JSON.parse(localStorage.getItem(CLIENT_KEY) || 'null'); } catch (_) {}
    if (!value || !value.clientId || !value.clientToken) {
      value = { clientId: crypto.randomUUID ? crypto.randomUUID() : randomToken(16), clientToken: randomToken(32) };
      try { localStorage.setItem(CLIENT_KEY, JSON.stringify(value)); } catch (_) {}
    }
    return value;
  }

  function base64urlToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }

  function isEnabled() {
    try { return localStorage.getItem(ENABLED_KEY) === '1'; } catch (_) { return false; }
  }

  function setEnabled(value) {
    try { localStorage.setItem(ENABLED_KEY, value ? '1' : '0'); } catch (_) {}
  }

  function emitStatus(status) {
    if (typeof statusListener === 'function') {
      try { statusListener(status); } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent('dailyRhythm:reminderStatus', { detail: status }));
  }

  async function jsonFetch(url, options) {
    const response = await fetch(url, {
      ...options,
      headers: { 'content-type': 'application/json', ...(options && options.headers ? options.headers : {}) }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  }

  async function getConfig() {
    return jsonFetch('/api/reminders/config', { method: 'GET', headers: {} });
  }

  async function ensureRegistration() {
    if (!('serviceWorker' in navigator)) throw new Error('Service workers are not supported on this device.');
    return navigator.serviceWorker.ready;
  }

  function subscriptionJSON(sub) {
    const json = sub.toJSON();
    return {
      endpoint: json.endpoint,
      expirationTime: json.expirationTime ?? null,
      keys: json.keys || null
    };
  }

  async function sendWorkerCredentials() {
    try {
      const reg = await ensureRegistration();
      const target = navigator.serviceWorker.controller || reg.active || reg.waiting;
      if (target) target.postMessage({ type: 'daily-rhythm-reminder-auth', ...getClient() });
    } catch (_) {}
  }

  async function enable() {
    if (!('Notification' in window) || !('PushManager' in window)) {
      throw new Error('Push notifications are not supported in this browser.');
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      setEnabled(false);
      emitStatus({ enabled: false, permission });
      return { enabled: false, permission };
    }

    const config = await getConfig();
    if (!config.configured || !config.vapidPublicKey) {
      throw new Error(config.message || 'Push notifications are not configured on the server yet.');
    }

    const reg = await ensureRegistration();
    let subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64urlToUint8Array(config.vapidPublicKey)
      });
    }

    const client = getClient();
    await jsonFetch('/api/reminders/subscribe', {
      method: 'POST',
      body: JSON.stringify({ ...client, subscription: subscriptionJSON(subscription) })
    });

    setEnabled(true);
    await sendWorkerCredentials();
    await syncNow(lastActivities);
    emitStatus({ enabled: true, permission: 'granted' });
    return { enabled: true, permission: 'granted' };
  }

  function localDateAtHourFraction(hourFraction) {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const totalMinutes = Math.round(Number(hourFraction) * 60);
    d.setMinutes(totalMinutes);
    return d;
  }

  function normalizeActivity(b) {
    const start = Number(b && b.start);
    if (!b || !b.id || !Number.isFinite(start) || b.done) return null;
    const prefRaw = Number(b.reminderMinutesBefore);
    const minutesBefore = Number.isFinite(prefRaw) ? prefRaw : 10;
    if (minutesBefore < 0) return null;
    const activityAt = localDateAtHourFraction(start);
    const scheduledAt = activityAt.getTime() - minutesBefore * 60 * 1000;
    // Keep reminders that are still meaningful today; expired ones are omitted.
    if (activityAt.getTime() < Date.now() - 5 * 60 * 1000) return null;
    return {
      id: `activity:${b.id}`,
      activityId: String(b.id),
      title: String(b.label || b.labelEn || b.labelAr || 'Activity').slice(0, 100),
      titleEn: String(b.labelEn || b.label || '').slice(0, 100),
      titleAr: String(b.labelAr || '').slice(0, 100),
      activityTime: activityAt.getTime(),
      scheduledAt,
      minutesBefore,
      snoozeMinutes: 10,
      locale: document.documentElement.lang === 'ar' ? 'ar' : 'en'
    };
  }

  async function syncNow(activities) {
    lastActivities = Array.isArray(activities) ? activities.slice() : [];
    if (!isEnabled() || Notification.permission !== 'granted') return { skipped: true };
    const client = getClient();
    const reminders = lastActivities.map(normalizeActivity).filter(Boolean);
    const result = await jsonFetch('/api/reminders/sync', {
      method: 'POST',
      body: JSON.stringify({ ...client, reminders })
    });
    emitStatus({ enabled: true, permission: 'granted', synced: reminders.length });
    return result;
  }

  function sync(activities) {
    lastActivities = Array.isArray(activities) ? activities.slice() : [];
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncNow(lastActivities).catch(err => emitStatus({ enabled: isEnabled(), error: err.message })), 350);
  }

  async function snooze(reminderId, minutes = 10) {
    const client = getClient();
    return jsonFetch('/api/reminders/snooze', {
      method: 'POST',
      body: JSON.stringify({ ...client, reminderId, minutes })
    });
  }

  async function disable() {
    const client = getClient();
    try {
      const reg = await ensureRegistration();
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await jsonFetch('/api/reminders/unsubscribe', {
          method: 'POST',
          body: JSON.stringify({ ...client, endpoint: subscription.endpoint })
        });
        await subscription.unsubscribe().catch(() => false);
      }
    } finally {
      setEnabled(false);
      emitStatus({ enabled: false, permission: Notification.permission });
    }
  }

  async function status() {
    if (!('Notification' in window)) return { enabled:false, permission:'unsupported', subscribed:false };
    let subscribed = false;
    try {
      const reg = await ensureRegistration();
      subscribed = !!(await reg.pushManager.getSubscription());
    } catch (_) {}
    return { enabled: isEnabled() && Notification.permission === 'granted' && subscribed, permission: Notification.permission, subscribed };
  }

  function onStatus(fn) { statusListener = typeof fn === 'function' ? fn : null; }

  window.DailyRhythmReminders = { enable, disable, sync, syncNow, snooze, status, onStatus, getClient };
})();
