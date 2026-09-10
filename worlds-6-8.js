(() => {
  if (window.__needohWorlds678Loaded) return;
  window.__needohWorlds678Loaded = true;

  const W6_UNLOCK = 1e25;
  const W7_UNLOCK = 1e29;
  const W8_UNLOCK = 1e33;

  const W6 = [
    {name:'Glitched',icon:'👾',color:'linear-gradient(135deg,#31ff9a,#10131d,#9b5cff)',glow:'#31ff9a',shape:'35% 65% 57% 43% / 63% 35% 65% 37%',mult:7e10,chance:48,min:1e25,max:2e25,sound:440},
    {name:'Corrupted',icon:'☣️',color:'linear-gradient(135deg,#ff365d,#130b19,#8c2cff)',glow:'#ff365d',shape:'68% 32% 41% 59% / 31% 67% 33% 69%',mult:3e11,chance:26,min:4e25,max:8e25,sound:130},
    {name:'Hacker',icon:'💻',color:'linear-gradient(135deg,#00ff8c,#052d22,#041711)',glow:'#00ff8c',shape:'24% 76% 31% 69% / 71% 26% 74% 29%',mult:1.5e12,chance:14,min:1.5e26,max:3e26,sound:510},
    {name:'Matrix',icon:'🟩',color:'linear-gradient(135deg,#b3ff4f,#0a180a,#00a84f)',glow:'#8dff58',shape:'56% 44% 67% 33% / 42% 61% 39% 58%',mult:8e12,chance:8,min:6e26,max:1.2e27,sound:610},
    {name:'Singularity',icon:'🕳️',color:'radial-gradient(circle at 42% 38%,#ffffff 0 3%,#b76cff 6%,#15102a 35%,#020207 70%)',glow:'#c06dff',shape:'50%',mult:5e13,chance:4,min:2.5e27,max:5e27,sound:55}
  ];

  const W7 = [
    {name:'Neon Void',icon:'🟣',color:'linear-gradient(135deg,#4dfcff,#5b2cff,#05050b)',glow:'#75f7ff',shape:'44% 56% 36% 64% / 58% 42% 58% 42%',mult:2e14,chance:45,min:1e29,max:2e29,sound:520},
    {name:'Quantum',icon:'⚛️',color:'linear-gradient(135deg,#96ffef,#386cff,#8d45ff)',glow:'#96ffef',shape:'61% 39% 53% 47% / 34% 66% 42% 58%',mult:8e14,chance:28,min:4e29,max:8e29,sound:660},
    {name:'Paradox',icon:'🔀',color:'linear-gradient(135deg,#ff5fb7,#4c1c86,#61efff)',glow:'#ff80c9',shape:'28% 72% 63% 37% / 67% 31% 69% 33%',mult:4e15,chance:15,min:1.5e30,max:3e30,sound:710},
    {name:'Reality',icon:'🪞',color:'linear-gradient(135deg,#ffffff,#7af5ff,#a16dff,#111225)',glow:'#e4fbff',shape:'50% 50% 29% 71% / 41% 59% 41% 59%',mult:2e16,chance:8,min:6e30,max:1.2e31,sound:880},
    {name:'Omega',icon:'Ω',color:'radial-gradient(circle at 35% 25%,#fff 0 3%,#ffd45d 8%,#8e35ff 42%,#05030b 78%)',glow:'#ffd45d',shape:'50%',mult:1e17,chance:4,min:2.5e31,max:5e31,sound:64}
  ];

  const W8 = [
    {name:'Nebula',icon:'🌌',color:'linear-gradient(135deg,#64f4ff,#7a4cff,#ff63bf)',glow:'#7ff7ff',shape:'46% 54% 63% 37% / 38% 59% 41% 62%',mult:5e17,chance:44,min:1e33,max:2e33,sound:620},
    {name:'Hyperverse',icon:'🌀',color:'linear-gradient(135deg,#2cf6d3,#2437ff,#a825ff)',glow:'#79fff0',shape:'34% 66% 45% 55% / 64% 36% 64% 36%',mult:2e18,chance:28,min:4e33,max:8e33,sound:740},
    {name:'Timebreaker',icon:'⏳',color:'linear-gradient(135deg,#ffe074,#ff5d9e,#703cff)',glow:'#ffe28a',shape:'57% 43% 35% 65% / 46% 58% 42% 54%',mult:1e19,chance:16,min:1.5e34,max:3e34,sound:830},
    {name:'Genesis',icon:'✨',color:'linear-gradient(135deg,#ffffff,#82f7ff,#ff8ee7,#ffd75e)',glow:'#ffffff',shape:'50%',mult:5e19,chance:8,min:6e34,max:1.2e35,sound:960},
    {name:'Infinity',icon:'♾️',color:'radial-gradient(circle at 38% 30%,#fff 0 4%,#ffd65a 9%,#ff54c8 28%,#5532ff 55%,#03030a 82%)',glow:'#ffd65a',shape:'50%',mult:2.5e20,chance:4,min:2.5e35,max:5e35,sound:1100}
  ];

  const addedNames = new Set([...W6, ...W7, ...W8].map(r => r.name));

  try {
    const baseAll = allRarities;
    allRarities = function() {
      return [...baseAll().filter(r => !addedNames.has(r.name)), ...W6, ...W7, ...W8];
    };
  } catch (e) { console.warn('Worlds 6-8: allRarities hook failed', e); }

  try {
    const baseWorldList = worldList;
    worldList = function(w = state.world) {
      w = Number(w);
      if (w === 6) return W6;
      if (w === 7) return W7;
      if (w === 8) return W8;
      return baseWorldList(w);
    };
  } catch (e) { console.warn('Worlds 6-8: worldList hook failed', e); }

  try {
    const baseUnlocked = isWorldUnlocked;
    isWorldUnlocked = function(w) {
      w = Number(w);
      if (w === 6) return !!state.world6Unlocked;
      if (w === 7) return !!state.world7Unlocked;
      if (w === 8) return !!state.world8Unlocked;
      return baseUnlocked(w);
    };
  } catch (e) { console.warn('Worlds 6-8: unlock hook failed', e); }

  try {
    if (state.world6Unlocked == null) state.world6Unlocked = false;
    if (state.world7Unlocked == null) state.world7Unlocked = false;
    if (state.world8Unlocked == null) state.world8Unlocked = false;
  } catch (_) {}

  try {
    WORLD_META[5] = {...(WORLD_META[5] || {}), name:'🪐 World 5 — Celestial Nexus', next:6, threshold:W6_UNLOCK, nextText:'🧪 World 6', info:'Reach 10 septillion coins to breach the Glitched Dimension.'};
    WORLD_META[6] = {name:'🧪 World 6 — Glitched Dimension', next:7, threshold:W7_UNLOCK, nextText:'🌌 World 7', info:'Reach 100 octillion coins to fracture reality and unlock World 7.'};
    WORLD_META[7] = {name:'🌌 World 7 — Reality Fracture', next:8, threshold:W8_UNLOCK, nextText:'♾️ World 8', info:'Reach 1 decillion coins to unlock the Infinity Core.'};
    WORLD_META[8] = {name:'♾️ World 8 — Infinity Core', next:1, threshold:0, nextText:'🌎 World 1', info:'Infinity Core endgame: hunt Nebula through Infinity squishies.'};
  } catch (e) { console.warn('Worlds 6-8: metadata hook failed', e); }

  try {
    const baseBoss = bossStatsForWorld;
    bossStatsForWorld = function(w) {
      w = Number(w);
      if (w === 6) return {name:'Rift Architect',icon:'🧬',hp:5e27,reward:1e28};
      if (w === 7) return {name:'Reality Eater',icon:'🪞',hp:5e31,reward:1e32};
      if (w === 8) return {name:'Infinity Titan',icon:'♾️',hp:5e35,reward:1e36};
      return baseBoss(w);
    };
  } catch (_) {}

  try {
    const basePool = availableBoxPool;
    availableBoxPool = function() {
      const p = [...basePool()].filter(r => !addedNames.has(r.name));
      if (state.world6Unlocked) p.push(...W6);
      if (state.world7Unlocked) p.push(...W7);
      if (state.world8Unlocked) p.push(...W8);
      return p;
    };
  } catch (_) {}

  try {
    const baseRender = render;
    render = function() {
      const result = baseRender();
      const w = Number(state.world);
      const btn = document.getElementById('worldBtn');
      const badge = document.getElementById('worldBadge');
      const bar = document.getElementById('worldProgress');
      const text = document.getElementById('progressText');
      const info = document.getElementById('worldInfo');
      const configs = {
        5:{need:W6_UNLOCK,flag:'world6Unlocked',label:'🧪 World 6',badge:'🪐 World 5'},
        6:{need:W7_UNLOCK,flag:'world7Unlocked',label:'🌌 World 7',badge:'🧪 World 6'},
        7:{need:W8_UNLOCK,flag:'world8Unlocked',label:'♾️ World 8',badge:'🌌 World 7'}
      };
      if (w === 8) {
        if (badge) badge.textContent = '♾️ World 8';
        if (btn) btn.textContent = '🌎 Return to World 1';
        if (bar) bar.style.width = '100%';
        if (text) text.textContent = '♾️ INFINITY CORE ENDGAME';
        if (info) info.textContent = 'Infinity Core endgame: hunt Nebula through Infinity squishies.';
        return result;
      }
      const c = configs[w];
      if (!c) return result;
      if (badge) badge.textContent = c.badge;
      const yes = !!state[c.flag];
      if (btn) btn.textContent = yes ? `${c.label} unlocked — ENTER` : `🔒 ${c.label} — ${typeof fmt === 'function' ? fmt(c.need) : c.need} 🪙`;
      if (bar) bar.style.width = (yes ? 100 : Math.min(100, (Number(state.coins) || 0) / c.need * 100)) + '%';
      if (text) text.textContent = yes ? `${c.label} unlocked!` : `${typeof fmt === 'function' ? fmt(state.coins) : state.coins} / ${typeof fmt === 'function' ? fmt(c.need) : c.need} coins`;
      try { if (info) info.textContent = WORLD_META[w].info; } catch (_) {}
      return result;
    };
  } catch (e) { console.warn('Worlds 6-8: render hook failed', e); }

  try { render(); } catch (_) {}
  window.__needohWorlds678 = {W6_UNLOCK, W7_UNLOCK, W8_UNLOCK, W6, W7, W8};
})();
