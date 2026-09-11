(() => {
  if (window.__needohSportsArcadeV4) return;
  window.__needohSportsArcadeV4 = true;

  // Remove the older local sports UI. Older listeners become inert because their
  // overlay node is detached and no longer has the `show` class.
  document.getElementById('l2pSportsOverlay')?.remove();
  document.getElementById('localSportsBtn')?.remove();
  document.getElementById('l2pSportsV3Styles')?.remove();

  const style = document.createElement('style');
  style.id = 'needohSportsArcadeV4Styles';
  style.textContent = `
    #nsa4Overlay{position:fixed;inset:0;z-index:490;background:rgba(3,6,16,.93);display:none;align-items:center;justify-content:center;padding:12px}
    #nsa4Overlay.show{display:flex}
    #nsa4Card{width:min(1120px,100%);max-height:95vh;overflow:auto;background:linear-gradient(145deg,#101832,#321944);border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:15px;color:white;box-shadow:0 30px 100px rgba(0,0,0,.65)}
    .nsa4-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.nsa4-head h2{margin:0;font-size:22px}.nsa4-close{border:0;border-radius:50%;width:40px;height:40px;background:#ffffff18;color:#fff;font-size:22px;cursor:pointer}
    #nsa4Menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}.nsa4-game{border:1px solid #ffffff20;background:#ffffff12;color:#fff;border-radius:18px;padding:18px;text-align:left;cursor:pointer}.nsa4-game:hover{background:#ffffff1d;transform:translateY(-1px)}.nsa4-game b{display:block;font-size:21px;margin-bottom:6px}.nsa4-game span{font-size:13px;color:#d4d2e4;line-height:1.42}.nsa4-random{grid-column:1/-1;text-align:center;background:linear-gradient(135deg,#6f55ff,#ff4aa7)}
    #nsa4Arena{display:none}#nsa4Arena.show{display:block}.nsa4-top{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin:10px 0}.nsa4-score{padding:9px 12px;border-radius:14px;background:#ffffff12;text-align:center;font-weight:900}.nsa4-score b{display:block;font-size:29px}.nsa4-title{font-weight:1000;color:#ffd95e;font-size:19px;text-align:center;min-width:250px}
    #nsa4CanvasWrap{position:relative;width:100%;aspect-ratio:960/540;border-radius:18px;overflow:hidden;border:1px solid #ffffff20;background:#0a1020}#nsa4Canvas{display:block;width:100%;height:100%;image-rendering:pixelated;touch-action:none}
    #nsa4MeterPanel{display:none;position:absolute;left:50%;bottom:12px;transform:translateX(-50%);width:min(650px,92%);padding:10px 12px;border-radius:15px;background:#070b16ed;border:1px solid #ffffff25;backdrop-filter:blur(8px)}#nsa4MeterPanel.show{display:block}.nsa4-meter-label{text-align:center;font-weight:900;font-size:13px;margin-bottom:6px}.nsa4-meter{height:31px;position:relative;display:grid;grid-template-columns:12fr 14fr 19fr 10fr 19fr 14fr 12fr;border-radius:9px;overflow:hidden;border:1px solid #ffffff30}.nsa4-meter span{display:grid;place-items:center;font-size:10px;font-weight:1000;text-shadow:0 2px 3px #000}.nsa4-meter .miss{background:#67263b}.nsa4-meter .weak{background:#906427}.nsa4-meter .good{background:#27795e}.nsa4-meter .super{background:linear-gradient(90deg,#ffcf39,#ff596f,#a959ff)}#nsa4Needle{position:absolute;top:-3px;bottom:-3px;width:4px;background:#fff;box-shadow:0 0 12px #fff;left:0;border-radius:4px}
    .nsa4-help{margin-top:9px;padding:10px 12px;background:#ffffff10;border-radius:14px}.nsa4-status{font-weight:1000;font-size:14px}.nsa4-sub{font-size:12px;color:#c9c7d8;margin-top:3px}.nsa4-buttons{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:10px}.nsa4-small{border:0;border-radius:12px;padding:9px 13px;background:#ffffff18;color:#fff;font-weight:900;cursor:pointer}.nsa4-small.primary{background:linear-gradient(135deg,#1ec9aa,#5d67ff)}
    @media(max-width:680px){#nsa4Menu,.nsa4-top{grid-template-columns:1fr}.nsa4-random{grid-column:auto}.nsa4-title{order:-1}.nsa4-score b{font-size:22px}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'nsa4Overlay';
  overlay.innerHTML = `
    <div id="nsa4Card">
      <div class="nsa4-head"><h2>🎮 2-Player Sports Arcade</h2><button id="nsa4Close" class="nsa4-close">×</button></div>
      <div id="nsa4Menu">
        <button class="nsa4-game" data-game="basketball"><b>🏀 Basket Chaos</b><span>W vs ↑. Pixel people, real ball possession, jumping, steals, blocks, dunks and shots. First to 5. Random court and physics after every basket.</span></button>
        <button class="nsa4-game" data-game="soccer"><b>⚽ Soccer Chaos</b><span>W vs ↑. Pixel people jump in the direction they face and kick hard on contact. First to 5. Easier goals and random fields/balls after each score.</span></button>
        <button class="nsa4-game" data-game="kickball"><b>🔴 Kickball Field Duel</b><span>Full field graphics, timing bar, running, catching, pickup and directional throws. P1 uses WASD + F; P2 uses arrows + Enter.</span></button>
        <button class="nsa4-game" data-game="baseball"><b>⚾ Baseball Field Duel</b><span>Ballpark, pitcher, batter, runner, fielders, timing bar, catches and directional throws. P1 uses WASD + F; P2 uses arrows + Enter.</span></button>
        <button class="nsa4-game nsa4-random" data-game="random"><b>🎲 Random Sport</b><span>Choose one of the four games at random.</span></button>
      </div>
      <div id="nsa4Arena">
        <div class="nsa4-top">
          <div class="nsa4-score">PLAYER 1<b id="nsa4P1Score">0</b><span id="nsa4P1Info"></span></div>
          <div id="nsa4Title" class="nsa4-title"></div>
          <div class="nsa4-score">PLAYER 2<b id="nsa4P2Score">0</b><span id="nsa4P2Info"></span></div>
        </div>
        <div id="nsa4CanvasWrap">
          <canvas id="nsa4Canvas" width="960" height="540"></canvas>
          <div id="nsa4MeterPanel"><div id="nsa4MeterLabel" class="nsa4-meter-label"></div><div class="nsa4-meter"><span class="miss">MISS</span><span class="weak">WEAK</span><span class="good">GOOD</span><span class="super">SUPER</span><span class="good">GOOD</span><span class="weak">WEAK</span><span class="miss">MISS</span><i id="nsa4Needle"></i></div></div>
        </div>
        <div class="nsa4-help"><div id="nsa4Status" class="nsa4-status"></div><div id="nsa4Sub" class="nsa4-sub"></div></div>
        <div class="nsa4-buttons"><button id="nsa4Restart" class="nsa4-small primary">↻ Restart Match</button><button id="nsa4Back" class="nsa4-small">← Choose Sport</button></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = id => document.getElementById(id);
  const canvas = $('nsa4Canvas');
  const ctx = canvas.getContext('2d');
  const W = 960, H = 540;
  const keys = new Set();
  let engine = null, mode = null, raf = 0, last = 0;

  const PALS = [
    {jersey:'#2bc3ff',trim:'#1750c5',shorts:'#173d8c'},
    {jersey:'#ff5f96',trim:'#8f35cd',shorts:'#66228f'}
  ];
  const SKINS = ['#f2c39b','#d89a6d','#9d6848','#6f472f'];
  const THEMES = [
    {name:'City Night',sky:'#161d45',ground:'#39475c',accent:'#58d6ff'},
    {name:'Sunset',sky:'#9f536f',ground:'#65724f',accent:'#ffd56b'},
    {name:'Snow',sky:'#8db5d6',ground:'#e6eff7',accent:'#8ee7ff'},
    {name:'Beach',sky:'#4d9ec8',ground:'#d9b267',accent:'#78f0dd'},
    {name:'Neon',sky:'#25103e',ground:'#173d3d',accent:'#ff69d5'}
  ];

  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const rnd = (a,b) => a + Math.random()*(b-a);
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
  const signNZ = (v,fallback=1) => Math.abs(v)>.001 ? Math.sign(v) : fallback;

  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
  function circle(x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
  function line(x1,y1,x2,y2,w,c){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
  function text(t,x,y,s=20,c='#fff',align='center',weight=900){ctx.fillStyle=c;ctx.font=`${weight} ${s}px system-ui,-apple-system,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(t,x,y)}
  function setScore(a,b){$('nsa4P1Score').textContent=a;$('nsa4P2Score').textContent=b}
  function status(a,b=''){$('nsa4Status').textContent=a;$('nsa4Sub').textContent=b}
  function setMeter(show,label=''){$('nsa4MeterPanel').classList.toggle('show',!!show);if(label)$('nsa4MeterLabel').textContent=label}

  function drawPixelPerson(p,team,opts={}){
    const pal=PALS[team], s=p.scale||1, face=p.face|| (team===0?1:-1), skin=p.skin||SKINS[(p.id||0)%SKINS.length];
    const x=p.x,y=p.y, airborne=Math.abs(p.vy||0)>15;
    ctx.save();ctx.translate(x,y);
    const lean=clamp((p.vx||0)/420,-.35,.35);ctx.rotate(lean*.22);
    ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(0,32*s,19*s,5*s,0,0,Math.PI*2);ctx.fill();
    rect(-12*s,-44*s,24*s,20*s,skin);rect(-10*s,-41*s,20*s,4*s,'#553529');
    rect(-16*s,-24*s,32*s,36*s,pal.jersey);rect(-16*s,-4*s,32*s,5*s,pal.trim);
    rect(-13*s,12*s,10*s,24*s,pal.shorts);rect(3*s,12*s,10*s,24*s,pal.shorts);
    rect(-15*s,34*s,13*s,7*s,'#f4f4f4');rect(2*s,34*s,13*s,7*s,'#f4f4f4');
    const swing=p.swing||0, arm=(p.arm||1)*s;
    const handX=(28+16*swing)*arm*face;
    line(-13*s,-16*s,-24*s*face,-3*s,8*s,skin);
    line(13*s,-16*s,handX,-10*s-(airborne?5:0),8*s,skin);
    if(opts.ballHeld){circle(handX,-12*s-(airborne?5:0),opts.ballR||12,opts.ballColor||'#f58a2a')}
    rect(-6*s,-14*s,12*s,12*s,'#ffffff20');
    ctx.restore();
  }

  function drawCrowd(){
    for(let x=18;x<W;x+=28){const y=48+((x*7)%12);rect(x,y,16,20,'#ffffff18');circle(x+8,y-4,6,pick(SKINS))}
  }

  function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function startLoop(){stopLoop();last=performance.now();raf=requestAnimationFrame(loop)}
  function loop(now){
    if(!engine||!overlay.classList.contains('show')){raf=0;return}
    const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;
    try{engine.update?.(dt);engine.draw?.()}catch(e){console.error('sports arcade v4',e);status('Game paused after an error.','Choose Sport and restart.');stopLoop();return}
    raf=requestAnimationFrame(loop);
  }

  function open(){overlay.classList.add('show');showMenu()}
  function close(){overlay.classList.remove('show');stopLoop();engine=null;mode=null;keys.clear()}
  function showMenu(){stopLoop();engine=null;mode=null;keys.clear();$('nsa4Menu').style.display='grid';$('nsa4Arena').classList.remove('show');setMeter(false)}
  function start(name){
    if(name==='random')name=pick(['basketball','soccer','kickball','baseball']);
    mode=name;$('nsa4Menu').style.display='none';$('nsa4Arena').classList.add('show');
    if(name==='basketball')startBasketball();else if(name==='soccer')startSoccer();else startDiamond(name);
    startLoop();
  }

  // ---------------- Basketball ----------------
  function startBasketball(){
    $('nsa4Title').textContent='🏀 Basket Chaos — First to 5';$('nsa4P1Info').textContent='W = jump / shoot';$('nsa4P2Info').textContent='↑ = jump / shoot';setMeter(false);setScore(0,0);
    const g={kind:'basketball',scores:[0,0],players:[],ball:null,theme:pick(THEMES),gravity:1200,bounce:.73,freeze:0,winner:null,round:0};
    engine=g;resetBasketRound(g,true);g.update=dt=>updateBasketball(g,dt);g.draw=()=>drawBasketball(g);
    status('W vs ↑ — first to 5.','Touch the loose ball to grab it. While holding it, press your key to jump and shoot. Defenders can bump it loose.');
  }
  function resetBasketRound(g,first=false){
    g.theme=pick(THEMES);g.gravity=rnd(930,1370);g.bounce=rnd(.62,.82);g.round++;g.freeze=first?0:.65;
    const floor=462;
    g.players=[
      {id:0,side:0,x:250,y:floor-42,vx:0,vy:0,face:1,scale:rnd(.9,1.12),arm:rnd(.9,1.25),skin:pick(SKINS),swing:0,holdCd:0},
      {id:1,side:0,x:330,y:floor-42,vx:0,vy:0,face:1,scale:rnd(.9,1.12),arm:rnd(.9,1.25),skin:pick(SKINS),swing:0,holdCd:0},
      {id:2,side:1,x:630,y:floor-42,vx:0,vy:0,face:-1,scale:rnd(.9,1.12),arm:rnd(.9,1.25),skin:pick(SKINS),swing:0,holdCd:0},
      {id:3,side:1,x:710,y:floor-42,vx:0,vy:0,face:-1,scale:rnd(.9,1.12),arm:rnd(.9,1.25),skin:pick(SKINS),swing:0,holdCd:0}
    ];
    g.ball={x:480,y:220,vx:rnd(-60,60),vy:0,r:rnd(12,16),holder:null,lastSide:null,releaseCd:0};
  }
  function basketAction(side){
    const g=engine;if(!g||g.kind!=='basketball'||g.winner||g.freeze>0)return;
    const team=g.players.filter(p=>p.side===side);
    const holder=team.find(p=>g.ball.holder===p.id);
    for(const p of team){
      p.swing=1;
      const grounded=p.y>=420;
      if(grounded)p.vy=-rnd(500,565);
      p.vx+=p.face*rnd(150,220);
    }
    if(holder){
      const b=g.ball,targetX=side===0?835:125,targetY=170;
      const nearHoop=Math.abs(holder.x-targetX)<145;
      const dx=targetX-holder.x,dy=targetY-holder.y;
      const d=Math.max(1,Math.hypot(dx,dy));
      const speed=nearHoop?rnd(610,700):rnd(520,625);
      b.holder=null;b.lastSide=side;b.releaseCd=.24;
      b.x=holder.x+holder.face*32;b.y=holder.y-28;
      b.vx=dx/d*speed + holder.face*(nearHoop?70:20);
      b.vy=dy/d*speed-rnd(210,285);
      holder.vx-=holder.face*35;
    }
  }
  function handPoint(p){return{x:p.x+(p.face||1)*(31*(p.arm||1)*(p.scale||1)),y:p.y-14*(p.scale||1)}}
  function updateBasketball(g,dt){
    if(g.freeze>0){g.freeze-=dt;return} if(g.winner)return;
    const floor=462,b=g.ball;
    for(const p of g.players){
      p.holdCd=Math.max(0,p.holdCd-dt);p.swing=Math.max(0,p.swing-dt*4.6);
      p.vy+=g.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.90,dt*60);
      if(Math.abs(p.vx)>15)p.face=Math.sign(p.vx);
      if(p.y>floor-40*(p.scale||1)){p.y=floor-40*(p.scale||1);p.vy=0}
      p.x=clamp(p.x,55,905);
    }
    for(let i=0;i<g.players.length;i++)for(let j=i+1;j<g.players.length;j++){
      const a=g.players[i],c=g.players[j],dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy),minD=31*((a.scale||1)+(c.scale||1));
      if(d<minD&&d>0){const nx=dx/d,push=(minD-d)*.45;a.x-=nx*push;c.x+=nx*push;const impact=Math.abs(a.vx-c.vx)+Math.abs(a.vy-c.vy)*.35;a.vx-=nx*45;c.vx+=nx*45;
        if(a.side!==c.side&&impact>210&&b.holder!=null){const h=g.players.find(p=>p.id===b.holder);if(h&&(h.id===a.id||h.id===c.id)){b.holder=null;b.releaseCd=.32;b.vx=(h.side===0?-1:1)*rnd(180,280);b.vy=-rnd(180,260);h.holdCd=.45;}}
      }
    }
    if(b.holder!=null){
      const h=g.players.find(p=>p.id===b.holder);
      if(!h){b.holder=null}else{const hp=handPoint(h);b.x=hp.x;b.y=hp.y;b.vx=h.vx;b.vy=h.vy;b.lastSide=h.side;}
    } else {
      b.releaseCd=Math.max(0,b.releaseCd-dt);b.vy+=g.gravity*.72*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.992,dt*60);
      if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*g.bounce}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.bounce}
      if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*g.bounce}if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}
      for(const p of g.players){
        const hp=handPoint(p),d=Math.hypot(b.x-hp.x,b.y-hp.y);
        if(b.releaseCd<=0&&p.holdCd<=0&&d<34*(p.scale||1)&&Math.hypot(b.vx-p.vx,b.vy-p.vy)<600){b.holder=p.id;b.lastSide=p.side;b.vx=0;b.vy=0;break}
        const bodyD=distance(p,b),rr=27*(p.scale||1)+b.r;
        if(bodyD<rr&&bodyD>0){const nx=(b.x-p.x)/bodyD,ny=(b.y-p.y)/bodyD,push=rr-bodyD;b.x+=nx*push;b.y+=ny*push;b.vx+=nx*100+p.vx*.55;b.vy+=ny*90+p.vy*.35;b.lastSide=p.side;}
      }
      if(b.vy>20&&b.y>142&&b.y<215){
        if(b.x>805&&b.x<875)scoreBasket(g,0);
        else if(b.x>85&&b.x<155)scoreBasket(g,1);
      }
    }
  }
  function scoreBasket(g,side){
    if(g.freeze>0||g.winner)return;g.scores[side]++;setScore(...g.scores);
    if(g.scores[side]>=5){g.winner=side;status(`🏆 Player ${side+1} wins Basketball!`,'Restart for a rematch.');return}
    status(`Player ${side+1} scores!`,`Round ${g.round+1}: court, gravity, ball and player traits changed.`);resetBasketRound(g,false);
  }
  function drawBasketball(g){
    const t=g.theme;rect(0,0,W,H,t.sky);drawCrowd();rect(0,110,W,352,t.ground);rect(0,462,W,78,'#242431');
    line(W/2,120,W/2,462,4,'#ffffff55');ctx.strokeStyle='#ffffff55';ctx.lineWidth=4;ctx.beginPath();ctx.arc(W/2,350,76,0,Math.PI*2);ctx.stroke();
    for(const side of [0,1]){const bx=side===0?892:68,rimX=side===0?842:118;rect(bx-5,105,10,118,'#e8f0ff');rect(side===0?858:57,128,34,7,'#f4f4f4');line(rimX-28,172,rimX+28,172,7,'#ff7d2b');for(let i=-2;i<=2;i++)line(rimX+i*8,175,rimX+i*5,205,2,'#ffffff99')}
    for(const p of g.players)drawPixelPerson(p,p.side,{ballHeld:g.ball.holder===p.id,ballR:g.ball.r,ballColor:'#f28a2d'});
    if(g.ball.holder==null){circle(g.ball.x,g.ball.y,g.ball.r+2,'#1c1208');circle(g.ball.x,g.ball.y,g.ball.r,'#f28a2d');line(g.ball.x-g.ball.r,g.ball.y,g.ball.x+g.ball.r,g.ball.y,2,'#3a220e');}
    text(`${g.scores[0]}  -  ${g.scores[1]}`,W/2,86,34,'#fff');text(g.theme.name,W/2,116,14,g.theme.accent);
  }

  // ---------------- Soccer ----------------
  function startSoccer(){
    $('nsa4Title').textContent='⚽ Soccer Chaos — First to 5';$('nsa4P1Info').textContent='W = jump / kick';$('nsa4P2Info').textContent='↑ = jump / kick';setMeter(false);setScore(0,0);
    const g={kind:'soccer',scores:[0,0],players:[],ball:null,theme:pick(THEMES),gravity:1050,bounce:.74,slip:.94,freeze:0,winner:null,round:0};engine=g;resetSoccerRound(g,true);g.update=dt=>updateSoccer(g,dt);g.draw=()=>drawSoccer(g);
    status('W vs ↑ — first to 5.','Each press jumps BOTH teammates in the direction they face. Contact kicks the ball hard toward the other goal.');
  }
  function resetSoccerRound(g,first=false){
    g.theme=pick(THEMES);g.gravity=rnd(860,1180);g.bounce=rnd(.66,.86);g.slip=g.theme.name==='Snow'?.985:rnd(.93,.968);g.round++;g.freeze=first?0:.65;
    const floor=458;
    g.players=[
      {id:0,side:0,x:245,y:floor-40,vx:0,vy:0,face:1,scale:rnd(.9,1.08),arm:1,skin:pick(SKINS),swing:0},
      {id:1,side:0,x:330,y:floor-40,vx:0,vy:0,face:1,scale:rnd(.9,1.08),arm:1,skin:pick(SKINS),swing:0},
      {id:2,side:1,x:630,y:floor-40,vx:0,vy:0,face:-1,scale:rnd(.9,1.08),arm:1,skin:pick(SKINS),swing:0},
      {id:3,side:1,x:715,y:floor-40,vx:0,vy:0,face:-1,scale:rnd(.9,1.08),arm:1,skin:pick(SKINS),swing:0}
    ];
    g.ball={x:480,y:260,vx:rnd(-45,45),vy:-40,r:rnd(13,19)};
  }
  function soccerAction(side){
    const g=engine;if(!g||g.kind!=='soccer'||g.winner||g.freeze>0)return;
    for(const p of g.players.filter(p=>p.side===side)){
      if(Math.abs(p.vx)<25)p.face=signNZ(g.ball.x-p.x,p.face);
      p.vy=-rnd(470,535);p.vx+=p.face*rnd(215,285);p.swing=1;
      const d=distance(p,g.ball);if(d<62*(p.scale||1)+g.ball.r){g.ball.vx=p.face*rnd(430,560)+p.vx*.35;g.ball.vy=-rnd(210,340);}
    }
  }
  function updateSoccer(g,dt){
    if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;
    const floor=458,b=g.ball;
    for(const p of g.players){
      p.swing=Math.max(0,p.swing-dt*4.5);p.vy+=g.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(g.slip,dt*60);
      if(Math.abs(p.vx)>18)p.face=Math.sign(p.vx);
      if(p.y>floor-39*(p.scale||1)){p.y=floor-39*(p.scale||1);p.vy=0}
      p.x=clamp(p.x,38,922);
    }
    b.vy+=g.gravity*.72*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.992,dt*60);
    if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*g.bounce}if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}
    for(const p of g.players){
      const d=distance(p,b),rr=31*(p.scale||1)+b.r;
      if(d<rr&&d>0){const nx=(b.x-p.x)/d,ny=(b.y-p.y)/d,push=rr-d;b.x+=nx*push;b.y+=ny*push;const face=p.face|| (p.side===0?1:-1);b.vx+=face*(p.swing>.15?330:150)+p.vx*.8+nx*90;b.vy+=ny*120+(p.swing>.15?-170:0);}
    }
    if(b.x<78&&b.y>275&&b.y<458){scoreSoccer(g,1);return}
    if(b.x>882&&b.y>275&&b.y<458){scoreSoccer(g,0);return}
    if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*g.bounce}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.bounce}
  }
  function scoreSoccer(g,side){
    if(g.freeze>0||g.winner)return;g.scores[side]++;setScore(...g.scores);
    if(g.scores[side]>=5){g.winner=side;status(`🏆 Player ${side+1} wins Soccer!`,'Restart for a rematch.');return}
    status(`⚽ GOAL — Player ${side+1}!`,`Round ${g.round+1}: field, ball and physics changed.`);resetSoccerRound(g,false);
  }
  function drawSoccer(g){
    const t=g.theme;rect(0,0,W,H,t.sky);drawCrowd();rect(0,110,W,348,t.ground);rect(0,458,W,82,g.theme.name==='Snow'?'#eef7ff':'#2c6e3d');
    line(W/2,112,W/2,458,4,'#ffffff66');ctx.strokeStyle='#ffffff66';ctx.lineWidth=4;ctx.beginPath();ctx.arc(W/2,324,72,0,Math.PI*2);ctx.stroke();
    for(const side of [0,1]){const x=side===0?26:884;ctx.strokeStyle='#ffffffcc';ctx.lineWidth=6;ctx.strokeRect(x,278,50,180);for(let y=292;y<452;y+=18)line(x,y,x+50,y,1,'#ffffff55');for(let xx=x+8;xx<x+50;xx+=10)line(xx,278,xx,458,1,'#ffffff55')}
    for(const p of g.players)drawPixelPerson(p,p.side);
    circle(g.ball.x,g.ball.y,g.ball.r+2,'#111');circle(g.ball.x,g.ball.y,g.ball.r,'#f7f7f7');circle(g.ball.x,g.ball.y,g.ball.r*.38,'#202020');
    text(`${g.scores[0]}  -  ${g.scores[1]}`,W/2,82,34,'#fff');text(g.theme.name,W/2,112,14,g.theme.accent);
  }

  // ---------------- Kickball / Baseball ----------------
  function startDiamond(kind){
    const baseball=kind==='baseball';$('nsa4Title').textContent=`${baseball?'⚾ Baseball':'🔴 Kickball'} Field Duel`;$('nsa4P1Info').textContent='WASD + F';$('nsa4P2Info').textContent='Arrows + Enter';setScore(0,0);
    const g={kind,baseball,scores:[0,0],inning:1,half:0,outs:0,phase:'meter',offense:0,defense:1,meter:.05,meterDir:1,meterSpeed:.72,quality:null,ball:null,runner:null,fielder:null,particles:[],message:'',winner:null};engine=g;resetDiamondPlay(g,true);g.update=dt=>updateDiamond(g,dt);g.draw=()=>drawDiamond(g);
    status(`${baseball?'Baseball':'Kickball'} — Player 1 starts on offense.`, 'Offense stops the timing bar. Defense then runs to the ball, catches/picks it up, faces a direction, and throws with its action key.');
  }
  function resetDiamondPlay(g,first=false){
    g.phase='meter';g.meter=.06;g.meterDir=1;g.meterSpeed=rnd(.68,.9);g.quality=null;g.ball=null;g.runner={x:168,y:438,vx:0,vy:0,face:1,baseProgress:0};g.fielder={x:620,y:285,vx:0,vy:0,face:-1,hasBall:false,scale:1,skin:pick(SKINS)};g.particles=[];
    setMeter(true,`Player ${g.offense+1}: press ${g.offense===0?'F':'ENTER'} to stop the ${g.baseball?'swing':'kick'} meter`);
    if(!first)status(`Inning ${g.inning} — ${g.outs} out${g.outs===1?'':'s'}.`,`Player ${g.offense+1} ${g.baseball?'batting':'kicking'}. SUPER is in the middle.`);
  }
  function meterQuality(v){const d=Math.abs(v-.5);if(d<.055)return{name:'SUPER',power:1.25,color:'#ffd84b'};if(d<.18)return{name:'GOOD',power:.93,color:'#43e6aa'};if(d<.34)return{name:'WEAK',power:.62,color:'#e0a446'};return{name:'MISS',power:0,color:'#ff607f'}}
  function stopMeter(side){
    const g=engine;if(!g||(g.kind!=='kickball'&&g.kind!=='baseball')||g.phase!=='meter'||side!==g.offense)return;
    const q=meterQuality(g.meter);g.quality=q;setMeter(false);
    if(q.power===0){g.outs++;status(`${g.baseball?'Strikeout':'Missed kick'} — OUT!`,`${g.outs} out${g.outs===1?'':'s'}.`);advanceDiamond(g);return}
    launchDiamondBall(g,q);
  }
  function launchDiamondBall(g,q){
    const angle=rnd(-.78,-.22),speed=(g.baseball?590:540)*q.power;g.ball={x:202,y:405,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,z:10,vz:rnd(360,480)*q.power,held:false};g.phase='field';g.runner.x=185;g.runner.y=430;g.runner.baseProgress=0;g.fielder.x=rnd(520,760);g.fielder.y=rnd(210,350);g.fielder.hasBall=false;status(`${q.name} ${g.baseball?'HIT':'KICK'}!`,'Defense: run to the ball. Catch it in the air or pick it up, then face toward first and press your action key to throw.');
  }
  function diamondMove(side,dx,dy){
    const g=engine;if(!g||g.phase!=='field'||side!==g.defense)return;const f=g.fielder;const mag=Math.hypot(dx,dy)||1;f.vx=dx/mag*260;f.vy=dy/mag*260;if(Math.abs(dx)>.1)f.face=Math.sign(dx);
  }
  function diamondThrow(side){
    const g=engine;if(!g||g.phase!=='field'||side!==g.defense||!g.fielder.hasBall)return;
    const f=g.fielder,first={x:430,y:370};
    const toward=Math.sign(first.x-f.x)||1,aligned=f.face===toward;const dx=first.x-f.x,dy=first.y-f.y,d=Math.max(1,Math.hypot(dx,dy)),speed=aligned?760:520;
    g.ball={x:f.x,y:f.y-15,vx:dx/d*speed+(aligned?0:rnd(-120,120)),vy:dy/d*speed+(aligned?0:rnd(-90,90)),z:36,vz:60,held:false,thrown:true};f.hasBall=false;status(aligned?'Strong throw to first!':'Off-balance throw!','Facing toward first makes throws faster and more accurate.');
  }
  function updateDiamond(g,dt){
    if(g.winner)return;
    if(g.phase==='meter'){g.meter+=g.meterDir*g.meterSpeed*dt;if(g.meter>=1){g.meter=1;g.meterDir=-1}if(g.meter<=0){g.meter=0;g.meterDir=1}$('nsa4Needle').style.left=`calc(${g.meter*100}% - 2px)`;return}
    if(g.phase!=='field')return;
    const f=g.fielder,r=g.runner,b=g.ball;
    f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=Math.pow(.73,dt*60);f.vy*=Math.pow(.73,dt*60);f.x=clamp(f.x,70,900);f.y=clamp(f.y,145,440);
    const runSpeed=145+(g.quality?.power||.7)*75;r.baseProgress=clamp(r.baseProgress+runSpeed*dt/275,0,1);r.x=185+(430-185)*r.baseProgress;r.y=430+(370-430)*r.baseProgress;r.face=1;
    if(b&&!b.held){
      b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=(b.vz||0)*dt;b.vz=(b.vz||0)-780*dt;b.vx*=Math.pow(.992,dt*60);b.vy*=Math.pow(.992,dt*60);
      if(b.z<=0){b.z=0;b.vz=0;b.vx*=Math.pow(.86,dt*60);b.vy*=Math.pow(.86,dt*60)}
      const d=Math.hypot(f.x-b.x,f.y-b.y);
      if(d<34&&b.z<85){f.hasBall=true;b.held=true;b.x=f.x;b.y=f.y;b.z=28;status(b.z>18?'Caught / collected!':'Ball picked up!','Face toward first base, then press your throw key.');}
      if(b.thrown&&Math.hypot(b.x-430,b.y-370)<35){if(r.baseProgress<.985){g.outs++;status('OUT at first!','Defense beat the runner with the throw.');advanceDiamond(g)}else{scoreDiamondRun(g)}}
    }
    if(f.hasBall&&b){b.x=f.x;b.y=f.y;b.z=28}
    if(r.baseProgress>=1&&g.phase==='field')scoreDiamondRun(g);
  }
  function scoreDiamondRun(g){
    if(g.phase!=='field')return;g.scores[g.offense]++;setScore(...g.scores);status(`RUN — Player ${g.offense+1}!`,'The runner reached first safely.');advanceDiamond(g);
  }
  function advanceDiamond(g){
    g.phase='pause';setMeter(false);setTimeout(()=>{
      if(!engine||engine!==g)return;
      if(g.outs>=3){g.outs=0;g.half++;g.offense=g.half%2;g.defense=1-g.offense;if(g.half%2===0)g.inning++;}
      if(g.inning>3){g.winner=g.scores[0]===g.scores[1]?'tie':(g.scores[0]>g.scores[1]?0:1);status(g.winner==='tie'?'🤝 Tie game!':`🏆 Player ${g.winner+1} wins!`,'Restart for a rematch.');return}
      resetDiamondPlay(g,false);
    },700);
  }
  function drawDiamond(g){
    rect(0,0,W,H,'#182847');rect(0,74,W,72,'#27365a');drawCrowd();
    rect(0,146,W,394,'#2b7a47');ctx.fillStyle='#b98c59';ctx.beginPath();ctx.moveTo(170,435);ctx.lineTo(475,165);ctx.lineTo(790,435);ctx.lineTo(480,505);ctx.closePath();ctx.fill();
    line(180,435,475,165,3,'#ffffffbb');line(180,435,790,435,3,'#ffffffbb');
    line(70,160,890,160,8,'#35516d');rect(405,86,150,64,'#0d1929');text(`${g.baseball?'BASEBALL':'KICKBALL'}`,480,103,13,'#ffd95e');text(`P1 ${g.scores[0]}   P2 ${g.scores[1]}`,480,128,17,'#fff');
    const bases=[[180,435],[430,370],[505,245],[325,310]];for(const [x,y] of bases){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);rect(-10,-10,20,20,'#fff');ctx.restore()}
    rect(55,365,100,44,'#24334c');rect(805,365,100,44,'#24334c');for(let i=0;i<3;i++){drawPixelPerson({id:30+i,x:78+i*28,y:357,scale:.55,face:1},0);drawPixelPerson({id:40+i,x:827+i*28,y:357,scale:.55,face:-1},1)}
    drawPixelPerson({id:9,x:490,y:290,scale:.88,face:-1,skin:SKINS[1]},g.defense);
    drawPixelPerson({id:10,x:190,y:411,scale:1,face:1,skin:SKINS[0],swing:g.phase==='field'?1:0},g.offense);
    if(g.runner)drawPixelPerson({id:11,x:g.runner.x,y:g.runner.y-8,scale:.88,face:g.runner.face,skin:SKINS[2]},g.offense);
    if(g.fielder)drawPixelPerson({id:12,x:g.fielder.x,y:g.fielder.y,scale:.92,face:g.fielder.face,skin:g.fielder.skin},g.defense,{ballHeld:g.fielder.hasBall,ballR:7,ballColor:g.baseball?'#f7f7f7':'#d64a47'});
    if(g.ball&&!g.ball.held){const sy=g.ball.y-g.ball.z*.35;circle(g.ball.x,g.ball.y+5,Math.max(3,8-g.ball.z*.01),'#0004');circle(g.ball.x,sy,g.baseball?7:9,g.baseball?'#f7f7f7':'#d94a48');if(g.baseball){line(g.ball.x-4,sy-2,g.ball.x+4,sy+2,1.5,'#d33')}}
    text(`Inning ${Math.min(g.inning,3)}  •  ${g.outs} Out${g.outs===1?'':'s'}`,480,517,16,'#fff');
  }

  function actionForSide(side){
    if(!engine)return;
    if(engine.kind==='basketball')basketAction(side);
    else if(engine.kind==='soccer')soccerAction(side);
    else if(engine.kind==='kickball'||engine.kind==='baseball'){
      if(engine.phase==='meter')stopMeter(side);else diamondThrow(side);
    }
  }

  window.addEventListener('keydown',e=>{
    if(!overlay.classList.contains('show')||!$('nsa4Arena').classList.contains('show'))return;
    const k=e.key.toLowerCase();
    if(['w','a','s','d','f','arrowup','arrowdown','arrowleft','arrowright','enter','escape'].includes(k))e.preventDefault();
    if(e.repeat)return;keys.add(k);
    if(k==='escape'){close();return}
    if(mode==='basketball'||mode==='soccer'){
      if(k==='w')actionForSide(0);else if(k==='arrowup')actionForSide(1);return;
    }
    if(mode==='kickball'||mode==='baseball'){
      if(k==='f')actionForSide(0);else if(k==='enter')actionForSide(1);
      if(engine?.phase==='field'){
        if(engine.defense===0){let dx=0,dy=0;if(k==='a')dx=-1;if(k==='d')dx=1;if(k==='w')dy=-1;if(k==='s')dy=1;if(dx||dy)diamondMove(0,dx,dy)}
        else {let dx=0,dy=0;if(k==='arrowleft')dx=-1;if(k==='arrowright')dx=1;if(k==='arrowup')dy=-1;if(k==='arrowdown')dy=1;if(dx||dy)diamondMove(1,dx,dy)}
      }
    }
  },true);
  window.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase())},true);

  $('nsa4Menu').addEventListener('click',e=>{const b=e.target.closest('[data-game]');if(b)start(b.dataset.game)});
  $('nsa4Close').onclick=close;$('nsa4Back').onclick=showMenu;$('nsa4Restart').onclick=()=>mode&&start(mode);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});

  function addButton(){
    if(document.getElementById('localSportsBtn'))return;const bar=document.querySelector('.featurebar');if(!bar)return;
    const btn=document.createElement('button');btn.id='localSportsBtn';btn.className='btn';btn.textContent='🎮 2-Player Games';btn.onclick=open;
    const mini=document.getElementById('minigamesBtn');if(mini&&mini.parentNode===bar)mini.after(btn);else bar.appendChild(btn);
  }
  addButton();new MutationObserver(addButton).observe(document.body,{childList:true,subtree:true});
})();
