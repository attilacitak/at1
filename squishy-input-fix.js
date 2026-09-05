(() => {
  if (window.__needohSquishyInputFixV2) return;
  window.__needohSquishyInputFixV2 = true;

  let holding = false;
  let activePointerId = null;
  let holdTimer = null;
  let lastPoint = null;

  function isNeedohPress(e) {
    return !!e?.target?.closest?.('#needoh');
  }

  function pointFrom(e) {
    return {
      clientX: Number.isFinite(e?.clientX) ? e.clientX : 0,
      clientY: Number.isFinite(e?.clientY) ? e.clientY : 0
    };
  }

  function performSquish() {
    if (!holding || typeof squish !== 'function') return;
    try {
      squish(lastPoint);
    } catch (err) {
      console.warn('Unified squish failed', err);
      stopHold();
    }
  }

  function startHold(e) {
    if (!isNeedohPress(e)) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (holding) return;

    // This controller owns squishy input. Stop the older document/element
    // handlers so a press cannot get swallowed or double-counted.
    e.preventDefault();
    e.stopImmediatePropagation();

    holding = true;
    activePointerId = e.pointerId ?? null;
    lastPoint = pointFrom(e);
    window.__needohUnifiedHoldActive = true;

    performSquish();
    clearInterval(holdTimer);
    holdTimer = setInterval(performSquish, 105);
  }

  function moveHold(e) {
    if (!holding) return;
    if (activePointerId !== null && e.pointerId != null && e.pointerId !== activePointerId) return;
    lastPoint = pointFrom(e);
  }

  function stopHold(e) {
    if (holding && activePointerId !== null && e?.pointerId != null && e.pointerId !== activePointerId) return;
    holding = false;
    activePointerId = null;
    window.__needohUnifiedHoldActive = false;
    clearInterval(holdTimer);
    holdTimer = null;

    const n = document.getElementById('needoh');
    if (n) {
      n.classList.remove('ivf-pressed');
      n.classList.remove('squishing');
      void n.offsetWidth;
      n.classList.add('squishing');
    }
  }

  // Window capture happens before the older document-level hotfix that was
  // swallowing pointer events. Because this script loads last, it becomes the
  // single source of truth for coin-producing press/hold behavior.
  window.addEventListener('pointerdown', startHold, true);
  window.addEventListener('pointermove', moveHold, true);
  window.addEventListener('pointerup', stopHold, true);
  window.addEventListener('pointercancel', stopHold, true);
  window.addEventListener('blur', () => stopHold({}), true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopHold({});
  });

  window.__needohForceSquish = () => {
    holding = true;
    lastPoint = null;
    performSquish();
    holding = false;
  };
})();
