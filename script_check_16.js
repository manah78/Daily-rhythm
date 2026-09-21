
(function(){
  const img=document.getElementById('storyHeroImage');
  if(!img)return;
  const fallbackForTitle=()=>{
    const title=(document.getElementById('storyName')?.textContent||'').toLowerCase();
    if(title.includes('biruni')) return 'assets/scholar-biruni-measurement.webp';
    if(title.includes('haytham')) return 'assets/scholar-haytham-optics.webp';
    if(title.includes('khwarizmi')) return 'assets/scholar-khwarizmi-algebra.webp';
    if(title.includes('zahrawi')) return 'assets/scholar-zahrawi-instruments.webp';
    return 'assets/scholar-idrisi-cartography.webp';
  };
  img.addEventListener('error',function(){
    const fallback=fallbackForTitle();
    if(this.getAttribute('src')!==fallback){
      this.src=fallback;
      this.style.visibility='visible';
    }
  });
})();
