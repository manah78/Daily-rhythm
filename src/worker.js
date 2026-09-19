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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
