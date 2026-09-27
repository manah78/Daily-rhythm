(()=>{
  const sheet=document.getElementById('moonSheet');
  if(!sheet)return;
  const $=id=>document.getElementById(id);
  const fmt=t=>{try{return fmtClock12(t)}catch(_){return '—'}};
  const clock=window.MyPrayerClockComponents;

  const phaseNames=['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
  const phaseFiles=phaseNames.map((_,i)=>`assets/my-prayer/moons/phase-${i}.png`);
  const SYNODIC=29.530588853;
  const REF_NEW=Date.UTC(2000,0,6,18,14,0);

  function phaseAgeDays(date){
    const days=(date.getTime()-REF_NEW)/86400000;
    return ((days%SYNODIC)+SYNODIC)%SYNODIC;
  }

  function cycleStart(date){
    const days=(date.getTime()-REF_NEW)/86400000;
    const k=Math.floor(days/SYNODIC);
    return new Date(REF_NEW+k*SYNODIC*86400000);
  }

  function phaseDates(date){
    const start=cycleStart(date).getTime();
    return phaseNames.map((_,i)=>new Date(start+(i/8)*SYNODIC*86400000));
  }

  function nextFullMoon(date){
    const start=cycleStart(date).getTime();
    let full=new Date(start+0.5*SYNODIC*86400000);
    if(full<date) full=new Date(start+1.5*SYNODIC*86400000);
    return full;
  }

  function build(){
    let root=$('prayerReferenceV170');
    if(!root){root=document.createElement('main');root.id='prayerReferenceV170';sheet.append(root)}
    root.innerHTML=`
      <header class="pr173-head">
        <div><h1 class="pr173-title">My Prayer</h1><div class="pr173-location">📍 <span id="pr171Loc">Montreal</span></div></div>
        <button class="pr173-gear" type="button" aria-label="Prayer settings">⚙</button>
      </header>

      <section class="pr173-hero" aria-label="Prayer clock">
        ${clock.labelMarkup('l-dhuhr','','Dhuhr','pr171Dhuhr')}
        ${clock.labelMarkup('l-asr','','Asr','pr171Asr')}
        ${clock.labelMarkup('l-mag','','Maghrib','pr171Mag')}
        ${clock.labelMarkup('l-isha','','Isha','pr171Isha')}
        ${clock.labelMarkup('l-fajr','','Fajr','pr171Fajr')}
        ${clock.labelMarkup('l-sun','','Sunrise','pr171Sun')}
        ${clock.dialMarkup()}
        <div class="pr173-qibla-marker" title="Qibla direction" aria-label="Qibla direction"><img src="assets/my-prayer/qibla.png" alt=""></div>
      </section>

      <section class="pr173-cards" aria-label="Prayer information">
        <article class="pr173-card">
          <div class="pr173-card-label">Qibla Direction</div>
          <div class="pr173-card-value" id="pr171Qibla">—</div>
          <div class="pr173-card-sub">from North</div>
        </article>
        <article class="pr173-card">
          <div class="pr173-card-label">Next Prayer</div>
          <div class="pr173-card-value" id="pr171NextName">—</div>
          <div class="pr173-card-sub" id="pr171NextRemain">—</div>
          <div class="pr173-card-time" id="pr171NextTime">—</div>
        </article>
        <article class="pr173-card">
          <div class="pr173-card-label">Date</div>
          <div class="pr173-card-value pr173-date" id="pr171Date">—</div>
          <div class="pr173-card-sub" id="pr171Hijri">—</div>
        </article>
      </section>

      <section class="pr173-section">
        <h3>Moon Phase</h3>
        <div class="pr173-moon-current">
          <img id="pr173MoonCurrent" class="pr173-moon-current-img" src="${phaseFiles[0]}" alt="">
          <div>
            <div class="pr173-moon-name" id="pr171MoonName">—</div>
            <div class="pr173-moon-meta" id="pr171MoonIllum">—</div>
            <div class="pr173-moon-meta" id="pr173MoonAge">—</div>
            <div class="pr173-moon-meta" id="pr173NextFull">—</div>
          </div>
        </div>
      </section>

      <section class="pr173-section">
        <h3>Moon Phases</h3>
        <div class="pr173-phases" id="pr171Phases"></div>
      </section>`;
  }

  function update(){
    if(!$('prayerReferenceV170')) build();
    const now=new Date();
    const ps=(typeof prayers!=='undefined'?prayers:[]);
    const by=n=>ps.find(p=>p.label===n);
    const set=(id,v)=>{const e=$(id);if(e)e.textContent=v??'—'};

    set('pr171Fajr',fmt(by('Fajr')?.time));
    set('pr171Sun',fmt(by('Sunrise')?.time));
    set('pr171Dhuhr',fmt(by('Zohr')?.time));
    set('pr171Asr',fmt(by('Asr')?.time));
    set('pr171Mag',fmt(by('Maghrib')?.time));
    set('pr171Isha',fmt(by('Isha')?.time));

    try{set('pr171Loc',prayerLocation?.name||'Montreal')}catch(_){set('pr171Loc','Montreal')}

    let q='—';
    try{q=$('qiblaBearingText')?.textContent?.trim()||'—'}catch(_){}
    const qMatch=String(q).match(/-?\d+(?:\.\d+)?/);
    set('pr171Qibla',qMatch?`${qMatch[0]}°`:q);

    clock.updateHands(now);

    let hij='—';
    try{hij=formatHijriDate(now)}catch(_){}
    set('pr171Date',now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}));
    set('pr171Hijri',hij);

    const hf=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
    let np=null;
    try{np=nextPrayer(hf)}catch(_){}
    if(np){
      let dd=np.time-hf;if(dd<0)dd+=24;
      const hh=Math.floor(dd),mm=Math.floor((dd-hh)*60);
      set('pr171NextName',prayerDisplayLabel(np.label));
      set('pr171NextRemain',hh?`in ${hh}h ${mm}m`:`in ${mm}m`);
      set('pr171NextTime',fmt(np.time));
    }

    let idx=0,illum=0;
    try{idx=moonPhaseIndex(now);illum=moonIllumination(now)}catch(_){
      const age=phaseAgeDays(now);idx=Math.round((age/SYNODIC)*8)%8;illum=Math.round((1-Math.cos(2*Math.PI*age/SYNODIC))*50);
    }
    idx=((Number(idx)||0)%8+8)%8;
    set('pr171MoonName',phaseNames[idx]);
    set('pr171MoonIllum',`Illumination ${Math.round(illum)}%`);
    set('pr173MoonAge',`Age ${phaseAgeDays(now).toFixed(1)} days`);
    set('pr173NextFull',`Next Full Moon ${nextFullMoon(now).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`);
    const current=$('pr173MoonCurrent');
    if(current){current.src=phaseFiles[idx];current.alt=phaseNames[idx]}

    const holder=$('pr171Phases');
    if(holder){
      const dates=phaseDates(now);
      holder.innerHTML=phaseNames.map((name,i)=>`<div class="pr173-phase ${i===idx?'active':''}">
        <img src="${phaseFiles[i]}" alt="${name}">
        <div class="pr173-phase-name">${name}</div>
        <div class="pr173-phase-date">${dates[i].toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
      </div>`).join('');
    }

    document.querySelectorAll('.dock-btn').forEach(b=>b.classList.toggle('active',b.id==='openMyPrayerBtn'));
  }

  const obs=new MutationObserver(()=>{if(sheet.classList.contains('open')){build();update()}});
  obs.observe(sheet,{attributes:true,attributeFilter:['class']});
  setInterval(()=>{if(sheet.classList.contains('open'))update()},1000);
})();
