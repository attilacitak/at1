(() => {
  if (window.__needohWorldNavigationV30) return;
  window.__needohWorldNavigationV30 = true;

  const SAVE_KEY = 'needohSquishWorldSaveV2';
  const CFG = {
    1:{next:2,threshold:1e6,label:'🌊 World 2',flag:'world2Unlocked'},
    2:{next:3,threshold:1e10,label:'🌌 World 3',flag:'world3Unlocked'},
    3:{next:4,threshold:1e15,label:'🌠 World 4',flag:'world4Unlocked'},
    4:{next:5,threshold:1e21,label:'🪐 World 5',flag:'world5Unlocked'},
    5:{next:6,threshold:1e25,label:'🧪 World 6',flag:'world6Unlocked'},
    6:{next:7,threshold:1e29,label:'🌌 World 7',flag:'world7Unlocked'},
    7:{next:8,threshold:1e33,label:'♾️ World 8',flag:'world8Unlocked'},
    8:{next:1,threshold:0,label:'🌎 World 1',flag:null}
  };
  const SUFFIX = {'':1,'K':1e3,'M':1e6,'B':1e9,'T':1e12,'Qa':1e15,'Qi':1e18,'Sx':1e21,'Sp':1e24,'Oc':1e27,'No':1e30,'Dc':1e33,'UDc':1e36,'DDc':1e39,'TDc':1e42,'QaDc':1e45,'QiDc':1e48,'SxDc':1e51,'SpDc':1e54,'ODc':1e57,'NDc':1e60,'Vg':1e63,'UVg':1e66,'DVg':1e69,'TVg':1e72,'QaVg':1e75,'QiVg':1e78,'SxVg':1e81,'SpVg':1e84,'OcVg':1e87,'NoVg':1e90};

  function parseCoins(text) {
    const s = String(text || '').replace(/[🪙,]/g,'').trim();
    const m = s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)([A-Za-z]+)?/i);
    if (!m) return NaN;
    const n = Number(m[1]);
    if (!Number.isFinite(n)) return n;
    if (/e/i.test(m[1])) return n;
    const suffix = m[2] || '';
    if (Object.prototype.hasOwnProperty.call(SUFFIX,suffix)) return n * SUFFIX[suffix];
    const key = Object.keys(SUFFIX).find(k => k.toLowerCase() === suffix.toLowerCase());
    return key !== undefined ? n * SUFFIX[key] : n;
  }

  function readSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {}; }
    catch (_) { return {}; }
  }

  function visibleWorld() {
    const badge = document.getElementById('worldBadge')?.textContent || '';
    const m = badge.match(/World\s*(\d+)/i);
    if (m) {
      const w = Number(m[1]);
      if (CFG[w]) return w;
    }
    return 0;
  }

  function currentWorld() {
    const visible = visibleWorld();
    if (visible) return visible;
    try {
      const w = Number(state?.world);
      if (CFG[w]) return w;
    } catch (_) {}
    const saved = Number(readSave().world);
    return CFG[saved] ? saved : 1;
  }

  function realBalance() {
    const visible = parseCoins(document.getElementById('coins')?.textContent || '');
    let internal = 0;
    try { internal = Number(state?.coins) || 0; } catch (_) {}
    const saved = Number(readSave().coins) || 0;
    return Math.max(Number.isFinite(visible) ? visible : 0, internal, saved);
  }

  function unlocked(c) {
    if (!c.flag) return true;
    try { if (state?.[c.flag]) return true; } catch (_) {}
    return !!readSave()[c.flag];
  }

  function persist(c, balance) {
    const data = readSave();
    data.coins = Math.max(Number(data.coins) || 0, balance || 0);
    data.world = c.next;
    if (c.flag) data[c.flag] = true;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (_) {}

    try {
      if (balance > (Number(state.coins) || 0)) state.coins = balance;
      if (c.flag) state[c.flag] = true;
      state.world = c.next;
      try { if (typeof restock === 'function') restock(true); } catch (_) {}
      try { if (typeof resetBossForWorld === 'function') resetBossForWorld(); } catch (_) {}
      try { if (typeof render === 'function') render(); } catch (e) { console.warn('World render failed', e); }
      try { if (typeof save === 'function') save(true); } catch (_) {}
      try { window.__needohSyncWorldProgress?.(); } catch (_) {}
      return true;
    } catch (e) {
      console.warn('World state update failed', e);
      return false;
    }
  }

  function goNextWorld() {
    const w = currentWorld();
    const c = CFG[w] || CFG[1];
    const balance = realBalance();
    const wasUnlocked = unlocked(c);

    if (!wasUnlocked && c.threshold > 0 && balance < c.threshold) {
      let need = c.threshold;
      try { if (typeof fmt === 'function') need = fmt(c.threshold); } catch (_) {}
      try { if (typeof toast === 'function') toast(`Reach ${need} coins first!`); } catch (_) {}
      return;
    }

    const ok = persist(c, balance);
    if (!ok) {
      try { if (typeof toast === 'function') toast('Could not switch worlds — refresh and try again'); } catch (_) {}
      return;
    }

    try {
      if (typeof toast === 'function') toast(wasUnlocked ? `Entered ${c.label}` : `${c.label} unlocked!`);
    } catch (_) {}
  }

  window.addEventListener('click', e => {
    const btn = e.target?.closest?.('#worldBtn');
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    goNextWorld();
  }, true);

  window.__needohGoNextWorld = goNextWorld;
})();
