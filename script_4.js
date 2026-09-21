
(function(){
  const $=id=>document.getElementById(id);
  const ar=()=>document.documentElement.lang==='ar';
  const visualMap={
    biruni:{
      titleEn:'Measuring the Earth', titleAr:'قياس الأرض',
      captionEn:'A globe, mountain and angle lines reflect al-Biruni’s work on careful measurement and astronomy.',
      captionAr:'يرمز المجسم الجغرافي والجبل وخطوط القياس إلى عمل البيروني في القياس الدقيق وعلم الفلك.',
      src:'assets/scholar-biruni-measurement.webp'
    },
    haytham:{
      titleEn:'Light and Observation', titleAr:'الضوء والملاحظة',
      captionEn:'Lens shapes and light rays point to Ibn al-Haytham’s work in optics and experimental observation.',
      captionAr:'تشير العدسة وأشعة الضوء إلى أعمال ابن الهيثم في البصريات والملاحظة التجريبية.',
      src:'assets/scholar-haytham-optics.webp'
    },
    khwarizmi:{
      titleEn:'Algebra and Algorithms', titleAr:'الجبر والخوارزميات',
      captionEn:'A manuscript page and geometric marks connect al-Khwarizmi to algebra and step-by-step problem solving.',
      captionAr:'ترمز صفحة المخطوط والعلامات الهندسية إلى الجبر والحل المتدرج للمسائل عند الخوارزمي.',
      src:'assets/scholar-khwarizmi-algebra.webp'
    },
    zahrawi:{
      titleEn:'Surgery and Instruments', titleAr:'الجراحة والأدوات',
      captionEn:'Surgical tools represent al-Zahrawi’s influential work in medicine and the design of instruments.',
      captionAr:'ترمز الأدوات الجراحية إلى أعمال الزهراوي المؤثرة في الطب وتصميم الأدوات.',
      src:'assets/scholar-zahrawi-instruments.webp'
    },
    idrisi:{
      titleEn:'Maps and Cartography', titleAr:'الخرائط ورسمها',
      captionEn:'A map grid and compass suggest al-Idrisi’s work describing the world and building maps from travel knowledge.',
      captionAr:'تشير شبكة الخريطة والبوصلة إلى عمل الإدريسي في وصف العالم وبناء الخرائط من خبرات الرحلات.',
      src:'assets/scholar-idrisi-cartography.webp'
    }
  };
  function relatedFor(id){ return visualMap[id] || visualMap.biruni; }
  function applyVisual(){
    const nameEl=$('storyName'); if(!nameEl) return;
    const currentName=(nameEl.textContent||'').trim();
    const nameToId={
      'Al-Biruni':'biruni','البيروني':'biruni',
      'Ibn al-Haytham':'haytham','ابن الهيثم':'haytham',
      'Al-Khwarizmi':'khwarizmi','الخوارزمي':'khwarizmi',
      'Al-Zahrawi':'zahrawi','الزهراوي':'zahrawi',
      'Al-Idrisi':'idrisi','الإدريسي':'idrisi'
    };
    const visual=relatedFor(nameToId[currentName]);
    const wrap=$('storyRelatedVisual'), img=$('storyRelatedImage'), kicker=$('storyRelatedKicker'), title=$('storyRelatedTitle'), cap=$('storyRelatedCaption');
    if(!wrap||!img||!kicker||!title||!cap) return;
    const relatedSrc=visual.src;
    img.src=relatedSrc;
    img.alt=(ar()?visual.titleAr:visual.titleEn);
    const heroImg=$('storyHeroImage'), heroMono=$('storyHeroMonogram');
    if(heroImg && heroMono && heroImg.hidden){
      heroImg.src=relatedSrc;
      heroImg.alt=(ar()?visual.titleAr:visual.titleEn);
      heroImg.hidden=false;
      heroMono.hidden=true;
      heroImg.dataset.relatedHero='1';
    }
    kicker.textContent=ar()?'صورة مرتبطة':'Related visual';
    title.textContent=ar()?visual.titleAr:visual.titleEn;
    cap.textContent=ar()?visual.captionAr:visual.captionEn;
    wrap.hidden=false;
  }
  function go(delta){
    const card=$('heritageStoryCard'); if(!card) return;
    const page=Number(card.dataset.storyPage||0);
    if(delta>0){
      if(page<2) $('storyNext')?.click(); else $('storyNext')?.click();
    }else{
      if(page>0) $('storyPrev')?.click(); else $('storyPrev')?.click();
    }
  }
  function attachSwipe(){ /* Native heritage story pointer-swipe handler is the single source of truth. */ }
  function hookButtons(){
    const prev=$('storyPrev'), next=$('storyNext');
    if(prev && !prev.dataset.visualHook){ prev.dataset.visualHook='1'; prev.addEventListener('click',()=>setTimeout(applyVisual,0)); }
    if(next && !next.dataset.visualHook){ next.dataset.visualHook='1'; next.addEventListener('click',()=>setTimeout(applyVisual,0)); }
    const dots=$('storyDots');
    if(dots && !dots.dataset.visualHook){ dots.dataset.visualHook='1'; dots.addEventListener('click',()=>setTimeout(applyVisual,0)); }
    const strip=$('scholarStrip');
    if(strip && !strip.dataset.visualHook){ strip.dataset.visualHook='1'; strip.addEventListener('click',()=>setTimeout(applyVisual,0)); }
  }
  const mo=new MutationObserver(()=>{ applyVisual(); attachSwipe(); hookButtons(); });
  const card=$('heritageStoryCard'); if(card) mo.observe(card,{attributes:true, attributeFilter:['data-story-page']});
  const nameEl=$('storyName'); if(nameEl) mo.observe(nameEl,{childList:true, characterData:true, subtree:true});
  const sheet=$('storiesSheet'); if(sheet) mo.observe(sheet,{attributes:true, attributeFilter:['class']});
  attachSwipe(); hookButtons(); setTimeout(applyVisual,0);
})();
