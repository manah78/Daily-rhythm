# Daily Rhythm — Groq/Qwen language-understanding build

This build moves Daily Rhythm's schedule-language understanding away from Cloudflare Workers AI.
Cloudflare still hosts the PWA/Worker, but the Worker calls Groq's API using `qwen/qwen3.8-27b`.

## Architecture

Voice / typed text → `POST /api/interpret-command` → Groq/Qwen → strict JSON → Daily Rhythm safety/validation → schedule mutation.

The model does **not** write to storage and does **not** directly modify the schedule.
The client remains responsible for target verification, ambiguity handling, prayer-time resolution, and execution.

## Required secret

Do **not** put the Groq API key in `public/index.html`, JavaScript, GitHub, or this ZIP.
Create a Cloudflare Worker secret named exactly:

`GROQ_API_KEY`

Optional model override:

`GROQ_MODEL`

If `GROQ_MODEL` is not set, the Worker uses `qwen/qwen3.8-27b`.

## Cloudflare setup

After uploading/deploying these files, add the secret in Cloudflare Worker settings, or with Wrangler:

```bash
npx wrangler secret put GROQ_API_KEY
```

Then redeploy.

No Workers AI binding is required by this build.

## Interpretation contract

Request example:

```json
{
  "text": "غيّر الجيم للثمانية وضيف السباحة بعد صلاة الظهر",
  "locale": "ar",
  "schedule": [
    {"id":"a17","activity":"الجيم","labelEn":"Gym","labelAr":"الجيم","start":"18:00","end":null}
  ]
}
```

Response shape:

```json
{
  "operations": [
    {
      "intent": "edit",
      "activity": "الجيم",
      "matched_activity_id": "a17",
      "timing": {
        "type": "exact_time",
        "time": "20:00",
        "anchor": null,
        "anchor2": null,
        "day_period": null
      },
      "confidence": "high",
      "clarification": null
    }
  ]
}
```

Allowed intents: `add`, `edit`, `delete`, `clear`, `query_availability`.

Allowed timing types:
`exact_time`, `approximate_time`, `after_activity`, `before_activity`, `at_prayer`, `after_prayer`, `before_prayer`, `between`, `day_period`, `untimed`.

## Safety behavior

- ADD may be untimed; Daily Rhythm does not invent a time.
- EDIT/DELETE require a uniquely matched existing activity ID before mutation.
- If the model cannot uniquely identify a destructive target, the operation becomes clarification instead of a guess.
- Prayer-relative and between-anchor timing is returned semantically; Daily Rhythm resolves the actual clock placement.
- Clear-day still uses the existing local confirmation path.

## Translation

`POST /api/translate` also uses the same Groq key/model in this build, so Cloudflare Workers AI is not required for translation either.

## What was intentionally not changed

- GitHub was not modified by ChatGPT.
- The existing schedule storage/execution engine remains in the PWA.
- The Groq key is not embedded anywhere in the downloadable package.

## Conversation milestone v8

- Successful commands clear the completed voice/text draft so the next instruction starts fresh.
- Home CTA: **Talk to your day** / **احكِ لي عن يومك**.
- Availability questions are read-only and answered from the real schedule/prayer anchors; the model does not book a slot by itself.
- The home screen shows only the next five upcoming activities; the full schedule remains under **View day**.
- Past uncompleted items are labeled neutrally as **Previous activity** / **نشاط سابق** rather than assuming they were missed.
- Prayer countdown appears only in the dedicated top countdown card; the prayer pill shows prayer name + prayer time.
- “Between A and B” is preserved as a constraint for ADD and is not converted to an invented midpoint.


## Voice-first edit / replace (v9)
Daily Rhythm can now interpret safe conversational edit patterns such as:
- Move gym from 6 to 8.
- Replace gym with swimming.
- Change my meeting at 2 to swimming at 3.

The model identifies the existing target from the supplied schedule and returns `replacement_activity` only when the activity itself changes. The client still requires a unique matched schedule ID before any edit/delete is executed.


## v10 — Conversation-first landing
- Home status now speaks first with contextual schedule awareness.
- Talk to your day is promoted directly below the status card.
- Upcoming activities remain a glance list below the conversation entry point.
- Voice sheet removes swipe instructions/examples and focuses on natural schedule conversation.
