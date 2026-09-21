
(function(){
  function copy(){
    const ar=document.documentElement.lang==='ar';
    const target=document.querySelector('#voiceSheet .command-edit-hint, #scheduleSheet .command-edit-hint');
    if(!target)return;
    target.textContent=ar
      ? 'اسحب النشاط من اليسار إلى اليمين للتعديل، ومن اليمين إلى اليسار بالكامل للحذف.'
      : 'Swipe an activity left-to-right to edit; swipe fully right-to-left to delete.';
  }
  copy();
  new MutationObserver(copy).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
})();
