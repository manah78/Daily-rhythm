
(function(){
  function syncVoiceTitle(){
    const el=document.getElementById('voiceSheetTitle'); if(!el) return;
    el.textContent=document.documentElement.lang==='ar'?'أضف أو حدّث':'Add or update';
  }
  syncVoiceTitle();
  new MutationObserver(syncVoiceTitle).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
