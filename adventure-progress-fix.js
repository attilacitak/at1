(() => {
  if (window.__needohAdventureProgressFixV2Loaded) return;

  const STORAGE_KEY='needohAdventureProgressFixV2';
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

  function readBackup(){
    try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return x&&typeof x==='object'?x:null}catch(_){return null}
  }

  function writeBackup(a){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({stage:a.stage,cleared:a.cleared,hp:a.hp}))}catch(_){}
  }

  function progress(){
    const a=sx().adventure,b=readBackup();
    let cleared=Math.max(0,Math.min(30,Number(a.cleared)||0));
    let stage=Math.max(1,Math.min(30,Number(a.stage)||1));
    let hp=Math.max(0,Number(a.hp)||0);
    if(b){
      cleared=Math.max(cleared,Math.max(0,Math.min(30,Number(b.cleared)||0)));
      stage=Math.max(stage,Math.max(1,Math.min(30,Number(b.stage)||1)));
      if(hp<=0&&stage===Number(b.stage)&&Number(b.hp)>0)hp=Number(b.hp)||0;
    }
    if(cleared<30&&stage<=cleared)stage=cleared+1;
    if(cleared>=30)stage=30;
    a.stage=stage;a.cleared=cleared;a.hp=hp;
    writeBackup(a);
    return a;
  }

  function maxHp(stage){return Math.round(220+stage*stage*42+(stage%5===0?stage*180:0))}

  function enemy(stage){
    const zone=stage<=10?'Meadow Rift':stage<=20?'Crystal Abyss':'Void Citadel';
    const bosses={5:'Goo Guardian',10:'Crystal Hydra',15:'Rift Warden',20:'Void Dragon',25:'Reality Breaker',30:'Final Architect'};
    return {zone,boss:stage%5===0,name:bosses[stage]||`Rift Creature ${stage}`};
  }

  function hitPower(){
    let mult=1;
    try{mult=Math.max(1,Number(rarity(state.selected)?.mult)||1)}catch(_){}
    const prestige=Math.max(0,Number(state.mega?.prestige?.count)||0);
    const base=Math.max(1,(Number(state.clickPower)||1)*(Number(state.baseMult)||1)*mult);
    return Math.max(25,Math.round(35+Math.log10(base+10)*18+prestige*12));
  }

  function addCoinsSafe(n){
    n=Math.max(0,Number(n)||0);
    try{if(typeof addCoins==='function')addCoins(n);else state.coins=(Number(state.coins)||0)+n}catch(_){state.coins=(Number(state.coins)||0)+n}
  }

  function unlockSpecial(name){
    if(!name||state.owned.includes(name))return;
    state.owned.push(name);
    state.selected=name;
    try{toast(`🗺️ ${name} unlocked!`)}catch(_){}
  }

  function reward(stage){
    const s=sx();
    let per=1;
    try{per=Math.max(1,(Number(state.clickPower)||1)*(Number(state.baseMult)||1)*(Number(rarity(state.selected)?.mult)||1)}catch(_){}
    const coins=Math.max(10000*stage*stage,per*stage*18);
    addCoinsSafe(coins);
    s.pass.xp=(Number(s.pass.xp)||0)+150;
    s.enchantShards+=(stage%5===0?5:1);
    if(stage%3===0)s.keys.bronze++;
    if(stage%5===0)s.keys.crystal++;
    if(stage%10===0)s.keys.cosmic++;
    if(stage===30)s.keys.void++;
    if(stage===10)unlockSpecial('Adventure Blob');
    if(stage===20)unlockSpecial('Rift Knight');
    if(stage===30)unlockSpecial('Void Emperor');
    return coins;
  }

  function saveAll(){
    const a=progress();writeBackup(a);
    try{save(true)}catch(_){}
    try{render()}catch(_){}
  }

  function attack(){
    const a=progress();
    const stage=Math.max(1,Math.min(30,Number(a.stage)||1));
    if(a.cleared>=30){a.stage=30;a.hp=0;writeBackup(a);saveAll();return show()}
    if(!a.hp||a.hp<=0)a.hp=maxHp(stage);
    a.hp=Math.max(0,a.hp-hitPower());

    if(a.hp<=0){
      const coins=reward(stage);
      a.cleared=Math.max(Number(a.cleared)||0,stage);
      if(stage<30){
        a.stage=stage+1;
        a.hp=maxHp(a.stage);
        writeBackup(a);
        saveAll();
        try{toast(`🗺️ Stage ${stage} cleared! Stage ${a.stage} unlocked! +${fmt(coins)} coins`)}catch(_){}
      }else{
        a.stage=30;a.hp=0;writeBackup(a);saveAll();
        try{toast('🏆 Adventure Mode completed!')}catch(_){}
      }
    }else{
      writeBackup(a);
      saveAll();
    }
    show();
  }

  function selectStage(n){
    const a=progress();n=Math.max(1,Math.min(30,Number(n)||1));
    if(n>Math.min(30,(Number(a.cleared)||0)+1))return;
    a.stage=n;a.hp=maxHp(n);writeBackup(a);saveAll();show();
  }

  function show(){
    if(drawing)return;
    drawing=true;
    try{
      const a=progress();
      let stage=Math.max(1,Math.min(30,Number(a.stage)||1));
      if(a.cleared<30&&stage<=a.cleared){stage=a.cleared+1;a.stage=stage;a.hp=maxHp(stage);writeBackup(a)}
      if(!a.hp&&a.cleared<30){a.hp=maxHp(stage);writeBackup(a)}
      const e=enemy(stage),max=maxHp(stage),pct=a.cleared>=30&&stage===30?0:Math.max(0,Math.min(100,(Number(a.hp)||0)/max*100));
      const map=Array.from({length:30},(_,i)=>i+1).map(n=>{const en=enemy(n),locked=n>Math.min(30,(Number(a.cleared)||0)+1),cleared=n<=Number(a.cleared)||0,current=n===stage&&!locked;return `<button class="sx-stage ${locked?'locked':''} ${en.boss?'boss':''}" data-advfix-stage="${n}" ${locked?'disabled':''}><b>${en.boss?'👹':'🫧'} ${n}</b><span class="small">${cleared?'✅':current?'⚔️':''}</span></button>`}).join('');
      const complete=a.cleared>=30;
      openHub('🗺️ Adventure Mode',`<div id="advFixRoot"><div class="notice">30 stages total. Beat a stage to immediately unlock the next one. Progress is saved separately so it cannot fall back to Stage 1.</div><div class="sx-card" style="text-align:center"><h2>${complete?'🏆 Adventure Complete':`${e.boss?'👹':'🫧'} ${escapeHtml(e.name)}`}</h2><div class="sx-tag">${e.zone} · Stage ${stage}</div>${complete?'<p>All 30 stages cleared.</p>':`<div class="sx-meter" style="margin:12px 0"><div style="width:${pct}%"></div></div><b>${fmt(a.hp)} / ${fmt(max)} HP</b><div class="small">Your hit: ~${fmt(hitPower())}</div><button class="btn danger" id="advFixAttack">⚔️ ATTACK</button>`}</div><h3>Adventure Map — ${a.cleared}/30 cleared</h3><div class="sx-map">${map}</div></div>`);
      const attackBtn=document.getElementById('advFixAttack');if(attackBtn)attackBtn.onclick=attack;
      document.querySelectorAll('[data-advfix-stage]').forEach(b=>b.onclick=()=>selectStage(Number(b.dataset.advfixStage)));
    }finally{setTimeout(()=>{drawing=false},20)}
  }

  function install(){
    progress();
    if(window.__needohSeasonAdventure)window.__needohSeasonAdventure.adventure=show;
    const title=String(document.getElementById('hubTitle')?.textContent||'');
    if(title==='🗺️ Adventure Mode'&&!document.getElementById('advFixRoot'))setTimeout(show,0);
  }

  const observer=new MutationObserver(install);
  observer.observe(document.body,{childList:true,subtree:true});
  setInterval(install,500);
  install();
  window.__needohAdventureProgressFixLoaded=true;
  window.__needohAdventureProgressFixV2Loaded=true;
})();