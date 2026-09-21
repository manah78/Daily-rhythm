
(function(){
  const text = () => document.documentElement.lang === 'ar'
    ? 'ترجمة تلقائية للنشاطات المخصصة'
    : 'Automatic translation for custom activities';

  function addHint(){
    const root = document.getElementById('settingsSheet') || document.querySelector('.settings-sheet');
    if(!root || document.getElementById('aiTranslationHint')) return;
    const hint=document.createElement('div');
    hint.id='aiTranslationHint';
    hint.className='ai-translation-hint';
    hint.textContent=text();
    const body=root.querySelector('.sheet-body') || root;
    body.appendChild(hint);
  }
  addHint();
  new MutationObserver(()=>{
    const h=document.getElementById('aiTranslationHint');
    if(h) h.textContent=text();
  }).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
})();
