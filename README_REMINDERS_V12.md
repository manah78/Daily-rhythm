# Daily Rhythm v12 — real PWA reminders

This patch adds server-scheduled Web Push reminders so an activity can notify the installed PWA even when Daily Rhythm is closed.

## Files changed / added

- `public/index.html` — activity reminder preference UI, reminder sync hooks, simplified in-app reminder (Snooze + dismiss only)
- `public/js/reminders.js` — new browser push subscription + reminder sync service
- `public/sw.js` — receives Web Push while the PWA is closed; notification exposes Snooze where supported
- `src/worker.js` — reminder API routing
- `src/reminder-scheduler.js` — new Durable Object scheduler; stores the device subscription, schedules the next alarm, sends Web Push, reschedules Snooze
- `wrangler.jsonc` — Durable Object binding/migration + `nodejs_compat`
- `package.json` — adds the Cloudflare-supported `web-push` dependency

## One-time Cloudflare configuration required before the first live push

Web Push uses VAPID. Configure these Worker secrets/variables in Cloudflare:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` is already set in `wrangler.jsonc` to the Daily Rhythm Worker URL.

Keep `VAPID_PRIVATE_KEY` only in Cloudflare secrets. Do not place it in `public/`, source control, or client code.

Generate a VAPID pair with the standard `web-push` tooling, then copy the public key to `VAPID_PUBLIC_KEY` and the private key to `VAPID_PRIVATE_KEY`.

## Reminder behavior

Activity editor options:

- At time
- 5 minutes before
- 10 minutes before (default)
- 15 minutes before
- No reminder

When notifications are enabled, the PWA syncs today's upcoming reminders to the Worker. Editing, moving, replacing, completing, deleting, or clearing activities triggers a sync through the existing `saveBlocks()` path.

Notification behavior:

- activity title
- time-relative message
- Snooze 10m action where the platform supports notification actions
- normal dismissal does not edit or delete the activity
- tapping the notification opens/focuses Daily Rhythm

The in-app reminder card is also reduced to Snooze + dismiss; Edit/Delete/Done are not exposed from the reminder.
