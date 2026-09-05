(() => {
  if (window.__needohCoreControlsV1) return;
  window.__needohCoreControlsV1 = true;

  const SOUND_KEY = 'needohHoldSoundV1';
  const RESTOCK_KEY = 'needohStableRestockAtV2';
  const JAIL_KEY = 'needohAttilaJailUntilV1';
  const TRACKS = {
    classic: { label: 'Classic Squish' },
    abnormal: { label: 'Funk Abnormal', videoId: 'dWXMw_jOtSI' },
    uranium: { label: 'Montagem Uranium', videoId: 'EYsvBhN0dnc' },
    monocle: { label: 'Funk Monocle', videoId: 'eYIum8HMB0Y' }
  };

  let holding = false;
  let pointerId = null;
  let holdTimer = null;
  let lastPoint = { clientX: 0, clientY: 0 };
  let jailTimer = null;

  function esc(v) {
    try { return typeof escapeHtml === 'function' ? escapeHtml(v) : String(v); }
    catch (_) { return String(v); }
  }

  function selectedTrack() {
    const key = localStorage.getItem(SOUND_KEY) || 'classic';
    return TRACKS[key] ? key : 'classic';
  }

  function addStyles() {
    if (document.getElementById('needohCoreControlsStyle')) return;
    const s = document.createElement('style');
    s.id = 'needohCoreControlsStyle';
    s.textContent = `
      #needoh.core-holding{animation:none!important;transform:scaleX(1.16) scaleY(.74) rotate(2deg)!important;filter:brightness(1.16) saturate(1.08)!important;transition:transform .055s ease-out,filter .055s ease-out!important}
      .core-tap-ring{position:absolute;width:34px;height:34px;margin-left:-17px;margin-top:-17px;border:3px solid rgba(255,255,255,.92);border-radius:50%;pointer-events:none;z-index:45;box-shadow:0 0 20px rgba(255,255,255,.55);animation:coreTapRing .34s ease-out forwards}
      @keyframes coreTapRing{0%{transform:scale(.35);opacity:1}100%{transform:scale(2.2);opacity:0}}
      .core-track-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.core-track{padding:14px;border-radius:15px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);color:#fff;text-align:left;cursor:pointer}.core-track.active{outline:2px solid #7cf7d4;background:rgba(124,247,212,.12)}.core-track b{display:block;font-size:15px}.core-track span{display:block;margin-top:4px;font-size:12px;color:#c8c7d7}
      #coreYouTubePanel{position:fixed;left:16px;bottom:16px;width:210px;z-index:50000;border-radius:16px;overflow:hidden;background:#0d1020;border:1px solid rgba(255,255,255,.18);box-shadow:0 16px 46px rgba(0,0,0,.45);display:none}#coreYouTubePanel .core-yt-title{padding:8px 10px;font-size:12px;font-weight:900;color:#fff;background:rgba(0,0,0,.34)}#coreYouTubePanel iframe{display:block;width:210px;height:200px;border:0;background:#000}
      #hfJailButton{position:fixed!important;right:22px!important;bottom:22px!important;left:auto!important;top:auto!important;z-index:65000;border:0;border-radius:999px;padding:13px 18px;font-weight:1000;font-size:15px;cursor:pointer;color:#20110d;background:linear-gradient(135deg,#ffd95e,#ff6b5e);box-shadow:0 14px 40px rgba(0,0,0,.5),0 0 28px rgba(255,217,94,.4);white-space:nowrap}
      #hfAttilaJail{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(circle at 50% 20%,#3d4156,#13141b 58%,#07070a);color:#fff;text-align:center}#hfAttilaJail .core-jail-card{width:min(680px,100%);padding:30px 24px;border-radius:28px;background:rgba(0,0,0,.52);border:2px solid #ffd95e;box-shadow:0 30px 100px rgba(0,0,0,.7)}#hfAttilaJail h1{margin:8px 0;font-size:clamp(34px,7vw,70px);color:#ffd95e}#hfAttilaJail .core-jail-count{font-size:clamp(42px,9vw,92px);font-weight:1000;margin:14px 0}
      @media(max-width:620px){.core-track-grid{grid-template-columns:1fr}#coreYouTubePanel{left:8px;bottom:8px;width:200px}#coreYouTubePanel iframe{width:200px;height:200px}#hfJailButton{right:12px!important;bottom:12px!important;font-size:13px;padding:11px 14px}}
    `;
    document.head.appendChild(s);
  }

  function showTapRing(point) {
    const stage = document.getElementById('stage');
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const ring = document.createElement('div');
    ring.className = 'core-tap-ring';
    const x = point.clientX ? point.clientX - rect.left : rect.width / 2;
    const y = point.clientY ? point.clientY - rect.top : rect.height / 2;
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    stage.appendChild(ring);
    setTimeout(() => ring.remove(), 380);
  }

  function cloneNeedohToClearOldHandlers() {
    const old = document.getElementById('needoh');
    if (!old || old.dataset.coreInput === '1') return old;
    const fresh = old.cloneNode(true);
    fresh.dataset.coreInput = '1';
    fresh.style.touchAction = 'none';
    old.replaceWith(fresh);
    return fresh;
  }

  function doSquish() {
    if (!holding || typeof squish !== 'function') return;
    try { squish(lastPoint); }
    catch (e) {
      console.error('Core squish failed', e);
      stopHold();
    }
  }

  function startHold(e) {
    if (holding) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    holding = true;
    pointerId = e.pointerId ?? null;
    lastPoint = { clientX: e.clientX || 0, clientY: e.clientY || 0 };
    e.preventDefault();
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch (_) {}
    e.currentTarget.classList.add('core-holding');
    showTapRing(lastPoint);
    startTrack();
    doSquish();
    clearInterval(holdTimer);
    holdTimer = setInterval(doSquish, 105);
  }

  function moveHold(e) {
    if (!holding) return;
    if (pointerId !== null && e.pointerId != null && e.pointerId !== pointerId) return;
    lastPoint = { clientX: e.clientX || 0, clientY: e.clientY || 0 };
  }

  function stopHold(e) {
    if (holding && pointerId !== null && e?.pointerId != null && e.pointerId !== pointerId) return;
    holding = false;
    pointerId = null;
    clearInterval(holdTimer);
    holdTimer = null;
    pauseTracks();
    const n = document.getElementById('needoh');
    if (n) {
      n.classList.remove('core-holding');
      n.classList.remove('squishing');
      void n.offsetWidth;
      n.classList.add('squishing');
    }
  }

  function bindInput() {
    const n = cloneNeedohToClearOldHandlers();
    if (!n || n.dataset.coreBound === '1') return;
    n.dataset.coreBound = '1';
    n.addEventListener('pointerdown', startHold, { passive: false });
    n.addEventListener('pointermove', moveHold, { passive: true });
    n.addEventListener('pointerup', stopHold, { passive: true });
    n.addEventListener('pointercancel', stopHold, { passive: true });
    window.addEventListener('pointerup', stopHold, true);
    window.addEventListener('pointercancel', stopHold, true);
    window.addEventListener('blur', () => stopHold({}), true);
  }

  const originalPlaySquishSound = typeof playSquishSound === 'function' ? playSquishSound : null;
  if (originalPlaySquishSound) {
    playSquishSound = function(r) {
      if (holding && selectedTrack() !== 'classic') return;
      return originalPlaySquishSound(r);
    };
  }

  function ensureYouTubePanel() {
    let panel = document.getElementById('coreYouTubePanel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'coreYouTubePanel';
    panel.innerHTML = '<div class="core-yt-title" id="coreYouTubeTitle">YouTube Hold Music</div><div id="coreYouTubeFrameHost"></div>';
    document.body.appendChild(panel);
    return panel;
  }

  function iframeFor(key) {
    const track = TRACKS[key];
    if (!track?.videoId) return null;
    const host = document.getElementById('coreYouTubeFrameHost');
    if (!host) return null;
    let frame = document.getElementById(`coreYT_${key}`);
    if (frame) return frame;
    frame = document.createElement('iframe');
    frame.id = `coreYT_${key}`;
    frame.title = track.label;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.setAttribute('allowfullscreen', '');
    frame.src = `https://www.youtube.com/embed/${track.videoId}?enablejsapi=1&playsinline=1&controls=1&rel=0&loop=1&playlist=${track.videoId}`;
    frame.style.display = 'none';
    host.appendChild(frame);
    return frame;
  }

  function ytCommand(frame, func, args = []) {
    try { frame?.contentWindow?.postMessage(JSON.stringify({ event:'command', func, args }), 'https://www.youtube.com'); }
    catch (_) {}
  }

  function pauseTracks() {
    Object.keys(TRACKS).forEach(key => {
      const f = document.getElementById(`coreYT_${key}`);
      if (f) ytCommand(f, 'pauseVideo');
    });
  }

  function showSelectedFrame() {
    const key = selectedTrack();
    const panel = ensureYouTubePanel();
    const title = document.getElementById('coreYouTubeTitle');
    panel.querySelectorAll('iframe').forEach(f => f.style.display = 'none');
    if (key === 'classic') {
      panel.style.display = 'none';
      return null;
    }
    const frame = iframeFor(key);
    if (title) title.textContent = `🎵 ${TRACKS[key].label} — hold to play`;
    if (frame) frame.style.display = 'block';
    panel.style.display = 'block';
    return frame;
  }

  function startTrack() {
    const key = selectedTrack();
    if (key === 'classic') return;
    try { if (state && state.sound === false) return; } catch (_) {}
    pauseTracks();
    const frame = showSelectedFrame();
    if (!frame) return;
    ytCommand(frame, 'setVolume', [70]);
    ytCommand(frame, 'playVideo');
  }

  function ensureSoundPickerButton() {
    const soundBtn = document.getElementById('soundBtn');
    if (!soundBtn) return;
    let b = document.getElementById('holdSoundBtn');
    if (!b) {
      b = document.createElement('button');
      b.className = 'btn';
      b.id = 'holdSoundBtn';
      b.textContent = '🎵 Hold Sound';
      soundBtn.insertAdjacentElement('afterend', b);
    }
    b.onclick = showSoundPicker;
  }

  function showSoundPicker() {
    const current = selectedTrack();
    const cards = Object.entries(TRACKS).map(([key,t]) => `<button class="core-track ${key===current?'active':''}" data-core-track="${key}"><b>🎵 ${esc(t.label)}</b><span>${key==='classic'?'Original squish sound':'YouTube track — plays while held'}</span></button>`).join('');
    openHub('🎵 Hold Music', `<div class="notice">Choose what plays while you hold the squishy.</div><div class="core-track-grid">${cards}</div>`);
    document.querySelectorAll('[data-core-track]').forEach(btn => btn.onclick = () => {
      pauseTracks();
      localStorage.setItem(SOUND_KEY, btn.dataset.coreTrack);
      showSelectedFrame();
      toast(`🎵 Hold music: ${TRACKS[btn.dataset.coreTrack].label}`);
      showSoundPicker();
    });
  }

  function stabilizeMarketClock() {
    const now = Date.now();
    const current = Number(state?.restockAt);
    const saved = Number(localStorage.getItem(RESTOCK_KEY));
    if (Number.isFinite(current) && current > now && current-now <= 120000) localStorage.setItem(RESTOCK_KEY, String(current));
    else if (Number.isFinite(saved) && saved > now && saved-now <= 120000) state.restockAt = saved;
    else state.restockAt = now + 60000;

    if (typeof restock === 'function') {
      const oldRestock = restock;
      restock = function(initial=false) {
        const out = oldRestock(initial);
        const end = Number(state?.restockAt);
        localStorage.setItem(RESTOCK_KEY, String(Number.isFinite(end) && end > Date.now() ? end : Date.now()+60000));
        return out;
      };
    }
    setInterval(() => {
      const end = Number(state?.restockAt);
      if (Number.isFinite(end) && end > Date.now()) localStorage.setItem(RESTOCK_KEY, String(end));
    }, 1000);
  }

  function jailUntil() { return Number(localStorage.getItem(JAIL_KEY)) || 0; }
  function jailLeft(ms) { const s=Math.max(0,Math.ceil(ms/1000)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }

  function renderJail() {
    const until = jailUntil();
    if (!until || until <= Date.now()) {
      localStorage.removeItem(JAIL_KEY);
      document.getElementById('hfAttilaJail')?.remove();
      clearInterval(jailTimer); jailTimer = null;
      return;
    }
    stopHold({});
    let o = document.getElementById('hfAttilaJail');
    if (!o) {
      o = document.createElement('div');
      o.id = 'hfAttilaJail';
      o.innerHTML = '<div class="core-jail-card"><div style="font-size:72px">🚔 🔒</div><h1>ATTILA JAIL</h1><div>You clicked the jail button. Sentence: 1 minute.</div><div class="core-jail-count" id="coreJailCount">1:00</div><div class="small">Your game returns automatically at 0:00.</div></div>';
      document.body.appendChild(o);
    }
    const count = document.getElementById('coreJailCount');
    if (count) count.textContent = jailLeft(until-Date.now());
    if (!jailTimer) jailTimer = setInterval(renderJail, 200);
  }

  function sendSelfToJail() {
    localStorage.setItem(JAIL_KEY, String(Date.now()+60000));
    document.getElementById('hfJailButton')?.remove();
    renderJail();
  }

  function spawnJailButton() {
    if (jailUntil() > Date.now() || document.getElementById('hfJailButton')) return;
    const b = document.createElement('button');
    b.id = 'hfJailButton';
    b.textContent = '🚨 ATTILA JAIL — CLICK ME';
    b.title = 'This button stays here for 10 seconds';
    b.onclick = sendSelfToJail;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 10000);
  }

  function ensureAdminJailSpawn() {
    const host = document.getElementById('hubContent');
    const title = document.getElementById('hubTitle')?.textContent || '';
    let admin = false;
    try { admin = typeof isAdmin === 'function' && isAdmin(); } catch (_) {}
    if (!admin || !host || !/admin/i.test(title) || document.getElementById('coreLocalJailCard')) return;
    const card = document.createElement('div');
    card.id = 'coreLocalJailCard'; card.className = 'card'; card.style.marginTop='14px';
    card.innerHTML = '<h3>🚨 Jail Button</h3><p class="small">Spawns in the bottom-right and stays still for 10 seconds.</p><button class="btn gold" id="coreSpawnJail">Spawn Jail Button Now</button>';
    host.appendChild(card);
    document.getElementById('coreSpawnJail').onclick = () => { closeHub(); spawnJailButton(); };
  }

  addStyles();
  bindInput();
  ensureYouTubePanel();
  ensureSoundPickerButton();
  showSelectedFrame();
  stabilizeMarketClock();
  renderJail();
  setInterval(spawnJailButton, 60000);
  new MutationObserver(() => { ensureSoundPickerButton(); ensureAdminJailSpawn(); }).observe(document.body,{childList:true,subtree:true});
  window.__needohSpawnJailButton = spawnJailButton;
  window.__needohSendToAttilaJail = sendSelfToJail;
})();