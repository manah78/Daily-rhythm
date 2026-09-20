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
  if (!value || !Array.isArray(value.operations)) return { intent:'unknown', operations:[] };
  const operations = [];
  for (const raw of value.operations.slice(0, 16)) {
    const action = ['add','delete','edit'].includes(raw?.action) ? raw.action : null;
    if (!action) continue;
    const labelEn = cleanLabel(raw?.labelEn);
    const labelAr = cleanLabel(raw?.labelAr);
    if (!labelEn || !labelAr || containsArabic(labelEn) || !containsArabic(labelAr)) continue;
    const op = {
      action,
      labelEn,
      labelAr,
      category: cleanLabel(raw?.category, 40) || 'custom',
      status: raw?.status === 'needs_clarification' ? 'needs_clarification' : 'ready',
      clarification: cleanLabel(raw?.clarification, 160),
      confidence: ['high','medium','low'].includes(raw?.confidence) ? raw.confidence : 'medium'
    };
    const occ = raw?.occurrence;
    if (occ && typeof occ === 'object') {
      if (occ.kind === 'time' && validHHMM(occ.start)) op.occurrence = {kind:'time', start:occ.start};
      else if (occ.kind === 'range' && validHHMM(occ.start) && validHHMM(occ.end)) op.occurrence = {kind:'range', start:occ.start, end:occ.end};
      else if (occ.kind === 'relative') {
        const relation = occ.relation === 'before' ? 'before' : 'after';
        const anchorType = occ.anchorType === 'activity' ? 'activity' : 'prayer';
        const anchor = cleanLabel(occ.anchor, 60);
        if (anchor && (anchorType !== 'prayer' || PRAYER_NAMES.has(anchor))) {
          const n = Number(occ.offsetMinutes);
          op.occurrence = {kind:'relative', relation, anchorType, anchor, offsetMinutes:Math.min(180,Math.max(0,Number.isFinite(n)?n:15))};
        }
      } else if (occ.kind === 'between') {
        const anchor1Type = occ.anchor1Type === 'activity' ? 'activity' : 'prayer';
        const anchor2Type = occ.anchor2Type === 'activity' ? 'activity' : 'prayer';
        const anchor1 = cleanLabel(occ.anchor1, 60);
        const anchor2 = cleanLabel(occ.anchor2, 60);
        const valid1 = anchor1 && (anchor1Type !== 'prayer' || PRAYER_NAMES.has(anchor1));
        const valid2 = anchor2 && (anchor2Type !== 'prayer' || PRAYER_NAMES.has(anchor2));
        if (valid1 && valid2) op.occurrence = {kind:'between', anchor1Type, anchor1, anchor2Type, anchor2};
      }
    }
    const renameEn = cleanLabel(raw?.renameEn), renameAr = cleanLabel(raw?.renameAr);
    if (renameEn && renameAr && !containsArabic(renameEn) && containsArabic(renameAr)) {
      op.renameEn = renameEn; op.renameAr = renameAr;
    }
    operations.push(op);
  }
  return operations.length ? { intent:'operations', operations } : { intent:'unknown', operations:[] };
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

  const schedule = Array.isArray(body?.schedule) ? body.schedule.slice(0, 80).map(x => ({
    labelEn: cleanLabel(x?.labelEn), labelAr: cleanLabel(x?.labelAr), start: validHHMM(x?.start) ? x.start : null
  })).filter(x => x.labelEn && x.labelAr) : [];

  const prompt = `You are the command brain for a bilingual English-Arabic daily planner. A single utterance may contain MANY independent instructions.
Return ONLY valid JSON, no markdown.

Schema:
{"intent":"operations","operations":[{
 "action":"add|delete|edit",
 "labelEn":"English activity",
 "labelAr":"Arabic activity",
 "category":"short category",
 "occurrence":null OR {"kind":"time","start":"HH:MM"} OR {"kind":"range","start":"HH:MM","end":"HH:MM"} OR {"kind":"relative","relation":"after|before","anchorType":"prayer|activity","anchor":"Fajr|Sunrise|Zohr|Asr|Maghrib|Isha|activity label","offsetMinutes":15} OR {"kind":"between","anchor1Type":"prayer|activity","anchor1":"anchor label","anchor2Type":"prayer|activity","anchor2":"anchor label"},
 "renameEn":"", "renameAr":"",
 "status":"ready|needs_clarification",
 "clarification":"short question if needed",
 "confidence":"high|medium|low"
}]}

Rules:
1. FIRST understand the WHOLE utterance. Extract EVERY distinct activity candidate in spoken order before deciding timing. Never collapse a day description into one recognizable activity and never drop later activities because an earlier one is unclear.
2. For each activity candidate, infer action (add/delete/edit) and attach only the timing/relationship that belongs to that activity. Activity recognition has priority over perfect timing: a clear ADD with unclear or missing timing must still be returned with occurrence=null and status=ready.
3. The user is TALKING naturally, not programming a command interface. A list of activities and times can imply ADD without repeating the word add. Example: "start my day with jumping jacks at 7, swimming at 8, breakfast at 10, meeting at 12" means FOUR add operations.
4. Understand Modern Standard Arabic, everyday dialect/slang, English, mixed Arabic-English, and transliterated/Arabizi Arabic activity words. Examples: al-sibaha/as-sibaha/السِباحة/السباحة/Swimming all mean Swimming when context is clear. Code-switching never changes the number of activities.
4. Common ADD signals include أضف/اضف/أضيف/ضيف/حط/حطلي/ضع/سجل/زيد/بدي/عايز/عاوز/أبغى/ابغى/أبي/ابي/ودي when context means putting an activity on the schedule. Examples: "عايز سباحة الساعة 7", "بدي جيم بعد المغرب", "حطلي قراءة".
5. Common DELETE signals include احذف/حدف/امسح/شيل/شيله/ألغي/الغي/بلاش/بلا/ما بدي/مش عايز/خلاص بلا when context clearly rejects/removes an existing scheduled activity. Examples: "ما بدي المشي اليوم", "خلاص بلا جيم", "شيل القراءة".
6. Common EDIT signals include عدل/عدّل/غير/غيّر/بدل/بدّل/حرك/حرّك/خلي/خليها/خلّي/خلّيها. "السباحة خليها عالسبعة" means edit Swimming to 07:00 if Swimming is in the supplied schedule.
7. Do not over-interpret uncertain conversation. If intent or requested change is genuinely ambiguous, use status=needs_clarification, confidence=low, and ask one short natural question. Never invent a destructive action from vague language.
8. Schedule context matters. For delete/edit, identify the intended existing activity semantically, including inflection, dialect and common aliases. The CLIENT still verifies the target before mutation; never claim a target exists if it is absent.
9. Activity synonyms normalize semantically. Examples: سباحة/السباحة/اسبح/al-sibaha/as-sibaha => Swimming/السباحة; مشي/المشي/تمشية/أتمشى/al-mashi => Walking/المشي; قراءة/القراءة/اقرأ/qira'a => Reading/القراءة; جيم/جم/nadi/gym => Gym/الجيم. Preserve specific user labels such as مراجعة العلوم or Work on Daily Rhythm. Unknown but clear activity names are valid; do not replace them with "Custom activity". If the activity name itself is genuinely uncertain, return needs_clarification instead of inventing a label.
10. Code-switching is normal: "حطلي gym بعد المغرب وشيل walking والقراءة خليها 8" is three operations.
11. ADD is complete even with no time: occurrence=null and status=ready. Never discard a recognized activity because timing is incomplete. Never invent an end time. A single time is open-ended. A range exists only when explicitly stated.
12. DELETE needs a target but no time. EDIT with only a target and no requested change needs clarification. EDIT with a new time/range/relative position is ready. Explicit rename fills renameEn/renameAr.
13. Prayer aliases: الظهر=>Zohr, المغرب=>Maghrib, الفجر=>Fajr, العصر=>Asr, العشاء=>Isha, الشروق=>Sunrise. "مباشرة بعد" => offsetMinutes 0; otherwise an unstated before/after offset => 15. Do NOT ask for confirmation merely because timing is prayer-relative.
14. "between A and B" / "بين A و B" uses occurrence.kind="between". Anchors may independently be prayers or scheduled activities. Examples: "reading between Dhuhr and Asr" => between prayer Zohr and prayer Asr; "lunch between Gym and Meeting" => between activity Gym and activity Meeting. Do not require the user to know their clock times.
14. Convert Arabic-Indic numerals and spoken clock wording to 24-hour HH:MM. صباحاً=AM, مساءً=PM. Handle colloquial عالسبعة/عالثمانية etc.
15. CLEAR-DAY phrases such as إلغاء الجدول / امسح جدول اليوم are handled locally and should return unknown here if encountered alone.
16. Set confidence=high for clear intent, medium for reasonable contextual inference, low when clarification is required. Destructive operations inferred only from vague sentiment must be low/needs_clarification.
17. Phrases about completing an activity (خلصت/عملت/done/finished) are NOT delete commands; completion is handled separately by the client.

Examples:
أضيف سباحة، وعدل القراءة، وامحي المشي
=> {"intent":"operations","operations":[{"action":"add","labelEn":"Swimming","labelAr":"السباحة","category":"fitness","occurrence":null,"status":"ready","clarification":""},{"action":"edit","labelEn":"Reading","labelAr":"القراءة","category":"reading","occurrence":null,"status":"needs_clarification","clarification":"ماذا تريد أن تعدّل في القراءة؟"},{"action":"delete","labelEn":"Walking","labelAr":"المشي","category":"fitness","occurrence":null,"status":"ready","clarification":""}]}

أضف السباحة الساعة ٧ مساءً واحذف المشي وغير القراءة للساعة ٨
=> three operations: add Swimming 19:00; delete Walking; edit Reading to 20:00.

Dialect examples:
عايز سباحة الساعة ٧ => add Swimming 07:00.
بدي أسبح الساعة ٧ => add Swimming 07:00.
حطلي gym بعد المغرب => add Gym relative to Maghrib.
ما بدي المشي اليوم => delete Walking, but client verifies it exists.
خلاص بلا قراءة اليوم => delete Reading, but client verifies it exists.
السباحة خليها عالسبعة => edit Swimming to 07:00.
غير السباحة => edit Swimming, needs clarification about what to change.
المشي مش عارف => ambiguous; needs clarification, do not delete.
حطلي gym بعد المغرب، وشيل المشي، والقراءة خليها 8 => add Gym; delete Walking; edit Reading to 08:00.

English day-description examples:
start my day with jumping jacks at 7 AM, swimming at 8 AM, breakfast at 10 AM, meeting at 12 PM => FOUR add operations with 07:00, 08:00, 10:00, 12:00.
Add swimming, breakfast, reading and sleep => FOUR add operations; no time is required.
Add reading between Dhuhr and Asr => one add with kind=between, prayer Zohr, prayer Asr.
Add lunch between Gym and Meeting => one add with kind=between, activity Gym, activity Meeting.
Add al-sibaha at 7 and بعدين breakfast at 9 => TWO add operations: Swimming 07:00 and Breakfast 09:00.
أضف السباحة بعد صلاة الظهر => add Swimming relative after Zohr offsetMinutes 15, ready; no confirmation.

Current schedule (reference only; never invent entries): ${JSON.stringify(schedule)}
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
