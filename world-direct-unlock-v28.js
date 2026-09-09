(() => {
  if (window.__needohWorldDirectUnlockV28) return;
  window.__needohWorldDirectUnlockV28 = true;

  const SUFFIX = {
    '':1,'K':1e3,'M':1e6,'B':1e9,'T':1e12,'Qa':1e15,'Qi':1e18,'Sx':1e21,'Sp':1e24,'Oc':1e27,'No':1e30,
    'Dc':1e33,'UDc':1e36,'DDc':1e39,'TDc':1e42,'QaDc':1e45,'QiDc':1e48,'SxDc':1e51,'SpDc':1e54,'ODc':1e57,'NDc':1e60,
    'Vg':1e63,'UVg':1e66,'DVg':1e69,'TVg':1e72,'QaVg':1e75,'QiVg':1e78,'SxVg':1e81,'SpVg':1e84,'OcVg':1e87,'NoVg':1e90
  };

  function parseCoins(text) {
    const s = String(text || '').replace(/[🪙,]/g, '').trim();
    const m = s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)([A-Za-z]+)?/i);
    if (!m) return NaN;
    const n = Number(m[1]);
    if (!Number.isFinite(n)) return n;
    if (/e/i.test(m[1])) return n;
    const suffix = m[2] || '';
    if (Object.prototype.hasOwnProperty.call(SUFFIX, suffix)) return n * SUFFIX[suffix];
    const key = Object.keys(SUFFIX).find(k => k.toLowerCase() === suffix.toLowerCase());
    return key !== undefined ? n * SUFFIX[key] : n;
  }

  function savedCoins() {
    try {
      const raw = localStorage.getItem('needohSquishWorldSaveV2');
      if (!raw) return 0;
      const data = JSON.parse(raw);
      const n = Number(data?.coins);
      return Number.isFinite(n) ? n : 0;
    } catch (_) { return 0; }
  }

  function realBalance() {
    let internal = 0;
    try { internal = Number(state?.coins) || 0; } catch (_) {}
    const visible = parseCoins(document.getElementById('coins')?.textContent || '');
    const saved = savedCoins();
    return Math.max(internal, Number.isFinite(visible) ? visible : 0, saved);
  }

  function unlocked(next) {
    try {
      if (typeof isWorldUnlocked === 'function' && isWorldUnlocked(next)) return true;
    } catch (_) {}
    try {
      if (next === 1) return true;
      return !!state?.[`world${next}Unlocked`];
    } catch (_) { return false; }
  }

  function setUnlocked(next) {
    if (next <= 1) return;
    try { state[`world${next}Unlocked`] = true; } catch (_) {}
  }

  function finishWorldChange(next, newlyUnlocked = false) {
    try { state.world = next; } catch (_) { return; }

    try {
      if (typeof restock === 'function') restock(true);
      else state.restockAt = Date.now() + 60000;
    } catch (_) {
      try { state.restockAt = Date.now() + 60000; } catch (_) {}
    }

    try { if (typeof resetBossForWorld === 'function') resetBossForWorld(); } catch (_) {}
    try { if (typeof render === 'function') render(); } catch (_) {}
    try { if (typeof save === 'function') save(true); } catch (_) {}
    try { window.__needohSyncWorldProgress?.(); } catch (_) {}

    if (newlyUnlocked) {
      try {
        const meta = WORLD_META?.[next];
        if (typeof toast === 'function') toast(`${meta?.name || `World ${next}`} unlocked!`);
      } catch (_) {}
    }
  }

  function directWorldChange() {
    let w = 1, meta = null;
    try {
      w = Number(state?.world || 1);
      meta = WORLD_META?.[w] || null;
    } catch (_) {}
    if (!meta) {
      try { if (typeof toast === 'function') toast('World data is still loading'); } catch (_) {}
      return;
    }

    const next = Number(meta.next || 0);
    const threshold = Number(meta.threshold || 0);
    if (!(next > 0)) return;

    // End worlds return to World 1 without any balance requirement.
    if (next === 1 && !(threshold > 0)) {
      finishWorldChange(1, false);
      return;
    }

    // Already unlocked worlds should always be enterable.
    if (unlocked(next)) {
      finishWorldChange(next, false);
      return;
    }

    const balance = realBalance();
    if (threshold > 0 && balance < threshold) {
      try {
        const need = typeof fmt === 'function' ? fmt(threshold) : threshold;
        if (typeof toast === 'function') toast(`Reach ${need} coins first!`);
      } catch (_) {}
      return;
    }

    // Repair the internal gameplay balance from the visible/saved balance before
    // unlocking so every later game system agrees about how many coins exist.
    try {
      const internal = Number(state.coins) || 0;
      if (balance > internal) state.coins = balance;
    } catch (_) {}

    setUnlocked(next);
    finishWorldChange(next, true);
  }

  // Capture before target onclick handlers. This prevents older switchWorld
  // wrappers from blocking a valid unlock after this handler succeeds.
  window.addEventListener('click', e => {
    const btn = e.target?.closest?.('#worldBtn');
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    directWorldChange();
  }, true);

  window.__needohDirectWorldChange = directWorldChange;
})();
