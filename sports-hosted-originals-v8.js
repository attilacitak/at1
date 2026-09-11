(() => {
  if (window.__needohHostedSportsV8Fixed) return;
  window.__needohHostedSportsV8Fixed = true;

  const HOSTED = {
    basketball: {
      title: '🏀 Basket Random',
      url: 'https://sites.google.com/site/populardoodlegames/basket-random?pli=1&authuser=0'
    },
    soccer: {
      title: '⚽ Soccer Random',
      url: 'https://sites.google.com/site/populardoodlegames/soccer-random'
    }
  };

  document.getElementById('needohHostedSportsV8')?.remove();
  document.getElementById('needohHostedSportsV8Styles')?.remove();

  const style = document.createElement('style');
  style.id = 'needohHostedSportsV8Styles';
  style.textContent = `
    #needohHostedSportsV8{position:fixed;inset:0;z-index:9000;display:none;background:#070b16;color:#fff;pointer-events:none}
    #needohHostedSportsV8.show{display:flex;flex-direction:column;pointer-events:auto}
    #needohHostedSportsV8Top{height:54px;flex:0 0 54px;display:flex;align-items:center;gap:10px;padding:0 12px;background:#10172a;border-bottom:1px solid #ffffff20;box-sizing:border-box}
    #needohHostedSportsV8Title{font:900 16px system-ui,-apple-system,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #needohHostedSportsV8Spacer{flex:1}
    .needohHostedSportsV8Btn{border:0;border-radius:10px;padding:9px 12px;background:#ffffff18;color:#fff;font:800 13px system-ui,-apple-system,sans-serif;cursor:pointer;text-decoration:none;white-space:nowrap}
    .needohHostedSportsV8Btn:hover{background:#ffffff28}
    #needohHostedSportsV8Open{background:#4e67ff}
    #needohHostedSportsV8Frame{width:100%;height:calc(100% - 54px);border:0;background:#fff;display:block}
    .needohHostedBadge{display:inline-flex;align-items:center;margin-top:7px;padding:4px 7px;border-radius:999px;background:#ffffff12;border:1px solid #ffffff1e;font-size:10px;font-weight:900;color:#cfd5ff}
  `;
  document.head.appendChild(style);

  const shell = document.createElement('div');
  shell.id = 'needohHostedSportsV8';
  shell.innerHTML = `
    <div id="needohHostedSportsV8Top">
      <button id="needohHostedSportsV8Close" class="needohHostedSportsV8Btn">← Sports Menu</button>
      <div id="needohHostedSportsV8Title">Hosted Game</div>
      <div id="needohHostedSportsV8Spacer"></div>
      <a id="needohHostedSportsV8Open" class="needohHostedSportsV8Btn" href="#" target="_blank" rel="noopener noreferrer">Open Directly ↗</a>
    </div>
    <iframe id="needohHostedSportsV8Frame" title="Hosted sports game" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>
  `;
  document.body.appendChild(shell);

  const frame = shell.querySelector('#needohHostedSportsV8Frame');
  const title = shell.querySelector('#needohHostedSportsV8Title');
  const direct = shell.querySelector('#needohHostedSportsV8Open');

  function closeHosted(){
    shell.classList.remove('show');
    frame.src = 'about:blank';
  }

  function openHosted(kind){
    const chosen = HOSTED[kind];
    if (!chosen) return;
    title.textContent = chosen.title;
    direct.href = chosen.url;
    frame.src = chosen.url;
    shell.classList.add('show');
  }

  shell.querySelector('#needohHostedSportsV8Close').onclick = closeHosted;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && shell.classList.contains('show')) closeHosted();
  });

  function patchCards(){
    for (const rootSel of ['#nsa4Menu','#nsa5Menu','#l2pMenu']) {
      const root = document.querySelector(rootSel);
      if (!root) continue;
      const b = root.querySelector('[data-game="basketball"]');
      const s = root.querySelector('[data-game="soccer"]');
      if (b && b.dataset.hostedPatched !== '1') {
        b.dataset.hostedPatched = '1';
        b.innerHTML = '<b>🏀 Basket Random — Hosted</b><span>Opens the Basket Random page you chose.</span><span class="needohHostedBadge">HOSTED GAME</span>';
      }
      if (s && s.dataset.hostedPatched !== '1') {
        s.dataset.hostedPatched = '1';
        s.innerHTML = '<b>⚽ Soccer Random — Hosted</b><span>Opens the Soccer Random page you chose.</span><span class="needohHostedBadge">HOSTED GAME</span>';
      }
    }
  }

  patchCards();
  setTimeout(patchCards, 500);
  setTimeout(patchCards, 1500);

  document.addEventListener('click', e => {
    const card = e.target.closest?.('[data-game]');
    if (!card) return;
    const menu = card.closest('#nsa4Menu,#nsa5Menu,#l2pMenu');
    if (!menu) return;
    const kind = card.dataset.game;
    if (kind !== 'basketball' && kind !== 'soccer') return;
    e.preventDefault();
    e.stopPropagation();
    openHosted(kind);
  }, true);
})();
