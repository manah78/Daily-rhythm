# Daily Rhythm — Cloudflare AI Translation

This package combines the current Daily Rhythm PWA with a secure Cloudflare Workers AI translation endpoint.

## What it adds

`POST /api/translate`

Example request:

```json
{
  "text": "مراجعة مشروع العلوم",
  "sourceLang": "ar",
  "targetLang": "en",
  "context": "daily-rhythm-activity-label",
  "maxWords": 12
}
```

Example response:

```json
{
  "translation": "Review science project",
  "labelEn": "Review science project",
  "labelAr": "مراجعة مشروع العلوم",
  "sourceLang": "ar",
  "targetLang": "en"
}
```

## Cloudflare setup

1. Put these files in the repository used by the Daily Rhythm Worker.
2. In Cloudflare, open the Daily Rhythm Worker.
3. Add a Workers AI binding named exactly `AI`.
4. Deploy the repository/Worker.
5. The static app is served from `public/`, while `/api/translate` is handled by `src/worker.js`.

No external AI API key is placed in the browser. The Worker calls Cloudflare Workers AI through `env.AI`.

## Quick test after deployment

Open the browser console on the live site and run:

```js
fetch('/api/translate', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({
    text:'مراجعة مشروع العلوم',
    sourceLang:'ar',
    targetLang:'en'
  })
}).then(r => r.json()).then(console.log)
```

Then test the app by adding an unknown custom activity in Arabic, switching to English, and confirming the English label appears after translation.

## Safety / cost controls included

- POST only
- JSON only
- English/Arabic only
- source and target must differ
- maximum source length: 80 characters
- output length and script validation
- no model/API credential in the PWA
- no-store response headers


## Hybrid command interpreter

This version also adds `POST /api/interpret-command` for complex English/Arabic schedule commands. The browser still keeps the deterministic local parser as a fallback. Complex Arabic, prayer-relative, compound, and multiple-time add commands are sent to Workers AI for structured interpretation, then validated and executed by the app.

Examples covered:
- `أضف السباحة الساعة الواحدة مساءً والساعة السابعة مساءً` → two swimming occurrences
- `أضف السباحة بعد صلاة المغرب` → swimming 15 minutes after Maghrib
- `أضف مراجعة العلوم الساعة الرابعة مساءً` → preserves `مراجعة العلوم / Review science`; category does not replace the label
- `swimming from 1 PM to 7 PM` → one explicit range

The model never directly edits storage. It only returns a constrained JSON plan; the client validates times, labels, anchors, and allowed actions before modifying the schedule.

## Hybrid command AI v2 refinements (2026-09-19)

This continuation keeps the local deterministic parser as fallback and strengthens `/api/interpret-command` for complex add/schedule requests.

Regression cases to test after deployment:

- `أضف السباحة الساعة الواحدة مساءً والساعة السابعة مساءً` → two Swimming occurrences: 13:00 and 19:00.
- `أضف الجيم الساعة السادسة والقراءة الساعة الثامنة والتاسعة مساءً` → Gym at 18:00; Reading at 20:00 and 21:00.
- `أضف القراءة بعد صلاة المغرب` → preview resolved time, then require confirmation before changing the schedule.
- `أضف المشي مباشرة بعد صلاة الفجر` → relative offset 0 minutes, still preview + confirm.
- `أضف الدراسة قبل صلاة العشاء بنصف ساعة` → 30-minute prayer-relative offset, preview + confirm.
- Speech/fuzzy substitutions such as `Jim/Gem/Gim` should be confirmed before AI/local execution when they match an existing activity.

UI: phone clock proportions are unchanged. Tablet portrait (700px+) and landscape (1024px+) allow a larger watch face while retaining proportional moon and magnifier controls.
