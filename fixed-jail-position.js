(() => {
  if (window.__needohFixedJailPositionV1) return;
  window.__needohFixedJailPositionV1 = true;

  const style = document.createElement('style');
  style.id = 'needohFixedJailPositionStyles';
  style.textContent = `
    #hfJailButton{
      left:auto!important;
      top:auto!important;
      right:22px!important;
      bottom:22px!important;
      transition:transform .15s ease!important;
    }
    @media(max-width:620px){
      #hfJailButton{right:12px!important;bottom:12px!important;}
    }
  `;
  document.head.appendChild(style);

  function updateCopy(){
    const card=document.getElementById('hfAdminJailCard');
    if(card){
      const p=card.querySelector('p.small');
      if(p)p.textContent='The jail button appears in the bottom-right every minute, stays there for 10 seconds, and jails whoever clicks it for 1 minute.';
    }
    const btn=document.getElementById('hfJailButton');
    if(btn){
      btn.title='This button stays here for 10 seconds';
    }
  }

  const observer=new MutationObserver(updateCopy);
  observer.observe(document.body,{childList:true,subtree:true});
  updateCopy();
})();
