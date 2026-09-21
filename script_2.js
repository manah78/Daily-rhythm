
(function(){
  const SETTINGS_KEY='dailyRhythmHeritageSettings_v1';
  const HISTORY_KEY='dailyRhythmHeritageStoryHistory_v2';
  let settings={enabled:true,frequency:'few',onCompletion:true};
  try { settings={...settings,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}; } catch(_){}

  const $=id=>document.getElementById(id);
  const ar=()=>document.documentElement.lang==='ar';
  const t=(en,arText)=>ar()?arText:en;
  const AS='assets/';

  const scholars=[
    {id:'biruni',monogram:'ب',name:'Al-Biruni',nameAr:'البيروني',meta:'973–1048 · Astronomy · Mathematics · Geography'},
    {id:'haytham',monogram:'هـ',name:'Ibn al-Haytham',nameAr:'ابن الهيثم',meta:'c. 965–1040 · Optics · Mathematics · Astronomy'},
    {id:'khwarizmi',monogram:'خ',name:'Al-Khwarizmi',nameAr:'الخوارزمي',meta:'c. 780–850 · Mathematics · Astronomy · Geography'},
    {id:'zahrawi',monogram:'ز',name:'Al-Zahrawi',nameAr:'الزهراوي',meta:'936–1013 · Medicine · Surgery · Al-Andalus'},
    {id:'idrisi',monogram:'إ',name:'Al-Idrisi',nameAr:'الإدريسي',meta:'c. 1100–1165 · Geography · Cartography · Al-Andalus/Sicily'}
  ];

  const storyBank=[
    {
      id:'biruni-earth-radius',scholarId:'biruni',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-biruni-earth-radius.webp"])||'assets/story-biruni-earth-radius.webp',
      categories:['moon','astronomy','prayer','science','measurement'],
      titleEn:'How could a mountain help measure the Earth?',titleAr:'كيف يمكن لجبل أن يساعد في قياس الأرض؟',
      hookEn:'Imagine standing high above the horizon with no satellite, no GPS and one difficult question: how large is the Earth?',
      hookAr:'تخيّل أنك تقف فوق جبل عالٍ بلا أقمار صناعية ولا نظام تحديد مواقع، ومعك سؤال صعب: ما حجم الأرض؟',
      contributionEn:'Al-Biruni described a geometric method that used the height of a mountain and the angle to the horizon to estimate the Earth’s radius.',
      contributionAr:'وصف البيروني طريقة هندسية تستخدم ارتفاع الجبل وزاوية النظر إلى الأفق لتقدير نصف قطر الأرض.',
      legacyEn:'The idea is powerful because the instrument was not the impressive part—the reasoning was. Careful angles could turn one visible horizon into a measurement of the planet.',
      legacyAr:'قوة الفكرة لم تكن في فخامة الأداة، بل في الاستدلال: زوايا دقيقة حوّلت الأفق المرئي إلى قياس لكوكب كامل.'
    },
    {
      id:'biruni-mountain-angle',scholarId:'biruni',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-biruni-mountain-angle.webp"])||'assets/story-biruni-mountain-angle.webp',
      categories:['hiking','walk','outdoors','measurement','travel'],
      titleEn:'A horizon became a measuring instrument',titleAr:'حين أصبح الأفق أداة قياس',
      hookEn:'A walk to high ground can change what you notice. For Al-Biruni, elevation, distance and angle were pieces of the same puzzle.',
      hookAr:'قد تغيّر المرتفعات ما تلاحظه في العالم. عند البيروني كان الارتفاع والمسافة والزاوية أجزاءً من لغز واحد.',
      contributionEn:'His work in mathematical geography connected observations of landscapes with trigonometric calculation and astronomical measurement.',
      contributionAr:'ربط عمله في الجغرافيا الرياضية بين ملاحظة التضاريس والحساب المثلثي والقياس الفلكي.',
      legacyEn:'It is a reminder that mathematics can begin with something ordinary: a mountain, a line of sight and the discipline to measure carefully.',
      legacyAr:'إنها تذكير بأن الرياضيات قد تبدأ من شيء مألوف: جبل وخط نظر وانضباط في القياس.'
    },
    {
      id:'biruni-sky-measurement',scholarId:'biruni',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-biruni-sky-measurement.webp"])||'assets/story-biruni-sky-measurement.webp',
      categories:['prayer','moon','sky','astronomy','time'],
      titleEn:'Time was read from the sky',titleAr:'كان الزمن يُقرأ من السماء',
      hookEn:'Before a phone could tell you the hour, the sky itself was a clock, calendar and compass.',
      hookAr:'قبل أن يخبرك الهاتف بالوقت، كانت السماء نفسها ساعةً وتقويماً وبوصلة.',
      contributionEn:'Al-Biruni wrote extensively about astronomy, calendars and methods of observation, comparing systems of time used by different cultures.',
      contributionAr:'كتب البيروني بإسهاب عن الفلك والتقاويم وطرق الرصد، وقارن بين أنظمة الزمن لدى ثقافات مختلفة.',
      legacyEn:'Every prayer time, lunar month and changing shadow carries a small echo of that older habit: look up, observe, calculate.',
      legacyAr:'يحمل كل وقت صلاة وشهر قمري وظل متغيّر صدىً لتلك العادة القديمة: انظر، راقب، واحسب.'
    },
    {
      id:'haytham-camera-obscura',scholarId:'haytham',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-haytham-camera-obscura.webp"])||'assets/story-haytham-camera-obscura.webp',
      categories:['reading','study','science','camera','light','curiosity'],
      titleEn:'A tiny opening could project an entire scene',titleAr:'فتحة صغيرة يمكن أن تسقط مشهداً كاملاً',
      hookEn:'Darken a room, allow light through a small opening, and an outside scene can appear inside—upside down.',
      hookAr:'أظلم غرفة واترك الضوء يمر عبر فتحة صغيرة، فيظهر مشهد الخارج في الداخل مقلوباً.',
      contributionEn:'Ibn al-Haytham used dark-room observations while studying how rays of light travel, an important part of the history of the camera obscura and optics.',
      contributionAr:'استخدم ابن الهيثم ملاحظات الغرفة المظلمة أثناء دراسته لمسار أشعة الضوء، وهي محطة مهمة في تاريخ البصريات والكاميرا المظلمة.',
      legacyEn:'The image feels almost magical, but the lesson is scientific: surprising effects become understandable when you control the conditions and observe carefully.',
      legacyAr:'تبدو الصورة كأنها سحر، لكن الدرس علمي: الظواهر المدهشة تصبح مفهومة عندما تضبط الظروف وتراقب بعناية.'
    },
    {
      id:'haytham-light-rays',scholarId:'haytham',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-haytham-light-rays.webp"])||'assets/story-haytham-light-rays.webp',
      categories:['science','study','reading','photo','light'],
      titleEn:'Does sight leave the eye—or does light enter it?',titleAr:'هل يخرج البصر من العين أم يدخلها الضوء؟',
      hookEn:'For centuries, thinkers argued about vision. Ibn al-Haytham challenged explanations that treated sight as something emitted by the eye.',
      hookAr:'لُقرون اختلف المفكرون في تفسير الإبصار. تحدّى ابن الهيثم الآراء التي اعتبرت الرؤية شيئاً يخرج من العين.',
      contributionEn:'In the Book of Optics, he developed an influential account in which light from objects reaches the eye and investigated reflection and refraction experimentally.',
      contributionAr:'قدّم في كتاب المناظر تصوراً مؤثراً يصل فيه الضوء من الأجسام إلى العين، ودرس الانعكاس والانكسار بالتجربة.',
      legacyEn:'That shift matters beyond optics: a confident explanation is not enough. The world has to agree with it.',
      legacyAr:'هذا التحول يتجاوز البصريات: لا يكفي أن يبدو التفسير مقنعاً، بل يجب أن يوافق ما نراه في الواقع.'
    },
    {
      id:'haytham-experiment-evidence',scholarId:'haytham',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-haytham-experiment-evidence.webp"])||'assets/story-haytham-experiment-evidence.webp',
      categories:['study','learning','work','science','research'],
      titleEn:'What if the experiment disagrees with you?',titleAr:'ماذا لو خالفت التجربة فكرتك؟',
      hookEn:'The difficult part of learning is not finding evidence for what you already believe. It is letting evidence change your mind.',
      hookAr:'أصعب ما في التعلم ليس إيجاد دليل لما تؤمن به مسبقاً، بل السماح للدليل بأن يغيّر رأيك.',
      contributionEn:'Ibn al-Haytham repeatedly paired mathematical reasoning with controlled observation in his investigations of light and vision.',
      contributionAr:'جمع ابن الهيثم مراراً بين الاستدلال الرياضي والملاحظة المضبوطة في أبحاثه عن الضوء والإبصار.',
      legacyEn:'That attitude still feels modern: form a question, isolate what matters, observe, and be willing to revise.',
      legacyAr:'لا يزال هذا الموقف حديثاً: ضع سؤالاً، اعزل ما يهم، راقب، وكن مستعداً للمراجعة.'
    },
    {
      id:'khwarizmi-algebra-steps',scholarId:'khwarizmi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-khwarizmi-algebra-steps.webp"])||'assets/story-khwarizmi-algebra-steps.webp',
      categories:['math','study','work','planning','coding','problem'],
      titleEn:'A hard problem becomes a sequence of steps',titleAr:'المسألة الصعبة تصبح سلسلة خطوات',
      hookEn:'When a task feels tangled, one of the oldest useful tricks is still the same: name the unknown, then work step by step.',
      hookAr:'عندما تبدو المهمة متشابكة، تبقى إحدى أقدم الحيل المفيدة كما هي: حدّد المجهول ثم تقدّم خطوةً خطوة.',
      contributionEn:'Al-Khwarizmi’s algebraic writing presented systematic procedures for solving classes of equations rather than treating each example as an isolated puzzle.',
      contributionAr:'عرضت كتابات الخوارزمي في الجبر إجراءات منهجية لحل أنواع من المعادلات بدلاً من التعامل مع كل مسألة كحالة منفصلة.',
      legacyEn:'That procedural way of thinking is why his work feels unexpectedly close to modern problem solving.',
      legacyAr:'لهذا يبدو التفكير الإجرائي في عمله قريباً على نحو مدهش من حل المشكلات اليوم.'
    },
    {
      id:'khwarizmi-algorithm-name',scholarId:'khwarizmi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-khwarizmi-algorithm-name.webp"])||'assets/story-khwarizmi-algorithm-name.webp',
      categories:['coding','software','work','technology','study'],
      titleEn:'His name is hidden inside a word you use every day',titleAr:'اسمه مختبئ في كلمة نستخدمها كل يوم',
      hookEn:'Search results, navigation and software all depend on algorithms. The word itself carries a trace of Al-Khwarizmi’s name.',
      hookAr:'تعتمد نتائج البحث والملاحة والبرمجيات على الخوارزميات. والكلمة نفسها تحمل أثراً من اسم الخوارزمي.',
      contributionEn:'Latin versions of his name, associated with works on calculation, eventually gave rise to the European term that became “algorithm.”',
      contributionAr:'أدت الصيغ اللاتينية لاسمه، المرتبطة بمؤلفاته في الحساب، إلى المصطلح الأوروبي الذي تطور إلى كلمة «algorithm».',
      legacyEn:'A medieval scholar’s name now sits quietly inside the vocabulary of computing.',
      legacyAr:'أصبح اسم عالم من العصور الوسطى حاضراً بهدوء داخل مفردات الحوسبة الحديثة.'
    },
    {
      id:'khwarizmi-calculation-tables',scholarId:'khwarizmi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-khwarizmi-calculation-tables.webp"])||'assets/story-khwarizmi-calculation-tables.webp',
      categories:['planning','finance','work','math','numbers'],
      titleEn:'Calculation was also a practical technology',titleAr:'كان الحساب أيضاً تقنية عملية',
      hookEn:'Numbers were not abstract decoration. They helped people calculate trade, inheritance, land and astronomy.',
      hookAr:'لم تكن الأرقام زينةً مجردة؛ فقد ساعدت الناس في حساب التجارة والميراث والأرض والفلك.',
      contributionEn:'Al-Khwarizmi wrote on calculation with Hindu-Arabic numerals as well as algebra and astronomical tables.',
      contributionAr:'كتب الخوارزمي في الحساب بالأرقام الهندية العربية، إضافة إلى الجبر والجداول الفلكية.',
      legacyEn:'The heritage here is not only a theorem. It is the idea that reliable methods can make everyday decisions clearer.',
      legacyAr:'التراث هنا ليس نظرية فقط، بل فكرة أن الطرق الموثوقة تجعل القرارات اليومية أوضح.'
    },
    {
      id:'zahrawi-surgical-tools',scholarId:'zahrawi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-zahrawi-surgical-tools.webp"])||'assets/story-zahrawi-surgical-tools.webp',
      categories:['health','doctor','medicine','recovery','care'],
      titleEn:'Why draw the instrument?',titleAr:'لماذا ترسم الأداة؟',
      hookEn:'A medical instruction can be dangerously vague if the reader cannot see the tool being described.',
      hookAr:'قد تكون التعليمات الطبية غامضة وخطيرة إذا لم يستطع القارئ رؤية الأداة المقصودة.',
      contributionEn:'The surgical section of Al-Zahrawi’s medical encyclopedia described many instruments and included illustrations to help explain their use.',
      contributionAr:'وصف القسم الجراحي من موسوعة الزهراوي عدداً كبيراً من الأدوات وتضمّن رسوماً تساعد على شرح استخدامها.',
      legacyEn:'It is an early reminder that good technical knowledge needs more than words: design, illustration and precise explanation matter.',
      legacyAr:'إنها تذكير مبكر بأن المعرفة التقنية الجيدة تحتاج إلى أكثر من الكلمات: التصميم والرسم والشرح الدقيق مهمون.'
    },
    {
      id:'zahrawi-instrument-design',scholarId:'zahrawi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-zahrawi-instrument-design.webp"])||'assets/story-zahrawi-instrument-design.webp',
      categories:['health','design','craft','medicine','work'],
      titleEn:'A tool is part of the treatment',titleAr:'الأداة جزء من العلاج',
      hookEn:'Sometimes progress is not a new theory. It is a better instrument in the practitioner’s hand.',
      hookAr:'أحياناً لا يكون التقدم نظرية جديدة، بل أداة أفضل في يد الممارس.',
      contributionEn:'Al-Zahrawi documented specialized surgical instruments and techniques, preserving practical details for later physicians.',
      contributionAr:'وثّق الزهراوي أدوات جراحية متخصصة وتقنيات عملية، وحفظ تفاصيلها للأطباء الذين جاءوا بعده.',
      legacyEn:'The connection to modern design is immediate: the shape of a tool changes what a skilled person can do safely and precisely.',
      legacyAr:'الصلة بالتصميم الحديث مباشرة: شكل الأداة يغيّر ما يستطيع المختص إنجازه بأمان ودقة.'
    },
    {
      id:'zahrawi-medical-encyclopedia',scholarId:'zahrawi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-zahrawi-medical-encyclopedia.webp"])||'assets/story-zahrawi-medical-encyclopedia.webp',
      categories:['reading','health','learning','medicine'],
      titleEn:'Thirty volumes built a medical memory',titleAr:'ثلاثون جزءاً صنعت ذاكرة طبية',
      hookEn:'Knowledge disappears easily when it stays only in one practitioner’s hands.',
      hookAr:'تضيع المعرفة بسهولة عندما تبقى في يد ممارس واحد فقط.',
      contributionEn:'Al-Zahrawi’s Al-Tasrif was a large medical encyclopedia covering many areas of medicine; its surgical material later circulated through Latin translation.',
      contributionAr:'كان «التصريف» للزهراوي موسوعة طبية كبيرة تناولت مجالات متعددة، وانتشر قسمها الجراحي لاحقاً عبر الترجمة اللاتينية.',
      legacyEn:'Writing turned individual experience into something that could travel farther than its author.',
      legacyAr:'حوّلت الكتابة الخبرة الفردية إلى معرفة تستطيع السفر أبعد من صاحبها.'
    },
    {
      id:'idrisi-world-map',scholarId:'idrisi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-idrisi-world-map.webp"])||'assets/story-idrisi-world-map.webp',
      categories:['travel','map','geography','commute','walk'],
      titleEn:'What would the world look like without satellite maps?',titleAr:'كيف سيبدو العالم بلا خرائط الأقمار الصناعية؟',
      hookEn:'Imagine building a picture of distant coasts and cities from travellers, books and careful comparison.',
      hookAr:'تخيّل أن تبني صورة للسواحل والمدن البعيدة من روايات الرحالة والكتب والمقارنة الدقيقة.',
      contributionEn:'Al-Idrisi produced a major geographical work for Roger II of Sicily in 1154, accompanied by regional maps.',
      contributionAr:'أعد الإدريسي عملاً جغرافياً مهماً لروجر الثاني في صقلية سنة 1154، وصحبته خرائط إقليمية.',
      legacyEn:'Every map is an argument about where things are. Al-Idrisi’s project shows how much collaboration and verification that argument requires.',
      legacyAr:'كل خريطة هي حجة حول موقع الأشياء. ويُظهر مشروع الإدريسي مقدار التعاون والتحقق اللازمين لبنائها.'
    },
    {
      id:'idrisi-traveller-reports',scholarId:'idrisi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-idrisi-traveller-reports.webp"])||'assets/story-idrisi-traveller-reports.webp',
      categories:['travel','commute','walk','people','geography'],
      titleEn:'A traveller’s story became geographic data',titleAr:'تحولت رواية المسافر إلى بيانات جغرافية',
      hookEn:'A road, river or port described by one traveller is a story. Compared with many reports, it can become a map.',
      hookAr:'طريق أو نهر أو ميناء يصفه مسافر واحد هو رواية؛ وعندما تقارنه بروايات كثيرة يمكن أن يتحول إلى خريطة.',
      contributionEn:'Al-Idrisi drew on earlier written sources and reports associated with travellers while compiling descriptions of regions and routes.',
      contributionAr:'اعتمد الإدريسي على مصادر مكتوبة سابقة وعلى روايات مرتبطة بالرحالة أثناء جمع أوصاف الأقاليم والطرق.',
      legacyEn:'The method feels familiar today: gather observations, compare sources, look for contradictions, then build the clearest model you can.',
      legacyAr:'تبدو الطريقة مألوفة اليوم: اجمع الملاحظات، قارن المصادر، ابحث عن التناقضات، ثم ابنِ أوضح نموذج ممكن.'
    },
    {
      id:'idrisi-regional-maps',scholarId:'idrisi',image:(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["story-idrisi-regional-maps.webp"])||'assets/story-idrisi-regional-maps.webp',
      categories:['planning','travel','geography','navigation'],
      titleEn:'The world was easier to understand in pieces',titleAr:'كان فهم العالم أسهل عندما يُقسّم إلى أجزاء',
      hookEn:'One giant map can overwhelm. Regional maps let a reader inspect routes, coasts and places at a more useful scale.',
      hookAr:'قد تربكك خريطة واحدة ضخمة؛ أما الخرائط الإقليمية فتسمح بفحص الطرق والسواحل والأماكن بمقياس أكثر فائدة.',
      contributionEn:'Al-Idrisi’s geographical project included a set of sectional maps that together described the inhabited world known to his compilers.',
      contributionAr:'تضمن مشروع الإدريسي الجغرافي مجموعة من الخرائط المقطعية التي وصفت معاً العالم المأهول المعروف لدى جامعيه.',
      legacyEn:'It is the same design principle behind modern zoom levels: show the right amount of world for the question at hand.',
      legacyAr:'إنه المبدأ نفسه وراء مستويات التكبير الحديثة: اعرض من العالم القدر المناسب للسؤال الذي تريد الإجابة عنه.'
    }
  ];

  let activeStoryId=storyBank[0].id;
  let storyPage=0;

  function saveSettings(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));}catch(_){}}
  function loadHistory(){try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')||[]}catch(_){return []}}
  function saveHistory(h){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(h.slice(-120)))}catch(_){}}
  function activeStory(){return storyBank.find(s=>s.id===activeStoryId)||storyBank[0]}
  function scholarOf(id){return scholars.find(s=>s.id===id)||scholars[0]}
  function storiesForScholar(id){return storyBank.filter(s=>s.scholarId===id)}
  function historyTime(id){
    const rows=loadHistory().filter(h=>h.storyId===id);
    return rows.length?Math.max(...rows.map(h=>h.shownAt||0)):0;
  }
  function leastRecent(list){
    return [...list].sort((a,b)=>historyTime(a.id)-historyTime(b.id))[0]||list[0];
  }
  function pickForScholar(id){return leastRecent(storiesForScholar(id));}

  function categoryFor(block){
    const raw=((block?.label||'')+' '+(block?.labelAr||'')+' '+(block?.note||'')).toLowerCase();
    const tests=[
      ['prayer',/prayer|fajr|dhuhr|asr|maghrib|isha|quran|قرآن|صلاة|فجر|ظهر|عصر|مغرب|عشاء/],
      ['coding',/code|coding|program|software|developer|برمج|كود/],
      ['math',/math|algebra|calculate|finance|budget|رياض|حساب|ميزان/],
      ['study',/study|learn|school|homework|read|reading|بحث|دراسة|تعلم|مدرس|قراءة/],
      ['health',/doctor|health|medicine|therapy|recovery|medical|طبيب|صحة|دواء|علاج/],
      ['travel',/travel|flight|drive|commute|trip|walk|hike|سفر|رحلة|قيادة|مشي/],
      ['work',/work|plan|meeting|project|task|عمل|اجتماع|مشروع|تخطيط/],
      ['science',/science|experiment|photo|camera|light|علم|تجرب|صورة|ضوء/]
    ];
    for(const [cat,re] of tests) if(re.test(raw)) return cat;
    return 'general';
  }

  function eligibleByFrequency(){
    if(!settings.enabled||!settings.onCompletion||settings.frequency==='manual') return false;
    const h=loadHistory();
    const now=Date.now();
    const day=86400000;
    if(settings.frequency==='daily') return !h.some(x=>x.trigger==='completion'&&now-(x.shownAt||0)<20*60*60*1000);
    if(settings.frequency==='few'){
      const recent=h.filter(x=>x.trigger==='completion'&&now-(x.shownAt||0)<7*day);
      return recent.length<3 && !recent.some(x=>now-(x.shownAt||0)<36*60*60*1000);
    }
    return false;
  }

  function pickContextual(block){
    const cat=categoryFor(block);
    const matching=storyBank.filter(s=>s.categories.includes(cat));
    const pool=matching.length?matching:storyBank;
    const now=Date.now(), month=30*86400000;
    const h=loadHistory();
    const fresh=pool.filter(s=>!h.some(x=>x.storyId===s.id&&now-(x.shownAt||0)<month));
    return leastRecent(fresh.length?fresh:pool);
  }

  function recordStory(story,trigger='manual',block=null,opened=false){
    const h=loadHistory();
    const existing=h.findLast?.(x=>x.storyId===story.id&&x.trigger===trigger&&Date.now()-(x.shownAt||0)<30000);
    if(existing){
      if(opened) existing.openedAt=Date.now();
    }else{
      h.push({
        storyId:story.id,scholarId:story.scholarId,shownAt:Date.now(),
        openedAt:opened?Date.now():0,trigger,
        activityId:block?.id||'',activityLabel:block?.label||'',category:categoryFor(block)
      });
    }
    saveHistory(h);
    renderRecent();
  }

  function renderScholarStrip(){
    const strip=$('scholarStrip'); if(!strip)return;
    strip.innerHTML='';
    const current=activeStory();
    scholars.forEach(sc=>{
      const btn=document.createElement('button');
      btn.type='button';btn.className='scholar-chip'+(sc.id===current.scholarId?' active':'');
      btn.setAttribute('aria-label',t('Explore '+sc.name,'استكشف '+sc.nameAr));
      const avatar=document.createElement('span');avatar.className='scholar-chip-avatar';avatar.textContent=sc.monogram;
      const name=document.createElement('span');name.className='scholar-chip-name';name.textContent=ar()?sc.nameAr:sc.name;
      btn.append(avatar,name);
      btn.addEventListener('click',()=>{const s=pickForScholar(sc.id);renderStory(s.id,0,true);});
      strip.appendChild(btn);
    });
  }

  function renderRecent(){
    const body=$('storiesSheet')?.querySelector('.sheet-body');
    if(!body)return;
    let details=$('heritageRecent');
    const hist=loadHistory().filter(x=>x.openedAt||x.shownAt).slice(-8).reverse();
    const unique=[];const seen=new Set();
    for(const h of hist){if(!seen.has(h.storyId)){seen.add(h.storyId);unique.push(h);}}
    if(!unique.length){details?.remove();return;}
    if(!details){
      details=document.createElement('details');details.id='heritageRecent';details.className='heritage-recent';
      const summary=document.createElement('summary');summary.id='heritageRecentSummary';details.appendChild(summary);
      const row=document.createElement('div');row.className='heritage-recent-row';row.id='heritageRecentRow';details.appendChild(row);
      body.appendChild(details);
    }
    $('heritageRecentSummary').textContent=t('Recently discovered','اكتشفتها مؤخراً');
    const row=$('heritageRecentRow');row.innerHTML='';
    unique.slice(0,4).forEach(h=>{
      const s=storyBank.find(x=>x.id===h.storyId);if(!s)return;
      const b=document.createElement('button');b.type='button';b.className='heritage-recent-chip';
      b.textContent=ar()?s.titleAr:s.titleEn;
      b.addEventListener('click',()=>renderStory(s.id,0,true));
      row.appendChild(b);
    });
  }

  function renderStory(storyId=activeStoryId,page=storyPage,markOpened=false){
    if(storyBank.some(s=>s.id===storyId))activeStoryId=storyId;
    storyPage=Math.max(0,Math.min(2,page));
    const s=activeStory(),sc=scholarOf(s.scholarId);
    renderScholarStrip();
    if(!$('storyName'))return;
    const card=$('heritageStoryCard');if(card)card.dataset.storyPage=String(storyPage);
    $('storyMedallion').textContent=sc.monogram;
    const hero=$('storyHeroImage'),mono=$('storyHeroMonogram'),badge=$('storyHeroBadge');
    if(hero&&mono){
      hero.src=s.image;hero.alt=ar()?s.titleAr:s.titleEn;hero.hidden=false;mono.hidden=true;
      hero.onerror=()=>{hero.hidden=true;mono.hidden=false;mono.textContent=sc.monogram;};
    }
    if(badge)badge.textContent=t(`${storyPage+1} of 3`,`${storyPage+1} من 3`);
    $('storyName').textContent=sc.name;$('storyNameAr').textContent=sc.nameAr;$('storyMeta').textContent=sc.meta;
    const headline=$('storyPageHeadline'),hint=$('storySwipeHint');
    const a=$('storySectionTitle'),ac=$('storyContext'),b=$('storyContributionTitle'),bc=$('storyContribution'),c=$('storyLegacyTitle'),cc=$('storyLegacy');
    [a,ac,b,bc,c,cc].forEach(x=>{if(x)x.hidden=true;});
    if(storyPage===0){
      headline.textContent=ar()?s.titleAr:s.titleEn;
      a.textContent=t('The moment','اللحظة');ac.textContent=ar()?s.hookAr:s.hookEn;a.hidden=false;ac.hidden=false;
    }else if(storyPage===1){
      headline.textContent=t('What happened next?','ماذا حدث بعد ذلك؟');
      b.textContent=t('The contribution','الإسهام');bc.textContent=ar()?s.contributionAr:s.contributionEn;b.hidden=false;bc.hidden=false;
    }else{
      headline.textContent=t('Why it still feels close to us','لماذا ما زال قريباً منا');
      c.textContent=t('The connection','الصلة اليوم');cc.textContent=ar()?s.legacyAr:s.legacyEn;c.hidden=false;cc.hidden=false;
    }
    hint.textContent=t(storyPage<2?'Swipe to continue':'Swipe for another discovery',storyPage<2?'اسحب للمتابعة':'اسحب لاكتشاف آخر');
    $('storyPrev').textContent=t(storyPage===0?'← Previous':'← Back',storyPage===0?'السابق →':'رجوع →');
    $('storyNext').textContent=t(storyPage===2?'Another story →':'Next →',storyPage===2?'← قصة أخرى':'← التالي');
    $('storiesHeader').textContent=t('Stories from our heritage','قصص من تراثنا');
    $('navStoriesLabel').textContent=t('Stories','قصص');
    const dots=$('storyDots');dots.innerHTML='';
    for(let i=0;i<3;i++){
      const d=document.createElement('button');d.type='button';d.className='story-dot'+(i===storyPage?' active':'');
      d.setAttribute('aria-label',t(`Story page ${i+1}`,`صفحة القصة ${i+1}`));
      d.addEventListener('click',()=>renderStory(activeStoryId,i,true));dots.appendChild(d);
    }
    if(markOpened)recordStory(s,'manual',null,true);
    renderRecent();
  }

  function nextStory(step=1){
    const i=storyBank.findIndex(s=>s.id===activeStoryId);
    return storyBank[(i+step+storyBank.length)%storyBank.length];
  }

  function openStories(storyId=activeStoryId,page=0,trigger='manual',block=null){
    const candidate=storyBank.find(s=>s.id===storyId)||storyBank[0];
    activeStoryId=candidate.id;storyPage=page;renderStory(activeStoryId,page,false);
    recordStory(candidate,trigger,block,true);
    storiesExperience.open();
  }

  function syncHeritageUI(){
    if($('heritageEnabled'))$('heritageEnabled').checked=!!settings.enabled;
    if($('heritageFrequency'))$('heritageFrequency').value=settings.frequency;
    if($('heritageOnCompletion'))$('heritageOnCompletion').checked=!!settings.onCompletion;
    if($('heritageTeaser'))$('heritageTeaser').style.display=settings.enabled&&settings.frequency!=='manual'?'':'none';
    $('heritageSettingsTitle').textContent=t('Heritage stories','قصص التراث');
    $('heritageEnabledLabel').textContent=t('Show heritage stories','إظهار قصص التراث');
    $('heritageFrequencyLabel').textContent=t('Story frequency','تكرار القصص');
    $('heritageCompletionLabel').textContent=t('Include after activity completion','إظهار قصة بعد إكمال نشاط');
    const f=$('heritageFrequency');if(f){
      f.options[0].textContent=t('About once a day','مرة تقريباً كل يوم');
      f.options[1].textContent=t('A few times a week','بضع مرات في الأسبوع');
      f.options[2].textContent=t('Only when I open Stories','فقط عندما أفتح القصص');
    }
    $('heritageTeaserKicker').textContent=t('A moment from our heritage','لحظة من تراثنا');
    $('heritageTeaserTitle').textContent=t('How could a mountain help measure the Earth?','كيف يمكن لجبل أن يساعد في قياس الأرض؟');
    $('moonHeritageKicker').textContent=t('A moment from our heritage','لحظة من تراثنا');
    $('moonHeritageTitle').textContent=t('A tiny opening could project an entire scene','فتحة صغيرة يمكن أن تسقط مشهداً كاملاً');
    $('moonHeritageCopy').textContent=t('A visual story about Ibn al-Haytham, light and the camera obscura.','قصة بصرية عن ابن الهيثم والضوء والكاميرا المظلمة.');
    $('moonHeritageOpen').textContent=t('Discover the story','اكتشف القصة');
    renderStory(activeStoryId,storyPage,false);
  }

  const storiesExperience=makeSheet('storiesSheet','storiesBackdrop','openStoriesBtn','storiesCloseBtn',()=>renderStory(activeStoryId,storyPage,false));
  openSheets.push(storiesExperience);

  $('heritageTeaser')?.addEventListener('click',()=>openStories('biruni-earth-radius',0,'home'));
  $('moonHeritageOpen')?.addEventListener('click',()=>{
    $('moonSheet')?.classList.remove('open');$('moonBackdrop')?.classList.remove('open');
    openStories('haytham-camera-obscura',0,'moon');
  });
  $('storyPrev')?.addEventListener('click',()=>{
    if(storyPage>0)renderStory(activeStoryId,storyPage-1,true);
    else renderStory(nextStory(-1).id,2,true);
  });
  $('storyNext')?.addEventListener('click',()=>{
    if(storyPage<2)renderStory(activeStoryId,storyPage+1,true);
    else renderStory(nextStory(1).id,0,true);
  });
  $('heritageEnabled')?.addEventListener('change',e=>{settings.enabled=!!e.target.checked;saveSettings();syncHeritageUI();});
  $('heritageFrequency')?.addEventListener('change',e=>{settings.frequency=e.target.value;saveSettings();syncHeritageUI();});
  $('heritageOnCompletion')?.addEventListener('change',e=>{settings.onCompletion=!!e.target.checked;saveSettings();});

  (function gestures(){
    const card=$('heritageStoryCard');if(!card)return;
    let sx=0,sy=0,tracking=false;
    card.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;sx=e.clientX;sy=e.clientY;tracking=true;});
    card.addEventListener('pointerup',e=>{
      if(!tracking)return;tracking=false;
      const dx=e.clientX-sx,dy=e.clientY-sy;
      if(Math.abs(dx)<48||Math.abs(dx)<Math.abs(dy)*1.2)return;
      const forward=ar()?dx>0:dx<0;
      if(forward){if(storyPage<2)renderStory(activeStoryId,storyPage+1,true);else renderStory(nextStory(1).id,0,true);}
      else {if(storyPage>0)renderStory(activeStoryId,storyPage-1,true);else renderStory(nextStory(-1).id,2,true);}
    });
    card.addEventListener('pointercancel',()=>tracking=false);
    document.addEventListener('keydown',e=>{
      if(!$('storiesSheet')?.classList.contains('open'))return;
      if(e.key==='ArrowRight'){e.preventDefault();if(ar()){if(storyPage>0)renderStory(activeStoryId,storyPage-1,true);else renderStory(nextStory(-1).id,2,true);}else{if(storyPage<2)renderStory(activeStoryId,storyPage+1,true);else renderStory(nextStory(1).id,0,true);}}
      if(e.key==='ArrowLeft'){e.preventDefault();if(ar()){if(storyPage<2)renderStory(activeStoryId,storyPage+1,true);else renderStory(nextStory(1).id,0,true);}else{if(storyPage>0)renderStory(activeStoryId,storyPage-1,true);else renderStory(nextStory(-1).id,2,true);}}
    });
  })();

  function offerCompletionStory(block){
    if(!eligibleByFrequency())return;
    const s=pickContextual(block);
    recordStory(s,'completion',block,false);
    $('heritageToastTitle').textContent=t('A discovery from your heritage','اكتشاف من تراثك');
    $('heritageToastCopy').textContent=ar()?s.titleAr:s.titleEn;
    $('heritageToastOpen').textContent=t('Discover','اكتشف');
    const toast=$('heritageCompletionToast');toast.classList.add('show');
    const hide=setTimeout(()=>toast.classList.remove('show'),9000);
    $('heritageToastOpen').onclick=()=>{clearTimeout(hide);toast.classList.remove('show');openStories(s.id,0,'completion-open',block);};
  }

  document.addEventListener('dailyRhythm:activityCompleted',e=>setTimeout(()=>offerCompletionStory(e.detail?.block||null),180));

  new MutationObserver(syncHeritageUI).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  $('openSettingsBtn')?.addEventListener('click',()=>setTimeout(syncHeritageUI,0));
  syncHeritageUI();
})();
