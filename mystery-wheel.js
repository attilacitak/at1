(() => {
  let wheelBusy = false;

  function ensureWheelStyles(){
    if(document.getElementById('mysteryWheelStyles')) return;
    const style=document.createElement('style');
    style.id='mysteryWheelStyles';
    style.textContent=`
      .mw-overlay{position:fixed;inset:0;z-index:20000;background:radial-gradient(circle at 50% 35%,rgba(126,92,255,.28),rgba(5,7,18,.96) 58%);display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(12px)}
      .mw-card{width:min(720px,100%);text-align:center;background:linear-gradient(145deg,#171d36,#32184c);border:1px solid rgba(255,255,255,.18);border-radius:28px;padding:22px;box-shadow:0 30px 120px rgba(0,0,0,.65),0 0 70px rgba(160,100,255,.2);overflow:hidden}
      .mw-title{font-size:clamp(26px,5vw,44px);font-weight:1000;margin:0 0 5px;letter-spacing:-1px}.mw-sub{color:#c8c7d7;font-weight:800;margin-bottom:12px}
      .mw-stage{position:relative;width:min(430px,84vw);height:min(430px,84vw);margin:4px auto 16px;display:grid;place-items:center}
      .mw-pointer{position:absolute;z-index:8;top:-5px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:24px solid transparent;border-right:24px solid transparent;border-top:52px solid #fff;filter:drop-shadow(0 5px 8px rgba(0,0,0,.55))}
      .mw-pointer:after{content:"";position:absolute;left:-13px;top:-47px;width:26px;height:26px;border-radius:50%;background:#ffd95e;box-shadow:0 0 18px #ffd95e}
      .mw-wheel{position:relative;width:92%;height:92%;border-radius:50%;border:10px solid rgba(255,255,255,.9);box-shadow:0 0 0 7px #ffcf54,0 0 45px rgba(255,207,84,.45),inset 0 0 30px rgba(0,0,0,.35);background:conic-gradient(#ff5c7a 0 36deg,#7a66ff 36deg 72deg,#22d3aa 72deg 108deg,#ffb23f 108deg 144deg,#4fc3ff 144deg 180deg,#d85bff 180deg 216deg,#ff6fae 216deg 252deg,#65e38b 252deg 288deg,#ff8f45 288deg 324deg,#5c7cff 324deg 360deg);transition:transform 4.6s cubic-bezier(.08,.7,.12,1);will-change:transform}
      .mw-wheel:after{content:"🎁";position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:86px;height:86px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#10152d,#2b1744);border:6px solid #fff;font-size:42px;box-shadow:0 0 28px rgba(0,0,0,.6)}
      .mw-label{position:absolute;left:50%;top:50%;width:94px;margin-left:-47px;margin-top:-16px;text-align:center;font-size:12px;font-weight:1000;line-height:1.1;text-shadow:0 2px 5px rgba(0,0,0,.8);pointer-events:none}
      .mw-label .emoji{display:block;font-size:23px;margin-bottom:2px}.mw-label .txt{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .mw-result{display:none;padding:14px;border-radius:18px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.13);margin-top:8px;animation:mwPop .45s ease-out}.mw-result.show{display:block}.mw-result-big{font-size:clamp(30px,6vw,56px);font-weight:1000;color:#ffd95e;text-shadow:0 0 25px rgba(255,217,94,.45);margin:4px 0}.mw-result-text{font-size:clamp(20px,4vw,32px);font-weight:1000}.mw-collect{display:none;margin:14px auto 0;font-size:18px;padding:13px 22px}.mw-collect.show{display:inline-block}
      .mw-wheel.winner{box-shadow:0 0 0 7px #fff,0 0 70px #ffd95e,inset 0 0 30px rgba(0,0,0,.35);animation:mwGlow .75s ease-in-out infinite alternate}
      @keyframes mwPop{0%{transform:scale(.72);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes mwGlow{to{filter:brightness(1.24) saturate(1.18)}}
      @media(max-width:520px){.mw-card{padding:14px}.mw-label{width:78px;margin-left:-39px;font-size:10px}.mw-label .emoji{font-size:18px}.mw-wheel:after{width:68px;height:68px;font-size:32px}.mw-pointer{border-left-width:19px;border-right-width:19px;border-top-width:42px}}
    `;
    document.head.appendChild(style);
  }

  function randomCoin(box){
    return Math.floor(box.coinMin + Math.random() * (box.coinMax - box.coinMin));
  }

  function makeDecoy(box){
    if(Math.random()<0.5){
      const pool=availableBoxPool();
      const r=pool[Math.floor(Math.random()*pool.length)];
      return {icon:r.icon,text:r.name};
    }
    const amount=randomCoin(box);
    return {icon:'🪙',text:fmt(amount)};
  }

  function makeLabels(box,winner){
    const count=10;
    const winnerIndex=Math.floor(Math.random()*count);
    const items=Array.from({length:count},()=>makeDecoy(box));
    items[winnerIndex]=winner;
    return {items,winnerIndex};
  }

  function createOverlay(box,items){
    ensureWheelStyles();
    const overlay=document.createElement('div');
    overlay.className='mw-overlay';
    const labels=items.map((item,i)=>{
      const angle=i*36+18;
      return `<div class="mw-label" style="transform:rotate(${angle}deg) translateY(-145px) rotate(${-angle}deg)"><span class="emoji">${escapeHtml(item.icon)}</span><span class="txt">${escapeHtml(item.text)}</span></div>`;
    }).join('');
    overlay.innerHTML=`<div class="mw-card"><h2 class="mw-title">${box.icon} ${escapeHtml(box.name)}</h2><div class="mw-sub" id="mwStatus">SPINNING FOR YOUR PRIZE...</div><div class="mw-stage"><div class="mw-pointer"></div><div class="mw-wheel" id="mwWheel">${labels}</div></div><div class="mw-result" id="mwResult"><div class="mw-result-big">🎉 YOU WON! 🎉</div><div class="mw-result-text" id="mwResultText"></div></div><button class="btn gold mw-collect" id="mwCollect">COLLECT PRIZE</button></div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  openBox=function(id){
    if(wheelBusy)return;
    const box=BOXES[id];
    if(!box||state.coins<box.price)return toast('Not enough coins!');
    wheelBusy=true;

    const isSquishy=Math.random()<box.squishyChance;
    let reward;
    let wheelWinner;
    if(isSquishy){
      const pool=availableBoxPool();
      const r=pool[Math.floor(Math.random()*pool.length)];
      reward={type:'squishy',rarity:r};
      wheelWinner={icon:r.icon,text:r.name};
    }else{
      const amount=randomCoin(box);
      reward={type:'coins',amount};
      wheelWinner={icon:'🪙',text:fmt(amount)};
    }

    state.coins-=box.price;
    state.boxesOpened++;
    save(true);
    render();
    closeHub();

    const {items,winnerIndex}=makeLabels(box,wheelWinner);
    const overlay=createOverlay(box,items);
    const wheel=overlay.querySelector('#mwWheel');
    const status=overlay.querySelector('#mwStatus');
    const resultBox=overlay.querySelector('#mwResult');
    const resultText=overlay.querySelector('#mwResultText');
    const collect=overlay.querySelector('#mwCollect');
    const centerAngle=winnerIndex*36+18;
    const turns=6+Math.floor(Math.random()*3);
    const finalRotation=turns*360+(360-centerAngle);

    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      wheel.style.transform=`rotate(${finalRotation}deg)`;
    }));

    const spinTime=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?700:4700;
    if(spinTime<1000)wheel.style.transitionDuration='.65s';

    setTimeout(()=>{
      if(reward.type==='squishy'){
        const r=reward.rarity;
        if(!state.owned.includes(r.name))state.owned.push(r.name);
        state.selected=r.name;
        resultText.innerHTML=`${escapeHtml(r.icon)} ${escapeHtml(r.name)} SQUISHY!`;
      }else{
        addCoins(reward.amount);
        resultText.innerHTML=`🪙 ${escapeHtml(fmt(reward.amount))} COINS!`;
      }
      checkAchievements();
      save(true);
      render();
      wheel.classList.add('winner');
      status.textContent='THE WHEEL HAS CHOSEN!';
      resultBox.classList.add('show');
      collect.classList.add('show');
      collect.onclick=()=>{
        overlay.remove();
        wheelBusy=false;
        showBoxes();
      };
    },spinTime);
  };
})();