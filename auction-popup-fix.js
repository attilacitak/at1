(()=>{
if(window.__needohAuctionPopupFixLoaded)return;
let installed=false;

function install(){
  if(installed||typeof window.openHub!=='function')return false;
  const original=window.openHub;

  window.openHub=function(title,html){
    if(String(title)==='🔨 Auction House'){
      const modal=document.getElementById('hubModal');
      const currentTitle=document.getElementById('hubTitle');
      const content=document.getElementById('hubContent');
      const alreadyOpen=!!(
        modal&&content&&modal.classList.contains('show')&&
        String(currentTitle?.textContent||'')==='🔨 Auction House'
      );

      if(alreadyOpen){
        const active=document.activeElement;
        const editing=!!(
          active&&content.contains(active)&&
          /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)
        );

        // Do not wipe out a bid while the player is typing it.
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
  const title=document.getElementById('hubTitle');
  const content=document.getElementById('hubContent');
  if(!modal?.classList.contains('show')||String(title?.textContent||'')!=='🔨 Auction House'||!content)return;
  if(document.getElementById('auctionManualRefresh'))return;

  const row=document.createElement('div');
  row.id='auctionRefreshRow';
  row.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin-bottom:10px';

  const button=document.createElement('button');
  button.id='auctionManualRefresh';
  button.className='btn';
  button.textContent='↻ Refresh Auctions';
  button.onclick=()=>{
    try{window.__needohAuctions?.show?.()}catch(e){console.warn('Auction refresh failed',e)}
  };

  row.appendChild(button);
  content.prepend(row);
}

install();
new MutationObserver(()=>{
  install();
  addRefreshButton();
}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
setInterval(()=>{
  install();
  addRefreshButton();
},1000);

window.__needohAuctionPopupFixLoaded=true;
})();