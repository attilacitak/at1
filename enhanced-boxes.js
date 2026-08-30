(() => {
  let busy=false;
  const EBOX={
    bronze:{name:'Bronze Box',icon:'📦',price:1e4,coinMin:5e3,coinMax:5e4,squishyChance:.18,jackpot:.015},
    crystal:{name:'Crystal Box',icon:'💎',price:1e6,coinMin:5e5,coinMax:5e6,squishyChance:.38,jackpot:.035},
    cosmic:{name:'Cosmic Box',icon:'🌌',price:1e9,coinMin:5e8,coinMax:5e9,squishyChance:.65,jackpot:.06},
    admin:{name:'Admin Box',icon:'🛡️',price:1e18,coinMin:5e17,coinMax:5e19,squishyChance:.78,jackpot:.12}
  };
  const events=()=>window.__needohEvents||{active:()=>false,mult:()=>1};
  const luck=()=>Math.max(1,events().mult('luck_rush'));
  const boxMult=()=>Math.max(1,events().mult('box_frenzy'));
  const price=b=>Math.floor(b.price/(events().active('box_frenzy')?2:1));
  function rewardFor(b){
    const jackpot=Math.min(.4,b.jackpot*luck()),limited=Math.min(.2,.01*luck()+(b===EBOX.admin ? .02 : 0));
    if(Math.random()<jackpot)return{type:'jackpot',icon:'💰',text:'JACKPOT',amount:Math.floor(b.coinMax*(10+Math.random()*40)*boxMult())};
    if(Math.random()<limited){const list=window.__needohLimitedRarities||[],r=list[Math.floor(Math.random()*list.length)];if(r)return{type:'squishy',icon:r.icon,text:r.name,rarity:r,limited:true}}
    if(Math.random()<Math.min(.95,b.squishyChance*luck())){const pool=availableBoxPool(),r=pool[Math.floor(Math.random()*pool.length)];return{type:'squishy',icon:r.icon,text:r.name,rarity:r}}
    const special=Math.random();
    if(special<.08)return{type:'boost',icon:'⚡',text:'2× BASE POWER',mult:2};
    if(special<.15)return{type:'autoclick',icon:'🤖',text:'30s AUTO-CLICK',seconds:30};
    const amount=Math.floor((b.coinMin+Math.random()*(b.coinMax-b.coinMin))*boxMult());return{type:'coins',icon:'🪙',text:fmt(amount),amount};
  }
  showBoxes=function(){
    const html=`<div class="notice">🎰 New rewards: JACKPOTS · limited squishies · 2× power · 30s auto-click${events().active('box_frenzy')?' · 🔥 BOX FRENZY ACTIVE':''}${events().active('luck_rush')?' · 🍀 LUCK RUSH ACTIVE':''}</div><div class="box-grid">${Object.entries(EBOX).map(([id,b])=>`<div class="box-card"><div class="box-icon">${b.icon}</div><h3>${b.name}</h3><p class="small">Squishy chance ${Math.min(95,Math.round(b.squishyChance*luck()*100))}%</p><div class="small" style="color:#ffd95e;font-weight:900">Jackpot up to ${Math.min(40,Math.round(b.jackpot*luck()*1000)/10)}%</div><div class="reward">🪙 ${fmt(price(b))}</div><button class="btn gold" data-box="${id}" ${state.coins<price(b)?'disabled':''}>SPIN PRIZE WHEEL</button></div>`).join('')}</div><p class="small" style="margin-top:12px">Boxes opened: ${fmt(state.boxesOpened)}</p>`;
    openHub('🎁 Enhanced Mystery Boxes',html);document.querySelectorAll('[data-box]').forEach(x=>x.onclick=()=>openBox(x.dataset.box));
  };
  function wheelOverlay(b,reward){
    const o=document.createElement('div');o.className='mw-overlay';const win=Math.floor(Math.random()*10),decoys=['🪙 Coins','🎁 Squishy','💰 Jackpot','⚡ Power','🤖 Auto','🌈 Limited','🪙 Coins','🎁 Squishy','💎 Bonus','🪙 Coins'];
    const labels=decoys.map((x,i)=>{const raw=i===win?`${reward.icon} ${reward.text}`:x,parts=raw.split(' '),icon=parts.shift(),txt=parts.join(' '),a=i*36+18;return `<div class="mw-label" style="transform:rotate(${a}deg) translateY(-145px) rotate(${-a}deg)"><span class="emoji">${escapeHtml(icon)}</span><span class="txt">${escapeHtml(txt)}</span></div>`}).join('');
    o.innerHTML=`<div class="mw-card"><h2 class="mw-title">${b.icon} ${escapeHtml(b.name)}</h2><div class="mw-sub" id="mwStatus">SPINNING FOR YOUR PRIZE...</div><div class="mw-stage"><div class="mw-pointer"></div><div class="mw-wheel" id="mwWheel">${labels}</div></div><div class="mw-result" id="mwResult"><div class="mw-result-big">🎉 YOU WON! 🎉</div><div class="mw-result-text" id="mwResultText"></div></div><button class="btn gold mw-collect" id="mwCollect">COLLECT PRIZE</button></div>`;document.body.appendChild(o);return{o,win};
  }
  function autoClick(seconds){state.autoClickUntil=Date.now()+seconds*1000;save(true);toast(`🤖 Auto-click active for ${seconds}s`)}
  openBox=function(id){
    if(busy)return;const b=EBOX[id],cost=b?price(b):0;if(!b||state.coins<cost)return toast('Not enough coins!');busy=true;const reward=rewardFor(b);state.coins-=cost;state.boxesOpened++;save(true);render();closeHub();const {o,win}=wheelOverlay(b,reward),wheel=o.querySelector('#mwWheel'),center=win*36+18,rotation=(7+Math.floor(Math.random()*3))*360+(360-center);requestAnimationFrame(()=>requestAnimationFrame(()=>wheel.style.transform=`rotate(${rotation}deg)`));setTimeout(()=>{if(reward.type==='coins'||reward.type==='jackpot')addCoins(reward.amount);else if(reward.type==='squishy'){if(!state.owned.includes(reward.rarity.name))state.owned.push(reward.rarity.name);state.selected=reward.rarity.name}else if(reward.type==='boost')state.baseMult*=reward.mult;else if(reward.type==='autoclick')autoClick(reward.seconds);checkAchievements();save(true);render();wheel.classList.add('winner');o.querySelector('#mwStatus').textContent=reward.type==='jackpot'?'💰 JACKPOT!!!':'THE WHEEL HAS CHOSEN!';o.querySelector('#mwResultText').textContent=`${reward.icon} ${reward.text}${reward.limited?' · LIMITED!':''}`;o.querySelector('#mwResult').classList.add('show');const c=o.querySelector('#mwCollect');c.classList.add('show');c.onclick=()=>{o.remove();busy=false;showBoxes()}},4700);
  };
  setInterval(()=>{if(Number(state.autoClickUntil)>Date.now()){const r=rarity(state.selected),earned=Math.max(1,state.clickPower*state.baseMult*r.mult);addCoins(earned);render()}},500);
  $('boxesBtn').onclick=showBoxes;window.__needohEnhancedBoxesLoaded=true;
})();