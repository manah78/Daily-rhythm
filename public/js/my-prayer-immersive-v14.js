(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs={}) {
    const el = document.createElementNS(NS, name);
    for (const [k,v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  function installAtmosphere(){
    const sheet=$('moonSheet');
    if(!sheet || sheet.querySelector('.prayer-mosque-silhouette')) return;
    const skyline=document.createElement('div');
    skyline.className='prayer-mosque-silhouette';
    skyline.setAttribute('aria-hidden','true');
    ['d1','d2','d3'].forEach(c=>{const e=document.createElement('i');e.className=`mosque-dome ${c}`;skyline.appendChild(e);});
    ['m1','m2','m3','m4'].forEach(c=>{const e=document.createElement('i');e.className=`mosque-minaret ${c}`;skyline.appendChild(e);});
    sheet.prepend(skyline);
  }

  function installHands(){
    const svg=$('svg'); if(!svg || svg.querySelector('#mpAnalogHands')) return;
    const cx=420, cy=420;
    const g=svgEl('g',{id:'mpAnalogHands','pointer-events':'none'});
    const hour=svgEl('path',{class:'mp-hour-hand',fill:'#dfb455',stroke:'rgba(255,239,194,.78)','stroke-width':'2','stroke-linejoin':'round'});
    hour.setAttribute('d',`M ${cx} ${cy-8} L ${cx+12} ${cy-30} L ${cx+7} ${cy-176} L ${cx} ${cy-204} L ${cx-7} ${cy-176} L ${cx-12} ${cy-30} Z`);
    const minute=svgEl('path',{class:'mp-minute-hand',fill:'#fff0c6',stroke:'rgba(255,255,255,.72)','stroke-width':'1.6','stroke-linejoin':'round'});
    minute.setAttribute('d',`M ${cx} ${cy-7} L ${cx+8} ${cy-34} L ${cx+4} ${cy-264} L ${cx} ${cy-292} L ${cx-4} ${cy-264} L ${cx-8} ${cy-34} Z`);
    const second=svgEl('line',{class:'mp-second-hand',x1:cx,y1:cy+48,x2:cx,y2:cy-286,stroke:'#e6b851','stroke-width':'2.6','stroke-linecap':'round'});
    const secondTail=svgEl('circle',{class:'mp-second-hand',cx:cx,cy:cy+48,r:'5.5',fill:'#071d2d',stroke:'#e6b851','stroke-width':'2'});
    const hourG=svgEl('g',{id:'mpHourHand'}); hourG.appendChild(hour);
    const minuteG=svgEl('g',{id:'mpMinuteHand'}); minuteG.appendChild(minute);
    const secondG=svgEl('g',{id:'mpSecondHand'}); secondG.appendChild(second); secondG.appendChild(secondTail);
    g.appendChild(hourG);g.appendChild(minuteG);g.appendChild(secondG);
    g.appendChild(svgEl('circle',{cx,cy,r:'17',fill:'#a9762d',stroke:'#fff0c6','stroke-width':'3'}));
    g.appendChild(svgEl('circle',{cx,cy,r:'6',fill:'#fff5d5'}));
    svg.appendChild(g);

    function paint(){
      const d=new Date();
      const ms=d.getMilliseconds(), s=d.getSeconds()+ms/1000, m=d.getMinutes()+s/60, h=(d.getHours()%12)+m/60;
      hourG.setAttribute('transform',`rotate(${h*30} ${cx} ${cy})`);
      minuteG.setAttribute('transform',`rotate(${m*6} ${cx} ${cy})`);
      secondG.setAttribute('transform',`rotate(${s*6} ${cx} ${cy})`);
      requestAnimationFrame(paint);
    }
    requestAnimationFrame(paint);
  }

  function ensureFocus(){
    const clock=document.querySelector('#moonSheet .my-prayer-clock');
    if(!clock || $('myPrayerFocus')) return;
    const wrap=document.createElement('section');
    wrap.id='myPrayerFocus';wrap.className='my-prayer-focus';wrap.setAttribute('aria-live','polite');
    wrap.innerHTML=`<span class="my-prayer-next-kicker" id="mpNextKicker">Next prayer</span><strong class="my-prayer-next-name" id="mpNextName">—</strong><span class="my-prayer-next-count" id="mpNextCount">—</span><span class="my-prayer-next-time" id="mpNextTime">—</span><div class="my-prayer-date-line"><strong id="mpHijri">—</strong><span id="mpGregorian">—</span></div>`;
    clock.insertAdjacentElement('afterend',wrap);
  }

  function remainingText(targetHour){
    if(!Number.isFinite(targetHour)) return '—';
    const now=new Date();
    const cur=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
    let diff=targetHour-cur; if(diff<=0) diff+=24;
    const mins=Math.max(0,Math.round(diff*60));
    const h=Math.floor(mins/60),m=mins%60;
    const ar=document.documentElement.lang==='ar';
    if(h&&m) return ar?`${h}س ${m}د`:`${h}h ${m}m`;
    if(h) return ar?`${h}س`:`${h}h`;
    return ar?`${m}د`:`${m}m`;
  }

  function formatTime(hour){
    if(!Number.isFinite(hour)) return '—';
    const h24=((hour%24)+24)%24, hh=Math.floor(h24), mm=Math.round((h24-hh)*60)%60;
    const ar=document.documentElement.lang==='ar';
    const h12=(hh%12)||12; const period=ar?(hh<12?'صباحًا':'مساءً'):(hh<12?'AM':'PM');
    return `${h12}:${String(mm).padStart(2,'0')} ${period}`;
  }

  function updateFocus(){
    ensureFocus();
    const ar=document.documentElement.lang==='ar';
    const kicker=$('mpNextKicker'); if(kicker) kicker.textContent=ar?'الصلاة القادمة':'Next prayer';

    const rawLabel=$('prayerRemainingLabel')?.textContent?.trim()||'';
    const name=ar ? rawLabel.replace(/^صلاة\s+/u,'').trim() : rawLabel.replace(/\s+prayer$/i,'').trim();
    const n=$('mpNextName'); if(n)n.textContent=name||'—';

    const c=$('mpNextCount'); if(c)c.textContent=$('prayerRemainingValue')?.textContent?.trim()||'—';
    const renderedTime=$('nextPrayerLine')?.querySelector('.prayer-time')?.textContent?.trim()||'';
    const t=$('mpNextTime'); if(t)t.textContent=renderedTime?(ar?`عند ${renderedTime}`:`at ${renderedTime}`):'';

    const h=$('mpHijri'),g=$('mpGregorian');
    if(h)h.textContent=$('hijriLine')?.textContent||'—';
    if(g)g.textContent=$('dateLine')?.textContent||'—';
  }

  function bindDataMirrors(){
    ['nextPrayerLine','prayerRemainingLabel','prayerRemainingValue','hijriLine','dateLine'].forEach(id=>{
      const el=$(id); if(el)new MutationObserver(updateFocus).observe(el,{childList:true,subtree:true,characterData:true});
    });
    new MutationObserver(updateFocus).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
    setInterval(updateFocus,30000);
  }

  function init(){installAtmosphere();installHands();ensureFocus();updateFocus();bindDataMirrors();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0)); else setTimeout(init,0);
})();
