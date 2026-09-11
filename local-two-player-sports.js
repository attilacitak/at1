(() => {
  if (window.__needohLocalTwoPlayerSportsV2) return;
  window.__needohLocalTwoPlayerSportsV2 = true;

  const style = document.createElement('style');
  style.textContent = `
    #l2pSportsOverlay{position:fixed;inset:0;z-index:460;background:rgba(4,7,18,.9);display:none;align-items:center;justify-content:center;padding:14px}
    #l2pSportsOverlay.show{display:flex}
    #l2pSportsCard{width:min(1040px,100%);max-height:94vh;overflow:auto;background:linear-gradient(145deg,#111a34,#321846);border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:16px;color:#fff;box-shadow:0 30px 100px rgba(0,0,0,.58)}
    .l2p-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}.l2p-head h2{margin:0}.l2p-close{border:0;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:20px;cursor:pointer}
    .l2p-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.l2p-game-card{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.08);border-radius:18px;padding:18px;color:#fff;text-align:left;cursor:pointer}.l2p-game-card:hover{background:rgba(255,255,255,.14)}.l2p-game-card b{display:block;font-size:20px;margin-bottom:6px}.l2p-game-card span{color:#c9c8db;font-size:13px;line-height:1.4}
    .l2p-random{grid-column:1/-1;background:linear-gradient(135deg,#7d5cff,#ff4ebd);text-align:center}
    .l2p-arena{display:none}.l2p-arena.show{display:block}
    .l2p-toprow{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin:4px 0 10px}.l2p-score{background:rgba(255,255,255,.08);border-radius:14px;padding:9px 12px;text-align:center;font-weight:900}.l2p-score b{display:block;font-size:27px}.l2p-game-name{font-size:19px;font-weight:1000;text-align:center;color:#ffd95e;min-width:180px}
    #l2pCanvasWrap{position:relative;width:100%;aspect-ratio:900/520;border-radius:18px;overflow:hidden;background:#10182d;border:1px solid rgba(255,255,255,.12)}
    #l2pCanvas{display:block;width:100%;height:100%;touch-action:none}
    #l2pMeterPanel{display:none;position:absolute;left:50%;bottom:12px;transform:translateX(-50%);width:min(620px,90%);background:rgba(7,10,22,.88);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:10px 12px;backdrop-filter:blur(8px)}
    #l2pMeterPanel.show{display:block}.l2p-meter-label{text-align:center;font-size:13px;font-weight:900;margin-bottom:6px}.l2p-meter{position:relative;height:30px;border-radius:10px;overflow:hidden;display:grid;grid-template-columns:12fr 13fr 19fr 12fr 19fr 13fr 12fr;border:1px solid rgba(255,255,255,.18)}
    .l2p-meter>span{display:grid;place-items:center;font-size:10px;font-weight:1000;color:white;text-shadow:0 1px 2px #000}.l2p-meter .miss{background:#5a2030}.l2p-meter .weak{background:#8b5f28}.l2p-meter .good{background:#24715b}.l2p-meter .super{background:linear-gradient(90deg,#ffb727,#ff4770,#b24cff)}
    #l2pMeterNeedle{position:absolute;top:-4px;bottom:-4px;width:4px;background:white;box-shadow:0 0 10px white;left:0;z-index:4;border-radius:4px}
    .l2p-help{margin-top:10px;background:rgba(255,255,255,.07);border-radius:14px;padding:10px 12px;font-size:12px;color:#d4d3e4;line-height:1.45}
    .l2p-status{font-size:14px;font-weight:900;color:white;margin-bottom:4px}.l2p-sub{font-size:12px;color:#bbb9ce}
    .l2p-buttons{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin-top:10px}.l2p-smallbtn{border:0;border-radius:12px;background:rgba(255,255,255,.12);color:#fff;padding:9px 13px;font-weight:900;cursor:pointer}.l2p-smallbtn.primary{background:linear-gradient(135deg,#1fc9a5,#596cff)}
    @media(max-width:680px){.l2p-menu,.l2p-toprow{grid-template-columns:1fr}.l2p-random{grid-column:auto}.l2p-game-name{order:-1}.l2p-score{padding:6px}.l2p-score b{font-size:22px}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'l2pSportsOverlay';
  overlay.innerHTML = `
    <div id="l2pSportsCard">
      <div class="l2p-head"><h2>🎮 2-Player Sports Arcade</h2><button class="l2p-close" id="l2pClose">×</button></div>
      <div id="l2pMenu" class="l2p-menu">
        <button class="l2p-game-card" data-game="basketball"><b>🏀 Basketball Random-style</b><span>One-button chaos. W vs ↑. Jump, bump, block and shoot. First to 5. Court, gravity, bounce and player size change after baskets.</span></button>
        <button class="l2p-game-card" data-game="soccer"><b>⚽ Soccer Random-style</b><span>One-button chaos. W vs ↑. Leap and kick with unpredictable physics. First to 5. Field, ball size and bounce change after goals.</span></button>
        <button class="l2p-game-card" data-game="kickball"><b>🔴 Kickball Field Duel</b><span>Stop the power bar to kick. SUPER is in the middle. Then the other player runs to catch the ball and uses a separate key to throw it in.</span></button>
        <button class="l2p-game-card" data-game="baseball"><b>⚾ Baseball Field Duel</b><span>Same timing bar for batting. Fielders run, catch, and throw. Beat the runner to the base to record an out.</span></button>
        <button class="l2p-game-card l2p-random" data-game="random"><b>🎲 Random Sport</b><span>Pick one of the four games at random.</span></button>
      </div>
      <div id="l2pArena" class="l2p-arena">
        <div class="l2p-toprow">
          <div class="l2p-score">PLAYER 1<b id="l2pP1Score">0</b><span id="l2pP1Info">W / WASD + F</span></div>
          <div class="l2p-game-name" id="l2pGameName">Basketball</div>
          <div class="l2p-score">PLAYER 2<b id="l2pP2Score">0</b><span id="l2pP2Info">↑ / Arrows + Enter</span></div>
        </div>
        <div id="l2pCanvasWrap">
          <canvas id="l2pCanvas" width="900" height="520"></canvas>
          <div id="l2pMeterPanel">
            <div class="l2p-meter-label" id="l2pMeterLabel">Player 1: press F to stop the kick meter</div>
            <div class="l2p-meter">
              <span class="miss">MISS</span><span class="weak">WEAK</span><span class="good">GOOD</span><span class="super">SUPER</span><span class="good">GOOD</span><span class="weak">WEAK</span><span class="miss">MISS</span>
              <i id="l2pMeterNeedle"></i>
            </div>
          </div>
        </div>
        <div class="l2p-help"><div class="l2p-status" id="l2pStatus">Ready</div><div class="l2p-sub" id="l2pSub"></div></div>
        <div class="l2p-buttons"><button class="l2p-smallbtn primary" id="l2pRestart">↻ Restart Match</button><button class="l2p-smallbtn" id="l2pBack">← Choose Sport</button></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = id => document.getElementById(id);
  const canvas = $('l2pCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const keys = new Set();
  let mode = null, engine = null, raf = 0, last = 0;

  const COLORS = {p1:'#43c8ff',p2:'#ff5f9d',white:'#ffffff',dark:'#10182d',gold:'#ffd95e'};
  function rnd(a,b){return a+Math.random()*(b-a)}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
  function circle(x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
  function text(t,x,y,size=20,align='center',color='#fff',weight=900){ctx.fillStyle=color;ctx.font=`${weight} ${size}px system-ui,-apple-system,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(t,x,y)}

  const themes=[
    {name:'Night',sky:'#111936',ground:'#294b61'},
    {name:'Beach',sky:'#3a8fc4',ground:'#caa968'},
    {name:'Snow',sky:'#8ca8c8',ground:'#e7eff7'},
    {name:'Neon',sky:'#29153e',ground:'#244d45'},
    {name:'Backyard',sky:'#537ec3',ground:'#447647'}
  ];

  function setScore(a,b){$('l2pP1Score').textContent=a;$('l2pP2Score').textContent=b}
  function status(a,b=''){$('l2pStatus').textContent=a;$('l2pSub').textContent=b}
  function setMeter(show,label=''){$('l2pMeterPanel').classList.toggle('show',!!show);if(label)$('l2pMeterLabel').textContent=label}
  function open(){overlay.classList.add('show');showMenu()}
  function close(){overlay.classList.remove('show');stopLoop();mode=null;engine=null;keys.clear()}
  function showMenu(){stopLoop();mode=null;engine=null;keys.clear();$('l2pMenu').style.display='grid';$('l2pArena').classList.remove('show');setMeter(false)}
  function start(name){if(name==='random')name=['basketball','soccer','kickball','baseball'][Math.floor(Math.random()*4)];mode=name;$('l2pMenu').style.display='none';$('l2pArena').classList.add('show');if(name==='basketball')startBasketball();else if(name==='soccer')startSoccer();else startDiamond(name);startLoop()}
  function startLoop(){stopLoop();last=performance.now();raf=requestAnimationFrame(loop)}
  function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0}
  function loop(now){if(!overlay.classList.contains('show')||!engine){raf=0;return}const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;try{if(engine.update)engine.update(dt);if(engine.draw)engine.draw()}catch(e){console.error('2-player sports error',e);status('Game paused because of an error.','Choose Sport and restart.');stopLoop();return}raf=requestAnimationFrame(loop)}

  function startBasketball(){
    $('l2pGameName').textContent='🏀 Basketball — First to 5';$('l2pP1Info').textContent='W = jump / shoot';$('l2pP2Info').textContent='↑ = jump / shoot';setMeter(false);
    const g={kind:'basketball',scores:[0,0],theme:themes[0],gravity:1180,bounce:.72,ballR:14,players:[],ball:null,freeze:0,winner:null};engine=g;newBasketRound(g,true);status('First to 5 wins.','W controls Player 1. ↑ controls Player 2. One button jumps, bumps, blocks, and shoots.');setScore(0,0);g.update=dt=>updateBasket(g,dt);g.draw=()=>drawBasket(g)
  }
  function newBasketRound(g,first=false){g.theme=themes[Math.floor(Math.random()*themes.length)];g.gravity=rnd(900,1450);g.bounce=rnd(.62,.86);g.ballR=rnd(11,19);const floor=445;g.players=[{x:235,y:floor-42,vx:0,vy:0,r:rnd(30,42),side:0,stretch:rnd(.8,1.25)},{x:665,y:floor-42,vx:0,vy:0,r:rnd(30,42),side:1,stretch:rnd(.8,1.25)}];g.ball={x:450,y:210,vx:rnd(-60,60),vy:0,r:g.ballR,last:null};g.freeze=first?0:.65}
  function basketAction(i){const g=engine;if(!g||g.kind!=='basketball'||g.winner||g.freeze>0)return;const p=g.players[i],b=g.ball,targetX=i===0?825:75;if(p.y>390)p.vy=-rnd(470,570);const dir=Math.sign(b.x-p.x)||(i===0?1:-1);p.vx+=dir*rnd(150,230);if(dist(p,b)<p.r+b.r+34){const dx=targetX-b.x,dy=175-b.y,d=Math.max(1,Math.hypot(dx,dy)),speed=rnd(520,690);b.vx=dx/d*speed+rnd(-45,45);b.vy=dy/d*speed-rnd(180,250);b.last=i}}
  function updateBasket(g,dt){if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;const floor=445;for(const p of g.players){p.vy+=g.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.08,dt);if(p.y>floor-p.r){p.y=floor-p.r;p.vy=0}p.x=clamp(p.x,55,845)}const b=g.ball;b.vy+=g.gravity*.72*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.985,dt*60);if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*g.bounce}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.bounce}if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*g.bounce}if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}for(const p of g.players){const d=dist(p,b),rr=p.r+b.r;if(d<rr){const nx=(b.x-p.x)/(d||1),ny=(b.y-p.y)/(d||1),push=rr-d;b.x+=nx*push;b.y+=ny*push;const impact=Math.max(140,Math.hypot(p.vx,p.vy)*.65);b.vx+=nx*impact+p.vx*.45;b.vy+=ny*impact+p.vy*.35;b.last=p.side}}if(b.vy>0&&b.y>166&&b.y<210){if(b.x>790&&b.x<850)scoreBasket(g,0);else if(b.x>50&&b.x<110)scoreBasket(g,1)}}
  function scoreBasket(g,i){g.scores[i]++;setScore(...g.scores);if(g.scores[i]>=5){g.winner=i;status(`🏆 Player ${i+1} wins Basketball!`,'Restart for a rematch.');return}status(`🏀 Player ${i+1} scores!`,`New random court: gravity ${Math.round(g.gravity)}, bounce ${g.bounce.toFixed(2)}.`);newBasketRound(g)}
  function drawBasket(g){rect(0,0,W,H,g.theme.sky);rect(0,390,W,130,g.theme.ground);ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,445);ctx.lineTo(W,445);ctx.stroke();ctx.beginPath();ctx.arc(W/2,445,78,Math.PI,0);ctx.stroke();for(const side of [0,1]){const x=side===0?70:830,back=side===0?43:857;rect(back-4,120,8,100,'#e8eaf3');ctx.strokeStyle='#ff8a35';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x-28,185);ctx.lineTo(x+28,185);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.strokeRect(back-22,110,44,58)}g.players.forEach((p,i)=>{ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.stretch,1);circle(0,0,p.r,i?COLORS.p2:COLORS.p1);ctx.restore();text(i?'P2':'P1',p.x,p.y,14,'center','#0b1020',1000)});circle(g.ball.x,g.ball.y,g.ball.r,'#f28b28');ctx.strokeStyle='#38200b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.ball.x,g.ball.y,g.ball.r,0,Math.PI*2);ctx.stroke();text(g.theme.name+' court',W/2,26,16,'center','rgba(255,255,255,.82)',800)}

  function startSoccer(){$('l2pGameName').textContent='⚽ Soccer — First to 5';$('l2pP1Info').textContent='W = leap / kick';$('l2pP2Info').textContent='↑ = leap / kick';setMeter(false);const g={kind:'soccer',scores:[0,0],theme:themes[0],gravity:1050,bounce:.8,ballR:16,players:[],ball:null,freeze:0,winner:null};engine=g;newSoccerRound(g,true);setScore(0,0);status('First to 5 goals wins.','W controls Player 1. ↑ controls Player 2. Every goal changes the field and ball.');g.update=dt=>updateSoccer(g,dt);g.draw=()=>drawSoccer(g)}
  function newSoccerRound(g,first=false){g.theme=themes[Math.floor(Math.random()*themes.length)];g.gravity=rnd(850,1350);g.bounce=rnd(.68,.94);g.ballR=rnd(12,22);const floor=445;g.players=[{x:245,y:floor-34,vx:0,vy:0,r:rnd(28,38),side:0},{x:655,y:floor-34,vx:0,vy:0,r:rnd(28,38),side:1}];g.ball={x:450,y:320,vx:rnd(-40,40),vy:0,r:g.ballR,last:null};g.freeze=first?0:.55}
  function soccerAction(i){const g=engine;if(!g||g.kind!=='soccer'||g.winner||g.freeze>0)return;const p=g.players[i],b=g.ball;if(p.y>395)p.vy=-rnd(390,500);const dir=Math.sign(b.x-p.x)||(i===0?1:-1);p.vx+=dir*rnd(200,290);if(dist(p,b)<p.r+b.r+38){b.vx+=dir*rnd(430,620)+p.vx*.45;b.vy=-rnd(230,420)+p.vy*.25;b.last=i}}
  function updateSoccer(g,dt){if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;const floor=445,b=g.ball;for(const p of g.players){p.vy+=g.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.07,dt);if(p.y>floor-p.r){p.y=floor-p.r;p.vy=0}p.x=clamp(p.x,42,858)}b.vy+=g.gravity*.8*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.99,dt*60);if(b.y<20){b.y=20;b.vy=Math.abs(b.vy)*g.bounce}if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}for(const p of g.players){const d=dist(p,b),rr=p.r+b.r;if(d<rr){const nx=(b.x-p.x)/(d||1),ny=(b.y-p.y)/(d||1);b.x+=nx*(rr-d);b.y+=ny*(rr-d);b.vx+=nx*220+p.vx*.7;b.vy+=ny*180+p.vy*.35;b.last=p.side}}if(b.y>315){if(b.x<-b.r)scoreSoccer(g,1);else if(b.x>W+b.r)scoreSoccer(g,0)}if(b.x<0&&b.y<=315){b.x=b.r;b.vx=Math.abs(b.vx)*g.bounce}if(b.x>W&&b.y<=315){b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.bounce}}
  function scoreSoccer(g,i){g.scores[i]++;setScore(...g.scores);if(g.scores[i]>=5){g.winner=i;status(`🏆 Player ${i+1} wins Soccer!`,'Restart for a rematch.');return}status(`⚽ GOAL — Player ${i+1}!`,'New random field and ball physics.');newSoccerRound(g)}
  function drawSoccer(g){rect(0,0,W,H,g.theme.sky);rect(0,300,W,220,g.theme.ground);ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=3;ctx.strokeRect(34,330,W-68,115);ctx.beginPath();ctx.moveTo(W/2,330);ctx.lineTo(W/2,445);ctx.stroke();ctx.beginPath();ctx.arc(W/2,388,55,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.strokeRect(0,315,58,130);ctx.strokeRect(W-58,315,58,130);g.players.forEach((p,i)=>{circle(p.x,p.y,p.r,i?COLORS.p2:COLORS.p1);text(i?'P2':'P1',p.x,p.y,14,'center','#0b1020',1000)});circle(g.ball.x,g.ball.y,g.ball.r,'#f5f5f5');ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.ball.x,g.ball.y,g.ball.r,0,Math.PI*2);ctx.stroke();text(g.theme.name+' field',W/2,26,16,'center','rgba(255,255,255,.82)',800)}

  function startDiamond(kind){const baseball=kind==='baseball';$('l2pGameName').textContent=baseball?'⚾ Baseball Field Duel':'🔴 Kickball Field Duel';$('l2pP1Info').textContent='WASD run • F action';$('l2pP2Info').textContent='Arrows run • Enter action';const g={kind,scores:[0,0],offense:0,plays:[0,0],maxPlays:7,phase:'meter',meter:0,meterDir:1,fielder:null,ball:null,runner:0,quality:null,winner:null,playTimer:0};engine=g;setScore(0,0);beginDiamondPlay(g,true);g.update=dt=>updateDiamond(g,dt);g.draw=()=>drawDiamond(g)}
  function controlsFor(player){return player===0?{up:'w',down:'s',left:'a',right:'d',action:'f',label:'F'}:{up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',action:'enter',label:'ENTER'}}
  function beginDiamondPlay(g,first=false){if(g.plays[0]>=g.maxPlays&&g.plays[1]>=g.maxPlays){finishDiamond(g);return}if(!first)g.offense=1-g.offense;if(g.plays[g.offense]>=g.maxPlays)g.offense=1-g.offense;const defense=1-g.offense,c=controlsFor(g.offense);g.phase='meter';g.meter=Math.random()*.25;g.meterDir=1;g.quality=null;g.runner=0;g.ball=null;g.fielder={x:450,y:180,vx:0,vy:0,owner:defense,hasBall:false};g.playTimer=0;setMeter(true,`Player ${g.offense+1}: press ${c.label} to stop the ${g.kind==='baseball'?'SWING':'KICK'} meter`);status(`Player ${g.offense+1} is ${g.kind==='baseball'?'batting':'kicking'}.`,`Player ${defense+1} fields: ${defense===0?'WASD + F':'Arrow keys + Enter'}. Catch by running into the ball; press the action key to throw.`)}
  function meterQuality(v){const d=Math.abs(v-.5);if(d<=.06)return{name:'SUPER',power:1.28,color:'#ff62d7'};if(d<=.25)return{name:'GOOD',power:.92,color:'#55e6b4'};if(d<=.38)return{name:'WEAK',power:.58,color:'#e3ad55'};return{name:'MISS',power:0,color:'#ff657d'}}
  function diamondAction(player){const g=engine;if(!g||(g.kind!=='kickball'&&g.kind!=='baseball')||g.winner)return;if(g.phase==='meter'){if(player!==g.offense)return;const q=meterQuality(g.meter);g.quality=q;g.plays[player]++;setMeter(false);if(q.name==='MISS'){status(`Player ${player+1}: MISS — OUT!`,'No contact. Next player up.');g.phase='dead';g.playTimer=.9;return}launchDiamondBall(g,q);return}const defense=1-g.offense;if(player!==defense)return;if((g.phase==='field'||g.phase==='ground')&&g.fielder?.hasBall)throwDiamondBall(g)}
  function launchDiamondBall(g,q){const centerBias=(g.meter-.5)*2,angle=-Math.PI/2+centerBias*.72+rnd(-.16,.16),base=g.kind==='baseball'?500:440,speed=base*q.power;g.ball={x:450,y:440,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,z:18,vz:(g.kind==='baseball'?360:310)*q.power,r:g.kind==='baseball'?9:13};g.runner=0;g.phase='field';status(`${q.name}! Player ${g.offense+1} puts it in play.`,`Player ${2-g.offense} RUN to the ball. Catch it, or pick it up and press ${controlsFor(1-g.offense).label} to throw.`)}
  function updateDiamond(g,dt){if(g.phase==='meter'){g.meter+=g.meterDir*dt*.9;if(g.meter>=1){g.meter=1;g.meterDir=-1}else if(g.meter<=0){g.meter=0;g.meterDir=1}$('l2pMeterNeedle').style.left=`calc(${(g.meter*100).toFixed(2)}% - 2px)`;return}if(g.phase==='dead'){g.playTimer-=dt;if(g.playTimer<=0)beginDiamondPlay(g);return}if(g.phase!=='field'&&g.phase!=='ground')return;const defense=1-g.offense,c=controlsFor(defense),f=g.fielder,b=g.ball,speed=260;let dx=0,dy=0;if(keys.has(c.left))dx-=1;if(keys.has(c.right))dx+=1;if(keys.has(c.up))dy-=1;if(keys.has(c.down))dy+=1;if(dx||dy){const m=Math.hypot(dx,dy);f.x+=dx/m*speed*dt;f.y+=dy/m*speed*dt}f.x=clamp(f.x,40,860);f.y=clamp(f.y,70,445);g.runner+=dt*(g.quality?.name==='SUPER'?.24:g.quality?.name==='GOOD'?.20:.17);if(!f.hasBall){b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;b.vz-=720*dt;b.vx*=Math.pow(.994,dt*60);b.vy*=Math.pow(.994,dt*60);if(b.z<=0){b.z=0;if(Math.abs(b.vz)>55){b.vz=-b.vz*.38;b.vx*=.82;b.vy*=.82}else{b.vz=0;g.phase='ground'}}b.x=clamp(b.x,20,880);b.y=clamp(b.y,55,465);const catchRadius=b.z<55?31:22;if(dist(f,b)<catchRadius){if(b.z>10){status(`Player ${defense+1} makes the CATCH — OUT!`,'Next player up.');g.phase='dead';g.playTimer=1.0;return}f.hasBall=true;b.x=f.x;b.y=f.y;b.z=12;b.vx=b.vy=b.vz=0;status(`Player ${defense+1} has the ball!`,`Press ${c.label} to THROW before the runner reaches home.`)}}else{b.x=f.x;b.y=f.y;b.z=12}if(g.runner>=1){g.scores[g.offense]++;setScore(...g.scores);status(`🏃 Player ${g.offense+1} scores a run!`,'The throw was too late.');g.phase='dead';g.playTimer=1.0}}
  function throwDiamondBall(g){const defense=1-g.offense,f=g.fielder,home={x:450,y:445},throwDistance=Math.hypot(f.x-home.x,f.y-home.y),travel=throwDistance/760,projected=g.runner+travel*(g.quality?.name==='SUPER'?.24:g.quality?.name==='GOOD'?.20:.17);if(projected<1){status(`💨 Player ${defense+1} throws them OUT!`,`Runner was at ${Math.round(g.runner*100)}%.`)}else{g.scores[g.offense]++;setScore(...g.scores);status(`SAFE! Player ${g.offense+1} scores!`,'The runner beat the throw.')}g.phase='dead';g.playTimer=1.0}
  function finishDiamond(g){g.winner=g.scores[0]===g.scores[1]?-1:(g.scores[0]>g.scores[1]?0:1);g.phase='finished';setMeter(false);status(g.winner<0?'🤝 Tie game!':`🏆 Player ${g.winner+1} wins ${g.kind==='baseball'?'Baseball':'Kickball'}!`,'Restart for a rematch.')}
  function drawDiamond(g){rect(0,0,W,H,'#214b39');ctx.fillStyle='#b88956';ctx.beginPath();ctx.moveTo(450,455);ctx.lineTo(220,260);ctx.lineTo(450,105);ctx.lineTo(680,260);ctx.closePath();ctx.fill();ctx.fillStyle='#d7c097';const bases=[[450,445],[275,270],[450,130],[625,270]];bases.forEach(([x,y])=>{ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillRect(-10,-10,20,20);ctx.restore()});const rp=clamp(g.runner,0,1);let rx=450,ry=445;if(rp<.25){const t=rp/.25;rx=450+(625-450)*t;ry=445+(270-445)*t}else if(rp<.5){const t=(rp-.25)/.25;rx=625+(450-625)*t;ry=270+(130-270)*t}else if(rp<.75){const t=(rp-.5)/.25;rx=450+(275-450)*t;ry=130+(270-130)*t}else{const t=(rp-.75)/.25;rx=275+(450-275)*t;ry=270+(445-270)*t}circle(rx,ry,14,g.offense?COLORS.p2:COLORS.p1);text(`P${g.offense+1}`,rx,ry,10,'center','#07101b',1000);if(g.fielder){circle(g.fielder.x,g.fielder.y,18,(1-g.offense)?COLORS.p2:COLORS.p1);text(`P${2-g.offense}`,g.fielder.x,g.fielder.y,10,'center','#07101b',1000)}if(g.ball){circle(g.ball.x,g.ball.y-g.ball.z*.35,g.ball.r,g.kind==='baseball'?'#fff':'#e7374d');if(g.ball.z>0){ctx.globalAlpha=.2;circle(g.ball.x,g.ball.y,g.ball.r*.8,'#000');ctx.globalAlpha=1}}text(g.kind==='baseball'?'BASEBALL':'KICKBALL',W/2,30,18,'center','rgba(255,255,255,.9)',1000);text(`Plays: P1 ${g.plays[0]}/${g.maxPlays} • P2 ${g.plays[1]}/${g.maxPlays}`,W/2,54,13,'center','rgba(255,255,255,.75)',800)}

  function actionForKey(k){if(!engine)return;if(engine.kind==='basketball'){if(k==='w')basketAction(0);else if(k==='arrowup')basketAction(1);return}if(engine.kind==='soccer'){if(k==='w')soccerAction(0);else if(k==='arrowup')soccerAction(1);return}if(engine.kind==='kickball'||engine.kind==='baseball'){if(k==='f')diamondAction(0);else if(k==='enter')diamondAction(1)}}
  window.addEventListener('keydown',e=>{if(!overlay.classList.contains('show')||!$('l2pArena').classList.contains('show'))return;const k=e.key.toLowerCase(),used=['w','a','s','d','f','arrowup','arrowdown','arrowleft','arrowright','enter','escape'].includes(k);if(used){e.preventDefault();e.stopPropagation()}if(k==='escape'){close();return}keys.add(k);if(!e.repeat)actionForKey(k)},true);
  window.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase())},true);window.addEventListener('blur',()=>keys.clear());
  $('l2pMenu').addEventListener('click',e=>{const card=e.target.closest('[data-game]');if(card)start(card.dataset.game)});$('l2pClose').onclick=close;$('l2pBack').onclick=showMenu;$('l2pRestart').onclick=()=>mode&&start(mode);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  function addButton(){if(document.getElementById('localSportsBtn'))return;const bar=document.querySelector('.featurebar');if(!bar)return;const btn=document.createElement('button');btn.id='localSportsBtn';btn.className='btn';btn.textContent='🎮 2-Player Games';btn.onclick=open;const mini=document.getElementById('minigamesBtn');if(mini&&mini.parentNode===bar)mini.after(btn);else bar.appendChild(btn)}
  addButton();const obs=new MutationObserver(addButton);obs.observe(document.body,{childList:true,subtree:true});
})();