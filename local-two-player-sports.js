(() => {
  if (window.__needohLocalTwoPlayerSportsV3) return;
  window.__needohLocalTwoPlayerSportsV3 = true;

  const old=document.getElementById('l2pSportsOverlay'); if(old) old.remove();
  const oldBtn=document.getElementById('localSportsBtn'); if(oldBtn) oldBtn.remove();

  const style=document.createElement('style');
  style.id='l2pSportsV3Styles';
  style.textContent=`
  #l2pSportsOverlay{position:fixed;inset:0;z-index:470;background:rgba(3,6,16,.92);display:none;align-items:center;justify-content:center;padding:12px}
  #l2pSportsOverlay.show{display:flex}#l2pSportsCard{width:min(1100px,100%);max-height:95vh;overflow:auto;background:linear-gradient(145deg,#101832,#321944);border:1px solid rgba(255,255,255,.15);border-radius:24px;padding:15px;color:#fff;box-shadow:0 30px 100px #0009}
  .l2p-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.l2p-head h2{margin:0;font-size:22px}.l2p-close{border:0;border-radius:50%;width:40px;height:40px;background:#ffffff18;color:#fff;font-size:22px;cursor:pointer}
  .l2p-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}.l2p-game-card{border:1px solid #ffffff20;background:#ffffff12;color:#fff;border-radius:18px;padding:18px;text-align:left;cursor:pointer}.l2p-game-card:hover{background:#ffffff1d;transform:translateY(-1px)}.l2p-game-card b{display:block;font-size:21px;margin-bottom:6px}.l2p-game-card span{font-size:13px;color:#d4d2e4;line-height:1.4}.l2p-random{grid-column:1/-1;text-align:center;background:linear-gradient(135deg,#6f55ff,#ff4aa7)}
  .l2p-arena{display:none}.l2p-arena.show{display:block}.l2p-toprow{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin:10px 0}.l2p-score{padding:9px 12px;border-radius:14px;background:#ffffff12;text-align:center;font-weight:900}.l2p-score b{display:block;font-size:29px}.l2p-game-name{font-weight:1000;color:#ffd95e;font-size:19px;text-align:center;min-width:220px}
  #l2pCanvasWrap{position:relative;width:100%;aspect-ratio:960/540;border-radius:18px;overflow:hidden;border:1px solid #ffffff20;background:#0a1020}#l2pCanvas{display:block;width:100%;height:100%;image-rendering:pixelated;touch-action:none}
  #l2pMeterPanel{display:none;position:absolute;left:50%;bottom:12px;transform:translateX(-50%);width:min(650px,92%);padding:10px 12px;border-radius:15px;background:#070b16e8;border:1px solid #ffffff25;backdrop-filter:blur(8px)}#l2pMeterPanel.show{display:block}.l2p-meter-label{text-align:center;font-weight:900;font-size:13px;margin-bottom:6px}.l2p-meter{height:31px;position:relative;display:grid;grid-template-columns:12fr 14fr 19fr 10fr 19fr 14fr 12fr;border-radius:9px;overflow:hidden;border:1px solid #ffffff30}.l2p-meter span{display:grid;place-items:center;font-size:10px;font-weight:1000;text-shadow:0 2px 3px #000}.l2p-meter .miss{background:#67263b}.l2p-meter .weak{background:#906427}.l2p-meter .good{background:#27795e}.l2p-meter .super{background:linear-gradient(90deg,#ffcf39,#ff596f,#a959ff)}#l2pMeterNeedle{position:absolute;top:-3px;bottom:-3px;width:4px;background:#fff;box-shadow:0 0 12px #fff;left:0;border-radius:4px}
  .l2p-help{margin-top:9px;padding:10px 12px;background:#ffffff10;border-radius:14px}.l2p-status{font-weight:1000;font-size:14px}.l2p-sub{font-size:12px;color:#c9c7d8;margin-top:3px}.l2p-buttons{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:10px}.l2p-smallbtn{border:0;border-radius:12px;padding:9px 13px;background:#ffffff18;color:#fff;font-weight:900;cursor:pointer}.l2p-smallbtn.primary{background:linear-gradient(135deg,#1ec9aa,#5d67ff)}
  @media(max-width:680px){.l2p-menu,.l2p-toprow{grid-template-columns:1fr}.l2p-random{grid-column:auto}.l2p-game-name{order:-1}.l2p-score b{font-size:22px}}
  `;
  document.head.appendChild(style);

  const overlay=document.createElement('div'); overlay.id='l2pSportsOverlay';
  overlay.innerHTML=`<div id="l2pSportsCard"><div class="l2p-head"><h2>🎮 2-Player Sports Arcade</h2><button id="l2pClose" class="l2p-close">×</button></div>
  <div id="l2pMenu" class="l2p-menu">
   <button class="l2p-game-card" data-game="basketball"><b>🏀 Basket Chaos</b><span>Two pixel players per side, one-button ragdoll-style jumping/shooting, first to 5. Court, outfits, ball, gravity, arm length and body size change after scores.</span></button>
   <button class="l2p-game-card" data-game="soccer"><b>⚽ Soccer Chaos</b><span>Two pixel players per side, W vs ↑, first to 5 goals. Random fields, outfits, ball types, player sizes and slippery/bouncy physics after goals.</span></button>
   <button class="l2p-game-card" data-game="kickball"><b>🔴 Kickball Field Duel</b><span>Full diamond, pitcher, kicker, runner and fielder. Stop the MISS/WEAK/GOOD/SUPER bar, then run, catch and throw.</span></button>
   <button class="l2p-game-card" data-game="baseball"><b>⚾ Baseball Field Duel</b><span>Full ballpark with batter, pitcher, runner, bases and fielder. Same power bar, then race the runner and throw to the base.</span></button>
   <button class="l2p-game-card l2p-random" data-game="random"><b>🎲 Random Sport</b><span>Choose one of the four games at random.</span></button>
  </div>
  <div id="l2pArena" class="l2p-arena"><div class="l2p-toprow"><div class="l2p-score">PLAYER 1<b id="l2pP1Score">0</b><span id="l2pP1Info"></span></div><div id="l2pGameName" class="l2p-game-name"></div><div class="l2p-score">PLAYER 2<b id="l2pP2Score">0</b><span id="l2pP2Info"></span></div></div>
   <div id="l2pCanvasWrap"><canvas id="l2pCanvas" width="960" height="540"></canvas><div id="l2pMeterPanel"><div id="l2pMeterLabel" class="l2p-meter-label"></div><div class="l2p-meter"><span class="miss">MISS</span><span class="weak">WEAK</span><span class="good">GOOD</span><span class="super">SUPER</span><span class="good">GOOD</span><span class="weak">WEAK</span><span class="miss">MISS</span><i id="l2pMeterNeedle"></i></div></div></div>
   <div class="l2p-help"><div id="l2pStatus" class="l2p-status"></div><div id="l2pSub" class="l2p-sub"></div></div><div class="l2p-buttons"><button id="l2pRestart" class="l2p-smallbtn primary">↻ Restart Match</button><button id="l2pBack" class="l2p-smallbtn">← Choose Sport</button></div>
  </div></div>`;
  document.body.appendChild(overlay);

  const $=id=>document.getElementById(id), canvas=$('l2pCanvas'),ctx=canvas.getContext('2d');
  const W=960,H=540,keys=new Set(); let mode=null,engine=null,raf=0,last=0;
  const PAL=[['#21c2ff','#1755d6'],['#ff4f8d','#982fd6']], SKINS=['#f2bd8b','#d99362','#8f5d3e','#f0c9a0'];
  const themes=[
   {name:'City Night',sky:'#161d45',ground:'#39475c',accent:'#58d6ff'},
   {name:'Sunset',sky:'#a64d6b',ground:'#6a7053',accent:'#ffd56b'},
   {name:'Snow',sky:'#8db5d6',ground:'#e6eff7',accent:'#8ee7ff'},
   {name:'Beach',sky:'#4d9ec8',ground:'#d9b267',accent:'#78f0dd'},
   {name:'Neon',sky:'#25103e',ground:'#173d3d',accent:'#ff69d5'}
  ];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function setScore(a,b){$('l2pP1Score').textContent=a;$('l2pP2Score').textContent=b}
  function status(a,b=''){$('l2pStatus').textContent=a;$('l2pSub').textContent=b}
  function setMeter(show,label=''){$('l2pMeterPanel').classList.toggle('show',!!show);if(label)$('l2pMeterLabel').textContent=label}
  function text(t,x,y,s=20,c='#fff',align='center',weight=900){ctx.fillStyle=c;ctx.font=`${weight} ${s}px system-ui,-apple-system,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(t,x,y)}
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
  function circle(x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
  function line(x1,y1,x2,y2,w,c){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}

  function drawPixelPerson(p,team,opts={}){
    const s=p.scale||1, flip=team===0?1:-1, skin=p.skin||SKINS[team+1], jersey=(p.jersey||PAL[team][0]), trim=(p.trim||PAL[team][1]);
    const x=p.x,y=p.y, jump=Math.min(10,Math.abs(p.vy||0)/40), lean=clamp((p.vx||0)/320,-.32,.32);
    ctx.save();ctx.translate(x,y);ctx.rotate(lean*.22);
    ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(0,31*s,19*s,5*s,0,0,Math.PI*2);ctx.fill();
    rect(-11*s,-42*s,22*s,20*s,skin);rect(-9*s,-39*s,18*s,4*s,'#5a3728');
    rect(-15*s,-22*s,30*s,34*s,jersey);rect(-15*s,-4*s,30*s,5*s,trim);
    rect(-12*s,12*s,9*s,24*s,trim);rect(3*s,12*s,9*s,24*s,trim);
    rect(-14*s,34*s,12*s,7*s,'#f2f2f2');rect(2*s,34*s,12*s,7*s,'#f2f2f2');
    const arm=(p.arm||1)*s, swing=(p.swing||0); line(-14*s,-16*s,-(27+10*swing)*arm*flip,-2*s-jump,8*s,skin);line(14*s,-16*s,(27+10*swing)*arm*flip,-7*s-jump,8*s,skin);
    rect(-5*s,-12*s,10*s,12*s,'#ffffff22');
    ctx.restore();
  }
  function drawTeamPlayers(arr){arr.forEach(p=>drawPixelPerson(p,p.side,p))}
  function drawCrowd(){for(let x=18;x<W;x+=28){const h=6+((x*7)%13);rect(x,40+h,16,20,'#ffffff20');circle(x+8,36+h,6,pick(['#ffe0b2','#d59b6c','#8f6045','#f0b88b']))}}

  function open(){overlay.classList.add('show');showMenu()}
  function close(){overlay.classList.remove('show');stopLoop();mode=null;engine=null;keys.clear()}
  function showMenu(){stopLoop();mode=null;engine=null;keys.clear();$('l2pMenu').style.display='grid';$('l2pArena').classList.remove('show');setMeter(false)}
  function start(name){if(name==='random')name=pick(['basketball','soccer','kickball','baseball']);mode=name;$('l2pMenu').style.display='none';$('l2pArena').classList.add('show');if(name==='basketball')startBasket();else if(name==='soccer')startSoccer();else startDiamond(name);startLoop()}
  function startLoop(){stopLoop();last=performance.now();raf=requestAnimationFrame(loop)} function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function loop(now){if(!engine||!overlay.classList.contains('show'))return;const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;try{engine.update?.(dt);engine.draw?.()}catch(e){console.error('sports v3',e);status('Game paused after an error.','Choose Sport and restart.');stopLoop();return}raf=requestAnimationFrame(loop)}

  function startBasket(){
    $('l2pGameName').textContent='🏀 Basket Chaos — First to 5';$('l2pP1Info').textContent='W';$('l2pP2Info').textContent='↑';setMeter(false);setScore(0,0);
    const g={kind:'basketball',scores:[0,0],theme:themes[0],players:[],ball:null,gravity:1200,bounce:.72,friction:.985,freeze:0,winner:null,flash:0,round:0};engine=g;resetBasket(g,true);
    g.update=dt=>updateBasket(g,dt);g.draw=()=>drawBasket(g);status('W vs ↑ — first to 5.','One button controls both teammates on your side: jump, bump, block, grab and shoot. Every basket changes the round.');
  }
  function resetBasket(g,first=false){
    g.theme=pick(themes);g.gravity=rnd(900,1500);g.bounce=rnd(.58,.88);g.friction=rnd(.978,.994);g.round++;
    const floor=462, tall=rnd(.85,1.23), arm=rnd(.75,1.45), outfit=[pick(PAL[0]),pick(PAL[1])];
    g.players=[
      {x:245,y:floor-42,vx:0,vy:0,side:0,scale:tall,arm,skin:pick(SKINS),jersey:outfit[0],trim:PAL[0][1],swing:0},
      {x:330,y:floor-42,vx:0,vy:0,side:0,scale:rnd(.84,1.18),arm:rnd(.75,1.4),skin:pick(SKINS),jersey:outfit[0],trim:PAL[0][1],swing:0},
      {x:630,y:floor-42,vx:0,vy:0,side:1,scale:tall,arm,skin:pick(SKINS),jersey:outfit[1],trim:PAL[1][1],swing:0},
      {x:715,y:floor-42,vx:0,vy:0,side:1,scale:rnd(.84,1.18),arm:rnd(.75,1.4),skin:pick(SKINS),jersey:outfit[1],trim:PAL[1][1],swing:0}
    ];
    const br=rnd(11,19);g.ball={x:480,y:210,vx:rnd(-90,90),vy:rnd(-30,20),r:br,last:-1,trail:[]};g.freeze=first?0:.75;g.flash=.7;
  }
  function basketAction(side){const g=engine;if(!g||g.kind!=='basketball'||g.winner||g.freeze>0)return;const b=g.ball,targetX=side===0?865:95;g.players.filter(p=>p.side===side).forEach((p,j)=>{if(p.y>392)p.vy=-rnd(500,640);p.vx+=(side===0?1:-1)*rnd(135,225)*(j?-.25:1);p.swing=1;setTimeout(()=>p.swing=0,130);if(dist(p,b)<58*p.scale+b.r){const dx=targetX-b.x,dy=188-b.y,d=Math.max(1,Math.hypot(dx,dy)),sp=rnd(550,740);b.vx=dx/d*sp+rnd(-55,55);b.vy=dy/d*sp-rnd(190,290);b.last=side}})}
  function updateBasket(g,dt){if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;if(g.flash>0)g.flash-=dt;const floor=462;
    for(const p of g.players){p.vy+=g.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.10,dt);if(p.y>floor-40*p.scale){p.y=floor-40*p.scale;p.vy=0}p.x=clamp(p.x,60,900)}
    for(let i=0;i<g.players.length;i++)for(let j=i+1;j<g.players.length;j++){const a=g.players[i],b=g.players[j],d=dist(a,b),rr=34*(a.scale+b.scale);if(d<rr&&d>0){const nx=(b.x-a.x)/d,push=(rr-d)*.15;a.x-=nx*push;b.x+=nx*push}}
    const b=g.ball;b.trail.unshift({x:b.x,y:b.y});if(b.trail.length>7)b.trail.pop();b.vy+=g.gravity*.70*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(g.friction,dt*60);
    if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*g.bounce}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.bounce}if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*g.bounce}if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}
    for(const p of g.players){const d=dist(p,b),rr=29*p.scale+b.r;if(d<rr){const nx=(b.x-p.x)/(d||1),ny=(b.y-p.y)/(d||1),push=rr-d;b.x+=nx*push;b.y+=ny*push;b.vx+=nx*190+p.vx*.48;b.vy+=ny*175+p.vy*.35;b.last=p.side}}
    if(b.vy>0&&b.y>180&&b.y<220){if(b.x>842&&b.x<900)scoreBasket(g,0);else if(b.x>60&&b.x<118)scoreBasket(g,1)}
  }
  function scoreBasket(g,side){g.scores[side]++;setScore(...g.scores);g.freeze=.95;status(`🏀 Player ${side+1} scores!`,`Round ${g.round}: ${g.theme.name}. New random court/players/ball next.`);if(g.scores[side]>=5){g.winner=side;status(`🏆 PLAYER ${side+1} WINS 5–${g.scores[1-side]}!`,'Restart for a rematch.');return}setTimeout(()=>{if(engine===g&&!g.winner)resetBasket(g)},700)}
  function drawBasket(g){
    rect(0,0,W,H,g.theme.sky);drawCrowd();rect(0,360,W,180,g.theme.ground);rect(0,454,W,8,'#f6e0aa');
    for(let x=80;x<W;x+=80)rect(x,360,2,94,'#ffffff16');line(480,360,480,462,3,'#ffffff45');ctx.strokeStyle='#ffffff55';ctx.lineWidth=3;ctx.beginPath();ctx.arc(480,410,58,0,Math.PI*2);ctx.stroke();
    for(const side of [0,1]){const x=side===0?68:892,dir=side===0?1:-1;rect(x-4,110,8,146,'#dfefff');rect(x+(dir>0?0:-34),144,34,58,'#ffffff26');line(x,188,x+dir*46,188,7,'#ff7043');line(x+dir*42,190,x+dir*30,226,3,'#eee');line(x+dir*28,190,x+dir*20,226,3,'#eee')}
    text(`${g.scores[0]}  —  ${g.scores[1]}`,480,24,26,'#fff');text(`${g.theme.name} • gravity ${Math.round(g.gravity)} • bounce ${g.bounce.toFixed(2)}`,480,52,12,g.theme.accent);
    drawTeamPlayers(g.players);g.ball.trail.slice().reverse().forEach((q,i)=>circle(q.x,q.y,g.ball.r*(.2+i/g.ball.trail.length*.45),`rgba(255,155,55,${.06+i*.035})`));circle(g.ball.x,g.ball.y,g.ball.r,'#f28b2f');line(g.ball.x-g.ball.r*.8,g.ball.y,g.ball.x+g.ball.r*.8,g.ball.y,2,'#5a2d0e');line(g.ball.x,g.ball.y-g.ball.r*.8,g.ball.x,g.ball.y+g.ball.r*.8,2,'#5a2d0e');
    if(g.flash>0)text('NEW RANDOM ROUND!',480,92,24,'#ffd95e');
  }

  function startSoccer(){
    $('l2pGameName').textContent='⚽ Soccer Chaos — First to 5';$('l2pP1Info').textContent='W';$('l2pP2Info').textContent='↑';setMeter(false);setScore(0,0);
    const g={kind:'soccer',scores:[0,0],theme:themes[0],players:[],ball:null,gravity:1120,bounce:.7,slip:.92,freeze:0,winner:null,round:0};engine=g;resetSoccer(g,true);g.update=dt=>updateSoccer(g,dt);g.draw=()=>drawSoccer(g);status('W vs ↑ — first to 5 goals.','One button makes both teammates jump and swing their legs. Field, outfits, player size and ball physics change after goals.');
  }
  function resetSoccer(g,first=false){g.theme=pick(themes);g.gravity=rnd(860,1450);g.bounce=rnd(.55,.9);g.slip=rnd(.86,.988);g.round++;const floor=456;
    const colors=[pick(PAL[0]),pick(PAL[1])];g.players=[{x:230,y:floor-42,vx:0,vy:0,side:0,scale:rnd(.82,1.23),arm:rnd(.8,1.2),skin:pick(SKINS),jersey:colors[0],trim:PAL[0][1],swing:0},{x:330,y:floor-42,vx:0,vy:0,side:0,scale:rnd(.82,1.18),arm:1,skin:pick(SKINS),jersey:colors[0],trim:PAL[0][1],swing:0},{x:630,y:floor-42,vx:0,vy:0,side:1,scale:rnd(.82,1.23),arm:rnd(.8,1.2),skin:pick(SKINS),jersey:colors[1],trim:PAL[1][1],swing:0},{x:730,y:floor-42,vx:0,vy:0,side:1,scale:rnd(.82,1.18),arm:1,skin:pick(SKINS),jersey:colors[1],trim:PAL[1][1],swing:0}];
    const balls=[{r:16,c:'#fff',name:'soccer ball'},{r:11,c:'#dcff63',name:'mini ball'},{r:21,c:'#ff9ed2',name:'big ball'},{r:13,c:'#ffdf55',name:'tennis-style ball'}],bp=pick(balls);g.ball={x:480,y:310,vx:rnd(-50,50),vy:0,r:bp.r,c:bp.c,name:bp.name,trail:[]};g.freeze=first?0:.7;g.ballName=bp.name}
  function soccerAction(side){const g=engine;if(!g||g.kind!=='soccer'||g.winner||g.freeze>0)return;g.players.filter(p=>p.side===side).forEach((p,j)=>{if(p.y>390)p.vy=-rnd(475,610);p.vx+=(side===0?1:-1)*rnd(115,210)*(j?.7:1);p.swing=1;setTimeout(()=>p.swing=0,150);const b=g.ball;if(dist(p,b)<64*p.scale+b.r){b.vx+=(side===0?1:-1)*rnd(390,610);b.vy=-rnd(250,460)}})}
  function updateSoccer(g,dt){if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;const floor=456;for(const p of g.players){p.vy+=g.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(g.slip,dt*60);if(p.y>floor-40*p.scale){p.y=floor-40*p.scale;p.vy=0}p.x=clamp(p.x,35,925)}const b=g.ball;b.trail.unshift({x:b.x,y:b.y});if(b.trail.length>8)b.trail.pop();b.vy+=g.gravity*.72*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.991,dt*60);if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*g.bounce}for(const p of g.players){const d=dist(p,b),rr=28*p.scale+b.r;if(d<rr){const nx=(b.x-p.x)/(d||1),ny=(b.y-p.y)/(d||1);b.x+=nx*(rr-d);b.y+=ny*(rr-d);b.vx+=nx*180+p.vx*.55;b.vy+=ny*130+p.vy*.25;if(p.swing)b.vx+=(p.side===0?1:-1)*220}}if(b.x<-8&&b.y>330)scoreSoccer(g,1);if(b.x>W+8&&b.y>330)scoreSoccer(g,0);if(b.x<0&&b.y<=330){b.x=b.r;b.vx=Math.abs(b.vx)*.7}if(b.x>W&&b.y<=330){b.x=W-b.r;b.vx=-Math.abs(b.vx)*.7}}
  function scoreSoccer(g,side){g.scores[side]++;setScore(...g.scores);g.freeze=.9;status(`⚽ GOAL — Player ${side+1}!`,`Next round changes field, outfits and ${g.ballName}.`);if(g.scores[side]>=5){g.winner=side;status(`🏆 PLAYER ${side+1} WINS!`,'First to 5 complete.');return}setTimeout(()=>{if(engine===g&&!g.winner)resetSoccer(g)},700)}
  function drawSoccer(g){rect(0,0,W,H,g.theme.sky);circle(110,82,28,'#ffffffaa');circle(135,82,22,'#ffffffaa');circle(820,100,24,'#ffffff88');drawCrowd();rect(0,340,W,200,g.theme.ground);for(let x=0;x<W;x+=90)rect(x,340,45,200,'#ffffff0c');line(480,340,480,456,3,'#ffffff55');ctx.strokeStyle='#ffffff55';ctx.lineWidth=3;ctx.beginPath();ctx.arc(480,404,60,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#f5f5f5';ctx.lineWidth=6;ctx.strokeRect(0,328,72,128);ctx.strokeRect(W-72,328,72,128);for(let y=344;y<456;y+=18){line(0,y,72,y,1,'#ffffff70');line(W-72,y,W,y,1,'#ffffff70')}for(let x=12;x<72;x+=14){line(x,328,x,456,1,'#ffffff70');line(W-x,328,W-x,456,1,'#ffffff70')}
    text(`${g.scores[0]}  —  ${g.scores[1]}`,480,24,26,'#fff');text(`${g.theme.name} • ${g.ballName} • grip ${g.slip.toFixed(2)}`,480,52,12,g.theme.accent);drawTeamPlayers(g.players);g.ball.trail.slice().reverse().forEach((q,i)=>circle(q.x,q.y,g.ball.r*(.15+i/g.ball.trail.length*.35),`rgba(255,255,255,${.04+i*.025})`));circle(g.ball.x,g.ball.y,g.ball.r,g.ball.c);circle(g.ball.x-5,g.ball.y-4,Math.max(2,g.ball.r*.18),'#111');circle(g.ball.x+5,g.ball.y+3,Math.max(2,g.ball.r*.16),'#111')}

  function startDiamond(kind){
    const kick=kind==='kickball';$('l2pGameName').textContent=`${kick?'🔴 Kickball':'⚾ Baseball'} — Field Duel`;$('l2pP1Info').textContent='WASD + F';$('l2pP2Info').textContent='Arrows + Enter';setScore(0,0);
    const g={kind,score:[0,0],inning:1,offense:0,outs:0,phase:'meter',meter:0,meterDir:1,runner:null,ball:null,fielder:null,pitcher:null,flash:0,message:'',winner:null};engine=g;resetDiamondPlay(g,true);g.update=dt=>updateDiamond(g,dt);g.draw=()=>drawDiamond(g);status(`${kick?'KICK':'BAT'}: Player 1 is up.`,`P1 moves WASD and uses F. P2 moves arrows and uses Enter. Stop the meter, then field/catch and throw.`)
  }
  function diamondKey(side){return side===0?'F':'Enter'}
  function resetDiamondPlay(g,first=false){g.phase='meter';g.meter=first?.08:rnd(.05,.3);g.meterDir=1;g.runner={x:480,y:422,vx:0,vy:0,side:g.offense,target:1,progress:0};g.fielder={x:g.offense===0?700:260,y:255,vx:0,vy:0,side:1-g.offense,has:false,scale:1,skin:pick(SKINS),jersey:PAL[1-g.offense][0],trim:PAL[1-g.offense][1]};g.pitcher={x:480,y:300,vx:0,vy:0,side:1-g.offense,scale:1,skin:pick(SKINS),jersey:PAL[1-g.offense][0],trim:PAL[1-g.offense][1]};g.ball={x:480,y:350,vx:0,vy:0,z:0,vz:0,held:false};setMeter(true,`Player ${g.offense+1}: press ${diamondKey(g.offense)} to ${g.kind==='kickball'?'KICK':'SWING'} — hit SUPER in the middle`);status(`${g.kind==='kickball'?'KICK':'BAT'}TER READY`,`Inning ${g.inning} • ${g.outs} out${g.outs===1?'':'s'}. Defender: move to catch the ball, then throw.`)}
  function powerFromMeter(v){const d=Math.abs(v-.5);if(d<.055)return{tag:'SUPER',p:1.0,c:'#ffdb46'};if(d<.18)return{tag:'GOOD',p:.76,c:'#5ff0ad'};if(d<.32)return{tag:'WEAK',p:.48,c:'#e3a04a'};return{tag:'MISS',p:0,c:'#ff607d'}}
  function strikeDiamond(){const g=engine;if(!g||!['kickball','baseball'].includes(g.kind)||g.phase!=='meter')return;const pow=powerFromMeter(g.meter);setMeter(false);if(pow.p===0){g.outs++;g.flash=.6;status('❌ MISS — OUT!',`${g.outs} out${g.outs===1?'':'s'}.`);return setTimeout(()=>advanceDiamond(g),650)}g.phase='flight';const angle=rnd(-.72,.72),sp=360+pow.p*510;g.ball.x=480;g.ball.y=398;g.ball.vx=Math.sin(angle)*sp;g.ball.vy=-Math.cos(angle)*sp*.46;g.ball.z=10;g.ball.vz=230+pow.p*430;g.ball.held=false;g.runner.progress=0;g.message=pow.tag;g.flash=.8;status(`${pow.tag}! ${g.kind==='kickball'?'KICKED':'HIT'}!`,'Offense runs automatically. Defender moves to the ball, catches it, then presses throw.');}
  function advanceDiamond(g){if(g.outs>=3){g.outs=0;g.offense=1-g.offense;if(g.offense===0)g.inning++;if(g.inning>3){g.winner=g.score[0]===g.score[1]?-1:(g.score[0]>g.score[1]?0:1);setMeter(false);status(g.winner<0?'🤝 TIE GAME!':`🏆 PLAYER ${g.winner+1} WINS!`,`Final ${g.score[0]}–${g.score[1]}`);return}}resetDiamondPlay(g)}
  function moveDefender(g,dt){const f=g.fielder;let dx=0,dy=0;if(f.side===0){if(keys.has('a'))dx--;if(keys.has('d'))dx++;if(keys.has('w'))dy--;if(keys.has('s'))dy++}else{if(keys.has('arrowleft'))dx--;if(keys.has('arrowright'))dx++;if(keys.has('arrowup'))dy--;if(keys.has('arrowdown'))dy++}const n=Math.hypot(dx,dy)||1;f.x=clamp(f.x+dx/n*250*dt,80,880);f.y=clamp(f.y+dy/n*250*dt,160,450)}
  function throwDiamond(side){const g=engine;if(!g||!['kickball','baseball'].includes(g.kind)||g.phase!=='field'||g.fielder.side!==side||!g.fielder.has)return;g.fielder.has=false;g.phase='throw';const target={x:690,y:350};g.ball.x=g.fielder.x;g.ball.y=g.fielder.y;const d=Math.hypot(target.x-g.ball.x,target.y-g.ball.y)||1;g.ball.vx=(target.x-g.ball.x)/d*850;g.ball.vy=(target.y-g.ball.y)/d*850;g.ball.z=35;g.ball.vz=120;status('🚀 THROW TO FIRST!','Can the throw beat the runner?')}
  function updateDiamond(g,dt){if(g.winner!==null)return;if(g.flash>0)g.flash-=dt;if(g.phase==='meter'){g.meter+=g.meterDir*dt*1.55;if(g.meter>=1){g.meter=1;g.meterDir=-1}if(g.meter<=0){g.meter=0;g.meterDir=1}$('l2pMeterNeedle').style.left=`calc(${g.meter*100}% - 2px)`;return}
    if(['flight','field','throw'].includes(g.phase)){g.runner.progress=clamp(g.runner.progress+dt*.22,0,1);const t=g.runner.progress;g.runner.x=480+(690-480)*t;g.runner.y=422+(350-422)*t;moveDefender(g,dt)}
    const b=g.ball;if(g.phase==='flight'){b.vz-=760*dt;b.z+=b.vz*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.992,dt*60);b.vy*=Math.pow(.992,dt*60);if(b.z<=0){b.z=0;b.vz=Math.abs(b.vz)*.34;b.vx*=.72;b.vy*=.72;if(Math.abs(b.vz)<35){g.phase='field';status('BALL IN PLAY','Defender: move with your keys, touch the ball to pick it up, then press throw.')}}if(b.x<40||b.x>920||b.y<120||b.y>475){b.x=clamp(b.x,40,920);b.y=clamp(b.y,120,475);b.vx*=-.45;b.vy*=-.45}}
    if(g.phase==='field'){b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.94,dt*60);b.vy*=Math.pow(.94,dt*60);if(!g.fielder.has&&Math.hypot(g.fielder.x-b.x,g.fielder.y-b.y)<34){g.fielder.has=true;b.held=true;status('🧤 BALL CAUGHT / PICKED UP!',`Player ${g.fielder.side+1}: press ${diamondKey(g.fielder.side)} to throw to first.`)}if(g.fielder.has){b.x=g.fielder.x;b.y=g.fielder.y-28}}
    if(g.phase==='throw'){b.x+=b.vx*dt;b.y+=b.vy*dt;b.z=Math.max(0,b.z+b.vz*dt);b.vz-=580*dt;if(Math.hypot(b.x-690,b.y-350)<35){const out=g.runner.progress<.98;if(out){g.outs++;status('🧤 OUT AT FIRST!',`${g.outs} out${g.outs===1?'':'s'}.`)}else{g.score[g.offense]++;setScore(...g.score);status('🏃 SAFE! RUN SCORES!',`Score ${g.score[0]}–${g.score[1]}`)}g.phase='dead';setTimeout(()=>advanceDiamond(g),700)}}
    if(['flight','field'].includes(g.phase)&&g.runner.progress>=1){g.score[g.offense]++;setScore(...g.score);g.phase='dead';status('🏃 SAFE! RUN SCORES!',`Score ${g.score[0]}–${g.score[1]}`);setTimeout(()=>advanceDiamond(g),700)}
  }
  function drawDiamond(g){
    rect(0,0,W,H,'#263a62');circle(820,72,42,'#ffe07b');for(let x=0;x<W;x+=60){rect(x,105,44,48,x%120?'#23314c':'#30496b');for(let y=114;y<145;y+=12)for(let xx=x+7;xx<x+40;xx+=11)circle(xx,y,3,pick(['#ffcc80','#7dd6ff','#ff7fa8','#fff']))}
    rect(0,153,W,387,'#2f764b');ctx.fillStyle='#c79555';ctx.beginPath();ctx.moveTo(480,430);ctx.lineTo(235,235);ctx.lineTo(480,155);ctx.lineTo(725,235);ctx.closePath();ctx.fill();ctx.fillStyle='#3e8757';ctx.beginPath();ctx.moveTo(480,392);ctx.lineTo(310,250);ctx.lineTo(480,195);ctx.lineTo(650,250);ctx.closePath();ctx.fill();
    line(480,430,170,175,3,'#fff');line(480,430,790,175,3,'#fff');line(120,165,840,165,5,'#173a27');for(let x=130;x<840;x+=35)line(x,145,x,184,2,'#ffffff40');
    const bases=[[480,422],[690,350],[480,236],[270,350]];bases.forEach(([x,y],i)=>{ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);rect(-10,-10,20,20,'#fff');ctx.restore();if(i)text(['','1B','2B','3B'][i],x,y+22,10,'#ffffffcc')});
    rect(24,205,150,72,'#142337');rect(786,205,150,72,'#142337');text('P1 DUGOUT',99,220,11,'#70dcff');text('P2 DUGOUT',861,220,11,'#ff7fad');for(let i=0;i<4;i++){drawPixelPerson({x:55+i*28,y:258,scale:.55,vx:0,vy:0,side:0,skin:pick(SKINS),jersey:PAL[0][0],trim:PAL[0][1]},0);drawPixelPerson({x:815+i*28,y:258,scale:.55,vx:0,vy:0,side:1,skin:pick(SKINS),jersey:PAL[1][0],trim:PAL[1][1]},1)}
    rect(385,72,190,65,'#101725');text(`${g.kind==='kickball'?'KICKBALL':'BASEBALL'}`,480,91,14,'#ffd95e');text(`P1 ${g.score[0]}   INN ${g.inning}   P2 ${g.score[1]}`,480,116,14,'#fff');text(`${g.outs} OUT`,480,137,10,'#ff9b9b');
    drawPixelPerson(g.pitcher,g.pitcher.side,g.pitcher);drawPixelPerson(g.fielder,g.fielder.side,g.fielder);const rSide=g.runner.side;drawPixelPerson({x:g.runner.x,y:g.runner.y,scale:.82,vx:120,vy:0,side:rSide,skin:pick(SKINS),jersey:PAL[rSide][0],trim:PAL[rSide][1]},rSide);
    if(g.phase==='meter'){const off=g.offense;drawPixelPerson({x:440,y:420,scale:1.05,vx:0,vy:0,side:off,skin:pick(SKINS),jersey:PAL[off][0],trim:PAL[off][1],swing:g.kind==='baseball'?1:0},off);if(g.kind==='baseball')line(462,385,495,350,7,'#c7935a');else line(461,422,494,435,10,'#f1bd8f')}
    if(!g.ball.held){const sy=g.ball.y-g.ball.z*.22;circle(g.ball.x,sy,g.kind==='kickball'?13:7,g.kind==='kickball'?'#e84444':'#f5f5f5');if(g.kind==='baseball'){ctx.strokeStyle='#d44';ctx.lineWidth=1;ctx.beginPath();ctx.arc(g.ball.x,sy,4,0,Math.PI);ctx.stroke()}}else circle(g.fielder.x,g.fielder.y-28,g.kind==='kickball'?13:7,g.kind==='kickball'?'#e84444':'#fff');
    if(g.message)text(g.message,480,176,25,g.message==='SUPER'?'#ffd95e':'#fff');
  }

  function actionKey(side){if(mode==='basketball')basketAction(side);else if(mode==='soccer')soccerAction(side);else if(mode==='kickball'||mode==='baseball'){if(engine.phase==='meter'&&engine.offense===side)strikeDiamond();else if(engine.phase==='field'&&engine.fielder.side===side&&engine.fielder.has)throwDiamond(side)}}

  $('l2pMenu').addEventListener('click',e=>{const c=e.target.closest('[data-game]');if(c)start(c.dataset.game)});$('l2pClose').onclick=close;$('l2pBack').onclick=showMenu;$('l2pRestart').onclick=()=>mode&&start(mode);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  window.addEventListener('keydown',e=>{if(!overlay.classList.contains('show')||!engine)return;const k=e.key.toLowerCase();keys.add(k);if(['w','arrowup','arrowdown','arrowleft','arrowright','a','s','d','f','enter'].includes(k))e.preventDefault();if(e.repeat)return;if(mode==='basketball'||mode==='soccer'){if(k==='w')actionKey(0);if(k==='arrowup')actionKey(1)}else{if(k==='f')actionKey(0);if(k==='enter')actionKey(1)}if(k==='escape')close()},{capture:true});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()),{capture:true});

  function addButton(){if(document.getElementById('localSportsBtn'))return;const bar=document.querySelector('.featurebar');if(!bar)return;const b=document.createElement('button');b.id='localSportsBtn';b.className='btn';b.textContent='🎮 2-Player Games';b.onclick=open;const mini=document.getElementById('minigamesBtn');if(mini&&mini.parentNode===bar)mini.after(b);else bar.appendChild(b)}
  addButton();new MutationObserver(addButton).observe(document.body,{childList:true,subtree:true});
})();