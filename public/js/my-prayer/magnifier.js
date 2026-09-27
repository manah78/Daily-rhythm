(()=>{
  window.MyPrayerMagnifier={
    attach(){
      const $=id=>document.getElementById(id);
      const dial=$('pr171Dial'), hero=$('pr171Hero'), button=$('pr171Magnifier'), lens=$('pr171Lens'), copy=$('pr171LensCopy');
      if(!dial||!hero||!button||!lens||!copy)return;
      const show=e=>{
        const r=dial.getBoundingClientRect(), hr=hero.getBoundingClientRect();
        const x=e.clientX-r.left, y=e.clientY-r.top;
        copy.innerHTML=dial.innerHTML;
        copy.style.width=r.width+'px'; copy.style.height=r.height+'px';
        copy.style.transform=`translate(${59-x*1.65}px,${59-y*1.65}px) scale(1.65)`;
        lens.style.left=(r.left-hr.left+x-59)+'px';
        lens.style.top=(r.top-hr.top+y-59)+'px';
        lens.classList.add('show');
      };
      const hide=()=>lens.classList.remove('show');
      button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);show(e)};
      button.onpointermove=e=>{if(lens.classList.contains('show'))show(e)};
      button.onpointerup=hide; button.onpointercancel=hide;
      dial.onpointerdown=e=>{if(e.pointerType==='touch'||e.pointerType==='pen')show(e)};
      dial.onpointermove=e=>{if(lens.classList.contains('show'))show(e)};
      dial.onpointerup=hide; dial.onpointercancel=hide;
    }
  };
})();
