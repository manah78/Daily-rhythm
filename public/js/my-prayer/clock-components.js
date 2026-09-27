(()=>{
  const ns=window.MyPrayerClockComponents=window.MyPrayerClockComponents||{};

  ns.labelMarkup=(cls,icon,name,id)=>`<div class="pr173-label ${cls}">${icon?`<em>${icon}</em>`:''}<b>${name}</b><small id="${id}">—</small></div>`;

  ns.dialMarkup=()=>{
    const ticks=Array.from({length:60},(_,i)=>`<i class="pr173-tick ${i%5===0?'major':''}" style="--i:${i}"></i>`).join('');
    return `<div class="pr173-dial" id="pr173Dial">
      <div class="pr173-scene" aria-hidden="true"></div>
      <div class="pr173-ticks" aria-hidden="true">${ticks}</div>
      <div class="pr173-rotor pr173-hour" id="pr171Hour"><img src="assets/my-prayer/hour.png" alt=""></div>
      <div class="pr173-rotor pr173-minute" id="pr171Minute"><img src="assets/my-prayer/minute.png" alt=""></div>
      <div class="pr173-rotor pr173-second" id="pr171Second"><img src="assets/my-prayer/second.png" alt=""></div>
      <img class="pr173-frame" src="assets/my-prayer/frame.png" alt="" aria-hidden="true">
    </div>`;
  };

  ns.updateHands=(now)=>{
    const hour=document.getElementById('pr171Hour');
    const minute=document.getElementById('pr171Minute');
    const second=document.getElementById('pr171Second');
    if(!hour||!minute||!second)return;
    const s=now.getSeconds()+now.getMilliseconds()/1000;
    const m=now.getMinutes()+s/60;
    const h=(now.getHours()%12)+m/60;
    hour.style.transform=`rotate(${h*30}deg)`;
    minute.style.transform=`rotate(${m*6}deg)`;
    second.style.transform=`rotate(${s*6}deg)`;
  };
})();
