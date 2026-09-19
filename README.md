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
