(()=>{
if(window.__needohAuctionPopupFixLoaded)return;
let installed=false;

const managed={
  '🔨 Auction House':{
    buttonId:'auctionManualRefresh',
    rowId:'auctionRefreshRow',
    label:'↻ Refresh Auctions',
    refresh:()=>window.__needohAuctions?.show?.()
  },
  '🏆 Soccer Tournaments':{
    buttonId:'tournamentManualRefresh',
    rowId:'tournamentRefreshRow',
    label:'↻ Refresh Tournaments',
    refresh:()=>window.__needohMinigames?.tournaments?.()
  }
};

function titleText(){return String(document.getElementById('hubTitle')?.textContent||'')}
function isManagedTitle(t=titleText()){return !!managed[t]}

function stopClosedRefreshLoop(){
  const modal=document.getElementById('hubModal');
  const title=document.getElementById('hubTitle');
  if(!modal||!title)return;
  // Auction and Tournament modules both use timers that check only hubTitle.
  // When the modal closes, clear the stale title so those timers cannot reopen it.
  if(!modal.classList.contains('show')&&isManagedTitle(String(title.textContent||''))){
    title.textContent='';
  }
}

function install(){
  if(installed||typeof window.openHub!=='function')return false;
  const original=window.openHub;

  window.openHub=function(title,html){
    const name=String(title);
    if(managed[name]){
      const modal=document.getElementById('hubModal');
      const currentTitle=document.getElementById('hubTitle');
      const content=document.getElementById('hubContent');
      const alreadyOpen=!!(
        modal&&content&&modal.classList.contains('show')&&
        String(currentTitle?.textContent||'')===name
      );

      if(alreadyOpen){
        const active=document.activeElement;
        const editing=!!(
          active&&content.contains(active)&&
          /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)
        );

        // Never erase a bid, form field, or focused control while the player is using it.
        if(editing)return;

        const card=modal.querySelector('.modal-card');
        const scrollTop=card?.scrollTop||0;
        content.innerHTML=String(html??'');
        if(card)requestAnimationFrame(()=>{card.scrollTop=scrollTop});
        return;
      }
    }

    return original.apply(this,arguments);
  };

  installed=true;
  return true;
}

function addRefreshButton(){
  const modal=document.getElementById('hubModal');
  const title=titleText();
  const content=document.getElementById('hubContent');
  const cfg=managed[title];
  if(!cfg||!modal?.classList.contains('show')||!content)return;
  if(document.getElementById(cfg.buttonId))return;

  const row=document.createElement('div');
  row.id=cfg.rowId;
  row.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin-bottom:10px';

  const button=document.createElement('button');
  button.id=cfg.buttonId;
  button.className='btn';
  button.textContent=cfg.label;
  button.onclick=()=>{
    try{cfg.refresh()}catch(e){console.warn(title+' refresh failed',e)}
  };

  row.appendChild(button);
  content.prepend(row);
}

install();

// The normal close handler still runs. This capture listener only clears the
// stale title immediately afterward so the module's own refresh timer stops.
document.addEventListener('click',e=>{
  const close=e.target?.closest?.('#hubClose,.close-x');
  if(!close||!isManagedTitle())return;
  queueMicrotask(stopClosedRefreshLoop);
},true);

new MutationObserver(()=>{
  install();
  stopClosedRefreshLoop();
  addRefreshButton();
}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

setInterval(()=>{
  install();
  stopClosedRefreshLoop();
  addRefreshButton();
},1000);

window.__needohAuctionPopupFixLoaded=true;
})();