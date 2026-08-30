(() => {
  function applyEventBannerFix(){
    const b=document.getElementById('extraEventBanner');
    if(!b)return;
    b.style.position='fixed';
    b.style.top='14px';
    b.style.right='14px';
    b.style.left='auto';
    b.style.bottom='auto';
    b.style.transform=b.classList.contains('show')?'translateY(0)':'translateY(-8px)';
    b.style.maxWidth='min(360px,calc(100vw - 28px))';
    b.style.padding='9px 12px';
    b.style.borderRadius='14px';
    b.style.fontSize='12px';
    b.style.lineHeight='1.25';
    b.style.textAlign='left';
    b.style.zIndex='96';
    b.style.boxShadow='0 8px 28px rgba(0,0,0,.32)';
    b.style.pointerEvents='none';
  }

  const style=document.createElement('style');
  style.id='eventBannerCornerStyle';
  style.textContent=`
    #extraEventBanner{left:auto!important;right:14px!important;top:14px!important;bottom:auto!important;max-width:min(360px,calc(100vw - 28px))!important;padding:9px 12px!important;border-radius:14px!important;font-size:12px!important;line-height:1.25!important;text-align:left!important;transform:translateY(-8px)!important;box-shadow:0 8px 28px rgba(0,0,0,.32)!important}
    #extraEventBanner.show{transform:translateY(0)!important}
    @media(max-width:620px){#extraEventBanner{top:auto!important;bottom:12px!important;right:10px!important;left:10px!important;max-width:none!important;text-align:center!important}}
  `;
  document.head.appendChild(style);

  applyEventBannerFix();
  setTimeout(applyEventBannerFix,200);
  setInterval(applyEventBannerFix,1000);
  window.__needohEventBannerCornerFix=true;
})();