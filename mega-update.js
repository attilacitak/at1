(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const HEADERS={apikey:SB_KEY,'Content-Type':'application/json'};
  const W6_UNLOCK=1e30;
  const PRESTIGE_BASE=1e34;
  const EVOLUTION_NAMES=['Base','Plus','Charged','Golden','Rainbow'];
  const EVOLUTION_MULT=[1,1.5,3,8,20];
  const EVOLUTION_COST=[0,3,5,8,12];

  const W6=[
    {name:'Glitched',icon:'👾',color:'linear-gradient(135deg,#31ff9a,#10131d,#9b5cff)',glow:'#31ff9a',shape:'35% 65% 57% 43% / 63% 35% 65% 37%',mult:7e10,chance:48,min:1e30,max:2e30,sound:440},
    {name:'Corrupted',icon:'☣️',color:'linear-gradient(135deg,#ff365d,#130b19,#8c2cff)',glow:'#ff365d',shape:'68% 32% 41% 59% / 31% 67% 33% 69%',mult:3e11,chance:26,min:4e30,max:8e30,sound:130},
    {name:'Hacker',icon:'💻',color:'linear-gradient(135deg,#00ff8c,#052d22,#041711)',glow:'#00ff8c',shape:'24% 76% 31% 69% / 71% 26% 74% 29%',mult:1.5e12,chance:14,min:1.5e31,max:3e31,sound:510},
    {name:'Matrix',icon:'🟩',color:'linear-gradient(135deg,#b3ff4f,#0a180a,#00a84f)',glow:'#8dff58',shape:'56% 44% 67% 33% / 42% 61% 39% 58%',mult:8e12,chance:8,min:6e31,max:1.2e32,sound:610},
    {name:'Singularity',icon:'🕳️',color:'radial-gradient(circle at 42% 38%,#ffffff 0 3%,#b76cff 6%,#15102a 35%,#020207 70%)',glow:'#c06dff',shape:'50%',mult:5e13,chance:4,min:2.5e32,max:5e32,sound:55}
  ];
  const RIFT_TITAN={name:'Rift Titan',icon:'🗿',color:'linear-gradient(135deg,#7c5cff,#17142b,#26e9d4)',glow:'#8d7cff',shape:'37% 63% 55% 45% / 66% 35% 65% 34%',mult:7.5e14,chance:0,min:0,max:0,sound:72,limited:true,bossOnly:true,ownerOnly:true};

  const pkey=()=>cleanPlayerName(playerName()).toLowerCase();

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...HEADERS,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();
    return t?JSON.parse(t):null;
  }

  function dayKey(){
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function weekKey(){
    const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function mega(){
    const base={
      prestige:{count:0,points:0,spent:{click:0,coins:0,luck:0,boss:0,box:0}},
      copies:{},evolution:{},discovered:[],
      boosts:{coin2:0,luck5:0,boss3:0,auto:0},
      activeBoosts:{coin2:0,luck5:0,boss3:0,auto:0},
      eggInventory:{basic:0,cosmic:0,glitch:0},
      eggQueue:[],eggsHatched:0,totalGlobalDamage:0,
      questClaims:{},
      day:{key:'',base:{}},week:{key:'',base:{}},
      shinyDust:0
    };
    state.mega=state.mega&&typeof state.mega==='object'?state.mega:{};
    const m=state.mega;
    m.prestige={...base.prestige,...(m.prestige||{})};
    m.prestige.spent={...base.prestige.spent,...(m.prestige.spent||{})};
    m.copies={...(m.copies||{})};
    m.evolution={...(m.evolution||{})};
    m.discovered=Array.isArray(m.discovered)?m.discovered:[];
    m.boosts={...base.boosts,...(m.boosts||{})};
    m.activeBoosts={...base.activeBoosts,...(m.activeBoosts||{})};
    m.eggInventory={...base.eggInventory,...(m.eggInventory||{})};
    m.eggQueue=Array.isArray(m.eggQueue)?m.eggQueue:[];
    m.eggsHatched=Number(m.eggsHatched)||0;
    m.totalGlobalDamage=Number(m.totalGlobalDamage)||0;
    m.questClaims={...(m.questClaims||{})};
    m.day={...base.day,...(m.day||{})};m.day.base={...(m.day.base||{})};
    m.week={...base.week,...(m.week||{})};m.week.base={...(m.week.base||{})};
    m.shinyDust=Number(m.shinyDust)||0;
    return m;
  }

  function ensureCycles(){
    const m=mega(),snapshot=()=>({squishes:Number(state.squishes)||0,boxes:Number(state.boxesOpened)||0,bosses:Number(state.bossesDefeated)||0,eggs:m.eggsHatched,global:m.totalGlobalDamage});
    const d=dayKey(),w=weekKey();
    if(m.day.key!==d){m.day={key:d,base:snapshot()}}
    if(m.week.key!==w){m.week={key:w,base:snapshot()}}
  }

  function ensureStyles(){
    if(document.getElementById('megaUpdateStyles'))return;
    const s=document.createElement('style');
    s.id='megaUpdateStyles';
    s.textContent=`
      .mega-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .mega-card{background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(93,72,255,.08));border:1px solid rgba(255,255,255,.11);border-radius:18px;padding:14px}
      .mega-card h3{margin:0 0 5px}.mega-card p{font-size:12px;color:#c8c7d7}
      .mega-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.mega-kpi{text-align:center;background:rgba(0,0,0,.2);padding:10px;border-radius:14px}.mega-kpi b{display:block;font-size:20px}
      .index-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.index-mon{min-height:118px;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:11px}.index-mon.unknown{filter:saturate(.2);opacity:.58}.index-icon{font-size:30px}
      .evo-row,.boost-row,.egg-row,.trade-row{background:rgba(255,255,255,.065);border:1px solid rgba(255,255,255,.09);border-radius:15px;padding:11px;margin:8px 0}
      .mega-shiny-selected{animation:megaShinyPulse 1.25s ease-in-out infinite alternate!important;filter:saturate(1.45) brightness(1.12)}
      @keyframes megaShinyPulse{from{box-shadow:0 0 38px #fff,0 0 70px #7cf7d4}to{box-shadow:0 0 60px #ffd95e,0 0 105px #d56cff}}
      .global-boss-art{font-size:72px;filter:drop-shadow(0 0 24px #8d7cff)}
      .boss-hp{height:18px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden}.boss-hp>div{height:100%;background:linear-gradient(90deg,#7cf7d4,#7a66ff,#ff4770)}
      .trade-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}
      .mega-pill{display:inline-block;padding:3px 8px;border-radius:99px;background:rgba(124,247,212,.12);border:1px solid rgba(124,247,212,.25);font-size:11px;font-weight:900}
      @media(max-width:720px){.mega-grid,.index-grid,.mega-kpis{grid-template-columns:1fr}.trade-row{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  const baseFmt=fmt;
  fmt=function(n){
    n=Number(n)||0;
    if(!Number.isFinite(n))return '∞';
    const a=Math.abs(n);
    if(a<1000)return Math.floor(n).toLocaleString();
    const u=[['Dc',1e33],['No',1e30],['Oc',1e27],['Sp',1e24],['Sx',1e21],['Qi',1e18],['Qa',1e15],['T',1e12],['B',1e9],['M',1e6],['K',1e3]];
    for(const [s,v] of u)if(a>=v){const x=n/v;return x.toFixed(Math.abs(x)>=100?0:Math.abs(x)>=10?1:2)+s}
    return baseFmt(n);
  };

  const beforeAllRarities=allRarities;
  function baseForShiny(r){return r&&!r.shiny&&!r.limited&&!r.ownerOnly&&!r.bossOnly&&r.name!=='ATTILA'}
  function shinyOf(r){return{name:`Shiny ${r.name}`,icon:'✨',color:`linear-gradient(135deg,#fff7b2,${typeof r.color==='string'&&r.color.startsWith('#')?r.color:'#8cf7ff'},#ff9cf2)`,glow:'#ffffff',shape:r.shape,mult:Number(r.mult)*5,chance:0,min:0,max:0,sound:(Number(r.sound)||400)*1.08,shiny:true,baseName:r.name}}
  allRarities=function(){
    const base=[...beforeAllRarities()];
    if(!base.some(r=>r.name==='Glitched'))base.push(...W6);
    if(!base.some(r=>r.name==='Rift Titan'))base.push(RIFT_TITAN);
    const shinies=base.filter(baseForShiny).map(shinyOf);
    return [...base,...shinies];
  };

  const beforeRarity=rarity;
  rarity=function(name){
    let r=beforeRarity(name);
    const m=mega();
    if(r&&!r.shiny&&!r.limited&&!r.ownerOnly&&!r.bossOnly){
      const tier=Math.max(0,Math.min(4,Number(m.evolution[r.name])||0));
      if(tier)r={...r,mult:Number(r.mult)*EVOLUTION_MULT[tier],evolutionTier:tier};
    }
    return r;
  };

  const beforeWorldList=worldList;
  worldList=function(w=state.world){return Number(w)===6?W6:beforeWorldList(w)};
  const beforeUnlocked=isWorldUnlocked;
  isWorldUnlocked=function(w){return Number(w)===6?!!state.world6Unlocked:beforeUnlocked(w)};
  state.world6Unlocked=!!state.world6Unlocked;
  WORLD_META[5].next=6;WORLD_META[5].threshold=W6_UNLOCK;WORLD_META[5].nextText='🧪 World 6';WORLD_META[5].info='Reach 1 nonillion coins to breach the Glitched Dimension.';
  WORLD_META[6]={name:'🧪 World 6 — Glitched Dimension',next:1,nextText:'🌎 World 1',threshold:0,info:'Glitched Dimension: hunt 👾 Glitched through 🕳️ Singularity squishies.'};

  const beforeSwitchWorld=switchWorld;
  switchWorld=function(){
    if(Number(state.world)===5){
      if(!state.world6Unlocked){
        if(state.coins<W6_UNLOCK)return toast(`Reach ${fmt(W6_UNLOCK)} coins first!`);
        state.world6Unlocked=true;toast('🧪 World 6 unlocked!');
      }
      state.world=6;restock(true);if(typeof resetBossForWorld==='function')resetBossForWorld();render();save(true);return;
    }
    if(Number(state.world)===6){
      state.world=1;restock(true);if(typeof resetBossForWorld==='function')resetBossForWorld();render();save(true);return;
    }
    return beforeSwitchWorld();
  };
  $('worldBtn').onclick=switchWorld;

  if(typeof bossStatsForWorld==='function'){
    const beforeBossStats=bossStatsForWorld;
    bossStatsForWorld=function(w){return Number(w)===6?{name:'Rift Architect',icon:'🧬',hp:1e29,reward:2e29}:beforeBossStats(w)};
  }
  if(typeof availableBoxPool==='function'){
    const beforePool=availableBoxPool;
    availableBoxPool=function(){
      const p=[...beforePool()];
      if(state.world6Unlocked)for(const r of W6)if(!p.some(x=>x.name===r.name))p.push(r);
      return p;
    };
  }

  const activeUntil=k=>Number(mega().activeBoosts[k])||0;
  const active=k=>activeUntil(k)>Date.now();
  const prestigeLevel=k=>Number(mega().prestige.spent[k])||0;
  const prestigeClick=()=>1+.5*prestigeLevel('click');
  const prestigeCoins=()=>1+.25*prestigeLevel('coins');
  const prestigeLuck=()=>1+.35*prestigeLevel('luck');
  const prestigeBoss=()=>1+.75*prestigeLevel('boss');
  const prestigeBox=()=>1+.2*prestigeLevel('box');
  const coinBoost=()=>active('coin2')?2:1;
  const luckBoost=()=>active('luck5')?5:1;
  const bossBoost=()=>active('boss3')?3:1;
  const currentLuck=()=>prestigeLuck()*luckBoost();
  const currentPerSquish=()=>Math.max(1,(Number(state.clickPower)||1)*(Number(state.baseMult)||1)*(Number(rarity(state.selected).mult)||1)*prestigeClick());

  const beforeAddCoins=addCoins;
  addCoins=function(amount){return beforeAddCoins((Number(amount)||0)*prestigeCoins()*coinBoost())};

  const beforeSquish=squish;
  squish=function(ev){
    ensureCycles();
    const old=state.baseMult;
    state.baseMult=old*prestigeClick();
    try{return beforeSquish(ev)}
    finally{state.baseMult=old}
  };

  function prestigeThreshold(){
    const c=Math.max(0,Number(mega().prestige.count)||0);
    return PRESTIGE_BASE*Math.pow(1000,Math.min(c,90));
  }
  function prestigeGain(){
    const t=prestigeThreshold();
    if(state.coins<t)return 0;
    return Math.max(1,Math.floor(Math.log10(Math.max(1,state.coins/t))+1));
  }
  function doPrestige(){
    const m=mega(),gain=prestigeGain(),threshold=prestigeThreshold();
    if(gain<1)return toast(`Need ${fmt(threshold)} coins to Prestige`);
    if(!confirm(`Prestige now for ${gain} permanent point${gain===1?'':'s'}? Coins, upgrades and world unlocks reset. Your collection stays.`))return;
    m.prestige.points+=gain;m.prestige.count++;
    state.coins=0;state.clickPower=1;state.baseMult=1;state.clickLevel=0;state.multLevel=0;
    state.world=1;state.world2Unlocked=false;state.world3Unlocked=false;state.world4Unlocked=false;state.world5Unlocked=false;state.world6Unlocked=false;
    state.selected=state.owned.includes('Common')?'Common':state.owned[0]||'Common';
    state.pity={Mythic:8,Legendary:12,Secret:20};
    state.stock=[];state.restockAt=Date.now()+60000;
    if(typeof resetBossForWorld==='function')resetBossForWorld();
    restock(true);ensureCycles();save(true);render();toast(`♻️ Prestige +${gain} point${gain===1?'':'s'}!`);showPrestige();
  }
  function buyPrestige(k){
    const m=mega(),lvl=prestigeLevel(k),cost=lvl+1;
    if(m.prestige.points<cost)return toast('Not enough Prestige Points');
    m.prestige.points-=cost;m.prestige.spent[k]=lvl+1;save(true);render();showPrestige();
  }
  function showPrestige(){
    const m=mega(),gain=prestigeGain(),t=prestigeThreshold();
    const defs=[
      ['click','🫧 Click Power','+50% squish power / level',`×${prestigeClick().toFixed(2)}`],
      ['coins','🪙 Coin Power','+25% all positive coin gains / level',`×${prestigeCoins().toFixed(2)}`],
      ['luck','🍀 Luck','Improves Shiny and Egg luck',`×${prestigeLuck().toFixed(2)}`],
      ['boss','👹 Boss Damage','+75% Global Boss damage / level',`×${prestigeBoss().toFixed(2)}`],
      ['box','🎁 Box Luck','Improves Shiny bonus rolls from boxes',`×${prestigeBox().toFixed(2)}`]
    ];
    const shop=defs.map(([k,n,d,e])=>{const lvl=prestigeLevel(k),cost=lvl+1;return `<div class="evo-row"><div class="card-row"><div><b>${n} · Lv ${lvl}</b><div class="small">${d}</div></div><span class="mega-pill">${e}</span></div><button class="btn gold" data-prestige-buy="${k}" ${m.prestige.points<cost?'disabled':''}>Spend ${cost} PP</button></div>`}).join('');
    openHub('♻️ Prestige / Rebirth',`<div class="notice">Prestige resets coins, upgrades and world unlocks, but keeps your collection, Shiny squishies, evolutions, boosts and Prestige upgrades.</div><div class="mega-kpis"><div class="mega-kpi"><span class="small">Prestiges</span><b>${m.prestige.count}</b></div><div class="mega-kpi"><span class="small">Available PP</span><b>${m.prestige.points}</b></div><div class="mega-kpi"><span class="small">Next Requirement</span><b>${fmt(t)}</b></div><div class="mega-kpi"><span class="small">Gain Now</span><b>+${gain}</b></div></div><button class="btn admin" id="megaPrestigeNow" ${gain<1?'disabled':''}>♻️ PRESTIGE NOW (+${gain} PP)</button><h3>Permanent Prestige Shop</h3>${shop}`);
    $('megaPrestigeNow').onclick=doPrestige;
    document.querySelectorAll('[data-prestige-buy]').forEach(b=>b.onclick=()=>buyPrestige(b.dataset.prestigeBuy));
  }

  function baseName(name){return String(name||'').replace(/^Shiny /,'')}
  function canEvolveName(name){
    const r=allRarities().find(x=>x.name===name);
    return !!(r&&baseForShiny(r));
  }
  function recordCopy(name,n=1){
    name=baseName(name);
    if(!canEvolveName(name))return;
    const m=mega();m.copies[name]=(Number(m.copies[name])||0)+Math.max(1,n);save(true);
  }
  window.__needohRecordDuplicate=recordCopy;

  const beforeBuyItem=buyItem;
  buyItem=function(index){
    const item=state.stock?.[index],name=item?.name,already=!!name&&state.owned.includes(name),can=!!item&&state.coins>=item.price;
    const v=beforeBuyItem(index);
    if(can&&already){recordCopy(name);toast(`🧬 Duplicate ${name}: +1 Evolution Copy`)}
    return v;
  };

  function evolve(name){
    const m=mega(),tier=Math.max(0,Math.min(4,Number(m.evolution[name])||0));
    if(tier>=4)return toast('Already Rainbow Evolution');
    const cost=EVOLUTION_COST[tier+1],copies=Number(m.copies[name])||0;
    if(copies<cost)return toast(`Need ${cost} duplicate copies`);
    m.copies[name]=copies-cost;m.evolution[name]=tier+1;save(true);render();toast(`🧬 ${name} evolved to ${EVOLUTION_NAMES[tier+1]}!`);showEvolution();
  }
  function showEvolution(){
    const m=mega();
    const names=[...new Set(state.owned.map(baseName))].filter(canEvolveName).sort();
    const html=names.map(name=>{const tier=Math.max(0,Math.min(4,Number(m.evolution[name])||0)),copies=Number(m.copies[name])||0,cost=tier<4?EVOLUTION_COST[tier+1]:0,r=rarity(name);return `<div class="evo-row"><div class="card-row"><div><b>${r.icon} ${escapeHtml(name)} · ${EVOLUTION_NAMES[tier]}</b><div class="small">Current multiplier ×${fmt(r.mult)} · Duplicate copies: ${copies}</div></div><span class="mega-pill">${EVOLUTION_MULT[tier]}× EVO</span></div><button class="btn gold" data-evolve="${escapeHtml(name)}" ${tier>=4||copies<cost?'disabled':''}>${tier>=4?'MAX EVOLUTION':`Evolve → ${EVOLUTION_NAMES[tier+1]} (${cost} copies)`}</button></div>`}).join('');
    openHub('🧬 Squishy Evolution',`<div class="notice">Buying or hatching a squishy you already own gives an Evolution Copy. Evolution permanently boosts that squishy's multiplier.</div>${html||'<div class="card">Own more normal squishies to evolve them.</div>'}`);
    document.querySelectorAll('[data-evolve]').forEach(b=>b.onclick=()=>evolve(b.dataset.evolve));
  }

  function shinyChance(source='box'){
    const base=source==='egg'?0.005:0.002;
    return Math.min(.05,base*currentLuck()*(source==='box'?prestigeBox():1));
  }
  function awardSquishy(name,source='reward'){
    const m=mega();
    if(!name)return;
    if(state.owned.includes(name)){
      if(name.startsWith('Shiny ')){m.shinyDust++;toast(`✨ Duplicate ${name}: +1 Shiny Dust`)}
      else{recordCopy(name);toast(`🧬 Duplicate ${name}: +1 Evolution Copy`)}
    }else{
      state.owned.push(name);state.selected=name;
      toast(`${name.startsWith('Shiny ')?'✨ SHINY!':'🫧'} ${name} unlocked!`);
    }
    if(!m.discovered.includes(name))m.discovered.push(name);
    save(true);render();
  }
  function randomShiny(pool){
    pool=(pool||availableBoxPool()).filter(baseForShiny);
    if(!pool.length)return null;
    const r=pool[Math.floor(Math.random()*pool.length)];
    return `Shiny ${r.name}`;
  }

  const beforeOpenBox=openBox;
  openBox=function(id){
    ensureCycles();
    const before=Number(state.boxesOpened)||0,ownedBefore=new Set(state.owned);
    const v=beforeOpenBox(id);
    if((Number(state.boxesOpened)||0)>before){
      if(Math.random()<shinyChance('box')){
        const s=randomShiny();
        if(s)setTimeout(()=>awardSquishy(s,'box'),3400);
      }
      setTimeout(()=>{
        const txt=String($('ffWheelPrize')?.textContent||$('mwResultText')?.textContent||'');
        if(!txt)return;
        const won=allRarities().filter(baseForShiny).sort((a,b)=>b.name.length-a.name.length).find(r=>txt.includes(r.name));
        if(won&&ownedBefore.has(won.name)){recordCopy(won.name);toast(`🧬 Box duplicate ${won.name}: +1 Evolution Copy`)}
      },3500);
    }
    return v;
  };

  function sourceOf(r){
    if(r.bossOnly)return 'Global Boss';
    if(r.ownerOnly&&r.name==='ATTILA')return 'Owner Exclusive';
    if(r.shiny)return 'Rare Shiny drop — Boxes / Eggs';
    if(r.limited)return 'Limited / Event / Season';
    if(W6.some(x=>x.name===r.name))return 'World 6';
    const groups=[[W1,1],[W2,2],[W3,3],[W4,4],[window.__needohWorld5Rarities||[],5]];
    for(const [a,w] of groups)if(a.some(x=>x.name===r.name))return `World ${w}`;
    return 'Special';
  }
  function updateDiscovered(){
    const m=mega();
    for(const n of state.owned||[])if(!m.discovered.includes(n))m.discovered.push(n);
  }
  function showIndex(){
    updateDiscovered();
    const m=mega(),owner=!!window.__needohIsOwnerAdmin?.();
    const list=allRarities().filter((r,i,a)=>a.findIndex(x=>x.name===r.name)===i);
    const cards=list.map(r=>{
      const known=m.discovered.includes(r.name)||state.owned.includes(r.name)||(r.name==='ATTILA'&&owner);
      const display=r.name==='ATTILA'&&!known?'??? Owner Exclusive':known?r.name:'???';
      const rr=known?rarity(r.name):r;
      return `<div class="index-mon ${known?'':'unknown'}"><div class="index-icon">${known?r.icon:'❓'}</div><b>${escapeHtml(display)}</b><div class="small">${known?`×${fmt(rr.mult)} · ${escapeHtml(sourceOf(r))}`:'Undiscovered'}</div><div class="small">${state.owned.includes(r.name)?'✅ OWNED':known?'👁️ DISCOVERED':'🔒 LOCKED'}</div></div>`;
    }).join('');
    const owned=list.filter(r=>state.owned.includes(r.name)).length;
    openHub('📖 Squishy Index',`<div class="notice">Collection: ${owned}/${list.length}. Shiny versions are 5× stronger and normally drop at about 1/500 from boxes before Luck bonuses.</div><div class="index-grid">${cards}</div>`);
  }

  const DAILY_Q=[
    {id:'squish',name:'Daily Squisher',desc:'Squish 500 times today',metric:'squishes',target:500,reward:{coins:1e7}},
    {id:'boxes',name:'Box Run',desc:'Open 3 boxes today',metric:'boxes',target:3,reward:{boost:'luck5'}},
    {id:'eggs',name:'Hatch Day',desc:'Hatch 1 egg today',metric:'eggs',target:1,reward:{egg:'basic'}}
  ];
  const WEEKLY_Q=[
    {id:'squish',name:'Weekly Grinder',desc:'Squish 10,000 times this week',metric:'squishes',target:10000,reward:{prestige:1}},
    {id:'boxes',name:'Box Collector',desc:'Open 20 boxes this week',metric:'boxes',target:20,reward:{egg:'cosmic'}},
    {id:'eggs',name:'Master Hatcher',desc:'Hatch 5 eggs this week',metric:'eggs',target:5,reward:{boost:'coin2'}}
  ];
  function questProgress(scope,q){
    ensureCycles();const m=mega(),b=m[scope].base;
    const now={squishes:Number(state.squishes)||0,boxes:Number(state.boxesOpened)||0,bosses:Number(state.bossesDefeated)||0,eggs:m.eggsHatched,global:m.totalGlobalDamage};
    return Math.max(0,(now[q.metric]||0)-(Number(b[q.metric])||0));
  }
  function rewardText(r){if(r.coins)return `🪙 ${fmt(r.coins)}`;if(r.boost)return `🎒 ${r.boost}`;if(r.egg)return `🥚 ${r.egg} egg`;if(r.prestige)return `♻️ ${r.prestige} PP`;return 'Reward'}
  function giveQuestReward(r){
    const m=mega();
    if(r.coins)addCoins(r.coins);
    if(r.boost)m.boosts[r.boost]=(Number(m.boosts[r.boost])||0)+1;
    if(r.egg)m.eggInventory[r.egg]=(Number(m.eggInventory[r.egg])||0)+1;
    if(r.prestige)m.prestige.points+=(Number(r.prestige)||0);
  }
  function claimMegaQuest(scope,id){
    ensureCycles();const list=scope==='day'?DAILY_Q:WEEKLY_Q,q=list.find(x=>x.id===id);if(!q)return;
    const key=`${scope}:${mega()[scope].key}:${id}`;if(mega().questClaims[key])return;
    if(questProgress(scope,q)<q.target)return;
    mega().questClaims[key]=true;giveQuestReward(q.reward);save(true);render();toast(`🎯 ${q.name} claimed!`);showMegaQuests();
  }
  function showMegaQuests(){
    ensureCycles();
    const section=(scope,title,list)=>`<h3>${title}</h3>${list.map(q=>{const p=Math.min(q.target,questProgress(scope,q)),key=`${scope}:${mega()[scope].key}:${q.id}`,done=!!mega().questClaims[key],ready=p>=q.target&&!done;return `<div class="evo-row ${done?'done':''}"><div class="card-row"><div><b>${q.name}</b><div class="small">${q.desc}</div></div><span class="reward">${rewardText(q.reward)}</span></div><div class="meter"><div style="width:${Math.min(100,p/q.target*100)}%"></div></div><div class="card-row"><span class="small">${fmt(p)} / ${fmt(q.target)}</span><button class="btn ${ready?'gold':''}" data-megaquest="${scope}|${q.id}" ${ready?'':'disabled'}>${done?'Claimed':ready?'Claim':'In Progress'}</button></div></div>`}).join('')}`;
    openHub('🎯 Daily & Weekly Quests',`<div class="notice">Daily quests reset with your local day. Weekly quests reset Monday.</div>${section('day','☀️ Daily Quests',DAILY_Q)}${section('week','📅 Weekly Quests',WEEKLY_Q)}`);
    document.querySelectorAll('[data-megaquest]').forEach(b=>b.onclick=()=>{const [s,id]=b.dataset.megaquest.split('|');claimMegaQuest(s,id)});
  }

  const EGGS={
    basic:{name:'Basic Egg',icon:'🥚',price:1e5,seconds:20},
    cosmic:{name:'Cosmic Egg',icon:'🌌',price:1e9,seconds:45},
    glitch:{name:'Glitch Egg',icon:'👾',price:1e22,seconds:90}
  };
  function startEgg(type){
    const e=EGGS[type],m=mega();if(!e)return;
    if(m.eggQueue.length>=3)return toast('Egg incubator is full (3 max)');
    if((Number(m.eggInventory[type])||0)>0)m.eggInventory[type]--;
    else{if(state.coins<e.price)return toast('Not enough coins');state.coins-=e.price}
    m.eggQueue.push({id:`egg-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type,hatchAt:Date.now()+e.seconds*1000});
    save(true);render();toast(`${e.icon} ${e.name} incubating!`);showEggs();
  }
  function eggPool(type){
    let p=(availableBoxPool?.()||[]).filter(baseForShiny);
    if(type==='basic')p=p.filter(r=>[...W1,...W2].some(x=>x.name===r.name));
    if(type==='glitch'&&state.world6Unlocked)p=[...W6];
    return p.length?p:(availableBoxPool?.()||[]).filter(baseForShiny);
  }
  function hatchEgg(id){
    const m=mega(),idx=m.eggQueue.findIndex(x=>x.id===id);if(idx<0)return;
    const q=m.eggQueue[idx];if(Date.now()<q.hatchAt)return toast('Egg is still incubating');
    m.eggQueue.splice(idx,1);m.eggsHatched++;
    const pool=eggPool(q.type);let r=pool[Math.floor(Math.random()*pool.length)];
    const shinyRoll=Math.random()<Math.min(.12,shinyChance('egg')*(q.type==='glitch'?3:1));
    const name=shinyRoll?`Shiny ${r.name}`:r.name;
    awardSquishy(name,'egg');save(true);showEggs();
  }
  function showEggs(){
    const m=mega(),now=Date.now();
    const shop=Object.entries(EGGS).map(([k,e])=>`<div class="egg-row"><div class="card-row"><div><b>${e.icon} ${e.name}</b><div class="small">${e.seconds}s hatch · Free inventory: ${m.eggInventory[k]||0}</div></div><span class="reward">🪙 ${fmt(e.price)}</span></div><button class="btn gold" data-start-egg="${k}" ${m.eggQueue.length>=3||((m.eggInventory[k]||0)<=0&&state.coins<e.price)?'disabled':''}>${(m.eggInventory[k]||0)>0?'Use Free Egg':'Buy & Incubate'}</button></div>`).join('');
    const queue=m.eggQueue.map(q=>{const e=EGGS[q.type],left=Math.max(0,Math.ceil((q.hatchAt-now)/1000));return `<div class="egg-row"><div class="card-row"><b>${e.icon} ${e.name}</b><span class="mega-pill">${left?'⏳ '+left+'s':'✅ READY'}</span></div><button class="btn gold" data-hatch-egg="${q.id}" ${left?'disabled':''}>🥚 HATCH</button></div>`}).join('');
    openHub('🥚 Squishy Eggs',`<div class="notice">Eggs can hatch normal or ✨ Shiny squishies. Prestige Luck improves your odds. Incubator capacity: ${m.eggQueue.length}/3.</div><h3>Incubator</h3>${queue||'<div class="card">No eggs incubating.</div>'}<h3>Egg Shop</h3>${shop}`);
    document.querySelectorAll('[data-start-egg]').forEach(b=>b.onclick=()=>startEgg(b.dataset.startEgg));
    document.querySelectorAll('[data-hatch-egg]').forEach(b=>b.onclick=()=>hatchEgg(b.dataset.hatchEgg));
  }

  const BOOSTS={
    coin2:{name:'2× Coins',icon:'🪙',seconds:600,price:1e8,desc:'Doubles all positive coin gains for 10 minutes.'},
    luck5:{name:'5× Luck',icon:'🍀',seconds:300,price:1e9,desc:'5× Shiny and Egg luck for 5 minutes.'},
    boss3:{name:'3× Boss Damage',icon:'👹',seconds:300,price:1e12,desc:'Triples Global Boss damage for 5 minutes.'},
    auto:{name:'Auto Squish',icon:'🤖',seconds:30,price:1e7,desc:'Automatically squishes every 0.7 seconds for 30 seconds.'}
  };
  function buyBoost(k){
    const b=BOOSTS[k],m=mega();if(!b||state.coins<b.price)return toast('Not enough coins');
    state.coins-=b.price;m.boosts[k]=(Number(m.boosts[k])||0)+1;save(true);render();showBoosts();
  }
  function useBoost(k){
    const b=BOOSTS[k],m=mega();if(!b||(Number(m.boosts[k])||0)<1)return toast('No boost in inventory');
    m.boosts[k]--;const start=Math.max(Date.now(),Number(m.activeBoosts[k])||0);m.activeBoosts[k]=start+b.seconds*1000;save(true);render();toast(`${b.icon} ${b.name} activated!`);showBoosts();
  }
  function showBoosts(){
    const m=mega(),cards=Object.entries(BOOSTS).map(([k,b])=>{const count=Number(m.boosts[k])||0,left=Math.max(0,Math.ceil((activeUntil(k)-Date.now())/1000));return `<div class="boost-row"><div class="card-row"><div><b>${b.icon} ${b.name}</b><div class="small">${b.desc}</div></div><span class="mega-pill">${left?`ACTIVE ${left}s`:`Owned ${count}`}</span></div><div class="grid2"><button class="btn gold" data-use-boost="${k}" ${count<1?'disabled':''}>USE</button><button class="btn" data-buy-boost="${k}" ${state.coins<b.price?'disabled':''}>Buy 🪙 ${fmt(b.price)}</button></div></div>`}).join('');
    openHub('🎒 Boost Inventory',`<div class="notice">Boosts are stored until you choose to activate them. Quest rewards can also add boosts here.</div>${cards}`);
    document.querySelectorAll('[data-use-boost]').forEach(b=>b.onclick=()=>useBoost(b.dataset.useBoost));
    document.querySelectorAll('[data-buy-boost]').forEach(b=>b.onclick=()=>buyBoost(b.dataset.buyBoost));
  }

  function bossPhase(hp,max){
    const p=max>0?hp/max:0;
    if(hp<=0)return ['🏆 DEFEATED','The Rift Titan reward is available to the finishing player.'];
    if(p>.7)return ['Phase I — Dormant','The Colossus is waking up.'];
    if(p>.3)return ['Phase II — Rift Storm','Reality is destabilizing.'];
    return ['🔥 Phase III — ENRAGED','Final phase. Finish it before the weekly reset!'];
  }
  async function bossSnapshot(){
    let rows=await api('needoh_global_boss?select=id,cycle_key,name,max_hp,hp,ends_at&limit=1');
    let b=rows?.[0];
    if(!b||Date.parse(b.ends_at)<=Date.now()){
      const r=await api('rpc/needoh_hit_global_boss',{method:'POST',body:JSON.stringify({p_player_key:pkey()||'player',p_player_name:playerName(),p_damage:0})});
      b=r?.[0]?{cycle_key:r[0].cycle_key,name:r[0].boss_name,max_hp:r[0].max_hp,hp:r[0].hp,ends_at:r[0].ends_at}:b;
    }
    return b;
  }
  async function hitGlobalBoss(){
    if(playerName()==='Player')return toast('Choose a player name first');
    const eventMult=Number(window.__needohEvents?.mult?.('boss_damage'))||1;
    const damage=Math.max(1,currentPerSquish()*1000*prestigeBoss()*bossBoost()*eventMult);
    try{
      const rows=await api('rpc/needoh_hit_global_boss',{method:'POST',body:JSON.stringify({p_player_key:pkey(),p_player_name:playerName(),p_damage:damage})}),r=rows?.[0];
      if(!r)return toast('Boss hit failed');
      const applied=Number(r.applied_damage)||0;mega().totalGlobalDamage+=applied;
      addCoins(Math.max(1,applied*.02));
      if(Number(r.hp)<=0&&!state.owned.includes('Rift Titan'))awardSquishy('Rift Titan','global-boss');
      save(true);toast(`👹 ${fmt(applied)} Global Boss damage!`);showGlobalBoss();
    }catch(e){console.warn('Global boss hit failed',e);toast('Could not hit Global Boss')}
  }
  async function showGlobalBoss(){
    openHub('🌐 Global Boss','<div class="card">Loading the Rift Colossus…</div>');
    try{
      const b=await bossSnapshot();if(!b)throw new Error('No boss');
      const scores=await api(`needoh_global_boss_scores?select=player_name,damage&cycle_key=eq.${encodeURIComponent(b.cycle_key)}&order=damage.desc&limit=10`);
      const hp=Number(b.hp)||0,max=Number(b.max_hp)||1,pct=Math.max(0,Math.min(100,hp/max*100)),[phase,desc]=bossPhase(hp,max);
      const left=Math.max(0,Date.parse(b.ends_at)-Date.now()),days=Math.floor(left/86400000),hours=Math.floor((left%86400000)/3600000);
      const board=(scores||[]).map((x,i)=>`<div class="leader-row"><b>#${i+1}</b><div><b>${escapeHtml(x.player_name)}</b><div class="small">Global damage</div></div><span class="reward">${fmt(Number(x.damage)||0)}</span></div>`).join('');
      openHub('🌐 Global Boss',`<div class="boss"><div class="global-boss-art">🌀👹</div><h2>Rift Colossus</h2><div class="mega-pill">${phase}</div><p>${desc}</p><div class="boss-hp"><div style="width:${pct}%"></div></div><b>${fmt(hp)} / ${fmt(max)} HP</b><div class="small">Weekly reset in ${days}d ${hours}h · Your hit: ~${fmt(currentPerSquish()*1000*prestigeBoss()*bossBoost()*(Number(window.__needohEvents?.mult?.('boss_damage'))||1))}</div><button class="btn danger" id="megaHitGlobalBoss" ${hp<=0?'disabled':''}>⚔️ HIT GLOBAL BOSS</button></div><h3>🏆 Damage Ranking</h3>${board||'<div class="card">No damage yet this week.</div>'}`);
      $('megaHitGlobalBoss').onclick=hitGlobalBoss;
    }catch(e){openHub('🌐 Global Boss',`<div class="notice">Global Boss could not connect.</div><div class="small">${escapeHtml(e.message||String(e))}</div>`)}
  }

  function tradeable(name){
    const r=allRarities().find(x=>x.name===name);
    return !!(r&&!r.ownerOnly&&!r.limited&&!r.bossOnly&&r.name!=='ATTILA'&&r.name!=='Admin');
  }
  function giveTradeItem(name){
    if(state.owned.includes(name)){if(name.startsWith('Shiny '))mega().shinyDust++;else recordCopy(name)}
    else state.owned.push(name);
  }
  async function claimAcceptedTrades(silent=true){
    if(playerName()==='Player')return;
    try{
      const rows=await api(`needoh_trades?select=id,requested_item&from_key=eq.${encodeURIComponent(pkey())}&status=eq.accepted&sender_claimed=eq.false&order=accepted_at.asc`);
      let n=0;
      for(const t of rows||[]){
        giveTradeItem(t.requested_item);
        const out=await api(`needoh_trades?id=eq.${encodeURIComponent(t.id)}&from_key=eq.${encodeURIComponent(pkey())}&sender_claimed=eq.false`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({sender_claimed:true,updated_at:new Date().toISOString()})});
        if(out?.length)n++;
      }
      if(n){save(true);render();if(!silent)toast(`💱 Claimed ${n} completed trade${n===1?'':'s'}!`)}
    }catch(e){if(!silent)toast('Could not check completed trades')}
  }
  async function createTrade(){
    const offered=$('tradeOfferItem')?.value,requested=$('tradeRequestItem')?.value;
    if(!tradeable(offered)||!tradeable(requested))return toast('That item cannot be traded');
    if(offered===requested)return toast('Choose two different squishies');
    if(!state.owned.includes(offered))return toast('You do not own the offered squishy');
    state.owned=state.owned.filter(x=>x!==offered);if(state.selected===offered)state.selected=state.owned[0]||'Common';save(true);render();
    try{
      await api('needoh_trades',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{from_key:pkey(),from_name:playerName(),offered_item:offered,requested_item:requested,status:'open'}])});
      toast('💱 Trade offer posted!');showTrading();
    }catch(e){state.owned.push(offered);save(true);render();toast('Could not post trade')}
  }
  async function acceptTrade(id){
    let requested=null,offered=null;
    try{
      const rows=await api(`needoh_trades?select=*&id=eq.${encodeURIComponent(id)}&status=eq.open&limit=1`),t=rows?.[0];
      if(!t)return toast('Trade is no longer open');
      if(t.from_key===pkey())return toast('You cannot accept your own trade');
      if(!tradeable(t.offered_item)||!tradeable(t.requested_item))return toast('Trade contains a locked item');
      if(!state.owned.includes(t.requested_item))return toast(`You need ${t.requested_item}`);
      requested=t.requested_item;offered=t.offered_item;
      state.owned=state.owned.filter(x=>x!==requested);if(state.selected===requested)state.selected=state.owned[0]||'Common';
      const out=await api(`needoh_trades?id=eq.${encodeURIComponent(id)}&status=eq.open`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:'accepted',accepted_by:pkey(),accepted_name:playerName(),accepted_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
      if(!out?.length)throw new Error('Trade already taken');
      giveTradeItem(offered);save(true);render();
      toast(`💱 Trade complete! You got ${offered}`);showTrading();
    }catch(e){
      if(requested&&!state.owned.includes(requested))state.owned.push(requested);
      save(true);render();toast('Could not accept trade — refresh offers')
    }
  }
  async function cancelTrade(id){
    try{
      const rows=await api(`needoh_trades?select=*&id=eq.${encodeURIComponent(id)}&from_key=eq.${encodeURIComponent(pkey())}&status=eq.open&limit=1`),t=rows?.[0];
      if(!t)return toast('Trade is no longer open');
      const out=await api(`needoh_trades?id=eq.${encodeURIComponent(id)}&from_key=eq.${encodeURIComponent(pkey())}&status=eq.open`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:'cancelled',sender_claimed:true,updated_at:new Date().toISOString()})});
      if(!out?.length)return toast('Could not cancel trade');
      giveTradeItem(t.offered_item);save(true);render();toast('Trade cancelled and squishy returned');showTrading();
    }catch(e){toast('Could not cancel trade')}
  }
  async function showTrading(){
    openHub('💱 Player Trading','<div class="card">Loading trade market…</div>');
    try{
      await claimAcceptedTrades(true);
      const rows=await api('needoh_trades?select=id,from_key,from_name,offered_item,requested_item,status,created_at&status=eq.open&order=created_at.desc&limit=100');
      const mine=(state.owned||[]).filter(tradeable),all=[...new Set(allRarities().filter(r=>tradeable(r.name)).map(r=>r.name))];
      const opts=mine.map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join(''),req=all.map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
      const offers=(rows||[]).map(t=>{const own=t.from_key===pkey(),can=state.owned.includes(t.requested_item);return `<div class="trade-row"><div><b>${escapeHtml(t.from_name)} offers ${escapeHtml(t.offered_item)}</b><div class="small">Wants: ${escapeHtml(t.requested_item)}</div></div>${own?`<button class="btn danger" data-cancel-trade="${t.id}">Cancel</button>`:`<button class="btn gold" data-accept-trade="${t.id}" ${can?'':'disabled'}>${can?'Accept':'Need '+escapeHtml(t.requested_item)}</button>`}</div>`}).join('');
      openHub('💱 Player Trading',`<div class="notice">Normal and Shiny squishies can be traded. ATTILA, Admin, limited/season rewards and Global Boss rewards are locked from trading.</div><div class="card"><h3>Create Trade Offer</h3><label class="small">You give</label><select class="field" id="tradeOfferItem">${opts||'<option value="">No tradeable squishies</option>'}</select><label class="small">You want</label><select class="field" id="tradeRequestItem">${req}</select><button class="btn gold" id="createTradeBtn" ${mine.length?'':'disabled'}>💱 POST TRADE</button></div><h3>Open Trades</h3>${offers||'<div class="card">No open trades right now.</div>'}`);
      $('createTradeBtn').onclick=createTrade;
      document.querySelectorAll('[data-accept-trade]').forEach(b=>b.onclick=()=>acceptTrade(b.dataset.acceptTrade));
      document.querySelectorAll('[data-cancel-trade]').forEach(b=>b.onclick=()=>cancelTrade(b.dataset.cancelTrade));
    }catch(e){openHub('💱 Player Trading',`<div class="notice">Trading could not connect.</div><div class="small">${escapeHtml(e.message||String(e))}</div>`)}
  }

  function addFeatureButton(id,label,fn){
    if($(id))return;
    const b=document.createElement('button');b.className='btn';b.id=id;b.textContent=label;b.onclick=fn;
    document.querySelector('.featurebar')?.insertBefore(b,$('adminBtn'));
  }
  function showMegaHub(){
    const m=mega(),next=prestigeThreshold(),features=[
      ['♻️','Prestige / Rebirth',`${m.prestige.points} PP available · next at ${fmt(next)}`,'prestige'],
      ['🧬','Squishy Evolution','Use duplicates to evolve squishies up to Rainbow tier.','evolution'],
      ['📖','Squishy Index','Pokédex-style collection tracker with undiscovered silhouettes.','index'],
      ['✨','Shiny Squishies',`Rare 5× variants · current box chance ~${(shinyChance('box')*100).toFixed(2)}%.`,'index'],
      ['🎯','Daily + Weekly Quests','Rotating progression goals with coins, boosts, eggs and PP.','quests'],
      ['🥚','Squishy Eggs',`${m.eggQueue.length}/3 incubators in use · hatch normal or Shiny squishies.`,'eggs'],
      ['🌐','Global Boss','Fight the shared Rift Colossus with phases and weekly damage rankings.','boss'],
      ['🎒','Boost Inventory','Store and activate Coin, Luck, Boss and Auto-Squish boosts.','boosts'],
      ['💱','Player Trading','Post and accept squishy-for-squishy trade offers.','trading'],
      ['🧪','World 6',state.world6Unlocked?'Glitched Dimension unlocked!':`Unlock at ${fmt(W6_UNLOCK)} coins.`,'world6']
    ];
    const html=features.map(([i,n,d,a])=>`<div class="mega-card"><div style="font-size:30px">${i}</div><h3>${n}</h3><p>${d}</p><button class="btn gold" data-mega-open="${a}">OPEN</button></div>`).join('');
    openHub('🚀 Needoh Mega Update',`<div class="notice">10 major systems are now connected to your existing save. Nothing requires a new account.</div><div class="mega-grid">${html}</div>`);
    document.querySelectorAll('[data-mega-open]').forEach(b=>b.onclick=()=>openMega(b.dataset.megaOpen));
  }
  function openMega(a){
    if(a==='prestige')showPrestige();
    else if(a==='evolution')showEvolution();
    else if(a==='index')showIndex();
    else if(a==='quests')showMegaQuests();
    else if(a==='eggs')showEggs();
    else if(a==='boss')showGlobalBoss();
    else if(a==='boosts')showBoosts();
    else if(a==='trading')showTrading();
    else if(a==='world6'){closeHub();if(state.world===5||state.world===6)toast(state.world6Unlocked?'Use the World button to enter World 6':'Reach the World 6 requirement in World 5');else toast('Reach World 5 first, then unlock World 6')}
  }

  const beforeRender=render;
  render=function(){
    const v=beforeRender();
    ensureStyles();ensureCycles();updateDiscovered();
    const m=mega(),r=rarity(state.selected),n=$('needoh');
    if($('perSquish'))$('perSquish').textContent=fmt(currentPerSquish());
    if($('rarityMult'))$('rarityMult').textContent=`Squishy multiplier ×${fmt(r.mult)} · Base ×${Number(state.baseMult).toFixed(2)} · Prestige ×${prestigeClick().toFixed(2)}`;
    if(n)n.classList.toggle('mega-shiny-selected',!!r.shiny);
    if(state.world===5){
      $('worldBtn').textContent=state.world6Unlocked?'🧪 Enter World 6':`🔒 World 6 — ${fmt(W6_UNLOCK)} 🪙`;
      $('worldProgress').style.width=(state.world6Unlocked?100:Math.min(100,state.coins/W6_UNLOCK*100))+'%';
      $('progressText').textContent=state.world6Unlocked?'World 6 unlocked!':`${fmt(state.coins)} / ${fmt(W6_UNLOCK)} coins to World 6`;
    }else if(state.world===6){
      $('worldBtn').textContent='🌎 Return to World 1';$('worldProgress').style.width='100%';$('progressText').textContent='🧪 GLITCHED DIMENSION — hunt Singularity and Shiny variants!';
    }
    if($('megaPrestigeStat'))$('megaPrestigeStat').textContent=`♻️ ${m.prestige.points} PP`;
    return v;
  };

  function installUI(){
    ensureStyles();mega();ensureCycles();updateDiscovered();
    addFeatureButton('megaBtn','🚀 Mega',showMegaHub);
    addFeatureButton('globalBossBtn','🌐 Global Boss',showGlobalBoss);
    const stats=document.querySelector('.stats');
    if(stats&&!$('megaPrestigeStat')){const d=document.createElement('div');d.className='stat';d.id='megaPrestigeStat';stats.appendChild(d)}
    render();
  }

  setInterval(()=>{if(active('auto')&&document.visibilityState!=='hidden')squish()},700);
  setInterval(()=>{ensureCycles();claimAcceptedTrades(true);},5000);

  window.__needohMegaUpdate={
    show:showMegaHub,prestige:showPrestige,evolution:showEvolution,index:showIndex,quests:showMegaQuests,eggs:showEggs,boss:showGlobalBoss,boosts:showBoosts,trading:showTrading,
    world6:W6,riftTitan:RIFT_TITAN,shinyChance,recordCopy
  };
  window.__needohMegaUpdateLoaded=true;
  installUI();
})();