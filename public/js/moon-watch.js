(function(){
  const strip=document.getElementById('moonPhaseStrip');
  const sheet=document.getElementById('moonSheet');
  const hint=document.querySelector('#moonSheet .moon-swipe-hint');
  function setHint(){if(!hint)return;hint.textContent=document.documentElement.lang==='ar'?'اسحب لاستعراض أطوار القمر':'Swipe to explore moon phases';}
  function centerActive(){if(!strip)return;const active=strip.querySelector('.moon-phase-thumb.active');if(!active)return;active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
  setHint();
  new MutationObserver(setHint).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  if(sheet)new MutationObserver(()=>{if(sheet.classList.contains('open'))requestAnimationFrame(()=>setTimeout(centerActive,80));}).observe(sheet,{attributes:true,attributeFilter:['class']});
})();
