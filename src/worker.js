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

function extractAiText(result) {
  const candidates = [
    result?.response,
    result?.result?.response,
    result?.output_text,
    result?.choices?.[0]?.message?.content,
    result?.result?.choices?.[0]?.message?.content,
    result?.choices?.[0]?.text,
    result?.result?.choices?.[0]?.text
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      const text = value.map(part => typeof part === "string" ? part : (part?.text || part?.content || "")).join("").trim();
      if (text) return text;
    }
  }
  return "";
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
  if (!env.GROQ_API_KEY) {
    return json({ error: "GROQ_API_KEY is not configured." }, 503);
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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.GROQ_API_KEY}`,
        "content-type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: env.GROQ_MODEL || GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: `Translate a short daily-schedule activity label from ${sourceName} to ${targetName}. Return only the concise translated activity label. Preserve names. Do not explain, quote, transliterate, add punctuation, or answer the activity. Maximum 12 words.`
          },
          { role: "user", content: text }
        ],
        reasoning_effort: "none",
        temperature: 0.1,
        max_completion_tokens: 64
      })
    });

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("Groq translation failed", response.status, result?.error?.message || "unknown error");
      return json({ error: "Translation is temporarily unavailable." }, 503);
    }

    const raw = result?.choices?.[0]?.message?.content || "";
    const translation = validTranslation(raw, targetLang);
    if (!translation) {
      return json({ error: "The language model returned an invalid translation." }, 502);
    }

    const labelEn = targetLang === "en" ? translation : text;
    const labelAr = targetLang === "ar" ? translation : text;
    return json({ translation, labelEn, labelAr, sourceLang, targetLang });
  } catch (error) {
    console.error("Groq translation failed", error?.name || error);
    return json({ error: "Translation is temporarily unavailable." }, 503);
  } finally {
    clearTimeout(timer);
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

function canonicalPrayerName(value) {
  const raw = cleanText(value).toLowerCase();
  if (!raw) return null;
  const compact = raw
    .replace(/\b(?:prayer|time|salat|salah)\b/g, ' ')
    .replace(/(?:صلاة|وقت)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const variants = [
    ['Fajr', ['fajr','الفجر','فجر']],
    ['Sunrise', ['sunrise','shuruq','shorouq','الشروق','شروق']],
    ['Zohr', ['zohr','dhuhr','duhr','ظهر','الظهر']],
    ['Asr', ['asr','العصر','عصر']],
    ['Maghrib', ['maghrib','المغرب','مغرب']],
    ['Isha', ['isha','ishaa','esha','العشاء','عشاء']]
  ];
  for (const [canonical, names] of variants) {
    if (names.some(n => compact === n || compact.includes(n))) return canonical;
  }
  return null;
}

function cleanLabel(value, max = 80) {
  return cleanText(value).replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').slice(0, max);
}

function validHHMM(value) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(value || ''));
  if (!m) return false;
  const h = Number(m[1]), min = Number(m[2]);
  return h >= 0 && h <= 23 && min >= 0 && min <= 59;
}

const GROQ_MODEL = "qwen/qwen3.8-27b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const INTERPRET_SCHEMA = {
  type: "object",
  properties: {
    operations: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        properties: {
          intent: { type: "string", enum: ["add", "edit", "delete", "clear"] },
          activity: { type: "string", maxLength: 120 },
          matched_activity_id: { type: ["string", "null"], maxLength: 120 },
          timing: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["exact_time", "approximate_time", "after_activity", "before_activity", "at_prayer", "after_prayer", "before_prayer", "between", "day_period", "untimed"] },
              time: { type: ["string", "null"], maxLength: 16 },
              anchor: { type: ["string", "null"], maxLength: 120 },
              anchor2: { type: ["string", "null"], maxLength: 120 },
              day_period: { type: ["string", "null"], maxLength: 40 }
            },
            required: ["type", "time", "anchor", "anchor2", "day_period"],
            additionalProperties: false
          },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          clarification: { type: ["string", "null"], maxLength: 180 }
        },
        required: ["intent", "activity", "matched_activity_id", "timing", "confidence", "clarification"],
        additionalProperties: false
      }
    }
  },
  required: ["operations"],
  additionalProperties: false
};

const INTERPRET_SYSTEM_PROMPT = `You are the language-understanding component of Daily Rhythm, a scheduling application.
Extract EVERY scheduling operation from the user's complete utterance.
Understand English, Modern Standard Arabic, everyday Arabic dialects/slang (including Lebanese, Syrian, Palestinian/Jordanian, Egyptian, Gulf and Iraqi), mixed Arabic-English, and transliterated Arabic.

Rules:
1. Preserve the user's activity meaning closely. Unknown/custom activities are valid. Never replace them with a generic "Custom activity" label.
2. Never require commas, repeated "add", "then", or "and" to discover multiple activities. Recover all distinct activities in spoken order.
3. Never move a number or time into the activity text. Every explicit time belongs to the intended nearby activity.
4. Never invent a missing time. If an activity has no timing, use timing.type="untimed" and time=null.
5. Use only intents add, edit, delete, clear.
6. Use edit/delete only when the user's words clearly express that action. A plain activity mention normally means add, even when a time is supplied.
7. The supplied schedule is reference context. For edit/delete, set matched_activity_id ONLY when exactly one supplied schedule item is clearly the intended target. If none or multiple are plausible, set it to null, confidence="low", and provide a short clarification. Never guess a destructive target.
8. For add, matched_activity_id must be null.
9. Preserve relative timing instead of converting it to an invented clock time: after/before an activity, at/after/before prayer, between anchors, or a day period.
10. Prayer names are anchors even when the user does NOT say the word prayer. Treat forms such as "Isha", "Isha time", "Isha prayer", "at Isha", "نام وقت العشاء", "نام على العشاء", and "عند صلاة العشاء" as prayer references. Distinguish exactly: at/وقت/على/عند a prayer => timing.type="at_prayer"; after/بعد => "after_prayer"; before/قبل => "before_prayer". Canonicalize prayer anchors to one of: Fajr, Sunrise, Zohr, Asr, Maghrib, Isha. Examples: الظهر/Dhuhr/Zohr=>Zohr, العصر/Asr=>Asr, المغرب/Maghrib=>Maghrib, العشاء/Isha/Ishaa=>Isha, الفجر/Fajr=>Fajr, الشروق/Sunrise=>Sunrise.
11. exact_time and approximate_time use 24-hour HH:MM when an explicit clock time exists. "around/حوالي" means approximate_time.
12. day_period keeps the spoken concept in day_period (for example evening, tonight, الصبح, بالليل) and leaves time=null.
13. between stores the first anchor in anchor and the second in anchor2. Do not invent midpoint times.
14. If an edit expresses a relative position (for example "move meeting after lunch"), return that relationship. Do not force old_time/new_time fields.
15. Completion statements such as done/finished/خلصت are not delete operations.
16. A clear-day request may use intent="clear", but do not infer clear from vague language.
17. Return only the required JSON structure. No prose.`;

function sanitizeScheduleForInterpret(body) {
  if (!Array.isArray(body?.schedule)) return [];
  return body.schedule.slice(0, 100).map(x => {
    const id = cleanLabel(x?.id, 120);
    const activity = cleanLabel(x?.activity || x?.labelAr || x?.labelEn, 120);
    if (!id || !activity) return null;
    return {
      id,
      activity,
      labelEn: cleanLabel(x?.labelEn, 120) || null,
      labelAr: cleanLabel(x?.labelAr, 120) || null,
      start: validHHMM(x?.start) ? x.start : null,
      end: validHHMM(x?.end) ? x.end : null
    };
  }).filter(Boolean);
}

function sanitizeGroqInterpretation(value) {
  if (!value || !Array.isArray(value.operations)) return { operations: [] };
  const allowedIntent = new Set(["add", "edit", "delete", "clear"]);
  const allowedTiming = new Set(["exact_time", "approximate_time", "after_activity", "before_activity", "at_prayer", "after_prayer", "before_prayer", "between", "day_period", "untimed"]);
  const operations = [];
  for (const raw of value.operations.slice(0, 20)) {
    const intent = allowedIntent.has(raw?.intent) ? raw.intent : null;
    const activity = cleanLabel(raw?.activity, 120);
    if (!intent || (intent !== "clear" && !activity)) continue;
    const t = raw?.timing && allowedTiming.has(raw.timing.type) ? raw.timing : { type: "untimed" };
    const timing = {
      type: allowedTiming.has(t.type) ? t.type : "untimed",
      time: validHHMM(t.time) ? t.time : null,
      anchor: cleanLabel(t.anchor, 120) || null,
      anchor2: cleanLabel(t.anchor2, 120) || null,
      day_period: cleanLabel(t.day_period, 40) || null
    };
    if (!["exact_time", "approximate_time"].includes(timing.type)) timing.time = null;
    if (!["after_activity", "before_activity", "at_prayer", "after_prayer", "before_prayer", "between"].includes(timing.type)) timing.anchor = null;
    if (timing.type !== "between") timing.anchor2 = null;
    if (["at_prayer", "after_prayer", "before_prayer"].includes(timing.type)) {
      const canonical = canonicalPrayerName(timing.anchor);
      if (canonical) timing.anchor = canonical;
    }
    if (timing.type !== "day_period") timing.day_period = null;
    operations.push({
      intent,
      activity: intent === "clear" ? (activity || "schedule") : activity,
      matched_activity_id: intent === "add" || intent === "clear" ? null : (cleanLabel(raw?.matched_activity_id, 120) || null),
      timing,
      confidence: ["high", "medium", "low"].includes(raw?.confidence) ? raw.confidence : "medium",
      clarification: cleanLabel(raw?.clarification, 180) || null
    });
  }
  return { operations };
}

async function handleInterpretCommand(request, env) {
  if (!env.GROQ_API_KEY) return json({ error: "GROQ_API_KEY is not configured." }, 503);
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return json({ error: "Content-Type must be application/json." }, 415);

  let body;
  try { body = await request.json(); } catch (_) { return json({ error: "Invalid JSON." }, 400); }
  const text = cleanText(body?.text);
  const locale = body?.locale === "ar" ? "ar" : "en";
  if (!text || text.length > 1200) return json({ error: "Command must be between 1 and 1200 characters." }, 400);
  const schedule = sanitizeScheduleForInterpret(body);

  const userPayload = JSON.stringify({ locale, schedule, command: text });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.GROQ_API_KEY}`,
        "content-type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: env.GROQ_MODEL || GROQ_MODEL,
        messages: [
          { role: "system", content: INTERPRET_SYSTEM_PROMPT },
          { role: "user", content: userPayload }
        ],
        reasoning_effort: "none",
        temperature: 0.2,
        max_completion_tokens: 2200,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "daily_rhythm_schedule_operations",
            strict: true,
            schema: INTERPRET_SCHEMA
          }
        }
      })
    });

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("Groq interpretation failed", response.status, result?.error?.message || "unknown error");
      return json({ error: "Command interpretation is temporarily unavailable." }, 503);
    }
    const raw = result?.choices?.[0]?.message?.content;
    if (typeof raw !== "string" || !raw.trim()) return json({ error: "The language model returned no interpretation." }, 502);
    let parsed;
    try { parsed = JSON.parse(raw); } catch (_) { return json({ error: "The language model returned invalid JSON." }, 502); }
    return json(sanitizeGroqInterpretation(parsed));
  } catch (error) {
    console.error("Groq command interpretation failed", error?.name || error);
    return json({ error: "Command interpretation is temporarily unavailable." }, 503);
  } finally {
    clearTimeout(timer);
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
