(()=>{
if(window.__needohAuctionPopupFixLoaded)return;
let installed=false,allowAuctionRefresh=false;
function install(){
 if(installed||typeof window.openHub!=='function')return false;
 const original=window.openHub;
 window.openHub=function(title,html){
   if(String(title)==='🔨 Auction House'){
     const modal=document.getElementById('hubModal');
     const current=document.getElementById('hubTitle');
     const alreadyOpen=!!(modal&&modal.classList.contains('show')&&String(current?.textContent||'')==='🔨 Auction House');
     if(alreadyOpen&&!allowAuctionRefresh)return;
     allowAuctionRefresh=false;
   }
   return original.apply(this,arguments);
 };
 installed=true;
 return true;
}
function addRefreshButton(){
 const modal=document.getElementById('hubModal'),title=document.getElementById('hubTitle'),content=document.getElementById('hubContent');
 if(!modal?.classList.contains('show')||String(title?.textContent||'')!=='🔨 Auction House'||!content)return;
 if(document.getElementById('auctionManualRefresh'))return;
 const row=document.createElement('div');
 row.id='auctionRefreshRow';
 row.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin-bottom:10px';
 const b=document.createElement('button');
 b.id='auctionManualRefresh';b.className='btn';b.textContent='↻ Refresh Auctions';
 b.onclick=()=>{allowAuctionRefresh=true;try{window.__needohAuctions?.show?.()}catch(_){allowAuctionRefresh=false}};
 row.appendChild(b);content.prepend(row);
}
install();
new MutationObserver(()=>{install();addRefreshButton()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
setInterval(()=>{install();addRefreshButton()},1000);
window.__needohAuctionPopupFixLoaded=true;
})();