(() => {
  if (window.__needohWorldUnlockFixV27) return;
  window.__needohWorldUnlockFixV27 = true;

  const SUFFIX = {
    '':1,'K':1e3,'M':1e6,'B':1e9,'T':1e12,'Qa':1e15,'Qi':1e18,'Sx':1e21,'Sp':1e24,'Oc':1e27,'No':1e30,
    'Dc':1e33,'UDc':1e36,'DDc':1e39,'TDc':1e42,'QaDc':1e45,'QiDc':1e48,'SxDc':1e51,'SpDc':1e54,'ODc':1e57,'NDc':1e60,
    'Vg':1e63,'UVg':1e66,'DVg':1e69,'TVg':1e72,'QaVg':1e75,'QiVg':1e78,'SxVg':1e81,'SpVg':1e84,'OcVg':1e87,'NoVg':1e90
  };

  function parseVisibleCoins(text) {
    const s = String(text || '').replace(/[🪙,]/g, '').trim();
    const m = s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)([A-Za-z]+)?/i);
    if (!m) return NaN;
    const numericText = m[1];
    const n = Number(numericText);
    if (!Number.isFinite(n)) return n;

    // If the display already uses scientific notation, that exponent is the
    // complete value. Do not multiply by a suffix a second time.
    if (/e/i.test(numericText)) return n;

    const suffix = m[2] || '';
    if (Object.prototype.hasOwnProperty.call(SUFFIX, suffix)) return n * SUFFIX[suffix];
    const key = Object.keys(SUFFIX).find(k => k.toLowerCase() === suffix.toLowerCase());
    return key !== undefined ? n * SUFFIX[key] : n;
  }

  function topBalance() {
    return parseVisibleCoins(document.getElementById('coins')?.textContent || '');
  }

  function savedBalance() {
    try {
      const raw = localStorage.getItem('needohSquishWorldSaveV2');
      if (!raw) return 0;
      const data = JSON.parse(raw);
      const n = Number(data?.coins);
      return Number.isFinite(n) ? n : 0;
    } catch (_) { return 0; }
  }

  function thresholdForCurrentWorld() {
    try {
      const w = Number(state?.world || 1);
      const meta = (typeof WORLD_META !== 'undefined' && WORLD_META) ? WORLD_META[w] : null;
      const n = Number(meta?.threshold || 0);
      return Number.isFinite(n) ? n : 0;
    } catch (_) { return 0; }
  }

  function repairInternalBalanceForWorld() {
    try {
      const current = Number(state?.coins);
      const internal = Number.isFinite(current) ? current : 0;
      const visible = topBalance();
      const saved = savedBalance();
      const best = Math.max(internal, Number.isFinite(visible) ? visible : 0, saved);
      const threshold = thresholdForCurrentWorld();

      // Only repair the gameplay balance when the internal value would wrongly
      // block a world unlock but another trusted local display/save proves the
      // player has enough. This avoids changing normal purchases/spending.
      if (best > internal && ((threshold > 0 && internal < threshold && best >= threshold) || internal <= 0)) {
        state.coins = best;
        try { if (typeof save === 'function') save(true); } catch (_) {}
        try { document.getElementById('coins').textContent = typeof fmt === 'function' ? fmt(state.coins) : String(state.coins); } catch (_) {}
        return true;
      }
    } catch (e) {
      console.warn('World balance repair failed', e);
    }
    return false;
  }

  const previousSwitchWorld = typeof switchWorld === 'function' ? switchWorld : null;
  if (previousSwitchWorld) {
    switchWorld = function() {
      repairInternalBalanceForWorld();
      return previousSwitchWorld();
    };
  }

  function bindWorldButton() {
    const btn = document.getElementById('worldBtn');
    if (!btn) return;
    if (btn.dataset.worldUnlockV27 === '1') return;
    btn.dataset.worldUnlockV27 = '1';
    btn.onclick = function(e) {
      try { e?.preventDefault?.(); } catch (_) {}
      repairInternalBalanceForWorld();
      if (typeof switchWorld === 'function') return switchWorld();
    };
  }

  bindWorldButton();
  setInterval(bindWorldButton, 1000);
  window.__needohRepairWorldBalance = repairInternalBalanceForWorld;
})();
