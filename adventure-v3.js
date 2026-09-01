(() => {
  if (window.__needohAdventureV3Loaded) return;

  const STORE='needohAdventureV3';
  const OLD_STORES=['needohAdventureFinalV1','needohAdventureProgressFixV2','needohAdventureProgressFixV1'];
  let drawing=false;

  function sx(){
    state.seasonX=state.seasonX&&typeof state.seasonX==='object'?state.seasonX:{};
    const s=state.seasonX;
    s.adventure=s.adventure&&typeof s.adventure==='object'?s.adventure:{stage:1,cleared:0,hp:0};
    s.keys={bronze:0,crystal:0,cosmic:0,void:0,...(s.keys||{})};
    s.enchantShards=Number(s.enchantShards)||0;
    s.pass=s.pass&&typeof s.pass==='object'?s.pass:{};
    s.pass.xp=Number(s.pass.xp)||0;
    return s;
  }

  function clampStage(n){return Math.max(1,Math.min(30,Math.floor(Number(n)||1)))}
  function clampCleared(n){return Math.max(0,Math.min(30,Math.floor(Number(n)||0)))}

  function readStore(key){
    try{const x=JSON.parse(localStorage.getItem(key)||'null');return x&&typeof x==='object'?x:null}catch(_){return null}
  }

  function write(p){
    try{localStorage.setItem(STORE,JSON.stringify({stage:clampStage(p.stage),cleared:clampCleared(p.cleared),hp:Math.max(0,Number(p.hp)||0)}))}catch(_){}
  }

  function progress(){
    const a=sx().adventure;
    let stage=clampStage(a.stage),cleared=clampCleared(a.cleared),hp=Math.max(0,Number(a.hp)||0);
    const sources=[readStore(STORE),...OLD_STORES.map(readStore)].filter(Boolean);
    for(const p of sources){
      cleared=Math.max(cleared,clampCleared(p.cleared));
      stage=Math.max(stage,clampStage(p.stage));
      if(clampStage(p.stage)===stage&&Number(p.hp)>0&&hp<=0)hp=Number(p.hp)||0;
    }
    if(cleared<30&&stage<=cleared)stage=cleared+1;
    if(cleared>=30){stage=30;hp=0}
    a.stage=stage;a.cleared=cleared;a.hp=hp;
    write(a);
    return a;
  }

  function maxHp(stage){return Math.round(220+stage*stage*42+(stage%5===0?stage*180:0))}
  function enemy(stage){
    const zone=stage<=10?'Meadow Rift':stage<=20?'Crystal Abyss':'Void Citadel';
    const bosses={5:'Goo Guardian',10:'Crystal Hydra',15:'Rift Warden',20:'Void Dragon',25:'Reality Breaker',30:'Final Architect'};
    return {zone,boss:stage%5===0,name:bosses[stage]||`Rift Creature ${stage}`};
  }
  function power(){
    let mult=1;
    try{mult=Math.max(1,Number(rarity(state.selected)?.mult)||1)}catch(_){}
    const prestige=Math.max(0,Number(state.mega?.prestige?.count)||0);
    const base=Math.max(1,(Number(state.clickPower)||1)*(Number(state.baseMult)||1)*mult);
    return Math.max(25,Math.round(35+Math.log10(base+10)*18+prestige*12));
  }
  function rewardCoins(stage){
    let per=1;
    try{per=Math.max(1,(Number(state.clickPower)||1)*(Number(state.baseMult)||1)*(Number(rarity(state.selected)?.mult)||1)}catch(_){}
    return Math.max(10000*stage*stage,per*stage*18);
  }
  function addCoinsSafe(n){
    try{if(typeof addCoins==='function')addCoins(n);else state.coins=(Number(state.coins)||0)+n}catch(_){state.coins=(Number(state.coins)||0)+n}
  }
  function unlock(name){
    if(!name||state.owned.includes(name))return;
    state.owned.push(name);state.selected=name;
    try{toast(`🗺️ ${name} unlocked!`)}catch(_){}
  }
  function grantStageReward(stage){
    const s=sx(),coins=rewardCoins(stage);
    addCoinsSafe(coins);
    s.pass.xp=(Number(s.pass.xp)||0)+150;
    s.enchantShards+=(stage%5===0?5:1);
    if(stage%3===0)s.keys.bronze++;
    if(stage%5===0)s.keys.crystal++;
    if(stage%10===0)s.keys.cosmic++;
    if(stage===30)s.keys.void++;
    if(stage===10)unlock('Adventure Blob');
    if(stage===20)unlock('Rift Knight');
    if(stage===30)unlock('Void Emperor');
    return coins;
  }
  function persist(p){
    const a=sx().adventure;
    a.stage=clampStage(p.stage);a.cleared=clampCleared(p.cleared);a.hp=Math.max(0,Number(p.hp)||0);
    write(a);
    try{save(true)}catch(_){}
    try{render()}catch(_){}
  }

  function attack(){
    const p=progress();
    const stage=clampStage(p.stage);
    if(p.cleared>=30)return show();
    if(!Number.isFinite(Number(p.hp))||Number(p.hp)<=0)p.hp=maxHp(stage);
    p.hp=Math.max(0,Number(p.hp)-power());

    if(p.hp<=0){
      const cleared=Math.max(clampCleared(p.cleared),stage);
      const next=stage<30?stage+1:30;
      const nextHp=stage<30?maxHp(next):0;

      // Save progression BEFORE rewards/rendering so nothing can push us back to Stage 1.
      p.cleared=cleared;p.stage=next;p.hp=nextHp;
      persist(p);

      const coins=grantStageReward(stage);

      // Re-assert the same progression after rewards in case another wrapper rendered/saved.
      const live=sx().adventure;
      live.cleared=cleared;live.stage=next;live.hp=nextHp;
      persist(live);

      try{toast(stage<30?`🗺️ Stage ${stage} cleared! Stage ${next} unlocked! +${fmt(coins)} coins`:`🏆 Stage 30 cleared! Adventure complete!`)}catch(_){}
    }else{
      persist(p);
    }
    show();
  }

  function selectStage(n){
    const p=progress();n=clampStage(n);
    if(n>Math.min(30,clampCleared(p.cleared)+1))return;
    p.stage=n;p.hp=maxHp(n);persist(p);show();
  }

  function show(){
    if(drawing)return;
    drawing=true;
    try{
      const p=progress();
      let stage=clampStage(p.stage);
      if(p.cleared<30&&stage<=p.cleared){stage=p.cleared+1;p.stage=stage;p.hp=maxHp(stage);persist(p)}
      if(p.cleared<30&&(!Number.isFinite(Number(p.hp))||Number(p.hp)<=0)){p.hp=maxHp(stage);persist(p)}
      const e=enemy(stage),max=maxHp(stage),complete=p.cleared>=30,pct=complete?0:Math.max(0,Math.min(100,Number(p.hp)/max*100));
      const map=Array.from({length:30},(_,i)=>i+1).map(n=>{
        const en=enemy(n),locked=n>Math.min(30,p.cleared+1),cleared=n<=p.cleared,current=n===stage&&!locked;
        return `<button class="sx-stage ${locked?'locked':''} ${en.boss?'boss':''}" data-adv-v3-stage="${n}" ${locked?'disabled':''}><b>${en.boss?'👹':'🫧'} ${n}</b><span class="small">${cleared?'✅':current?'⚔️':''}</span></button>`;
      }).join('');
      openHub('🗺️ Adventure Mode',`<div id="advV3Root"><div class="notice"><b>Adventure Engine v3</b> · 30 stages. Stage completion is saved before rewards so the next stage cannot reset.</div><div class="sx-card" style="text-align:center"><h2>${complete?'🏆 Adventure Complete':`${e.boss?'👹':'🫧'} ${escapeHtml(e.name)}`}</h2><div class="sx-tag">${e.zone} · Stage ${stage}</div>${complete?'<p>All 30 stages cleared.</p>':`<div class="sx-meter" style="margin:12px 0"><div style="width:${pct}%"></div></div><b>${fmt(p.hp)} / ${fmt(max)} HP</b><div class="small">Your hit: ~${fmt(power())}</div><button class="btn danger" id="advV3Attack">⚔️ ATTACK</button>`}</div><h3>Adventure Map — ${p.cleared}/30 cleared</h3><div class="sx-map">${map}</div></div>`);
      const b=document.getElementById('advV3Attack');if(b)b.onclick=attack;
      document.querySelectorAll('[data-adv-v3-stage]').forEach(b=>b.onclick=()=>selectStage(Number(b.dataset.advV3Stage)));
    }finally{setTimeout(()=>{drawing=false},20)}
  }

  function hijack(){
    progress();
    if(window.__needohSeasonAdventure)window.__needohSeasonAdventure.adventure=show;
    document.querySelectorAll('[data-sx-open="Adventure Mode"]').forEach(btn=>{
      if(btn.dataset.advV3==='1')return;
      btn.dataset.advV3='1';
      btn.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();show()};
    });
    const title=String(document.getElementById('hubTitle')?.textContent||'');
    if(title==='🗺️ Adventure Mode'&&!document.getElementById('advV3Root'))setTimeout(show,0);
  }

  const obs=new MutationObserver(hijack);obs.observe(document.body,{childList:true,subtree:true});
  hijack();setInterval(hijack,250);
  window.__needohAdventureV3={show,attack,progress};
  window.__needohAdventureV3Loaded=true;
})();