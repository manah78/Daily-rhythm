
(function(){
  const ids={schedule:'openScheduleBtn',stories:'openStoriesBtn',logs:'openLogsBtn',settings:'openSettingsBtn'};
  const sheets={schedule:'scheduleSheet',stories:'storiesSheet',logs:'logsSheet',settings:'settingsSheet'};
  const buttons=Object.fromEntries(Object.entries(ids).map(([k,id])=>[k,document.getElementById(id)]));
  function sync(){
    let active='schedule';
    for(const [key,id] of Object.entries(sheets)) if(document.getElementById(id)?.classList.contains('open')) active=key;
    Object.entries(buttons).forEach(([key,btn])=>{ if(!btn)return; btn.classList.toggle('active',key===active); btn.setAttribute('aria-current',key===active?'page':'false'); });
  }
  Object.values(sheets).forEach(id=>{ const el=document.getElementById(id); if(el) new MutationObserver(sync).observe(el,{attributes:true,attributeFilter:['class']}); });
  document.getElementById('openVoiceBtn')?.addEventListener('click',()=>{Object.values(buttons).forEach(b=>b?.classList.remove('active'));});
  sync();
})();
