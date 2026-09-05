(() => {
  if (window.__needohInputAudioFinalV2) return;
  window.__needohInputAudioFinalV2 = true;

  const SOUND_KEY = 'needohHoldSoundV1';
  const TRACKS = {
    classic:  { label: 'Classic Squish', videoId: null },
    abnormal: { label: 'Funk Abnormal', videoId: 'dWXMw_jOtSI' },
    uranium:  { label: 'Montagem Uranium', videoId: 'EYsvBhN0dnc' },
    monocle:  { label: 'Funk Monocle', videoId: 'eYIum8HMB0Y' }
  };

  let holding = false;
  let holdTimer = null;
  let activePointerId = null;
  let lastPoint = { clientX: 0, clientY: 0 };
  let lastStartAt = 0;

  let ytPlayer = null;
  let ytReady = false;
  let ytWanted = false;
  let ytLoadedKey = '';
  let ytPendingKey = '';
  let ytApiRequested = false;

  function selectedKey() {
    const key = localStorage.getItem(SOUND_KEY) || 'classic';
    return TRACKS[key] ? key : 'classic';
  }

  function esc(v) {
    try { return typeof escapeHtml === 'function' ? escapeHtml(v) : String(v); }
    catch (_) { return String(v); }
  }

  function ensureStyles() {
    if (document.getElementById('inputAudioFinalV2Style')) return;
    const s = document.createElement('style');
    s.id = 'inputAudioFinalV2Style';
    s.textContent = `
      #needoh.final-holding{
        animation:none!important;
        transform:scaleX(1.17) scaleY(.73) rotate(2deg)!important;
        filter:brightness(1.18) saturate(1.12)!important;
        transition:transform .045s ease-out,filter .045s ease-out!important;
      }
      .final-click-ring{
        position:absolute;width:38px;height:38px;margin-left:-19px;margin-top:-19px;
        border:3px solid rgba(255,255,255,.95);border-radius:50%;pointer-events:none;z-index:80;
        box-shadow:0 0 22px rgba(255,255,255,.65);animation:finalClickRing .34s ease-out forwards
      }
      @keyframes finalClickRing{0%{transform:scale(.3);opacity:1}100%{transform:scale(2.35);opacity:0}}
      .final-track-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .final-track-choice{padding:15px;border-radius:16px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);color:#fff;text-align:left;cursor:pointer}
      .final-track-choice.active{outline:2px solid #7cf7d4;background:rgba(124,247,212,.13)}
      .final-track-choice b{display:block;font-size:16px}.final-track-choice span{display:block;margin-top:4px;font-size:12px;color:#c8c7d7}
      #coreYouTubePanel{width:210px!important;min-height:232px!important}
      #coreYouTubeFrameHost,#finalYTPlayer{width:210px!important;height:200px!important;background:#000}
      @media(max-width:620px){.final-track-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function pointInsideNeedoh(x, y) {
    const n = document.getElementById('needoh');
    if (!n || !Number.isFinite(x) || !Number.isFinite(y)) return false;
    const r = n.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function ring(point) {
    const stage = document.getElementById('stage');
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'final-click-ring';
    el.style.left = `${point.clientX - r.left}px`;
    el.style.top = `${point.clientY - r.top}px`;
    stage.appendChild(el);
    setTimeout(() => el.remove(), 380);
  }

  function cloneNeedohOnce() {
    const old = document.getElementById('needoh');
    if (!old || old.dataset.finalInputV2 === '1') return old;
    const fresh = old.cloneNode(true);
    fresh.dataset.finalInputV2 = '1';
    fresh.style.touchAction = 'none';
    old.replaceWith(fresh);
    return fresh;
  }

  function fallbackSquish(point) {
    try {
      const r = typeof rarity === 'function' ? rarity(state.selected) : null;
      const earned = Math.max(0, Number(state.clickPower || 0) * Number(state.baseMult || 0) * Number(r?.mult || 1));
      if (typeof addCoins === 'function') addCoins(earned);
      else {
        state.coins = Number(state.coins || 0) + earned;
        state.totalCoinsEarned = Number(state.totalCoinsEarned || 0) + earned;
      }
      state.squishes = Number(state.squishes || 0) + 1;

      const n = document.getElementById('needoh');
      if (n && !holding) {
        n.classList.remove('squishing'); void n.offsetWidth; n.classList.add('squishing');
      }

      const stage = document.getElementById('stage');
      if (stage) {
        const f = document.createElement('div');
        f.className = 'floating';
        f.textContent = `+${typeof fmt === 'function' ? fmt(earned) : earned} 🪙`;
        const sr = stage.getBoundingClientRect();
        f.style.left = `${point?.clientX ? point.clientX - sr.left : sr.width/2}px`;
        f.style.top = `${point?.clientY ? point.clientY - sr.top : sr.height/2}px`;
        stage.appendChild(f);
        setTimeout(() => f.remove(), 900);
      }
      try { if (typeof checkAchievements === 'function') checkAchievements(); } catch (_) {}
      if (typeof render === 'function') render();
      return true;
    } catch (e) {
      console.error('Direct squish fallback failed', e);
      return false;
    }
  }

  function performSquish() {
    if (!holding) return;
    const before = Number(state?.squishes || 0);
    let completed = false;
    let oldSoundFn = null;

    try {
      // Custom YouTube music replaces the built-in click beep while held.
      if (selectedKey() !== 'classic' && typeof playSquishSound === 'function') {
        oldSoundFn = playSquishSound;
        playSquishSound = function(){};
      }
      if (typeof squish === 'function') {
        squish(lastPoint);
        completed = Number(state?.squishes || 0) > before;
      }
    } catch (e) {
      console.warn('Normal squish path failed; using direct fallback', e);
    } finally {
      if (oldSoundFn) playSquishSound = oldSoundFn;
    }

    if (!completed) fallbackSquish(lastPoint);
    else {
      // If another script updated state but failed before repainting, force the visible counters.
      try {
        const s = document.getElementById('squishes');
        const c = document.getElementById('coins');
        if (s && typeof fmt === 'function') s.textContent = fmt(state.squishes);
        if (c && typeof fmt === 'function') c.textContent = fmt(state.coins);
      } catch (_) {}
    }
  }

  function ensurePanel() {
    let panel = document.getElementById('coreYouTubePanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'coreYouTubePanel';
      panel.style.cssText = 'position:fixed;left:16px;bottom:16px;width:210px;z-index:50000;border-radius:16px;overflow:hidden;background:#0d1020;border:1px solid rgba(255,255,255,.18);box-shadow:0 16px 46px rgba(0,0,0,.45)';
      panel.innerHTML = '<div class="core-yt-title" id="coreYouTubeTitle" style="padding:8px 10px;font-size:12px;font-weight:900;color:#fff;background:rgba(0,0,0,.34)">YouTube Hold Music</div><div id="coreYouTubeFrameHost"></div>';
      document.body.appendChild(panel);
    }
    let host = document.getElementById('coreYouTubeFrameHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'coreYouTubeFrameHost';
      panel.appendChild(host);
    }
    return { panel, host };
  }

  function preparePlayerMount() {
    const { panel, host } = ensurePanel();
    if (!document.getElementById('finalYTPlayer')) {
      host.innerHTML = '<div id="finalYTPlayer"></div>';
      ytPlayer = null; ytReady = false; ytLoadedKey = '';
    }
    panel.style.display = selectedKey() === 'classic' ? 'none' : 'block';
    return { panel, host };
  }

  function initYTPlayer() {
    if (ytPlayer || !window.YT?.Player) return;
    const key = selectedKey() === 'classic' ? (ytPendingKey || 'abnormal') : selectedKey();
    const track = TRACKS[key];
    if (!track?.videoId) return;
    preparePlayerMount();
    try {
      ytPlayer = new YT.Player('finalYTPlayer', {
        width: '210', height: '200', videoId: track.videoId,
        playerVars: { playsinline: 1, controls: 1, rel: 0, loop: 1, playlist: track.videoId },
        events: {
          onReady: (ev) => {
            ytReady = true;
            ytLoadedKey = key;
            try { ev.target.setVolume(70); } catch (_) {}
            const wantedKey = ytPendingKey || selectedKey();
            if (TRACKS[wantedKey]?.videoId && wantedKey !== ytLoadedKey) {
              try { ev.target.cueVideoById(TRACKS[wantedKey].videoId); ytLoadedKey = wantedKey; } catch (_) {}
            }
            if (holding && ytWanted && selectedKey() !== 'classic') {
              try { ev.target.playVideo(); } catch (_) {}
            }
          }
        }
      });
    } catch (e) { console.warn('YouTube player init failed', e); }
  }

  function ensureYTApi() {
    if (window.YT?.Player) { initYTPlayer(); return; }
    if (ytApiRequested) return;
    ytApiRequested = true;
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function() {
      try { if (typeof previous === 'function') previous(); } catch (_) {}
      initYTPlayer();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      document.head.appendChild(s);
    }
  }

  function loadSelectedTrack(playNow = false) {
    const key = selectedKey();
    ytWanted = !!playNow;
    ytPendingKey = key;
    const { panel } = preparePlayerMount();
    const title = document.getElementById('coreYouTubeTitle');

    if (key === 'classic') {
      panel.style.display = 'none';
      try { ytPlayer?.pauseVideo?.(); } catch (_) {}
      return;
    }

    panel.style.display = 'block';
    if (title) title.textContent = `🎵 ${TRACKS[key].label} — hold to play`;
    ensureYTApi();
    if (!ytReady || !ytPlayer) return;

    try {
      if (ytLoadedKey !== key) {
        ytPlayer.cueVideoById(TRACKS[key].videoId);
        ytLoadedKey = key;
      }
      ytPlayer.setVolume(70);
      if (playNow) ytPlayer.playVideo();
    } catch (e) { console.warn('YouTube play failed', e); }
  }

  function pauseMusic() {
    ytWanted = false;
    try { ytPlayer?.pauseVideo?.(); } catch (_) {}
  }

  function startAt(x, y, pointer = null, sourceEvent = null) {
    if (holding || !pointInsideNeedoh(x, y)) return false;
    const now = Date.now();
    if (now - lastStartAt < 80) return false;
    lastStartAt = now;
    holding = true;
    activePointerId = pointer;
    lastPoint = { clientX: x, clientY: y };
    try { sourceEvent?.preventDefault?.(); } catch (_) {}

    const n = document.getElementById('needoh');
    n?.classList.add('final-holding');
    ring(lastPoint);
    loadSelectedTrack(true);
    performSquish();
    clearInterval(holdTimer);
    holdTimer = setInterval(performSquish, 105);
    return true;
  }

  function stop(pointer = null) {
    if (!holding) return;
    if (activePointerId !== null && pointer !== null && pointer !== activePointerId) return;
    holding = false;
    activePointerId = null;
    clearInterval(holdTimer); holdTimer = null;
    pauseMusic();
    const n = document.getElementById('needoh');
    if (n) {
      n.classList.remove('final-holding');
      n.classList.remove('squishing'); void n.offsetWidth; n.classList.add('squishing');
    }
  }

  function bindUniversalInput() {
    cloneNeedohOnce();
    const stage = document.getElementById('stage');
    if (stage) stage.style.touchAction = 'none';

    window.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startAt(e.clientX, e.clientY, e.pointerId ?? null, e);
    }, {capture:true, passive:false});
    window.addEventListener('pointermove', e => {
      if (!holding) return;
      if (activePointerId !== null && e.pointerId != null && e.pointerId !== activePointerId) return;
      lastPoint = {clientX:e.clientX, clientY:e.clientY};
    }, true);
    window.addEventListener('pointerup', e => stop(e.pointerId ?? null), true);
    window.addEventListener('pointercancel', e => stop(e.pointerId ?? null), true);

    // Mouse fallback for browsers/extensions that interfere with pointer events.
    window.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      startAt(e.clientX, e.clientY, null, e);
    }, {capture:true, passive:false});
    window.addEventListener('mouseup', () => stop(null), true);

    // Touch fallback for iOS/mobile browsers.
    window.addEventListener('touchstart', e => {
      const t = e.changedTouches?.[0]; if (!t) return;
      startAt(t.clientX, t.clientY, t.identifier ?? null, e);
    }, {capture:true, passive:false});
    window.addEventListener('touchmove', e => {
      if (!holding) return;
      const t = Array.from(e.changedTouches || []).find(x => activePointerId === null || x.identifier === activePointerId) || e.changedTouches?.[0];
      if (t) lastPoint = {clientX:t.clientX, clientY:t.clientY};
    }, {capture:true, passive:true});
    window.addEventListener('touchend', e => {
      const t = e.changedTouches?.[0]; stop(t?.identifier ?? null);
    }, true);
    window.addEventListener('touchcancel', () => stop(null), true);
    window.addEventListener('blur', () => stop(null), true);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(null); });
  }

  function showSoundPickerFinal() {
    const current = selectedKey();
    const cards = Object.entries(TRACKS).map(([key,t]) => `<button class="final-track-choice ${key===current?'active':''}" data-final-track="${key}"><b>🎵 ${esc(t.label)}</b><span>${key==='classic'?'Original game squish sound':'YouTube track — plays while you hold'}</span></button>`).join('');
    openHub('🎵 Hold Music', `<div class="notice">Choose what plays while you hold the squishy.</div><div class="final-track-grid">${cards}</div>`);
    document.querySelectorAll('[data-final-track]').forEach(btn => btn.onclick = () => {
      stop(null);
      localStorage.setItem(SOUND_KEY, btn.dataset.finalTrack);
      ytPendingKey = btn.dataset.finalTrack;
      loadSelectedTrack(false);
      if (typeof toast === 'function') toast(`🎵 Hold music: ${TRACKS[btn.dataset.finalTrack].label}`);
      showSoundPickerFinal();
    });
  }

  function ownSoundButton() {
    const soundBtn = document.getElementById('soundBtn');
    if (!soundBtn) return;
    let b = document.getElementById('holdSoundBtn');
    if (!b) {
      b = document.createElement('button'); b.className='btn'; b.id='holdSoundBtn';
      soundBtn.insertAdjacentElement('afterend', b);
    }
    b.textContent = '🎵 Hold Sound';
    b.onclick = showSoundPickerFinal;
  }

  ensureStyles();
  bindUniversalInput();
  ownSoundButton();
  loadSelectedTrack(false); // preload the selected YouTube player before the first hold.
  new MutationObserver(ownSoundButton).observe(document.body,{childList:true,subtree:true});

  // Small debug hooks so we can test state without touching game progress manually.
  window.__needohFinalInputState = () => ({holding, selected:selectedKey(), ytReady, squishes:Number(state?.squishes||0), coins:Number(state?.coins||0)});
})();