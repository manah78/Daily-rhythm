const MODEL = "@cf/google/gemma-4-26b-a4b-it";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

function cleanText(value) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validLanguage(value) {
  return value === "en" || value === "ar";
}

function containsArabic(value) {
  return /[\u0600-\u06FF]/.test(value);
}

function validTranslation(value, targetLang) {
  const text = cleanText(value).replace(/^["'“”‘’]+|["'“”‘’]+$/g, "");
  if (!text || text.length > 120) return "";
  if (targetLang === "ar" && !containsArabic(text)) return "";
  if (targetLang === "en" && containsArabic(text)) return "";
  return text;
}

async function handleTranslate(request, env) {
  if (!env.AI) {
    return json({ error: "AI binding is not configured." }, 503);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "Content-Type must be application/json." }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const text = cleanText(body?.text);
  const sourceLang = body?.sourceLang;
  const targetLang = body?.targetLang;

  if (!text || text.length > 80) {
    return json({ error: "Activity text must be between 1 and 80 characters." }, 400);
  }

  if (!validLanguage(sourceLang) || !validLanguage(targetLang) || sourceLang === targetLang) {
    return json({ error: "sourceLang and targetLang must be different and use en/ar." }, 400);
  }

  const sourceName = sourceLang === "ar" ? "Arabic" : "English";
  const targetName = targetLang === "ar" ? "Arabic" : "English";

  const prompt = [
    "You translate short activity labels for a daily schedule app.",
    `Translate from ${sourceName} to ${targetName}.`,
    "Return ONLY the concise translated activity label.",
    "Do not explain, quote, transliterate, add punctuation, or answer the activity.",
    "Preserve names when appropriate.",
    "Use natural everyday wording.",
    "Maximum 12 words.",
    "",
    `Activity label: ${text}`
  ].join("\n");

  try {
    const result = await env.AI.run(
      MODEL,
      {
        messages: [
          {
            role: "system",
            content: "You are a precise bilingual English-Arabic UI translator. Output only the translated activity label."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 48,
        temperature: 0.1
      },
      { rejectIfBusy: true }
    );

    const raw =
      result?.response ??
      result?.result?.response ??
      result?.output_text ??
      "";

    const translation = validTranslation(raw, targetLang);

    if (!translation) {
      return json({ error: "The AI returned an invalid translation." }, 502);
    }

    const labelEn = targetLang === "en" ? translation : text;
    const labelAr = targetLang === "ar" ? translation : text;

    return json({
      translation,
      labelEn,
      labelAr,
      sourceLang,
      targetLang
    });
  } catch (error) {
    console.error("AI translation failed", error);
    return json({ error: "Translation is temporarily unavailable." }, 503);
  }
}


function extractJsonObject(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  try { return JSON.parse(text); } catch (_) {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch (_) {}
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch (_) {}
  }
  return null;
}

const PRAYER_NAMES = new Set(['Fajr','Sunrise','Zohr','Asr','Maghrib','Isha']);

function cleanLabel(value, max = 80) {
  return cleanText(value).replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').slice(0, max);
}

function validHHMM(value) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(value || ''));
  if (!m) return false;
  const h = Number(m[1]), min = Number(m[2]);
  return h >= 0 && h <= 23 && min >= 0 && min <= 59;
}

function sanitizeInterpretation(value) {
  if (!value || value.intent !== 'add_schedule' || !Array.isArray(value.activities)) {
    return { intent:'unknown', activities:[] };
  }
  const activities = [];
  for (const rawActivity of value.activities.slice(0, 12)) {
    const labelEn = cleanLabel(rawActivity?.labelEn);
    const labelAr = cleanLabel(rawActivity?.labelAr);
    if (!labelEn || !labelAr || containsArabic(labelEn) || !containsArabic(labelAr)) continue;
    const occurrences = [];
    for (const rawOcc of (Array.isArray(rawActivity?.occurrences) ? rawActivity.occurrences : []).slice(0, 12)) {
      const kind = rawOcc?.kind;
      if (kind === 'time') {
        if (!validHHMM(rawOcc.start)) continue;
        const durationMinutes = Math.min(360, Math.max(15, Number(rawOcc.durationMinutes) || 30));
        occurrences.push({ kind:'time', start:rawOcc.start, durationMinutes });
      } else if (kind === 'range') {
        if (!validHHMM(rawOcc.start) || !validHHMM(rawOcc.end)) continue;
        occurrences.push({ kind:'range', start:rawOcc.start, end:rawOcc.end });
      } else if (kind === 'relative') {
        const relation = rawOcc.relation === 'before' ? 'before' : 'after';
        const anchorType = rawOcc.anchorType === 'activity' ? 'activity' : 'prayer';
        const anchor = cleanLabel(rawOcc.anchor, 60);
        if (!anchor) continue;
        if (anchorType === 'prayer' && !PRAYER_NAMES.has(anchor)) continue;
        const rawOffset = Number(rawOcc.offsetMinutes);
        const offsetMinutes = Math.min(180, Math.max(0, Number.isFinite(rawOffset) ? rawOffset : 15));
        const durationMinutes = Math.min(360, Math.max(15, Number(rawOcc.durationMinutes) || 30));
        occurrences.push({ kind:'relative', relation, anchorType, anchor, offsetMinutes, durationMinutes });
      }
    }
    if (occurrences.length) activities.push({
      labelEn,
      labelAr,
      category: cleanLabel(rawActivity?.category, 40) || 'custom',
      occurrences
    });
  }
  return activities.length ? { intent:'add_schedule', activities } : { intent:'unknown', activities:[] };
}

async function handleInterpretCommand(request, env) {
  if (!env.AI) return json({ error:'AI binding is not configured.' }, 503);
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ error:'Content-Type must be application/json.' }, 415);
  }
  let body;
  try { body = await request.json(); } catch (_) { return json({ error:'Invalid JSON.' }, 400); }
  const text = cleanText(body?.text);
  const locale = body?.locale === 'ar' ? 'ar' : 'en';
  if (!text || text.length > 500) return json({ error:'Command must be between 1 and 500 characters.' }, 400);

  const prompt = `You interpret scheduling commands for a bilingual English-Arabic daily planner.
Return ONLY valid JSON. Never include markdown or commentary.

Supported intent in this endpoint: add_schedule. If the user is not asking to add/schedule activities, return {"intent":"unknown","activities":[]}.

Output schema:
{"intent":"add_schedule","activities":[{"labelEn":"natural English activity label","labelAr":"natural Arabic activity label","category":"short generic category","occurrences":[
  {"kind":"time","start":"HH:MM","durationMinutes":30},
  {"kind":"range","start":"HH:MM","end":"HH:MM"},
  {"kind":"relative","relation":"after|before","anchorType":"prayer|activity","anchor":"Fajr|Sunrise|Zohr|Asr|Maghrib|Isha|activity label","offsetMinutes":15,"durationMinutes":30}
]}]}

Rules:
1. Preserve the user's specific activity meaning in labelEn/labelAr. Category is separate and MUST NOT replace the label. Example: مراجعة العلوم => labelEn "Review science", labelAr "مراجعة العلوم", category "study".
2. A conjunction joining TWO complete clock mentions means TWO occurrences, not a range. Example: "swimming at 1 PM and at 7 PM" or "السباحة الساعة الواحدة مساءً والساعة السابعة مساءً" => two kind=time occurrences.
3. A range requires explicit range language such as from X to Y, between X and Y, X-Y, من X إلى Y, or بين X و Y. Example: "swimming from 1 PM to 7 PM" => one kind=range occurrence.
4. Prayer aliases: Dhuhr/Zuhr/Zohr/الظهر => Zohr. المغرب => Maghrib. الفجر => Fajr. العصر => Asr. العشاء => Isha. الشروق => Sunrise.
5. "after Maghrib prayer" / "بعد صلاة المغرب" => relative prayer anchor Maghrib. If no offset is stated, use 15 minutes. If no duration is stated, use 30 minutes.
6. Multiple different activities in one sentence must be separate activity objects. Attach each time only to the activity clause it belongs to. Example: "gym at 6 and reading at 8 and 9" => Gym at 06:00; Reading at 08:00 and 09:00.
7. When one activity is followed by several complete clock mentions joined by و / and, create several occurrences for THAT activity. Do not turn them into separate activities.
8. Arabic can omit repeated words. Example: "أضف السباحة الساعة ١ ظهراً و٧ مساءً" means Swimming at 13:00 and 19:00. Example: "القراءة بعد المغرب والرياضة الساعة ٨" means Reading after Maghrib and Exercise at 20:00.
9. Convert Arabic spoken clock words and AM/PM wording to 24-hour HH:MM. Support forms such as الواحدة، الثانية، الثالثة، الرابعة، الخامسة، السادسة، السابعة، الثامنة، التاسعة، العاشرة، الحادية عشرة، الثانية عشرة, والنصف, والربع, إلا ربع. مساءً means PM, صباحاً means AM, ظهراً means PM unless exactly noon.
10. Prayer-relative wording may include صلاة, وقت, مباشرة, بعد/قبل. If the user says "مباشرة بعد" or "immediately after", use offsetMinutes 0. Otherwise, when no offset is stated, use 15. Preserve explicitly stated offsets such as "بعد المغرب بنصف ساعة" => 30.
11. Do not invent a time that the user did not state, except the documented default 15-minute relative offset and 30-minute duration.
12. No destructive actions. Do not convert add requests into edit/delete.

Examples:
Input: أضف السباحة الساعة الواحدة مساءً والساعة السابعة مساءً
Output: {"intent":"add_schedule","activities":[{"labelEn":"Swimming","labelAr":"السباحة","category":"fitness","occurrences":[{"kind":"time","start":"13:00","durationMinutes":30},{"kind":"time","start":"19:00","durationMinutes":30}]}]}

Input: أضف السباحة بعد صلاة المغرب
Output: {"intent":"add_schedule","activities":[{"labelEn":"Swimming","labelAr":"السباحة","category":"fitness","occurrences":[{"kind":"relative","relation":"after","anchorType":"prayer","anchor":"Maghrib","offsetMinutes":15,"durationMinutes":30}]}]}

Input: أضف مراجعة العلوم الساعة الرابعة مساءً
Output: {"intent":"add_schedule","activities":[{"labelEn":"Review science","labelAr":"مراجعة العلوم","category":"study","occurrences":[{"kind":"time","start":"16:00","durationMinutes":30}]}]}

User locale: ${locale}
Command: ${text}`;

  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        { role:'system', content:'You are a deterministic scheduling command parser. Return only strict JSON matching the requested schema.' },
        { role:'user', content:prompt }
      ],
      max_tokens: 900,
      temperature: 0
    }, { rejectIfBusy:true });
    const raw = result?.response ?? result?.result?.response ?? result?.output_text ?? '';
    const parsed = extractJsonObject(raw);
    if (!parsed) return json({ error:'AI returned invalid JSON.' }, 502);
    return json(sanitizeInterpretation(parsed));
  } catch (error) {
    console.error('AI command interpretation failed', error);
    return json({ error:'Command interpretation is temporarily unavailable.' }, 503);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);


    if (url.pathname === "/api/interpret-command") {
      if (request.method !== "POST") {
        return new Response(null, { status:405, headers:{ allow:"POST" } });
      }
      return handleInterpretCommand(request, env);
    }

    if (url.pathname === "/api/translate") {
      if (request.method !== "POST") {
        return new Response(null, {
          status: 405,
          headers: { allow: "POST" }
        });
      }
      return handleTranslate(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};
