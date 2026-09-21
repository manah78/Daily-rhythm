
(function(){
  const KEY='dailyRhythmProfileName_v1';
  const ASK_KEY='dailyRhythmNamePromptDismissed_v1';
  const $=id=>document.getElementById(id);
  const ar=()=>document.documentElement.lang==='ar';
  const getName=()=>{try{return (localStorage.getItem(KEY)||'').trim();}catch(_){return '';}};
  function copy(){
    const title=$('nameOnboardingTitle'), text=$('nameOnboardingText'), input=$('nameOnboardingInput'), save=$('nameOnboardingSave'), later=$('nameOnboardingLater');
    if(title) title.textContent=ar()?'اجعل نسق يومي أقرب إليك':'Make Daily Rhythm yours';
    if(text) text.textContent=ar()?'ما الاسم الذي تحب أن نناديك به؟':'What should I call you?';
    if(input){input.placeholder=ar()?'اسمك':'Your name';input.dir=ar()?'rtl':'ltr';}
    if(save) save.textContent=ar()?'حفظ':'Save';
    if(later) later.textContent=ar()?'ليس الآن':'Not now';
  }
  function showIfNeeded(){
    const box=$('nameOnboarding'); if(!box) return;
    let dismissed=false; try{dismissed=localStorage.getItem(ASK_KEY)==='1';}catch(_){}
    box.hidden=!!getName() || dismissed;
    copy();
  }
  function saveName(name){
    const v=(name||'').trim(); if(!v) return;
    try{localStorage.setItem(KEY,v);localStorage.removeItem(ASK_KEY);}catch(_){}
    const settings=$('settingsProfileName'); if(settings) settings.value=v;
    const label=$('homeGreetingName'); if(label) label.textContent=v;
    const box=$('nameOnboarding'); if(box) box.hidden=true;
    document.dispatchEvent(new CustomEvent('daily-rhythm-profile-name-changed',{detail:{name:v}}));
  }
  $('nameOnboardingSave')?.addEventListener('click',()=>saveName($('nameOnboardingInput')?.value));
  $('nameOnboardingInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveName(e.currentTarget.value);}});
  $('nameOnboardingLater')?.addEventListener('click',()=>{try{localStorage.setItem(ASK_KEY,'1');}catch(_){} const box=$('nameOnboarding');if(box)box.hidden=true;});
  $('settingsProfileName')?.addEventListener('input',e=>{
    const v=(e.target.value||'').trim();
    try{if(v){localStorage.setItem(KEY,v);localStorage.removeItem(ASK_KEY);}else localStorage.removeItem(KEY);}catch(_){}
    const label=$('homeGreetingName'); if(label) label.textContent=v;
    showIfNeeded();
  });
  new MutationObserver(copy).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  showIfNeeded();
})();
