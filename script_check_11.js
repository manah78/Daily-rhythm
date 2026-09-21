
(function(){
  const $=id=>document.getElementById(id);
  const ar=()=>document.documentElement.lang==='ar';

  const assetRoot = 'assets/';
  const scholars = {
    biruni:'scholar-biruni-measurement.webp',
    haytham:'scholar-haytham-optics.webp',
    khwarizmi:'scholar-khwarizmi-algebra.webp',
    zahrawi:'scholar-zahrawi-instruments.webp',
    idrisi:'scholar-idrisi-cartography.webp'
  };

  function localizeMoonStatic(){
    const title=$('moonGuideTitle');
    const heritage=$('moonHeritageHeading');
    const sub=document.querySelector('#moonSheet .moon-guide-subtitle');
    const hint=document.querySelector('#moonSheet .moon-swipe-hint');
    if(title) title.textContent=ar()?'القمر: دليل عبر الزمن':'The Moon: A Timeless Guide';
    if(heritage) heritage.textContent=ar()?'التراث':'Heritage';
    if(sub) sub.textContent=ar()?'القمر في التراث الإسلامي':'The Moon in Islamic Tradition';
    if(hint) hint.textContent=ar()?'اسحب للمتابعة':'Swipe to continue';
  }

  // Fix all contribution-image URLs and avoid Safari's broken-image badge.
  function repairScholarImages(){
    try{
      if(typeof stories!=='undefined' && Array.isArray(stories)){
        stories.forEach(s=>{
          if(s && scholars[s.id]) s.image=(window.DR_ASSET_DATA&&window.DR_ASSET_DATA[scholars[s.id]])||assetRoot+scholars[s.id];
        });
      }
    }catch(_){}
    const moonImg=document.querySelector('#moonSheet .moon-scholar-avatar');
    if(moonImg){
      moonImg.src=(window.DR_ASSET_DATA&&window.DR_ASSET_DATA[scholars.haytham])||assetRoot+scholars.haytham;
      moonImg.onerror=()=>{ moonImg.style.visibility='hidden'; };
      moonImg.onload=()=>{ moonImg.style.visibility='visible'; };
    }
    document.querySelectorAll('#storiesSheet img').forEach(img=>{
      img.addEventListener('error',()=>{img.style.visibility='hidden';},{once:true});
      img.addEventListener('load',()=>{img.style.visibility='visible';},{once:true});
    });
  }

  // Always use the clean transparent moon assets in phase order.
  const cleanMoon=[(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-new.webp"])||'assets/moon-new.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waxing-crescent.webp"])||'assets/moon-waxing-crescent.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-first-quarter.webp"])||'assets/moon-first-quarter.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waxing-gibbous.webp"])||'assets/moon-waxing-gibbous.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-full.webp"])||'assets/moon-full.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waning-gibbous.webp"])||'assets/moon-waning-gibbous.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-last-quarter.webp"])||'assets/moon-last-quarter.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waning-crescent.webp"])||'assets/moon-waning-crescent.webp'];
  function repairMoonAssets(){
    try{
      if(typeof MOON_PHASE_IMAGES!=='undefined' && Array.isArray(MOON_PHASE_IMAGES)){
        cleanMoon.forEach((src,i)=>MOON_PHASE_IMAGES[i]=src);
      }
      if(typeof moonPhaseIndex!=='function') return;
      const idx=moonPhaseIndex(new Date());
      const src=cleanMoon[idx];
      const art=$('moonPhaseArt');
      if(art){
        art.style.backgroundImage=`url("${src}")`;
        art.style.setProperty('--moon-current-image',`url("${src}")`);
      }
      const badge=$('skyMoonBadge');
      if(badge){
        let disc=badge.querySelector('.moon-badge-disc');
        if(!disc){badge.innerHTML='';disc=document.createElement('span');disc.className='moon-badge-disc';badge.appendChild(disc);}
        disc.style.backgroundImage=`url("${src}")`;
      }
      const strip=$('moonPhaseStrip');
      if(strip){
        strip.innerHTML='';
        cleanMoon.forEach((phaseSrc,i)=>{
          const dot=document.createElement('span');
          dot.className='moon-phase-thumb'+(i===idx?' active':'');
          dot.style.backgroundImage=`url("${phaseSrc}")`;
          dot.setAttribute('aria-hidden','true');
          strip.appendChild(dot);
        });
      }
    }catch(_){}
  }

  function refresh(){
    localizeMoonStatic();
    repairScholarImages();
    repairMoonAssets();
  }
  refresh();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  const moon=$('moonSheet');
  if(moon)new MutationObserver(()=>{if(moon.classList.contains('open'))refresh();}).observe(moon,{attributes:true,attributeFilter:['class']});
})();
