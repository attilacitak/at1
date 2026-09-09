(() => {
  if (window.__needohProgressSyncV25) return;
  window.__needohProgressSyncV25 = true;

  const SUFFIX = {
    '':1,'K':1e3,'M':1e6,'B':1e9,'T':1e12,'Qa':1e15,'Qi':1e18,'Sx':1e21,'Sp':1e24,'Oc':1e27,'No':1e30,
    'Dc':1e33,'UDc':1e36,'DDc':1e39,'TDc':1e42,'QaDc':1e45,'QiDc':1e48,'SxDc':1e51,'SpDc':1e54,'ODc':1e57,'NDc':1e60,
    'Vg':1e63,'UVg':1e66,'DVg':1e69,'TVg':1e72,'QaVg':1e75,'QiVg':1e78,'SxVg':1e81,'SpVg':1e84,'OcVg':1e87,'NoVg':1e90
  };

  function cleanCoinText(v) {
    return String(v ?? '').replace(/[🪙,]/g,'').trim();
  }

  function parseCoinText(v) {
    const s = cleanCoinText(v);
    const m = s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)([A-Za-z]+)?/i);
    if (!m) return NaN;
    const n = Number(m[1]);
    if (!Number.isFinite(n)) return n;
    const suffix = m[2] || '';
    const exact = Object.prototype.hasOwnProperty.call(SUFFIX, suffix) ? SUFFIX[suffix] : undefined;
    if (exact !== undefined) return n * exact;
    const key = Object.keys(SUFFIX).find(k => k.toLowerCase() === suffix.toLowerCase());
    return key !== undefined ? n * SUFFIX[key] : n;
  }

  function topCoinRaw() {
    return document.getElementById('coins')?.textContent?.trim() || '';
  }

  function stateCoinValue() {
    try {
      const n = Number(state?.coins);
      return Number.isFinite(n) ? n : 0;
    } catch (_) { return 0; }
  }

  function bestCoinValue() {
    const a = stateCoinValue();
    const b = parseCoinText(topCoinRaw());
    if (Number.isFinite(b)) return Math.max(a, b);
    return a;
  }

  function bestCoinLabel() {
    const stateValue = stateCoinValue();
    const top = topCoinRaw();
    const topValue = parseCoinText(top);

    // If the top counter visibly has money and state is temporarily 0 during
    // reload/rejoin, preserve the visible real balance rather than showing 0.
    if (Number.isFinite(topValue) && topValue > 0 && stateValue <= 0) return top;
    try { return typeof fmt === 'function' ? fmt(stateValue) : String(stateValue); }
    catch (_) { return top || String(stateValue); }
  }

  function syncProgress() {
    try {
      const text = document.getElementById('progressText');
      const bar = document.getElementById('worldProgress');
      if (!text || !bar) return;

      const w = Number(state?.world || 1);
      const meta = (typeof WORLD_META !== 'undefined' && WORLD_META) ? WORLD_META[w] : null;
      if (!meta) return;

      const threshold = Number(meta.threshold || 0);
      const next = Number(meta.next || 0);
      if (!(threshold > 0) || !(next > 0)) return;

      let unlocked = false;
      try { unlocked = typeof isWorldUnlocked === 'function' && !!isWorldUnlocked(next); } catch (_) {}

      if (unlocked) {
        const wanted = `${meta.nextText || `World ${next}`} unlocked!`;
        if (text.textContent !== wanted) text.textContent = wanted;
        if (bar.style.width !== '100%') bar.style.width = '100%';
        return;
      }

      const value = bestCoinValue();
      const label = bestCoinLabel();
      let thresholdLabel;
      try { thresholdLabel = typeof fmt === 'function' ? fmt(threshold) : String(threshold); }
      catch (_) { thresholdLabel = String(threshold); }

      const wanted = `${label} / ${thresholdLabel} coins to ${meta.nextText || `World ${next}`}`;
      if (text.textContent !== wanted) text.textContent = wanted;

      if (Number.isFinite(value) && value >= 0) {
        const pct = Math.min(100, Math.max(0, value / threshold * 100));
        const width = `${pct}%`;
        if (bar.style.width !== width) bar.style.width = width;
      }
    } catch (e) {
      console.warn('Progress sync failed', e);
    }
  }

  // Repair immediately, after delayed account/online restoration, and forever
  // after any render, kick/rejoin, grant, save, world change, or DOM rewrite.
  syncProgress();
  setTimeout(syncProgress, 50);
  setTimeout(syncProgress, 250);
  setTimeout(syncProgress, 1000);
  setInterval(syncProgress, 200);

  const observer = new MutationObserver(() => syncProgress());
  observer.observe(document.body, {childList:true, subtree:true, characterData:true});

  window.__needohSyncWorldProgress = syncProgress;
})();