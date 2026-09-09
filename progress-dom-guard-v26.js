(() => {
  if (window.__needohProgressDomGuardV26) return;
  window.__needohProgressDomGuardV26 = true;

  function cleanVisibleCoins() {
    const el = document.getElementById('coins');
    if (!el) return '';
    return String(el.textContent || '').replace(/^\s*🪙\s*/, '').trim();
  }

  function isZeroLabel(v) {
    const s = String(v || '').replace(/[\s,]/g, '').toLowerCase();
    return s === '0' || s === '0.0' || s === '0.00' || s === '';
  }

  function sync() {
    const coins = cleanVisibleCoins();
    const text = document.getElementById('progressText');
    if (!coins || !text || isZeroLabel(coins)) return;

    const current = String(text.textContent || '').trim();
    const slash = current.indexOf('/');
    if (slash === -1) return;

    const right = current.slice(slash).trimStart();
    const wanted = `${coins} ${right}`;
    if (current !== wanted) text.textContent = wanted;

    const bar = document.getElementById('worldProgress');
    if (!bar) return;

    // Parse the visible top balance and visible threshold only for bar width.
    // Text correction above does not depend on parsing.
    const units = {
      k:1e3,m:1e6,b:1e9,t:1e12,qa:1e15,qi:1e18,sx:1e21,sp:1e24,oc:1e27,no:1e30,
      dc:1e33,udc:1e36,ddc:1e39,tdc:1e42,qadc:1e45,qidc:1e48,sxdc:1e51,spdc:1e54,odc:1e57,ndc:1e60,
      vg:1e63,uvg:1e66,dvg:1e69,tvg:1e72,qavg:1e75,qivg:1e78,sxvg:1e81,spvg:1e84,ocvg:1e87,novg:1e90
    };
    const parse = v => {
      const s = String(v || '').replace(/[🪙,]/g,'').trim();
      const m = s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*([a-z]+)?/i);
      if (!m) return NaN;
      const n = Number(m[1]);
      const u = String(m[2] || '').toLowerCase();
      return n * (units[u] || 1);
    };
    const thresholdPart = right.match(/^\/\s*([^\s]+(?:\s*[A-Za-z]+)?)/)?.[1] || '';
    const a = parse(coins), b = parse(thresholdPart);
    if (Number.isFinite(a) && Number.isFinite(b) && b > 0) {
      bar.style.width = `${Math.min(100, Math.max(0, a / b * 100))}%`;
    }
  }

  sync();
  setTimeout(sync, 50);
  setTimeout(sync, 250);
  setTimeout(sync, 1000);
  setInterval(sync, 100);

  const obs = new MutationObserver(sync);
  const coins = document.getElementById('coins');
  const progress = document.getElementById('progressText');
  if (coins) obs.observe(coins, {childList:true, subtree:true, characterData:true});
  if (progress) obs.observe(progress, {childList:true, subtree:true, characterData:true});
})();