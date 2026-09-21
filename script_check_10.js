
(function(){
  const $=id=>document.getElementById(id);
  function syncMoonEverywhere(now=new Date()){
    if(typeof moonPhaseIndex!=='function'||typeof MOON_PHASE_IMAGES==='undefined')return;
    const idx=moonPhaseIndex(now),src=MOON_PHASE_IMAGES[idx]; if(!src)return;
    const badge=$('skyMoonBadge');
    if(badge){
      badge.style.setProperty('--moon-current-image',`url("${src}")`);
      let disc=badge.querySelector('.moon-badge-disc');
      if(!disc){badge.innerHTML='';disc=document.createElement('span');disc.className='moon-badge-disc';badge.appendChild(disc)}
      disc.style.backgroundImage=`url("${src}")`;
      let pref='auto';try{pref=localStorage.getItem('dailyRhythmMoonPosition_v1')||'auto'}catch(_){ }
      if(pref==='auto'){
        const phase=typeof moonPhaseFraction==='function'?moonPhaseFraction(now):idx/8;
        const a=(phase*360-90)*Math.PI/180,radius=46;
        const x=50+radius*Math.cos(a),y=50+radius*Math.sin(a);
        badge.style.left=`${Math.max(7,Math.min(93,x))}%`;badge.style.top=`${Math.max(7,Math.min(93,y))}%`;badge.style.right='auto';badge.style.transform='translate(-50%,-50%)';
      }
    }
    const art=$('moonPhaseArt'); if(art){
      art.style.setProperty('--moon-current-image',`url("${src}")`);
      art.style.backgroundImage=`url("${src}")`;
    }
    const strip=$('moonPhaseStrip');if(strip)[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===idx));
  }
  syncMoonEverywhere();setInterval(()=>syncMoonEverywhere(new Date()),60000);
  const moonSheet=$('moonSheet');if(moonSheet)new MutationObserver(()=>{if(moonSheet.classList.contains('open'))syncMoonEverywhere()}).observe(moonSheet,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncMoonEverywhere()});

  const dial=document.querySelector('.dial-wrap'),lens=$('magnifier'),inner=$('magnifierInner'),magToggle=$('magnifierToggle');
  if(dial&&lens&&inner&&magToggle){
    if(lens.parentElement!==dial) dial.appendChild(lens);
    lens.setAttribute('aria-hidden','true');lens.tabIndex=-1;
    let enabled=false,dragging=false,pid=null,clone=null;
    const ZOOM=2.35,EDGE=8;
    const rect=()=>dial.getBoundingClientRect();
    const lensSize=()=>lens.getBoundingClientRect().width||104;
    const point=e=>{const r=rect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
    function stripIds(root){root.removeAttribute?.('id');root.querySelectorAll?.('[id]').forEach(n=>n.removeAttribute('id'))}
    function rebuild(){
      clone=dial.cloneNode(true);
      clone.querySelector('#magnifier')?.remove();
      clone.querySelector('#magnifierToggle')?.remove();
      stripIds(clone);clone.className='';
      Object.assign(clone.style,{position:'absolute',left:'0',top:'0',margin:'0',boxShadow:'none',transformOrigin:'top left',pointerEvents:'none'});
      const r=rect();clone.style.width=r.width+'px';clone.style.height=r.height+'px';inner.replaceChildren(clone);
    }
    function place(target){
      const size=lensSize(),r=rect(),h=size/2,gap=Math.max(24,Math.round(size*.34));
      let cx=target.x-(h+gap);if(cx-h<EDGE)cx=target.x+(h+gap);
      cx=Math.max(h+EDGE,Math.min(r.width-h-EDGE,cx));
      const cy=Math.max(h+EDGE,Math.min(r.height-h-EDGE,target.y));
      lens.style.left=Math.round(cx-h)+'px';lens.style.top=Math.round(cy-h)+'px';
      if(!clone)rebuild();
      clone.style.width=r.width+'px';clone.style.height=r.height+'px';
      clone.style.transform=`translate(${h-target.x*ZOOM}px,${h-target.y*ZOOM}px) scale(${ZOOM})`;
    }
    function setEnabled(on){
      enabled=!!on;dragging=false;pid=null;clone=null;
      magToggle.classList.toggle('active',enabled);magToggle.setAttribute('aria-pressed',String(enabled));
      dial.classList.toggle('magnifier-mode',enabled);
      lens.classList.toggle('press-visible',enabled);
      if(enabled){const r=rect();place({x:r.width*.58,y:r.height*.45});}
      else inner.innerHTML='';
    }
    magToggle.addEventListener('click',e=>{e.stopPropagation();setEnabled(!enabled)});
    dial.addEventListener('pointerdown',e=>{
      if(!enabled||e.target.closest?.('#magnifierToggle,#skyMoonBadge'))return;
      if(e.pointerType==='mouse'&&e.button!==0)return;
      dragging=true;pid=e.pointerId;
      try{dial.setPointerCapture(pid)}catch(_){ }
      e.preventDefault();place(point(e));
    },{passive:false});
    dial.addEventListener('pointermove',e=>{
      if(!enabled||!dragging||e.pointerId!==pid)return;
      e.preventDefault();place(point(e));
    },{passive:false});
    const endDrag=e=>{
      if(!dragging)return;
      if(e?.pointerId!=null&&pid!==e.pointerId)return;
      try{dial.releasePointerCapture(pid)}catch(_){ }
      dragging=false;pid=null;
      /* Keep magnifier visible after release. This avoids iOS pointer-cancel disappearing it. */
    };
    dial.addEventListener('pointerup',endDrag,{passive:true});
    dial.addEventListener('pointercancel',endDrag,{passive:true});
    document.addEventListener('pointerdown',e=>{
      if(!enabled)return;
      if(e.target.closest?.('.dial-wrap'))return;
      setEnabled(false);
    },{capture:true});
    window.addEventListener('resize',()=>{if(enabled){clone=null;const r=rect();place({x:r.width*.58,y:r.height*.45});}},{passive:true});
    window.addEventListener('orientationchange',()=>setEnabled(false),{passive:true});
    setEnabled(false);
  }
})();
