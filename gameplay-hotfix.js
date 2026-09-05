(() => {
  if (window.__needohGameplayHotfixV1) return;
  window.__needohGameplayHotfixV1 = true;

  const RESTOCK_KEY = 'needohStableRestockAtV1';
  const HOLD_SOUND_KEY = 'needohHoldSoundV1';
  const JAIL_UNTIL_KEY = 'needohAttilaJailUntilV1';
  const HOLD_PRESETS = {
    classic: { label: 'Classic Squish' },
    abnormal: { label: 'Funk Abnormal', wave: 'square', notes: [110, 165, 132, 196, 147, 220, 165, 247], length: .085 },
    uranium: { label: 'Montagem Uranium', wave: 'sawtooth', notes: [82, 123, 92, 138, 103, 155, 116, 174], length: .075 },
    monocle: { label: 'Funk Monocle', wave: 'triangle', notes: [147, 220, 185, 277, 165, 247, 196, 294], length: .095 }
  };

  function ensureStyles() {
    if (document.getElementById('gameplayHotfixStyles')) return;
    const style = document.createElement('style');
    style.id = 'gameplayHotfixStyles';
    style.textContent = `
      .hf-sound-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.hf-sound-choice{padding:15px;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:#fff;text-align:left;cursor:pointer}.hf-sound-choice.active{outline:2px solid #7cf7d4;background:rgba(124,247,212,.12)}.hf-sound-choice b{display:block;font-size:16px}.hf-sound-choice span{font-size:12px;color:#c8c7d7}
      #hfJailButton{position:fixed;z-index:65000;border:0;border-radius:999px;padding:13px 18px;font-weight:1000;font-size:15px;cursor:pointer;color:#20110d;background:linear-gradient(135deg,#ffd95e,#ff6b5e);box-shadow:0 14px 40px rgba(0,0,0,.5),0 0 28px rgba(255,217,94,.4);transition:left .55s ease,top .55s ease,transform .15s ease;white-space:nowrap}#hfJailButton:hover{transform:scale(1.08)}
      #hfAttilaJail{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(circle at 50% 20%,#3d4156,#13141b 58%,#07070a);color:#fff;text-align:center}#hfAttilaJail .hf-jail-card{width:min(680px,100%);padding:30px 24px;border-radius:28px;background:rgba(0,0,0,.52);border:2px solid #ffd95e;box-shadow:0 30px 100px rgba(0,0,0,.7),0 0 55px rgba(255,217,94,.18)}#hfAttilaJail .hf-bars{font-size:72px}#hfAttilaJail h1{margin:8px 0;font-size:clamp(34px,7vw,70px);color:#ffd95e}#hfAttilaJail .hf-count{font-size:clamp(42px,9vw,92px);font-weight:1000;margin:14px 0}#hfAttilaJail .hf-jail-note{color:#d8d8e4;font-weight:800}
      .hf-admin-jail{border:1px solid rgba(255,217,94,.35)!important;background:linear-gradient(135deg,rgba(255,217,94,.08),rgba(255,92,122,.08))!important}
      @media(max-width:620px){.hf-sound-grid{grid-template-columns:1fr}#hfJailButton{font-size:13px;padding:11px 14px}}
    `;
    document.head.appendChild(style);
  }

  ensureStyles();

  let stableRestockAt = 0;
  let restocking = false;
  const originalRestock = typeof restock === 'function' ? restock : null;

  function persistRestockAt(ms) {
    stableRestockAt = Math.floor(ms);
    try { localStorage.setItem(RESTOCK_KEY, String(stableRestockAt)); } catch (e) {}
    try { state.restockAt = stableRestockAt; } catch (e) {}
  }

  function initRestockClock() {
    const now = Date.now();
    let saved = Number(localStorage.getItem(RESTOCK_KEY));
    let current = Number(state?.restockAt);
    const validSaved = Number.isFinite(saved) && saved > now && saved - now <= 120000;
    const validCurrent = Number.isFinite(current) && current > now && current - now <= 120000;
    if (validCurrent) persistRestockAt(current);
    else if (validSaved) persistRestockAt(saved);
    else if (originalRestock) {
      try { originalRestock(false); } catch (e) { console.warn('Market restock recovery failed', e); }
      current = Number(state?.restockAt);
      persistRestockAt(Number.isFinite(current) && current > now ? current : now + 60000);
    } else persistRestockAt(now + 60000);
  }

  if (originalRestock) {
    restock = function(initial = false) {
      const result = originalRestock(initial);
      const end = Number(state?.restockAt);
      persistRestockAt(Number.isFinite(end) && end > Date.now() ? end : Date.now() + 60000);
      return result;
    };
  }

  function stableTimerTick() {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    const now = Date.now();
    const stateEnd = Number(state?.restockAt);
    if (Number.isFinite(stateEnd) && stateEnd > now && Math.abs(stateEnd - stableRestockAt) > 900) persistRestockAt(stateEnd);
    if (!stableRestockAt) initRestockClock();
    let left = stableRestockAt - now;
    if (left <= 0 && !restocking) {
      restocking = true;
      try {
        if (typeof restock === 'function') restock(false);
        else persistRestockAt(Date.now() + 60000);
      } finally {
        const end = Number(state?.restockAt);
        persistRestockAt(Number.isFinite(end) && end > Date.now() ? end : Date.now() + 60000);
        restocking = false;
      }
      left = stableRestockAt - Date.now();
    }
    const seconds = Math.max(0, Math.ceil(left / 1000));
    timerEl.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  initRestockClock();
  stableTimerTick();
  setInterval(stableTimerTick, 200);

  let fixedHoldTimer = null;
  let fixedHolding = false;
  let lastPointer = null;
  let holdStep = 0;
  let holdAudioCtx = null;
  const originalPlaySquishSound = typeof playSquishSound === 'function' ? playSquishSound : null;

  function selectedHoldSound() {
    const v = localStorage.getItem(HOLD_SOUND_KEY) || 'classic';
    return HOLD_PRESETS[v] ? v : 'classic';
  }

  function playPresetTone() {
    if (!state?.sound) return;
    const key = selectedHoldSound();
    const preset = HOLD_PRESETS[key];
    if (!preset || key === 'classic') return;
    try {
      holdAudioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (holdAudioCtx.state === 'suspended') holdAudioCtx.resume().catch(() => {});
      const t = holdAudioCtx.currentTime;
      const osc = holdAudioCtx.createOscillator();
      const gain = holdAudioCtx.createGain();
      const filter = holdAudioCtx.createBiquadFilter();
      const note = preset.notes[holdStep++ % preset.notes.length];
      osc.type = preset.wave;
      osc.frequency.setValueAtTime(note, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(45, note * .78), t + preset.length);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(key === 'uranium' ? 540 : key === 'abnormal' ? 760 : 980, t);
      gain.gain.setValueAtTime(.0001, t);
      gain.gain.exponentialRampToValueAtTime(.055, t + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, t + preset.length);
      osc.connect(filter); filter.connect(gain); gain.connect(holdAudioCtx.destination);
      osc.start(t); osc.stop(t + preset.length + .015);
    } catch (e) {}
  }

  if (originalPlaySquishSound) {
    playSquishSound = function(r) {
      if (fixedHolding && selectedHoldSound() !== 'classic') return playPresetTone();
      return originalPlaySquishSound(r);
    };
  }

  function doFixedSquish() {
    if (typeof squish !== 'function') return;
    try { squish(lastPointer); } catch (e) { console.warn('Hold squish failed', e); stopFixedHold(); }
  }

  function startFixedHold(e) {
    const target = e.target?.closest?.('#needoh');
    if (!target) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    lastPointer = e;
    fixedHolding = true;
    window.__needohHoldHotfixActive = true;
    clearInterval(fixedHoldTimer);
    doFixedSquish();
    fixedHoldTimer = setInterval(doFixedSquish, 105);
  }

  function stopFixedHold() {
    fixedHolding = false;
    window.__needohHoldHotfixActive = false;
    clearInterval(fixedHoldTimer);
    fixedHoldTimer = null;
  }

  document.addEventListener('pointerdown', startFixedHold, true);
  document.addEventListener('pointermove', e => { if (fixedHolding) lastPointer = e; }, true);
  window.addEventListener('pointerup', stopFixedHold, true);
  window.addEventListener('pointercancel', stopFixedHold, true);
  window.addEventListener('blur', stopFixedHold);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopFixedHold(); });

  function ensureSoundButton() {
    const soundBtn = document.getElementById('soundBtn');
    if (!soundBtn || document.getElementById('holdSoundBtn')) return;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.id = 'holdSoundBtn';
    btn.textContent = '🎵 Hold Sound';
    btn.onclick = showHoldSounds;
    soundBtn.insertAdjacentElement('afterend', btn);
  }

  function showHoldSounds() {
    const current = selectedHoldSound();
    const html = `<div class="notice">Choose the sound style that plays while you hold the squishy. These are original synthesized game sounds.</div><div class="hf-sound-grid">${Object.entries(HOLD_PRESETS).map(([key, p]) => `<button class="hf-sound-choice ${key === current ? 'active' : ''}" data-hfsound="${key}"><b>🎵 ${escapeHtml(p.label)}</b><span>${key === 'classic' ? 'Original squish sound' : 'Custom hold-only synth preset'}</span></button>`).join('')}</div>`;
    openHub('🎵 Hold Sounds', html);
    document.querySelectorAll('[data-hfsound]').forEach(btn => btn.onclick = () => {
      localStorage.setItem(HOLD_SOUND_KEY, btn.dataset.hfsound);
      toast(`🎵 Hold sound: ${HOLD_PRESETS[btn.dataset.hfsound].label}`);
      showHoldSounds();
    });
  }

  ensureSoundButton();

  let jailMoveTimer = null;
  let jailCountdownTimer = null;

  function jailUntil() { return Number(localStorage.getItem(JAIL_UNTIL_KEY)) || 0; }
  function formatJailLeft(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

  function renderJail() {
    const until = jailUntil();
    if (!until || until <= Date.now()) {
      localStorage.removeItem(JAIL_UNTIL_KEY);
      document.getElementById('hfAttilaJail')?.remove();
      clearInterval(jailCountdownTimer);
      jailCountdownTimer = null;
      return;
    }
    stopFixedHold();
    let overlay = document.getElementById('hfAttilaJail');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hfAttilaJail';
      overlay.innerHTML = `<div class="hf-jail-card"><div class="hf-bars">🚔 🔒</div><h1>ATTILA JAIL</h1><div class="hf-jail-note">You clicked the jail button. Sentence: 1 minute.</div><div class="hf-count" id="hfJailCountdown">1:00</div><div class="small">Your game continues when the timer reaches 0:00.</div></div>`;
      document.body.appendChild(overlay);
    }
    const count = document.getElementById('hfJailCountdown');
    if (count) count.textContent = formatJailLeft(until - Date.now());
    if (!jailCountdownTimer) jailCountdownTimer = setInterval(renderJail, 200);
  }

  function sendToAttilaJail() {
    localStorage.setItem(JAIL_UNTIL_KEY, String(Date.now() + 60000));
    document.getElementById('hfJailButton')?.remove();
    clearInterval(jailMoveTimer);
    jailMoveTimer = null;
    renderJail();
  }

  function moveJailButton(btn) {
    const margin = 18;
    const w = btn.offsetWidth || 210;
    const h = btn.offsetHeight || 48;
    const maxX = Math.max(margin, window.innerWidth - w - margin);
    const maxY = Math.max(margin, window.innerHeight - h - margin);
    btn.style.left = `${margin + Math.random() * Math.max(0, maxX - margin)}px`;
    btn.style.top = `${margin + Math.random() * Math.max(0, maxY - margin)}px`;
  }

  function spawnJailButton() {
    if (jailUntil() > Date.now() || document.getElementById('hfJailButton')) return;
    const btn = document.createElement('button');
    btn.id = 'hfJailButton';
    btn.textContent = '🚨 ATTILA JAIL — CLICK ME';
    btn.title = 'This button disappears after 10 seconds';
    btn.onclick = sendToAttilaJail;
    document.body.appendChild(btn);
    moveJailButton(btn);
    jailMoveTimer = setInterval(() => moveJailButton(btn), 650);
    setTimeout(() => {
      if (btn.isConnected) btn.remove();
      clearInterval(jailMoveTimer);
      jailMoveTimer = null;
    }, 10000);
  }

  function ensureAdminJailCard() {
    if (!isAdmin?.()) return;
    const title = document.getElementById('hubTitle')?.textContent || '';
    const host = document.getElementById('hubContent');
    if (!host || !/admin/i.test(title) || document.getElementById('hfAdminJailCard')) return;
    const card = document.createElement('div');
    card.id = 'hfAdminJailCard';
    card.className = 'card hf-admin-jail';
    card.style.marginTop = '14px';
    card.innerHTML = `<h3>🚔 Attila Jail</h3><p class="small">The moving jail button appears every minute, stays for 10 seconds, and jails whoever clicks it for 1 minute.</p><div class="card-row"><button class="btn gold" id="hfSpawnJailNow">🎯 Spawn Jail Button Now</button><button class="btn danger" id="hfTestJail">🔒 Jail Me for 1 Minute</button></div>`;
    host.appendChild(card);
    document.getElementById('hfSpawnJailNow').onclick = () => { closeHub(); spawnJailButton(); };
    document.getElementById('hfTestJail').onclick = () => { closeHub(); sendToAttilaJail(); };
  }

  const hubObserver = new MutationObserver(() => { ensureSoundButton(); ensureAdminJailCard(); });
  hubObserver.observe(document.body, { childList: true, subtree: true });

  renderJail();
  setInterval(spawnJailButton, 60000);
  window.__needohSpawnJailButton = spawnJailButton;
  window.__needohSendToAttilaJail = sendToAttilaJail;
})();
