(()=>{
  if(window.__needohInteractionRescueLoaded)return;

  const CONTROL_SELECTOR='button,input,select,textarea,a[href],.needoh,.upgrade,.buy,.chip,[role="button"]';
  const ACTIVE_OVERLAY_SELECTOR='.modal.show,.mw-overlay,.ff-wheel-overlay,.forge-overlay,.pvp-invite-card,.sx-modal';

  function visible(el){
    if(!el||!el.getBoundingClientRect)return false;
    const s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>.02&&r.width>2&&r.height>2;
  }

  function isInteractiveAncestor(top,control){
    return top===control||control.contains(top)||top?.closest?.(CONTROL_SELECTOR)===control;
  }

  function findBlocker(top,control){
    const vw=Math.max(1,innerWidth),vh=Math.max(1,innerHeight),viewArea=vw*vh;
    let el=top;
    while(el&&el!==document.body&&el!==document.documentElement){
      if(el.contains(control)){el=el.parentElement;continue;}
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      const area=Math.max(0,r.width)*Math.max(0,r.height);
      const positioned=s.position==='fixed'||s.position==='absolute'||s.position==='sticky';
      if(positioned&&s.pointerEvents!=='none'&&area>viewArea*.22&&r.left<vw&&r.top<vh&&r.right>0&&r.bottom>0){
        return el;
      }
      el=el.parentElement;
    }
    return null;
  }

  function rescue(){
    try{
      document.documentElement.style.pointerEvents='auto';
      document.body.style.pointerEvents='auto';
      const app=document.querySelector('.app');if(app)app.style.pointerEvents='auto';

      // Never interfere while a real visible modal/minigame overlay is intentionally open.
      const active=[...document.querySelectorAll(ACTIVE_OVERLAY_SELECTOR)].some(visible);
      if(active)return;

      const controls=[...document.querySelectorAll(CONTROL_SELECTOR)].filter(visible).slice(0,80);
      let fixed=0;
      for(const c of controls){
        const r=c.getBoundingClientRect();
        const x=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2));
        const y=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2));
        const top=document.elementFromPoint(x,y);
        if(!top||isInteractiveAncestor(top,c))continue;
        const blocker=findBlocker(top,c);
        if(blocker&&!blocker.dataset.needohIntentionalOverlay){
          blocker.style.setProperty('pointer-events','none','important');
          blocker.dataset.needohInteractionRescued='1';
          fixed++;
        }
      }

      // Common stale transparent layers: if they cover almost the whole viewport but are effectively invisible,
      // they must never be allowed to swallow the game.
      for(const el of document.body.querySelectorAll('*')){
        if(!visible(el)||el.matches(ACTIVE_OVERLAY_SELECTOR))continue;
        const s=getComputedStyle(el),r=el.getBoundingClientRect();
        if((s.position==='fixed'||s.position==='absolute')&&r.width>=innerWidth*.94&&r.height>=innerHeight*.94&&s.pointerEvents!=='none'){
          const transparent=(s.backgroundImage==='none'&&(s.backgroundColor==='rgba(0, 0, 0, 0)'||s.backgroundColor==='transparent'));
          if(transparent&&Number(s.opacity||1)<.06){
            el.style.setProperty('pointer-events','none','important');
            el.dataset.needohInteractionRescued='1';
          }
        }
      }

      if(fixed)console.warn('Needoh interaction rescue removed',fixed,'click blocker(s)');
    }catch(e){console.warn('Needoh interaction rescue failed',e)}
  }

  // Make actual controls explicitly interactive without changing disabled buttons.
  const style=document.createElement('style');
  style.id='needohInteractionRescueStyles';
  style.textContent='html,body,.app{pointer-events:auto!important}button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),.needoh,.upgrade,.buy:not(:disabled),.chip{pointer-events:auto!important}';
  document.head.appendChild(style);

  rescue();
  setTimeout(rescue,100);
  setTimeout(rescue,500);
  setTimeout(rescue,1200);
  setInterval(rescue,2500);
  window.addEventListener('focus',rescue);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')rescue()});
  window.__needohInteractionRescue={run:rescue};
  window.__needohInteractionRescueLoaded=true;
})();