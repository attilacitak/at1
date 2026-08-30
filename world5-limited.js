(() => {
  const WORLD5_UNLOCK=1e21;
  const LIMITED=[
    {name:'Rainbow',icon:'🌈',color:'linear-gradient(135deg,#ff5f6d,#ffc371,#6effc2,#6fa8ff,#d77cff)',glow:'#ffb8ff',shape:'45% 55% 42% 58% / 55% 43% 57% 45%',mult:5e10,chance:0,min:0,max:0,sound:720,limited:true},
    {name:'Thunder',icon:'⚡',color:'#ffe436',glow:'#fff37b',shape:'38% 62% 54% 46% / 43% 56% 44% 57%',mult:2e11,chance:0,min:0,max:0,sound:820,limited:true},
    {name:'Eclipse',icon:'🌑',color:'#24203f',glow:'#9e7bff',shape:'50%',mult:8e11,chance:0,min:0,max:0,sound:180,limited:true},
    {name:'Diamond',icon:'💎',color:'#7feeff',glow:'#d8fbff',shape:'22% 78% 25% 75% / 74% 24% 76% 26%',mult:3e12,chance:0,min:0,max:0,sound:940,limited:true},
    {name:'Admin',icon:'🛡️',color:'#ffbf38',glow:'#fff09c',shape:'30% 30% 55% 55% / 24% 24% 76% 76%',mult:1e13,chance:0,min:0,max:0,sound:1040,limited:true}
  ];
  const W5R=[
    {name:'Transcendent',icon:'🪐',color:'#5ae9ff',glow:'#5ae9ff',shape:'48% 52% 39% 61% / 61% 42% 58% 39%',mult:7.5e8,chance:72,min:1.5e21,max:2.4e21,sound:680},
    {name:'Celestial',icon:'🌠',color:'#c78cff',glow:'#e5c4ff',shape:'36% 64% 56% 44% / 45% 55% 45% 55%',mult:3e9,chance:24,min:6e21,max:9e21,sound:760},
    {name:'Omniversal',icon:'♾️',color:'#ff66d4',glow:'#ffb2ec',shape:'50% 35% 50% 35% / 35% 50% 35% 50%',mult:1.5e10,chance:4,min:3e22,max:5e22,sound:900}
  ];
  window.__needohLimitedRarities=LIMITED;
  window.__needohWorld5Rarities=W5R;
  const baseAllRarities=allRarities;
  allRarities=function(){return [...baseAllRarities(),...W5R,...LIMITED]};
  const baseWorldList=worldList;
  worldList=function(w=state.world){return Number(w)===5?W5R:baseWorldList(w)};
  const baseUnlocked=isWorldUnlocked;
  isWorldUnlocked=function(w){return Number(w)===5?!!state.world5Unlocked:baseUnlocked(w)};
  WORLD_META[4].threshold=WORLD5_UNLOCK;
  WORLD_META[4].next=5;
  WORLD_META[4].nextText='World 5';
  WORLD_META[4].info='Reach 1 sextillion coins to unlock the Celestial Nexus.';
  WORLD_META[5]={name:'🪐 World 5 — Celestial Nexus',next:1,nextText:'World 1',threshold:0,info:'The final celestial world — collect Transcendent, Celestial and Omniversal squishies.'};
  if(state.world5Unlocked==null)state.world5Unlocked=false;
  const baseSwitchWorld=switchWorld;
  switchWorld=function(){
    if(state.world===4){
      if(!state.world5Unlocked){
        if(state.coins<WORLD5_UNLOCK)return toast(`Reach ${fmt(WORLD5_UNLOCK)} coins first!`);
        state.world5Unlocked=true;toast('🪐 World 5 unlocked!');
      }
      state.world=5;restock(true);resetBossForWorld();render();save(true);return;
    }
    if(state.world===5){state.world=1;restock(true);resetBossForWorld();render();save(true);return}
    return baseSwitchWorld();
  };
  const baseBossStats=bossStatsForWorld;
  bossStatsForWorld=function(w){return Number(w)===5?{name:'Celestial Devourer',icon:'🐉',hp:2.5e21,reward:5e21}:baseBossStats(w)};
  const basePool=availableBoxPool;
  availableBoxPool=function(){const p=basePool();if(state.world5Unlocked)p.push(...W5R);return p};
  const baseRender=render;
  render=function(){
    const v=baseRender();
    if(state.world===4){
      $('worldBtn').textContent=state.world5Unlocked?'🪐 Enter World 5':`🔒 World 5 — ${fmt(WORLD5_UNLOCK)} 🪙`;
      const pct=state.world5Unlocked?100:Math.min(100,state.coins/WORLD5_UNLOCK*100);
      $('worldProgress').style.width=pct+'%';
      $('progressText').textContent=state.world5Unlocked?'World 5 unlocked!':`${fmt(state.coins)} / ${fmt(WORLD5_UNLOCK)} coins to World 5`;
    }else if(state.world===5){
      $('worldBtn').textContent='🌎 Return to World 1';
      $('worldProgress').style.width='100%';
      $('progressText').textContent='♾️ CELESTIAL ENDGAME — hunt limited squishies and dominate seasons!';
    }
    return v;
  };
  $('worldBtn').onclick=switchWorld;
  window.__needohWorld5Loaded=true;
})();