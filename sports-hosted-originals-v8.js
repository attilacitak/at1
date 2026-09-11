(() => {
  if (window.__needohHostedSportsV8) return;
  window.__needohHostedSportsV8 = true;

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

  const style = document.createElement('style');
  style.id = 'needohHostedSportsV8Styles';
  style.textContent = `
    #needohHostedSportsV8{position:fixed;inset:0;z-index:9000;display:none;background:#070b16;color:#fff}
    #needohHostedSportsV8.show{display:flex;flex-direction:column}
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
    <iframe id="needohHostedSportsV8Frame" title="Hosted sports game" allow="fullscreen; autoplay; gamepad" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
  `;
  document.body.appendChild(shell);

  const frame = document.getElementById('needohHostedSportsV8Frame');
  const title = document.getElementById('needohHostedSportsV8Title');
  const direct = document.getElementById('needohHostedSportsV8Open');

  function closeHosted(){
    shell.classList.remove('show');
    frame.src = 'about:blank';
  }

  function openHosted(kind){
    const game = HOSTED[kind];
    if (!game) return;
    title.textContent = game.title;
    direct.href = game.url;
    frame.src = game.url;
    shell.classList.add('show');
    setTimeout(() => { try { frame.focus(); } catch (_) {} }, 250);
  }

  document.getElementById('needohHostedSportsV8Close').addEventListener('click', closeHosted);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && shell.classList.contains('show')) {
      e.preventDefault();
      closeHosted();
    }
  }, true);

  function patchCards(){
    const roots = ['#nsa4Menu','#nsa5Menu','#l2pMenu'];
    for (const rootSel of roots){
      const root = document.querySelector(rootSel);
      if (!root) continue;
      const b = root.querySelector('[data-game="basketball"]');
      const s = root.querySelector('[data-game="soccer"]');
      const r = root.querySelector('[data-game="random"]');
      if (b) b.innerHTML = '<b>🏀 Basket Random — Hosted Original</b><span>Uses the exact hosted Basket Random page you chose.</span><span class="needohHostedBadge">EXTERNAL HOSTED GAME</span>';
      if (s) s.innerHTML = '<b>⚽ Soccer Random — Hosted Original</b><span>Uses the exact hosted Soccer Random page you chose.</span><span class="needohHostedBadge">EXTERNAL HOSTED GAME</span>';
      if (r) r.innerHTML = '<b>🎲 Random Sport</b><span>Randomly chooses hosted Basketball/Soccer or your custom Kickball/Baseball.</span>';
    }
  }

  patchCards();
  new MutationObserver(patchCards).observe(document.body,{childList:true,subtree:true});

  document.addEventListener('click', e => {
    const card = e.target.closest?.('[data-game]');
    if (!card) return;
    const menu = card.closest('#nsa4Menu,#nsa5Menu,#l2pMenu');
    if (!menu) return;
    const kind = card.dataset.game;
    if (kind === 'basketball' || kind === 'soccer') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openHosted(kind);
      return;
    }
    if (kind === 'random') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const choice = ['basketball','soccer','kickball','baseball'][Math.floor(Math.random()*4)];
      if (choice === 'basketball' || choice === 'soccer') openHosted(choice);
      else menu.querySelector(`[data-game="${choice}"]`)?.click();
    }
  }, true);
})();
