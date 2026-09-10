(() => {
  if (window.__needohLocalTwoPlayerSports) return;
  window.__needohLocalTwoPlayerSports = true;

  const style = document.createElement('style');
  style.textContent = `
    #l2pSportsOverlay{position:fixed;inset:0;z-index:450;background:rgba(4,7,18,.86);display:none;align-items:center;justify-content:center;padding:16px}
    #l2pSportsOverlay.show{display:flex}
    #l2pSportsCard{width:min(920px,100%);max-height:90vh;overflow:auto;background:linear-gradient(145deg,#151c36,#321846);border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:18px;color:#fff;box-shadow:0 30px 100px rgba(0,0,0,.55)}
    .l2p-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.l2p-head h2{margin:0}.l2p-close{border:0;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:20px;cursor:pointer}
    .l2p-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.l2p-game-card{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.08);border-radius:18px;padding:18px;color:#fff;text-align:left;cursor:pointer}.l2p-game-card:hover{background:rgba(255,255,255,.13)}.l2p-game-card b{display:block;font-size:20px;margin-bottom:6px}.l2p-game-card span{color:#c9c8db;font-size:13px}
    .l2p-random{grid-column:1/-1;background:linear-gradient(135deg,#7d5cff,#ff4ebd);text-align:center;font-weight:900}
    .l2p-arena{display:none}.l2p-arena.show{display:block}.l2p-scoreboard{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin:10px 0 14px}.l2p-player{padding:15px;border-radius:16px;background:rgba(255,255,255,.08);text-align:center}.l2p-player b{display:block;font-size:30px;margin-top:4px}.l2p-vs{font-weight:1000;font-size:24px;color:#ffd95e}.l2p-field{min-height:250px;border-radius:20px;padding:18px;background:radial-gradient(circle at 50% 30%,rgba(255,255,255,.12),rgba(0,0,0,.18));display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.l2p-icon{font-size:78px;line-height:1}.l2p-status{font-size:18px;font-weight:900;margin:12px 0 4px}.l2p-sub{font-size:13px;color:#c9c8db;min-height:20px}.l2p-controls{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.l2p-action{border:0;border-radius:16px;padding:16px;color:#fff;font-size:17px;font-weight:1000;cursor:pointer}.l2p-p1{background:linear-gradient(135deg,#27c8ff,#5667ff)}.l2p-p2{background:linear-gradient(135deg,#ff5d95,#b74cff)}.l2p-action:disabled{opacity:.4;cursor:not-allowed}.l2p-bottom{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}.l2p-smallbtn{border:0;border-radius:12px;background:rgba(255,255,255,.12);color:#fff;padding:10px 13px;font-weight:900;cursor:pointer}.l2p-winner{font-size:26px;font-weight:1000;color:#ffd95e;margin-top:8px}
    @media(max-width:650px){.l2p-menu,.l2p-controls,.l2p-scoreboard{grid-template-columns:1fr}.l2p-vs{display:none}.l2p-random{grid-column:auto}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'l2pSportsOverlay';
  overlay.innerHTML = `
    <div id="l2pSportsCard">
      <div class="l2p-head"><h2>🎮 2-Player Sports Arcade</h2><button class="l2p-close" id="l2pClose">×</button></div>
      <div id="l2pMenu" class="l2p-menu">
        <button class="l2p-game-card" data-game="basketball"><b>🏀 Basketball</b><span>10 shots each. Random 2s and 3s. Most points wins.</span></button>
        <button class="l2p-game-card" data-game="soccer"><b>⚽ Soccer</b><span>5 penalty kicks each. Random shot direction and goalie save.</span></button>
        <button class="l2p-game-card" data-game="kickball"><b>🔴 Kickball</b><span>8 kicks each. Random outs, singles, doubles, triples and homers.</span></button>
        <button class="l2p-game-card" data-game="baseball"><b>⚾ Baseball</b><span>10 swings each. Random hits and home runs. Most runs wins.</span></button>
        <button class="l2p-game-card l2p-random" data-game="random"><b>🎲 Random Sport</b><span>Let the game choose one of the four sports.</span></button>
      </div>
      <div id="l2pArena" class="l2p-arena">
        <div class="l2p-scoreboard">
          <div class="l2p-player">Player 1 <small>— A key</small><b id="l2pP1Score">0</b><span id="l2pP1Left"></span></div>
          <div class="l2p-vs">VS</div>
          <div class="l2p-player">Player 2 <small>— L key</small><b id="l2pP2Score">0</b><span id="l2pP2Left"></span></div>
        </div>
        <div class="l2p-field">
          <div class="l2p-icon" id="l2pIcon">🏀</div>
          <div class="l2p-status" id="l2pStatus">Ready!</div>
          <div class="l2p-sub" id="l2pSub">Player 1 press A. Player 2 press L.</div>
          <div class="l2p-winner" id="l2pWinner"></div>
        </div>
        <div class="l2p-controls">
          <button class="l2p-action l2p-p1" id="l2pP1">Player 1 — A</button>
          <button class="l2p-action l2p-p2" id="l2pP2">Player 2 — L</button>
        </div>
        <div class="l2p-bottom"><button class="l2p-smallbtn" id="l2pRestart">↻ Restart</button><button class="l2p-smallbtn" id="l2pBack">← Choose Sport</button></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = id => document.getElementById(id);
  const menu = $('l2pMenu');
  const arena = $('l2pArena');
  let game = null;
  let state = null;

  const gameInfo = {
    basketball:{icon:'🏀',name:'Basketball',attempts:10,unit:'shots'},
    soccer:{icon:'⚽',name:'Soccer',attempts:5,unit:'kicks'},
    kickball:{icon:'🔴',name:'Kickball',attempts:8,unit:'kicks'},
    baseball:{icon:'⚾',name:'Baseball',attempts:10,unit:'swings'}
  };

  function open() { overlay.classList.add('show'); showMenu(); }
  function close() { overlay.classList.remove('show'); }
  function showMenu() { game = null; state = null; menu.style.display='grid'; arena.classList.remove('show'); }

  function start(name) {
    if (name === 'random') {
      const names = Object.keys(gameInfo);
      name = names[Math.floor(Math.random()*names.length)];
    }
    game = name;
    const info = gameInfo[name];
    state = {scores:[0,0], used:[0,0], done:false};
    menu.style.display='none';
    arena.classList.add('show');
    $('l2pIcon').textContent = info.icon;
    $('l2pStatus').textContent = `${info.name} — Ready!`;
    $('l2pSub').textContent = 'Player 1 press A. Player 2 press L. You can also click the buttons.';
    $('l2pWinner').textContent = '';
    $('l2pP1').disabled = false;
    $('l2pP2').disabled = false;
    update();
  }

  function update() {
    if (!state || !game) return;
    const info = gameInfo[game];
    $('l2pP1Score').textContent = state.scores[0];
    $('l2pP2Score').textContent = state.scores[1];
    $('l2pP1Left').textContent = `${Math.max(0,info.attempts-state.used[0])} ${info.unit} left`;
    $('l2pP2Left').textContent = `${Math.max(0,info.attempts-state.used[1])} ${info.unit} left`;
    $('l2pP1').disabled = state.done || state.used[0] >= info.attempts;
    $('l2pP2').disabled = state.done || state.used[1] >= info.attempts;
    if (state.used[0] >= info.attempts && state.used[1] >= info.attempts && !state.done) finish();
  }

  function finish() {
    state.done = true;
    $('l2pP1').disabled = true;
    $('l2pP2').disabled = true;
    let result = '🤝 Tie game!';
    if (state.scores[0] > state.scores[1]) result = '🏆 Player 1 wins!';
    if (state.scores[1] > state.scores[0]) result = '🏆 Player 2 wins!';
    $('l2pWinner').textContent = result;
    $('l2pStatus').textContent = `${gameInfo[game].name} finished`;
    $('l2pSub').textContent = 'Hit Restart for a rematch or Choose Sport for another game.';
  }

  function basketball(player) {
    const three = Math.random() < .35;
    const make = Math.random() < (three ? .42 : .66);
    const pts = make ? (three ? 3 : 2) : 0;
    state.scores[player] += pts;
    return make ? `${three?'3-pointer':'2-pointer'} — GOOD! +${pts}` : `${three?'3-pointer':'2-pointer'} — missed`;
  }

  function soccer(player) {
    const dirs = ['left','center','right'];
    const shot = dirs[Math.floor(Math.random()*3)];
    const goalie = dirs[Math.floor(Math.random()*3)];
    const offTarget = Math.random() < .1;
    const goal = !offTarget && (shot !== goalie || Math.random() < .22);
    if (goal) state.scores[player] += 1;
    return offTarget ? `Shot ${shot} — wide!` : goal ? `Shot ${shot}, goalie ${goalie} — GOAL! ⚽` : `Shot ${shot}, goalie ${goalie} — SAVED!`;
  }

  function kickball(player) {
    const r = Math.random();
    let label='OUT',pts=0;
    if (r>.48 && r<=.72){label='Single';pts=1}
    else if(r>.72 && r<=.87){label='Double';pts=2}
    else if(r>.87 && r<=.96){label='Triple';pts=3}
    else if(r>.96){label='HOME RUN!';pts=4}
    state.scores[player] += pts;
    return pts ? `${label} +${pts}` : 'Caught — OUT!';
  }

  function baseball(player) {
    const r = Math.random();
    let label='Strikeout',pts=0;
    if (r>.35 && r<=.62){label='Single';pts=1}
    else if(r>.62 && r<=.78){label='Double';pts=2}
    else if(r>.78 && r<=.87){label='Triple';pts=3}
    else if(r>.87){label='HOME RUN!';pts=4}
    state.scores[player] += pts;
    return pts ? `${label} +${pts} run${pts===1?'':'s'}` : 'Strikeout!';
  }

  function play(player) {
    if (!state || !game || state.done) return;
    const info = gameInfo[game];
    if (state.used[player] >= info.attempts) return;
    state.used[player]++;
    let result='';
    if (game==='basketball') result=basketball(player);
    else if (game==='soccer') result=soccer(player);
    else if (game==='kickball') result=kickball(player);
    else if (game==='baseball') result=baseball(player);
    $('l2pStatus').textContent = `Player ${player+1}: ${result}`;
    $('l2pSub').textContent = `P1 ${state.scores[0]} — P2 ${state.scores[1]}`;
    update();
  }

  menu.addEventListener('click', e => {
    const card = e.target.closest('[data-game]');
    if (card) start(card.dataset.game);
  });
  $('l2pP1').onclick = () => play(0);
  $('l2pP2').onclick = () => play(1);
  $('l2pRestart').onclick = () => game && start(game);
  $('l2pBack').onclick = showMenu;
  $('l2pClose').onclick = close;
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  window.addEventListener('keydown', e => {
    if (!overlay.classList.contains('show') || !arena.classList.contains('show')) return;
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === 'a') { e.preventDefault(); play(0); }
    if (k === 'l') { e.preventDefault(); play(1); }
    if (k === 'escape') close();
  });

  function addButton() {
    if (document.getElementById('localSportsBtn')) return;
    const bar = document.querySelector('.featurebar');
    if (!bar) return;
    const btn = document.createElement('button');
    btn.id='localSportsBtn';
    btn.className='btn';
    btn.textContent='🎮 2-Player Games';
    btn.onclick=open;
    const mini=document.getElementById('minigamesBtn');
    if (mini && mini.parentNode===bar) mini.after(btn); else bar.appendChild(btn);
  }

  addButton();
  const obs = new MutationObserver(addButton);
  obs.observe(document.body,{childList:true,subtree:true});
})();
