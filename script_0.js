
  const CX = 420, CY = 420;
  const R_OUT = 306, R_IN = 254;
  const TICK_MINOR_OUT = 321, TICK_MAJOR_OUT = 337;
  const NUM_R = 333;
  const HAND_LEN = 296, HAND_TAIL = 36, HAND_W = 9;
  const KNOB_R = 12;
  const BADGE_R = 324, BADGE_W = 174, BADGE_H = 48, BADGE_CENTER_Y = CY + 112;

  // ---- Bilingual support (English / Arabic) ----
  const LANG_KEY = "dailyRhythmLang_v1";
  let currentLang = 'en';
  try { currentLang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { /* default en */ }

  const STRINGS = {
    en: {
      langToggleLabel: "عربي",
      navClock: "Clock", navSchedule: "My Day", navLogs: "History", navVoice: "Voice", navSettings: "Settings",
      settingsTitle: "Settings", settingsAppearance: "Appearance", settingsTheme: "Theme", settingsLanguage: "Language",
      themeAuto: "Auto", themeDay: "Day", themeNight: "Night", settingsMoon: "Moon", moonShow: "Show moon on clock", moonPosition: "Moon position",
      moonPositionAuto: "Follow phase", moonTopRight: "Top right", moonTopLeft: "Top left", moonBottomRight: "Bottom right", moonBottomLeft: "Bottom left",
      settingsPrayerReminders: "Prayer & reminders", aboutTitle: "About Daily Rhythm",
      aboutCopy: "Daily Rhythm turns your day into a glanceable clock. See what you are doing now, what is next, prayer times, and the moon phase, while adding or changing several activities naturally in English or Arabic. The goal is to reduce planning friction and help you stay present in your day — not manage another complicated calendar.",
      versionLabel: "Version", buildLabel: "Build", channelLabel: "Channel", productionChannel: "Production",
      todayRhythm: "Today's rhythm",
      suggestionsTitle: "Activities not in the list",
      resetBtn: "Reset to default schedule",
      enableReminders: "Enable lock-screen reminders",
      prayerLocationTitle: "Prayer times", prayerUseCurrent: "Use current location", prayerChooseCity: "Choose city",
      prayerCheckingLocation: "Checking location…", prayerAutomatic: "Automatic", prayerDefaultLocation: "Default location", prayerLocationDenied: "Location unavailable — choose your city",
      prayerCityPrompt: "Enter your city for prayer times", prayerCityNotFound: "City not found. Try city + country.", prayerCityError: "Could not look up that city right now.",
      activityLogTitle: "Activity log",
      logSearchPlaceholder: 'Search logs — e.g. "fajr" or "gym"',
      filterAll: "All", filterAdd: "Add", filterEdit: "Edit", filterDelete: "Delete", filterActivity: "Activity",
      talkTitle: "Talk to your schedule",
      commandPlaceholder: 'Write what to add, change, remove, or report. You can include more than one request.',
      commandEditHint: 'Type one request or several, then review before sending.',
      commandLabel: "Add or update activities",
      sendBtn: "Go",
      commandStatusDefault: "Use your own words — one request or many.",
      examplesSummary: "Examples",
      examplesNote: 'It only recognizes an activity already sitting in "Today\'s rhythm" — add it first with an "add" command if it\'s not there yet.',
      nextLabel: "Next", inLabel: "in",
      nowLabel: "Now", upNextLabel: "Up next",
      swipeHint: "‹ swipe for Schedule, Logs, Voice ›",
      tapHint: "Tap the center label to mark the current activity done",
      quickNowLabel: "Right now",
      markDone: "Mark done",
      moonSightingLabel: "Tonight's moon",
      moonPhaseNames: ["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"],
      close: "Close",
      freeTime: "Free time", addToSchedule: "Add to schedule", ignore: "Ignore",
      noLogMatches: "No log entries match that.", noLogs: "Nothing logged yet.",
    },
    ar: {
      langToggleLabel: "English",
      navClock: "الساعة", navSchedule: "يومي", navLogs: "السجل", navVoice: "الصوت", navSettings: "الإعدادات",
      settingsTitle: "الإعدادات", settingsAppearance: "المظهر", settingsTheme: "النمط", settingsLanguage: "اللغة",
      themeAuto: "تلقائي", themeDay: "نهاري", themeNight: "ليلي", settingsMoon: "القمر", moonShow: "إظهار القمر على الساعة", moonPosition: "موضع القمر",
      moonPositionAuto: "يتبع طور القمر", moonTopRight: "أعلى اليمين", moonTopLeft: "أعلى اليسار", moonBottomRight: "أسفل اليمين", moonBottomLeft: "أسفل اليسار",
      settingsPrayerReminders: "الصلاة والتذكيرات", aboutTitle: "عن Daily Rhythm",
      aboutCopy: "يحوّل Daily Rhythm يومك إلى ساعة سهلة الفهم بنظرة واحدة. ترى ما تفعله الآن، وما يأتي بعده، ومواقيت الصلاة، وطور القمر، ويمكنك إضافة أو تعديل عدة أنشطة بشكل طبيعي بالعربية أو الإنجليزية. الهدف هو تقليل عبء التخطيط ومساعدتك على الحضور في يومك بدل إدارة تقويم معقد آخر.",
      versionLabel: "الإصدار", buildLabel: "البناء", channelLabel: "القناة", productionChannel: "الإنتاج",
      todayRhythm: "إيقاع اليوم",
      suggestionsTitle: "أنشطة غير مدرجة",
      resetBtn: "إعادة ضبط الجدول الافتراضي",
      enableReminders: "تفعيل تذكيرات شاشة القفل",
      prayerLocationTitle: "مواقيت الصلاة", prayerUseCurrent: "استخدم موقعي الحالي", prayerChooseCity: "اختر المدينة",
      prayerCheckingLocation: "جارٍ التحقق من الموقع…", prayerAutomatic: "تلقائي", prayerDefaultLocation: "الموقع الافتراضي", prayerLocationDenied: "الموقع غير متاح — اختر مدينتك",
      prayerCityPrompt: "أدخل مدينتك لمواقيت الصلاة", prayerCityNotFound: "لم يتم العثور على المدينة. جرّب المدينة + الدولة.", prayerCityError: "تعذر البحث عن المدينة الآن.",
      activityLogTitle: "سجل النشاط",
      logSearchPlaceholder: 'ابحث في السجل — مثال "الفجر" أو "الجيم"',
      filterAll: "الكل", filterAdd: "إضافة", filterEdit: "تعديل", filterDelete: "حذف", filterActivity: "نشاط",
      talkTitle: "تحدث إلى جدولك",
      commandPlaceholder: 'اكتب ما تريد إضافته أو تعديله أو حذفه أو تسجيله. يمكنك إدخال أكثر من طلب معًا.',
      commandEditHint: 'اكتب طلبًا واحدًا أو عدة طلبات ثم راجعها قبل الإرسال.',
      commandLabel: "أضف أو حدّث الأنشطة",
      sendBtn: "إرسال",
      commandStatusDefault: "استخدم كلماتك — طلب واحد أو عدة طلبات.",
      examplesSummary: "أمثلة",
      examplesNote: 'يتعرف فقط على نشاط موجود بالفعل في "إيقاع اليوم" — أضفه أولاً بأمر "أضف" إذا لم يكن موجوداً.',
      nextLabel: "التالي", inLabel: "خلال",
      nowLabel: "الآن", upNextLabel: "القادم",
      swipeHint: "› اسحب لعرض الجدول والسجل والصوت ‹",
      tapHint: "اضغط على التسمية في وسط الساعة لتسجيلها كمكتملة",
      quickNowLabel: "الآن",
      markDone: "تسجيل كمكتمل",
      moonSightingLabel: "قمر الليلة",
      moonPhaseNames: ["محاق","هلال متزايد","تربيع أول","أحدب متزايد","بدر","أحدب متناقص","تربيع أخير","هلال متناقص"],
      close: "إغلاق",
      freeTime: "وقت فارغ", addToSchedule: "أضف إلى الجدول", ignore: "تجاهل",
      noLogMatches: "لا توجد سجلات مطابقة.", noLogs: "لا يوجد نشاط مسجل بعد.",
    }
  };

  const BLOCK_LABELS_AR = {
    "Sleep": "نوم", "Call home": "اتصال بالعائلة", "Gym": "النادي الرياضي",
    "Work (home)": "العمل (من المنزل)", "Lunch": "الغداء", "Walk": "المشي",
    "App development": "تطوير التطبيق", "Qur'an & reading": "القرآن والقراءة",
    "Job search / swim": "البحث عن عمل / السباحة", "Wind down": "الاسترخاء",
  };
  const PRAYER_LABELS_AR = { Fajr: "الفجر", Sunrise: "الشروق", Zohr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" };
  const NOTES_AR = {
    "Sleep": "نوم هنيء.", "Call home": "سلم لي عليهم.", "Gym": "تمرين تلو الآخر.",
    "Work (home)": "تركيز ثابت.", "Lunch": "خذ استراحة وكل فعلاً.", "Walk": "هواء نقي، ذهن صافٍ.",
    "App development": "تبني شيئاً حقيقياً.", "Qur'an & reading": "لحظة هدوء وتأمل.",
    "Job search / swim": "استمر، كل خطوة تُحتسب.", "Wind down": "دع اليوم يهدأ.",
  };
  const TYPE_LABELS_AR = { Add: "إضافة", Edit: "تعديل", Delete: "حذف", Activity: "نشاط", Dismiss: "تجاهل" };

  // Every scheduled activity keeps both language versions. `label` remains the
  // canonical English value for backwards compatibility with matching/synonyms.
  const ACTIVITY_TRANSLATIONS = {
    "Sleep":"نوم", "Call home":"اتصال بالعائلة", "Gym":"النادي الرياضي", "Work (home)":"العمل (من المنزل)",
    "Lunch":"الغداء", "Walk":"المشي", "App development":"تطوير التطبيق", "Qur'an & reading":"القرآن والقراءة",
    "Job search / swim":"البحث عن عمل / السباحة", "Wind down":"الاسترخاء", "Swimming":"السباحة", "Swim":"السباحة",
    "Cooking":"الطبخ", "Cook":"الطبخ", "Reading":"القراءة", "Study":"الدراسة", "Studying":"الدراسة",
    "Work":"العمل", "Meeting":"اجتماع", "School":"المدرسة", "Homework":"الواجبات", "Breakfast":"الفطور",
    "Dinner":"العشاء", "Snack":"وجبة خفيفة", "Run":"الجري", "Running":"الجري", "Jog":"الهرولة",
    "Cycling":"ركوب الدراجة", "Bike":"ركوب الدراجة", "Prayer":"الصلاة", "Qur'an":"القرآن", "Family":"العائلة",
    "Family time":"وقت العائلة", "Call":"مكالمة", "Appointment":"موعد", "Doctor":"الطبيب", "Shopping":"التسوق",
    "Groceries":"شراء البقالة", "Cleaning":"التنظيف", "Clean":"التنظيف", "Laundry":"الغسيل", "Shower":"الاستحمام",
    "Rest":"الراحة", "Relax":"الاسترخاء", "Meditation":"التأمل", "Coffee":"قهوة", "Commute":"التنقل",
    "Drive":"القيادة", "Driving":"القيادة", "Job search":"البحث عن عمل", "Coding":"البرمجة", "Programming":"البرمجة",
    "Practice":"التدريب", "Training":"التدريب", "Hockey":"الهوكي", "Soccer":"كرة القدم", "Football":"كرة القدم"
  };
  const ACTIVITY_TRANSLATIONS_AR_TO_EN = Object.fromEntries(Object.entries(ACTIVITY_TRANSLATIONS).map(([en, ar]) => [ar, en]));
  const ACTIVITY_WORDS_EN_AR = {
    add:'إضافة', work:'العمل', home:'المنزل', job:'عمل', search:'البحث', swim:'السباحة', swimming:'السباحة', cook:'الطبخ', cooking:'الطبخ',
    read:'القراءة', reading:'القراءة', study:'الدراسة', studying:'الدراسة', gym:'النادي الرياضي', walk:'المشي', run:'الجري', running:'الجري',
    lunch:'الغداء', breakfast:'الفطور', dinner:'العشاء', prayer:'الصلاة', family:'العائلة', call:'مكالمة', meeting:'اجتماع', school:'المدرسة',
    homework:'الواجبات', shopping:'التسوق', cleaning:'التنظيف', laundry:'الغسيل', shower:'الاستحمام', rest:'الراحة', relax:'الاسترخاء',
    coding:'البرمجة', development:'التطوير', app:'التطبيق', appointment:'موعد', doctor:'الطبيب', coffee:'قهوة', drive:'القيادة', driving:'القيادة'
  };
  function containsArabicText(v) { return /[\u0600-\u06FF]/.test(String(v || '')); }

  const ACTIVITY_TRANSLATION_CACHE_KEY = 'dailyRhythmActivityTranslations_v1';

  function normalizeArabicText(v) {
    return String(v || '')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'')
      .replace(/\u0640/g,'')
      .replace(/[أإآ]/g,'ا')
      .replace(/ى/g,'ي')
      .replace(/ة/g,'ه')
      .replace(/\s+/g,' ')
      .trim();
  }

  const ACTIVITY_CANONICAL_ALIASES = {
    Lunch: { en:['lunch','midday meal'], ar:['الغداء','غداء','الغدا'] },
    Breakfast: { en:['breakfast'], ar:['الفطور','الفطار','افطار','الإفطار'] },
    Dinner: { en:['dinner','supper','evening meal'], ar:['العشاء','عشاء','العشا'] },
    Study: { en:['study','studying'], ar:['الدراسة','دراسة','المذاكرة','مذاكرة'] },
    Reading: { en:['reading','read'], ar:['القراءة','قراءة'] },
    Gym: { en:['gym','workout','exercise','fitness'], ar:['الجيم','النادي الرياضي','النادي','تمرين','تمارين','الرياضة'] },
    Walk: { en:['walk','walking','stroll'], ar:['المشي','مشي','المشية'] },
    Work: { en:['work','job'], ar:['العمل','الشغل','الدوام','دوام'] },
    School: { en:['school'], ar:['المدرسة','مدرسة'] },
    Meeting: { en:['meeting'], ar:['اجتماع','الاجتماع'] },
    Appointment: { en:['appointment'], ar:['موعد','الموعد'] },
    Doctor: { en:['doctor','doctor appointment'], ar:['الطبيب','دكتور','موعد الطبيب'] },
    Groceries: { en:['groceries','grocery shopping'], ar:['البقالة','شراء البقالة','مشتريات البيت'] },
    Shopping: { en:['shopping'], ar:['التسوق','تسوق'] },
    Swimming: { en:['swimming','swim'], ar:['السباحة','سباحة'] },
    Run: { en:['run','running','jog','jogging'], ar:['الجري','جري','الركض','ركض'] },
    Coding: { en:['coding','programming'], ar:['البرمجة','برمجة'] },
    Prayer: { en:['prayer'], ar:['الصلاة','صلاة'] },
    "Qur'an": { en:['quran',"qur'an",'koran'], ar:['القرآن','قران','قرآن'] },
    "Family time": { en:['family time'], ar:['وقت العائلة','وقت الأسرة'] },
    Call: { en:['call','phone call'], ar:['مكالمة','اتصال'] },
    Rest: { en:['rest'], ar:['الراحة','راحة'] },
    Coffee: { en:['coffee'], ar:['قهوة','القهوة'] },
    Commute: { en:['commute'], ar:['التنقل','المواصلات'] },
    Drive: { en:['drive','driving'], ar:['القيادة','قيادة'] },
    Hockey: { en:['hockey'], ar:['الهوكي'] },
    Soccer: { en:['soccer','football'], ar:['كرة القدم','الكورة'] }
  };

  const ACTIVITY_ALIAS_LOOKUP = (() => {
    const map = new Map();
    const add = (key, value) => map.set(value, key);
    for (const [key, aliases] of Object.entries(ACTIVITY_CANONICAL_ALIASES)) {
      add(key, key.toLowerCase());
      for (const a of aliases.en || []) add(key, String(a).toLowerCase().trim());
      for (const a of aliases.ar || []) add(key, normalizeArabicText(a));
    }
    for (const [en, ar] of Object.entries(ACTIVITY_TRANSLATIONS)) {
      add(en, en.toLowerCase());
      add(en, normalizeArabicText(ar));
    }
    return map;
  })();

  function canonicalActivityKey(name) {
    const raw = String(name || '').trim();
    if (!raw) return '';
    return containsArabicText(raw)
      ? (ACTIVITY_ALIAS_LOOKUP.get(normalizeArabicText(raw)) || '')
      : (ACTIVITY_ALIAS_LOOKUP.get(raw.toLowerCase()) || '');
  }

  function canonicalActivityPair(name) {
    const key = canonicalActivityKey(name);
    if (!key) return null;
    const labelEn = titleCaseActivity(key);
    const labelAr = ACTIVITY_TRANSLATIONS[key]
      || ACTIVITY_CANONICAL_ALIASES[key]?.ar?.[0]
      || '';
    return labelAr ? { activityKey:key, label:labelEn, labelEn, labelAr } : null;
  }

  function loadCachedActivityTranslations() {
    try { return JSON.parse(localStorage.getItem(ACTIVITY_TRANSLATION_CACHE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }
  function cacheActivityTranslation(source, pair) {
    if (!source || !pair?.labelEn || !pair?.labelAr) return;
    try {
      const cache = loadCachedActivityTranslations();
      cache[String(source).trim()] = { labelEn:pair.labelEn, labelAr:pair.labelAr, activityKey:pair.activityKey || '' };
      localStorage.setItem(ACTIVITY_TRANSLATION_CACHE_KEY, JSON.stringify(cache));
    } catch (_) {}
  }
  function cachedActivityPair(source) {
    const raw = String(source || '').trim();
    if (!raw) return null;
    const cache = loadCachedActivityTranslations();
    const hit = cache[raw];
    return hit?.labelEn && hit?.labelAr
      ? { activityKey:hit.activityKey || '', label:hit.labelEn, labelEn:hit.labelEn, labelAr:hit.labelAr }
      : null;
  }

  /*
   * AI translation adapter
   * ----------------------
   * The browser never contains a model/API secret.
   * The default same-origin endpoint is /api/translate; a Cloudflare Worker/server
   * can implement that endpoint and call the chosen model securely.
   *
   * Request:
   *   POST /api/translate
   *   { text, sourceLang:"en"|"ar", targetLang:"ar"|"en",
   *     context:"daily-rhythm-activity-label", maxWords:12 }
   *
   * Expected response:
   *   { translation:"..." }
   * or
   *   { labelEn:"...", labelAr:"..." }
   *
   * A deployment can override this before app startup:
   *   window.DAILY_RHYTHM_AI_TRANSLATION = {
   *     enabled:true,
   *     endpoint:"/api/translate"
   *   };
   */
  const AI_TRANSLATION_CONFIG = Object.assign({
    enabled: true,
    endpoint: '/api/translate',
    timeoutMs: 5500,
    retryCooldownMs: 10 * 60 * 1000
  }, window.DAILY_RHYTHM_AI_TRANSLATION || {});

  const aiTranslationInFlight = new Map();
  const aiTranslationFailures = new Map();

  function cleanAiActivityTranslation(value, targetLang) {
    let out = String(value || '').trim()
      .replace(/^["'“”‘’]+|["'“”‘’]+$/g,'')
      .replace(/\s+/g,' ')
      .slice(0,80);
    if (!out) return '';
    if (targetLang === 'en' && containsArabicText(out)) return '';
    if (targetLang === 'ar' && !containsArabicText(out)) return '';
    return out;
  }

  async function requestAiActivityTranslation(textValue, sourceLang, targetLang) {
    const source = String(textValue || '').trim();
    if (!AI_TRANSLATION_CONFIG.enabled || !source) return '';
    if (!navigator.onLine) return '';

    const key = `${sourceLang}>${targetLang}:${source}`;
    const failureAt = Number(aiTranslationFailures.get(key) || 0);
    if (failureAt && Date.now() - failureAt < AI_TRANSLATION_CONFIG.retryCooldownMs) return '';
    if (aiTranslationInFlight.has(key)) return aiTranslationInFlight.get(key);

    const task = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), AI_TRANSLATION_CONFIG.timeoutMs);
      try {
        const res = await fetch(AI_TRANSLATION_CONFIG.endpoint, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          credentials: 'same-origin',
          signal: controller.signal,
          body: JSON.stringify({
            text: source,
            sourceLang,
            targetLang,
            context: 'daily-rhythm-activity-label',
            maxWords: 12
          })
        });
        if (!res.ok) throw new Error(`translation endpoint ${res.status}`);
        const data = await res.json();
        const candidate = targetLang === 'en'
          ? (data.labelEn || data.translation)
          : (data.labelAr || data.translation);
        const cleaned = cleanAiActivityTranslation(candidate, targetLang);
        if (!cleaned) throw new Error('invalid translation payload');
        aiTranslationFailures.delete(key);
        return cleaned;
      } catch (_) {
        aiTranslationFailures.set(key, Date.now());
        return '';
      } finally {
        clearTimeout(timer);
        aiTranslationInFlight.delete(key);
      }
    })();

    aiTranslationInFlight.set(key, task);
    return task;
  }

  function needsAiEnglish(labelEn, labelAr) {
    return !!labelAr && containsArabicText(labelAr)
      && (!labelEn || labelEn === 'Custom activity' || containsArabicText(labelEn));
  }

  function needsAiArabic(labelEn, labelAr) {
    return !!labelEn && !containsArabicText(labelEn)
      && (!labelAr || labelAr === 'نشاط مخصص' || !containsArabicText(labelAr));
  }

  async function enrichActivityPairWithAI(holder, persistFn) {
    if (!holder || holder.activityKey) return false;

    let changed = false;
    if (needsAiEnglish(holder.labelEn, holder.labelAr)) {
      const translated = await requestAiActivityTranslation(holder.labelAr, 'ar', 'en');
      if (translated) {
        holder.labelEn = translated;
        holder.label = translated;
        changed = true;
      }
    } else if (needsAiArabic(holder.labelEn, holder.labelAr)) {
      const translated = await requestAiActivityTranslation(holder.labelEn, 'en', 'ar');
      if (translated) {
        holder.labelAr = translated;
        changed = true;
      }
    }

    if (changed) {
      cacheActivityTranslation(holder.labelEn && holder.labelEn !== 'Custom activity' ? holder.labelEn : holder.labelAr, {
        activityKey: holder.activityKey || '',
        labelEn: holder.labelEn,
        labelAr: holder.labelAr
      });
      try { persistFn?.(); } catch (_) {}
      return true;
    }
    return false;
  }

  let aiTranslationScanTimer = null;
  function scheduleAiTranslationScan(delay = 350) {
    clearTimeout(aiTranslationScanTimer);
    aiTranslationScanTimer = setTimeout(async () => {
      let changed = false;

      for (const b of blocks || []) {
        if (await enrichActivityPairWithAI(b, saveBlocks)) changed = true;
      }

      if (typeof recurringSeries !== 'undefined' && Array.isArray(recurringSeries)) {
        for (const s of recurringSeries) {
          if (await enrichActivityPairWithAI(s, saveRecurringSeries)) changed = true;
        }
      }

      if (changed) {
        try { renderAll(); } catch (_) {}
      }
    }, delay);
  }

  window.addEventListener('online', () => scheduleAiTranslationScan(200));
  function titleCaseActivity(v) { return String(v || '').trim().replace(/\s+/g,' ').replace(/^./, c => c.toUpperCase()); }
  function translateActivityToArabic(name) {
    const clean = String(name || '').trim();
    if (!clean) return '';
    if (containsArabicText(clean)) return clean;
    const canonical = canonicalActivityPair(clean) || cachedActivityPair(clean);
    if (canonical?.labelAr) return canonical.labelAr;
    const exact = ACTIVITY_TRANSLATIONS[clean] || ACTIVITY_TRANSLATIONS[titleCaseActivity(clean)];
    if (exact) return exact;
    const words = clean.split(/(\s+|[\/&,()+-])/);
    let changed = false;
    const out = words.map(part => {
      const key = part.toLowerCase().replace(/[^a-z']/g,'');
      if (key && ACTIVITY_WORDS_EN_AR[key]) { changed = true; return ACTIVITY_WORDS_EN_AR[key]; }
      return part;
    }).join('').replace(/\s+/g,' ').trim();
    return changed ? out : '';
  }

  const ACTIVITY_WORDS_AR_EN = {
    'غداء':'Lunch','الغداء':'Lunch','الغدا':'Lunch',
    'فطور':'Breakfast','الفطور':'Breakfast','افطار':'Breakfast','الإفطار':'Breakfast',
    'عشاء':'Dinner','العشاء':'Dinner',
    'دراسة':'Study','الدراسة':'Study','مذاكرة':'Study','المذاكرة':'Study',
    'قراءة':'Reading','القراءة':'Reading',
    'جيم':'Gym','الجيم':'Gym','النادي':'Gym','تمرين':'Gym','تمارين':'Gym','الرياضة':'Gym',
    'مشي':'Walk','المشي':'Walk','عمل':'Work','العمل':'Work','الشغل':'Work','دوام':'Work',
    'مدرسة':'School','المدرسة':'School','اجتماع':'Meeting','موعد':'Appointment',
    'طبيب':'Doctor','الطبيب':'Doctor','دكتور':'Doctor','تسوق':'Shopping','التسوق':'Shopping',
    'سباحة':'Swimming','السباحة':'Swimming','جري':'Run','الجري':'Run','ركض':'Run',
    'برمجة':'Coding','البرمجة':'Coding','صلاة':'Prayer','الصلاة':'Prayer',
    'قرآن':"Qur'an",'القرآن':"Qur'an",'مكالمة':'Call','اتصال':'Call','راحة':'Rest','الراحة':'Rest',
    'قهوة':'Coffee','القهوة':'Coffee','قيادة':'Drive','القيادة':'Drive'
  };

  function translateActivityToEnglish(name) {
    const clean = String(name || '').trim();
    if (!clean) return '';
    if (!containsArabicText(clean)) return titleCaseActivity(clean);
    const canonical = canonicalActivityPair(clean) || cachedActivityPair(clean);
    if (canonical?.labelEn) return canonical.labelEn;
    const exact = ACTIVITY_TRANSLATIONS_AR_TO_EN[clean];
    if (exact) return exact;
    const parts = clean.split(/(\s+|[\/&,()+-])/);
    let changed = false;
    const out = parts.map(part => {
      const norm = normalizeArabicText(part);
      const hit = ACTIVITY_WORDS_AR_EN[part] || ACTIVITY_WORDS_AR_EN[norm];
      if (hit) { changed = true; return hit; }
      return part;
    }).join(' ').replace(/\s+/g,' ').trim();
    return changed && !containsArabicText(out) ? titleCaseActivity(out) : '';
  }

  function makeActivityPair(name, sourceLang = currentLang) {
    const clean = String(name || '').trim().slice(0,80);
    const canonical = canonicalActivityPair(clean) || cachedActivityPair(clean);
    if (canonical) {
      cacheActivityTranslation(clean, canonical);
      return canonical;
    }

    if (sourceLang === 'ar' || containsArabicText(clean)) {
      const labelAr = clean;
      const labelEn = translateActivityToEnglish(clean).slice(0,80);
      const pair = {
        activityKey:'',
        label: labelEn || 'Custom activity',
        labelEn: labelEn || 'Custom activity',
        labelAr
      };
      if (labelEn) cacheActivityTranslation(clean, pair);
      return pair;
    }

    const labelEn = titleCaseActivity(clean).slice(0,80);
    const labelAr = translateActivityToArabic(labelEn).slice(0,80);
    const pair = {
      activityKey:'',
      label: labelEn,
      labelEn,
      labelAr: labelAr || 'نشاط مخصص'
    };
    if (labelAr) cacheActivityTranslation(clean, pair);
    return pair;
  }

  function ensureActivityPair(block, fallback = '') {
    const rawEn = String(block.labelEn || block.label || fallback || '').trim().slice(0,80);
    const rawAr = String(block.labelAr || '').trim().slice(0,80);
    const pair = rawAr
      ? { label: rawEn || translateActivityToEnglish(rawAr), labelEn: rawEn || translateActivityToEnglish(rawAr), labelAr: rawAr }
      : makeActivityPair(rawEn || fallback, containsArabicText(rawEn) ? 'ar' : 'en');
    block.label = pair.labelEn;
    block.labelEn = pair.labelEn;
    block.labelAr = pair.labelAr;
    return block;
  }
  function blockDisplayLabel(value) {
    if (value && typeof value === 'object') {
      ensureActivityPair(value);
      if (currentLang === 'ar') {
        const ar = value.labelAr || translateActivityToArabic(value.labelEn || value.label);
        return ar && containsArabicText(ar) ? ar : 'نشاط مخصص';
      }
      const en = value.labelEn || translateActivityToEnglish(value.labelAr) || value.label;
      return en && !containsArabicText(en) ? en : 'Custom activity';
    }
    const label = String(value || '');
    if (currentLang === 'ar') {
      const ar = BLOCK_LABELS_AR[label] || ACTIVITY_TRANSLATIONS[label] || translateActivityToArabic(label);
      return ar && containsArabicText(ar) ? ar : 'نشاط مخصص';
    }
    const en = containsArabicText(label) ? translateActivityToEnglish(label) : label;
    return en && !containsArabicText(en) ? en : 'Custom activity';
  }
  function prayerDisplayLabel(label) { return (currentLang === 'ar' && PRAYER_LABELS_AR[label]) ? PRAYER_LABELS_AR[label] : label; }
  function noteDisplay(label) { return currentLang === 'ar' ? (NOTES_AR[label] || "") : (notes[label] || ""); }
  function typeDisplayLabel(type) { return (currentLang === 'ar' && TYPE_LABELS_AR[type]) ? TYPE_LABELS_AR[type] : type; }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function normalizeHour(t) {
    t = Number(t);
    return Number.isFinite(t) ? ((t % 24) + 24) % 24 : 0;
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    // Only flip text-content areas to RTL — the screen carousel and bottom
    // nav must stay LTR internally or the swipe/transform math breaks.
    document.querySelectorAll('.stage, .sheet-body, .quick-sheet').forEach(el => { el.dir = currentLang === 'ar' ? 'rtl' : 'ltr'; });
    const S = STRINGS[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => { if (S[el.dataset.i18n]) el.textContent = S[el.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { if (S[el.dataset.i18nPlaceholder]) el.placeholder = S[el.dataset.i18nPlaceholder]; });
    const langButtonLabel = document.getElementById('langButtonLabel');
    if (langButtonLabel) langButtonLabel.textContent = currentLang === 'en' ? 'العربية' : 'English';
    const langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.setAttribute('aria-label', currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English');
    const statusEl = document.getElementById('commandStatus');
    if (statusEl && (statusEl.textContent === STRINGS.en.commandStatusDefault || statusEl.textContent === STRINGS.ar.commandStatusDefault)) {
      statusEl.textContent = S.commandStatusDefault;
      statusEl.classList.add('is-default');
    }
    const prayerLocationTitle = document.getElementById('prayerLocationTitle');
    const prayerUseCurrent = document.getElementById('prayerUseCurrent');
    const prayerChooseCity = document.getElementById('prayerChooseCity');
    if (prayerLocationTitle) prayerLocationTitle.textContent = S.prayerLocationTitle;
    if (prayerUseCurrent) prayerUseCurrent.textContent = S.prayerUseCurrent;
    if (prayerChooseCity) prayerChooseCity.textContent = S.prayerChooseCity;
    if (typeof updatePrayerLocationUI === 'function') updatePrayerLocationUI();
    if (typeof syncSettingsUI === 'function') syncSettingsUI();
    renderAll();
    renderPrayerMarkers();
    renderLogs();
    renderSuggestions();
  }


  // Live prayer time calculation (sun-angle method, ISNA convention:
  // Fajr/Isha 15°, Asr Standard/Shafii). Prayer times follow the user's
  // coordinates plus the appropriate timezone. A visible Montreal fallback
  // is retained only until the user grants location or chooses a city.
  const DEFAULT_PRAYER_LOCATION = { lat: 45.449, lng: -73.855, name: 'Montréal', timezone: 'America/Toronto', mode: 'default' };
  const PRAYER_LOCATION_KEY = 'dailyRhythmPrayerLocation_v1';
  let prayerLocation = { ...DEFAULT_PRAYER_LOCATION };

  function deviceTimeZone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; }
  }
  function loadPrayerLocation() {
    try {
      const raw = localStorage.getItem(PRAYER_LOCATION_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (Number.isFinite(saved.lat) && Number.isFinite(saved.lng)) prayerLocation = { ...DEFAULT_PRAYER_LOCATION, ...saved };
    } catch (e) { /* keep fallback */ }
  }
  function savePrayerLocation() {
    try { localStorage.setItem(PRAYER_LOCATION_KEY, JSON.stringify(prayerLocation)); } catch (e) { /* unavailable */ }
  }
  loadPrayerLocation();

  function partsInTimeZone(date, timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'
      }).formatToParts(date);
      const out = {};
      for (const part of parts) if (part.type !== 'literal') out[part.type] = Number(part.value);
      return out;
    } catch (e) {
      return { year:date.getFullYear(), month:date.getMonth()+1, day:date.getDate(), hour:date.getHours(), minute:date.getMinutes(), second:date.getSeconds() };
    }
  }
  function timezoneOffsetHours(date, timeZone) {
    const p = partsInTimeZone(date, timeZone);
    const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second || 0);
    return (asUTC - date.getTime()) / 3600000;
  }

  function julianDate(year, month, day) {
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  }
  function fixAngle(a) { a = a - 360 * Math.floor(a / 360); return a < 0 ? a + 360 : a; }
  function fixHour(h) { h = h - 24 * Math.floor(h / 24); return h < 0 ? h + 24 : h; }
  function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D);
    const q = fixAngle(280.459 + 0.98564736 * D);
    const L = fixAngle(q + 1.915 * Math.sin(g * Math.PI/180) + 0.020 * Math.sin(2 * g * Math.PI/180));
    const e = 23.439 - 0.00000036 * D;
    const RA = (180/Math.PI) * Math.atan2(Math.cos(e*Math.PI/180) * Math.sin(L*Math.PI/180), Math.cos(L*Math.PI/180)) / 15;
    const eqt = q/15 - fixHour(RA);
    const decl = (180/Math.PI) * Math.asin(Math.sin(e*Math.PI/180) * Math.sin(L*Math.PI/180));
    return { decl, eqt };
  }
  function deltaT(angleDeg, lat, decl) {
    const num = -Math.sin(angleDeg*Math.PI/180) - Math.sin(lat*Math.PI/180)*Math.sin(decl*Math.PI/180);
    const den = Math.cos(lat*Math.PI/180) * Math.cos(decl*Math.PI/180);
    const val = Math.max(-1, Math.min(1, num/den));
    return (180/Math.PI) * Math.acos(val) / 15;
  }
  function asrAltitudeDeg(factor, lat, decl) {
    const diff = Math.abs(lat - decl);
    const t = factor + Math.tan(diff*Math.PI/180);
    return (180/Math.PI) * Math.atan(1/t);
  }
  function computePrayerTimes(date, lat, lng, timeZone = deviceTimeZone()) {
    const local = partsInTimeZone(date, timeZone);
    const jd = julianDate(local.year, local.month, local.day);
    const { decl, eqt } = sunPosition(jd + 0.5 - lng/360);
    const tzOffset = timezoneOffsetHours(date, timeZone);
    const dhuhr = 12 - eqt - lng/15 + tzOffset;
    const fajr = dhuhr - deltaT(15, lat, decl);
    const sunrise = dhuhr - deltaT(0.833, lat, decl);
    const sunset = dhuhr + deltaT(0.833, lat, decl);
    const isha = dhuhr + deltaT(15, lat, decl);
    const asrAlt = asrAltitudeDeg(1, lat, decl);
    const asr = dhuhr + deltaT(-asrAlt, lat, decl);
    return [
      { time: fajr,    label: "Fajr" },
      { time: sunrise, label: "Sunrise" },
      { time: dhuhr,   label: "Zohr" },
      { time: asr,     label: "Asr" },
      { time: sunset,  label: "Maghrib" },
      { time: isha,    label: "Isha" },
    ];
  }

  // ---- Moon phase (fraction of the 29.53-day synodic month elapsed) ----
  const MOON_PHASE_EMOJI = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  function moonPhaseFraction(date) {
    const jd = julianDate(date.getUTCFullYear(), date.getUTCMonth()+1, date.getUTCDate())
      + (date.getUTCHours() + date.getUTCMinutes()/60) / 24;
    const daysSinceNew = jd - 2451550.1; // known new moon: 2000-01-06 18:14 UTC
    const synodic = 29.53058867;
    let phase = (daysSinceNew / synodic) % 1;
    if (phase < 0) phase += 1;
    return phase;
  }
  function moonPhaseEmoji(date) {
    const phase = moonPhaseFraction(date);
    const idx = Math.floor(((phase + 0.0625) % 1) * 8);
    return MOON_PHASE_EMOJI[idx];
  }
  function moonPhaseIndex(date) {
    const phase = moonPhaseFraction(date);
    return Math.floor(((phase + 0.0625) % 1) * 8);
  }
  function moonIllumination(date) {
    const phase = moonPhaseFraction(date);
    return Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);
  }
  // shift% for the shadow circle over the moon badge, per phase bucket
  // (0 New ... 4 Full ... 7 Waning Crescent)
  const MOON_SHIFT_PCT = [0, -35, -50, -75, -140, 75, 50, 35];

  // ---- Hijri date (tabular civil Islamic calendar — approximate, may be
  // off by a day from local moon-sighting announcements) ----
  const HIJRI_MONTHS_EN = ["Muharram","Safar","Rabi' I","Rabi' II","Jumada I","Jumada II","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];
  const HIJRI_MONTHS_AR = ["محرم","صفر","ربيع الأول","ربيع الآخر","جمادى الأولى","جمادى الآخرة","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة"];
  function julianDayNumber(y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  }
  function gregorianToHijri(date) {
    const jdn = julianDayNumber(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const ISLAMIC_EPOCH = 1948440;
    let l = jdn - ISLAMIC_EPOCH + 10632;
    const n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * l) / 709);
    const day = l - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;
    return { year, month: month - 1, day }; // month: 0-indexed
  }
  function formatHijriDate(date) {
    const h = gregorianToHijri(date);
    const monthName = currentLang === 'ar' ? HIJRI_MONTHS_AR[h.month] : HIJRI_MONTHS_EN[h.month];
    return currentLang === 'ar'
      ? `${h.day} ${monthName} ${h.year} هـ`
      : `${h.day} ${monthName} ${h.year} AH`;
  }

  let prayers = [];
  let lastPrayerDateKey = null;
  const PRAYER_LABELS = ["Fajr", "Sunrise", "Zohr", "Asr", "Maghrib", "Isha"];
  const PRAYER_OVERRIDE_KEY = "dailyRhythmPrayerOverrides_v2";
  let prayerOverrides = {};
  function loadPrayerOverrides() {
    try {
      const raw = localStorage.getItem(PRAYER_OVERRIDE_KEY);
      if (raw) prayerOverrides = JSON.parse(raw);
    } catch (e) { /* none saved */ }
  }
  function savePrayerOverrides() {
    try { localStorage.setItem(PRAYER_OVERRIDE_KEY, JSON.stringify(prayerOverrides)); } catch (e) { /* unavailable */ }
  }
  loadPrayerOverrides();

  function prayerLocationKey(now = new Date()) {
    const tz = prayerLocation.timezone || deviceTimeZone();
    const d = partsInTimeZone(now, tz);
    return `${d.year}-${d.month}-${d.day}|${Number(prayerLocation.lat).toFixed(3)}|${Number(prayerLocation.lng).toFixed(3)}|${tz}`;
  }
  function updatePrayerLocationUI(message = '') {
    const el = document.getElementById('prayerLocationStatus');
    if (!el) return;
    const S = STRINGS[currentLang];
    if (message) { el.textContent = message; return; }
    const tz = prayerLocation.timezone || deviceTimeZone();
    const place = prayerLocation.mode === 'auto' ? S.prayerAutomatic : (prayerLocation.name || S.prayerDefaultLocation);
    const prefix = prayerLocation.mode === 'default' ? `${S.prayerDefaultLocation}: ` : '';
    el.textContent = `${prefix}${place} · ${tz}`;
  }
  function distanceKm(aLat, aLng, bLat, bLng) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (bLat-aLat)*rad, dLng=(bLng-aLng)*rad;
    const x = Math.sin(dLat/2)**2 + Math.cos(aLat*rad)*Math.cos(bLat*rad)*Math.sin(dLng/2)**2;
    return 2*R*Math.asin(Math.sqrt(x));
  }
  function applyPrayerLocation(next) {
    const moved = distanceKm(Number(prayerLocation.lat), Number(prayerLocation.lng), Number(next.lat), Number(next.lng));
    const tzChanged = (prayerLocation.timezone || '') !== (next.timezone || '');
    prayerLocation = { ...prayerLocation, ...next };
    savePrayerLocation();
    updatePrayerLocationUI();
    if (moved >= 10 || tzChanged || lastPrayerDateKey === null) {
      lastPrayerDateKey = null;
      refreshPrayersIfNeeded(new Date());
    }
  }
  function requestCurrentPrayerLocation({ quiet = false } = {}) {
    const S = STRINGS[currentLang];
    if (!navigator.geolocation) {
      if (!quiet) updatePrayerLocationUI(S.prayerLocationDenied);
      return;
    }
    if (!quiet) updatePrayerLocationUI(S.prayerCheckingLocation);
    navigator.geolocation.getCurrentPosition(pos => {
      applyPrayerLocation({
        lat: pos.coords.latitude, lng: pos.coords.longitude,
        name: S.prayerAutomatic, timezone: deviceTimeZone(), mode: 'auto', updatedAt: Date.now()
      });
    }, () => {
      if (!quiet) updatePrayerLocationUI(S.prayerLocationDenied);
    }, { enableHighAccuracy:false, timeout:8000, maximumAge:15*60*1000 });
  }
  async function choosePrayerCity() {
    const S = STRINGS[currentLang];
    const city = window.prompt(S.prayerCityPrompt, prayerLocation.mode === 'manual' ? (prayerLocation.name || '') : '');
    if (!city || !city.trim()) return;
    updatePrayerLocationUI(S.prayerCheckingLocation);
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=${currentLang === 'ar' ? 'ar' : 'en'}&format=json`;
      const res = await fetch(url, { headers: { 'Accept':'application/json' } });
      if (!res.ok) throw new Error('geocoding failed');
      const data = await res.json();
      const hit = data && Array.isArray(data.results) ? data.results[0] : null;
      if (!hit) { updatePrayerLocationUI(S.prayerCityNotFound); return; }
      const name = [hit.name, hit.admin1, hit.country].filter(Boolean).join(', ');
      applyPrayerLocation({ lat:Number(hit.latitude), lng:Number(hit.longitude), name, timezone:hit.timezone || deviceTimeZone(), mode:'manual', updatedAt:Date.now() });
    } catch (e) {
      updatePrayerLocationUI(S.prayerCityError);
    }
  }

  const PRAYER_TICK_OUT = 239;
  const PRAYER_R_NEAR = 282, PRAYER_R_FAR = 312;

  const notes = {
    "Sleep": "Rest well.",
    "Call home": "Say hi for me.",
    "Gym": "One rep at a time.",
    "Work (home)": "Steady focus.",
    "Lunch": "Step away and actually eat.",
    "Walk": "Fresh air, clear head.",
    "App development": "Building something real.",
    "Qur'an & reading": "A quiet, grounding minute.",
    "Job search / swim": "Keep going. It adds up.",
    "Wind down": "Let the day settle.",
  };

  const DEFAULT_BLOCKS = [
    { start: 0,     end: 7,     label: "Sleep",             color: "var(--c-sleep)"   },
    { start: 7,     end: 7.5,   label: "Call home",         color: "var(--c-family)" },
    { start: 7.5,   end: 8.5,   label: "Gym",                color: "var(--c-gym)"    },
    { start: 8.5,   end: 13,    label: "Work (home)",         color: "var(--c-work)"   },
    { start: 13,    end: 14,    label: "Lunch",                color: "var(--c-lunch)"  },
    { start: 14,    end: 16.5,  label: "Work (home)",         color: "var(--c-work)"   },
    { start: 16.5,  end: 17,    label: "Walk",                color: "var(--c-walk)"   },
    { start: 17,    end: 19,    label: "App development",     color: "var(--c-app)"    },
    { start: 19,    end: 19.5,  label: "Qur'an & reading",    color: "var(--c-quran)"  },
    { start: 19.5,  end: 20.5,  label: "Job search / swim",   color: "var(--c-rotate)" },
    { start: 20.5,  end: 23,    label: "Wind down",           color: "var(--c-wind)"   },
    { start: 23,    end: 24,    label: "Sleep",                color: "var(--c-sleep)"  },
  ];
  const PALETTE = ["var(--c-family)","var(--c-gym)","var(--c-work)","var(--c-lunch)","var(--c-walk)","var(--c-app)","var(--c-quran)","var(--c-rotate)","var(--c-wind)"];
  const STORAGE_KEY = "dailyRhythmBlocks_v1";
  let uidCounter = 1;
  function nextId() { return 'b' + (uidCounter++) + '_' + Date.now(); }

  let blocks = [];
  function loadBlocks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          if (parsed.length === 0) { blocks = []; return; }
          const cleaned = parsed.map((b, i) => {
            const start = Number(b.start), end = Number(b.end);
            if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end - start > 24) return null;
            return {
              id: (typeof b.id === 'string' && b.id) ? b.id : nextId(),
              start, end,
              label: String(b.labelEn || b.label || `Activity ${i + 1}`).slice(0, 80),
              labelEn: String(b.labelEn || b.label || `Activity ${i + 1}`).slice(0, 80),
              labelAr: String(b.labelAr || '').slice(0, 80),
              color: (typeof b.color === 'string' && b.color) ? b.color : PALETTE[i % PALETTE.length],
              done: !!b.done,
              note: String(b.note || '').slice(0, 160),
              seriesId: typeof b.seriesId === 'string' ? b.seriesId : '',
              occurrenceDate: typeof b.occurrenceDate === 'string' ? b.occurrenceDate : '',
              recurrence: (b.recurrence && typeof b.recurrence === 'object') ? b.recurrence : null,
              recurrenceGenerated: !!b.recurrenceGenerated
            };
          }).filter(Boolean).map((b, i) => ensureActivityPair(b, `Activity ${i + 1}`));
          if (cleaned.length) { blocks = cleaned; saveBlocks(); return; }
        }
      }
    } catch (e) { /* fall through to default */ }
    blocks = DEFAULT_BLOCKS.map(b => ensureActivityPair({ ...b, id: nextId(), done: false, note: "" }, b.label));
  }
  function saveBlocks() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks)); } catch (e) { /* storage unavailable */ }
  }
  function sortBlocks() { blocks.sort((a, b) => a.start - b.start); }
  loadBlocks();
  scheduleAiTranslationScan(500);
  sortBlocks();

  // ---- Activity log (add/edit/delete/activity entries) ----
  const LOGS_KEY = "dailyRhythmLogs_v1";
  let logs = [];
  function loadLogs() {
    try { const raw = localStorage.getItem(LOGS_KEY); if (raw) logs = JSON.parse(raw); } catch (e) { /* none saved */ }
  }
  function saveLogs() {
    try { localStorage.setItem(LOGS_KEY, JSON.stringify(logs)); } catch (e) { /* unavailable */ }
  }
  let unmatched = []; // declared early so renderLogs can check pending suggestions
  function addLog(type, description, refId) {
    logs.push({ ts: Date.now(), type, description, refId: refId || null });
    if (logs.length > 200) logs = logs.slice(logs.length - 200);
    saveLogs();
    renderLogs();
  }
  function fmtLogTime(ts) {
    return new Date(ts).toLocaleTimeString(currentLang === 'ar' ? 'ar' : undefined, { hour:'2-digit', minute:'2-digit' });
  }
  function fmtLogDate(ts) {
    return new Date(ts).toLocaleDateString(currentLang === 'ar' ? 'ar' : undefined, {
      year:'numeric', month:'short', day:'numeric'
    });
  }
  function logGroupLabel(key, count) {
    if (currentLang === 'ar') {
      if (key === 'today') return `اليوم`;
      if (key === 'last24') return `آخر 24 ساعة`;
      return `أقدم`;
    }
    if (key === 'today') return 'Today';
    if (key === 'last24') return 'Previous 24 hours';
    return 'Earlier';
  }
  const TYPE_COLORS = { Add:'#6FA050', Edit:'#4F8FBF', Delete:'#C9695B', Activity:'#8B7FBF', Dismiss:'#8B8F9C', Note:'#C9932E' };
  let logFilter='all';
  let logSearchTerm='';

  function renderLogRows(items) {
    return items.map(l => {
      const color=TYPE_COLORS[l.type] || 'var(--bg)';
      const pending=(l.type==='Activity' && l.refId) ? unmatched.find(u=>u.id===l.refId) : null;
      const addLabel=currentLang==='ar'?'إضافة إلى الجدول':'Add to schedule';
      const ignoreLabel=currentLang==='ar'?'تجاهل':'Ignore';
      return `
        <div class="log-row${pending?' log-row-pending':''}">
          <span class="log-time-wrap">
            <span class="log-time">${fmtLogTime(l.ts)}</span>
            <span class="log-date-stamp">${fmtLogDate(l.ts)}</span>
          </span>
          <span class="log-type" style="background:${color}; color:#FBFDF9;">${typeDisplayLabel(l.type)}</span>
          <span class="log-desc">${escapeHtml(l.description)}</span>
          ${pending?`
            <span class="log-inline-actions">
              <button class="log-add-btn" data-id="${l.refId}">${addLabel}</button>
              <button class="log-ignore-btn" data-id="${l.refId}">${ignoreLabel}</button>
            </span>
          `:''}
        </div>`;
    }).join('');
  }

  function renderLogs() {
    const list=document.getElementById('logsList');
    const countEl=document.getElementById('logsCount');
    if(countEl) countEl.textContent=logs.length?`(${logs.length})`:'';

    let visible=logs.slice().sort((a,b)=>b.ts-a.ts);
    if(logFilter!=='all') visible=visible.filter(l=>l.type===logFilter);
    if(logSearchTerm){
      const q=logSearchTerm.toLowerCase();
      visible=visible.filter(l=>String(l.description||'').toLowerCase().includes(q)||String(l.type||'').toLowerCase().includes(q));
    }
    if(!visible.length){
      list.innerHTML=`<p class="logs-empty">${logs.length?STRINGS[currentLang].noLogMatches:STRINGS[currentLang].noLogs}</p>`;
      return;
    }

    const now=new Date();
    const todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
    const last24=Date.now()-24*60*60*1000;
    const groups={
      today:visible.filter(x=>x.ts>=todayStart),
      last24:visible.filter(x=>x.ts<todayStart && x.ts>=last24),
      earlier:visible.filter(x=>x.ts<last24)
    };

    const groupHtml=[];
    for(const key of ['today','last24','earlier']){
      const items=groups[key];
      if(!items.length) continue;
      const open=key==='today'?' open':'';
      const countLabel=currentLang==='ar'?`${items.length} سجل`:`${items.length} ${items.length===1?'entry':'entries'}`;
      groupHtml.push(`
        <details class="log-group log-group-${key}"${open}>
          <summary>
            <span>${logGroupLabel(key,items.length)}</span>
            <span class="log-group-count">${countLabel}</span>
          </summary>
          <div class="log-group-body">${renderLogRows(items)}</div>
        </details>
      `);
    }
    list.innerHTML=groupHtml.join('');

    list.querySelectorAll('.log-add-btn').forEach(btn=>btn.addEventListener('click',()=>promoteUnmatched(btn.dataset.id)));
    list.querySelectorAll('.log-ignore-btn').forEach(btn=>btn.addEventListener('click',()=>ignoreUnmatched(btn.dataset.id)));
  }

  loadLogs();

  const logSearchInput = document.getElementById('logSearch');
  logSearchInput.addEventListener('input', () => { logSearchTerm = logSearchInput.value.trim(); renderLogs(); });
  document.getElementById('logFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    logFilter = btn.dataset.type;
    renderLogs();
  });

  // ---- Unmatched activity suggestions ----
  const UNMATCHED_KEY = "dailyRhythmUnmatched_v1";
  function loadUnmatched() {
    try { const raw = localStorage.getItem(UNMATCHED_KEY); if (raw) unmatched = JSON.parse(raw); } catch (e) { /* none saved */ }
  }
  function saveUnmatched() {
    try { localStorage.setItem(UNMATCHED_KEY, JSON.stringify(unmatched)); } catch (e) { /* unavailable */ }
  }
  function addUnmatched(name, start, end, note, rawText) {
    const entry = { id: nextId(), name, start, end, note, rawText, ts: Date.now() };
    unmatched.push(entry);
    saveUnmatched();
    renderSuggestions();
    addLog('Activity', currentLang === 'ar' ? `تم تسجيل نشاط غير معروف: "${name}"` : `Logged unrecognized activity: "${name}"`, entry.id);
  }
  function promoteUnmatched(id) {
    const u = unmatched.find(x => x.id === id);
    if (!u) return;
    let start = u.start, end = u.end;
    if (start === null || start === undefined) { const now = new Date(); start = now.getHours() + Math.round(now.getMinutes()/15)*15/60; }
    if (end === null || end === undefined) end = start + 0.25;
    const color = PALETTE[blocks.length % PALETTE.length];
    const pair = makeActivityPair(u.name, containsArabicText(u.name) ? 'ar' : 'en');
    blocks.push({ id: nextId(), start, end, ...pair, color, done: !!u.note, note: u.note || "" });
    sortBlocks(); saveBlocks(); renderAll();
    unmatched = unmatched.filter(x => x.id !== id);
    saveUnmatched(); renderSuggestions();
    addLog('Add', currentLang === 'ar' ? `تمت إضافة "${u.name}" من الاقتراحات — من ${fmtClock12(start)} إلى ${fmtClock12(end)}` : `Added "${u.name}" from suggestion — ${fmtClock12(start)}–${fmtClock12(end)}`);
    setCommandFeedback(currentLang === 'ar' ? `تمت إضافة "${u.name}" إلى جدولك.` : `Added "${u.name}" to your schedule.`, 'success');
  }
  function ignoreUnmatched(id) {
    const u = unmatched.find(x => x.id === id);
    if (!u) return;
    unmatched = unmatched.filter(x => x.id !== id);
    saveUnmatched(); renderSuggestions();
    addLog('Dismiss', currentLang === 'ar' ? `تم تجاهل النشاط المقترح: "${u.name}"` : `Ignored suggested activity: "${u.name}"`);
  }
  function renderSuggestions() {
    const section = document.getElementById('suggestionsSection');
    const list = document.getElementById('suggestionsList');
    if (!unmatched.length) { section.style.display = 'none'; list.innerHTML = ''; return; }
    section.style.display = 'block';
    list.innerHTML = '';
    unmatched.forEach(u => {
      const row = document.createElement('div');
      row.className = 'suggestion-row';
      const timeStr = (u.start !== null && u.start !== undefined)
        ? (u.end !== null && u.end !== undefined ? `${fmtClock12(u.start)}–${fmtClock12(u.end)}` : fmtClock12(u.start))
        : (currentLang === 'ar' ? 'لا يوجد وقت محدد' : 'no time given');
      row.innerHTML = `
        <div class="suggestion-info">
          <span class="suggestion-name">${escapeHtml(u.name)}</span>
          <span class="suggestion-meta">${escapeHtml(timeStr)}${u.note ? ' · ' + escapeHtml(u.note) : ''}</span>
        </div>
        <div class="suggestion-actions">
          <button class="add-btn">${STRINGS[currentLang].addToSchedule}</button>
          <button class="ignore-btn">${STRINGS[currentLang].ignore}</button>
        </div>
      `;
      row.querySelector('.add-btn').addEventListener('click', () => promoteUnmatched(u.id));
      row.querySelector('.ignore-btn').addEventListener('click', () => ignoreUnmatched(u.id));
      list.appendChild(row);
    });
  }
  loadUnmatched();
  renderLogs();
  renderSuggestions();

  const svgns = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const e = document.createElementNS(svgns, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function resolveVar(v) {
    return getComputedStyle(document.documentElement).getPropertyValue(v.replace('var(','').replace(')','').trim()).trim();
  }
  function polar(r, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) };
  }
  function donutPath(rOut, rIn, startDeg, endDeg) {
    const p1 = polar(rOut, startDeg), p2 = polar(rOut, endDeg);
    const p3 = polar(rIn, endDeg), p4 = polar(rIn, startDeg);
    const large = (endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
  }

  const svg = document.getElementById('svg');

  // Schedule ring: keep the full activity color mapping in the data/list,
  // but render the watch face with a restrained, conservative palette.
  const segGroup = el('g', {});
  const DIAL_MUTED_PALETTE = ['#42586e', '#55697a', '#667788', '#596978', '#708092'];
  const DIAL_CURRENT_COLOR = '#c9a33b';
  let lastDialActiveId = null;

  function dialColorForBlock(b, isActive) {
    if (isActive) return DIAL_CURRENT_COLOR;
    const key = String(b.label || b.id || 'activity');
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
    return DIAL_MUTED_PALETTE[Math.abs(hash) % DIAL_MUTED_PALETTE.length];
  }

  function renderSegments(activeId = null) {
    while (segGroup.firstChild) segGroup.removeChild(segGroup.firstChild);
    blocks.forEach(b => {
      const isActive = activeId !== null && b.id === activeId;
      const pieces = b.end <= 24 ? [[b.start, b.end]] : [[b.start, 24], [0, b.end - 24]];
      pieces.forEach(([start, end]) => {
        if (end <= start) return;
        const startDeg = (start / 24) * 360, endDeg = (end / 24) * 360;
        segGroup.appendChild(el('path', {
          d: donutPath(R_OUT, R_IN, startDeg, endDeg),
          fill: dialColorForBlock(b, isActive),
          opacity: isActive ? '0.96' : '0.78',
          stroke: isActive ? 'rgba(184,134,11,0.72)' : 'rgba(243,233,210,0.24)',
          'stroke-width': isActive ? 2.8 : 1.5
        }));
      });
    });
  }
  updateDialScale();
  renderSegments();
  svg.appendChild(segGroup);

  // crisp ring edges
  svg.appendChild(el('circle', { cx: CX, cy: CY, r: R_OUT, fill: 'none', stroke: 'rgba(255,255,255,0.18)', 'stroke-width': 1.6 }));
  svg.appendChild(el('circle', { cx: CX, cy: CY, r: R_IN, fill: 'none', stroke: 'rgba(255,255,255,0.18)', 'stroke-width': 1.6 }));

  // ticks — drawn inward within the colored ring, with a dark halo so they
  // stay legible against both light (amber) and dark (slate) segment colors
  const tickGroup = el('g', {});
  for (let h = 0; h < 24; h++) {
    const angle = (h / 24) * 360;
    const isMajor = h % 6 === 0;
    const innerReach = isMajor ? (R_OUT - (TICK_MAJOR_OUT - R_OUT)) : (R_OUT - (TICK_MINOR_OUT - R_OUT));
    const p1 = polar(R_OUT, angle), p2 = polar(innerReach, angle);
    const haloW = isMajor ? 8 : 6;
    const coreW = isMajor ? 4.5 : 2.8;
    tickGroup.appendChild(el('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: 'rgba(0,0,0,0.4)', 'stroke-width': haloW, 'stroke-linecap': 'round' }));
    tickGroup.appendChild(el('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: 'rgba(255,255,255,0.95)', 'stroke-width': coreW, 'stroke-linecap': 'round' }));
  }
  svg.appendChild(tickGroup);

  // hour numbers (24h landmarks)
  const numLabels = [ [0,'12'], [6,'3'], [12,'6'], [18,'9'] ];
  const numGroup = el('g', {});
  numLabels.forEach(([h, txt]) => {
    const angle = (h / 24) * 360;
    const p = polar(NUM_R, angle);
    const t = el('text', { x: p.x, y: p.y, class: 'num-text' });
    t.textContent = txt;
    numGroup.appendChild(t);
  });
  svg.appendChild(numGroup);

  // prayer markers — placed around the dial at their actual times.
  // We use label + small time under it (no floating chips) so the face
  // feels more like a wall clock while still keeping the prayers readable.
  const prayerGroup = el('g', {});
  function prayerAnchor(angle) {
    if (angle > 18 && angle < 162) return 'start';
    if (angle > 198 && angle < 342) return 'end';
    return 'middle';
  }
  function renderPrayerMarkers() {
    while (prayerGroup.firstChild) prayerGroup.removeChild(prayerGroup.firstChild);
    prayers.forEach((p, i) => {
      const angle = ((p.time % 12) / 12) * 360;
      const tickInner = R_OUT - 34;
      const p1 = polar(R_OUT - 8, angle), p2 = polar(tickInner, angle);
      prayerGroup.appendChild(el('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: 'rgba(122,90,42,0.45)', 'stroke-width': 7, 'stroke-linecap': 'round' }));
      prayerGroup.appendChild(el('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: '#E6C25C', 'stroke-width': 3.5, 'stroke-linecap': 'round' }));

      // Keep the marker itself mathematically exact, but place the text in stable
      // watch-face zones so prayer names never collide at the lower edge.
      const labelSlots = [
        {x:170,y:300,a:'start'},   // Fajr
        {x:178,y:520,a:'start'},   // Sunrise
        {x:420,y:176,a:'middle'},  // Dhuhr/Zohr
        {x:654,y:330,a:'end'},     // Asr
        {x:620,y:530,a:'end'},     // Maghrib
        {x:420,y:625,a:'middle'}   // Isha
      ];
      const slot = labelSlots[i] || {x:polar(254,angle).x,y:polar(254,angle).y,a:prayerAnchor(angle)};
      const lp = {x:slot.x,y:slot.y};
      const anchor = slot.a;
      const labelGroup = el('g', {});
      labelGroup.appendChild(el('circle', { cx: lp.x, cy: lp.y - 22, r: 5.5, class: 'prayer-label-dot' }));

      const cue = ({ Fajr:'◔', Sunrise:'☀', Maghrib:'◕', Isha:'☾' })[p.label] || '';
      const t1 = el('text', { x: lp.x, y: lp.y - 3, class: 'prayer-label-text', 'text-anchor': anchor });
      t1.textContent = `${cue ? cue + ' ' : ''}${prayerDisplayLabel(p.label)}`;
      labelGroup.appendChild(t1);

      const h24 = normalizeHour(p.time);
      let h12 = Math.floor(h24) % 12; if (h12 === 0) h12 = 12;
      const mins = Math.round((h24 - Math.floor(h24)) * 60) % 60;
      const period = currentLang === 'ar' ? (h24 < 12 ? 'ص' : 'م') : (h24 < 12 ? 'AM' : 'PM');
      const t2 = el('text', { x: lp.x, y: lp.y + 22, class: 'prayer-time-text', 'text-anchor': anchor });
      const main = el('tspan', {}); main.textContent = `${h12}:${String(mins).padStart(2,'0')} `;
      const suffix = el('tspan', { class:'prayer-period-text' }); suffix.textContent = period;
      t2.appendChild(main); t2.appendChild(suffix);
      labelGroup.appendChild(t2);
      prayerGroup.appendChild(labelGroup);
    });
  }
  svg.appendChild(prayerGroup);

  function refreshPrayersIfNeeded(now) {
    const key = prayerLocationKey(now);
    if (key !== lastPrayerDateKey) {
      prayers = computePrayerTimes(now, prayerLocation.lat, prayerLocation.lng, prayerLocation.timezone || deviceTimeZone());
      prayers.forEach(p => { if (prayerOverrides[p.label] !== undefined) p.time = prayerOverrides[p.label]; });
      lastPrayerDateKey = key;
      renderPrayerMarkers();
      updatePrayerLocationUI();
    }
  }
  function setPrayerOverride(label, time) {
    prayerOverrides[label] = time;
    savePrayerOverrides();
    prayers.forEach(p => { if (p.label === label) p.time = time; });
    renderPrayerMarkers();
  }

  // hub ring (decorative, behind hand)
  svg.appendChild(el('circle', { cx: CX, cy: CY, r: 34, class: 'hub-ring' }));

  // main wall-clock style hand (still a 24-hour dial, so one full turn per day)
  const handGroup = el('g', { class: 'hand-group' });
  const handPath = el('path', { fill: 'var(--ink)', stroke: 'rgba(255,255,255,0.65)', 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
  handGroup.appendChild(handPath);
  const handCounter = el('circle', { cx: CX, cy: CY + 64, r: 10, fill: 'var(--ink)', stroke: 'rgba(255,255,255,0.65)', 'stroke-width': 2 });
  handGroup.appendChild(handCounter);
  svg.appendChild(handGroup);
  const centerCapOuter = el('circle', { cx: CX, cy: CY, r: 14, fill: '#7A5A2A', stroke: 'rgba(255,255,255,0.82)', 'stroke-width': 2.4, class: 'knob' });
  const centerCapInner = el('circle', { cx: CX, cy: CY, r: 6.2, fill: '#FBF6E8', stroke: 'rgba(122,90,42,0.7)', 'stroke-width': 1.5 });
  svg.appendChild(centerCapOuter);
  svg.appendChild(centerCapInner);

  function buildHandShape() {
    // A longer wall-clock style hand with a slim tip and fuller base.
    const tip = { x: CX, y: CY - HAND_LEN };
    const neckR = { x: CX + 7, y: CY - 42 };
    const neckL = { x: CX - 7, y: CY - 42 };
    const shoulderR = { x: CX + 13, y: CY + 18 };
    const tailR = { x: CX + 5, y: CY + HAND_TAIL };
    const tailL = { x: CX - 5, y: CY + HAND_TAIL };
    const shoulderL = { x: CX - 13, y: CY + 18 };
    return `M ${tip.x} ${tip.y} L ${neckR.x} ${neckR.y} L ${shoulderR.x} ${shoulderR.y} L ${tailR.x} ${tailR.y} L ${tailL.x} ${tailL.y} L ${shoulderL.x} ${shoulderL.y} L ${neckL.x} ${neckL.y} Z`;
  }
  handPath.setAttribute('d', buildHandShape());

  // badge group (position updates via transform translate; text stays upright)

  // legend rows
  const legend = document.getElementById('legend');
  function fmtTime(t) {
    t = normalizeHour(t);
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const period = h < 12 ? 'am' : 'pm';
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    return `${h12}:${m.toString().padStart(2,'0')}${period}`;
  }
  function closeAllScheduleSwipes(except = null) {
    legend.querySelectorAll('.schedule-swipe.is-open').forEach(w => {
      if (w !== except) w.classList.remove('is-open');
    });
  }

  function hourToTimeInput(v) {
    v = ((v % 24) + 24) % 24;
    let h = Math.floor(v);
    let m = Math.round((v - h) * 60);
    if (m === 60) { h = (h + 1) % 24; m = 0; }
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  function timeInputToHour(v) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(v || '');
    if (!m) return null;
    const h = Number(m[1]), min = Number(m[2]);
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return h + min / 60;
  }

  function openActivityEditor(block) {
    const panel = document.getElementById('activityEditPanel');
    document.getElementById('activityEditId').value = block.id;
    document.getElementById('activityEditName').value = blockDisplayLabel(block);
    document.getElementById('activityEditStart').value = hourToTimeInput(block.start);
    document.getElementById('activityEditEnd').value = hourToTimeInput(block.end);
    document.getElementById('activityEditNote').value = block.note || '';
    const ar = currentLang === 'ar';
    document.getElementById('activityEditTitle').textContent = ar ? 'تعديل النشاط' : 'Edit activity';
    document.getElementById('activityEditNameLabel').textContent = ar ? 'النشاط' : 'Activity';
    document.getElementById('activityEditStartLabel').textContent = ar ? 'البداية' : 'Start';
    document.getElementById('activityEditEndLabel').textContent = ar ? 'النهاية' : 'End';
    document.getElementById('activityEditNoteLabel').textContent = ar ? 'الوصف / الملاحظة' : 'Description / note';
    document.getElementById('activityEditCancel').textContent = ar ? 'إلغاء' : 'Cancel';
    document.getElementById('activityEditSave').textContent = ar ? 'حفظ التغييرات' : 'Save changes';
    const scopeWrap = document.getElementById('activityEditScopeWrap');
    const scope = document.getElementById('activityEditScope');
    const scopeLabel = document.getElementById('activityEditScopeLabel');
    if (scopeWrap && scope) {
      scopeWrap.hidden = !block.seriesId;
      scope.value = 'today';
      if (scopeLabel) scopeLabel.textContent = ar ? 'تطبيق التغيير على' : 'Apply change to';
      scope.options[0].textContent = ar ? 'اليوم فقط' : 'Only today';
      scope.options[1].textContent = ar ? 'اليوم والتكرارات القادمة' : 'This and future occurrences';
    }
    panel.hidden = false;
    closeAllScheduleSwipes();
    setTimeout(() => document.getElementById('activityEditName').focus(), 0);
  }

  function closeActivityEditor() {
    const panel = document.getElementById('activityEditPanel');
    if (panel) panel.hidden = true;
  }

  function deleteScheduledBlock(block) {
    if (block.seriesId) {
      const question = currentLang === 'ar'
        ? `تخطي "${blockDisplayLabel(block)}" لليوم فقط؟ سيبقى التكرار للأيام القادمة.`
        : `Skip "${blockDisplayLabel(block)}" for today only? Its recurring schedule will stay.`;
      if (!window.confirm(question)) return;
      recurringExceptions[recurrenceExceptionKey(block.seriesId, recurrenceDateKey())] = { type:'skip' };
      saveRecurringExceptions();
      blocks = blocks.filter(x => x.id !== block.id);
      clearReminderStateForBlock(block.id);
      saveBlocks();
      closeActivityEditor();
      renderAll();
      const desc = currentLang === 'ar'
        ? `تم تخطي "${blockDisplayLabel(block)}" لليوم فقط`
        : `Skipped "${blockDisplayLabel(block)}" for today only`;
      addLog('Delete', desc);
      return;
    }
    const question = currentLang === 'ar'
      ? `حذف "${blockDisplayLabel(block)}" من ${fmtClock12(block.start)} إلى ${fmtClock12(block.end)}؟`
      : `Delete "${blockDisplayLabel(block)}" from ${fmtClock12(block.start)} to ${fmtClock12(block.end)}?`;
    if (!window.confirm(question)) return;
    blocks = blocks.filter(x => x.id !== block.id);
    clearReminderStateForBlock(block.id);
    saveBlocks();
    closeActivityEditor();
    renderAll();
    const desc = currentLang === 'ar'
      ? `تم حذف "${blockDisplayLabel(block)}" — ${fmtClock12(block.start)}–${fmtClock12(block.end)}`
      : `Deleted "${blockDisplayLabel(block)}" — ${fmtClock12(block.start)}–${fmtClock12(block.end)}`;
    addLog('Delete', desc);
  }

  function attachSwipeGesture(wrapper, row, block) {
    let startX=0,startY=0,dx=0,tracking=false,horizontal=false,pid=null;
    const DELETE_RATIO=.58;
    const EDIT_RATIO=.34;
    const MAX_DRAG_RATIO=.92;

    function reset(animated=true){
      row.style.transition=animated?'transform .18s cubic-bezier(.2,.8,.2,1)':'none';
      row.style.transform='translateX(0px)';
      wrapper.classList.remove('swipe-left','swipe-right','swipe-delete-ready','swipe-edit-ready');
      if(animated) setTimeout(()=>{row.style.transition='';row.style.transform='';},190);
      else {row.style.transition='';row.style.transform='';}
    }

    row.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      if(e.target.closest?.('button,input,select,textarea,a'))return;
      startX=e.clientX;startY=e.clientY;dx=0;tracking=true;horizontal=false;pid=e.pointerId;
    });

    row.addEventListener('pointermove',e=>{
      if(!tracking||e.pointerId!==pid)return;
      const mx=e.clientX-startX,my=e.clientY-startY;
      if(!horizontal&&Math.abs(mx)>9&&Math.abs(mx)>Math.abs(my)+5){
        horizontal=true;
        try{row.setPointerCapture(pid)}catch(_){}
      }
      if(!horizontal)return;
      dx=mx;
      const width=Math.max(1,row.getBoundingClientRect().width);
      const limit=width*MAX_DRAG_RATIO;
      const translated=Math.max(-limit,Math.min(limit,dx));
      row.style.transition='none';
      row.style.transform=`translateX(${translated}px)`;
      wrapper.classList.toggle('swipe-left',translated<0);
      wrapper.classList.toggle('swipe-right',translated>0);
      wrapper.classList.toggle('swipe-delete-ready',translated<0&&Math.abs(translated)>=width*DELETE_RATIO);
      wrapper.classList.toggle('swipe-edit-ready',translated>0&&translated>=width*EDIT_RATIO);
      e.preventDefault();
    },{passive:false});

    const finish=e=>{
      if(!tracking)return;
      if(e?.pointerId!=null&&pid!==e.pointerId)return;
      tracking=false;
      try{row.releasePointerCapture(pid)}catch(_){}
      if(!horizontal){reset(false);return;}

      const width=Math.max(1,row.getBoundingClientRect().width);
      const deleteGesture=dx<0&&Math.abs(dx)>=width*DELETE_RATIO;
      const editGesture=dx>0&&dx>=width*EDIT_RATIO;

      wrapper.dataset.justSwiped='1';
      setTimeout(()=>{wrapper.dataset.justSwiped='';},320);

      if(deleteGesture){
        row.style.transition='transform .16s ease-out, opacity .16s ease-out';
        row.style.transform=`translateX(${-width}px)`;
        row.style.opacity='.25';
        setTimeout(()=>{
          row.style.opacity='';
          reset(false);
          deleteScheduledBlock(block);
        },150);
        return;
      }

      if(editGesture){
        reset(true);
        setTimeout(()=>openActivityEditor(block),90);
        return;
      }

      reset(true);
    };

    row.addEventListener('pointerup',finish);
    row.addEventListener('pointercancel',finish);
  }

  function blockIsSkipped(b) {
    return !!b?.skipped;
  }

  function blockIsMissed(b, now = new Date()) {
    if (!b || b.done || blockIsSkipped(b)) return false;
    const hf = currentHourFraction(now);
    return Number.isFinite(Number(b.end)) && hf >= Number(b.end);
  }

  function missedStatusText(b) {
    if (blockIsSkipped(b)) return currentLang === 'ar' ? 'تم التخطي' : 'Skipped';
    if (blockIsMissed(b)) return currentLang === 'ar' ? 'فات الموعد' : 'Missed';
    return '';
  }

  function doMissedActivityNow(b) {
    if (!b) return;
    const now = new Date();
    const hf = currentHourFraction(now);
    const duration = Math.max(.25, Number(b.end) - Number(b.start));
    const start = Math.min(23.75, Math.max(0, hf));
    const end = Math.min(24, start + duration);

    if (b.seriesId) {
      recurringExceptions[recurrenceExceptionKey(b.seriesId, recurrenceDateKey())] = {
        type:'override', start, end,
        labelEn:b.labelEn || b.label, labelAr:b.labelAr || b.label, note:b.note || ''
      };
      saveRecurringExceptions();
      materializeRecurringForDate();
      const updated = blocks.find(x => x.seriesId === b.seriesId && x.occurrenceDate === recurrenceDateKey());
      if (updated) clearReminderStateForBlock(updated.id);
    } else {
      b.start = start;
      b.end = end;
      b.skipped = false;
      clearReminderStateForBlock(b.id);
      saveBlocks();
    }
    renderAll();
    addLog('Edit', currentLang === 'ar'
      ? `تم نقل "${blockDisplayLabel(b)}" إلى الآن`
      : `Moved "${blockDisplayLabel(b)}" to now`, b.id);
  }

  function skipMissedActivity(b) {
    if (!b) return;
    if (b.seriesId) {
      recurringExceptions[recurrenceExceptionKey(b.seriesId, recurrenceDateKey())] = { type:'skip' };
      saveRecurringExceptions();
      blocks = blocks.filter(x => x.id !== b.id);
      clearReminderStateForBlock(b.id);
      saveBlocks();
    } else {
      b.skipped = true;
      clearReminderStateForBlock(b.id);
      saveBlocks();
    }
    renderAll();
    addLog('Edit', currentLang === 'ar'
      ? `تم تخطي "${blockDisplayLabel(b)}" لليوم`
      : `Skipped "${blockDisplayLabel(b)}" for today`, b.id);
  }

  function renderLegend() {
    legend.innerHTML = '';
    blocks.forEach((b) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'schedule-swipe' + (blockIsMissed(b) ? ' is-missed' : '');
      wrapper.dataset.id = b.id;

      const actions = document.createElement('div');
      actions.className = 'schedule-actions';
      const editText = currentLang === 'ar' ? 'تعديل' : 'Edit';
      const deleteText = currentLang === 'ar' ? 'حذف' : 'Delete';
      actions.innerHTML = `
        <button type="button" class="schedule-edit-btn" aria-label="${editText}">${editText}</button>
        <button type="button" class="schedule-delete-btn" aria-label="${deleteText}">${deleteText}</button>
      `;

      const row = document.createElement('div');
      row.className = 'row' + (b.done ? ' done' : '') + (blockIsSkipped(b) ? ' skipped' : '') + (blockIsMissed(b) ? ' missed' : '');
      row.dataset.id = b.id;
      row.innerHTML = `
        <span class="swatch" style="background:${resolveVar(b.color)}"></span>
        <span class="time">${fmtClock12(b.start)}<br><small>${fmtClock12(b.end)}</small></span>
        <span class="row-text">
          <span class="label">${escapeHtml(blockDisplayLabel(b))}</span>
          ${b.seriesId ? `<span class="recurrence-badge">${escapeHtml(recurrenceLabel(b.recurrence))}</span>` : ''}
          <span class="activity-state-badge" ${missedStatusText(b) ? '' : 'hidden'}>${escapeHtml(missedStatusText(b))}<span class="activity-state-chevron" aria-hidden="true">⌄</span></span>
          ${b.note ? `<span class="row-note">${escapeHtml(b.note)}</span>` : ''}
        </span>
      `;

      const missedActions = document.createElement('div');
      missedActions.className = 'missed-actions';
      missedActions.hidden = true;
      missedActions.innerHTML = `
        <button type="button" class="missed-do-now">${currentLang === 'ar' ? 'افعلها الآن' : 'Do now'}</button>
        <button type="button" class="missed-move">${currentLang === 'ar' ? 'نقل' : 'Move'}</button>
        <button type="button" class="missed-skip">${currentLang === 'ar' ? 'تخطي' : 'Skip'}</button>
      `;
      missedActions.querySelector('.missed-do-now').addEventListener('click', e => { e.stopPropagation(); doMissedActivityNow(b); });
      missedActions.querySelector('.missed-move').addEventListener('click', e => {
        e.stopPropagation();
        if (typeof scheduleSheet?.open === 'function') scheduleSheet.open();
        openActivityEditor(b);
      });
      missedActions.querySelector('.missed-skip').addEventListener('click', e => { e.stopPropagation(); skipMissedActivity(b); });

      row.addEventListener('click', () => {
        if (blockIsSkipped(b)) return;
        if (blockIsMissed(b)) {
          const open=missedActions.hidden; missedActions.hidden=!open; wrapper.classList.toggle('missed-expanded',open);
          return;
        }
        if (wrapper.dataset.justSwiped || wrapper.classList.contains('is-open')) {
          wrapper.classList.remove('is-open');
          return;
        }
        b.done = !b.done;
        saveBlocks();
        renderLegend();
        addLog(b.done ? 'Activity' : 'Edit', b.done ? `Marked "${b.label}" done` : `Unmarked "${b.label}"`);
        if (b.done) document.dispatchEvent(new CustomEvent('dailyRhythm:activityCompleted',{detail:{block:{...b}}}));
      });
      actions.querySelector('.schedule-edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openActivityEditor(b);
      });
      actions.querySelector('.schedule-delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteScheduledBlock(b);
      });
      attachSwipeGesture(wrapper, row, b);
      wrapper.appendChild(actions);
      wrapper.appendChild(row);
      wrapper.appendChild(missedActions);
      legend.appendChild(wrapper);
    });
  }
  renderLegend();

  const MOON_PHASE_IMAGES = ["assets/embedded-e57d969fd333.png", "assets/embedded-693b6daa601b.png", "assets/embedded-05dab10648c7.png", "assets/embedded-adb1deaa79e8.png", "assets/embedded-8f78f11bbb4b.png", "assets/embedded-df7ff90653fc.png", "assets/embedded-0c823d1fafc7.png", "assets/embedded-01e664b5fffe.png"];

  const THEME_PREF_KEY = 'dailyRhythmThemePreference_v1';
  const MOON_VISIBLE_KEY = 'dailyRhythmMoonVisible_v1';
  const MOON_POSITION_KEY = 'dailyRhythmMoonPosition_v1';
  let themePreference = 'auto';
  let moonVisible = true;
  let moonPositionPreference = 'auto';
  try {
    themePreference = localStorage.getItem(THEME_PREF_KEY) || 'auto';
    moonVisible = true; try{localStorage.removeItem(MOON_VISIBLE_KEY);}catch(_){}
    moonPositionPreference = localStorage.getItem(MOON_POSITION_KEY) || 'auto';
  } catch (e) {}

  function isDaytime(hf) {
    const sunrise = prayers.find(p => p.label === 'Sunrise')?.time ?? 6.5;
    const maghrib = prayers.find(p => p.label === 'Maghrib')?.time ?? 19;
    return hf >= sunrise && hf < maghrib;
  }

  function applyTimeTheme(now, hf) {
    const appShell = document.querySelector('.app-shell');
    document.documentElement.setAttribute('data-theme', 'dark');
    if (appShell) { appShell.classList.add('is-night'); appShell.classList.remove('is-day'); }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', '#10243B');
    return false;
  }

  function positionMoonBadge(now) {
    const badge = document.getElementById('skyMoonBadge');
    if (!badge) return;
    badge.style.display = moonVisible ? '' : 'none';
    if (!moonVisible) return;

    const idx = moonPhaseIndex(now);
    const phase = moonPhaseFraction(now);
    badge.style.setProperty('--moon-current-image', `url("${MOON_PHASE_IMAGES[idx]}")`);

    let x, y;
    const fixed = {
      'top-right':[75,25], 'top-left':[25,25],
      'bottom-right':[75,75], 'bottom-left':[25,75]
    }[moonPositionPreference];
    if (fixed) {
      [x,y] = fixed;
    } else {
      // Follow lunar phase around an inner orbit that remains clear of the rim.
      const angleDeg = (phase * 360) - 90;
      const radiusPct = 43;
      const rad = angleDeg * Math.PI / 180;
      x = 50 + radiusPct * Math.cos(rad);
      y = 50 + radiusPct * Math.sin(rad);
    }

    badge.style.left = `${x}%`;
    badge.style.top = `${y}%`;
    badge.style.right = 'auto';
    badge.style.transform = 'translate(-50%, -50%)';
  }

  function clockAngle12(hourFloat) {
    const v = ((hourFloat % 12) + 12) % 12;
    return (v / 12) * 360;
  }

  function currentHourFraction(now) {
    return now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600;
  }
  function activeIndex(hf) {
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.done || blockIsSkipped(b)) continue;
      if ((hf >= b.start && hf < Math.min(b.end, 24)) || (b.end > 24 && hf < b.end - 24)) return i;
    }
    return -1;
  }

  function nextBlockAfter(hf) {
    if (!blocks.length) return null;
    for (const b of blocks) {
      if (b.done || blockIsSkipped(b)) continue;
      if (b.start > hf) return b;
    }
    return null;
  }

  function fmtClock12(t) {
    t = normalizeHour(t);
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const period = currentLang === 'ar'
      ? (h < 12 ? 'صباحًا' : 'مساءً')
      : (h < 12 ? 'AM' : 'PM');
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    return `${h12}:${m.toString().padStart(2,'0')} ${period}`;
  }

  function nextPrayer(hf) {
    for (const p of prayers) {
      if (p.time > hf) return p;
    }
    return prayers[0]; // wraps to tomorrow's Fajr
  }

  function tick() {
    const now = new Date();
    refreshPrayersIfNeeded(now);
    const hf = currentHourFraction(now);
    const deg = clockAngle12(hf);

    handGroup.setAttribute('transform', `rotate(${deg} ${CX} ${CY})`);

    const idx = activeIndex(hf);
    const activeBlock = idx >= 0 ? blocks[idx] : null;
    const activeId = activeBlock ? activeBlock.id : null;
    if (activeId !== lastDialActiveId) {
      lastDialActiveId = activeId;
      renderSegments(activeId);
    }
    {
      const clockLine = document.getElementById('clockLine');
      if (clockLine) clockLine.textContent = fmtClock12(hf);
      const topTime = document.getElementById('homeTopTime');
      if (topTime) topTime.textContent = fmtClock12(hf);
    }
    const dateLocale = currentLang === 'ar' ? 'ar' : 'en';
    document.getElementById('dateLine').textContent = now.toLocaleDateString(dateLocale, { weekday: 'short', month: 'short', day: 'numeric' });
    document.getElementById('hijriLine').textContent = formatHijriDate(now);

    // ---- Now / Up Next card ----
    const S0 = STRINGS[currentLang];
    document.getElementById('nuNowText').textContent = activeBlock ? blockDisplayLabel(activeBlock) : (currentLang === 'ar' ? 'يومك مفتوح' : 'Your day is open');
    const nb = nextBlockAfter(hf);
    if (nb) {
      let nbDiff = nb.start - hf;
      if (nbDiff < 0) nbDiff += 24;
      const nbH = Math.floor(nbDiff);
      const nbM = Math.floor((nbDiff - nbH) * 60);
      const nbDiffStr = currentLang === 'ar'
        ? (nbH > 0 ? `${nbH}س ${nbM}د` : `${nbM}د`)
        : (nbH > 0 ? `${nbH}h ${nbM}m` : `${nbM}m`);
      document.getElementById('nuNextText').textContent = blockDisplayLabel(nb);
      document.getElementById('nuCountdown').textContent = `${S0.inLabel} ${nbDiffStr} · ${fmtClock12(nb.start)}`;
    } else {
      document.getElementById('nuNextText').textContent = currentLang === 'ar' ? 'أضف نشاطاً' : 'Add an activity';
      document.getElementById('nuCountdown').textContent = '';
    }

    const np = nextPrayer(hf);
    let diff = np.time - hf;
    if (diff < 0) diff += 24;
    const diffH = Math.floor(diff);
    const diffM = Math.floor((diff - diffH) * 60);
    const diffStr = currentLang === 'ar'
      ? (diffH > 0 ? `${diffH}س ${diffM}د` : `${diffM}د`)
      : (diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM}m`);
    const S = STRINGS[currentLang];
    document.getElementById('nextPrayerLine').innerHTML =
      `<span class="prayer-name">${prayerDisplayLabel(np.label)}</span>` +
      `<span class="prayer-time">${fmtClock12(np.time)}</span>` +
      `<span class="prayer-countdown">${diffStr}</span>`;

    document.getElementById('noteLine').textContent = activeBlock ? noteDisplay(activeBlock.label) : '';

    applyTimeTheme(now, hf);
    positionMoonBadge(now);

    blocks.forEach((b, i) => {
      const row = legend.querySelector(`.row[data-id="${b.id}"]`);
      if (!row) return;
      row.classList.toggle('active', i === idx);
      row.classList.toggle('missed', blockIsMissed(b, now));
      row.classList.toggle('skipped', blockIsSkipped(b));
      const badge = row.querySelector('.activity-state-badge');
      if (badge) {
        const txt = missedStatusText(b);
        badge.hidden = !txt;
        badge.textContent = txt;
      }
      const wrapper = row.closest('.schedule-swipe');
      if(wrapper) wrapper.classList.toggle('is-missed',blockIsMissed(b,now));
      const missedActions = wrapper?.querySelector('.missed-actions');
      if (missedActions && !blockIsMissed(b, now)) { missedActions.hidden = true; wrapper?.classList.remove('missed-expanded'); }
    });
    updateActivityReminder(now);
  }

  function updateDialScale() {
    // A short schedule stays at the base size; a busier one (more, and
    // shorter, segments) gets a bit more room so slices stay legible.
    const n = blocks.length;
    const shortest = blocks.reduce((min, b) => Math.min(min, b.end - b.start), 24);
    let scale = 1 + Math.max(0, n - 8) * 0.015;
    if (shortest < 0.5) scale += 0.05; // very thin slices get extra breathing room
    scale = Math.min(1.18, scale);
    document.documentElement.style.setProperty('--dial-scale', scale.toFixed(3));
  }

  function renderHomeDayPreview() {
    const wrap = document.getElementById('homeDayPreview');
    const list = document.getElementById('homeDayPreviewList');
    const title = document.getElementById('homeDayPreviewTitle');
    const open = document.getElementById('homeDayPreviewOpen');
    if (!wrap || !list) return;
    if (title) title.textContent = currentLang === 'ar' ? 'اليوم' : 'Today';
    if (open) {
      open.textContent = currentLang === 'ar' ? 'عرض اليوم' : 'View day';
      open.onclick = () => document.getElementById('openScheduleBtn')?.click();
    }
    list.innerHTML = '';
    const visible = blocks.filter(b => !b.skipped).slice().sort((a,b) => a.start-b.start).slice(0,5);
    if (!visible.length) {
      const empty = document.createElement('button');
      empty.type = 'button';
      empty.className = 'home-day-empty';
      empty.innerHTML = `<strong>${currentLang === 'ar' ? 'يومك مفتوح' : 'Your day is open'}</strong><span>${currentLang === 'ar' ? 'اضغط لإضافة نشاط بصوتك أو بكلماتك.' : 'Tap to add an activity in your own words.'}</span>`;
      empty.addEventListener('click', () => document.getElementById('homeTalkCta')?.click());
      list.appendChild(empty);
      return;
    }
    visible.forEach(b => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'home-day-row' + (b.done ? ' is-done' : '');
      row.innerHTML = `<span class="home-day-time">${escapeHtml(fmtClock12(b.start))}</span><span class="home-day-name">${escapeHtml(blockDisplayLabel(b))}</span><span class="home-day-arrow" aria-hidden="true">›</span>`;
      row.addEventListener('click', () => document.getElementById('openScheduleBtn')?.click());
      list.appendChild(row);
    });
  }

  function renderAll() {
    updateDialScale();
    renderSegments(lastDialActiveId);
    renderLegend();
    const talkTitle = document.getElementById('homeTalkTitle');
    const talkSubtitle = document.getElementById('homeTalkSubtitle');
    const talkCta = document.getElementById('homeTalkCta');
    if (talkTitle) talkTitle.textContent = currentLang === 'ar' ? 'تحدّث عن يومك' : 'Talk to your day';
    if (talkSubtitle) talkSubtitle.textContent = currentLang === 'ar' ? 'أضف أو حرّك أو غيّر أي نشاط' : 'Add, move, or change anything';
    if (talkCta) talkCta.setAttribute('aria-label', currentLang === 'ar' ? 'تحدّث عن يومك' : 'Talk to your day');
    renderHomeDayPreview();
  }

  // ---- Natural-language schedule commands ----
  const AR_DIGIT_MAP = { '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
  function normalizeDigits(s) {
    return s.replace(/[٠-٩]/g, ch => AR_DIGIT_MAP[ch] || ch);
  }
  function normalizeArabicClockWords(s) {
    let t = String(s || '');
    // Spoken Arabic clock forms, including common speech-to-text variants.
    // Examples: الساعة الحادية عشر والنصف -> 11:30, الساعة الرابعة والربع -> 4:15.
    const hourWords = [
      ['الثانية عشرة','الثاني عشر','الثانية عشر','اثنتا عشرة','اثنا عشر','اتناشر','12'],
      ['الحادية عشرة','الحادي عشر','الحادية عشر','احدى عشرة','إحدى عشرة','حداشر','11'],
      ['العاشرة','العاشر','10'],
      ['التاسعة','التاسع','9'],
      ['الثامنة','الثامن','8'],
      ['السابعة','السابع','7'],
      ['السادسة','السادس','6'],
      ['الخامسة','الخامس','5'],
      ['الرابعة','الرابع','4'],
      ['الثالثة','الثالث','3'],
      ['الثانية','الثاني','2'],
      ['الواحدة','الأولى','الاولى','الواحد','1']
    ];
    const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const row of hourWords) {
      const n = row[row.length - 1];
      const variants = row.slice(0, -1).map(esc).join('|');
      if (!variants) continue;
      // half / quarter / three quarters, with or without و
      t = t.replace(new RegExp(`(?:الساعة\\s+)?(?:${variants})\\s*(?:و)?النصف`, 'g'), `${n}:30`);
      t = t.replace(new RegExp(`(?:الساعة\\s+)?(?:${variants})\\s*(?:و)?الربع`, 'g'), `${n}:15`);
      t = t.replace(new RegExp(`(?:الساعة\\s+)?(?:${variants})\\s*(?:و)?ثلاثة\\s+أرباع`, 'g'), `${n}:45`);
      t = t.replace(new RegExp(`(?:الساعة\\s+)?(?:${variants})`, 'g'), `${n}`);
    }
    return t;
  }
  function normalizeTimePhrase(s) {
    return normalizeArabicClockWords(normalizeDigits(String(s || '')))
      .replace(/o['’]?clock/ig, '')
      .replace(/\bin\s+the\s+morning\b/ig, ' am')
      .replace(/\bin\s+the\s+afternoon\b/ig, ' pm')
      .replace(/\bin\s+the\s+evening\b/ig, ' pm')
      .replace(/\bat\s+night\b/ig, ' pm')
      .replace(/(?:في\s+)?الصباح|صباح[اً]?|صباحا/ig, ' am')
      .replace(/(?:في\s+)?المساء|مساء[ًاأ]?|مساءا/ig, ' pm')
      .replace(/بعد\s+الظهر|ظهر[اً]?|ظهرا/ig, ' pm')
      .replace(/منتصف\s+الليل/ig, ' 12 am')
      .replace(/الظهر/ig, ' 12 pm')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function parseTimeToken(token) {
    token = normalizeTimePhrase(token.trim());
    const m = token.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|ص|م)?/i);
    if (!m) return null;
    let hour = parseInt(m[1], 10);
    const min = m[2] ? parseInt(m[2], 10) : 0;
    let period = m[3] ? m[3].toLowerCase() : null;
    if (min > 59) return null;
    if (period && (hour < 1 || hour > 12)) return null;
    if (!period && (hour < 0 || hour > 23)) return null;
    if (period === 'ص') period = 'am';
    if (period === 'م') period = 'pm';
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    if (!period && hour >= 1 && hour <= 5) hour += 12;
    return hour + min / 60;
  }
  const TIME_TOKEN = '\\d{1,2}(?::\\d{2})?\\s*(?:am|pm|ص|م)?';
  function extractTimeRange(text) {
    text = normalizeTimePhrase(text);
    const re = /(?:\bbetween\s+|\bfrom\s+|من\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)\s*(?:to|and|-|–|until|till|إلى|حتى|و)\s*(?:الساعة\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)/i;
    const m = text.match(re);
    if (m) {
      let a = m[1].trim(), b = m[2].trim();
      const pa = a.match(/\b(am|pm|ص|م)\b/i);
      const pb = b.match(/\b(am|pm|ص|م)\b/i);
      const h1 = parseInt(a, 10), h2 = parseInt(b, 10);
      if (!pa && pb) {
        const p2 = pb[1].toLowerCase();
        if ((p2 === 'pm' || p2 === 'م') && h2 === 12 && h1 >= 10 && h1 <= 11) a += ' am';
        else if ((p2 === 'am' || p2 === 'ص') && h2 === 12 && h1 >= 10 && h1 <= 11) a += ' pm';
        else a += ' ' + pb[1];
      }
      if (pa && !pb) {
        const p1 = pa[1].toLowerCase();
        if ((p1 === 'am' || p1 === 'ص') && h1 >= 10 && h1 <= 11 && h2 === 12) b += ' pm';
        else if ((p1 === 'pm' || p1 === 'م') && h1 >= 10 && h1 <= 11 && h2 === 12) b += ' am';
        else b += ' ' + pa[1];
      }
      const start = parseTimeToken(a), end = parseTimeToken(b);
      if (start !== null && end !== null) return { start, end: end <= start ? end + 24 : end };
    }
    return null;
  }
  function extractDuration(text) {
    text = normalizeDigits(text);
    const m = text.match(/(?:for|لمدة)\s+(\d+(?:\.\d+)?)\s*(hour|hr|hours|hrs|minute|min|minutes|mins|ساعة|ساعات|دقيقة|دقائق)/i);
    if (m) {
      let val = parseFloat(m[1]);
      if (/min|دقيق/i.test(m[2])) val = val / 60;
      return val;
    }
    return null;
  }
  function extractSingleTime(text) {
    text = normalizeTimePhrase(text);
    // Arabic letters are not treated as JS \b word characters, so keep the Arabic
    // prepositions outside the ASCII word-boundary branch. Also accept a bare time
    // when it carries an explicit AM/PM marker: "8 مساء", "8 م", "8 pm".
    const anchored = text.match(/(?:\bat\b|في|الساعة)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)/i);
    if (anchored) return parseTimeToken(anchored[1]);
    const explicitPeriod = text.match(/(?:^|\s)(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م))(?=$|\s|[،,.])/i);
    return explicitPeriod ? parseTimeToken(explicitPeriod[1]) : null;
  }
  const SYNONYMS_EN = {
    "Gym": ["gym", "workout", "exercise", "training", "fitness"],
    "Work (home)": ["work", "work from home", "home work", "office", "job"],
    "Lunch": ["lunch", "meal", "midday meal"],
    "Walk": ["walk", "walking", "stroll"],
    "App development": ["app", "application", "coding", "development", "programming"],
    "Qur'an & reading": ["quran", "qur'an", "reading", "read"],
    "Sleep": ["sleep", "bed", "bedtime", "nap", "napping", "siesta"],
    "Call home": ["call home", "family call", "call family"],
    "Wind down": ["wind down", "relax", "relaxing", "rest"],
    "Job search / swim": ["job search", "job hunting", "swim", "swimming"]
  };
  // Common speech-to-text confusions. These are NEVER auto-executed; they trigger confirmation.
  const SPEECH_VARIANTS = {
    "Gym": ["jim", "gem", "gim", "جين", "الجين", "قيم"],
    "Walk": ["wok", "wall", "ووك"],
    "Lunch": ["launch", "لانش"],
    "Qur'an & reading": ["koran", "qoran", "قران"],
    "App development": ["app develop", "application develop", "اب"],
    "Wind down": ["windown", "ويند داون"]
  };

  const SYNONYMS_AR = {
    "Gym": ["الجيم", "النادي", "الرياضة", "نادي رياضي", "تمرين", "رياضتي"],
    "Work (home)": ["العمل", "الشغل", "دوام", "شغلي"],
    "Lunch": ["الغداء", "غداء", "الغدا"],
    "Walk": ["المشي", "مشي", "المشية"],
    "App development": ["التطبيق", "تطبيقي", "البرمجة", "تطوير", "التطبيق الخاص بي"],
    "Qur'an & reading": ["القرآن", "قرآن", "قراءة", "القراءة"],
    "Sleep": ["النوم", "نوم", "قيلولة", "غفوة"],
    "Call home": ["اتصال", "العائلة", "الاهل", "أهلي"],
    "Wind down": ["استرخاء", "راحة"],
    "Job search / swim": ["السباحة", "سباحة", "وظيفة", "عمل جديد", "البحث عن عمل"],
  };
  function tokenize(s) {
    return s.toLowerCase().replace(/['’,.،]/g, '').split(/\s+/).filter(Boolean);
  }
  function activityAliases(value) {
    const block = value && typeof value === 'object' ? value : null;
    const label = block ? (block.labelEn || block.label || '') : String(value || '');
    const labelAr = block ? (block.labelAr || '') : (ACTIVITY_TRANSLATIONS[label] || BLOCK_LABELS_AR[label] || '');
    return [label, labelAr, ...(SYNONYMS_EN[label] || []), ...(SYNONYMS_AR[label] || [])]
      .filter(Boolean).map(x => x.toLowerCase().trim());
  }

  function textContainsAlias(text, alias) {
    const normalizedText = text.toLowerCase();
    const words = tokenize(text);
    if (alias.includes(' ')) return normalizedText.includes(alias);
    return words.includes(alias);
  }

  function findMatchingBlock(text, forcedLabel = null) {
    let matches = blocks.filter(b => {
      if (forcedLabel) return b.label === forcedLabel || b.labelEn === forcedLabel || b.labelAr === forcedLabel;
      return activityAliases(b).some(alias => textContainsAlias(text, alias));
    });

    // Safe fallback: exact alias matching found nothing, so try a simple
    // prefix/stem match against the block's OWN label only (e.g. "run" vs
    // "running"). This deliberately never touches the SYNONYMS_EN/AR lists —
    // those cross-category words are what caused false positives before —
    // so this only ever matches an activity's actual name, just with looser
    // word-ending tolerance.
    if (!matches.length && !forcedLabel) {
      const words = tokenize(text);
      matches = blocks.filter(b => {
        const labelWords = tokenize(`${b.labelEn || b.label || ''} ${b.labelAr || ''}`);
        return labelWords.some(lw => words.some(w =>
          w.length >= 3 && lw.length >= 3 && (lw.startsWith(w) || w.startsWith(lw))
        ));
      });
    }

    if (!matches.length) return null;
    if (matches.length === 1) return matches[0];

    const range = extractTimeRange(text);
    const single = range ? range.start : extractSingleTime(text);
    if (single !== null) {
      return matches.slice().sort((a, b) => Math.abs(a.start - single) - Math.abs(b.start - single))[0];
    }
    const hf = currentHourFraction(new Date());
    const active = matches.find(b => (hf >= b.start && hf < Math.min(b.end, 24)) || (b.end > 24 && hf < b.end - 24));
    return active || matches.find(b => !b.done) || matches[0];
  }

  function levenshtein(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    const dp = Array.from({length:a.length+1}, (_,i) => [i]);
    for (let j=1;j<=b.length;j++) dp[0][j]=j;
    for (let i=1;i<=a.length;i++) {
      for (let j=1;j<=b.length;j++) {
        const cost = a[i-1] === b[j-1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
      }
    }
    return dp[a.length][b.length];
  }

  function fuzzySimilarity(a, b) {
    if (!a || !b) return 0;
    return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
  }

  function commandTargetText(text) {
    let t = normalizeDigits(text.toLowerCase());
    t = t.replace(/^(remove|delete|cancel|erase|drop|add|schedule|set|put|insert|create|change|move|update|rename|modify|edit|shift)\b\s*/i, '');
    for (const words of [AR_REMOVE_WORDS, AR_ADD_WORDS, AR_CHANGE_WORDS]) {
      const stripped = stripLeadingArabicKeyword(t, words);
      if (stripped !== null) { t = stripped; break; }
    }
    t = t.replace(new RegExp(`(${TIME_TOKEN})\s*(?:to|-|–|until|till|إلى|حتى)\s*(${TIME_TOKEN})`, 'ig'), ' ');
    t = t.replace(new RegExp(`\b(?:at|from|for|في|الساعة|من|لمدة)\s+(${TIME_TOKEN})`, 'ig'), ' ');
    t = t.replace(/\b(?:for|لمدة)\s+\d+(?:\.\d+)?\s*(?:hour|hr|hours|hrs|minute|min|minutes|mins|ساعة|ساعات|دقيقة|دقائق)\b/ig, ' ');
    return t.replace(/[,.،]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function isExplicitCommand(text) {
    const lower = normalizeDigits(text.trim()).toLowerCase();
    if (/^(add|schedule|set|put|insert|create|remove|delete|cancel|erase|drop|change|move|update|rename|modify|edit|shift)\b/i.test(lower)) return true;
    for (const words of [AR_ADD_WORDS, AR_REMOVE_WORDS, AR_CHANGE_WORDS]) {
      if (stripLeadingArabicKeyword(text, words) !== null) return true;
    }
    return false;
  }

  function suggestActivity(text) {
    // Explicit add/remove/change commands have clear intent — don't second-guess
    // them against unrelated existing activities. Fuzzy "did you mean" only makes
    // sense for a bare completion report ("did the gym" / "jym done").
    if (isExplicitCommand(text)) return null;
    // If a normal synonym already matches, there is no uncertainty to confirm.
    if (findMatchingBlock(text)) return null;
    const target = commandTargetText(text);
    if (!target) return null;
    const targetWords = tokenize(target);
    let best = null;
    const labels = [...new Set(blocks.map(b => b.label))];
    for (const label of labels) {
      const speechHints = (SPEECH_VARIANTS[label] || []).map(x => x.toLowerCase());
      if (speechHints.some(h => target === h || targetWords.includes(h))) {
        return { label, score: 0.99 };
      }
      const aliases = activityAliases(label);
      for (const alias of aliases) {
        const aliasWords = tokenize(alias);
        for (const tw of targetWords) {
          for (const aw of aliasWords) {
            if (Math.min(tw.length, aw.length) < 3) continue;
            const score = fuzzySimilarity(tw, aw);
            if (!best || score > best.score) best = { label, score };
          }
        }
      }
    }
    return best && best.score >= 0.66 ? best : null;
  }

  function extractNote(text) {
    const m = text.match(/(?:\b(?:completed|finished|read|did)\b|(?:أنجزت|أكملت|كملت|قرأت|صليت|انتهيت من|انتهيت|فعلت|عملت))\s+(.*)$/i);
    if (m && m[1]) {
      let note = m[1].trim().replace(/^(the|a|an)\s+/i, '');
      if (note.length > 1 && note.length < 80) return note.charAt(0).toUpperCase() + note.slice(1);
    }
    return "";
  }
  const PRAYER_ALIASES = {
    Fajr: ['fajr','fajr prayer','dawn prayer','الفجر','صلاة الفجر','فجر'],
    Sunrise: ['sunrise','sunrise prayer','الشروق','شروق'],
    Zohr: ['zohr','zuhr','dhuhr','dhuhur','dhuhr prayer','zuhr prayer','noon prayer','الظهر','ظهر','صلاة الظهر'],
    Asr: ['asr','asr prayer','العصر','عصر','صلاة العصر'],
    Maghrib: ['maghrib','maghrib prayer','المغرب','مغرب','صلاة المغرب'],
    Isha: ['isha','isha prayer','ishaa','العشاء','عشاء','صلاة العشاء']
  };

  function normalizePrayerPhrase(v) {
    return normalizeArabicText(String(v || '').toLowerCase())
      .replace(/[.,،!?]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }

  function findMatchingPrayerLabel(text) {
    const normalized = normalizePrayerPhrase(text);
    for (const label of PRAYER_LABELS) {
      for (const alias of PRAYER_ALIASES[label] || []) {
        const a = normalizePrayerPhrase(alias);
        if (normalized === a || normalized.includes(a)) return label;
      }
    }
    return null;
  }
  function isDuhaPrayer(text) {
    const t = String(text || '').replace(/[ًٌٍَُِّْ]/g, '');
    return /(?:صلاة\s*)?ال?ضحى/.test(t);
  }
  function extractDuhaTime(text) {
    const normalized = normalizeTimePhrase(text);
    const m = normalized.match(/(?:في\s+|الساعة\s*)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)/i);
    if (!m) return null;
    let token = m[1].trim();
    // Duha is a morning prayer. If no period was spoken, interpret 1–11 as AM.
    if (!/(?:am|pm|ص|م)/i.test(token)) {
      const h = parseInt(token, 10);
      if (h >= 1 && h <= 11) token += ' am';
    }
    return parseTimeToken(token);
  }
  function parsePrayerTime(token, label) {
    token = normalizeDigits(token.trim());
    const m = token.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|ص|م)?/i);
    if (!m) return null;
    let hour = parseInt(m[1], 10);
    const min = m[2] ? parseInt(m[2], 10) : 0;
    let period = m[3] ? m[3].toLowerCase() : null;
    if (min > 59) return null;
    if (period && (hour < 1 || hour > 12)) return null;
    if (!period && (hour < 0 || hour > 23)) return null;
    if (period === 'ص') period = 'am';
    if (period === 'م') period = 'pm';
    if (!period) period = (label === 'Fajr' || label === 'Sunrise') ? 'am' : 'pm';
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    return hour + min / 60;
  }
  function extractTimeRangeForPrayer(text, label) {
    text = normalizeDigits(text);
    const re = new RegExp(`(${TIME_TOKEN})\\s*(?:to|-|–|until|till|إلى|حتى)\\s*(${TIME_TOKEN})`, 'i');
    const m = text.match(re);
    if (m) {
      const start = parsePrayerTime(m[1], label), end = parsePrayerTime(m[2], label);
      if (start !== null && end !== null) return { start, end };
    }
    return null;
  }
  function extractSingleTimeForPrayer(text, label) {
    text = normalizeDigits(text);
    const re = new RegExp(`(${TIME_TOKEN})\\s*$`, 'i');
    const m = text.match(re);
    return m ? parsePrayerTime(m[1], label) : null;
  }
  const VERB_NORMALIZE = {
    'read':'Read','reading':'Read',
    'do':'Do','did':'Do','doing':'Do','done':'Do',
    'pray':'Pray','prayed':'Pray','praying':'Pray',
    'walk':'Walk','walked':'Walk','walking':'Walk',
    'swim':'Swim','swam':'Swim','swimming':'Swim',
    'run':'Run','ran':'Run','running':'Run',
    'work':'Work','worked':'Work','working':'Work',
    'attend':'Attend','attended':'Attend','attending':'Attend',
    'finish':'Finish','finished':'Finish','finishing':'Finish',
    'complete':'Complete','completed':'Complete','completing':'Complete',
    'go':'Go','went':'Go','going':'Go',
    'cook':'Cook','cooked':'Cook','cooking':'Cook',
    'clean':'Clean','cleaned':'Clean','cleaning':'Clean',
    'write':'Write','wrote':'Write','writing':'Write',
    'call':'Call','called':'Call','calling':'Call',
    'study':'Study','studied':'Study','studying':'Study',
    'exercise':'Exercise','exercised':'Exercise','exercising':'Exercise',
    'train':'Train','trained':'Train','training':'Train',
    'jog':'Jog','jogged':'Jog','jogging':'Jog',
    'meditate':'Meditate','meditated':'Meditate','meditating':'Meditate',
    'perform':'Perform','performed':'Perform','performing':'Perform',
    'practice':'Practice','practiced':'Practice','practising':'Practice','practicing':'Practice',
    'review':'Review','reviewed':'Review','reviewing':'Review',
    'prepare':'Prepare','prepared':'Prepare','preparing':'Prepare',
    'plan':'Plan','planned':'Plan','planning':'Plan',
    'check':'Check','checked':'Check','checking':'Check',
    'update':'Update','updated':'Update','updating':'Update',
    'submit':'Submit','submitted':'Submit','submitting':'Submit',
    'send':'Send','sent':'Send','sending':'Send',
  };
  const FILLER_LEADERS = ['daily','my','the','a','an','some','today','this','that','every','each'];

  function normalizeActionName(text) {
    let words = text.trim().split(/\s+/).filter(Boolean);
    while (words.length && FILLER_LEADERS.includes(words[0].toLowerCase())) words.shift();
    if (!words.length) return 'Activity';
    const firstLower = words[0].toLowerCase();
    const secondLower = words[1] ? words[1].toLowerCase() : '';
    if (firstLower === 'worked' && secondLower === 'on') words.splice(0, 2, 'Work');
    else if (firstLower === 'went' && secondLower === 'to') words.splice(0, 2, 'Go', 'to');
    else if (VERB_NORMALIZE[firstLower]) words[0] = VERB_NORMALIZE[firstLower];
    else words.unshift('Perform');
    const joined = words.join(' ');
    return joined.charAt(0).toUpperCase() + joined.slice(1);
  }

  function cleanActivityPhrase(text) {
    let t = normalizeTimePhrase(text)
      .replace(/^(?:please\s+)?(?:i\s+(?:want|would like)\s+to\s+|i\s+want\s+|أنا\s+)/i, '')
      .replace(/^(?:add|schedule|set|put|insert|create)\s+/i, '')
      .trim();
    const rangeRe = /(?:\bbetween\s+|\bfrom\s+|(?:من|بين)\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)\s*(?:to|and|-|–|until|till|إلى|حتى|و)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)/ig;
    t = t.replace(rangeRe, ' ');
    t = t.replace(/\b(?:for|لمدة)\s+\d+(?:\.\d+)?\s*(?:hour|hr|hours|hrs|minute|min|minutes|mins|ساعة|ساعات|دقيقة|دقائق)\b/ig, ' ');
    t = t.replace(/\b(?:at|from)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/ig, ' ');
    t = t.replace(/(?:^|\s)(?:في\s+)?(?:الساعة\s*)?\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?(?=$|\s|[،,.])/ig, ' ');
    t = t.replace(/\b(?:today|this morning|this afternoon|this evening|tonight|sometime|some time)\b/ig, ' ');
    t = t.replace(/(?:الليلة|هذا المساء|مساء اليوم|في المساء)/g, ' ');
    t = t.replace(/\b(?:completed|finished|done|أنجزت|أكملت|كملت)\b.*/i, ' ');
    return t.replace(/[,.،]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function semanticActivityName(text) {
    const raw = cleanActivityPhrase(text);
    const low = raw.toLowerCase();
    if (!raw) return 'Activity';
    if (/\b(?:take|have)?\s*(?:a\s+)?(?:nap|napping|siesta)\b/i.test(low)) return 'Nap';
    if (/\b(?:go\s+)?(?:swim|swimming)\b/i.test(low)) return 'Swimming';
    if (/\b(?:go\s+to\s+the\s+)?gym\b/i.test(low) || /\b(?:workout|exercise|fitness|weight training|strength training|sport class|sports class)\b/i.test(low)) return 'Gym';
    if (/\b(?:walk|walking|stroll)\b/i.test(low)) return 'Walk';
    if (/\b(?:run|running|jog|jogging)\b/i.test(low)) return 'Run';
    if (/\b(?:dinner|supper|evening meal)\b/i.test(low)) return 'Dinner';
    if (/\b(?:lunch|midday meal)\b/i.test(low)) return 'Lunch';
    if (/[\u0600-\u06FF]/.test(raw)) {
      if (/(قيلولة|غفوة)/.test(raw)) return 'قيلولة';
      if (/(سباحة|اسبح|أسبح)/.test(raw)) return 'سباحة';
      if (/(جيم|النادي|نادي رياضي|تمرين رياضي|تمارين|رياضة|لياقة)/.test(raw)) return 'Gym';
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
    return normalizeActionName(raw);
  }

  function guessActivityName(text) {
    return semanticActivityName(text);
  }

  const AR_REMOVE_WORDS = ['احذف', 'امسح', 'ازل', 'إزالة', 'الغاء', 'ألغِ', 'الغِ', 'شيل', 'شيله', 'احذفه'];
  const AR_ADD_WORDS = ['أضف', 'اضف', 'ضع', 'جدول', 'جدولة', 'ضيف', 'زِد', 'زد', 'حط'];
  const AR_CHANGE_WORDS = ['غير', 'غيّر', 'عدل', 'عدّل', 'حرك', 'حرّك', 'غيّره', 'عدله', 'قدّم', 'قدم', 'أخّر', 'اخر'];

  function stripLeadingArabicKeyword(text, keywords) {
    const trimmed = text.trim();
    for (const k of keywords) {
      if (trimmed === k) return '';
      if (trimmed.startsWith(k + ' ')) return trimmed.slice(k.length).trim();
    }
    return null;
  }

  function msg(key, ...vars) {
    const L = currentLang;
    const T = {
      removed: { en: (n) => `Removed "${n}".`, ar: (n) => `تم حذف "${n}".` },
      removeNotFound: { en: (q) => `Couldn't find an activity matching "${q}" to remove.`, ar: (q) => `لم يتم العثور على نشاط مطابق لـ "${q}" للحذف.` },
      addNoTime: { en: () => `Couldn't find a time in that — try "add gym at 7:30 to 8:30".`, ar: () => `لم يتم العثور على وقت — جرّب "أضف الجيم الساعة 7:30 إلى 8:30".` },
      added: { en: (n, s, e) => `Added "${n}" — ${s} to ${e}.`, ar: (n, s, e) => `تمت إضافة "${n}" — من ${s} إلى ${e}.` },
      prayerUpdated: { en: (l, t) => `Updated ${l} to ${t}.`, ar: (l, t) => `تم تحديث ${l} إلى ${t}.` },
      prayerNoTime: { en: (l) => `Found "${l}" but couldn't find a new time — try "change fajr to 5:30am".`, ar: (l) => `تم العثور على "${l}" لكن لم يتم تحديد وقت جديد — جرّب "غيّر الفجر إلى 5:30".` },
      updateNotFound: { en: () => `Couldn't find an activity matching that to update.`, ar: () => `لم يتم العثور على نشاط مطابق للتحديث.` },
      updated: { en: (n, s, e) => `Updated "${n}" to ${s}–${e}.`, ar: (n, s, e) => `تم تحديث "${n}" إلى ${s}–${e}.` },
      updateNoTime: { en: (n) => `Found "${n}" but couldn't find a new time — try "change gym to 6:30 to 7:30".`, ar: (n) => `تم العثور على "${n}" لكن لم يتم تحديد وقت جديد.` },
      markedDone: { en: (n, note) => `Marked "${n}" as done${note ? ' — noted: ' + note : ''}.`, ar: (n, note) => `تم تسجيل "${n}" كمكتمل${note ? ' — ملاحظة: ' + note : ''}.` },
      unmatched: { en: (n) => `"${n}" isn't on your schedule yet — added it under "Activities not in the list" so you can add it or ignore it.`, ar: (n) => `"${n}" ليس في جدولك بعد — تمت إضافته ضمن "أنشطة غير مدرجة" حتى تتمكن من إضافته أو تجاهله.` },
      actuallyDone: { en: (s, e) => `Actually done ${s}–${e}`, ar: (s, e) => `تم فعلياً من ${s} إلى ${e}` },
      tookAbout: { en: (d) => `Took about ${d}`, ar: (d) => `استغرق حوالي ${d}` },
    };
    return T[key][L](...vars);
  }

  function hasCompletionIntent(text) {
    return /\b(?:done|did|completed|finished|marked|actually did|actually done|worked on|prayed)\b/i.test(text)
      || /(?:أنجزت|أكملت|كملت|خلصت|انتهيت|فعلت|عملت|صليت)/.test(text);
  }

  function hasSchedulingIntent(text) {
    if (isExplicitCommand(text)) return true;
    const normalized = normalizeTimePhrase(text);
    const hasRangeLanguage = /\b(?:between|from)\b/i.test(normalized) || extractTimeRange(normalized) !== null;
    const hasAtTime = extractSingleTime(normalized) !== null;
    const hasRelative = !!relativeAnchor(normalized) || !!extractDaypartIntent(normalized);
    return !hasCompletionIntent(normalized) && (hasRangeLanguage || hasAtTime || hasRelative);
  }

  function addOrReplaceScheduledActivity(name, start, end, options = {}) {
    // User-owned schedule: duplicates/overlaps are valid. Never replace another activity automatically.
    const color = PALETTE[blocks.length % PALETTE.length];
    const pair = makeActivityPair(name, currentLang);
    const openEnded = !!options.openEnded;
    // The dial renderer still needs a finite visual span. Keep that rendering detail separate
    // from the user's scheduling intent by marking the block openEnded.
    const visualEnd = Number.isFinite(end) ? end : (Number.isFinite(start) ? start + 0.25 : end);
    const block = { id: nextId(), start, end: visualEnd, openEnded, ...pair, color, done: false, note: '' };
    blocks.push(block);
    sortBlocks(); saveBlocks(); renderAll();
    const m = openEnded
      ? (currentLang === 'ar' ? `تمت إضافة "${name}" — ${fmtClock12(start)}.` : `Added "${name}" — ${fmtClock12(start)}.`)
      : msg('added', name, fmtClock12(start), fmtClock12(visualEnd));
    addLog('Add', m, block.id);
    return { message:m, blockId:block.id, name, start, end: openEnded ? null : visualEnd, openEnded };
  }

  function affirmativeReply(raw) {
    const t = normalizeDigits(String(raw || '')).trim().toLowerCase();
    return /^(?:yes|yep|yeah|sure|ok|okay|confirm|do it|نعم|اي|أجل|اجل|تمام|موافق)$/.test(t);
  }
  function negativeReply(raw) {
    const t = normalizeDigits(String(raw || '')).trim().toLowerCase();
    return /^(?:no|nope|cancel|not now|لا|كلا|الغ|إلغاء|الغاء)$/.test(t);
  }
  function extractDaypartIntent(raw) {
    const t = normalizeTimePhrase(raw).toLowerCase();
    if (/\b(?:tonight|this evening)\b/.test(t) || /(?:الليلة|هذا المساء|مساء اليوم)/.test(String(raw || ''))) return 'tonight';
    if (/\bthis morning\b/.test(t) || /(?:هذا الصباح|صباح اليوم)/.test(String(raw || ''))) return 'morning';
    if (/\bthis afternoon\b/.test(t) || /(?:بعد الظهر اليوم|هذا بعد الظهر)/.test(String(raw || ''))) return 'afternoon';
    return null;
  }
  function daypartPrompt(kind, label='') {
    const q = kind === 'morning' ? (currentLang==='ar'?'هذا الصباح':'this morning')
      : kind === 'afternoon' ? (currentLang==='ar'?'بعد الظهر':'this afternoon')
      : (currentLang==='ar'?'هذا المساء':'tonight');
    return currentLang === 'ar'
      ? `ما الوقت بالتحديد لـ «${label}» ${q}؟ مثلاً: الساعة 8 مساءً.`
      : `What exact time should I use for “${label}” ${q}? For example, 8 PM.`;
  }
  function relativeAnchor(raw) {
    const source = String(raw || '');
    const m = source.match(/\b(after|before)\s+(.+?)(?=$|[,.،])/i) || source.match(/(?:^|\s)(بعد|قبل)\s+(.+?)(?=$|[,.،])/);
    if (!m) return null;
    const relation = /^(?:after|بعد)$/i.test(m[1]) ? 'after' : 'before';
    let anchorText = String(m[2] || '').trim()
      .replace(/\b(?:today|tonight|this evening|this morning|this afternoon)\b/ig,' ')
      .replace(/\b(?:the\s+)?(?:prayer\s+)?time\b/ig,' ')
      .replace(/\bthe\s+(?=(?:fajr|dhuhr|zuhr|zohr|asr|maghrib|isha)\b)/ig,' ')
      .replace(/(?:اليوم|الليلة|هذا المساء|هذا الصباح)/g,' ')
      .replace(/(?:وقت\s*الصلاة|وقت)/g,' ')
      .trim();
    if (!anchorText) return null;
    const prayer = findMatchingPrayerLabel(anchorText);
    if (prayer) {
      const p = prayers.find(x => x.label === prayer);
      if (p) return { relation, type:'prayer', anchorText, anchorLabel:prayerDisplayLabel(prayer), time:Number(p.time) };
    }
    const block = findMatchingBlock(anchorText);
    if (block) return { relation, type:'activity', anchorText, anchorLabel:blockDisplayLabel(block), block };
    return { relation, type:'unknown', anchorText, anchorLabel:anchorText };
  }
  function relativeTimes(relative, duration=.5) {
    if (!relative || relative.type === 'unknown') return null;
    const gap=.25; // 15-minute breathing room between linked activities.
    if (relative.type === 'prayer') {
      const anchor=Number(relative.time);
      const start = relative.relation === 'after' ? anchor + gap : anchor - gap - duration;
      return { start:Math.max(0,start), end:Math.max(0,start)+duration };
    }
    const b=relative.block;
    const start = relative.relation === 'after' ? Number(b.end)+gap : Number(b.start)-gap-duration;
    return { start:Math.max(0,start), end:Math.max(0,start)+duration };
  }

  const COMMAND_I18N = {
    exactTimeTonight: {
      en: label => `What exact time should I use for “${label}” tonight? For example, 8 PM.`,
      ar: label => `ما الوقت بالتحديد لـ «${label}» هذا المساء؟ مثلاً: الساعة 8 مساءً.`
    },
    relativeConfirm: {
      en: (label,time,relation,anchor) => `Schedule “${label}” at ${time}, 15 minutes ${relation} “${anchor}”? Say yes or give me another time.`,
      ar: (label,time,relation,anchor) => `هل تريد «${label}» الساعة ${time}، أي ${relation} «${anchor}» بـ 15 دقيقة؟ قل نعم أو أعطني وقتاً آخر.`
    }
  };
  function commandText(key, ...args) {
    const row = COMMAND_I18N[key];
    return row ? row[currentLang](...args) : '';
  }

  function relativeConfirmPrompt(label, rel, times) {
    const relationText = currentLang === 'ar'
      ? (rel.relation === 'after' ? 'بعد' : 'قبل')
      : rel.relation;
    return commandText('relativeConfirm', label, fmtClock12(times.start), relationText, rel.anchorLabel);
  }

  let pendingScheduleIntent = null;

  function extractLooseTime(text) {
    const normalized = normalizeTimePhrase(text);
    const direct = normalized.match(/^\s*(?:to\s+|إلى\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)\s*$/i);
    if (direct) return parseTimeToken(direct[1]);
    const anywhere = normalized.match(/(?:to|إلى|at|في|الساعة)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?)/i);
    return anywhere ? parseTimeToken(anywhere[1]) : null;
  }

  function pendingPrompt(kind, label = '') {
    if (currentLang === 'ar') {
      if (kind === 'add-time') return `في أي وقت تريد جدولة «${label}»؟ يمكنك قول: من ٤ إلى ٥ مساءً.`;
      if (kind === 'update-time') return `ما الوقت الجديد لـ «${label}»؟ يمكنك قول: إلى ٦ مساءً أو من ٦ إلى ٧ مساءً.`;
      return 'أي نشاط تريد تحديث وقته؟';
    }
    if (kind === 'add-time') return `What time should I schedule “${label}”? You can say “4 PM to 5 PM”.`;
    if (kind === 'update-time') return `What is the new time for “${label}”? You can say “to 6 PM” or “6 PM to 7 PM”.`;
    return 'Which activity do you want to update?';
  }

  function resolvePendingScheduleIntent(text) {
    if (!pendingScheduleIntent) return null;
    const p = pendingScheduleIntent;

    if (p.type === 'confirm-relative-add' || p.type === 'confirm-relative-update') {
      if (affirmativeReply(text)) {
        pendingScheduleIntent = null;
        if (p.type === 'confirm-relative-add') return addOrReplaceScheduledActivity(p.name, p.start, p.end);
        const block = blocks.find(b => b.id === p.blockId);
        if (!block) return msg('updateNotFound');
        block.start=p.start; block.end=p.end;
        clearReminderStateForBlock(block.id); sortBlocks(); saveBlocks(); renderAll();
        const m=msg('updated', blockDisplayLabel(block), fmtClock12(block.start), fmtClock12(block.end));
        addLog('Edit',m,block.id); return m;
      }
      if (negativeReply(text)) {
        const label = p.name || blockDisplayLabel(blocks.find(b=>b.id===p.blockId) || {label:'Activity'});
        pendingScheduleIntent = { type: p.type === 'confirm-relative-add' ? 'add-time' : 'update-time', name:p.name, blockId:p.blockId };
        return pendingPrompt(p.type === 'confirm-relative-add' ? 'add-time' : 'update-time', label);
      }
      // A concrete replacement time can override the suggestion immediately.
      const replacementRange=extractTimeRange(text);
      const replacementSingle=extractSingleTime(text) ?? extractLooseTime(text);
      if (replacementRange || replacementSingle !== null) {
        if (p.type === 'confirm-relative-add') {
          pendingScheduleIntent=null;
          const s=replacementRange?replacementRange.start:replacementSingle;
          const e=replacementRange?replacementRange.end:s+Math.max(.25,p.end-p.start);
          return addOrReplaceScheduledActivity(p.name,s,e);
        }
        const block=blocks.find(b=>b.id===p.blockId); pendingScheduleIntent=null;
        if(!block)return msg('updateNotFound');
        const duration=Math.max(.25,block.end-block.start);
        block.start=replacementRange?replacementRange.start:replacementSingle;
        block.end=replacementRange?replacementRange.end:block.start+duration;
        clearReminderStateForBlock(block.id); sortBlocks(); saveBlocks(); renderAll();
        const m=msg('updated',blockDisplayLabel(block),fmtClock12(block.start),fmtClock12(block.end)); addLog('Edit',m,block.id); return m;
      }
      return p.prompt;
    }

    const range = extractTimeRange(text);
    const single = extractSingleTime(text) ?? extractLooseTime(text);

    if (p.type === 'add-time' && (range || single !== null)) {
      pendingScheduleIntent = null;
      const start = range ? range.start : single;
      const end = range ? range.end : start + 0.5;
      return addOrReplaceScheduledActivity(p.name, start, end);
    }

    if (p.type === 'update-time' && p.blockId && (range || single !== null)) {
      const block = blocks.find(b => b.id === p.blockId);
      pendingScheduleIntent = null;
      if (!block) return msg('updateNotFound');
      if (range) { block.start = range.start; block.end = range.end; }
      else {
        const duration = Math.max(0.25, block.end - block.start);
        block.start = single; block.end = single + duration;
      }
      sortBlocks(); saveBlocks(); renderAll();
      const m = msg('updated', blockDisplayLabel(block), fmtClock12(block.start), fmtClock12(block.end));
      addLog('Edit', m, block.id);
      return m;
    }

    if (p.type === 'choose-update-target') {
      const match = findMatchingBlock(text);
      if (match) {
        pendingScheduleIntent = { type: 'update-time', blockId: match.id };
        return resolvePendingScheduleIntent(p.range ? `${fmtClock12(p.range.start)} to ${fmtClock12(p.range.end)}` : p.single !== null ? fmtClock12(p.single) : '');
      }
    }
    return null;
  }

  function isScheduleResetIntent(raw) {
    const text = normalizeDigits(String(raw || '').trim());
    const lower = text.toLowerCase().replace(/[.!?،؛]+$/g, '').trim();
    if (!lower) return false;
    // Standalone reset / start-over requests are safe because execution always
    // requires a second confirmation. For longer phrases, require schedule/day context.
    if (/^(?:reset|start over|start again|clear everything|erase everything|delete everything)$/i.test(lower)) return true;
    if (/\b(?:reset|clear|erase|wipe|delete)\b[\s\S]*\b(?:my\s+)?(?:daily\s+)?(?:schedule|rhythm|day|activities)\b/i.test(lower)) return true;
    if (/\b(?:reset|clear|erase|wipe)\b[\s\S]*\b(?:everything|all activities|whole schedule|entire schedule)\b/i.test(lower)) return true;
    if (/^(?:إعادة\s*ضبط|اعادة\s*ضبط|إلغاء|الغاء|ألغي|الغي|ألغِ|الغِ|صف[ّ]?ر|صفر|امسح|إمسح|افرغ|أفرغ|احذف|إحذف)\s*(?:لي\s*)?(?:كل\s*)?(?:ال)?(?:جدول|جدولي|الجدول|يومي|اليوم|أنشطتي|الأنشطة)/.test(text)) return true;
    if (/(?:ابدأ|إبدأ|ابدا)\s+(?:من\s+)?(?:جديد|البداية)/.test(text)) return true;
    if (/(?:امسح|إمسح|احذف|إحذف)\s+(?:كل|جميع)\s+(?:الأنشطة|انشطتي|أنشطتي|الجدول)/.test(text)) return true;
    return false;
  }

  function splitCompoundCommands(raw) {
    const text = normalizeDigits(String(raw || '').trim());
    if (!text) return [];

    // Strong separators are always command boundaries.
    let parts = text.split(/\s*(?:[;؛\n]+|\bthen\b|\band\s+also\b|\balso\s+(?=(?:add|schedule|set|put|insert|create|remove|delete|cancel|erase|drop|change|move|update|rename|modify|edit|shift)\b)|ثم|وبعدها|وبعدين)\s*/i)
      .map(x => x.trim()).filter(Boolean);

    const commandStart = /^(?:add|schedule|set|put|insert|create|remove|delete|cancel|erase|drop|change|move|update|rename|modify|edit|shift)\b/i;
    const arCommandStart = /^(?:أضف|اضف|ضع|جدول|جدولة|ضيف|زِد|زد|حط|احذف|امسح|ازل|إزالة|الغاء|ألغِ|الغِ|شيل|شيله|احذفه|غير|غيّر|عدل|عدّل|حرك|حرّك|غيّره|عدله|قدّم|قدم|أخّر|اخر)(?:\s|$)/;

    // Split "... and change ..." / "... و أضف ..." while preserving time
    // ranges such as "between 5 and 6" because the word after "and" must be a verb.
    const refined = [];
    for (const part of parts) {
      let chunks = part.split(/\s+(?:and\s+|و\s*)(?=(?:add|schedule|set|put|insert|create|remove|delete|cancel|erase|drop|change|move|update|rename|modify|edit|shift)\b|(?:أضف|اضف|ضع|جدول|جدولة|ضيف|زد|حط|احذف|امسح|ازل|غير|غيّر|عدل|عدّل|حرك|حرّك|قدم|قدّم|اخر|أخّر)(?:\s|$))/i)
        .map(x => x.trim()).filter(Boolean);
      // Natural add lists may omit the second verb: "add swimming 5–6 and cooking 6–7".
      // Split only when the text after AND looks like a named activity followed by
      // its own time phrase; this intentionally does not split "between 5 and 6".
      const implicit = [];
      for (const chunk of chunks) {
        const more = chunk.split(/\s+and\s+(?=[a-z][a-z '\/&-]{1,45}\s+(?:from|between|at)\s+\d)/i)
          .flatMap(x => x.split(/\s+و\s*(?=[\u0600-\u06FF][\u0600-\u06FF\s]{1,45}(?:من|بين|الساعة|في)\s*[٠-٩0-9])/))
          .map(x => x.trim()).filter(Boolean);
        implicit.push(...more);
      }
      refined.push(...implicit);
    }

    // If the first clause establishes ADD intent, allow natural follow-ons like
    // "add swimming 5 to 6 and cooking 6 to 7" without forcing the word add twice.
    const out = [];
    let inherited = null;
    for (let i = 0; i < refined.length; i++) {
      let clause = refined[i];
      if (commandStart.test(clause) || arCommandStart.test(clause)) {
        if (/^(?:add|schedule|set|put|insert|create)\b/i.test(clause) || stripLeadingArabicKeyword(clause, AR_ADD_WORDS) !== null) inherited = 'add';
        else inherited = null;
      } else if (i > 0 && inherited === 'add' && (extractTimeRange(clause) || extractSingleTime(clause) !== null)) {
        clause = (/[\u0600-\u06FF]/.test(clause) ? 'أضف ' : 'add ') + clause;
      }
      out.push(clause);
    }
    return out;
  }

  function parseCommandBatch(raw) {
    const commands = splitCompoundCommands(raw);
    if (commands.length <= 1) return parseCommand(raw);
    const results = [];
    let successful = 0;
    for (const command of commands) {
      const beforeSignature = JSON.stringify(blocks.map(b => [b.id,b.start,b.end,b.label,b.done,b.note]));
      const result = parseCommand(command);
      const afterSignature = JSON.stringify(blocks.map(b => [b.id,b.start,b.end,b.label,b.done,b.note]));
      if (beforeSignature !== afterSignature) successful++;
      results.push(result);
      // A missing detail creates a follow-up intent. Stop here rather than apply
      // later clauses against an ambiguous state.
      if (pendingScheduleIntent) break;
    }
    const prefix = currentLang === 'ar'
      ? `تم تنفيذ ${successful} من ${results.length} أوامر. `
      : `Processed ${successful} of ${results.length} commands. `;
    return prefix + results.join(currentLang === 'ar' ? ' • ' : ' • ');
  }


  // ---- Recurring activities + today/future exceptions ----
  const RECURRING_SERIES_KEY = 'dailyRhythmRecurringSeries_v1';
  const RECURRING_EXCEPTIONS_KEY = 'dailyRhythmRecurringExceptions_v1';
  let recurringSeries = [];
  let recurringExceptions = {};
  let recurrenceLastDate = '';

  function recurrenceDateKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function recurrenceExceptionKey(seriesId, dateKey) { return `${seriesId}|${dateKey}`; }
  function loadRecurringSeries() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECURRING_SERIES_KEY) || '[]');
      recurringSeries = Array.isArray(parsed) ? parsed.filter(s => s && s.id && s.rule) : [];
    } catch (_) { recurringSeries = []; }
    try {
      const parsed = JSON.parse(localStorage.getItem(RECURRING_EXCEPTIONS_KEY) || '{}');
      recurringExceptions = parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) { recurringExceptions = {}; }
  }
  function saveRecurringSeries() {
    try { localStorage.setItem(RECURRING_SERIES_KEY, JSON.stringify(recurringSeries)); } catch (_) {}
  }
  function saveRecurringExceptions() {
    try { localStorage.setItem(RECURRING_EXCEPTIONS_KEY, JSON.stringify(recurringExceptions)); } catch (_) {}
  }
  function recurrenceRuleMatches(rule, d = new Date()) {
    if (!rule) return false;
    const day = d.getDay();
    if (rule.type === 'daily') return true;
    if (rule.type === 'weekdays') return day >= 1 && day <= 5;
    if (rule.type === 'weekly') return Array.isArray(rule.days) && rule.days.includes(day);
    return false;
  }
  function recurrenceLabel(rule) {
    if (!rule) return currentLang === 'ar' ? 'متكرر' : 'Repeats';
    if (rule.type === 'daily') return currentLang === 'ar' ? '↻ يومياً' : '↻ Every day';
    if (rule.type === 'weekdays') return currentLang === 'ar' ? '↻ أيام الأسبوع' : '↻ Weekdays';
    if (rule.type === 'weekly') {
      const en=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const ar=['أحد','اثن','ثلا','أرب','خمي','جمع','سبت'];
      return `↻ ${(rule.days||[]).map(i => (currentLang === 'ar' ? ar : en)[i]).join(' · ')}`;
    }
    return currentLang === 'ar' ? '↻ متكرر' : '↻ Repeats';
  }
  function parseRecurrenceRule(raw) {
    const t = normalizeDigits(String(raw || '')).toLowerCase();
    if (/\b(?:every\s*day|daily)\b/.test(t) || /(?:كل\s*يوم|يومي[ًاا]?)/.test(t)) return {type:'daily'};
    if (/\b(?:every\s*weekday|weekdays?)\b/.test(t) || /(?:أيام\s*الأسبوع|ايام\s*الاسبوع)/.test(t)) return {type:'weekdays'};
    const dayDefs = [
      [0, /\b(?:sun(?:day)?s?)\b/i, /(?:الأحد|الاحد)/],
      [1, /\b(?:mon(?:day)?s?)\b/i, /(?:الاثنين|الإثنين)/],
      [2, /\b(?:tue(?:sday)?s?)\b/i, /(?:الثلاثاء)/],
      [3, /\b(?:wed(?:nesday)?s?)\b/i, /(?:الأربعاء|الاربعاء)/],
      [4, /\b(?:thu(?:rsday)?s?)\b/i, /(?:الخميس)/],
      [5, /\b(?:fri(?:day)?s?)\b/i, /(?:الجمعة)/],
      [6, /\b(?:sat(?:urday)?s?)\b/i, /(?:السبت)/]
    ];
    const repeatContext = /\b(?:every|each|on)\b/i.test(t) || /(?:كل|أيام|ايام)/.test(t);
    const days = dayDefs.filter(([_,en,ar]) => en.test(t) || ar.test(t)).map(([i]) => i);
    if (repeatContext && days.length) return {type:'weekly', days:[...new Set(days)]};
    return null;
  }
  function stripRecurrenceLanguage(raw) {
    return String(raw || '')
      .replace(/\b(?:every\s*day|daily|every\s*weekday|weekdays?)\b/ig,' ')
      .replace(/\b(?:every|each|on)\s+(?:sun(?:day)?s?|mon(?:day)?s?|tue(?:sday)?s?|wed(?:nesday)?s?|thu(?:rsday)?s?|fri(?:day)?s?|sat(?:urday)?s?)(?:\s*(?:,|and|&)\s*(?:sun(?:day)?s?|mon(?:day)?s?|tue(?:sday)?s?|wed(?:nesday)?s?|thu(?:rsday)?s?|fri(?:day)?s?|sat(?:urday)?s?))*/ig,' ')
      .replace(/(?:كل\s*يوم|يومي[ًاا]?|أيام\s*الأسبوع|ايام\s*الاسبوع)/g,' ')
      .replace(/\s+/g,' ').trim();
  }
  function normalizedActivityNeedle(s) {
    return normalizeDigits(String(s || '')).toLowerCase()
      .replace(/\b(?:add|schedule|set|put|insert|create|move|change|update|edit|shift|skip|cancel|delete|remove|stop|today|from now on|future|occurrences?|repeat(?:ing)?)\b/g,' ')
      .replace(/(?:أضف|اضف|جدول|غيّر|غير|حرّك|حرك|عدّل|عدل|تخطى|تجاوز|ألغ|الغ|اليوم|من الآن|من الان|القادمة|التكرار)/g,' ')
      .replace(/\b(?:at|from|to|until|for)\b/g,' ')
      .replace(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?/ig,' ')
      .replace(/\s+/g,' ').trim();
  }
  function findRecurringSeries(raw, forcedLabel = null) {
    const source = forcedLabel || normalizedActivityNeedle(stripRecurrenceLanguage(raw));
    const low = String(source || '').toLowerCase();
    if (!low) return null;
    const exact = recurringSeries.find(s => [s.labelEn,s.labelAr].some(v => String(v||'').toLowerCase() === low));
    if (exact) return exact;
    return recurringSeries.find(s => {
      const labels=[s.labelEn,s.labelAr].filter(Boolean).map(v=>String(v).toLowerCase());
      return labels.some(v => low.includes(v) || v.includes(low));
    }) || null;
  }
  function materializeRecurringForDate(d = new Date()) {
    const dateKey = recurrenceDateKey(d);
    recurrenceLastDate = dateKey;
    blocks = blocks.filter(b => !b.recurrenceGenerated || b.occurrenceDate === dateKey);

    recurringSeries.forEach((series, idx) => {
      if (series.activeFrom && series.activeFrom > dateKey) return;
      if (!recurrenceRuleMatches(series.rule, d)) return;
      const ex = recurringExceptions[recurrenceExceptionKey(series.id, dateKey)];
      if (ex?.type === 'skip') {
        blocks = blocks.filter(b => !(b.seriesId === series.id && b.occurrenceDate === dateKey));
        return;
      }
      let block = blocks.find(b => b.seriesId === series.id && b.occurrenceDate === dateKey);
      const start = ex?.type === 'override' && Number.isFinite(Number(ex.start)) ? Number(ex.start) : Number(series.start);
      const end = ex?.type === 'override' && Number.isFinite(Number(ex.end)) ? Number(ex.end) : Number(series.end);
      const labelEn = ex?.type === 'override' && ex.labelEn ? ex.labelEn : series.labelEn;
      const labelAr = ex?.type === 'override' && ex.labelAr ? ex.labelAr : series.labelAr;
      const note = ex?.type === 'override' && typeof ex.note === 'string' ? ex.note : (series.note || '');

      if (!block) {
        block = {
          id:`r_${series.id}_${dateKey}`,
          start,end,label:labelEn,labelEn,labelAr,
          color:series.color || PALETTE[idx % PALETTE.length],
          done:false,note,
          seriesId:series.id,occurrenceDate:dateKey,recurrence:series.rule,recurrenceGenerated:true
        };
        blocks.push(block);
      } else {
        block.start=start; block.end=end; block.label=labelEn; block.labelEn=labelEn; block.labelAr=labelAr;
        block.note=note; block.recurrence=series.rule; block.recurrenceGenerated=true;
      }
    });
    sortBlocks();
    saveBlocks();
  }
  function createRecurringSeries(name, start, end, rule) {
    const pair = makeActivityPair(name, currentLang);
    const existing = recurringSeries.find(s => String(s.labelEn || '').toLowerCase() === String(pair.labelEn || '').toLowerCase());
    if (existing) {
      existing.start=start; existing.end=end; existing.rule=rule;
      existing.labelEn=pair.labelEn; existing.labelAr=pair.labelAr;
      saveRecurringSeries();
      materializeRecurringForDate();
      renderAll();
      return currentLang === 'ar'
        ? `تم تحديث تكرار "${existing.labelAr || existing.labelEn}" · ${recurrenceLabel(rule)} · ${fmtClock12(start)}`
        : `Updated recurring "${existing.labelEn}" · ${recurrenceLabel(rule)} · ${fmtClock12(start)}`;
    }
    const series = {
      id:'s_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
      labelEn:pair.labelEn,labelAr:pair.labelAr,start,end,rule,
      color:PALETTE[recurringSeries.length % PALETTE.length],
      note:'',activeFrom:recurrenceDateKey()
    };
    recurringSeries.push(series);
    saveRecurringSeries();
    materializeRecurringForDate();
    renderAll();
    addLog('Add', currentLang === 'ar'
      ? `تمت إضافة "${series.labelAr || series.labelEn}" كتكرار · ${recurrenceLabel(rule)}`
      : `Added recurring "${series.labelEn}" · ${recurrenceLabel(rule)}`);
    return currentLang === 'ar'
      ? `تمت إضافة "${series.labelAr || series.labelEn}" · ${recurrenceLabel(rule)} · ${fmtClock12(start)}`
      : `Added "${series.labelEn}" · ${recurrenceLabel(rule)} · ${fmtClock12(start)}`;
  }
  function clearReminderStateForBlock(id) {
    try {
      if (typeof reminderState !== 'undefined' && reminderState) {
        if (reminderState.ignored) delete reminderState.ignored[id];
        if (reminderState.snoozedUntil) delete reminderState.snoozedUntil[id];
        if (reminderState.snoozeCount) delete reminderState.snoozeCount[id];
        if (reminderState.lastNotifyAt) delete reminderState.lastNotifyAt[id];
        if (typeof saveReminderState === 'function') saveReminderState();
        if (typeof hideActivityReminder === 'function' && reminderVisibleBlockId === id) hideActivityReminder();
      }
      if (typeof reminderNotifiedKey !== 'undefined' && reminderNotifiedKey && reminderNotifiedKey.includes(id)) reminderNotifiedKey='';
      if (typeof updateActivityReminder === 'function') setTimeout(() => updateActivityReminder(new Date()), 0);
    } catch (_) {}
  }
  function handleRecurringCommand(text, forcedLabel = null) {
    const low = text.toLowerCase();
    const series = findRecurringSeries(text, forcedLabel);
    const todayIntent = /\btoday\b/i.test(text) || /اليوم/.test(text);
    const futureIntent = /\b(?:from now on|future occurrences?|going forward)\b/i.test(text) || /(?:من الآن|من الان|من الآن فصاعدا|من الان فصاعدا|القادمة)/.test(text);

    if (series && (futureIntent || /\b(?:stop repeating|delete series|remove series)\b/i.test(low)) &&
        /\b(?:delete|remove|cancel|stop|drop)\b/i.test(low)) {
      recurringSeries = recurringSeries.filter(s => s.id !== series.id);
      Object.keys(recurringExceptions).filter(k => k.startsWith(series.id+'|')).forEach(k => delete recurringExceptions[k]);
      blocks = blocks.filter(b => b.seriesId !== series.id);
      saveRecurringSeries(); saveRecurringExceptions(); saveBlocks(); renderAll();
      const m = currentLang === 'ar'
        ? `تم إيقاف تكرار "${series.labelAr || series.labelEn}" من الآن فصاعداً.`
        : `Stopped recurring "${series.labelEn}" from now on.`;
      addLog('Delete', m); return m;
    }

    const skipIntent = /\b(?:skip|cancel)\b/i.test(low) || /(?:تخطى|تجاوز|ألغي|الغِ|الغ)/.test(text);
    if (series && todayIntent && skipIntent) {
      recurringExceptions[recurrenceExceptionKey(series.id, recurrenceDateKey())]={type:'skip'};
      saveRecurringExceptions();
      const current=blocks.find(b=>b.seriesId===series.id && b.occurrenceDate===recurrenceDateKey());
      if (current) clearReminderStateForBlock(current.id);
      materializeRecurringForDate(); renderAll();
      const m=currentLang==='ar'
        ? `تم تخطي "${series.labelAr || series.labelEn}" لليوم فقط. سيبقى التكرار للأيام القادمة.`
        : `Skipped "${series.labelEn}" for today only. Future occurrences stay scheduled.`;
      addLog('Edit',m); return m;
    }

    const changeIntent = /\b(?:change|move|update|edit|shift|set)\b/i.test(low) || (futureIntent && /\bis\s+(?:at|from)\b/i.test(low)) || /(?:غيّر|غير|حرّك|حرك|عدّل|عدل)/.test(text);
    if (series && futureIntent && changeIntent) {
      const range=extractTimeRange(text);
      const single=extractSingleTime(text) ?? extractLooseTime(text);
      if (!range && single===null) return currentLang==='ar' ? 'ما الوقت الجديد؟' : 'What time should future occurrences use?';
      const duration=Math.max(.25,Number(series.end)-Number(series.start));
      series.start=range ? range.start : single;
      series.end=range ? range.end : single+duration;
      saveRecurringSeries();
      delete recurringExceptions[recurrenceExceptionKey(series.id, recurrenceDateKey())];
      saveRecurringExceptions();
      materializeRecurringForDate();
      const current=blocks.find(b=>b.seriesId===series.id && b.occurrenceDate===recurrenceDateKey());
      if (current) clearReminderStateForBlock(current.id);
      renderAll();
      const m=currentLang==='ar'
        ? `تم تحديث "${series.labelAr || series.labelEn}" من الآن فصاعداً إلى ${fmtClock12(series.start)}.`
        : `Updated "${series.labelEn}" from now on to ${fmtClock12(series.start)}.`;
      addLog('Edit',m,current?.id); return m;
    }

    if (series && todayIntent && changeIntent) {
      const range=extractTimeRange(text);
      const single=extractSingleTime(text) ?? extractLooseTime(text);
      if (!range && single===null) return currentLang==='ar' ? 'ما الوقت الجديد لليوم؟' : 'What time should it use today?';
      const current=blocks.find(b=>b.seriesId===series.id && b.occurrenceDate===recurrenceDateKey());
      const duration=Math.max(.25,Number(current?.end ?? series.end)-Number(current?.start ?? series.start));
      const start=range ? range.start : single;
      const end=range ? range.end : single+duration;
      recurringExceptions[recurrenceExceptionKey(series.id,recurrenceDateKey())]={type:'override',start,end};
      saveRecurringExceptions();
      materializeRecurringForDate();
      const updated=blocks.find(b=>b.seriesId===series.id && b.occurrenceDate===recurrenceDateKey());
      if (updated) clearReminderStateForBlock(updated.id);
      renderAll();
      const m=currentLang==='ar'
        ? `تم نقل "${series.labelAr || series.labelEn}" لليوم فقط إلى ${fmtClock12(start)}.`
        : `Moved "${series.labelEn}" to ${fmtClock12(start)} for today only.`;
      addLog('Edit',m,updated?.id); return m;
    }

    const rule=parseRecurrenceRule(text);
    if (rule) {
      const addLike = /\b(?:add|schedule|set|put|insert|create)\b/i.test(low) || hasSchedulingIntent(text) || /(?:أضف|اضف|جدول|ضع)/.test(text);
      if (!addLike) return null;
      const range=extractTimeRange(text);
      const duration=extractDuration(text);
      const single=extractSingleTime(text) ?? extractLooseTime(text);
      let start=null,end=null;
      if (range) {start=range.start;end=range.end;}
      else if (single!==null) {start=single;end=duration!==null ? single+duration : single+.5;}
      if (start===null) return currentLang==='ar' ? 'ما وقت هذا النشاط المتكرر؟' : 'What time should this recurring activity start?';
      let clean=stripRecurrenceLanguage(text)
        .replace(/^(?:add|schedule|set|put|insert|create)\b/i,'')
        .replace(/(?:^|\s)(?:أضف|اضف|جدول|ضع)(?:\s|$)/g,' ')
        .trim();
      let name=forcedLabel || semanticActivityName(clean);
      name=(name||'Activity').slice(0,80);
      return createRecurringSeries(name,start,end,rule);
    }
    return null;
  }

  loadRecurringSeries();
  materializeRecurringForDate();
  renderAll();
  setInterval(() => {
    const key=recurrenceDateKey();
    if (key !== recurrenceLastDate) {
      materializeRecurringForDate();
      renderAll();
    }
  }, 60000);

  function parseCommand(raw, forcedLabel = null) {
    const text = normalizeDigits(raw.trim());
    const lower = text.toLowerCase();
    const pendingResult = resolvePendingScheduleIntent(text);
    if (pendingResult) return pendingResult;

    const recurrenceResult = handleRecurringCommand(text, forcedLabel);
    if (recurrenceResult) return recurrenceResult;

    // ---- remove ----
    const arRemoveRest = stripLeadingArabicKeyword(text, AR_REMOVE_WORDS);
    if (arRemoveRest !== null || /^(remove|delete|cancel|erase|drop)\b/i.test(lower)) {
      const rest = arRemoveRest !== null ? arRemoveRest : text.replace(/^(remove|delete|cancel|erase|drop)\b/i, '').trim();
      const match = findMatchingBlock(rest, forcedLabel);
      if (match) {
        blocks = blocks.filter(b => b.id !== match.id);
        saveBlocks(); renderAll();
        const m = msg('removed', blockDisplayLabel(match));
        addLog('Delete', m);
        return m;
      }
      return msg('removeNotFound', rest);
    }

    // ---- add ----
    const arAddRest = stripLeadingArabicKeyword(text, AR_ADD_WORDS);
    if (arAddRest !== null || /^(add|schedule|set|put|insert|create)\b/i.test(lower)) {
      const rest = arAddRest !== null ? arAddRest : text.replace(/^(add|schedule|set|put|insert|create)\b/i, '').trim();
      const range = extractTimeRange(rest);
      const duration = extractDuration(rest);
      const singleStart = extractSingleTime(rest) ?? extractLooseTime(rest);
      const relative = relativeAnchor(rest);
      let start, end;
      if (range) { start = range.start; end = range.end; }
      else if (singleStart !== null && duration !== null) { start = singleStart; end = singleStart + duration; }
      else if (singleStart !== null) { start = singleStart; end = singleStart + 0.5; }
      else if (relative && relative.type !== 'unknown') {
        let pendingName = forcedLabel || semanticActivityName(rest.replace(/\b(?:after|before)\b[\s\S]*$/i,'').replace(/(?:بعد|قبل)[\s\S]*$/,'').trim());
        const pendingPair = makeActivityPair(pendingName, containsArabicText(pendingName) ? 'ar' : currentLang);
        pendingName = currentLang === 'ar' ? pendingPair.labelAr : pendingPair.labelEn;
        pendingName=(pendingName|| (currentLang==='ar'?'نشاط':'Activity')).slice(0,80);
        const times=relativeTimes(relative,duration!==null?duration:.5);
        const prompt=relativeConfirmPrompt(pendingName,relative,times);
        pendingScheduleIntent={type:'confirm-relative-add',name:pendingName,start:times.start,end:times.end,prompt};
        return prompt;
      } else {
        let pendingName = forcedLabel || semanticActivityName(rest);
        pendingName = (pendingName || 'Activity').slice(0, 80);
        pendingScheduleIntent = { type: 'add-time', name: pendingName };
        return relative && relative.type === 'unknown'
          ? (currentLang==='ar' ? `لم أجد «${relative.anchorLabel}» في جدول اليوم. ما الوقت الذي تريده؟` : `I couldn't find “${relative.anchorLabel}” in today's schedule. What time should I use?`)
          : pendingPrompt('add-time', pendingName);
      }
      let name = forcedLabel || semanticActivityName(rest);
      const pair = makeActivityPair(name, containsArabicText(name) ? 'ar' : currentLang);
      name = currentLang === 'ar' ? pair.labelAr : pair.labelEn;
      name = (name || (currentLang==='ar'?'نشاط':'Activity')).slice(0, 80);
      return addOrReplaceScheduledActivity(name, start, end);
    }

    // ---- change / update ----
    const arChangeRest = stripLeadingArabicKeyword(text, AR_CHANGE_WORDS);
    if (arChangeRest !== null || /^(change|move|update|rename|modify|edit|shift)\b/i.test(lower)) {
      const rest = arChangeRest !== null ? arChangeRest : text.replace(/^(change|move|update|rename|modify|edit|shift)\b/i, '').trim();

      const prayerLabel = findMatchingPrayerLabel(rest);
      if (prayerLabel) {
        const range = extractTimeRangeForPrayer(rest, prayerLabel);
        const newTime = range ? range.end : extractSingleTimeForPrayer(rest, prayerLabel);
        if (newTime !== null) {
          setPrayerOverride(prayerLabel, newTime);
          const m = msg('prayerUpdated', prayerDisplayLabel(prayerLabel), fmtClock12(newTime));
          addLog('Edit', m);
          return m;
        }
        return msg('prayerNoTime', prayerDisplayLabel(prayerLabel));
      }

      const range = extractTimeRange(rest);
      const singleNewTime = extractSingleTime(rest) ?? extractLooseTime(rest);
      const relative = relativeAnchor(rest);
      // Remove the anchor phrase before matching the activity being moved, so
      // "move walk after work" targets Walk, not Work.
      const targetText = relative ? rest.replace(/\b(?:after|before)\s+.+$/i,'').replace(/(?:بعد|قبل)\s+.+$/,'').trim() : rest;
      const match = findMatchingBlock(targetText || rest, forcedLabel);
      if (!match) {
        if (range || singleNewTime !== null) {
          pendingScheduleIntent = { type: 'choose-update-target', range, single: singleNewTime };
          return pendingPrompt('choose-update-target');
        }
        return msg('updateNotFound');
      }
      if (!range && singleNewTime === null && relative && relative.type !== 'unknown') {
        const duration=Math.max(.25,match.end-match.start);
        const times=relativeTimes(relative,duration);
        const prompt=relativeConfirmPrompt(blockDisplayLabel(match),relative,times);
        pendingScheduleIntent={type:'confirm-relative-update',blockId:match.id,start:times.start,end:times.end,prompt};
        return prompt;
      }
      if (!range && singleNewTime === null && relative && relative.type === 'unknown') {
        pendingScheduleIntent={type:'update-time',blockId:match.id};
        return currentLang==='ar'
          ? `لم أجد «${relative.anchorLabel}» في جدول اليوم. ما الوقت الجديد لـ «${blockDisplayLabel(match)}»؟`
          : `I couldn't find “${relative.anchorLabel}” in today's schedule. What time should I use for “${blockDisplayLabel(match)}”?`;
      }
      if (range) {
        match.start = range.start; match.end = range.end;
        clearReminderStateForBlock(match.id);
        sortBlocks(); saveBlocks(); renderAll();
        const m = msg('updated', blockDisplayLabel(match), fmtClock12(range.start), fmtClock12(range.end));
        addLog('Edit', m, match.id);
        return m;
      }
      if (singleNewTime !== null) {
        const duration = Math.max(0.25, match.end - match.start);
        match.start = singleNewTime; match.end = singleNewTime + duration;
        clearReminderStateForBlock(match.id);
        sortBlocks(); saveBlocks(); renderAll();
        const m = msg('updated', blockDisplayLabel(match), fmtClock12(match.start), fmtClock12(match.end));
        addLog('Edit', m, match.id);
        return m;
      }
      pendingScheduleIntent = { type: 'update-time', blockId: match.id };
      return pendingPrompt('update-time', blockDisplayLabel(match));
    }

    // Broad dayparts are intentionally clarified instead of silently inventing a time.
    const broadDaypart = extractDaypartIntent(text);
    if (broadDaypart && !hasCompletionIntent(text)) {
      let name = forcedLabel || semanticActivityName(text);
      name=(name||'Activity').slice(0,80);
      pendingScheduleIntent={type:'add-time',name};
      return daypartPrompt(broadDaypart,name);
    }

    // Optional prayer completion/report: Duha is not one of the five fixed prayer markers,
    // but users can log it naturally, e.g. "صليت الضحى الساعة الحادية عشر والنصف".
    if (isDuhaPrayer(text) && hasCompletionIntent(text)) {
      const reportedTime = extractDuhaTime(text);
      if (reportedTime !== null) {
        const duhaName = currentLang === 'ar' ? 'صلاة الضحى' : 'Duha prayer';
        const existing = blocks.find(b => isDuhaPrayer(b.label) && Math.abs(b.start - reportedTime) < 0.75);
        const block = existing || { id: nextId(), start: reportedTime, end: reportedTime + 0.5, ...makeActivityPair(duhaName, currentLang), color: PALETTE[blocks.length % PALETTE.length], done: true, note: '' };
        block.start = reportedTime;
        block.end = reportedTime + 0.5;
        Object.assign(block, makeActivityPair(duhaName, currentLang));
        block.done = true;
        block.note = '';
        if (!existing) blocks.push(block);
        sortBlocks(); saveBlocks(); renderAll();
        const desc = currentLang === 'ar'
          ? `تم تسجيل صلاة الضحى كمكتملة · ${fmtClock12(reportedTime)}`
          : `Logged Duha prayer as completed · ${fmtClock12(reportedTime)}`;
        addLog('Activity', desc, block.id);
        document.dispatchEvent(new CustomEvent('dailyRhythm:activityCompleted',{detail:{block:{...block}}}));
        return desc;
      }
    }

    // prayer completion/report (e.g. "صليت الفجر الساعة ٥:٣٠")
    const reportedPrayer = findMatchingPrayerLabel(text);
    const isCompletionReport = /\b(?:prayed|completed|finished|did)\b/i.test(text) || /(?:صليت|أديت|أديت صلاة|انتهيت|أكملت)/.test(text);
    if (reportedPrayer && isCompletionReport) {
      const reportedTime = extractSingleTimeForPrayer(text, reportedPrayer);
      const when = reportedTime !== null ? ` · ${fmtClock12(reportedTime)}` : '';
      const desc = currentLang === 'ar'
        ? `تم تسجيل صلاة ${prayerDisplayLabel(reportedPrayer)}${when}`
        : `Logged ${prayerDisplayLabel(reportedPrayer)} prayer${when}`;
      addLog('Activity', desc);
      return desc;
    }

    // Conversational relative scheduling without an explicit command:
    // "I want lunch after Maghrib time", "lunch after Dhuhr prayer",
    // "الغداء بعد صلاة الظهر". These must behave the same as explicit Add.
    const conversationalRelative = relativeAnchor(text);
    if (conversationalRelative && !hasCompletionIntent(text)) {
      let phrase = text
        .replace(/^(?:please\s+)?(?:i\s+(?:want|would like)\s+(?:to\s+)?|can you\s+|could you\s+)?/i,'')
        .replace(/\b(?:after|before)\b[\s\S]*$/i,'')
        .replace(/(?:بعد|قبل)[\s\S]*$/,'')
        .replace(/^(?:add|schedule|set|put|insert|create)\s+/i,'')
        .replace(/^(?:أضف|اضف|ضع|جدول|جدولة|ضيف|حط)\s+/,'')
        .trim();
      let name = forcedLabel || semanticActivityName(phrase);
      const pair = makeActivityPair(name, containsArabicText(name) ? 'ar' : currentLang);
      name = currentLang === 'ar' ? pair.labelAr : pair.labelEn;
      name = (name || (currentLang==='ar'?'نشاط':'Activity')).slice(0,80);

      if (conversationalRelative.type !== 'unknown') {
        const times = relativeTimes(conversationalRelative, .5);
        const prompt = relativeConfirmPrompt(name, conversationalRelative, times);
        pendingScheduleIntent = {
          type:'confirm-relative-add',
          name,
          start:times.start,
          end:times.end,
          prompt
        };
        return prompt;
      }

      pendingScheduleIntent = {type:'add-time',name};
      return currentLang==='ar'
        ? `لم أجد «${conversationalRelative.anchorLabel}» في جدول اليوم. ما الوقت الذي تريده لـ «${name}»؟`
        : `I couldn't find “${conversationalRelative.anchorLabel}” in today's schedule. What time should I use for “${name}”?`;
    }

    // A phrase with a concrete time is a scheduling request unless the user
    // clearly reports completion. This prevents a timed swim/nap request from
    // marking a semantically-related existing block as done.
    if (hasSchedulingIntent(text) && !hasCompletionIntent(text)) {
      const range = extractTimeRange(text);
      const duration = extractDuration(text);
      const singleStart = extractSingleTime(text);
      let start = null, end = null;
      if (range) { start = range.start; end = range.end; }
      else if (singleStart !== null) {
        start = singleStart;
        end = duration !== null ? singleStart + duration : singleStart + 0.5;
      }
      if (start !== null && end !== null) {
        const name = forcedLabel || semanticActivityName(text);
        return addOrReplaceScheduledActivity(name, start, end);
      }
    }

    // default: treat as a completion report if it mentions a known activity
    const match = findMatchingBlock(text, forcedLabel);
    if (match) {
      const range = extractTimeRange(text);
      const duration = extractDuration(text);
      match.done = true;
      document.dispatchEvent(new CustomEvent('dailyRhythm:activityCompleted',{detail:{block:{...match}}}));
      let note = extractNote(text);
      if (note) {
        const noteLow = note.toLowerCase();
        const aliases = activityAliases(match.label);
        if (aliases.some(a => noteLow === a || noteLow === a.replace(/^(the|a|an)\s+/i, ''))) note = '';
      }
      if (note) match.note = note;
      else if (range) match.note = msg('actuallyDone', fmtClock12(range.start), fmtClock12(range.end));
      else if (duration) match.note = msg('tookAbout', duration < 1 ? Math.round(duration * 60) + (currentLang === 'ar' ? ' دقيقة' : ' min') : duration + (currentLang === 'ar' ? ' ساعة' : ' hr'));
      saveBlocks(); renderAll();
      const m = msg('markedDone', blockDisplayLabel(match), match.note);
      addLog('Activity', `${currentLang === 'ar' ? 'تم تسجيل' : 'Logged'} "${blockDisplayLabel(match)}"${match.note ? ' — ' + match.note : ''}`);
      return m;
    }

    // not on the schedule at all — offer it as a suggestion instead of a dead end
    const range = extractTimeRange(text);
    const duration = extractDuration(text);
    const singleTime = extractSingleTime(text);
    let start = null, end = null;
    if (range) { start = range.start; end = range.end; }
    else if (singleTime !== null) { start = singleTime; end = duration !== null ? singleTime + duration : null; }
    const note = extractNote(text) || null;
    const name = guessActivityName(text);
    addUnmatched(name, start, end, note, text);
    return msg('unmatched', name);
  }

  const commandInput = document.getElementById('commandInput');
  const commandStatus = document.getElementById('commandStatus');
  function setCommandFeedback(message, kind='success') {
    if (!commandStatus) return;
    const value = String(message || '').trim();
    commandStatus.textContent = value;
    commandStatus.classList.remove('is-default','is-success','is-question');
    if (!value || value === STRINGS[currentLang].commandStatusDefault) {
      commandStatus.classList.add('is-default');
      return;
    }
    commandStatus.classList.add(kind === 'question' ? 'is-question' : 'is-success');
  }

  function commandResultLooksLikeQuestion(message) {
    const s=String(message||'');
    return /[?؟]\s*$/.test(s)
      || /\b(?:what time|which activity|say yes|give me another time|couldn't find)\b/i.test(s)
      || /(?:ما الوقت|أي نشاط|قل نعم|أعطني وقت|لم أجد)/.test(s);
  }

  const sendBtn = document.getElementById('sendBtn');
  const resetBtn = document.getElementById('resetBtn');
  commandStatus?.classList.add('is-default');

  document.getElementById('activityEditClose')?.addEventListener('click', closeActivityEditor);
  document.getElementById('activityEditCancel')?.addEventListener('click', closeActivityEditor);
  document.getElementById('activityEditSave')?.addEventListener('click', () => {
    const id = document.getElementById('activityEditId').value;
    const block = blocks.find(b => b.id === id);
    if (!block) { closeActivityEditor(); return; }
    const name = document.getElementById('activityEditName').value.trim().slice(0, 80);
    const start = timeInputToHour(document.getElementById('activityEditStart').value);
    let end = timeInputToHour(document.getElementById('activityEditEnd').value);
    const note = document.getElementById('activityEditNote').value.trim().slice(0, 160);
    if (!name || start === null || end === null) return;
    if (end <= start) end += 24;
    if (end - start > 24) return;
    const before = `${blockDisplayLabel(block)} ${fmtClock12(block.start)}–${fmtClock12(block.end)}`;
    const pair = makeActivityPair(name, currentLang);
    const scope = document.getElementById('activityEditScope')?.value || 'today';

    if (block.seriesId && scope === 'future') {
      const series = recurringSeries.find(s => s.id === block.seriesId);
      if (series) {
        series.labelEn = pair.labelEn;
        series.labelAr = pair.labelAr;
        series.start = start;
        series.end = end;
        series.note = note;
        saveRecurringSeries();
        delete recurringExceptions[recurrenceExceptionKey(series.id, recurrenceDateKey())];
        saveRecurringExceptions();
      }
    } else if (block.seriesId) {
      recurringExceptions[recurrenceExceptionKey(block.seriesId, recurrenceDateKey())] = {
        type:'override', start, end, labelEn:pair.labelEn, labelAr:pair.labelAr, note
      };
      saveRecurringExceptions();
    }

    block.label = pair.labelEn;
    block.labelEn = pair.labelEn;
    block.labelAr = pair.labelAr;
    block.start = start;
    block.end = end;
    block.note = note;
    clearReminderStateForBlock(block.id);
    sortBlocks(); saveBlocks(); closeActivityEditor(); renderAll();
    const after = `${blockDisplayLabel(block)} ${fmtClock12(block.start)}–${fmtClock12(block.end)}`;
    addLog('Edit', currentLang === 'ar' ? `تم تعديل ${before} إلى ${after}` : `Updated ${before} to ${after}`);
  });

  const commandConfirm = document.getElementById('commandConfirm');
  const commandConfirmText = document.getElementById('commandConfirmText');
  const commandConfirmYes = document.getElementById('commandConfirmYes');
  const commandConfirmNo = document.getElementById('commandConfirmNo');
  let pendingCommand = null;

  function hideCommandConfirmation() {
    pendingCommand = null;
    commandConfirm.classList.remove('show');
    commandConfirmText.textContent = '';
  }

  function showCommandConfirmation(text, suggestion) {
    pendingCommand = { type: 'suggestion', text, label: suggestion.label };
    const label = blockDisplayLabel(suggestion.label);
    commandConfirmText.textContent = currentLang === 'ar' ? `هل تقصد «${label}»؟` : `Did you mean “${label}”?`;
    commandConfirmYes.textContent = currentLang === 'ar' ? 'نعم' : 'Yes';
    commandConfirmNo.textContent = currentLang === 'ar' ? 'لا' : 'No';
    commandConfirm.classList.add('show');
    setCommandFeedback(currentLang === 'ar' ? 'لن أنفّذ الأمر حتى تؤكد.' : 'I won’t run it until you confirm.', 'question');
  }

  function showResetConfirmation(text) {
    pendingCommand = { type: 'reset', text };
    commandConfirmText.textContent = currentLang === 'ar'
      ? 'سيؤدي هذا إلى حذف جميع الأنشطة من جدولك اليومي. ستبقى مواقيت الصلاة وإعدادات الموقع. هل تريد المتابعة؟'
      : 'This will remove every activity from your daily schedule. Prayer times and location settings will stay. Continue?';
    commandConfirmYes.textContent = currentLang === 'ar' ? 'نعم، إعادة الضبط' : 'Yes, reset';
    commandConfirmNo.textContent = currentLang === 'ar' ? 'إلغاء' : 'Cancel';
    commandConfirm.classList.add('show');
    setCommandFeedback(currentLang === 'ar' ? 'لم يتم تغيير أي شيء بعد.' : 'Nothing has been changed yet.', 'question');
  }

  function executeScheduleReset() {
    const removed = blocks.length;
    blocks = [];
    recurringSeries = [];
    recurringExceptions = {};
    saveRecurringSeries();
    saveRecurringExceptions();
    pendingScheduleIntent = null;
    saveBlocks(); renderAll();
    const m = currentLang === 'ar'
      ? `تمت إعادة ضبط الجدول وحذف ${removed} من الأنشطة.`
      : `Schedule reset. Removed ${removed} activities.`;
    addLog('Delete', m);
    return m;
  }

  const AI_COMMAND_CONFIG = Object.assign({
    enabled: true,
    endpoint: '/api/interpret-command',
    timeoutMs: 15000
  }, window.DAILY_RHYTHM_AI_COMMAND || {});

  function countExplicitClockMentions(text) {
    const t = normalizeTimePhrase(text);
    const matches = t.match(/(?:\b(?:at|from|to|and|between)\b|(?:الساعة|إلى|حتى|و))?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|ص|م)?/ig) || [];
    return matches.filter(x => /\d/.test(x)).length;
  }

  function shouldUseAiCommandInterpreter(text, options = {}) {
    if (!AI_COMMAND_CONFIG.enabled || !navigator.onLine || options.forcedLabel) return false;
    if (pendingScheduleIntent || hasCompletionIntent(text)) return false;
    if (isScheduleResetIntent(text)) return false;
    const explicit = isExplicitCommand(text);
    const isArabic = containsArabicText(text);
    const multipleTimes = countExplicitClockMentions(text) >= 2;
    const prayerRelative = /\b(?:after|before)\b/i.test(text) || /(?:بعد|قبل)\s+(?:صلاة\s*)?/.test(text);
    const compound = splitCompoundCommands(text).length > 1 || /(?:،|,).*(?:أضف|اضف|أضيف|ضيف|احذف|حدف|امسح|شيل|ألغ|عدل|عدّل|غير|غيّر|add|delete|remove|edit|change)/i.test(text);
    const conversationalArabic = isArabic && text.trim().length >= 2;
    // Arabic is intentionally routed through the semantic layer even when it contains
    // no formal command verb: dialect/slang such as "بدي", "عايز", "خليها" and
    // "ما بدي" must work naturally. Completion/reset/follow-up intents were excluded above.
    // The deterministic parser remains the offline/failure fallback.
    return conversationalArabic || (explicit && (multipleTimes || prayerRelative || compound));
  }

  function aiTimeToHour(value) {
    const m = /^(\d{2}):(\d{2})$/.exec(String(value || ''));
    if (!m) return null;
    const h = Number(m[1]), min = Number(m[2]);
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return h + min / 60;
  }

  function cacheAiActivityPair(activity) {
    const pair = {
      activityKey: '',
      label: String(activity.labelEn || '').trim(),
      labelEn: String(activity.labelEn || '').trim(),
      labelAr: String(activity.labelAr || '').trim()
    };
    if (!pair.labelEn || !pair.labelAr) return null;
    cacheActivityTranslation(pair.labelEn, pair);
    cacheActivityTranslation(pair.labelAr, pair);
    return pair;
  }

  function resolveAiRelativeOccurrence(occ) {
    const offset = Math.max(0, Number(occ.offsetMinutes) || 15) / 60;
    const duration = Math.max(.25, Number(occ.durationMinutes) || 30) / 60;
    let anchorTime = null;
    let anchorLabel = occ.anchor || '';

    if (occ.anchorType === 'prayer') {
      const prayer = prayers.find(p => p.label === occ.anchor);
      if (!prayer) return null;
      anchorTime = prayer.time;
      anchorLabel = prayerDisplayLabel(prayer.label);
    } else {
      const block = findMatchingBlock(String(occ.anchor || ''));
      if (!block) return null;
      anchorTime = occ.relation === 'before' ? block.start : block.end;
      anchorLabel = blockDisplayLabel(block);
    }

    const start = occ.relation === 'before' ? anchorTime - offset - duration : anchorTime + offset;
    const end = start + duration;
    return { start, end, anchorLabel };
  }

  async function requestAiCommandInterpretation(text) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AI_COMMAND_CONFIG.timeoutMs);
    try {
      const response = await fetch(AI_COMMAND_CONFIG.endpoint, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'same-origin',
        signal:controller.signal,
        body:JSON.stringify({ text, locale:currentLang, schedule:blocks.map(b=>({labelEn:b.labelEn||b.label||'',labelAr:b.labelAr||'',start:Number.isFinite(b.start)?hourToTimeInput(b.start):null})) })
      });
      if (!response.ok) throw new Error(`interpret endpoint ${response.status}`);
      return await response.json();
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  function aiPlanRelativePreview(plan) {
    if (!plan || plan.intent !== 'add_schedule' || !Array.isArray(plan.activities)) return null;
    const items = [];
    for (const activity of plan.activities) {
      const pair = cacheAiActivityPair(activity);
      if (!pair) continue;
      const sourceName = currentLang === 'ar' ? pair.labelAr : pair.labelEn;
      for (const occ of activity.occurrences || []) {
        if (occ.kind !== 'relative') continue;
        const resolved = resolveAiRelativeOccurrence(occ);
        if (!resolved) continue;
        const relation = currentLang === 'ar'
          ? (occ.relation === 'before' ? 'قبل' : 'بعد')
          : occ.relation;
        items.push(currentLang === 'ar'
          ? `«${sourceName}» ${fmtClock12(resolved.start)} (${relation} «${resolved.anchorLabel}» بـ ${Number.isFinite(Number(occ.offsetMinutes)) ? Number(occ.offsetMinutes) : 15} دقيقة)`
          : `“${sourceName}” at ${fmtClock12(resolved.start)} (${Number.isFinite(Number(occ.offsetMinutes)) ? Number(occ.offsetMinutes) : 15} min ${relation} “${resolved.anchorLabel}”)`);
      }
    }
    return items.length ? items : null;
  }

  function showAiPlanConfirmation(text, plan, previewItems) {
    pendingCommand = { type:'ai-plan', text, plan };
    const intro = currentLang === 'ar'
      ? 'فسّرت الأمر النسبي هكذا:'
      : 'I interpreted the relative timing as:';
    const question = currentLang === 'ar' ? 'هل أنفّذ هذا الجدول؟' : 'Apply this schedule?';
    commandConfirmText.textContent = [intro, ...previewItems.map(x => `• ${x}`), question].join('\n');
    commandConfirmText.style.whiteSpace = 'pre-line';
    commandConfirmYes.textContent = currentLang === 'ar' ? 'نعم، نفّذ' : 'Yes, apply';
    commandConfirmNo.textContent = currentLang === 'ar' ? 'لا' : 'No';
    commandConfirm.classList.add('show');
    setCommandFeedback(currentLang === 'ar' ? 'لم يتم تغيير الجدول بعد.' : 'Nothing has been changed yet.', 'question');
  }

  function findAiOperationTarget(op) {
    const candidates = [op?.labelAr, op?.labelEn].filter(Boolean);
    for (const value of candidates) {
      const hit = findMatchingBlock(String(value));
      if (hit) return hit;
    }
    return null;
  }

  function addUntimedActivityFromAi(op) {
    // Untimed activities are intentionally accepted. They live in the suggestion/inbox
    // lane until the user later assigns a time, rather than forcing an invented clock value.
    const pair = cacheAiActivityPair(op);
    if (!pair) return null;
    const name = currentLang === 'ar' ? pair.labelAr : pair.labelEn;
    addUnmatched(name, null, null, null, name);
    const message = currentLang === 'ar' ? `تمت إضافة «${name}» بدون وقت؛ يمكنك تحديد الوقت لاحقاً.` : `Added “${name}” with no time; you can set it later.`;
    addLog('Add', message);
    return {status:'added', message, name};
  }

  function executeAiOperations(plan, originalText='') {
    if (!plan || plan.intent !== 'operations' || !Array.isArray(plan.operations) || !plan.operations.length) return null;
    const lines = [], unresolved = [];
    let changed = 0;
    for (const op of plan.operations) {
      const pair = cacheAiActivityPair(op);
      const name = pair ? (currentLang === 'ar' ? pair.labelAr : pair.labelEn) : (op.labelAr || op.labelEn || '');
      if (!name) continue;

      if (op.action === 'add') {
        const occ = op.occurrence;
        if (!occ) {
          const r = addUntimedActivityFromAi(op); if (r) { changed++; lines.push(`✓ ${r.message}`); }
          continue;
        }
        let start=null,end=null,openEnded=false;
        if (occ.kind==='time') { start=aiTimeToHour(occ.start); openEnded=true; }
        else if (occ.kind==='range') { start=aiTimeToHour(occ.start); end=aiTimeToHour(occ.end); if(start!==null&&end!==null&&end<=start)end+=24; }
        else if (occ.kind==='relative') { const r=resolveAiRelativeOccurrence(occ); if(r){start=r.start;openEnded=true;} }
        if (start===null) { unresolved.push(currentLang==='ar'?`تعذر تحديد وقت «${name}».`:`Couldn't resolve a time for “${name}”.`); continue; }
        const r=addOrReplaceScheduledActivity(name,start,end,{openEnded});
        if(r){changed++;lines.push(`✓ ${r.message}`);}
        continue;
      }

      const target=findAiOperationTarget(op);
      if (op.action==='delete') {
        if(op.confidence==='low' || op.status==='needs_clarification'){
          unresolved.push(op.clarification || (currentLang==='ar'?`هل تريد حذف «${name}» من جدول اليوم؟`:`Do you want to remove “${name}” from today's schedule?`));
          continue;
        }
        if(!target){lines.push(currentLang==='ar'?`• لم أجد «${name}» في جدول اليوم.`:`• I couldn't find “${name}” in today's schedule.`);continue;}
        blocks=blocks.filter(b=>b.id!==target.id); clearReminderStateForBlock(target.id); saveBlocks(); renderAll();
        const m=msg('removed',blockDisplayLabel(target)); addLog('Delete',m); changed++; lines.push(`✓ ${m}`); continue;
      }

      if (op.action==='edit') {
        if(!target){lines.push(currentLang==='ar'?`• لم أجد «${name}» في جدول اليوم.`:`• I couldn't find “${name}” in today's schedule.`);continue;}
        if(op.status==='needs_clarification' || (!op.occurrence && !op.renameEn && !op.renameAr)) {
          const q=op.clarification || (currentLang==='ar'?`ماذا تريد أن تعدّل في «${blockDisplayLabel(target)}»؟`:`What would you like to change about “${blockDisplayLabel(target)}”?`);
          unresolved.push(q);
          // Keep one conversational follow-up target while still executing all other operations.
          if(!pendingScheduleIntent) pendingScheduleIntent={type:'update-time',blockId:target.id};
          continue;
        }
        if(op.renameEn && op.renameAr){target.label=op.renameEn;target.labelEn=op.renameEn;target.labelAr=op.renameAr;}
        const occ=op.occurrence;
        if(occ){
          if(occ.kind==='time'){const st=aiTimeToHour(occ.start);if(st!==null){const dur=Math.max(.25,target.end-target.start);target.start=st;target.end=st+dur;}}
          else if(occ.kind==='range'){let st=aiTimeToHour(occ.start),en=aiTimeToHour(occ.end);if(st!==null&&en!==null){if(en<=st)en+=24;target.start=st;target.end=en;}}
          else if(occ.kind==='relative'){const r=resolveAiRelativeOccurrence(occ);if(r){const dur=Math.max(.25,target.end-target.start);target.start=r.start;target.end=r.start+dur;}}
        }
        clearReminderStateForBlock(target.id);sortBlocks();saveBlocks();renderAll();changed++;
        const m=currentLang==='ar'?`تم تعديل «${blockDisplayLabel(target)}».`:`Updated “${blockDisplayLabel(target)}”.`;addLog('Edit',m,target.id);lines.push(`✓ ${m}`);
      }
    }
    if(!changed && !lines.length && !unresolved.length)return null;
    const header=currentLang==='ar'?`فهمت ${plan.operations.length} تعليمات:`:`Understood ${plan.operations.length} instructions:`;
    const pending=unresolved.length?(currentLang==='ar'?['تحتاج توضيحاً:',...unresolved.map(x=>`? ${x}`)]:['Needs clarification:',...unresolved.map(x=>`? ${x}`)]):[];
    return [header,...lines,...pending].join('\n');
  }

  function executeAiAddPlan(plan) {
    if (!plan || plan.intent !== 'add_schedule' || !Array.isArray(plan.activities) || !plan.activities.length) return null;
    const results = [];
    const assumptions = [];

    for (const activity of plan.activities) {
      const pair = cacheAiActivityPair(activity);
      if (!pair) continue;
      const sourceName = currentLang === 'ar' ? pair.labelAr : pair.labelEn;
      for (const occ of activity.occurrences || []) {
        let start = null, end = null, openEnded = false;
        if (occ.kind === 'time') {
          start = aiTimeToHour(occ.start);
          // A single stated time is intentionally open-ended. Do not invent an end time.
          openEnded = true;
        } else if (occ.kind === 'range') {
          start = aiTimeToHour(occ.start);
          end = aiTimeToHour(occ.end);
          if (start !== null && end !== null && end <= start) end += 24;
        } else if (occ.kind === 'relative') {
          const resolved = resolveAiRelativeOccurrence(occ);
          if (resolved) {
            start = resolved.start;
            openEnded = true;
            if ((Number(occ.offsetMinutes) || 15) === 15) {
              assumptions.push(currentLang === 'ar'
                ? `اعتبرت «${occ.relation === 'before' ? 'قبل' : 'بعد'} ${resolved.anchorLabel}» بفارق 15 دقيقة.`
                : `Interpreted “${occ.relation} ${resolved.anchorLabel}” as 15 minutes ${occ.relation}.`);
            }
          }
        }
        if (start === null || !Number.isFinite(start)) continue;
        if (!openEnded && (end === null || !Number.isFinite(end))) continue;
        const result = addOrReplaceScheduledActivity(sourceName, start, end, { openEnded });
        if (result) results.push(result);
      }
    }

    if (!results.length) return null;
    const header = currentLang === 'ar'
      ? `تمت إضافة ${results.length} ${results.length === 1 ? 'نشاط' : 'أنشطة'}:`
      : `Added ${results.length} ${results.length === 1 ? 'activity' : 'activities'}:`;
    const lines = results.map(r => `• ${r.message}`);
    if (window.renderMultiAddReceipt) window.renderMultiAddReceipt({ results, originalText: commandInput.value, lang: currentLang });
    return [header, ...lines, ...Array.from(new Set(assumptions))].join('\n');
  }

  // ---- Temporary request/outcome capture for product testing ----
  // Local-only by design. Export the JSON from Settings and share it for analysis.
  const TEST_DATA_KEY = 'dailyRhythmTemporaryRequestOutcomes_v1';
  function loadTestData() {
    try { const v=JSON.parse(localStorage.getItem(TEST_DATA_KEY)||'[]'); return Array.isArray(v)?v:[]; } catch (_) { return []; }
  }
  function scheduleTelemetrySnapshot() {
    return blocks.map(b => ({
      id:b.id, activity:blockDisplayLabel(b), labelEn:b.labelEn||b.label||'', labelAr:b.labelAr||'',
      start:Number.isFinite(b.start)?hourToTimeInput(b.start):null,
      end:Number.isFinite(b.end)&&!b.openEnded?hourToTimeInput(b.end):null,
      openEnded:!!b.openEnded, done:!!b.done, skipped:!!b.skipped
    }));
  }
  function requestedOperationsFromPlan(plan) {
    if (!plan) return [];
    if (plan.intent==='operations' && Array.isArray(plan.operations)) return plan.operations.map(op=>({
      action:op.action||null, activity:op.labelAr||op.labelEn||null, labelEn:op.labelEn||null, labelAr:op.labelAr||null,
      occurrence:op.occurrence||null, status:op.status||null, confidence:op.confidence||null, clarification:op.clarification||null
    }));
    if (plan.intent==='add_schedule' && Array.isArray(plan.activities)) return plan.activities.map(a=>({
      action:'add', activity:a.labelAr||a.labelEn||null, labelEn:a.labelEn||null, labelAr:a.labelAr||null, occurrences:a.occurrences||[]
    }));
    return [];
  }
  function beginRequestCapture(text, source='typed') {
    return { id:`req_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, timestamp:new Date().toISOString(),
      language:currentLang, source, request:String(text||''), before:scheduleTelemetrySnapshot() };
  }
  function finishRequestCapture(rec, data={}) {
    if (!rec) return;
    const after=scheduleTelemetrySnapshot();
    const beforeById=new Map((rec.before||[]).map(x=>[x.id,x]));
    const afterById=new Map(after.map(x=>[x.id,x]));
    const added=after.filter(x=>!beforeById.has(x.id));
    const removed=(rec.before||[]).filter(x=>!afterById.has(x.id));
    const changed=after.filter(x=>{
      const b=beforeById.get(x.id); return b && JSON.stringify(b)!==JSON.stringify(x);
    });
    const entry={...rec,...data,after,actualChanges:{added,removed,changed}};
    const rows=loadTestData(); rows.push(entry);
    try { localStorage.setItem(TEST_DATA_KEY,JSON.stringify(rows.slice(-500))); } catch (_) {}
    updateTestDataCount();
  }
  function updateTestDataCount(){
    const el=document.getElementById('testDataCount'); if(!el)return;
    const n=loadTestData().length;
    el.textContent=currentLang==='ar'?`تم حفظ ${n} طلباً مؤقتاً على هذا الجهاز.`:`${n} temporary requests saved on this device.`;
  }
  function exportTestData(){
    const payload={product:'Daily Rhythm',purpose:'temporary request/outcome testing',exportedAt:new Date().toISOString(),records:loadTestData()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`daily-rhythm-test-data-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  document.getElementById('exportTestData')?.addEventListener('click',exportTestData);
  document.getElementById('clearTestData')?.addEventListener('click',()=>{
    const ok=confirm(currentLang==='ar'?'مسح بيانات الاختبار المؤقتة من هذا الجهاز؟':'Clear temporary test data from this device?');
    if(!ok)return; try{localStorage.removeItem(TEST_DATA_KEY);}catch(_){} updateTestDataCount();
  });
  updateTestDataCount();

  async function submitCommand(options = {}) {
    const text = (options.text !== undefined ? options.text : commandInput.value).trim();
    if (!text) return;
    const capture = beginRequestCapture(text, options.source || 'typed');
    hideCommandConfirmation();

    if (!options.skipResetCheck && isScheduleResetIntent(text)) {
      showResetConfirmation(text);
      finishRequestCapture(capture,{interpreter:'safety-rule',outcome:'needs_confirmation',result:commandConfirmText.textContent,requestedOperations:[{action:'clear_day'}]});
      commandInput.value = ''; resizeCommandInput(); return;
    }

    // Decide semantic routing BEFORE speech-correction. Long/dialect Arabic and
    // compound requests must reach the multi-intent interpreter intact; a single
    // fuzzy word such as "gym" must never capture the whole utterance.
    const useSemanticInterpreter = shouldUseAiCommandInterpreter(text, options);

    if (!useSemanticInterpreter && !options.forcedLabel && !options.skipSuggestion) {
      const preCommands = splitCompoundCommands(text);
      if (preCommands.length <= 1) {
        const preSuggestion = suggestActivity(text);
        if (preSuggestion) {
          showCommandConfirmation(text, preSuggestion);
          finishRequestCapture(capture,{interpreter:'speech-correction',outcome:'needs_confirmation',result:commandConfirmText.textContent,requestedOperations:[{action:'confirm_activity',activity:preSuggestion.label}]});
          return;
        }
      }
    }

    if (useSemanticInterpreter) {
      setCommandFeedback(currentLang === 'ar' ? 'أفهم الأمر…' : 'Understanding the command…', 'question');
      const aiPlan = await requestAiCommandInterpretation(text);
      const requestedOperations=requestedOperationsFromPlan(aiPlan);
      const multiResult = executeAiOperations(aiPlan, text);
      if (multiResult) {
        const q=commandResultLooksLikeQuestion(multiResult);
        setCommandFeedback(multiResult,q?'question':'success');
        finishRequestCapture(capture,{interpreter:'ai-operations',aiPlan,requestedOperations,outcome:q?'partial_or_clarification':'success',result:multiResult});
        commandInput.value='';resizeCommandInput();return;
      }
      const relativePreview = aiPlanRelativePreview(aiPlan);
      if (relativePreview && !options.skipAiRelativeConfirmation) {
        showAiPlanConfirmation(text, aiPlan, relativePreview);
        finishRequestCapture(capture,{interpreter:'ai-relative',aiPlan,requestedOperations,outcome:'needs_confirmation',result:commandConfirmText.textContent});
        commandInput.value='';resizeCommandInput();return;
      }
      const aiResult = executeAiAddPlan(aiPlan);
      if (aiResult) {
        setCommandFeedback(aiResult,'success');
        finishRequestCapture(capture,{interpreter:'ai-add',aiPlan,requestedOperations,outcome:'success',result:aiResult});
        commandInput.value='';resizeCommandInput();return;
      }
      // Complex semantic requests are NOT sent to the legacy single-command
      // fallback. Doing so can collapse an entire Arabic sentence into one
      // "Custom activity" or one guessed activity. Preserve the schedule and
      // ask the user to retry instead of committing incorrect data.
      const safeFailure = currentLang === 'ar'
        ? 'لم أتمكن من تفسير الطلب المركّب بأمان. لم أغيّر الجدول. حاول مرة أخرى أو قسّم الطلب إلى جزأين.'
        : 'I could not safely interpret that multi-part request. I did not change your schedule. Please try again or split it into two parts.';
      setCommandFeedback(safeFailure,'question');
      finishRequestCapture(capture,{interpreter:'ai-semantic-unavailable',aiPlan,requestedOperations,outcome:'no_change',result:safeFailure});
      commandInput.value='';resizeCommandInput();return;
    }
    const result = options.forcedLabel ? parseCommand(text, options.forcedLabel) : parseCommandBatch(text);
    const q=commandResultLooksLikeQuestion(result);
    setCommandFeedback(result,q?'question':'success');
    finishRequestCapture(capture,{interpreter:options.forcedLabel?'local-forced-label':'local-parser',requestedOperations:[],outcome:q?'clarification':'success',result});
    commandInput.value='';resizeCommandInput();
  }

  commandConfirmYes.addEventListener('click', () => {
    if (!pendingCommand) return;
    const pending = { ...pendingCommand };
    hideCommandConfirmation();
    if (pending.type === 'reset') {
      setCommandFeedback(executeScheduleReset(), 'success');
      return;
    }
    if (pending.type === 'ai-plan') {
      const result = executeAiAddPlan(pending.plan);
      setCommandFeedback(result || (currentLang === 'ar' ? 'لم أتمكن من تنفيذ الجدول.' : 'I could not apply that schedule.'), result ? 'success' : 'question');
      return;
    }
    submitCommand({ text: pending.text, forcedLabel: pending.label, skipResetCheck: true });
  });
  commandConfirmNo.addEventListener('click', () => {
    if (!pendingCommand) return;
    const pending = { ...pendingCommand };
    hideCommandConfirmation();
    if (pending.type === 'reset') {
      setCommandFeedback(currentLang === 'ar' ? 'تم إلغاء إعادة الضبط. لم يتغير الجدول.' : 'Reset cancelled. Your schedule was not changed.', 'success');
      return;
    }
    if (pending.type === 'ai-plan') {
      setCommandFeedback(currentLang === 'ar' ? 'تم الإلغاء. لم يتغير الجدول.' : 'Cancelled. Your schedule was not changed.', 'success');
      return;
    }
    submitCommand({ text: pending.text, skipSuggestion: true, skipResetCheck: true });
  });
  function resizeCommandInput() {
    commandInput.style.height = 'auto';
    const maxPx = Math.min(window.innerHeight * 0.34, 280);
    commandInput.style.height = `${Math.min(Math.max(commandInput.scrollHeight, 124), maxPx)}px`;
  }
  sendBtn.addEventListener('click', submitCommand);
  commandInput.addEventListener('input', resizeCommandInput);
  commandInput.addEventListener('keydown', (e) => {
    // Enter creates a new line so longer/multi-command requests remain easy to review.
    // Cmd/Ctrl+Enter submits for keyboard users.
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitCommand();
    }
  });
  resizeCommandInput();

  resetBtn.addEventListener('click', () => {
    const confirmMsg = currentLang === 'ar'
      ? 'إعادة ضبط الجدول الافتراضي؟ سيؤدي هذا إلى مسح كل ما أضفته أو حذفته أو أكملته.'
      : 'Reset to the default schedule? This clears anything you added, removed, or marked done.';
    if (confirm(confirmMsg)) {
      blocks = DEFAULT_BLOCKS.map(b => ensureActivityPair({ ...b, id: nextId(), done: false, note: "" }, b.label));
      saveBlocks(); renderAll();
      setCommandFeedback(currentLang === 'ar' ? 'تمت إعادة ضبط الجدول إلى الوضع الافتراضي.' : 'Schedule reset to default.', 'success');
    }
  });


  // ---- Sheets: Schedule / Logs / Voice slide up over the clock ----
  function makeSheet(sheetId, backdropId, openBtnId, closeBtnId, onOpen) {
    const sheet = document.getElementById(sheetId);
    const backdrop = document.getElementById(backdropId);
    const openBtn = openBtnId ? document.getElementById(openBtnId) : null;
    const closeBtn = document.getElementById(closeBtnId);
    function syncDockActive(activeBtn) {
      document.querySelectorAll('.dock-btn').forEach(btn => btn.classList.toggle('active', btn === activeBtn));
    }
    function open() {
      closeAllSheets();
      sheet.classList.add('open');
      backdrop.classList.add('open');
      syncDockActive(openBtn);
      if (onOpen) onOpen();
    }
    function close() {
      sheet.classList.remove('open');
      backdrop.classList.remove('open');
      if (![...document.querySelectorAll('.sheet')].some(s => s.classList.contains('open'))) {
        syncDockActive(document.getElementById('openScheduleBtn'));
      }
    }
    if (openBtn) openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    return { open, close };
  }

  let openSheets = [];
  function closeAllSheets() { openSheets.forEach(s => s.close()); }

  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  let activeRecognition = null;
  let voiceFinalTranscript = '';
  let voiceAutoSubmit = false;
  let voiceSubmitted = false;

  function setVoiceLiveStatus(message, state = '') {
    const status = document.getElementById('voiceLiveStatus');
    const btn = document.getElementById('voiceListenBtn');
    if (status) status.textContent = message || '';
    if (btn) {
      btn.classList.toggle('is-listening', state === 'listening');
      btn.setAttribute('aria-label', state === 'listening'
        ? (currentLang === 'ar' ? 'إيقاف الاستماع' : 'Stop listening')
        : (currentLang === 'ar' ? 'ابدأ الاستماع' : 'Start listening'));
    }
  }

  function stopVoiceListening() {
    voiceAutoSubmit = false;
    if (activeRecognition) {
      try { activeRecognition.stop(); } catch (_) {}
    }
  }

  function startVoiceListening({ autoSubmit = false } = {}) {
    if (activeRecognition) {
      stopVoiceListening();
      return;
    }
    if (!SpeechRecognitionCtor) {
      setVoiceLiveStatus(currentLang === 'ar'
        ? 'الاستماع الصوتي غير متاح هنا. يمكنك الكتابة بدلاً من ذلك.'
        : 'Voice listening is not available here. You can type instead.', 'error');
      commandInput?.focus();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    activeRecognition = recognition;
    voiceFinalTranscript = '';
    voiceAutoSubmit = !!autoSubmit;
    voiceSubmitted = false;
    recognition.lang = currentLang === 'ar' ? 'ar-SA' : 'en-CA';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceLiveStatus(currentLang === 'ar' ? 'أستمع… تحدث الآن' : 'Listening… speak now', 'listening');
    };
    recognition.onspeechend = () => {
      setVoiceLiveStatus(currentLang === 'ar' ? 'جارٍ فهم طلبك…' : 'Understanding your request…', 'processing');
      try { recognition.stop(); } catch (_) {}
    };
    recognition.onresult = (event) => {
      let interim = '';
      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i]?.[0]?.transcript || '';
        if (event.results[i].isFinal) finalChunk += transcript;
        else interim += transcript;
      }
      if (finalChunk) voiceFinalTranscript = `${voiceFinalTranscript} ${finalChunk}`.trim();
      const visible = `${voiceFinalTranscript} ${interim}`.trim();
      if (visible && commandInput) {
        commandInput.value = visible;
        resizeCommandInput();
      }
    };
    recognition.onerror = (event) => {
      const code = event?.error || 'unknown';
      const denied = code === 'not-allowed' || code === 'service-not-allowed';
      const noSpeech = code === 'no-speech';
      voiceAutoSubmit = false;
      setVoiceLiveStatus(
        denied
          ? (currentLang === 'ar' ? 'اسمح بالميكروفون والتعرّف على الكلام ثم حاول مرة أخرى.' : 'Allow microphone and speech recognition, then try again.')
          : noSpeech
            ? (currentLang === 'ar' ? 'لم أسمع كلاماً. اضغط الميكروفون وحاول مرة أخرى.' : 'I did not hear anything. Tap the microphone and try again.')
            : (currentLang === 'ar' ? 'تعذّر الاستماع. اضغط الميكروفون للمحاولة مرة أخرى.' : 'Listening stopped. Tap the microphone to try again.'),
        'error'
      );
    };
    recognition.onend = () => {
      activeRecognition = null;
      const text = (commandInput?.value || '').trim();
      const shouldSubmit = voiceAutoSubmit && !!text && !voiceSubmitted;
      voiceAutoSubmit = false;
      setVoiceLiveStatus(shouldSubmit
        ? (currentLang === 'ar' ? 'جارٍ تطبيق طلبك…' : 'Applying your request…')
        : (text ? (currentLang === 'ar' ? 'راجع النص أو اضغط إرسال.' : 'Review the text or tap Send.') : ''),
        shouldSubmit ? 'processing' : 'idle');
      if (shouldSubmit) {
        voiceSubmitted = true;
        Promise.resolve().then(() => submitCommand({ text }));
      }
    };

    try {
      recognition.start();
    } catch (_) {
      activeRecognition = null;
      voiceAutoSubmit = false;
      setVoiceLiveStatus(currentLang === 'ar' ? 'تعذّر بدء الميكروفون. حاول مرة أخرى.' : 'Could not start the microphone. Try again.', 'error');
    }
  }

  const scheduleSheet = makeSheet('scheduleSheet', 'scheduleBackdrop', 'openScheduleBtn', 'scheduleCloseBtn', () => { renderLegend(); renderSuggestions(); });
  const logsSheet = makeSheet('logsSheet', 'logsBackdrop', 'openLogsBtn', 'logsCloseBtn', () => { renderLogs(); });
  const voiceSheet = makeSheet('voiceSheet', 'voiceBackdrop', 'openVoiceBtn', 'voiceCloseBtn', () => {});
  const settingsSheet = makeSheet('settingsSheet', 'settingsBackdrop', 'openSettingsBtn', 'settingsCloseBtn', () => { syncSettingsUI(); });
  openSheets = [scheduleSheet, logsSheet, voiceSheet, settingsSheet];

  document.getElementById('homeTalkCta')?.addEventListener('click', () => {
    voiceSheet.open();
    startVoiceListening({ autoSubmit:true });
  });
  document.getElementById('voiceListenBtn')?.addEventListener('click', () => {
    if (activeRecognition) stopVoiceListening();
    else startVoiceListening({ autoSubmit:false });
  });
  document.getElementById('voiceCloseBtn')?.addEventListener('click', stopVoiceListening);
  document.getElementById('voiceBackdrop')?.addEventListener('click', stopVoiceListening);

  function syncSettingsUI() {
    const moonEnabled = document.getElementById('settingsMoonEnabled');
    const moonPos = document.getElementById('settingsMoonPosition');
    const langBtn = document.getElementById('settingsLanguageButton');
    if (moonEnabled) moonEnabled.checked = moonVisible;
    if (moonPos) { moonPos.value = moonPositionPreference; moonPos.disabled = !moonVisible; }
    if (langBtn) langBtn.textContent = currentLang === 'en' ? 'العربية' : 'English';
    const testTitle=document.getElementById('testDataTitle'), testCopy=document.getElementById('testDataCopy'), exportBtn=document.getElementById('exportTestData'), clearBtn=document.getElementById('clearTestData');
    if(testTitle)testTitle.textContent=currentLang==='ar'?'بيانات اختبار مؤقتة':'Temporary test data';
    if(testCopy)testCopy.textContent=currentLang==='ar'?'يحفظ الطلبات ونتائجها على هذا الجهاز فقط لمراجعتها أثناء الاختبار. لا يتم إرسال أي شيء تلقائياً.':'Stores requests and their outcomes only on this device for testing. Nothing is sent automatically.';
    if(exportBtn)exportBtn.textContent=currentLang==='ar'?'تصدير بيانات الاختبار':'Export test data';
    if(clearBtn)clearBtn.textContent=currentLang==='ar'?'مسح بيانات الاختبار':'Clear test data';
    updateTestDataCount();
  }

  document.getElementById('settingsMoonEnabled')?.addEventListener('change', (e) => {
    moonVisible = !!e.target.checked;
    try { localStorage.setItem(MOON_VISIBLE_KEY, String(moonVisible)); } catch (_) {}
    syncSettingsUI(); positionMoonBadge(new Date());
  });
  document.getElementById('settingsMoonPosition')?.addEventListener('change', (e) => {
    moonPositionPreference = ['auto','top-right','top-left','bottom-right','bottom-left'].includes(e.target.value) ? e.target.value : 'auto';
    try { localStorage.setItem(MOON_POSITION_KEY, moonPositionPreference); } catch (_) {}
    positionMoonBadge(new Date());
  });
  document.getElementById('settingsLanguageButton')?.addEventListener('click', () => {
    document.getElementById('langToggle')?.click();
    syncSettingsUI();
  });

  // ---- Activity reminder bubble + best-effort browser notification ----
  const REMINDER_STATE_KEY = 'dailyRhythmReminderState_v1';
  let reminderState = { date: '', ignored: {}, snoozedUntil: {}, snoozeCount: {}, lastNotifyAt: {} };
  let reminderVisibleBlockId = null;
  let reminderNotifiedKey = '';
  const reminderEl = document.getElementById('activityReminder');
  const reminderMain = document.getElementById('reminderMain');
  const reminderTitle = document.getElementById('reminderTitle');
  const reminderDetail = document.getElementById('reminderDetail');
  const reminderTime = document.getElementById('reminderTime');
  const reminderSnooze = document.getElementById('reminderSnooze');
  const reminderEdit = document.getElementById('reminderEdit');
  const reminderDelete = document.getElementById('reminderDelete');
  const reminderDone = document.getElementById('reminderDone');

  function todayKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function loadReminderState() {
    try { reminderState = JSON.parse(localStorage.getItem(REMINDER_STATE_KEY) || '{}') || {}; } catch (e) { reminderState = {}; }
    const key = todayKey();
    if (reminderState.date !== key) reminderState = { date:key, ignored:{}, snoozedUntil:{}, snoozeCount:{}, lastNotifyAt:{} };
    reminderState.ignored ||= {};
    reminderState.snoozedUntil ||= {};
    reminderState.snoozeCount ||= {};
    reminderState.lastNotifyAt ||= {};
  }
  function saveReminderState() { try { localStorage.setItem(REMINDER_STATE_KEY, JSON.stringify(reminderState)); } catch (e) {} }
  loadReminderState();

  function reminderCandidate(now = new Date()) {
    if (reminderState.date !== todayKey(now)) {
      reminderState = { date:todayKey(now), ignored:{}, snoozedUntil:{}, snoozeCount:{}, lastNotifyAt:{} };
      saveReminderState();
    }
    const hf = currentHourFraction(now);
    const nowMs = now.getTime();
    const upcoming = blocks.filter(b => !b.done && !blockIsSkipped(b) && !reminderState.ignored[b.id]).map(b => {
      let deltaMin = (b.start - hf) * 60;
      if (deltaMin < -720) deltaMin += 1440;
      return { b, deltaMin };
    }).filter(x => x.deltaMin <= 5 && x.deltaMin >= -Math.max(5, (x.b.end-x.b.start)*60));
    upcoming.sort((a,b) => Math.abs(a.deltaMin)-Math.abs(b.deltaMin));
    const hit = upcoming[0];
    if (!hit) return null;
    if ((reminderState.snoozedUntil[hit.b.id] || 0) > nowMs) return null;
    return hit;
  }

  function hideActivityReminder() {
    reminderVisibleBlockId = null;
    reminderEl?.classList.remove('show');
  }
  function reminderText(hit) {
    const mins = Math.round(hit.deltaMin);
    if (currentLang === 'ar') {
      if (mins > 0) return `يبدأ خلال ${mins} د · حتى ${fmtClock12(hit.b.end)}`;
      if (mins >= -1) return `يبدأ الآن · حتى ${fmtClock12(hit.b.end)}`;
      return `جارٍ الآن · حتى ${fmtClock12(hit.b.end)}`;
    }
    if (mins > 0) return `Starts in ${mins} min · until ${fmtClock12(hit.b.end)}`;
    if (mins >= -1) return `Starts now · until ${fmtClock12(hit.b.end)}`;
    return `In progress · until ${fmtClock12(hit.b.end)}`;
  }
  async function maybeBrowserNotify(hit) {
    if (!document.hidden || !('Notification' in window) || Notification.permission !== 'granted') return;
    const key = `${todayKey()}-${hit.b.id}-${Math.round(hit.b.start*60)}`;
    const lastAt = Number(reminderState.lastNotifyAt?.[hit.b.id] || 0);
    if (reminderNotifiedKey === key || Date.now() - lastAt < 15*60*1000) return;
    reminderNotifiedKey = key;
    reminderState.lastNotifyAt[hit.b.id] = Date.now();
    saveReminderState();
    const title = blockDisplayLabel(hit.b);
    const body = reminderText(hit);
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          body,
          tag: `daily-rhythm-${hit.b.id}`,
          renotify: false,
          data: { blockId: hit.b.id },
          actions: [
            { action: 'done', title: currentLang === 'ar' ? 'تم' : 'Done' },
            { action: 'snooze', title: currentLang === 'ar' ? 'غفوة' : 'Snooze' },
            { action: 'ignore', title: currentLang === 'ar' ? 'تجاهل' : 'Ignore' }
          ]
        });
      } else {
        const n = new Notification(title, { body, tag: `daily-rhythm-${hit.b.id}` });
        n.onclick = () => { window.focus(); openReminderActivity(hit.b.id); n.close(); };
      }
    } catch (e) { /* notification support varies by browser/PWA mode */ }
  }

  function updateActivityReminder(now = new Date()) {
    if (!reminderEl) return;
    const hit = reminderCandidate(now);
    if (!hit) { hideActivityReminder(); return; }
    reminderVisibleBlockId = hit.b.id;
    reminderTime.textContent = fmtClock12(hit.b.start).replace(/\s(?:AM|PM|صباحًا|مساءً)$/,'');
    reminderTitle.textContent = blockDisplayLabel(hit.b);
    reminderDetail.textContent = reminderText(hit);
    const reflection = document.getElementById('reminderReflection');
    if (reflection) reflection.textContent = currentLang === 'ar'
      ? 'لحظة للتوقف والحضور ومواصلة يومك بنية واضحة.'
      : 'Pause. Be present. Continue with intention.';
    document.getElementById('reminderKicker').textContent = currentLang === 'ar' ? 'لحظة في يومك' : 'A moment in your day';
    const snoozeCount = Number(reminderState.snoozeCount?.[hit.b.id] || 0);
    reminderSnooze.hidden = snoozeCount >= 2;
    reminderSnooze.textContent = currentLang === 'ar'
      ? `غفوة ١٠د (${Math.min(snoozeCount+1,2)}/٢)`
      : `Snooze 10m (${Math.min(snoozeCount+1,2)}/2)`;
    reminderEdit.textContent = currentLang === 'ar' ? 'تعديل' : 'Edit';
    reminderDelete.textContent = currentLang === 'ar' ? 'حذف' : 'Delete';
    reminderDone.textContent = currentLang === 'ar' ? 'تم' : 'Done';
    reminderEl.classList.add('show');
    maybeBrowserNotify(hit);
  }
  function openReminderActivity(id) {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    if (typeof scheduleSheet?.open === 'function') scheduleSheet.open();
    else {
      document.getElementById('scheduleSheet')?.classList.add('open');
      document.getElementById('scheduleBackdrop')?.classList.add('open');
    }
    setTimeout(() => {
      const row = legend.querySelector(`.row[data-id="${id}"]`);
      row?.scrollIntoView({ behavior:'smooth', block:'center' });
      row?.classList.add('active');
    }, 100);
  }
  reminderMain?.addEventListener('click', () => reminderVisibleBlockId && openReminderActivity(reminderVisibleBlockId));
  reminderMain?.addEventListener('keydown', e => { if ((e.key==='Enter'||e.key===' ') && reminderVisibleBlockId) { e.preventDefault(); openReminderActivity(reminderVisibleBlockId); } });
  reminderSnooze?.addEventListener('click', e => {
    e.stopPropagation(); if (!reminderVisibleBlockId) return;
    const id = reminderVisibleBlockId;
    const count = Number(reminderState.snoozeCount?.[id] || 0);
    if (count >= 2) return;
    reminderState.snoozeCount[id] = count + 1;
    reminderState.snoozedUntil[id] = Date.now() + 10*60*1000;
    saveReminderState();
    hideActivityReminder();
  });
  reminderEdit?.addEventListener('click', e => {
    e.stopPropagation();
    const id = reminderVisibleBlockId;
    const b = blocks.find(x => x.id === id);
    if (!b) return;
    if (typeof scheduleSheet?.open === 'function') scheduleSheet.open();
    else {
      document.getElementById('scheduleSheet')?.classList.add('open');
      document.getElementById('scheduleBackdrop')?.classList.add('open');
    }
    hideActivityReminder();
    setTimeout(() => openActivityEditor(b), 120);
  });
  reminderDelete?.addEventListener('click', e => {
    e.stopPropagation();
    const b = blocks.find(x => x.id === reminderVisibleBlockId);
    if (!b) return;
    const id = b.id;
    deleteScheduledBlock(b);
    if (!blocks.some(x => x.id === id)) hideActivityReminder();
  });
  reminderDone?.addEventListener('click', e => {
    e.stopPropagation(); const b = blocks.find(x => x.id === reminderVisibleBlockId); if (!b) return;
    b.done = true; saveBlocks(); renderAll(); addLog('Activity', `Marked "${b.label}" done from reminder`, b.id);
    document.dispatchEvent(new CustomEvent('dailyRhythm:activityCompleted',{detail:{block:{...b}}}));
    hideActivityReminder();
  });
  document.getElementById('enableReminderNotifications')?.addEventListener('click', async () => {
    const btn = document.getElementById('enableReminderNotifications');
    if (!('Notification' in window)) {
      btn.textContent = currentLang === 'ar' ? 'الإشعارات غير مدعومة في هذا المتصفح' : 'Notifications are not supported in this browser';
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      btn.textContent = permission === 'granted'
        ? (currentLang === 'ar' ? 'تم تفعيل الإشعارات' : 'Notifications enabled')
        : (currentLang === 'ar' ? 'لم يتم السماح بالإشعارات' : 'Notifications not allowed');
    } catch (e) {
      btn.textContent = currentLang === 'ar' ? 'تعذّر تفعيل الإشعارات' : 'Could not enable notifications';
    }
  });
  (function setupReminderSwipe(){
    if (!reminderEl) return; let sx=0, sy=0, dx=0, tracking=false;
    reminderEl.addEventListener('pointerdown', e => { sx=e.clientX; sy=e.clientY; dx=0; tracking=true; reminderEl.classList.add('swiping'); });
    reminderEl.addEventListener('pointermove', e => {
      if (!tracking) return; const mx=e.clientX-sx, my=e.clientY-sy; if (Math.abs(mx) < Math.abs(my)+6) return;
      dx=mx; const rtl=document.documentElement.dir==='rtl'; const move=rtl?Math.max(0,mx):Math.min(0,mx); reminderEl.style.transform=`translate(calc(-50% + ${move}px),0)`;
    });
    const end=()=>{ if(!tracking)return; tracking=false; reminderEl.classList.remove('swiping'); reminderEl.style.transform=''; const rtl=document.documentElement.dir==='rtl'; const ignored=rtl?dx>70:dx<-70; if(ignored&&reminderVisibleBlockId){ reminderState.ignored[reminderVisibleBlockId]=true; saveReminderState(); hideActivityReminder(); } };
    reminderEl.addEventListener('pointerup',end); reminderEl.addEventListener('pointercancel',end);
  })();

  // ---- Moon detail popover: tap the moon icon on the dial rim ----
  const moonSheet = document.getElementById('moonSheet');
  const moonBackdrop = document.getElementById('moonBackdrop');
  function openMoonSheet() {
    const now = new Date();
    const idx = moonPhaseIndex(now);
    const illum = moonIllumination(now);
    const nameEn = STRINGS.en.moonPhaseNames[idx];
    const nameAr = STRINGS.ar.moonPhaseNames[idx];

    document.getElementById('moonPhaseTitle').innerHTML =
      `${nameEn}<br><span class="moon-title-ar" dir="rtl">${nameAr}</span>`;
    document.getElementById('moonIllumText').innerHTML =
      `<strong>${illum}%</strong> illuminated<br><span dir="rtl">مضاءة بنسبة ${illum}٪</span>`;
    const moonDateLine = document.getElementById('moonDateLine');
    const moonHijriLine = document.getElementById('moonHijriLine');
    const moonIllumStat = document.getElementById('moonIllumStat');
    const moonPhaseStat = document.getElementById('moonPhaseStat');
    const moonNextPhase = document.getElementById('moonNextPhase');
    const moonNextPhaseDays = document.getElementById('moonNextPhaseDays');
    if (moonDateLine) moonDateLine.textContent = new Intl.DateTimeFormat(currentLang === 'ar' ? 'ar' : 'en', {weekday:'short', month:'short', day:'numeric'}).format(now);
    if (moonHijriLine) moonHijriLine.textContent = document.getElementById('hijriLine')?.textContent || '';
    if (moonIllumStat) moonIllumStat.textContent = `${illum}%`;
    if (moonPhaseStat) moonPhaseStat.textContent = currentLang === 'ar' ? nameAr : nameEn;
    const nextIdx = (idx + 1) % 8;
    const nextName = (currentLang === 'ar' ? STRINGS.ar.moonPhaseNames : STRINGS.en.moonPhaseNames)[nextIdx];
    const phaseNow = moonPhaseFraction(now);
    let target = nextIdx / 8;
    if (target <= phaseNow) target += 1;
    const days = Math.max(1, Math.round((target - phaseNow) * 29.530588));
    if (moonNextPhase) moonNextPhase.textContent = nextName;
    if (moonNextPhaseDays) moonNextPhaseDays.textContent = currentLang === 'ar' ? `خلال ${days} يوم` : `in about ${days} day${days===1?'':'s'}`;
    const phaseArt = document.getElementById('moonPhaseArt');
    const currentMoon = `url("${MOON_PHASE_IMAGES[idx]}")`;
    phaseArt.style.setProperty('--moon-current-image', currentMoon);
    const moonBadge = document.getElementById('skyMoonBadge');
    if (moonBadge) moonBadge.classList.add('is-hidden-during-popup');
    moonSheet.classList.add('open');
    moonBackdrop.classList.add('open');
  }
  function closeMoonSheet() {
    moonSheet.classList.remove('open');
    moonBackdrop.classList.remove('open');
    const moonBadge = document.getElementById('skyMoonBadge');
    if (moonBadge) moonBadge.classList.remove('is-hidden-during-popup');
  }
  document.getElementById('skyMoonBadge').addEventListener('click', openMoonSheet);
  document.getElementById('moonCloseBtn').addEventListener('click', closeMoonSheet);
  moonBackdrop.addEventListener('click', closeMoonSheet);

  // Magnifier is initialized by the production press-and-hold interaction block below.

  const langToggleBtn = document.getElementById('langToggle');
  langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (e2) { /* unavailable */ }
    applyLanguage();
  });
  applyLanguage();


  function applyReminderActionFromUrl() {
    try {
      const u = new URL(window.location.href);
      const action = u.searchParams.get('reminderAction');
      const blockId = u.searchParams.get('blockId');
      if (!action || !blockId) return;
      const b = blocks.find(x => x.id === blockId);
      if (action === 'done' && b) { b.done = true; saveBlocks(); renderAll(); addLog('Activity', `Marked "${b.label}" done from notification`, b.id); document.dispatchEvent(new CustomEvent('dailyRhythm:activityCompleted',{detail:{block:{...b}}})); }
      if (action === 'snooze') {
        const count = Number(reminderState.snoozeCount?.[blockId] || 0);
        if (count < 2) {
          reminderState.snoozeCount[blockId] = count + 1;
          reminderState.snoozedUntil[blockId] = Date.now() + 10*60*1000;
        } else {
          reminderState.ignored[blockId] = true;
        }
        saveReminderState();
      }
      if (action === 'ignore') { reminderState.ignored[blockId] = true; saveReminderState(); }
      if (action === 'open' && b) openReminderActivity(blockId);
      u.searchParams.delete('reminderAction'); u.searchParams.delete('blockId');
      history.replaceState({}, '', u.pathname + u.search + u.hash);
    } catch (e) {}
  }
  applyReminderActionFromUrl();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  tick();
  const prayerUseCurrentBtn = document.getElementById('prayerUseCurrent');
  const prayerChooseCityBtn = document.getElementById('prayerChooseCity');
  if (prayerUseCurrentBtn) prayerUseCurrentBtn.addEventListener('click', () => requestCurrentPrayerLocation());
  if (prayerChooseCityBtn) prayerChooseCityBtn.addEventListener('click', choosePrayerCity);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const tz = deviceTimeZone();
      if (prayerLocation.mode === 'auto' && prayerLocation.timezone !== tz) {
        prayerLocation.timezone = tz; savePrayerLocation(); lastPrayerDateKey = null;
      }
      if (prayerLocation.mode === 'auto') requestCurrentPrayerLocation({ quiet:true });
      refreshPrayersIfNeeded(new Date());
    }
  });
  // On first use, ask for current location. Browsers remember the user's choice;
  // if denied, the visible city fallback remains available in Schedule settings.
  if (prayerLocation.mode === 'default') requestCurrentPrayerLocation();
  else if (prayerLocation.mode === 'auto') requestCurrentPrayerLocation({ quiet:true });
  updatePrayerLocationUI();

  setInterval(tick, 1000);
