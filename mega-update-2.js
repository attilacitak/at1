(() => {
  if(window.__needohMegaExpansion2Loaded)return;

  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const HEADERS={apikey:SB_KEY,'Content-Type':'application/json'};
  const PRESTIGE_BASE_2=1e25;

  const SPECIAL=[
    {name:'Streak Star',icon:'🌟',color:'linear-gradient(135deg,#fff7a8,#ffb74a,#ff7fd1)',glow:'#ffe66d',shape:'42% 58% 53% 47% / 58% 42% 58% 42%',mult:5e13,chance:0,min:0,max:0,sound:880,limited:true,streakOnly:true},
    {name:'Streak Crown',icon:'🔥',color:'linear-gradient(135deg,#fff1a8,#ff8a36,#ff315f)',glow:'#ffd95e',shape:'35% 65% 46% 54% / 66% 36% 64% 34%',mult:3e14,chance:0,min:0,max:0,sound:1040,limited:true,streakOnly:true},
    {name:'Summer Splash',icon:'☀️',color:'linear-gradient(135deg,#ffe76a,#63e9ff,#ff86d8)',glow:'#7cf7ff',shape:'62% 38% 54% 46% / 40% 63% 37% 60%',mult:5e10,chance:0,min:0,max:0,sound:720,limited:true,eventOnly:true},
    {name:'Pumpkin Goo',icon:'🎃',color:'linear-gradient(135deg,#ff9b35,#ff4d45,#2b183e)',glow:'#ff8b38',shape:'46% 54% 67% 33% / 53% 39% 61% 47%',mult:2e11,chance:0,min:0,max:0,sound:310,limited:true,eventOnly:true},
    {name:'Frostbite',icon:'❄️',color:'linear-gradient(135deg,#f5ffff,#7bdcff,#8f8cff)',glow:'#c7fbff',shape:'39% 61% 41% 59% / 61% 39% 61% 39%',mult:1e12,chance:0,min:0,max:0,sound:960,limited:true,eventOnly:true},
    {name:'Glitch Cube',icon:'🧊',color:'linear-gradient(135deg,#00ff91,#151425,#a64dff,#ff3f73)',glow:'#38ffb2',shape:'18%',mult:5e13,chance:0,min:0,max:0,sound:480,limited:true,eventOnly:true},
    {name:'Royal Gold',icon:'🏆',color:'linear-gradient(135deg,#fff4a6,#ffca35,#4a3200,#ffe47a)',glow:'#ffd95e',shape:'50% 50% 36% 64% / 58% 42% 58% 42%',mult:2e14,chance:0,min:0,max:0,sound:1080,limited:true,eventOnly:true}
  ];

  const pkey=()=>cleanPlayerName(playerName()).toLowerCase();
  const ownerAuthorized=()=>!!window.__needohIsOwnerAdmin?.();

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...HEADERS,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();
    return t?JSON.parse(t):null;
  }

  function m2(){
    state.mega2=state.mega2&&typeof state.mega2==='object'?state.mega2:{};
    const m=state.mega2;
    m.title=String(m.title||'');
    m.cosmetic=String(m.cosmetic||'none');
    m.playSeconds=Math.max(0,Number(m.playSeconds)||0);
    m.tradesCompleted=Math.max(0,Number(m.tradesCompleted)||0);
    m.streak=Math.max(0,Number(m.streak)||0);
    m.bestStreak=Math.max(0,Number(m.bestStreak)||0);
    m.lastStreakRewardDate=String(m.lastStreakRewardDate||'');
    m.skills={coins:0,shiny:0,boss:0,boxes:0,collector:0,...(m.skills||{})};
    m.eventBoxesOpened=Math.max(0,Number(m.eventBoxesOpened)||0);
    m.clanBossClaims={...(m.clanBossClaims||{})};
    m.indexCelebrated=!!m.indexCelebrated;
    m.marketPayouts=Math.max(0,Number(m.marketPayouts)||0);
    return m;
  }

  const beforeAllRarities2=allRarities;
  allRarities=function(){
    const list=[...beforeAllRarities2()];
    for(const r of SPECIAL)if(!list.some(x=>x.name===r.name))list.push(r);
    return list;
  };

  function ensureStyles(){
    if(document.getElementById('megaExpansion2Styles'))return;
    const s=document.createElement('style');
    s.id='megaExpansion2Styles';
    s.textContent=`
      .m2-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .m2-card{background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(80,68,210,.08));border:1px solid rgba(255,255,255,.11);border-radius:17px;padding:13px}
      .m2-card h3{margin:0 0 5px}.m2-card p{margin:4px 0;color:#c8c7d7;font-size:12px}
      .m2-title{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;background:linear-gradient(135deg,rgba(255,217,94,.18),rgba(143,92,255,.2));border:1px solid rgba(255,217,94,.27);font-size:10px;font-weight:1000;color:#ffe99c}
      .m2-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:12px}.m2-tabs .btn{font-size:11px;padding:7px 9px}
      .m2-profile{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.m2-kpi{background:rgba(0,0,0,.19);border-radius:13px;padding:10px;text-align:center}.m2-kpi b{display:block;font-size:20px}
      .m2-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:10px;margin:7px 0}
      .m2-rank{display:grid;grid-template-columns:42px 1fr auto;gap:9px;align-items:center;background:rgba(255,255,255,.06);border-radius:14px;padding:10px;margin:7px 0}
      .m2-cosmetics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.m2-cosmetic{min-height:92px;text-align:center;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.09);border-radius:15px;padding:10px}
      .m2-cosmetic .emoji{font-size:30px}.m2-cosmetic.locked{opacity:.45}
      .m2-boss{background:linear-gradient(135deg,rgba(255,73,126,.12),rgba(100,83,255,.13));border:1px solid rgba(255,255,255,.11);border-radius:18px;padding:15px;text-align:center}
      .m2-hp{height:16px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;margin:9px 0}.m2-hp>div{height:100%;background:linear-gradient(90deg,#7cf7d4,#7b6cff,#ff4770)}
      #mega2CosmeticOverlay{position:absolute;z-index:9;pointer-events:none;font-size:52px;line-height:1;filter:drop-shadow(0 5px 9px rgba(0,0,0,.45));transition:.2s;left:50%;top:50%;transform:translate(-50%,-50%)}
      #mega2CosmeticOverlay.crown{top:18%;font-size:58px}#mega2CosmeticOverlay.halo{top:18%;font-size:54px}#mega2CosmeticOverlay.sunglasses{top:48%;font-size:48px}
      #mega2CosmeticOverlay.fire{top:76%;font-size:58px}#mega2CosmeticOverlay.lightning{left:78%;top:38%;font-size:56px}#mega2CosmeticOverlay.stars{left:72%;top:25%;font-size:54px}
      .mega2-trail{filter:drop-shadow(18px 12px 10px rgba(124,247,212,.75)) drop-shadow(-18px -10px 12px rgba(211,105,255,.62))!important}
      .m2-celebrate{position:fixed;inset:0;z-index:40000;display:grid;place-items:center;pointer-events:none;background:radial-gradient(circle,rgba(255,255,255,.12),rgba(0,0,0,.25));animation:m2Fade 1.6s ease forwards}
      .m2-celebrate .big{font-size:clamp(34px,7vw,74px);font-weight:1000;text-align:center;text-shadow:0 0 28px #fff,0 0 55px #ffd95e;animation:m2Pop .55s cubic-bezier(.2,1.4,.3,1)}
      .m2-particle{position:fixed;z-index:40001;font-size:28px;animation:m2Particle 1.5s ease-out forwards;pointer-events:none}
      body.mega2-shake .app{animation:m2Shake .42s linear}
      @keyframes m2Pop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes m2Fade{0%,70%{opacity:1}100%{opacity:0}}
      @keyframes m2Particle{from{transform:translateY(0) rotate(0);opacity:1}to{transform:translateY(-180px) rotate(420deg);opacity:0}}
      @keyframes m2Shake{0%,100%{transform:translate(0)}20%{transform:translate(-7px,3px)}40%{transform:translate(7px,-3px)}60%{transform:translate(-5px,-2px)}80%{transform:translate(5px,2px)}}
      @media(max-width:720px){.m2-grid,.m2-profile,.m2-cosmetics{grid-template-columns:1fr 1fr}.m2-rank{grid-template-columns:34px 1fr}.m2-rank>div:last-child{grid-column:2}}
      @media(max-width:480px){.m2-grid,.m2-profile,.m2-cosmetics{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function celebrate(kind,text){
    ensureStyles();
    document.body.classList.remove('mega2-shake');
    void document.body.offsetWidth;
    document.body.classList.add('mega2-shake');
    const o=document.createElement('div');
    o.className='m2-celebrate';
    const icons=kind==='shiny'?['✨','🌟','💎']:kind==='world'?['🌎','🚀','✨']:kind==='boss'?['💥','👹','🏆']:kind==='prestige'?['♻️','⚡','🌟']:['🎉','✨','🫧'];
    o.innerHTML=`<div class="big">${icons[0]} ${escapeHtml(text)} ${icons[0]}</div>`;
    document.body.appendChild(o);
    for(let i=0;i<22;i++){
      const p=document.createElement('div');p.className='m2-particle';p.textContent=icons[i%icons.length];
      p.style.left=(5+Math.random()*90)+'vw';p.style.top=(45+Math.random()*45)+'vh';p.style.animationDelay=(Math.random()*.25)+'s';
      document.body.appendChild(p);setTimeout(()=>p.remove(),1900);
    }
    setTimeout(()=>{o.remove();document.body.classList.remove('mega2-shake')},1700);
  }

  const prestigeObj=()=>state.mega?.prestige||{count:0,points:0,spent:{}};
  function prestigeThreshold2(){
    const c=Math.max(0,Math.min(60,Number(prestigeObj().count)||0));
    return PRESTIGE_BASE_2*Math.pow(25,Math.pow(c,1.2));
  }
  function prestigeGain2(){
    const t=prestigeThreshold2(),coins=Number(state.coins)||0;
    if(coins<t)return 0;
    return Math.max(1,1+Math.floor(Math.log10(Math.max(1,coins/t))/2));
  }
  function skillLevel(k){return Math.max(0,Number(m2().skills[k])||0)}
  function skillCost(k){return skillLevel(k)+1}
  function doPrestige2(){
    const p=prestigeObj(),gain=prestigeGain2(),need=prestigeThreshold2();
    if(gain<1)return toast(`Need ${fmt(need)} coins to Prestige`);
    if(!confirm(`Prestige for ${gain} PP? Coins, upgrades and world unlocks reset. Collection, evolutions, Shinies, boosts, titles and cosmetics stay.`))return;
    p.points=(Number(p.points)||0)+gain;p.count=(Number(p.count)||0)+1;
    state.coins=0;state.clickPower=1;state.baseMult=1;state.clickLevel=0;state.multLevel=0;
    state.world=1;state.world2Unlocked=false;state.world3Unlocked=false;state.world4Unlocked=false;state.world5Unlocked=false;state.world6Unlocked=false;
    state.selected=state.owned.includes('Common')?'Common':state.owned[0]||'Common';
    state.pity={Mythic:8,Legendary:12,Secret:20};state.stock=[];state.restockAt=Date.now()+60000;
    if(typeof resetBossForWorld==='function')resetBossForWorld();
    restock(true);save(true);render();celebrate('prestige',`PRESTIGE +${gain} PP`);setTimeout(showPrestigeTree,250);
  }
  function buySkill(k){
    const p=prestigeObj(),cost=skillCost(k);
    if((Number(p.points)||0)<cost)return toast('Not enough Prestige Points');
    p.points-=cost;m2().skills[k]=skillLevel(k)+1;save(true);render();showPrestigeTree();
  }
  function showPrestigeTree(){
    const p=prestigeObj(),need=prestigeThreshold2(),gain=prestigeGain2();
    const defs=[
      ['coins','🪙 Coin Engine','+20% all coin gains / level',`×${(1+.2*skillLevel('coins')).toFixed(2)}`],
      ['shiny','✨ Shiny Hunter','Adds extra Shiny rolls from boxes',`Lv ${skillLevel('shiny')}`],
      ['boss','👹 Boss Hunter','+35% Clan Boss damage / level',`×${(1+.35*skillLevel('boss')).toFixed(2)}`],
      ['boxes','🎁 Box Master','Cheaper event boxes + better exclusive odds',`Lv ${skillLevel('boxes')}`],
      ['collector','📖 Collector','Extra duplicate-copy chances from event boxes',`Lv ${skillLevel('collector')}`]
    ];
    const rows=defs.map(([k,n,d,e])=>`<div class="m2-row"><div><b>${n}</b><div class="small">${d}</div><span class="m2-title">${e}</span></div><button class="btn gold" data-m2-skill="${k}" ${(Number(p.points)||0)<skillCost(k)?'disabled':''}>${skillCost(k)} PP</button></div>`).join('');
    openHub('🌳 Prestige Skill Tree',`<div class="notice">Prestige starts much earlier now, but the requirement accelerates every time: 1e25 first, then the curve gets progressively steeper.</div><div class="m2-profile"><div class="m2-kpi"><span class="small">Prestiges</span><b>${Number(p.count)||0}</b></div><div class="m2-kpi"><span class="small">Available PP</span><b>${Number(p.points)||0}</b></div><div class="m2-kpi"><span class="small">Next</span><b>${fmt(need)}</b></div><div class="m2-kpi"><span class="small">Gain Now</span><b>+${gain}</b></div></div><button class="btn admin" id="m2PrestigeNow" ${gain<1?'disabled':''}>♻️ PRESTIGE NOW (+${gain} PP)</button><h3>Permanent Skill Tree</h3>${rows}`);
    $('m2PrestigeNow').onclick=doPrestige2;
    document.querySelectorAll('[data-m2-skill]').forEach(b=>b.onclick=()=>buySkill(b.dataset.m2Skill));
  }

  const beforeAddCoins2=addCoins;
  addCoins=function(amount){
    const mult=1+.2*skillLevel('coins');
    return beforeAddCoins2((Number(amount)||0)*mult);
  };

  function currentPower(){
    const r=rarity(state.selected),p=prestigeObj(),clickLvl=Number(p.spent?.click)||0;
    return Math.max(1,(Number(state.clickPower)||1)*(Number(state.baseMult)||1)*(Number(r.mult)||1)*(1+.5*clickLvl));
  }
  function uniqueRarities(){const a=allRarities();return a.filter((r,i)=>a.findIndex(x=>x.name===r.name)===i)}
  function shinyCount(){return (state.owned||[]).filter(x=>String(x).startsWith('Shiny ')).length}
  function collectionCount(){return new Set(state.owned||[]).size}
  function rarestOwned(){
    let best=null;
    for(const n of state.owned||[]){const r=rarity(n);if(!best||Number(r.mult)>Number(best.mult))best=r}
    return best?.name||'Common';
  }
  function collectionPct(){
    const all=uniqueRarities().filter(r=>!r.ownerOnly&&!r.eventOnly&&!r.streakOnly);
    const owned=all.filter(r=>state.owned.includes(r.name)).length;
    return all.length?owned/all.length:0;
  }

  const TITLES=[
    {name:'Squish Rookie',icon:'🫧',check:()=>Number(state.squishes)>=100},
    {name:'Box Addict',icon:'📦',check:()=>Number(state.boxesOpened)>=50},
    {name:'Boss Slayer',icon:'👹',check:()=>Number(state.bossesDefeated)>=10},
    {name:'Shiny Hunter',icon:'✨',check:()=>shinyCount()>=3},
    {name:'Prestige Master',icon:'♻️',check:()=>Number(prestigeObj().count)>=3},
    {name:'World 6 Champion',icon:'🧪',check:()=>!!state.world6Unlocked},
    {name:'Collector Supreme',icon:'📖',check:()=>collectionPct()>=.75},
    {name:'Rift Destroyer',icon:'🌐',check:()=>Number(state.mega?.totalGlobalDamage)>=1e20},
    {name:'Market Mogul',icon:'💰',check:()=>m2().tradesCompleted>=10},
    {name:'Streak Legend',icon:'🔥',check:()=>m2().bestStreak>=30},
    {name:'ATTILA KING',icon:'👑',check:()=>ownerAuthorized()}
  ];
  function unlockedTitles(){return TITLES.filter(t=>{try{return t.check()}catch(e){return false}})}
  function titleText(){return m2().title||''}
  function titleHtml(t){return t?`<span class="m2-title">${escapeHtml(t)}</span>`:''}
  function setTitle(v){
    const ok=unlockedTitles().some(t=>t.name===v);
    m2().title=ok?v:'';save(true);syncProfile2();toast(v?`🏷️ Title equipped: ${v}`:'Title cleared');showProfile2();
  }

  const COSMETICS=[
    {id:'none',name:'None',icon:'➖',check:()=>true,why:'Default'},
    {id:'crown',name:'Crown',icon:'👑',check:()=>Number(prestigeObj().count)>=1,why:'Prestige once'},
    {id:'halo',name:'Halo',icon:'😇',check:()=>Number(state.bossesDefeated)>=5,why:'Defeat 5 bosses'},
    {id:'sunglasses',name:'Sunglasses',icon:'🕶️',check:()=>m2().bestStreak>=3,why:'3-day streak'},
    {id:'fire',name:'Fire Aura',icon:'🔥',check:()=>!!state.world6Unlocked,why:'Unlock World 6'},
    {id:'lightning',name:'Lightning',icon:'⚡',check:()=>Number(state.boxesOpened)>=25,why:'Open 25 boxes'},
    {id:'stars',name:'Stars',icon:'✨',check:()=>shinyCount()>=1,why:'Own a Shiny'},
    {id:'trail',name:'Rainbow Trail',icon:'🌈',check:()=>collectionCount()>=10,why:'Own 10 squishies'}
  ];
  function cosmeticDef(id){return COSMETICS.find(x=>x.id===id)||COSMETICS[0]}
  function applyCosmetic(){
    const wrap=document.querySelector('.needoh-wrap'),n=$('needoh');if(!wrap||!n)return;
    let o=$('mega2CosmeticOverlay');
    if(!o){o=document.createElement('div');o.id='mega2CosmeticOverlay';wrap.appendChild(o)}
    const d=cosmeticDef(m2().cosmetic);
    if(!d.check()){m2().cosmetic='none'}
    const now=cosmeticDef(m2().cosmetic);
    o.className=now.id;o.textContent=now.id==='none'||now.id==='trail'?'':now.icon;
    n.classList.toggle('mega2-trail',now.id==='trail');
  }
  function showCosmetics(){
    const cards=COSMETICS.map(c=>{const unlocked=c.check(),sel=m2().cosmetic===c.id;return `<div class="m2-cosmetic ${unlocked?'':'locked'}"><div class="emoji">${c.icon}</div><b>${escapeHtml(c.name)}</b><div class="small">${unlocked?'Unlocked':escapeHtml(c.why)}</div><button class="btn ${sel?'gold':''}" data-m2-cos="${c.id}" ${unlocked?'':'disabled'}>${sel?'EQUIPPED':'Equip'}</button></div>`}).join('');
    openHub('🎨 Squishy Customization',`<div class="notice">Cosmetics are visual only — they never change multipliers.</div><div class="m2-cosmetics">${cards}</div>`);
    document.querySelectorAll('[data-m2-cos]').forEach(b=>b.onclick=()=>{m2().cosmetic=b.dataset.m2Cos;save(true);render();showCosmetics()});
  }

  function playtimeText(sec){sec=Math.max(0,Number(sec)||0);const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return `${h}h ${m}m`}
  function showProfile2(){
    const titles=unlockedTitles(),opts=['<option value="">No title</option>',...titles.map(t=>`<option value="${escapeHtml(t.name)}" ${titleText()===t.name?'selected':''}>${t.icon} ${escapeHtml(t.name)}</option>`)].join('');
    const r=rarestOwned(),pct=Math.round(collectionPct()*100),clan=clanCache.clan?.name||'None';
    openHub(`👤 ${escapeHtml(playerName())} — Profile`,`<div class="card"><div style="text-align:center"><div style="font-size:52px">🫧</div><h2>${escapeHtml(playerName())}</h2>${titleHtml(titleText())}<div class="small">Clan: ${escapeHtml(clan)}</div></div><div class="m2-profile" style="margin-top:12px"><div class="m2-kpi"><span class="small">Playtime</span><b>${playtimeText(m2().playSeconds)}</b></div><div class="m2-kpi"><span class="small">Squishes</span><b>${fmt(state.squishes)}</b></div><div class="m2-kpi"><span class="small">Prestige</span><b>${Number(prestigeObj().count)||0}</b></div><div class="m2-kpi"><span class="small">Collection</span><b>${pct}%</b></div><div class="m2-kpi"><span class="small">Shinies</span><b>${shinyCount()}</b></div><div class="m2-kpi"><span class="small">Boss Kills</span><b>${fmt(state.bossesDefeated)}</b></div><div class="m2-kpi"><span class="small">Global Damage</span><b>${fmt(state.mega?.totalGlobalDamage||0)}</b></div><div class="m2-kpi"><span class="small">Trades</span><b>${m2().tradesCompleted}</b></div></div><div class="m2-row"><div><b>💎 Rarest Squishy</b><div class="small">${escapeHtml(r)}</div></div><span class="reward">×${fmt(rarity(r).mult)}</span></div><div class="m2-row"><div><b>🔥 Login Streak</b><div class="small">Best: ${m2().bestStreak} days</div></div><span class="reward">${m2().streak} days</span></div><label class="small">Displayed title</label><select class="field" id="m2TitleSelect">${opts}</select><button class="btn gold" id="m2SetTitle">🏷️ EQUIP TITLE</button><button class="btn" id="m2CosmeticsBtn">🎨 Cosmetics</button></div>`);
    $('m2SetTitle').onclick=()=>setTitle($('m2TitleSelect').value);
    $('m2CosmeticsBtn').onclick=showCosmetics;
  }

  let profileRowsCache=[];
  const LB={
    coins:{label:'🪙 Richest',metric:r=>Number(r.coins)||0,fmt:v=>fmt(v)},
    squishes:{label:'🫧 Squishes',metric:r=>Number(r.squishes)||0,fmt:v=>fmt(v)},
    prestige:{label:'♻️ Prestige',metric:r=>Number(r.prestige_count)||0,fmt:v=>String(v)},
    shiny:{label:'✨ Shinies',metric:r=>Number(r.shiny_count)||0,fmt:v=>String(v)},
    collection:{label:'📖 Collection',metric:r=>(Number(r.collection_total)||0)?(Number(r.collection_count)||0)/(Number(r.collection_total)||1):0,fmt:v=>Math.round(v*100)+'%'},
    global:{label:'🌐 Global Boss',metric:r=>Number(r.global_boss_damage)||0,fmt:v=>fmt(v)},
    bosses:{label:'👹 Boss Kills',metric:r=>Number(r.bosses_defeated)||0,fmt:v=>fmt(v)}
  };
  async function loadProfileRows(){
    profileRowsCache=await api('needoh_players?select=player_key,display_name,coins,squishes,world,selected_title,prestige_count,shiny_count,collection_count,collection_total,global_boss_damage,trades_completed,play_seconds,rarest_squishy,streak,clan_name,bosses_defeated&limit=500')||[];
    return profileRowsCache;
  }
  function publicProfileHtml(r){
    return `<div class="card"><div style="text-align:center"><h2>${escapeHtml(r.display_name)}</h2>${titleHtml(r.selected_title||'')}<div class="small">${r.clan_name?`Clan: ${escapeHtml(r.clan_name)}`:'No clan'}</div></div><div class="m2-profile"><div class="m2-kpi"><span class="small">Coins</span><b>${fmt(r.coins)}</b></div><div class="m2-kpi"><span class="small">Squishes</span><b>${fmt(r.squishes)}</b></div><div class="m2-kpi"><span class="small">Prestige</span><b>${r.prestige_count||0}</b></div><div class="m2-kpi"><span class="small">Shinies</span><b>${r.shiny_count||0}</b></div><div class="m2-kpi"><span class="small">Collection</span><b>${r.collection_total?Math.round(r.collection_count/r.collection_total*100):0}%</b></div><div class="m2-kpi"><span class="small">Boss Kills</span><b>${fmt(r.bosses_defeated)}</b></div><div class="m2-kpi"><span class="small">Streak</span><b>${r.streak||0}</b></div><div class="m2-kpi"><span class="small">Playtime</span><b>${playtimeText(r.play_seconds)}</b></div></div><div class="m2-row"><div><b>💎 Rarest</b></div><span>${escapeHtml(r.rarest_squishy||'Unknown')}</span></div></div>`;
  }
  function showPublicProfile(key){
    const r=profileRowsCache.find(x=>x.player_key===key);if(!r)return;
    openHub(`👤 ${escapeHtml(r.display_name)}`,publicProfileHtml(r));
  }
  async function showLeaderboards2(cat='coins'){
    openHub('🏆 Leaderboards','<div class="card">Loading rankings…</div>');
    try{
      const rows=await loadProfileRows(),def=LB[cat]||LB.coins,sorted=[...rows].sort((a,b)=>def.metric(b)-def.metric(a)).slice(0,50);
      const tabs=Object.entries(LB).map(([k,d])=>`<button class="btn ${k===cat?'gold':''}" data-m2-lb="${k}">${d.label}</button>`).join('');
      const list=sorted.map((r,i)=>`<div class="m2-rank"><b>#${i+1}</b><div><b>${escapeHtml(r.display_name)}</b> ${titleHtml(r.selected_title||'')}<div class="small">${r.clan_name?`[${escapeHtml(r.clan_name)}] · `:''}World ${r.world||1}</div></div><div style="text-align:right"><span class="reward">${def.fmt(def.metric(r))}</span><br><button class="btn" data-m2-profile="${escapeHtml(r.player_key)}">Profile</button></div></div>`).join('');
      openHub('🏆 Leaderboards',`<div class="m2-tabs">${tabs}</div>${list||'<div class="card">No players yet.</div>'}`);
      document.querySelectorAll('[data-m2-lb]').forEach(b=>b.onclick=()=>showLeaderboards2(b.dataset.m2Lb));
      document.querySelectorAll('[data-m2-profile]').forEach(b=>b.onclick=()=>showPublicProfile(b.dataset.m2Profile));
    }catch(e){openHub('🏆 Leaderboards',`<div class="notice">Could not load rankings.</div><div class="small">${escapeHtml(e.message||String(e))}</div>`)}
  }

  async function syncProfile2(){
    if(playerName()==='Player')return;
    try{
      const standard=uniqueRarities().filter(r=>!r.ownerOnly&&!r.eventOnly&&!r.streakOnly&&!r.bossOnly),total=standard.length,count=standard.filter(r=>state.owned.includes(r.name)).length,clan=clanCache.clan?.name||null;
      await api(`needoh_players?player_key=eq.${encodeURIComponent(pkey())}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({
        world:Math.max(1,Math.min(6,Number(state.world)||1)),
        selected_title:titleText(),prestige_count:Number(prestigeObj().count)||0,shiny_count:shinyCount(),
        collection_count:count,collection_total:total,global_boss_damage:Number(state.mega?.totalGlobalDamage)||0,
        trades_completed:m2().tradesCompleted,play_seconds:Math.floor(m2().playSeconds),rarest_squishy:rarestOwned(),
        streak:m2().streak,clan_name:clan,updated_at:new Date().toISOString()
      })});
    }catch(e){}
  }

  function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function exactCoinReward(amount){amount=Math.max(0,Number(amount)||0);state.coins+=amount;state.totalCoinsEarned=(Number(state.totalCoinsEarned)||0)+amount}
  function grantLocalSquishy(name){
    if(!name)return;
    if(state.owned.includes(name)){
      if(window.__needohRecordDuplicate&&!String(name).startsWith('Shiny '))window.__needohRecordDuplicate(name);
    }else{state.owned.push(name);state.selected=name}
    save(true);render();
  }
  async function claimDailyStreak(silent=false){
    if(playerName()==='Player')return;
    try{
      const rows=await api('rpc/needoh_claim_streak',{method:'POST',body:JSON.stringify({p_player_key:pkey(),p_display_name:playerName()})}),r=rows?.[0];
      if(!r)return;
      m2().streak=Number(r.out_streak)||0;m2().bestStreak=Number(r.out_best_streak)||0;
      if(r.out_claimed&&m2().lastStreakRewardDate!==todayKey()){
        m2().lastStreakRewardDate=todayKey();
        const streak=m2().streak,base=Math.max(5000,Math.min(1e24,currentPower()*50));addCoins(base);
        let extra=`🪙 ${fmt(base)}`;
        if(streak===3){state.mega.boosts.coin2=(Number(state.mega.boosts.coin2)||0)+1;extra+=' + 2× Coin Boost'}
        if(streak===7){state.mega.eggInventory.basic=(Number(state.mega.eggInventory.basic)||0)+1;extra+=' + Basic Egg'}
        if(streak===14){grantLocalSquishy('Streak Star');extra+=' + 🌟 Streak Star'}
        if(streak===30){grantLocalSquishy('Streak Crown');extra+=' + 🔥 Streak Crown';celebrate('shiny','30-DAY STREAK')}
        save(true);render();if(!silent)toast(`🔥 Day ${streak} streak! ${extra}`);
      }
      save(true);syncProfile2();
    }catch(e){if(!silent)toast('Could not check login streak')}
  }
  async function showStreak(){
    await claimDailyStreak(true);
    openHub('🔥 Login Streak',`<div class="notice">Come back each day. Missing a day resets the current streak to 1, but your best streak stays saved.</div><div class="m2-profile"><div class="m2-kpi"><span class="small">Current</span><b>${m2().streak}</b></div><div class="m2-kpi"><span class="small">Best</span><b>${m2().bestStreak}</b></div><div class="m2-kpi"><span class="small">Day 14</span><b>🌟</b></div><div class="m2-kpi"><span class="small">Day 30</span><b>🔥</b></div></div><div class="m2-row"><div><b>Day 3</b><div class="small">2× Coin Boost</div></div><span>🎒</span></div><div class="m2-row"><div><b>Day 7</b><div class="small">Basic Egg</div></div><span>🥚</span></div><div class="m2-row"><div><b>Day 14</b><div class="small">Limited Streak Star Squishy</div></div><span>🌟</span></div><div class="m2-row"><div><b>Day 30</b><div class="small">Exclusive Streak Crown Squishy</div></div><span>🔥</span></div>`);
  }

  function liveEventActive(){
    const e=window.__needohEvents;if(!e?.active)return false;
    return ['luck_rush','boss_damage','box_frenzy','secret_rush'].some(x=>{try{return e.active(x)}catch(_){return false}});
  }
  const EVENT_BOXES={
    summer:{name:'Summer Box',icon:'☀️',base:1e9,item:'Summer Splash',months:[5,6,7]},
    halloween:{name:'Halloween Box',icon:'🎃',base:1e12,item:'Pumpkin Goo',months:[9]},
    holiday:{name:'Holiday Box',icon:'🎄',base:1e15,item:'Frostbite',months:[11]},
    glitch:{name:'Glitched Box',icon:'👾',base:1e24,item:'Glitch Cube',unlock:()=>!!state.world6Unlocked},
    attila:{name:'Attila Event Box',icon:'👑',base:1e18,item:'Royal Gold',unlock:()=>ownerAuthorized()||liveEventActive()}
  };
  function eventBoxAvailable(b){return (!b.months||b.months.includes(new Date().getMonth()))&&(!b.unlock||b.unlock())}
  function eventBoxPrice(b){return Math.max(1,Math.floor(b.base*Math.max(.6,1-.05*skillLevel('boxes'))))}
  function openEventBox(id){
    const b=EVENT_BOXES[id];if(!b||!eventBoxAvailable(b))return toast('That event box is not available');
    const cost=eventBoxPrice(b);if(Number(state.coins)<cost)return toast('Not enough coins!');
    state.coins-=cost;m2().eventBoxesOpened++;
    const exclusiveChance=Math.min(.7,.25+.03*skillLevel('boxes'));
    const roll=Math.random();
    if(roll<exclusiveChance){
      grantLocalSquishy(b.item);celebrate('shiny',`${b.item} PULLED!`);
      if(Math.random()<Math.min(.65,.08*skillLevel('collector'))&&window.__needohRecordDuplicate){
        const pool=(availableBoxPool?.()||[]).filter(r=>r&&!r.limited&&!r.ownerOnly&&!r.bossOnly&&!r.shiny);
        if(pool.length)window.__needohRecordDuplicate(pool[Math.floor(Math.random()*pool.length)].name);
      }
    }else if(roll<.82){
      const reward=Math.floor(cost*(.5+Math.random()*2.2));addCoins(reward);toast(`${b.icon} ${fmt(reward)} coins!`);
    }else{
      const keys=['coin2','luck5','boss3'];const k=keys[Math.floor(Math.random()*keys.length)];
      state.mega.boosts[k]=(Number(state.mega.boosts[k])||0)+1;toast(`${b.icon} Boost added to inventory!`);
    }
    save(true);render();showEventBoxes();
  }
  function showEventBoxes(){
    const entries=Object.entries(EVENT_BOXES),cards=entries.map(([id,b])=>{const av=eventBoxAvailable(b),price=eventBoxPrice(b);return `<div class="m2-card" style="${av?'':'opacity:.45'}"><div style="font-size:42px">${b.icon}</div><h3>${b.name}</h3><p>${av?`Exclusive: ${escapeHtml(b.item)}`:'Not active right now'}</p><div class="reward">🪙 ${fmt(price)}</div><button class="btn gold" data-m2-eventbox="${id}" ${av&&state.coins>=price?'':'disabled'}>OPEN</button></div>`}).join('');
    openHub('🎰 Limited-Time Event Boxes',`<div class="notice">Seasonal boxes rotate through the year. Glitched Box unlocks with World 6. Attila Event Box appears during global events. Event-exclusive squishies cannot be traded or listed.</div><div class="m2-grid">${cards}</div><div class="small" style="margin-top:10px">Event boxes opened: ${m2().eventBoxesOpened}</div>`);
    document.querySelectorAll('[data-m2-eventbox]').forEach(b=>b.onclick=()=>openEventBox(b.dataset.m2Eventbox));
  }

  function marketTradeable(name){
    const r=allRarities().find(x=>x.name===name);
    return !!(r&&!r.limited&&!r.ownerOnly&&!r.bossOnly&&!r.eventOnly&&!r.streakOnly&&name!=='ATTILA'&&name!=='Admin');
  }
  async function claimMarketPayouts(silent=true){
    if(playerName()==='Player')return;
    try{
      const rows=await api(`needoh_market_payouts?select=id,amount&seller_key=eq.${encodeURIComponent(pkey())}&claimed=eq.false&order=created_at.asc`);
      for(const r of rows||[]){
        const amt=Number(r.amount)||0;exactCoinReward(amt);m2().marketPayouts+=amt;m2().tradesCompleted++;
        await api(`needoh_market_payouts?id=eq.${encodeURIComponent(r.id)}&seller_key=eq.${encodeURIComponent(pkey())}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({claimed:true,claimed_at:new Date().toISOString()})});
        if(!silent)toast(`💰 Marketplace sale paid ${fmt(amt)} coins`);
      }
      if(rows?.length){save(true);render();syncProfile2()}
    }catch(e){}
  }
  async function createListing(){
    const name=$('m2MarketItem')?.value,price=Math.floor(Number($('m2MarketPrice')?.value)||0),copies=Number(state.mega?.copies?.[name])||0;
    if(!marketTradeable(name)||copies<1)return toast('You need a duplicate copy to list');
    if(price<1)return toast('Enter a valid price');
    state.mega.copies[name]=copies-1;save(true);
    try{
      await api('needoh_marketplace',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{seller_key:pkey(),seller_name:playerName(),item_name:name,price,status:'open'}])});
      toast(`🛒 Listed ${name}`);showMarketplace();
    }catch(e){state.mega.copies[name]=copies;save(true);toast('Could not create listing')}
  }
  async function cancelListing(id){
    try{
      const rows=await api(`needoh_marketplace?select=item_name&id=eq.${encodeURIComponent(id)}&seller_key=eq.${encodeURIComponent(pkey())}&status=eq.open&limit=1`),r=rows?.[0];
      if(!r)return toast('Listing is no longer open');
      const out=await api(`needoh_marketplace?id=eq.${encodeURIComponent(id)}&seller_key=eq.${encodeURIComponent(pkey())}&status=eq.open`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:'cancelled',updated_at:new Date().toISOString()})});
      if(!out?.length)return toast('Could not cancel listing');
      state.mega.copies[r.item_name]=(Number(state.mega.copies[r.item_name])||0)+1;save(true);toast('Listing cancelled — duplicate returned');showMarketplace();
    }catch(e){toast('Could not cancel listing')}
  }
  async function buyListing(id,price){
    price=Number(price)||0;if(state.coins<price)return toast('Not enough coins');
    try{
      const out=await api('rpc/needoh_buy_market_listing',{method:'POST',body:JSON.stringify({p_listing_id:id,p_buyer_key:pkey(),p_buyer_name:playerName()})}),r=out?.[0];
      if(!r)return toast('Someone already bought that listing');
      if(state.coins<Number(r.out_price))return toast('Your coin balance changed — refresh');
      state.coins-=Number(r.out_price);grantLocalSquishy(r.out_item_name);m2().tradesCompleted++;save(true);render();syncProfile2();toast(`🛒 Bought ${r.out_item_name}!`);showMarketplace();
    }catch(e){toast('Could not buy listing')}
  }
  async function showMarketplace(){
    openHub('🛒 Player Marketplace','<div class="card">Loading listings…</div>');
    try{
      await claimMarketPayouts(true);
      const rows=await api('needoh_marketplace?select=id,seller_key,seller_name,item_name,price,status,created_at&status=eq.open&order=created_at.desc&limit=150')||[];
      const copies=state.mega?.copies||{},mine=Object.keys(copies).filter(n=>marketTradeable(n)&&Number(copies[n])>0);
      const opts=mine.map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)} — ${copies[n]} duplicate${copies[n]===1?'':'s'}</option>`).join('');
      const list=rows.map(r=>{const own=r.seller_key===pkey();return `<div class="m2-row"><div><b>${escapeHtml(r.item_name)}</b><div class="small">Seller: ${escapeHtml(r.seller_name)}</div><span class="reward">🪙 ${fmt(r.price)}</span></div>${own?`<button class="btn danger" data-m2-cancel-list="${r.id}">Cancel</button>`:`<button class="btn gold" data-m2-buy-list="${r.id}" data-price="${r.price}" ${state.coins>=Number(r.price)?'':'disabled'}>BUY</button>`}</div>`}).join('');
      openHub('🛒 Player Marketplace',`<div class="notice">Marketplace uses duplicate copies so your equipped/owned original stays safe. ATTILA, Admin, limited, season, streak, event and boss rewards cannot be listed.</div><div class="card"><h3>Sell a Duplicate</h3><select class="field" id="m2MarketItem">${opts||'<option value="">No tradeable duplicates</option>'}</select><input class="field" id="m2MarketPrice" type="number" min="1" value="1000000" placeholder="Price"><button class="btn gold" id="m2CreateListing" ${mine.length?'':'disabled'}>🛒 LIST FOR SALE</button></div><h3>Open Listings</h3>${list||'<div class="card">No listings right now.</div>'}`);
      $('m2CreateListing').onclick=createListing;
      document.querySelectorAll('[data-m2-cancel-list]').forEach(b=>b.onclick=()=>cancelListing(b.dataset.m2CancelList));
      document.querySelectorAll('[data-m2-buy-list]').forEach(b=>b.onclick=()=>buyListing(b.dataset.m2BuyList,b.dataset.price));
    }catch(e){openHub('🛒 Player Marketplace',`<div class="notice">Marketplace could not connect.</div><div class="small">${escapeHtml(e.message||String(e))}</div>`)}
  }

  function weekKeyDate(){
    const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  let clanCache={at:0,member:null,clan:null};
  async function getClan(force=false){
    if(!force&&Date.now()-clanCache.at<15000)return clanCache;
    clanCache={at:Date.now(),member:null,clan:null};
    if(playerName()==='Player')return clanCache;
    try{
      const ms=await api(`needoh_clan_members?select=player_key,clan_id,display_name,member_role&player_key=eq.${encodeURIComponent(pkey())}&limit=1`),m=ms?.[0];
      if(m){const cs=await api(`needoh_clans?select=id,name,tag,owner_key,owner_name&id=eq.${encodeURIComponent(m.clan_id)}&limit=1`);clanCache.member=m;clanCache.clan=cs?.[0]||null}
    }catch(e){}
    return clanCache;
  }
  async function createClan(){
    const name=String($('m2ClanName')?.value||'').trim().slice(0,24),tag=String($('m2ClanTag')?.value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,5);
    if(name.length<3||tag.length<2)return toast('Clan name needs 3+ characters and tag needs 2–5');
    if((await getClan(true)).member)return toast('Leave your current clan first');
    try{
      const rows=await api('needoh_clans',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify([{name,tag,owner_key:pkey(),owner_name:playerName()}])}),c=rows?.[0];
      if(!c)throw new Error('Clan not created');
      await api('needoh_clan_members',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{player_key:pkey(),clan_id:c.id,display_name:playerName(),member_role:'owner'}])});
      clanCache.at=0;toast(`👥 Clan ${name} created!`);showClans();
    }catch(e){toast('Clan name or tag may already be taken')}
  }
  async function joinClan(id){
    if((await getClan(true)).member)return toast('You are already in a clan');
    try{
      await api('needoh_clan_members',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{player_key:pkey(),clan_id:id,display_name:playerName(),member_role:'member'}])});
      clanCache.at=0;toast('👥 Joined clan!');showClans();
    }catch(e){toast('Could not join clan')}
  }
  async function leaveClan(){
    const c=await getClan(true);if(!c.member)return;
    if(c.member.member_role==='owner')return toast('Clan owner cannot leave yet');
    try{await api(`needoh_clan_members?player_key=eq.${encodeURIComponent(pkey())}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});clanCache.at=0;toast('Left clan');showClans()}catch(e){toast('Could not leave clan')}
  }
  function localWeeklyClanScore(){
    const b=state.mega?.week?.base||{},ds=Math.max(0,(Number(state.squishes)||0)-(Number(b.squishes)||0)),db=Math.max(0,(Number(state.boxesOpened)||0)-(Number(b.boxes)||0)),dk=Math.max(0,(Number(state.bossesDefeated)||0)-(Number(b.bosses)||0)),dg=Math.max(0,(Number(state.mega?.totalGlobalDamage)||0)-(Number(b.global)||0));
    return Math.floor(ds+db*100+dk*1000+Math.log10(1+dg)*1000);
  }
  async function syncClanScore(){
    const c=await getClan();if(!c.member||!c.clan)return;
    try{await api('needoh_clan_scores?on_conflict=clan_id,player_key,week_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify([{clan_id:c.clan.id,player_key:pkey(),display_name:playerName(),week_key:weekKeyDate(),score:localWeeklyClanScore(),updated_at:new Date().toISOString()}])})}catch(e){}
  }
  function grantClanBossRewardIfNeeded(defeated){
    const wk=weekKeyDate();if(!defeated||m2().clanBossClaims[wk])return false;
    m2().clanBossClaims[wk]=true;
    state.mega.eggInventory.cosmic=(Number(state.mega.eggInventory.cosmic)||0)+1;
    state.mega.boosts.coin2=(Number(state.mega.boosts.coin2)||0)+1;
    save(true);render();toast('🏆 Clan Boss reward: Cosmic Egg + 2× Coin Boost');return true;
  }
  async function hitClanBoss(){
    const c=await getClan(true);if(!c.clan)return toast('Join a clan first');
    const damage=Math.max(1,Math.min(1e6,Math.floor(Math.log10(currentPower()+10)*20000*(1+.35*skillLevel('boss')))));
    try{
      const rows=await api('rpc/needoh_hit_clan_boss',{method:'POST',body:JSON.stringify({p_clan_id:c.clan.id,p_week_key:weekKeyDate(),p_damage:damage})}),r=rows?.[0];
      if(!r)return toast('Could not hit clan boss');
      toast(`⚔️ Clan Boss -${fmt(damage)} HP`);
      if(r.out_defeated){const fresh=grantClanBossRewardIfNeeded(true);if(fresh)celebrate('boss','CLAN BOSS DEFEATED!')}
      showClans();
    }catch(e){toast('Could not hit clan boss')}
  }
  async function clanRankingData(){
    const [scores,clans]=await Promise.all([api(`needoh_clan_scores?select=clan_id,score&week_key=eq.${weekKeyDate()}&limit=1000`),api('needoh_clans?select=id,name,tag&limit=300')]);
    const sums=new Map();for(const s of scores||[])sums.set(s.clan_id,(sums.get(s.clan_id)||0)+(Number(s.score)||0));
    return [...(clans||[])].map(c=>({...c,score:sums.get(c.id)||0})).sort((a,b)=>b.score-a.score);
  }
  async function showClans(){
    openHub('👥 Squishy Clans','<div class="card">Loading clans…</div>');
    try{
      const c=await getClan(true),rank=await clanRankingData();
      if(!c.member||!c.clan){
        const all=await api('needoh_clans?select=id,name,tag,owner_name,created_at&order=created_at.asc&limit=100')||[];
        const list=all.map(x=>`<div class="m2-row"><div><b>[${escapeHtml(x.tag)}] ${escapeHtml(x.name)}</b><div class="small">Owner: ${escapeHtml(x.owner_name)}</div></div><button class="btn gold" data-m2-join-clan="${x.id}">JOIN</button></div>`).join('');
        openHub('👥 Squishy Clans',`<div class="notice">Join a team, build weekly Clan Points, fight a shared Clan Boss and climb the clan rankings.</div><div class="card"><h3>Create Clan</h3><input class="field" id="m2ClanName" maxlength="24" placeholder="Clan name"><input class="field" id="m2ClanTag" maxlength="5" placeholder="TAG"><button class="btn gold" id="m2CreateClan">CREATE CLAN</button></div><h3>Join a Clan</h3>${list||'<div class="card">No clans yet — create the first one.</div>'}`);
        $('m2CreateClan').onclick=createClan;document.querySelectorAll('[data-m2-join-clan]').forEach(b=>b.onclick=()=>joinClan(b.dataset.m2JoinClan));return;
      }
      await syncClanScore();
      const [members,scores,bossRows]=await Promise.all([
        api(`needoh_clan_members?select=player_key,display_name,member_role&clan_id=eq.${encodeURIComponent(c.clan.id)}&limit=200`),
        api(`needoh_clan_scores?select=player_key,display_name,score&clan_id=eq.${encodeURIComponent(c.clan.id)}&week_key=eq.${weekKeyDate()}&order=score.desc&limit=200`),
        api(`needoh_clan_boss?select=hp,max_hp,defeated&clan_id=eq.${encodeURIComponent(c.clan.id)}&week_key=eq.${weekKeyDate()}&limit=1`)
      ]);
      const boss=bossRows?.[0]||{hp:1e8,max_hp:1e8,defeated:false};grantClanBossRewardIfNeeded(!!boss.defeated);const pct=Math.max(0,Math.min(100,(Number(boss.hp)||0)/(Number(boss.max_hp)||1)*100));
      const memberRows=(scores||[]).map((s,i)=>`<div class="m2-rank"><b>#${i+1}</b><div><b>${escapeHtml(s.display_name)}</b></div><span class="reward">${fmt(s.score)} pts</span></div>`).join('');
      const rankRows=rank.slice(0,10).map((x,i)=>`<div class="m2-rank"><b>#${i+1}</b><div><b>[${escapeHtml(x.tag)}] ${escapeHtml(x.name)}</b></div><span class="reward">${fmt(x.score)} pts</span></div>`).join('');
      openHub(`👥 [${escapeHtml(c.clan.tag)}] ${escapeHtml(c.clan.name)}`,`<div class="m2-profile"><div class="m2-kpi"><span class="small">Members</span><b>${members?.length||0}</b></div><div class="m2-kpi"><span class="small">Your Weekly</span><b>${fmt(localWeeklyClanScore())}</b></div><div class="m2-kpi"><span class="small">Clan Rank</span><b>#${Math.max(1,rank.findIndex(x=>x.id===c.clan.id)+1)}</b></div><div class="m2-kpi"><span class="small">Role</span><b>${escapeHtml(c.member.member_role)}</b></div></div><div class="m2-boss"><div style="font-size:55px">👾</div><h3>Weekly Clan Boss</h3><div class="m2-hp"><div style="width:${pct}%"></div></div><div>${fmt(boss.hp)} / ${fmt(boss.max_hp)} HP</div><button class="btn danger" id="m2HitClanBoss" ${boss.defeated?'disabled':''}>${boss.defeated?'🏆 DEFEATED':'⚔️ ATTACK'}</button>${boss.defeated?'<div class="small">Members receive a Cosmic Egg + 2× Coin Boost once per week.</div>':''}</div><h3>Clan Members</h3>${memberRows||'<div class="card">No scores yet.</div>'}<h3>Weekly Clan Rankings</h3>${rankRows}${c.member.member_role!=='owner'?'<button class="btn danger" id="m2LeaveClan">Leave Clan</button>':''}`);
      $('m2HitClanBoss').onclick=hitClanBoss;if($('m2LeaveClan'))$('m2LeaveClan').onclick=leaveClan;
    }catch(e){openHub('👥 Squishy Clans',`<div class="notice">Clans could not connect.</div><div class="small">${escapeHtml(e.message||String(e))}</div>`)}
  }

  let chatSending2=false,lastChatSend2=0;
  async function myMute2(){const rows=await api(`needoh_chat_mutes?select=muted_until,reason&target_key=eq.${encodeURIComponent(pkey())}&limit=1`),r=rows?.[0];return r&&Date.parse(r.muted_until)>Date.now()?r:null}
  async function sendMessage2(){
    if(chatSending2)return;const text=String($('messageText')?.value||'').trim().slice(0,300);if(!text)return;
    if(Date.now()-lastChatSend2<5000)return toast('⏳ Wait 5 seconds between messages');
    chatSending2=true;
    try{
      if(await myMute2())return toast('🔇 You are muted');
      const badge=ownerAuthorized()?'OWNER':isAdmin()?'TEMP ADMIN':'';
      await api('needoh_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{author:playerName(),author_key:pkey(),badge,title:titleText(),message_date:new Date().toISOString().slice(0,10),body:text}])});
      lastChatSend2=Date.now();toast('💬 Message sent');showMessages2();
    }catch(e){toast('Could not send message')}finally{chatSending2=false}
  }
  async function deleteChat2(id){if(!ownerAuthorized())return;try{await api(`needoh_messages?id=eq.${encodeURIComponent(id)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});showMessages2()}catch(e){toast('Could not delete message')}}
  async function muteChat2(key,name){if(!ownerAuthorized())return;const until=new Date(Date.now()+600000);try{await api('needoh_chat_mutes?on_conflict=target_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify([{target_key:key,target_name:name||key,muted_until:until.toISOString(),reason:'Muted by Attila',created_by:'Attila',updated_at:new Date().toISOString()}])});toast(`${name||key} muted 10m`);showMessages2()}catch(e){toast('Could not mute player')}}
  async function showMessages2(){
    openHub('💬 Global Chat','<div class="card">Loading chat…</div>');
    try{
      const [rows,mute]=await Promise.all([api('needoh_messages?select=id,author,author_key,badge,title,body,created_at&order=created_at.desc&limit=100'),myMute2()]);
      const cards=(rows||[]).map(x=>{
        const badge=x.badge==='OWNER'?'<span class="chat-badge owner">OWNER</span>':x.badge==='TEMP ADMIN'?'<span class="chat-badge temp">TEMP ADMIN</span>':'';
        const actions=ownerAuthorized()&&x.author_key&&x.author_key!=='attila'&&x.author_key!=='system'?`<div class="chat-actions"><button class="btn danger" data-m2-chat-del="${x.id}">Delete</button><button class="btn" data-m2-chat-mute="${escapeHtml(x.author_key)}" data-name="${escapeHtml(x.author)}">Mute 10m</button></div>`:ownerAuthorized()?`<div class="chat-actions"><button class="btn danger" data-m2-chat-del="${x.id}">Delete</button></div>`:'';
        return `<div class="message-card"><div class="chat-meta"><b>${x.author_key==='system'?'📢':'👤'} ${escapeHtml(x.author)}</b>${badge}${titleHtml(x.title||'')}<span>${new Date(x.created_at).toLocaleString()}</span></div><div class="message-text">${escapeHtml(x.body)}</div>${actions}</div>`;
      }).join('');
      openHub('💬 Global Chat',`${mute?`<div class="notice">🔇 Muted until ${new Date(mute.muted_until).toLocaleTimeString()}</div>`:''}<div class="notice">Titles now appear beside player names · 5-second anti-spam cooldown.</div><div class="message-form" style="grid-template-columns:1fr auto"><textarea class="field" id="messageText" maxlength="300" placeholder="Type a message..." ${mute?'disabled':''}></textarea><button class="btn primary" id="sendMessageBtn" ${mute?'disabled':''}>Send</button></div><div class="messages-list">${cards||'<div class="card">No messages yet.</div>'}</div>`);
      if(!mute)$('sendMessageBtn').onclick=sendMessage2;
      document.querySelectorAll('[data-m2-chat-del]').forEach(b=>b.onclick=()=>deleteChat2(b.dataset.m2ChatDel));
      document.querySelectorAll('[data-m2-chat-mute]').forEach(b=>b.onclick=()=>muteChat2(b.dataset.m2ChatMute,b.dataset.name));
    }catch(e){openHub('💬 Global Chat','<div class="notice">Chat could not connect.</div>')}
  }

  function standardIndexComplete(){
    const req=uniqueRarities().filter(r=>!r.ownerOnly&&!r.bossOnly&&!r.limited&&!r.eventOnly&&!r.streakOnly);
    return req.length>0&&req.every(r=>state.owned.includes(r.name));
  }

  const beforeOpenBoxM2=openBox;
  openBox=function(id){
    const beforeBoxes=Number(state.boxesOpened)||0,beforeOwned=new Set(state.owned||[]),v=beforeOpenBoxM2(id);
    if((Number(state.boxesOpened)||0)>beforeBoxes){
      const extraChance=Math.min(.02,.0005*skillLevel('shiny'));
      if(extraChance>0&&Math.random()<extraChance){
        setTimeout(()=>{
          const pool=(availableBoxPool?.()||[]).filter(r=>r&&!r.limited&&!r.ownerOnly&&!r.bossOnly&&!r.shiny);
          if(pool.length){const r=pool[Math.floor(Math.random()*pool.length)],name=`Shiny ${r.name}`;grantLocalSquishy(name);celebrate('shiny',`SHINY ${r.name}!`)}
        },3400);
      }
      setTimeout(()=>{
        const added=(state.owned||[]).filter(n=>!beforeOwned.has(n));
        const rare=added.find(n=>{const r=rarity(n);return r.shiny||r.limited||['Secret','Godly','Final Boss','Multiversal','Omniversal','Singularity'].includes(r.name)});
        if(rare)celebrate(rarity(rare).shiny?'shiny':'rare',`${rare} PULL!`);
      },3800);
    }
    return v;
  };

  const beforeSwitchWorldM2=switchWorld;
  switchWorld=function(){
    const prev=Number(state.world)||1,flags={2:!!state.world2Unlocked,3:!!state.world3Unlocked,4:!!state.world4Unlocked,5:!!state.world5Unlocked,6:!!state.world6Unlocked};
    const v=beforeSwitchWorldM2();
    setTimeout(()=>{
      const now=Number(state.world)||1,newUnlock=[2,3,4,5,6].find(w=>!flags[w]&&!!state[`world${w}Unlocked`]);
      if(newUnlock||now>prev)celebrate('world',`WORLD ${newUnlock||now} UNLOCKED!`);
    },80);
    return v;
  };
  $('worldBtn').onclick=switchWorld;

  function oldMegaAction(label){
    const old=window.__needohMegaUpdate;
    if(label==='evolution')old?.evolution?.();
    else if(label==='index')old?.index?.();
    else if(label==='quests')old?.quests?.();
    else if(label==='eggs')old?.eggs?.();
    else if(label==='boss')old?.boss?.();
    else if(label==='boosts')old?.boosts?.();
    else if(label==='trading')old?.trading?.();
  }
  function showMega2Hub(){
    const p=prestigeObj(),features=[
      ['🌳','Prestige + Skill Tree',`${Number(p.points)||0} PP · next Prestige ${fmt(prestigeThreshold2())}`,'prestige'],
      ['👤','Profiles + Titles','Playtime, collection %, rarest squishy, badges and selectable titles.','profile'],
      ['🏆','More Leaderboards','Coins, squishes, Prestige, Shinies, collection, boss damage and kills.','leader'],
      ['🔥','Login Streaks',`${m2().streak}-day current streak · exclusive Day 14 and Day 30 squishies.`,'streak'],
      ['🎨','Squishy Cosmetics','Crowns, halos, sunglasses, auras, lightning, stars and trails.','cosmetics'],
      ['🎰','Event Boxes','Seasonal and live-event boxes with exclusive squishies.','eventboxes'],
      ['🛒','Player Marketplace','List duplicate normal squishies for coins.','market'],
      ['👥','Clans','Weekly rankings, Clan Points and a shared Clan Boss.','clans'],
      ['🎬','Rare-Pull Effects','Screen shake, confetti, Shiny effects, world unlocks and boss celebrations.','effects'],
      ['🧬','Evolution + Index','Open the existing Evolution or Pokédex systems.','evolution'],
      ['🥚','Eggs + Quests','Open existing Eggs or Daily/Weekly Quest systems.','eggs'],
      ['🌐','Global Boss + Boosts','Fight the Rift Colossus or manage boost inventory.','boss'],
      ['💱','Direct Trading','Squishy-for-squishy direct offers.','trading']
    ];
    const html=features.map(([i,n,d,a])=>`<div class="m2-card"><div style="font-size:30px">${i}</div><h3>${n}</h3><p>${d}</p><button class="btn gold" data-m2-open="${a}">OPEN</button></div>`).join('');
    openHub('🚀 Needoh Mega+ Expansion',`<div class="notice">The new social/competitive systems are layered on top of your existing save. Prestige is easier to start but scales harder every time.</div><div class="m2-grid">${html}</div>`);
    document.querySelectorAll('[data-m2-open]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.m2Open;
      if(a==='prestige')showPrestigeTree();else if(a==='profile')showProfile2();else if(a==='leader')showLeaderboards2();else if(a==='streak')showStreak();else if(a==='cosmetics')showCosmetics();else if(a==='eventboxes')showEventBoxes();else if(a==='market')showMarketplace();else if(a==='clans')showClans();else if(a==='effects')celebrate('rare','MEGA EFFECTS READY!');else oldMegaAction(a);
    });
  }

  let lastBossKills=Number(state.bossesDefeated)||0;
  function postRenderChecks(){
    applyCosmetic();
    if(!m2().indexCelebrated&&standardIndexComplete()){m2().indexCelebrated=true;save(true);celebrate('rare','STANDARD INDEX COMPLETE!')}
  }

  const beforeRenderM2=render;
  render=function(){
    const v=beforeRenderM2();ensureStyles();m2();postRenderChecks();return v;
  };

  function install(){
    ensureStyles();m2();
    if($('megaBtn')){$('megaBtn').textContent='🚀 Mega+';$('megaBtn').onclick=showMega2Hub}
    if($('profileBtn'))$('profileBtn').onclick=showProfile2;
    if($('leaderBtn')){$('leaderBtn').textContent='🏆 Leaderboards';$('leaderBtn').onclick=()=>showLeaderboards2()}
    if($('messagesBtn'))$('messagesBtn').onclick=showMessages2;
    showMessages=showMessages2;sendMessage=sendMessage2;
    if(window.__needohMegaUpdate){window.__needohMegaUpdate.show=showMega2Hub;window.__needohMegaUpdate.prestige=showPrestigeTree}
    render();
    setTimeout(()=>{getClan(true).then(()=>syncProfile2());claimDailyStreak(false);claimMarketPayouts(false)},900);
  }

  setInterval(()=>{if(document.visibilityState!=='hidden')m2().playSeconds++},1000);
  setInterval(()=>{
    if((Number(state.bossesDefeated)||0)>lastBossKills){lastBossKills=Number(state.bossesDefeated)||0;celebrate('boss','BOSS DEFEATED!')}
    postRenderChecks();
  },1500);
  setInterval(()=>{save(true);syncProfile2();claimMarketPayouts(true)},10000);
  setInterval(()=>{syncClanScore()},15000);
  setInterval(()=>{if(m2().lastStreakRewardDate!==todayKey())claimDailyStreak(true)},30000);

  window.__needohMegaExpansion2={
    show:showMega2Hub,profile:showProfile2,leaderboards:showLeaderboards2,streak:showStreak,cosmetics:showCosmetics,eventBoxes:showEventBoxes,marketplace:showMarketplace,clans:showClans,prestige:showPrestigeTree,celebrate
  };
  window.__needohMegaExpansion2Loaded=true;
  install();
})();