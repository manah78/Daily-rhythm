
(function(){
  const dial=document.querySelector('.dial-wrap');
  if(!dial)return;

  /* Native Safari long-press selection/context UI is the second "magnifier".
     Suppress it only inside the live dial; normal page scrolling remains pan-y. */
  dial.addEventListener('selectstart',e=>e.preventDefault());
  dial.addEventListener('contextmenu',e=>{
    if(e.pointerType==='touch' || 'ontouchstart' in window) e.preventDefault();
  });

  /* Prevent image dragging/callout behavior from cloned artwork. */
  dial.addEventListener('dragstart',e=>e.preventDefault());

  /* Defensive cleanup: there must never be more than one custom lens node. */
  const lenses=[...document.querySelectorAll('#magnifier')];
  lenses.slice(1).forEach(n=>n.remove());
})();
