(() => {
  const WORLD6_UNLOCK=1e25;
  const previousSwitchWorld=switchWorld;

  switchWorld=function(){
    if(Number(state.world)===5){
      if(!state.world6Unlocked){
        if(Number(state.coins)<WORLD6_UNLOCK)return toast(`Reach ${fmt(WORLD6_UNLOCK)} coins first!`);
        state.world6Unlocked=true;
        toast('🧪 World 6 unlocked!');
      }
      state.world=6;
      restock(true);
      if(typeof resetBossForWorld==='function')resetBossForWorld();
      render();
      save(true);
      return;
    }
    return previousSwitchWorld();
  };

  if(WORLD_META[5]){
    WORLD_META[5].threshold=WORLD6_UNLOCK;
    WORLD_META[5].next=6;
    WORLD_META[5].nextText='🧪 World 6';
    WORLD_META[5].info='Reach 10 septillion coins to breach the Glitched Dimension.';
  }

  const previousRender=render;
  render=function(){
    const result=previousRender();
    if(Number(state.world)===5){
      $('worldBtn').textContent=state.world6Unlocked?'🧪 Enter World 6':`🔒 🧪 World 6 — ${fmt(WORLD6_UNLOCK)} 🪙`;
      const pct=state.world6Unlocked?100:Math.min(100,(Number(state.coins)||0)/WORLD6_UNLOCK*100);
      $('worldProgress').style.width=pct+'%';
      $('progressText').textContent=state.world6Unlocked?'World 6 unlocked!':`${fmt(state.coins)} / ${fmt(WORLD6_UNLOCK)} coins to World 6`;
      $('worldInfo').textContent=WORLD_META[5].info;
    }
    return result;
  };

  $('worldBtn').onclick=switchWorld;
  render();
  window.__needohWorld6Balanced=true;
})();
