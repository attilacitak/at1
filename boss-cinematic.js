(() => {
  const COOLDOWN_MS=60000;
  let battleRunning=false;
  let cooldownTimer=null;

  function ensureCooldown(){
    const n=Number(state.bossCooldownUntil)||0;
    state.bossCooldownUntil=n>0?n:0;
  }
  function cooldownLeft(){
    ensureCooldown();
    return Math.max(0,state.bossCooldownUntil-Date.now());
  }
  function formatCooldown(ms){
    const s=Math.ceil(Math.max(0,ms)/1000);
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  }
  function installStyles(){
    if(document.getElementById('bossCinematicStyles'))return;
    const style=document.createElement('style');
    style.id='bossCinematicStyles';
    style.textContent=`
      .boss-cinema{position:relative;overflow:hidden;min-height:500px;border-radius:22px;padding:22px;background:radial-gradient(circle at 50% 38%,rgba(107,79,255,.22),transparent 38%),linear-gradient(180deg,#090d21,#160c2b 70%,#070912);border:1px solid rgba(255,255,255,.14);text-align:center}
      .boss-cinema::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(transparent 70%,rgba(0,0,0,.5)),radial-gradient(circle at 20% 30%,rgba(88,233,255,.12),transparent 25%),radial-gradient(circle at 80% 30%,rgba(255,69,120,.13),transparent 26%)}
      .boss-arena{position:relative;z-index:2;display:grid;grid-template-columns:1fr 110px 1fr;align-items:center;gap:8px;min-height:315px;margin-top:10px}
      .fighter{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0}
      .fighter-name{font-weight:1000;font-size:clamp(16px,2.4vw,23px);margin-top:12px;text-shadow:0 0 18px rgba(255,255,255,.2)}
      .squishy-fighter{width:150px;height:150px;background:var(--sq);border-radius:var(--shape);box-shadow:inset -18px -20px 28px rgba(0,0,0,.22),inset 16px 16px 24px rgba(255,255,255,.2),0 0 34px var(--glow);position:relative;animation:bossSquishyIdle 1.5s ease-in-out infinite}
      .squishy-fighter::before{content:"";position:absolute;width:34%;height:22%;left:18%;top:15%;border-radius:50%;background:rgba(255,255,255,.28);transform:rotate(-25deg);filter:blur(2px)}
      .boss-fighter{font-size:128px;line-height:1;filter:drop-shadow(0 0 28px rgba(255,63,109,.55));animation:bossEnemyIdle 1.2s ease-in-out infinite}
      .versus{font-size:36px;font-weight:1000;color:#ffd95e;text-shadow:0 0 18px rgba(255,217,94,.65)}
      .battle-bolt{position:absolute;z-index:6;left:27%;right:27%;top:46%;height:18px;opacity:0;transform:scaleX(.05);transform-origin:left center;background:linear-gradient(90deg,#fff,#c9fbff 15%,#65e8ff 45%,#fff 62%,#9b7bff);clip-path:polygon(0 38%,12% 0,24% 42%,38% 6%,52% 48%,68% 8%,82% 53%,100% 28%,89% 71%,73% 55%,60% 100%,45% 60%,31% 94%,18% 56%,5% 82%);filter:drop-shadow(0 0 8px #7feeff) drop-shadow(0 0 20px #7168ff)}
      .battle-flash{position:absolute;inset:0;z-index:5;pointer-events:none;background:#fff;opacity:0}
      .boss-cinema.firing .squishy-fighter{animation:bossCharge .7s ease-out forwards}
      .boss-cinema.firing .battle-bolt{animation:bossBolt .55s cubic-bezier(.15,.75,.25,1) .55s forwards}
      .boss-cinema.firing .battle-flash{animation:bossFlash .22s ease .92s}
      .boss-cinema.hit .boss-fighter{animation:bossHit .65s ease both}
      .battle-status{position:relative;z-index:8;font-size:clamp(22px,4vw,38px);font-weight:1000;min-height:52px;margin-top:4px}
      .battle-sub{position:relative;z-index:8;color:#c8c7d7;font-weight:800;min-height:24px}
      .battle-result{position:absolute;inset:0;z-index:20;display:none;align-items:center;justify-content:center;flex-direction:column;padding:24px;background:rgba(4,5,14,.78);backdrop-filter:blur(5px)}
      .battle-result.show{display:flex;animation:resultFade .25s ease}
      .battle-result h1{font-size:clamp(48px,10vw,96px);margin:0;letter-spacing:-2px;animation:resultSlam .5s cubic-bezier(.15,1.4,.45,1)}
      .battle-result.win h1{color:#8cffbe;text-shadow:0 0 32px rgba(92,255,169,.65)}
      .battle-result.lose h1{color:#ff7291;text-shadow:0 0 32px rgba(255,70,110,.6)}
      .battle-result p{font-size:18px;font-weight:900;margin:10px 0 18px}
      .cooldown-card{text-align:center;padding:28px 18px;background:linear-gradient(135deg,rgba(255,91,122,.08),rgba(112,84,255,.12));border:1px solid rgba(255,255,255,.12);border-radius:20px}
      .cooldown-clock{font-size:clamp(50px,10vw,86px);font-weight:1000;color:#ffd95e;text-shadow:0 0 25px rgba(255,217,94,.35);margin:12px 0}
      @keyframes bossSquishyIdle{50%{transform:translateY(-10px) scale(1.03)}}
      @keyframes bossEnemyIdle{50%{transform:translateY(-9px) scale(1.04) rotate(2deg)}}
      @keyframes bossCharge{0%{transform:scale(1)}55%{transform:scale(.82);filter:brightness(1.7)}100%{transform:scale(1.14);filter:brightness(2.2)}}
      @keyframes bossBolt{0%{opacity:0;transform:scaleX(.03)}18%{opacity:1}80%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1.04)}}
      @keyframes bossFlash{0%,100%{opacity:0}40%{opacity:.88}}
      @keyframes bossHit{0%{transform:translateX(0) rotate(0)}20%{transform:translateX(18px) rotate(8deg)}40%{transform:translateX(-16px) rotate(-7deg)}65%{transform:translateX(12px) rotate(5deg)}100%{transform:translateX(0) rotate(0);filter:drop-shadow(0 0 38px rgba(255,60,100,.9)) brightness(.75)}}
      @keyframes resultSlam{from{transform:scale(.25) rotate(-7deg);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes resultFade{from{opacity:0}to{opacity:1}}
      @media(max-width:650px){.boss-arena{grid-template-columns:1fr 55px 1fr;min-height:260px}.squishy-fighter{width:105px;height:105px}.boss-fighter{font-size:90px}.versus{font-size:24px}.battle-bolt{left:25%;right:25%}}
    `;
    document.head.appendChild(style);
  }

  function currentPower(){
    const r=rarity(state.selected);
    return Math.max(1,Number(state.clickPower*state.baseMult*r.mult*12)||1);
  }
  function winChance(power,hp){
    if(hp<=1)return 1;
    const ratio=Math.max(0,power/Math.max(1,hp));
    return Math.min(.94,Math.max(.16,.16+Math.pow(Math.min(1,ratio),.25)*.78));
  }
  function stopCooldownTicker(){
    if(cooldownTimer){clearInterval(cooldownTimer);cooldownTimer=null}
  }
  function startCooldownTicker(id,onDone){
    stopCooldownTicker();
    const tick=()=>{
      const el=document.getElementById(id);
      const left=cooldownLeft();
      if(el)el.textContent=formatCooldown(left);
      if(left<=0){
        stopCooldownTicker();
        if(typeof onDone==='function')onDone();
      }
    };
    tick();
    cooldownTimer=setInterval(tick,250);
  }

  function showCooldown(){
    installStyles();
    const b=bossStatsForWorld(state.world),r=rarity(state.selected);
    openHub('⏳ Boss Cooldown',`<div class="cooldown-card"><div style="font-size:44px">${r.icon} ⚡ ${b.icon}</div><h2>Next boss battle in</h2><div class="cooldown-clock" id="bossCooldownClock">${formatCooldown(cooldownLeft())}</div><p class="small">Every boss battle has a 1 minute cooldown.</p><button class="btn" id="bossCooldownBack">Back</button></div>`);
    $('bossCooldownBack').onclick=closeHub;
    startCooldownTicker('bossCooldownClock',()=>showBoss());
  }

  function showBattleReady(){
    installStyles();
    ensureBoss();
    if(cooldownLeft()>0)return showCooldown();
    const b=bossStatsForWorld(state.world),r=rarity(state.selected),power=currentPower();
    openHub('👹 Boss Battle',`<div class="boss-cinema" id="bossCinema"><div class="battle-flash"></div><div class="battle-bolt"></div><div class="boss-arena"><div class="fighter"><div class="squishy-fighter" style="--sq:${r.color};--glow:${r.glow};--shape:${r.shape}"></div><div class="fighter-name">${r.icon} ${escapeHtml(r.name)}</div></div><div class="versus">VS</div><div class="fighter"><div class="boss-fighter">${b.icon}</div><div class="fighter-name">${escapeHtml(b.name)}</div></div></div><div class="battle-status">Ready to fight?</div><div class="battle-sub">Your lightning power: ${fmt(power)} · Win reward: 🪙 ${fmt(b.reward)}</div><button class="btn danger" id="startBossCinema" style="position:relative;z-index:9;margin-top:18px;font-size:18px;padding:13px 22px">⚡ FIRE LIGHTNING</button><div class="battle-result" id="bossBattleResult"><h1 id="bossResultTitle"></h1><p id="bossResultText"></p><button class="btn gold" id="bossResultButton">BACK TO GAME</button></div></div>`);
    $('startBossCinema').onclick=runBattle;
  }

  function runBattle(){
    if(battleRunning)return;
    ensureCooldown();
    if(cooldownLeft()>0)return showCooldown();
    ensureBoss();
    installStyles();
    battleRunning=true;
    const b=bossStatsForWorld(state.world),power=currentPower(),hp=Math.max(1,Number(state.boss?.hp)||b.hp);
    const chance=winChance(power,hp);
    const won=Math.random()<chance;
    state.bossCooldownUntil=Date.now()+COOLDOWN_MS;
    save(true);

    let cinema=document.getElementById('bossCinema');
    if(!cinema){showBattleReady();cinema=document.getElementById('bossCinema')}
    const startBtn=$('startBossCinema');
    if(startBtn){startBtn.disabled=true;startBtn.style.opacity='.35'}
    const status=cinema?.querySelector('.battle-status');
    const sub=cinema?.querySelector('.battle-sub');
    if(status)status.textContent='⚡ CHARGING LIGHTNING...';
    if(sub)sub.textContent=`${playerName()}'s squishy is attacking ${b.name}!`;
    cinema?.classList.add('firing');

    setTimeout(()=>{
      cinema?.classList.add('hit');
      if(status)status.textContent='💥 DIRECT HIT!';
    },1000);

    setTimeout(()=>{
      if(won){
        state.bossesDefeated=(Number(state.bossesDefeated)||0)+1;
        addCoins(b.reward);
        checkAchievements();
        resetBossForWorld();
      }
      save(true);
      render();
      const result=$('bossBattleResult'),title=$('bossResultTitle'),text=$('bossResultText'),btn=$('bossResultButton');
      if(result){result.classList.add('show',won?'win':'lose')}
      if(title)title.textContent=won?'YOU WIN!':'YOU LOSE!';
      if(text)text.textContent=won?`🏆 ${b.name} defeated! +${fmt(b.reward)} coins`:`${b.name} survived the lightning attack.`;
      if(btn){
        btn.textContent=`COOLDOWN ${formatCooldown(cooldownLeft())}`;
        btn.onclick=closeHub;
        startCooldownTicker('bossResultButton',()=>{const x=$('bossResultButton');if(x)x.textContent='BATTLE READY AGAIN'})
      }
      battleRunning=false;
    },1850);
  }

  showBoss=showBattleReady;
  attackBoss=runBattle;
  const bossButton=$('bossBtn');
  if(bossButton)bossButton.onclick=showBoss;
  ensureCooldown();
  installStyles();
})();