(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const pkey=(name=playerName())=>cleanPlayerName(name).toLowerCase();
  const ownerAuthorized=()=>!!window.__needohIsOwnerAdmin?.();
  const EVENT_NAMES={luck_rush:'🍀 Luck Rush',boss_damage:'⚔️ Boss Damage',box_frenzy:'🎁 Box Frenzy',secret_rush:'✨ Secret Squishy Rush'};
  let boxBusy=false,checkingAttila=false;

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();return t?JSON.parse(t):null;
  }

  function ensureStyles(){
    if(document.getElementById('needohFinalFixStyles'))return;
    const s=document.createElement('style');
    s.id='needohFinalFixStyles';
    s.textContent=`
      .ff-wheel-overlay{position:fixed;inset:0;z-index:25000;background:rgba(5,7,18,.94);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(10px)}
      .ff-wheel-card{width:min(700px,100%);text-align:center;background:linear-gradient(145deg,#171d36,#32184c);border:1px solid rgba(255,255,255,.18);border-radius:26px;padding:20px;box-shadow:0 30px 100px rgba(0,0,0,.65)}
      .ff-wheel-stage{position:relative;width:min(410px,82vw);height:min(410px,82vw);margin:12px auto 16px;display:grid;place-items:center}
      .ff-wheel-pointer{position:absolute;z-index:5;top:-4px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:22px solid transparent;border-right:22px solid transparent;border-top:48px solid #fff;filter:drop-shadow(0 5px 8px rgba(0,0,0,.55))}
      .ff-wheel{position:relative;width:92%;height:92%;border-radius:50%;border:9px solid white;background:conic-gradient(#ff5c7a 0 36deg,#7a66ff 36deg 72deg,#22d3aa 72deg 108deg,#ffb23f 108deg 144deg,#4fc3ff 144deg 180deg,#d85bff 180deg 216deg,#ff6fae 216deg 252deg,#65e38b 252deg 288deg,#ff8f45 288deg 324deg,#5c7cff 324deg 360deg);box-shadow:0 0 0 6px #ffcf54,0 0 45px rgba(255,207,84,.45);transition:transform 3.1s cubic-bezier(.08,.7,.12,1)}
      .ff-wheel:after{content:'🎁';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:82px;height:82px;border-radius:50%;display:grid;place-items:center;background:#171d36;border:5px solid #fff;font-size:38px}
      .ff-wheel-label{position:absolute;left:50%;top:50%;width:90px;margin-left:-45px;margin-top:-14px;text-align:center;font-size:11px;font-weight:1000;text-shadow:0 2px 5px #000;pointer-events:none}
      .ff-wheel-label span{display:block;font-size:20px}.ff-wheel-result{display:none;margin-top:10px;padding:12px;border-radius:16px;background:rgba(255,255,255,.09)}.ff-wheel-result.show{display:block}.ff-wheel-result b{display:block;font-size:clamp(26px,5vw,48px);color:#ffd95e}.ff-collect{display:none;margin:12px auto 0}.ff-collect.show{display:inline-block}
      .ff-admin-card{border:1px solid rgba(255,217,94,.32)!important;background:linear-gradient(135deg,rgba(255,217,94,.08),rgba(143,92,255,.08))!important}
    `;
    document.head.appendChild(s);
  }

  // ---------- GLOBAL EVENTS ----------
  async function startGlobalEvent(){
    if(!ownerAuthorized())return toast('Only Attila can start global events');
    const type=$('ffEventType')?.value||$('adminEventType')?.value;
    if(!EVENT_NAMES[type])return toast('Choose a valid event');
    const mult=Math.max(2,Math.min(1e100,Number($('ffEventMult')?.value||$('adminEventMult')?.value)||5));
    const minutes=Math.max(1,Math.min(30,Math.floor(Number($('ffEventMinutes')?.value||$('adminEventMinutes')?.value)||5)));
    const status=$('ffEventStatus')||$('adminEventStatus');
    if(status)status.textContent='Starting event…';
    const start=new Date(),end=new Date(start.getTime()+minutes*60000);
    try{
      await api('needoh_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{event_type:type,multiplier:mult,starts_at:start.toISOString(),ends_at:end.toISOString(),created_by:'Attila'}])});
      if(status)status.textContent=`✅ ${EVENT_NAMES[type]} ${mult.toLocaleString()}× live for ${minutes} minute${minutes===1?'':'s'}.`;
      toast(`🔥 ${EVENT_NAMES[type]} started!`);
      window.__needohEvents?.start?.(type,mult,minutes).catch(()=>{});
    }catch(e){
      console.warn('Global event start failed',e);
      if(status)status.textContent=`❌ ${String(e.message||e).slice(0,160)}`;
      toast('Could not start global event');
    }
  }

  function ensureEventCard(){
    if(!ownerAuthorized())return;
    const host=$('hubContent');if(!host)return;
    const old=$('adminStartEvent');if(old)old.onclick=startGlobalEvent;
    if(document.getElementById('ffGlobalEventCard'))return;
    const card=document.createElement('div');card.id='ffGlobalEventCard';card.className='card ff-admin-card';card.style.marginTop='12px';
    card.innerHTML=`<h3>🔥 Global Events — FIXED</h3><div class="grid2"><select class="field" id="ffEventType"><option value="luck_rush">🍀 Luck Rush</option><option value="boss_damage">⚔️ Boss Damage</option><option value="box_frenzy">🎁 Box Frenzy</option><option value="secret_rush">✨ Secret Squishy Rush</option></select><input class="field" id="ffEventMult" type="number" min="2" value="5" placeholder="Multiplier"></div><input class="field" id="ffEventMinutes" type="number" min="1" max="30" value="5"><button class="btn gold" id="ffStartEvent">🔥 START GLOBAL EVENT</button><div class="small" id="ffEventStatus" style="margin-top:8px">Choose event, multiplier, and duration.</div>`;
    host.prepend(card);$('ffStartEvent').onclick=startGlobalEvent;
  }

  // ---------- ATTILA GIFT / TAKE BACK ----------
  async function latestGift(key){
    const rows=await api(`needoh_grants?select=id,target_key,target_name,admin_name,created_at&target_key=eq.${encodeURIComponent(key)}&reward_type=eq.squishy&item=eq.ATTILA&order=created_at.desc&limit=50`);
    return (rows||[]).find(r=>String(r.admin_name||'').toLowerCase()==='attila')||null;
  }
  async function latestRevoke(key){
    const rows=await api(`needoh_attila_revokes?select=id,target_key,target_name,created_at&target_key=eq.${encodeURIComponent(key)}&order=created_at.desc&limit=1`);
    return rows?.[0]||null;
  }
  const giftActive=(g,r)=>!!g&&(!r||Date.parse(g.created_at)>Date.parse(r.created_at));

  async function checkMyAttila(){
    if(checkingAttila||playerName()==='Player'||ownerAuthorized())return;
    checkingAttila=true;
    try{
      const [g,r]=await Promise.all([latestGift(pkey()),latestRevoke(pkey())]);
      if(!giftActive(g,r)&&state.owned.includes('ATTILA')){
        state.owned=state.owned.filter(x=>x!=='ATTILA');
        if(state.selected==='ATTILA')state.selected=state.owned[0]||'Common';
        save(true);render();toast(r?'👑 Attila took back the ATTILA Squishy':'👑 ATTILA is owner-gift only');
      }
    }catch(e){console.warn('ATTILA revoke check failed',e)}finally{checkingAttila=false}
  }

  async function giftedPlayers(){
    const [gifts,revokes]=await Promise.all([
      api('needoh_grants?select=target_key,target_name,admin_name,created_at&reward_type=eq.squishy&item=eq.ATTILA&order=created_at.desc&limit=500'),
      api('needoh_attila_revokes?select=target_key,target_name,created_at&order=created_at.desc&limit=500')
    ]);
    const gs=new Map(),rs=new Map();
    for(const g of gifts||[]){if(String(g.admin_name||'').toLowerCase()==='attila'&&!gs.has(g.target_key))gs.set(g.target_key,g)}
    for(const r of revokes||[]){if(!rs.has(r.target_key))rs.set(r.target_key,r)}
    return [...gs.values()].filter(g=>giftActive(g,rs.get(g.target_key)));
  }

  async function renderRevokeCard(){
    if(!ownerAuthorized())return;
    const host=$('hubContent');if(!host)return;
    let card=$('ffAttilaRevokeCard');
    if(!card){card=document.createElement('div');card.id='ffAttilaRevokeCard';card.className='card ff-admin-card';card.style.marginTop='12px';host.appendChild(card)}
    card.innerHTML='<h3>↩️ Take Back ATTILA Squishy</h3><div class="small">Loading players you gifted ATTILA to…</div>';
    try{
      const active=await giftedPlayers();
      if(!active.length){card.innerHTML='<h3>↩️ Take Back ATTILA Squishy</h3><div class="small">Nobody currently has an active ATTILA gift.</div>';return}
      const opts=active.map(g=>`<option value="${escapeHtml(g.target_key)}">${escapeHtml(g.target_name||g.target_key)}</option>`).join('');
      card.innerHTML=`<h3>↩️ Take Back ATTILA Squishy</h3><p class="small">This removes the exclusive squishy from that player within a few seconds. You can gift it back later.</p><select class="field" id="ffRevokeAttilaPlayer">${opts}</select><button class="btn danger" id="ffRevokeAttilaBtn">↩️ TAKE BACK ATTILA</button>`;
      $('ffRevokeAttilaBtn').onclick=async()=>{
        const key=$('ffRevokeAttilaPlayer').value,g=active.find(x=>x.target_key===key);if(!key)return;
        if(!confirm(`Take ATTILA Squishy away from ${g?.target_name||key}?`))return;
        try{await api('needoh_attila_revokes',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{target_key:key,target_name:g?.target_name||key,revoked_by:'Attila'}])});toast(`↩️ ATTILA taken back from ${g?.target_name||key}`);renderRevokeCard()}catch(e){console.warn(e);toast('Could not take back ATTILA')}
      };
    }catch(e){card.innerHTML=`<h3>↩️ Take Back ATTILA Squishy</h3><div class="small">Could not load gifted players.</div>`}
  }

  // ---------- MYSTERY BOXES ----------
  const BOX={
    bronze:{name:'Bronze Box',icon:'📦',price:1e4,coinMin:5e3,coinMax:5e4,squishyChance:.18,jackpot:.015},
    crystal:{name:'Crystal Box',icon:'💎',price:1e6,coinMin:5e5,coinMax:5e6,squishyChance:.38,jackpot:.035},
    cosmic:{name:'Cosmic Box',icon:'🌌',price:1e9,coinMin:5e8,coinMax:5e9,squishyChance:.65,jackpot:.06},
    admin:{name:'Admin Box',icon:'🛡️',price:1e18,coinMin:5e17,coinMax:5e19,squishyChance:.78,jackpot:.12}
  };
  const ev=()=>window.__needohEvents||{active:()=>false,mult:()=>1};
  const luck=()=>Math.max(1,Number(ev().mult?.('luck_rush'))||1);
  const frenzy=()=>Math.max(1,Number(ev().mult?.('box_frenzy'))||1);
  const boxPrice=b=>Math.floor(b.price/(ev().active?.('box_frenzy')?2:1));

  function chooseReward(b){
    if(Math.random()<Math.min(.35,b.jackpot*luck()))return{type:'coins',icon:'💰',text:'JACKPOT',amount:Math.floor(b.coinMax*(10+Math.random()*30)*frenzy())};
    const limited=(window.__needohLimitedRarities||[]).filter(r=>r&&r.name!=='ATTILA'&&!r.ownerOnly);
    if(limited.length&&Math.random()<Math.min(.18,.01*luck())){const r=limited[Math.floor(Math.random()*limited.length)];return{type:'squishy',icon:r.icon,text:r.name,rarity:r,limited:true}}
    if(Math.random()<Math.min(.95,b.squishyChance*luck())){const pool=(availableBoxPool?.()||[]).filter(r=>r&&r.name!=='ATTILA'&&!r.ownerOnly);if(pool.length){const r=pool[Math.floor(Math.random()*pool.length)];return{type:'squishy',icon:r.icon,text:r.name,rarity:r}}}
    const roll=Math.random();if(roll<.08)return{type:'boost',icon:'⚡',text:'2× BASE POWER',mult:2};if(roll<.15)return{type:'autoclick',icon:'🤖',text:'30s AUTO-CLICK',seconds:30};
    const amount=Math.floor((b.coinMin+Math.random()*(b.coinMax-b.coinMin))*frenzy());return{type:'coins',icon:'🪙',text:`${fmt(amount)} COINS`,amount};
  }

  function wheel(b,reward){
    ensureStyles();const o=document.createElement('div');o.className='ff-wheel-overlay';const winner=Math.floor(Math.random()*10);const decoys=['🪙 Coins','🎁 Squishy','💰 Jackpot','⚡ Power','🤖 Auto','🌈 Limited','🪙 Coins','🎁 Squishy','💎 Bonus','🪙 Coins'];
    const labels=decoys.map((x,i)=>{const raw=i===winner?`${reward.icon} ${reward.text}`:x,parts=raw.split(' '),icon=parts.shift(),txt=parts.join(' '),a=i*36+18;return `<div class="ff-wheel-label" style="transform:rotate(${a}deg) translateY(-138px) rotate(${-a}deg)"><span>${escapeHtml(icon)}</span>${escapeHtml(txt)}</div>`}).join('');
    o.innerHTML=`<div class="ff-wheel-card"><h2>${b.icon} ${escapeHtml(b.name)}</h2><div class="small" id="ffWheelStatus">SPINNING...</div><div class="ff-wheel-stage"><div class="ff-wheel-pointer"></div><div class="ff-wheel" id="ffWheel">${labels}</div></div><div class="ff-wheel-result" id="ffWheelResult"><b>🎉 YOU WON!</b><div id="ffWheelPrize" style="font-size:24px;font-weight:900"></div></div><button class="btn gold ff-collect" id="ffWheelCollect">COLLECT</button></div>`;document.body.appendChild(o);return{o,winner};
  }

  function startAutoClick(seconds){state.autoClickUntil=Date.now()+seconds*1000;save(true)}
  setInterval(()=>{if(Number(state.autoClickUntil)>Date.now()){const r=rarity(state.selected);addCoins(Math.max(1,state.clickPower*state.baseMult*r.mult));render()}},500);

  function fixedOpenBox(id){
    if(boxBusy)return;const b=BOX[id],cost=b?boxPrice(b):0;if(!b)return toast('Unknown box');if(state.coins<cost)return toast('Not enough coins!');
    boxBusy=true;try{
      const reward=chooseReward(b);state.coins-=cost;state.boxesOpened++;save(true);render();closeHub();const {o,winner}=wheel(b,reward),w=o.querySelector('#ffWheel'),center=winner*36+18;requestAnimationFrame(()=>requestAnimationFrame(()=>w.style.transform=`rotate(${7*360+(360-center)}deg)`));
      setTimeout(()=>{
        if(reward.type==='coins')addCoins(reward.amount);else if(reward.type==='squishy'){if(!state.owned.includes(reward.rarity.name))state.owned.push(reward.rarity.name);state.selected=reward.rarity.name}else if(reward.type==='boost')state.baseMult*=reward.mult;else if(reward.type==='autoclick')startAutoClick(reward.seconds);
        checkAchievements();save(true);render();o.querySelector('#ffWheelStatus').textContent=reward.type==='coins'&&reward.icon==='💰'?'💰 JACKPOT!':'THE WHEEL HAS CHOSEN!';o.querySelector('#ffWheelPrize').textContent=`${reward.icon} ${reward.text}${reward.limited?' · LIMITED!':''}`;o.querySelector('#ffWheelResult').classList.add('show');const c=o.querySelector('#ffWheelCollect');c.classList.add('show');c.onclick=()=>{o.remove();boxBusy=false;fixedShowBoxes()};
      },3200);
    }catch(e){boxBusy=false;console.error('Mystery box failed',e);toast('Mystery Box error — try again')}
  }

  function fixedShowBoxes(){
    ensureStyles();const html=`<div class="notice">🎰 Working prize wheel · jackpots · squishies · power boosts · auto-click${ev().active?.('box_frenzy')?' · 🔥 BOX FRENZY ACTIVE':''}</div><div class="box-grid">${Object.entries(BOX).map(([id,b])=>`<div class="box-card"><div class="box-icon">${b.icon}</div><h3>${b.name}</h3><p class="small">Squishy chance up to ${Math.min(95,Math.round(b.squishyChance*luck()*100))}%</p><div class="reward">🪙 ${fmt(boxPrice(b))}</div><button class="btn gold" data-ff-box="${id}" ${state.coins<boxPrice(b)?'disabled':''}>SPIN PRIZE WHEEL</button></div>`).join('')}</div><p class="small" style="margin-top:12px">Boxes opened: ${fmt(state.boxesOpened)}</p>`;openHub('🎁 Mystery Boxes',html);document.querySelectorAll('[data-ff-box]').forEach(b=>b.onclick=()=>fixedOpenBox(b.dataset.ffBox));
  }

  const previousShowAdmin=showAdmin;
  showAdmin=async function(){const r=await previousShowAdmin();if(ownerAuthorized()){ensureEventCard();await renderRevokeCard()}return r};

  showBoxes=fixedShowBoxes;openBox=fixedOpenBox;
  if($('boxesBtn'))$('boxesBtn').onclick=fixedShowBoxes;
  if($('adminBtn'))$('adminBtn').onclick=showAdmin;
  ensureStyles();checkMyAttila();setInterval(checkMyAttila,2000);
  window.__needohFinalFixesLoaded=true;
})();