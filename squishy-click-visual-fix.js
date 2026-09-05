(() => {
  if (window.__needohClickVisualFixV1) return;
  window.__needohClickVisualFixV1 = true;

  const style = document.createElement('style');
  style.id = 'needohClickVisualFixStyle';
  style.textContent = `
    #needoh.ivf-pressed{
      animation:none !important;
      transform:scaleX(1.16) scaleY(.74) rotate(2deg) !important;
      filter:brightness(1.18) saturate(1.12) !important;
      transition:transform .055s ease-out,filter .055s ease-out !important;
    }
    .ivf-tap-ring{
      position:absolute;
      width:34px;height:34px;
      margin-left:-17px;margin-top:-17px;
      border:3px solid rgba(255,255,255,.92);
      border-radius:50%;
      pointer-events:none;
      z-index:40;
      box-shadow:0 0 20px rgba(255,255,255,.55);
      animation:ivfTapRing .34s ease-out forwards;
    }
    @keyframes ivfTapRing{
      0%{transform:scale(.35);opacity:1}
      100%{transform:scale(2.2);opacity:0}
    }
  `;
  document.head.appendChild(style);

  let downPointerId = null;

  function isNeedohTarget(e) {
    return !!e.target?.closest?.('#needoh');
  }

  function showRing(e) {
    const stage = document.getElementById('stage');
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const ring = document.createElement('div');
    ring.className = 'ivf-tap-ring';
    let x = rect.width / 2;
    let y = rect.height / 2;
    if (Number.isFinite(e.clientX) && Number.isFinite(e.clientY)) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    stage.appendChild(ring);
    setTimeout(() => ring.remove(), 380);
  }

  function press(e) {
    if (!isNeedohTarget(e)) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    downPointerId = e.pointerId ?? null;
    const n = document.getElementById('needoh');
    if (n) {
      n.classList.remove('ivf-pressed');
      void n.offsetWidth;
      n.classList.add('ivf-pressed');
    }
    showRing(e);
  }

  function release(e) {
    if (downPointerId !== null && e?.pointerId != null && e.pointerId !== downPointerId) return;
    downPointerId = null;
    const n = document.getElementById('needoh');
    if (!n) return;
    n.classList.remove('ivf-pressed');
    n.classList.remove('squishing');
    void n.offsetWidth;
    n.classList.add('squishing');
  }

  // Runs before the document-level hold hotfix, which stops pointer propagation.
  window.addEventListener('pointerdown', press, true);
  window.addEventListener('pointerup', release, true);
  window.addEventListener('pointercancel', release, true);
  window.addEventListener('blur', () => release({}), true);
})();
