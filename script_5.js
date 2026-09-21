
(function(){
  const KEY='dailyRhythmProfileName_v1';
  const $=id=>document.getElementById(id);
  const ar=()=>document.documentElement.lang==='ar';
  function getName(){ try{return (localStorage.getItem(KEY)||'').trim();}catch(_){return '';} }
  function getDaypart(){
    const h=new Date().getHours();
    if(h<12) return ar()?'صباح الخير':'Good morning';
    if(h<18) return ar()?'مساء الخير':'Good afternoon';
    return ar()?'مساء الخير':'Good evening';
  }
  function render(){
    const small=$('homeGreetingSmall'), name=$('homeGreetingName'), motto=$('homeGreetingMotto'), input=$('settingsProfileName'), label=$('settingsProfileNameLabel');
    if(small) small.textContent=getDaypart();
    if(name) name.textContent=getName();
    if(motto) motto.textContent=ar()?'رحلة صغيرة نحو غدٍ أجمل.':'A small journey to a greater tomorrow.';
    if(label) label.textContent=ar()?'اسمك':'Your name';
    if(input){ input.value=getName(); input.placeholder=ar()?'اختياري':'Optional'; input.dir=ar()?'rtl':'ltr'; }
  }
  function bind(){
    const input=$('settingsProfileName');
    if(input && !input.dataset.bound){
      input.dataset.bound='1';
      input.addEventListener('input',()=>{ try{localStorage.setItem(KEY,input.value.trim());}catch(_){} render(); });
      input.addEventListener('change',render);
    }
  }
  const observer=new MutationObserver(()=>{bind();render();});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  bind(); render();
  setInterval(()=>{ const el=$('homeGreetingSmall'); if(el) el.textContent=getDaypart(); },60000);
})();
