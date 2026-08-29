(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const INFINITE_MULTIPLIER=1e100;
  let rushEndsAt=0;
  let rushMultiplier=1;
  let rushEventId='';
  let announcedEventId='';
  let checking=false;

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();
    return t?JSON.parse(t):null;
  }

  function rushActive(){return Date.now()<rushEndsAt&&rushMultiplier>1}
  function isInfiniteMultiplier(n){return Number(n)>=INFINITE_MULTIPLIER}
  function multiplierLabel(n=rushMultiplier){
    if(isInfiniteMultiplier(n))return '∞×';
    if(Number.isInteger(n)&&n<1e15)return `${fmt(n)}×`;
    return `${Number(n).toLocaleString(undefined,{maximumSignificantDigits:6})}×`;
  }
  function parseMultiplier(value){
    const raw=String(value??'').trim().toLowerCase();
    if(raw==='∞'||raw==='infinite'||raw==='infinity'||raw==='inf')return INFINITE_MULTIPLIER;
    const n=Number(raw.replace(/,/g,''));
    if(!Number.isFinite(n)||n<=1)return 0;
    return Math.min(INFINITE_MULTIPLIER,n);
  }

  function installRushUi(){
    if(!document.getElementById('coinRushStyles')){
      const style=document.createElement('style');
      style.id='coinRushStyles';
      style.textContent=`
        body.coin-rush-active{background:radial-gradient(circle at 50% 10%,rgba(255,244,135,.52),transparent 28%),radial-gradient(circle at 15% 35%,rgba(255,193,7,.38),transparent 34%),radial-gradient(circle at 85% 35%,rgba(255,145,0,.32),transparent 34%),linear-gradient(135deg,#5f4100,#a96d00,#4b3100)!important;background-attachment:fixed!important}
        body.coin-rush-active::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:90;background:radial-gradient(circle at center,rgba(255,238,122,.13),rgba(255,179,0,.18));box-shadow:inset 0 0 120px rgba(255,210,45,.32);animation:coinRushGlow .8s ease-in-out infinite alternate}
        body.coin-rush-active .panel,body.coin-rush-active .topbar{border-color:rgba(255,222,89,.62)!important;box-shadow:0 0 34px rgba(255,190,0,.28),0 20px 70px rgba(0,0,0,.28)!important}
        body.coin-rush-active .needoh{filter:drop-shadow(0 0 22px rgba(255,215,0,.72)) saturate(1.15)}
        @keyframes coinRushGlow{from{opacity:.72}to{opacity:1}}
        #coinRushBanner{position:fixed;top:12px;left:50%;transform:translateX(-50%) translateY(-18px) scale(.96);z-index:96;opacity:0;pointer-events:none;min-width:min(520px,calc(100vw - 24px));padding:12px 18px;border-radius:18px;text-align:center;font-weight:1000;letter-spacing:.4px;color:#3e2900;background:linear-gradient(135deg,#fff4a8,#ffd43b,#ff9d00);border:2px solid rgba(255,255,255,.72);box-shadow:0 10px 45px rgba(255,174,0,.52),inset 0 0 18px rgba(255,255,255,.45);transition:.2s ease}
        #coinRushBanner.show{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}
        #coinRushBanner .rush-title{font-size:clamp(18px,3vw,28px)}
        #coinRushBanner .rush-time{font-size:14px;margin-top:2px}
        .coin-rush-card{border:1px solid rgba(255,214,64,.52)!important;background:linear-gradient(135deg,rgba(255,218,72,.13),rgba(255,146,0,.09))!important}
      `;
      document.head.appendChild(style);
    }
    if(!document.getElementById('coinRushBanner')){
      const banner=document.createElement('div');
      banner.id='coinRushBanner';
      banner.innerHTML='<div class="rush-title">🌟 <span id="coinRushMultiplierTitle">2×</span> COIN RUSH 🌟</div><div class="rush-time">ALL COINS <span id="coinRushMultiplierSub">×2</span> · <span id="coinRushTime">1:00</span></div>';
      document.body.appendChild(banner);
    }
  }

  function updateRushVisuals(){
    installRushUi();
    const active=rushActive();
    document.body.classList.toggle('coin-rush-active',active);
    const banner=document.getElementById('coinRushBanner');
    if(banner)banner.classList.toggle('show',active);
    const title=document.getElementById('coinRushMultiplierTitle');
    if(title)title.textContent=multiplierLabel();
    const sub=document.getElementById('coinRushMultiplierSub');
    if(sub)sub.textContent=isInfiniteMultiplier(rushMultiplier)?'×∞':`×${Number(rushMultiplier).toLocaleString(undefined,{maximumSignificantDigits:6})}`;
    const time=document.getElementById('coinRushTime');
    if(time){
      const left=Math.max(0,rushEndsAt-Date.now());
      const s=Math.ceil(left/1000);
      time.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
    }
    const status=document.getElementById('rushAdminStatus');
    if(status){
      const left=Math.max(0,rushEndsAt-Date.now());
      status.textContent=active?`${multiplierLabel()} ACTIVE — ${Math.ceil(left/1000)} seconds left`:'No coin rush active';
    }
  }

  function applyEvent(row){
    const start=Date.parse(row?.starts_at||0),end=Date.parse(row?.ends_at||0);
    const now=Date.now(),mult=Math.max(1,Number(row?.multiplier)||1);
    if(row&&row.event_type==='coin_rush'&&mult>1&&start<=now&&end>now){
      rushEndsAt=end;
      rushMultiplier=Math.min(INFINITE_MULTIPLIER,mult);
      rushEventId=String(row.id||'');
      if(rushEventId&&rushEventId!==announcedEventId){
        announcedEventId=rushEventId;
        toast(`🌟 ${multiplierLabel()} COIN RUSH STARTED!`);
      }
    }else{
      rushEndsAt=0;
      rushMultiplier=1;
      rushEventId='';
    }
    updateRushVisuals();
  }

  async function checkRush(){
    if(checking)return;
    checking=true;
    try{
      const rows=await api('needoh_events?select=id,event_type,multiplier,starts_at,ends_at,created_by,created_at&event_type=eq.coin_rush&order=created_at.desc&limit=1');
      applyEvent(rows?.[0]||null);
    }catch(e){
      console.warn('Coin rush check failed',e);
      if(!rushActive())updateRushVisuals();
    }finally{checking=false}
  }

  const baseAddCoins=addCoins;
  addCoins=function(amount){
    const n=Number(amount)||0;
    if(!rushActive())return baseAddCoins(n);
    let boosted=n*rushMultiplier;
    if(!Number.isFinite(boosted))boosted=Number.MAX_VALUE;
    return baseAddCoins(boosted);
  };

  const baseRender=render;
  render=function(){
    const v=baseRender();
    if(rushActive()){
      const per=$('perSquish');
      if(per){
        const boosted=state.clickPower*state.baseMult*rarity(state.selected).mult*rushMultiplier;
        per.textContent=Number.isFinite(boosted)?fmt(boosted):'∞';
      }
    }
    updateRushVisuals();
    return v;
  };

  const previousShowAdmin=showAdmin;
  showAdmin=async function(){
    await previousShowAdmin();
    if(!isAdmin())return;
    const host=$('hubContent');
    if(!host||document.getElementById('startCoinRushBtn'))return;
    const card=document.createElement('div');
    card.className='card coin-rush-card';
    card.style.marginTop='14px';
    card.innerHTML=`<h3>🌟 Global Custom Coin Rush</h3><p class="small">Choose ANY coin multiplier. Type a number, scientific notation like 1e50, or type <b>infinite</b> / ∞ for the maximum rush.</p><label class="small">Coin multiplier</label><input class="field" id="coinRushMultiplier" type="text" inputmode="decimal" value="2" placeholder="Examples: 2, 1000, 1e50, infinite"><label class="small">Rush length in seconds</label><input class="field" id="coinRushSeconds" type="number" min="10" max="1800" step="10" value="60"><button class="btn gold" id="startCoinRushBtn">🌟 START CUSTOM COIN RUSH</button><div class="small" id="rushAdminStatus" style="margin-top:8px">No coin rush active</div>`;
    host.appendChild(card);
    updateRushVisuals();
    $('startCoinRushBtn').onclick=async()=>{
      const multiplier=parseMultiplier($('coinRushMultiplier').value);
      if(!multiplier)return toast('Enter a multiplier bigger than 1');
      const seconds=Math.max(10,Math.min(1800,Math.floor(Number($('coinRushSeconds').value)||60)));
      const start=new Date();
      const end=new Date(start.getTime()+seconds*1000);
      try{
        const rows=await api('needoh_events',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify([{event_type:'coin_rush',multiplier,starts_at:start.toISOString(),ends_at:end.toISOString(),created_by:'Attila'}])});
        applyEvent(rows?.[0]||{id:`local-${Date.now()}`,event_type:'coin_rush',multiplier,starts_at:start.toISOString(),ends_at:end.toISOString()});
        toast(`🌟 ${multiplierLabel(multiplier)} Coin Rush started for ${seconds} seconds!`);
      }catch(e){
        console.warn('Could not start coin rush',e);
        toast('Could not start coin rush');
      }
    };
  };

  $('adminBtn').onclick=showAdmin;
  installRushUi();
  checkRush();
  setInterval(checkRush,2000);
  setInterval(()=>{
    if(rushEndsAt&&Date.now()>=rushEndsAt){rushEndsAt=0;rushMultiplier=1;rushEventId='';render()}
    else updateRushVisuals();
  },250);
})();