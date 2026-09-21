
(function(){
  const $=id=>document.getElementById(id);
  const ar=()=>document.documentElement.lang==='ar';
  function syncMoonExtras(){
    const strip=$('moonPhaseStrip');
    if(!strip || typeof MOON_PHASE_IMAGES==='undefined' || typeof moonPhaseIndex!=='function') return;
    const idx=moonPhaseIndex(new Date());
    strip.innerHTML='';
    MOON_PHASE_IMAGES.forEach((src,i)=>{
      const dot=document.createElement('span');
      dot.className='moon-phase-thumb'+(i===idx?' active':'');
      dot.style.backgroundImage=`url("${src}")`;
      dot.setAttribute('aria-hidden','true');
      strip.appendChild(dot);
    });
    const title=$('moonContextTitle'), copy=$('moonContextCopy');
    if(title) title.textContent=ar()?'نافذة إلى السماء':'A window to the sky';
    if(copy) copy.textContent=ar()
      ?'لعدة قرون، راقب الناس القمر لفهم الزمن والمواسم وإيقاع الحياة اليومية.'
      :'For centuries, observers used the moon to understand time, seasons, and the rhythm of daily life.';
    strip.setAttribute('aria-label',ar()?'مراحل القمر':'Moon phases');
  }
  const moon=$('moonSheet');
  if(moon) new MutationObserver(()=>{if(moon.classList.contains('open')) syncMoonExtras();}).observe(moon,{attributes:true,attributeFilter:['class']});
  new MutationObserver(syncMoonExtras).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  syncMoonExtras();
})();
