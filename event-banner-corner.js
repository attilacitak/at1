(() => {
  function applyCornerStyle(){
    if(document.getElementById('eventBannerCornerFix'))return;
    const s=document.createElement('style');
    s.id='eventBannerCornerFix';
    s.textContent=`
      #extraEventBanner{
        top:14px!important;
        right:14px!important;
        left:auto!important;
        bottom:auto!important;
        transform:translateX(14px)!important;
        max-width:min(320px,calc(100vw - 28px))!important;
        padding:8px 11px!important;
        border-radius:12px!important;
        text-align:left!important;
        font-size:12px!important;
        line-height:1.25!important;
        box-shadow:0 8px 28px rgba(0,0,0,.38)!important;
        opacity:0!important;
        pointer-events:none!important;
      }
      #extraEventBanner.show{
        opacity:.96!important;
        transform:translateX(0)!important;
      }
      @media(max-width:620px){
        #extraEventBanner{
          top:auto!important;
          right:10px!important;
          bottom:10px!important;
          left:auto!important;
          max-width:calc(100vw - 20px)!important;
          font-size:11px!important;
          padding:7px 10px!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  applyCornerStyle();
  setTimeout(applyCornerStyle,200);
  window.__needohEventBannerCornerLoaded=true;
})();
