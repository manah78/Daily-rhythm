
(function(){
  const clean=[(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-new.webp"])||'assets/moon-new.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waxing-crescent.webp"])||'assets/moon-waxing-crescent.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-first-quarter.webp"])||'assets/moon-first-quarter.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waxing-gibbous.webp"])||'assets/moon-waxing-gibbous.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-full.webp"])||'assets/moon-full.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waning-gibbous.webp"])||'assets/moon-waning-gibbous.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-last-quarter.webp"])||'assets/moon-last-quarter.webp',(window.DR_ASSET_DATA&&window.DR_ASSET_DATA["moon-waning-crescent.webp"])||'assets/moon-waning-crescent.webp'];
  function apply(){
    if(typeof MOON_PHASE_IMAGES==='undefined' || !Array.isArray(MOON_PHASE_IMAGES)) return;
    for(let i=0;i<Math.min(clean.length,MOON_PHASE_IMAGES.length);i++) MOON_PHASE_IMAGES[i]=clean[i];
  }
  apply();
})();
