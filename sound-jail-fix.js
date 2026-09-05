(() => {
  if (window.__needohSoundJailFixV3) return;
  window.__needohSoundJailFixV3 = true;

  const SOUND_KEY = 'needohHoldSoundV1';
  const JAIL_PREFIX = 'ATTILA_JAIL:';
  const SB_URL = 'https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY = 'sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers = { apikey: SB_KEY, 'Content-Type': 'application/json' };

  const PRESETS = {
    abnormal: { label:'Funk Abnormal', wave:'square', notes:[130.81,196,155.56,233.08,146.83,220,174.61,261.63], interval:112, length:.10, cutoff:1200 },
    uranium: { label:'Montagem Uranium', wave:'sawtooth', notes:[82.41,123.47,92.50,138.59,103.83,155.56,116.54,174.61], interval:92, length:.083, cutoff:720 },
    monocle: { label:'Funk Monocle', wave:'triangle', notes:[174.61,261.63,220,329.63,196,293.66,233.08,349.23], interval:124, length:.112, cutoff:1500 }
  };

  let ctx = null;
  let soundTimer = null;
  let soundStep = 0;
  let customHoldActive = false;
  let previewToken = 0;

  function selectedSound() {
    const key = localStorage.getItem(SOUND_KEY) || 'classic';
    return PRESETS[key] ? key : 'classic';
  }

  function turnSoundOn() {
    try {
      if (state && state.sound === false) {
        state.sound = true;
        if (typeof render === 'function') render();
        if (typeof save === 'function') save(true);
      }
    } catch (e) {}
  }

  function ensureAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return Promise.reject(new Error('Web Audio unavailable'));
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') return ctx.resume().then(() => ctx);
    return Promise.resolve(ctx);
  }

  function tone(preset, strong=false) {
    if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const freq = preset.notes[soundStep++ % preset.notes.length];
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const subGain = ctx.createGain();

    osc.type = preset.wave;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(45, freq * .78), t + preset.length);
    sub.type = 'sine';
    sub.frequency.setValueAtTime(Math.max(40, freq / 2), t);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(preset.cutoff, t);
    filter.Q.setValueAtTime(4.5, t);

    gain.gain.setValueAtTime(.0001, t);
    gain.gain.exponentialRampToValueAtTime(strong ? .13 : .085, t + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, t + preset.length);
    subGain.gain.setValueAtTime(.0001, t);
    subGain.gain.exponentialRampToValueAtTime(strong ? .055 : .035, t + .008);
    subGain.gain.exponentialRampToValueAtTime(.0001, t + preset.length);

    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    sub.connect(subGain); subGain.connect(ctx.destination);
    osc.start(t); sub.start(t);
    osc.stop(t + preset.length + .02); sub.stop(t + preset.length + .02);
  }

  function stopCustomHold() {
    customHoldActive = false;
    window.__needohSoundFinalActive = false;
    clearInterval(soundTimer);
    soundTimer = null;
  }

  function startCustomHold() {
    const key = selectedSound();
    const preset = PRESETS[key];
    if (!preset) return stopCustomHold();
    turnSoundOn();
    customHoldActive = true;
    window.__needohSoundFinalActive = true;
    clearInterval(soundTimer);
    ensureAudio().then(() => {
      if (!customHoldActive || selectedSound() !== key) return;
      tone(preset, true);
      soundTimer = setInterval(() => {
        if (!customHoldActive) return stopCustomHold();
        tone(preset, false);
      }, preset.interval);
    }).catch(e => console.warn('Hold sound could not start', e));
  }

  // Window capture runs before the older document-level hold hotfix.
  window.addEventListener('pointerdown', e => {
    if (e.target?.closest?.('#needoh') && selectedSound() !== 'classic') startCustomHold();
  }, true);
  window.addEventListener('pointerup', stopCustomHold, true);
  window.addEventListener('pointercancel', stopCustomHold, true);
  window.addEventListener('blur', stopCustomHold);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopCustomHold(); });

  // Prevent the old custom synth from doubling over the replacement audio engine.
  const oldPlay = typeof playSquishSound === 'function' ? playSquishSound : null;
  if (oldPlay) {
    playSquishSound = function(r) {
      if (window.__needohSoundFinalActive) return;
      return oldPlay(r);
    };
  }

  function previewSound(key) {
    const preset = PRESETS[key];
    if (!preset) return;
    turnSoundOn();
    const token = ++previewToken;
    soundStep = 0;
    ensureAudio().then(() => {
      let n = 0;
      const play = () => {
        if (token !== previewToken || n >= 8) return;
        tone(preset, n === 0);
        n++;
        setTimeout(play, preset.interval);
      };
      play();
    }).catch(() => {});
  }

  // Selecting a sound is itself a user gesture, so unlock audio and preview immediately.
  window.addEventListener('pointerdown', e => {
    const choice = e.target?.closest?.('[data-hfsound]');
    if (!choice) return;
    const key = choice.dataset.hfsound;
    if (!key) return;
    if (key !== 'classic') {
      localStorage.setItem(SOUND_KEY, key);
      previewSound(key);
    } else {
      ++previewToken;
      stopCustomHold();
    }
  }, true);

  async function api(path, opts={}) {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, { ...opts, headers:{...headers,...(opts.headers||{})} });
    if (!r.ok) throw new Error((await r.text()) || `Online error ${r.status}`);
    if (r.status === 204) return null;
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  }

  function ownerAdmin() {
    try {
      if (typeof window.__needohIsOwnerAdmin === 'function' && window.__needohIsOwnerAdmin()) return true;
      return typeof playerName === 'function' && playerName().toLowerCase() === 'attila';
    } catch (e) { return false; }
  }

  function esc(v) {
    try { return typeof escapeHtml === 'function' ? escapeHtml(v) : String(v); }
    catch (e) { return String(v); }
  }

  let jailCardLoading = false;
  async function ensureRemoteJailCard() {
    if (!ownerAdmin() || jailCardLoading) return;
    const host = document.getElementById('hubContent');
    const title = document.getElementById('hubTitle')?.textContent || '';
    if (!host || !/admin/i.test(title)) return;

    // Remove the older local-only jail card so there is one clear jail control.
    document.getElementById('hfAdminJailCard')?.remove();
    if (document.getElementById('sjRemoteJailCard')) return;

    jailCardLoading = true;
    const card = document.createElement('div');
    card.id = 'sjRemoteJailCard';
    card.className = 'card danger-box';
    card.style.marginTop = '14px';
    card.innerHTML = '<h3>🚔 Attila Jail — Online</h3><div class="small">Loading online players…</div>';
    host.appendChild(card);

    try {
      const players = await api('needoh_players?select=player_key,display_name,updated_at&order=updated_at.desc&limit=200');
      const others = (players || []).filter(p => p.player_key && p.player_key !== 'attila');
      const options = others.map(p => `<option value="${esc(p.player_key)}">${esc(p.display_name || p.player_key)}</option>`).join('');
      card.innerHTML = `<h3>🚔 Attila Jail — Online</h3><p class="small">Choose another player. They will get the Attila Jail screen for exactly 1 minute on their game.</p><select class="field" id="sjJailPlayer">${options || '<option value="">No other players found</option>'}</select><input class="field" id="sjJailReason" maxlength="160" placeholder="Reason (optional)"><button class="btn danger" id="sjJailSend">🚔 SEND TO JAIL — 1 MINUTE</button><div class="small" id="sjJailStatus" style="margin-top:8px"></div>`;
      const send = document.getElementById('sjJailSend');
      if (send) send.onclick = async () => {
        const target = document.getElementById('sjJailPlayer')?.value || '';
        const reasonText = String(document.getElementById('sjJailReason')?.value || '').trim().slice(0,160);
        const p = others.find(x => x.player_key === target);
        const display = p?.display_name || target;
        if (!target) return typeof toast === 'function' && toast('Choose a player');
        const status = document.getElementById('sjJailStatus');
        if (status) status.textContent = `Sending ${display} to jail…`;
        try {
          await api('needoh_kicks', {
            method:'POST', headers:{Prefer:'return=minimal'},
            body:JSON.stringify([{target_key:target,target_name:display,admin_name:'Attila',reason:`${JAIL_PREFIX}${reasonText || 'Sent to Attila Jail'}`}])
          });
          if (status) status.textContent = `✅ ${display} is in Attila Jail for 1 minute.`;
          if (typeof toast === 'function') toast(`🚔 ${display} sent to Attila Jail`);
        } catch (e) {
          console.warn('Remote jail failed', e);
          if (status) status.textContent = `❌ Could not jail ${display}.`;
          if (typeof toast === 'function') toast('Could not send player to jail');
        }
      };
    } catch (e) {
      console.warn('Could not load jail players', e);
      card.innerHTML = '<h3>🚔 Attila Jail — Online</h3><div class="small">Could not load online players.</div>';
    } finally {
      jailCardLoading = false;
    }
  }

  const observer = new MutationObserver(() => {
    document.getElementById('hfAdminJailCard')?.remove();
    ensureRemoteJailCard();
  });
  observer.observe(document.body, {childList:true, subtree:true});
  setInterval(ensureRemoteJailCard, 1000);
})();
