(() => {
  const COOLDOWN=60000;
  let running=false,cooldownTimer=null;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const events=()=>window.__needohEvents||{active:()=>false,mult:()=>1};
  function ensureStyles(){if(document.getElementById('enhancedBossStyles'))return;const s=document.createElement('style');s.id='enhancedBossStyles';s.textContent=`.boss-hp-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.boss-hp-card{background:rgba(0,0,0,.22);padding:10px;border-radius:14px}.boss-mini-bar{height:11px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;margin-top:6px}.boss-mini-bar>div{height:100%;transition:width .32s ease}.boss-mini-bar.player>div{background:linear-gradient(90deg,#5fffc0,#35c4ff)}.boss-mini-bar.enemy>div{background:linear-gradient(90deg,#ffb83d,#ff4f7d)}.boss-drop{margin-top:12px;padding:10px;border-radius:13px;background:rgba(255,217,94,.1);border:1px solid rgba(255,217,94,.2)}.boss-crit{color:#ffe75a;text-shadow:0 0 18px rgba(255,231,90,.7)}@media(max-width:650px){.boss-hp-row{grid-template-columns:1fr}}`;document.head.appendChild(s)}
  function tier(){return Math.max(1,Number(state.bossTier)||1)}
  function cooldownLeft(){return Math.max(0,(Number(state.bossCooldownUntil)||0)-Date.now())}
  function cd(ms){const s=Math.ceil(Math.max(0,ms)/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
  function power(){const r=rarity(state.selected);return Math.max(1,state.clickPower*state.baseMult*r.mult*12*Math.max(1,events().mult('boss_damage')))}
  function startCooldownText(){clearInterval(cooldownTimer);cooldownTimer=setInterval(()=>{const el=$('enhBossCooldown');if(!el){clearInterval(cooldownTimer);return}const left=cooldownLeft();el.textContent=cd(left);if(left<=0){clearInterval(cooldownTimer);showBoss()}},250)}
  showBoss=function(){
    ensureStyles();
    if(cooldownLeft()>0){openHub('⏳ Boss Cooldown',`<div class="cooldown-card"><div style="font-size:50px">⏳</div><h2>Boss recovering</h2><div class="cooldown-clock" id="enhBossCooldown">${cd(cooldownLeft())}</div><p class="small">Every battle has a 1 minute cooldown.</p></div>`);startCooldownText();return}
    const b=bossStatsForWorld(state.world),r=rarity(state.selected),t=tier(),scaledHp=b.hp*(1+(t-1)*.35),reward=b.reward*(1+(t-1)*.25);
    openHub('👹 Enhanced Boss Battle',`<div class="boss-cinema" id="enhBossArena"><div class="battle-flash"></div><div class="battle-bolt"></div><div class="boss-arena"><div class="fighter"><div class="squishy-fighter" style="--sq:${r.color};--glow:${r.glow};--shape:${r.shape}"></div><div class="fighter-name">${r.icon} ${escapeHtml(r.name)}</div></div><div class="versus">VS</div><div class="fighter"><div class="boss-fighter">${b.icon}</div><div class="fighter-name">${escapeHtml(b.name)} · Tier ${t}</div></div></div><div class="boss-hp-row"><div class="boss-hp-card"><b>Your HP <span id="playerHpText">100</span>/100</b><div class="boss-mini-bar player"><div id="playerHpBar" style="width:100%"></div></div></div><div class="boss-hp-card"><b>Boss HP <span id="enemyHpText">100</span>/100</b><div class="boss-mini-bar enemy"><div id="enemyHpBar" style="width:100%"></div></div></div></div><div class="battle-status" id="enhBossStatus">Ready for battle?</div><div class="battle-sub">⚡ Power ${fmt(power())}${events().active('boss_damage')?' · BOSS DAMAGE EVENT ACTIVE':''} · Reward 🪙 ${fmt(reward)}</div><button class="btn danger" id="enhBossFight" style="position:relative;z-index:9">⚡ START BATTLE</button><div class="boss-drop">🎁 8% chance for a limited squishy drop. Boss gets 35% tougher after every win.</div></div>`);
    $('enhBossFight').onclick=()=>fight(b,scaledHp,reward,t);
  };
  async function fight(b,scaledHp,reward,t){
    if(running)return;running=true;const btn=$('enhBossFight');btn.disabled=true;let playerHp=100,bossHp=100,round=0;const ratio=power()/Math.max(1,scaledHp),baseDamage=clamp(22+Math.pow(Math.min(1,ratio),.3)*58,22,80),status=$('enhBossStatus'),arena=$('enhBossArena');
    const update=()=>{$('playerHpText').textContent=Math.max(0,Math.ceil(playerHp));$('enemyHpText').textContent=Math.max(0,Math.ceil(bossHp));$('playerHpBar').style.width=clamp(playerHp,0,100)+'%';$('enemyHpBar').style.width=clamp(bossHp,0,100)+'%'};
    while(playerHp>0&&bossHp>0&&round<5){
      round++;status.classList.remove('boss-crit');status.textContent=`⚡ Round ${round}: charging lightning...`;arena.classList.remove('firing','hit');void arena.offsetWidth;arena.classList.add('firing');await new Promise(r=>setTimeout(r,650));
      const crit=Math.random()<.22,damage=baseDamage*(.65+Math.random()*.5)*(crit?1.75:1);bossHp-=damage;update();arena.classList.add('hit');status.textContent=crit?'💥 CRITICAL LIGHTNING HIT!':'⚡ Lightning strike!';if(crit)status.classList.add('boss-crit');await new Promise(r=>setTimeout(r,650));if(bossHp<=0)break;
      const attacks=[['🔥 FIRE BLAST',18],['💢 SHOCKWAVE',22],['☄️ METEOR STRIKE',27],['🌪️ VOID STORM',24]],atk=attacks[Math.floor(Math.random()*attacks.length)],bossDamage=atk[1]+Math.random()*15+(t-1)*1.5;status.classList.remove('boss-crit');status.textContent=`${atk[0]} — the boss attacks back!`;playerHp-=bossDamage;update();await new Promise(r=>setTimeout(r,700));
    }
    const won=bossHp<=0&&playerHp>0;state.bossCooldownUntil=Date.now()+COOLDOWN;
    if(won){state.bossesDefeated=(Number(state.bossesDefeated)||0)+1;state.bossTier=t+1;addCoins(reward);let drop='';if(Math.random()<.08){const list=window.__needohLimitedRarities||[],rr=list[Math.floor(Math.random()*list.length)];if(rr){if(!state.owned.includes(rr.name))state.owned.push(rr.name);state.selected=rr.name;drop=` · RARE DROP ${rr.icon} ${rr.name}!`}}status.textContent=`🏆 YOU WIN! +${fmt(reward)} coins${drop}`}else status.textContent='💀 YOU LOSE! The boss survived.';
    save(true);render();btn.textContent=`COOLDOWN ${cd(COOLDOWN)}`;running=false;
  }
  attackBoss=function(){showBoss()};$('bossBtn').onclick=showBoss;ensureStyles();window.__needohEnhancedBossLoaded=true;
})();