
(function syncAdaptiveViewport(){
  const root = document.documentElement;
  const apply = () => {
    const vv = window.visualViewport;
    const w = Math.max(280, Math.round(vv ? vv.width : window.innerWidth));
    const h = Math.max(420, Math.round(vv ? vv.height : window.innerHeight));
    root.style.setProperty('--app-vw', w + 'px');
    root.style.setProperty('--app-vh', h + 'px');
  };
  apply();
  window.addEventListener('resize', apply, {passive:true});
  window.addEventListener('orientationchange', apply, {passive:true});
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', apply, {passive:true});
    window.visualViewport.addEventListener('scroll', apply, {passive:true});
  }
})();
