
(function(){
  function localizeSecondaryUI(){
    const ar=document.documentElement.lang==='ar';
    const moonTitle=document.getElementById('moonGuideTitle');
    const heritage=document.getElementById('moonHeritageHeading');
    const subtitle=document.querySelector('#moonSheet .moon-guide-subtitle');
    const swipe=document.querySelector('#moonSheet .moon-swipe-hint');
    if(moonTitle) moonTitle.textContent=ar?'القمر':'The Moon';
    if(heritage) heritage.textContent=ar?'التراث':'Heritage';
    if(subtitle) subtitle.textContent=ar?'القمر في التراث الإسلامي':'The Moon in Islamic Tradition';
    if(swipe) swipe.textContent=ar?'اسحب للمتابعة':'Swipe to continue';
  }
  localizeSecondaryUI();
  new MutationObserver(localizeSecondaryUI).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
})();
