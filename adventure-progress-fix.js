(() => {
  if (window.__needohAdventureProgressFixLoaded) return;

  const STORAGE_KEY = 'needohAdventureProgressFixV1';
  let redrawing = false;

  function adventureState() {
    state.seasonX = state.seasonX && typeof state.seasonX === 'object' ? state.seasonX : {};
    state.seasonX.adventure = {
      stage: 1,
      cleared: 0,
      hp: 0,
      ...(state.seasonX.adventure || {})
    };
    return state.seasonX.adventure;
  }

  function readProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const p = raw ? JSON.parse(raw) : null;
      return p && typeof p === 'object' ? p : null;
    } catch (_) {
      return null;
    }
  }

  function writeProgress(a = adventureState()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stage: Math.max(1, Math.min(30, Number(a.stage) || 1)),
        cleared: Math.max(0, Math.min(30, Number(a.cleared) || 0))
      }));
    } catch (_) {}
  }

  function normalizeProgress() {
    const a = adventureState();
    const stored = readProgress();

    let cleared = Math.max(0, Math.min(30, Number(a.cleared) || 0));
    let stage = Math.max(1, Math.min(30, Number(a.stage) || 1));

    if (stored) {
      cleared = Math.max(cleared, Math.max(0, Math.min(30, Number(stored.cleared) || 0)));
      stage = Math.max(stage, Math.max(1, Math.min(30, Number(stored.stage) || 1)));
    }

    // The next playable stage must always be one higher than the highest cleared stage.
    if (cleared < 30 && stage <= cleared) stage = cleared + 1;
    if (cleared >= 30) stage = 30;

    const changed = stage !== Number(a.stage) || cleared !== Number(a.cleared);
    a.stage = stage;
    a.cleared = cleared;
    if (changed) a.hp = 0;

    writeProgress(a);
    return { a, changed };
  }

  function redrawAdventure() {
    if (redrawing) return;
    if (String(document.getElementById('hubTitle')?.textContent || '') !== '🗺️ Adventure Mode') return;
    if (!window.__needohSeasonAdventure?.adventure) return;
    redrawing = true;
    try {
      window.__needohSeasonAdventure.adventure();
    } finally {
      setTimeout(() => { redrawing = false; }, 30);
    }
  }

  function patchAttackButton() {
    if (String(document.getElementById('hubTitle')?.textContent || '') !== '🗺️ Adventure Mode') return;

    const btn = document.getElementById('advAttack');
    if (!btn || btn.dataset.adventureProgressFixed === '1') return;

    const original = btn.onclick;
    btn.dataset.adventureProgressFixed = '1';

    btn.onclick = function (event) {
      const before = adventureState();
      const beforeStage = Math.max(1, Math.min(30, Number(before.stage) || 1));
      const result = typeof original === 'function' ? original.call(this, event) : undefined;

      setTimeout(() => {
        const current = adventureState();
        let cleared = Math.max(0, Math.min(30, Number(current.cleared) || 0));
        let stage = Math.max(1, Math.min(30, Number(current.stage) || 1));

        // If the original battle logic marked the stage cleared but failed to move forward,
        // force the next stage immediately.
        if (cleared >= beforeStage && beforeStage < 30 && stage <= beforeStage) {
          stage = beforeStage + 1;
          current.stage = stage;
          current.hp = 0;
        }

        // Also repair any old save that already has cleared progress but is stuck behind it.
        if (cleared < 30 && stage <= cleared) {
          current.stage = cleared + 1;
          current.hp = 0;
        }

        normalizeProgress();
        try { save(true); } catch (_) {}
        try { render(); } catch (_) {}
        redrawAdventure();
      }, 0);

      return result;
    };
  }

  function maintain() {
    const { changed } = normalizeProgress();
    if (changed) {
      try { save(true); } catch (_) {}
      try { render(); } catch (_) {}
      redrawAdventure();
    }
    patchAttackButton();
  }

  const observer = new MutationObserver(() => patchAttackButton());
  observer.observe(document.body, { childList: true, subtree: true });

  maintain();
  setInterval(maintain, 700);

  window.__needohAdventureProgressFixLoaded = true;
})();