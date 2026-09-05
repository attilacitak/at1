(() => {
  if (window.__needohStabilityRecoveryV24) return;
  window.__needohStabilityRecoveryV24 = true;

  const SOUND_KEY = 'needohHoldSoundV1';
  const TRACKS = {
    classic:  { label: 'Classic Squish', videoId: null },
    abnormal: { label: 'Funk Abnormal', videoId: 'dWXMw_jOtSI' },
    uranium:  { label: 'Montagem Uranium', videoId: 'EYsvBhN0dnc' },
    monocle:  { label: 'Funk Monocle', videoId: 'eYIum8HMB0Y' }
  };

  let compatHolding = false;
  let compatTimer = null;
  let activePointerId = null;
  let lastPoint = { clientX: 0, clientY: 0 };
  let squishesBeforePointer = 0;
  let recoveryRestocking = false;
  let lastForcedRestock = 0;

  function selectedTrack() {
    const key = localStorage.getItem(SOUND_KEY) || 'classic';
    return TRACKS[key] ? key : 'classic';
  }

  function esc(v) {
    try { return typeof escapeHtml === 'function' ? escapeHtml(v) : String(v); }
    catch (_) { return String(v); }
  }

  function ensureStyle() {
    if (document.getElementById('stabilityRecoveryV24Style')) return;
    const s = document.createElement('style');
    s.id = 'stabilityRecoveryV24Style';
    s.textContent = `
      .sr24-track-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .sr24-track{padding:14px;border-radius:15px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);color:#fff;text-align:left;cursor:pointer}
      .sr24-track.active{outline:2px solid #7cf7d4;background:rgba(124,247,212,.12)}
      .sr24-track b{display:block;font-size:15px}.sr24-track span{display:block;margin-top:4px;font-size:12px;color:#c8c7d7}
      #sr24YTPanel{position:fixed;left:14px;bottom:14px;z-index:50000;width:210px;border-radius:14px;overflow:hidden;background:#0d1020;border:1px solid rgba(255,255,255,.18);box-shadow:0 16px 45px rgba(0,0,0,.45)}
      #sr24YTPanel .t{padding:7px 9px;color:#fff;font-size:12px;font-weight:900;background:rgba(0,0,0,.35)}
      #sr24YTPanel iframe{display:block;width:210px;height:118px;border:0;background:#000}
      @media(max-width:620px){.sr24-track-grid{grid-template-columns:1fr}#sr24YTPanel{left:8px;bottom:8px;width:190px}#sr24YTPanel iframe{width:190px;height:107px}}
    `;
    document.head.appendChild(s);
  }

  function ensureWorldInfo() {
    let info = document.getElementById('worldInfo');
    if (info) return info;
    const market = document.getElementById('market');
    if (!market) return null;
    info = document.createElement('div');
    info.id = 'worldInfo';
    info.className = 'locked';
    market.insertAdjacentElement('afterend', info);
    return info;
  }

  function updateTopCounters() {
    try {
      const coins = document.getElementById('coins');
      const sq = document.getElementById('squishes');
      const per = document.getElementById('perSquish');
      if (coins) coins.textContent = typeof fmt === 'function' ? fmt(state.coins) : String(state.coins);
      if (sq) sq.textContent = typeof fmt === 'function' ? fmt(state.squishes) : String(state.squishes);
      if (per && typeof rarity === 'function') {
        const r = rarity(state.selected);
        const v = Number(state.clickPower || 0) * Number(state.baseMult || 0) * Number(r?.mult || 1);
        per.textContent = typeof fmt === 'function' ? fmt(v) : String(v);
      }
    } catch (_) {}
  }

  function updateWorldProgress() {
    try {
      const w = Number(state.world || 1);
      const meta = WORLD_META?.[w];
      if (!meta) return;
      const info = ensureWorldInfo();
      if (info) info.textContent = meta.info || '';

      const bar = document.getElementById('worldProgress');
      const text = document.getElementById('progressText');
      if (!bar || !text) return;

      const threshold = Number(meta.threshold || 0);
      const next = Number(meta.next || 0);
      let unlocked = false;
      try { unlocked = next > 0 && typeof isWorldUnlocked === 'function' ? !!isWorldUnlocked(next) : false; } catch (_) {}

      if (threshold > 0 && next > 0) {
        const pct = unlocked ? 100 : Math.min(100, Math.max(0, (Number(state.coins) || 0) / threshold * 100));
        bar.style.width = `${pct}%`;
        if (unlocked) text.textContent = `${meta.nextText || `World ${next}`} unlocked!`;
        else text.textContent = `${typeof fmt === 'function' ? fmt(state.coins) : state.coins} / ${typeof fmt === 'function' ? fmt(threshold) : threshold} coins to ${meta.nextText || `World ${next}`}`;
      } else {
        bar.style.width = '100%';
        text.textContent = meta.info || 'World complete';
      }
    } catch (_) {}
  }

  function repairMarketAndTimer() {
    try {
      ensureWorldInfo();
      const now = Date.now();
      let end = Number(state.restockAt || 0);
      const stockMissing = !Array.isArray(state.stock) || state.stock.length === 0;
      const expired = !Number.isFinite(end) || end <= now;

      if ((stockMissing || expired) && !recoveryRestocking && now - lastForcedRestock > 700) {
        recoveryRestocking = true;
        lastForcedRestock = now;
        try {
          if (typeof restock === 'function') restock(true);
        } catch (_) {
          if (!Array.isArray(state.stock)) state.stock = [];
          if (!Number.isFinite(Number(state.restockAt)) || Number(state.restockAt) <= now) state.restockAt = now + 60000;
        } finally {
          recoveryRestocking = false;
        }
        end = Number(state.restockAt || (now + 60000));
      }

      const timer = document.getElementById('timer');
      if (timer) {
        const left = Math.max(0, end - Date.now());
        const s = Math.ceil(left / 1000);
        timer.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      }

      const market = document.getElementById('market');
      if (market && typeof renderMarket === 'function' && Array.isArray(state.stock)) {
        try { renderMarket(); } catch (_) {}
      }
    } catch (_) {}
  }

  function safeSquish(point) {
    const before = Number(state?.squishes || 0);
    try {
      if (typeof squish === 'function') squish(point);
    } catch (_) {
      // The original squish already awards coins before render(); a render error
      // should not stop hold-to-earn.
    }

    if (Number(state?.squishes || 0) <= before) {
      try {
        const r = typeof rarity === 'function' ? rarity(state.selected) : null;
        const earned = Number(state.clickPower || 0) * Number(state.baseMult || 0) * Number(r?.mult || 1);
        if (typeof addCoins === 'function') addCoins(earned);
        else state.coins = Number(state.coins || 0) + Math.max(0, earned || 0);
        state.squishes = before + 1;
      } catch (_) {}
    }

    updateTopCounters();
    updateWorldProgress();
  }

  function resumeGameAudio() {
    try {
      if (!state?.sound) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (typeof audioCtx !== 'undefined') {
        if (!audioCtx) audioCtx = new AC();
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
      }
    } catch (_) {}
  }

  function stopHoldMusic() {
    document.getElementById('sr24YTPanel')?.remove();
  }

  function startHoldMusic() {
    stopHoldMusic();
    const key = selectedTrack();
    const track = TRACKS[key];
    if (!track?.videoId) return;
    try { if (state?.sound === false) return; } catch (_) {}

    const panel = document.createElement('div');
    panel.id = 'sr24YTPanel';
    panel.innerHTML = `<div class="t">🎵 ${esc(track.label)} — release to stop</div>`;
    const frame = document.createElement('iframe');
    frame.title = track.label;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.src = `https://www.youtube.com/embed/${track.videoId}?autoplay=1&playsinline=1&controls=1&rel=0&loop=1&playlist=${track.videoId}`;
    panel.appendChild(frame);
    document.body.appendChild(panel);
  }

  function capturePointer(e) {
    const n = document.getElementById('needoh');
    if (!n || !e?.target?.closest?.('#needoh')) return;
    squishesBeforePointer = Number(state?.squishes || 0);
    lastPoint = { clientX: e.clientX || 0, clientY: e.clientY || 0 };
    resumeGameAudio();
  }

  function compatStart(e) {
    if (compatHolding) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    compatHolding = true;
    activePointerId = e.pointerId ?? null;
    lastPoint = { clientX: e.clientX || 0, clientY: e.clientY || 0 };

    try {
      if (typeof holdTimer !== 'undefined') {
        clearInterval(holdTimer);
        holdTimer = null;
      }
    } catch (_) {}

    if (Number(state?.squishes || 0) <= squishesBeforePointer) safeSquish(lastPoint);
    startHoldMusic();
    clearInterval(compatTimer);
    compatTimer = setInterval(() => safeSquish(lastPoint), 105);
  }

  function compatMove(e) {
    if (!compatHolding) return;
    if (activePointerId !== null && e.pointerId != null && e.pointerId !== activePointerId) return;
    lastPoint = { clientX: e.clientX || 0, clientY: e.clientY || 0 };
  }

  function compatStop(e) {
    if (compatHolding && activePointerId !== null && e?.pointerId != null && e.pointerId !== activePointerId) return;
    compatHolding = false;
    activePointerId = null;
    clearInterval(compatTimer);
    compatTimer = null;
    try {
      if (typeof holdTimer !== 'undefined') {
        clearInterval(holdTimer);
        holdTimer = null;
      }
    } catch (_) {}
    stopHoldMusic();
  }

  function bindHoldRecovery() {
    const n = document.getElementById('needoh');
    if (!n || n.dataset.sr24Hold === '1') return;
    n.dataset.sr24Hold = '1';
    n.addEventListener('pointerdown', compatStart);
    n.addEventListener('pointermove', compatMove);
  }

  function showHoldSounds() {
    const current = selectedTrack();
    const cards = Object.entries(TRACKS).map(([key, t]) => `<button class="sr24-track ${key === current ? 'active' : ''}" data-sr24-track="${key}"><b>🎵 ${esc(t.label)}</b><span>${key === 'classic' ? 'Normal game squish sound' : 'YouTube music while holding'}</span></button>`).join('');
    if (typeof openHub !== 'function') return;
    openHub('🎵 Hold Sound', `<div class="notice">Choose the sound that plays while you hold the squishy.</div><div class="sr24-track-grid">${cards}</div>`);
    document.querySelectorAll('[data-sr24-track]').forEach(btn => {
      btn.onclick = () => {
        localStorage.setItem(SOUND_KEY, btn.dataset.sr24Track);
        if (typeof toast === 'function') toast(`🎵 Hold sound: ${TRACKS[btn.dataset.sr24Track].label}`);
        showHoldSounds();
      };
    });
  }

  function ensureHoldSoundButton() {
    const soundBtn = document.getElementById('soundBtn');
    if (!soundBtn) return;
    let btn = document.getElementById('holdSoundBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'btn';
      btn.id = 'holdSoundBtn';
      btn.textContent = '🎵 Hold Sound';
      soundBtn.insertAdjacentElement('afterend', btn);
    }
    btn.onclick = showHoldSounds;
  }

  ensureStyle();
  ensureWorldInfo();
  bindHoldRecovery();
  ensureHoldSoundButton();
  resumeGameAudio();

  // Try the normal render once after restoring any missing core DOM nodes.
  try { if (typeof render === 'function') render(); } catch (_) {}
  repairMarketAndTimer();
  updateWorldProgress();
  updateTopCounters();

  window.addEventListener('pointerdown', capturePointer, true);
  window.addEventListener('pointerup', compatStop, true);
  window.addEventListener('pointercancel', compatStop, true);
  window.addEventListener('blur', () => compatStop({}), true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) compatStop({}); });

  setInterval(() => {
    bindHoldRecovery();
    ensureHoldSoundButton();
    repairMarketAndTimer();
    updateWorldProgress();
    updateTopCounters();
  }, 500);
})();
