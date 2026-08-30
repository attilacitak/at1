(() => {
  function applyCornerStyle(){
    let s=document.getElementById('eventBannerCornerFix');
    if(!s){
      s=document.createElement('style');
      s.id='eventBannerCornerFix';
      document.head.appendChild(s);
    }
    s.textContent=`
      #extraEventBanner{
        position:fixed!important;
        top:auto!important;
        left:auto!important;
        right:14px!important;
        bottom:14px!important;
        transform:translateY(12px)!important;
        max-width:min(285px,calc(100vw - 28px))!important;
        padding:7px 10px!important;
        border-radius:12px!important;
        text-align:left!important;
        font-size:11px!important;
        line-height:1.2!important;
        box-shadow:0 7px 24px rgba(0,0,0,.34)!important;
        opacity:0!important;
        pointer-events:none!important;
        z-index:95!important;
      }
      #extraEventBanner.show{
        opacity:.94!important;
        transform:translateY(0)!important;
      }
      @media(max-width:620px){
        #extraEventBanner{
          right:8px!important;
          bottom:8px!important;
          max-width:min(250px,calc(100vw - 16px))!important;
          font-size:10px!important;
          padding:6px 9px!important;
        }
      }
    `;
  }

  function loadMegaUpdate(){
    if(window.__needohMegaUpdateLoaded||document.querySelector('script[data-needoh-mega]'))return;
    const s=document.createElement('script');
    s.src='/mega-update.js?v=1';
    s.async=false;
    s.dataset.needohMega='1';
    s.onerror=()=>console.error('Could not load Needoh Mega Update');
    document.body.appendChild(s);
  }

  applyCornerStyle();
  setTimeout(applyCornerStyle,200);
  setTimeout(applyCornerStyle,1000);
  loadMegaUpdate();
  window.__needohEventBannerCornerLoaded=true;
})();
