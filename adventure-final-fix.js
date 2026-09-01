(() => {
  if (window.__needohAdventureFinalLoaded) return;

  const STORE='needohAdventureFinalV1';
  let busy=false;

  function s(){
    state.seasonX=state.seasonX&&typeof state.seasonX==='object'?state.seasonX:{};
    state.seasonX.adventure=state.seasonX.adventure&&typeof state.seasonX.adventure==='object'?state.seasonX.adventure:{stage:1,cleared:0,hp:0};
    state.seasonX.keys={bronze:0,crystal:0,cosmic:0,void:0,...(state.seasonX.keys||{})};
    state.seasonX.enchantShards=Number(state.seasonX.enchantShards)||0;
    state.seasonX.pass=state.seasonX.pass&&typeof state.seasonX.pass==='object'?state.seasonX.pass:{};
    state.seasonX.pass.xp=Number(state.seasonX.pass.xp)||0;
    return state.seasonX;
  }

  function read(){
    try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch(_){return null}
  }

  function write(a){
    try{localStorage.setItem(STORE,JSON.stringify({stage:Number(a.stage)||1,cleared:Number(a.cleared)||0}))}catch(_){}
  }

  function normalize(){
    const a=s().adventure,b=read();
    let cleared=Math.max(0,Math.min(30,Number(a.cleared)||0));
    let stage=Math.max(1,Math.min(30,Number(a.stage)||1));
    if(b&&typeof b==='object'){
      cleared=Math.max(cleared,Math.max(0,Math.min(30,Number(b.cleared)||0)));
      stage=Math.max(stage,Math.max(1,Math.min(30,Number(b.stage)||1)));
    }
    if(cleared<30&&stage<=cleared)stage=cleared+1;
    if(cleared>=30)stage=30;
    a.cleared=cleared;a.stage=stage;
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
  function coinReward(stage){
    let per=1;
    try{per=Math.max(1,(Number(state.clickPower)||1)*(Number(state.baseMult)||1)*(Number(rarity(state.selected)?.mult)||1)}catch(_){}
    return Math.max(10000*stage*stage,per*stage*18);
  }
  function giveCoins(n){
    try{if(typeof addCoins==='function')addCoins(n);else state.coins=(Number(state.coins)||0)+n}catch(_){state.coins=(Number(state.coins)||0)+n}
  }
  function unlock(name){
    if(!name||state.owned.includes(name))return;
    state.owned.push(name);state.selected=name;
    try{toast(`🗺️ ${name} unlocked!`)}catch(_){}
  }
  function reward(stage){
    const x=s(),coins=coinReward(stage);
    giveCoins(coins);x.pass.xp=(Number(x.pass.xp)||0)+150;x.enchantShards+=(stage%5===0?5:1);
    if(stage%3===0)x.keys.bronze++;
    if(stage%5===0)x.keys.crystal++;
    if(stage%10===0)x.keys.cosmic++;
    if(stage===30)x.keys.void++;
    if(stage===10)unlock('Adventure Blob');
    if(stage===20)unlock('Rift Knight');
    if(stage===30)unlock('Void Emperor');
    return coins;
  }
  function persist(){
    const a=normalize();write(a);
    try{save(true)}catch(_){}
    try{render()}catch(_){}
  }

  function attack(){
    if(busy)return;busy=true;
    try{
      const a=normalize(),stage=Math.max(1,Math.min(30,Number(a.stage)||1));
      if(Number(a.cleared)>=30){a.stage=30;a.hp=0;persist();return show()}
      if(!Number.isFinite(Number(a.hp))||Number(a.hp)<=0)a.hp=maxHp(stage);
      a.hp=Math.max(0,Number(a.hp)-power());
      if(a.hp<=0){
        const coins=reward(stage);
        a.cleared=Math.max(Number(a.cleared)||0,stage);
        if(stage<30){
          a.stage=stage+1;
          a.hp=maxHp(a.stage);
          write(a);
          try{save(true)}catch(_){}
          try{render()}catch(_){}
          try{toast(`🗺️ Stage ${stage} cleared! Stage ${a.stage} unlocked! +${fmt(coins)} coins`)}catch(_){}
        }else{
          a.stage=30;a.hp=0;write(a);
          try{save(true)}catch(_){}
          try{render()}catch(_){}
          try{toast('🏆 Adventure Mode completed!')}catch(_){}
        }
      }else{
        write(a);
        try{save(true)}catch(_){}
        try{render()}catch(_){}
      }
      show();
    }finally{busy=false}
  }

  function select(n){
    const a=normalize();n=Math.max(1,Math.min(30,Number(n)||1));
    if(n>Math.min(30,(Number(a.cleared)||0)+1))return;
    a.stage=n;a.hp=maxHp(n);write(a);
    try{save(true)}catch(_){}
    show();
  }

  function show(){
    const a=normalize();
    let stage=Math.max(1,Math.min(30,Number(a.stage)||1));
    if(Number(a.cleared)<30&&stage<=Number(a.cleared)){stage=Number(a.cleared)+1;a.stage=stage;a.hp=maxHp(stage);write(a)}
    if(Number(a.cleared)<30&&(!Number.isFinite(Number(a.hp))||Number(a.hp)<=0)){a.hp=maxHp(stage);write(a)}
    const e=enemy(stage),max=maxHp(stage),complete=Number(a.cleared)>=30,pct=complete?0:Math.max(0,Math.min(100,Number(a.hp)/max*100));
    const map=Array.from({length:30},(_,i)=>i+1).map(n=>{const en=enemy(n),locked=n>Math.min(30,(Number(a.cleared)||0)+1),cleared=n<=Number(a.cleared),current=n===stage&&!locked;return `<button class="sx-stage ${locked?'locked':''} ${en.boss?'boss':''}" data-adv-final-stage="${n}" ${locked?'disabled':''}><b>${en.boss?'👹':'🫧'} ${n}</b><span class="small">${cleared?'✅':current?'⚔️':''}</span></button>`}).join('');
    openHub('🗺️ Adventure Mode',`<div id="advFinalRoot"><div class="notice">30 stages total. Stage completion now saves the next stage immediately.</div><div class="sx-card" style="text-align:center"><h2>${complete?'🏆 Adventure Complete':`${e.boss?'👹':'🫧'} ${escapeHtml(e.name)}`}</h2><div class="sx-tag">${e.zone} · Stage ${stage}</div>${complete?'<p>All 30 stages cleared.</p>':`<div class="sx-meter" style="margin:12px 0"><div style="width:${pct}%"></div></div><b>${fmt(a.hp)} / ${fmt(max)} HP</b><div class="small">Your hit: ~${fmt(power())}</div><button class="btn danger" id="advFinalAttack">⚔️ ATTACK</button>`}</div><h3>Adventure Map — ${a.cleared}/30 cleared</h3><div class="sx-map">${map}</div></div>`);
    const b=document.getElementById('advFinalAttack');if(b)b.onclick=attack;
    document.querySelectorAll('[data-adv-final-stage]').forEach(b=>b.onclick=()=>select(Number(b.dataset.advFinalStage)));
    persist();
  }

  function hijack(){
    if(window.__needohSeasonAdventure)window.__needohSeasonAdventure.adventure=show;
    const seasonBtn=document.querySelector('[data-sx-open="Adventure Mode"]');
    if(seasonBtn&&seasonBtn.dataset.advFinalHijacked!=='1'){
      seasonBtn.dataset.advFinalHijacked='1';
      seasonBtn.onclick=(e)=>{e.preventDefault();e.stopImmediatePropagation();show()};
    }
    const title=String(document.getElementById('hubTitle')?.textContent||'');
    if(title==='🗺️ Adventure Mode'&&!document.getElementById('advFinalRoot'))setTimeout(show,0);
  }

  const obs=new MutationObserver(hijack);obs.observe(document.body,{childList:true,subtree:true});
  normalize();hijack();setInterval(hijack,300);
  window.__needohAdventureFinalLoaded=true;
})();