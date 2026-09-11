(() => {
  if (window.__needohSportsArcadeV5) return;
  window.__needohSportsArcadeV5 = true;

  document.getElementById('nsa4Overlay')?.remove();
  document.getElementById('localSportsBtn')?.remove();
  document.getElementById('needohSportsArcadeV4Styles')?.remove();

  const style = document.createElement('style');
  style.id = 'needohSportsArcadeV5Styles';
  style.textContent = `
    #nsa5Overlay{position:fixed;inset:0;z-index:510;background:rgba(3,6,16,.94);display:none;align-items:center;justify-content:center;padding:12px}
    #nsa5Overlay.show{display:flex}#nsa5Card{width:min(1160px,100%);max-height:96vh;overflow:auto;background:linear-gradient(145deg,#101832,#301841);border:1px solid #ffffff26;border-radius:24px;padding:15px;color:#fff;box-shadow:0 30px 100px #000b}
    .nsa5-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.nsa5-head h2{margin:0;font-size:22px}.nsa5-close{border:0;width:40px;height:40px;border-radius:50%;background:#ffffff18;color:#fff;font-size:22px;cursor:pointer}
    #nsa5Menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}.nsa5-game{border:1px solid #ffffff20;background:#ffffff12;color:#fff;border-radius:18px;padding:18px;text-align:left;cursor:pointer}.nsa5-game:hover{background:#ffffff1e;transform:translateY(-1px)}.nsa5-game b{display:block;font-size:21px;margin-bottom:6px}.nsa5-game span{font-size:13px;color:#d8d5e6;line-height:1.42}.nsa5-random{grid-column:1/-1;text-align:center;background:linear-gradient(135deg,#7058ff,#f54f9d)}
    #nsa5Arena{display:none}#nsa5Arena.show{display:block}.nsa5-top{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin:10px 0}.nsa5-score{padding:9px 12px;border-radius:14px;background:#ffffff12;text-align:center;font-weight:900}.nsa5-score b{display:block;font-size:30px}.nsa5-title{min-width:260px;text-align:center;font-size:19px;font-weight:1000;color:#ffd95e}
    #nsa5CanvasWrap{position:relative;width:100%;aspect-ratio:960/540;border-radius:18px;overflow:hidden;border:1px solid #ffffff20;background:#0a1020}#nsa5Canvas{display:block;width:100%;height:100%;image-rendering:pixelated;touch-action:none}
    #nsa5MeterPanel{display:none;position:absolute;left:50%;bottom:12px;transform:translateX(-50%);width:min(660px,92%);padding:10px 12px;border-radius:15px;background:#070b16ef;border:1px solid #ffffff25}#nsa5MeterPanel.show{display:block}.nsa5-meter-label{text-align:center;font-weight:900;font-size:13px;margin-bottom:6px}.nsa5-meter{height:31px;position:relative;display:grid;grid-template-columns:12fr 14fr 19fr 10fr 19fr 14fr 12fr;border-radius:9px;overflow:hidden;border:1px solid #ffffff30}.nsa5-meter span{display:grid;place-items:center;font-size:10px;font-weight:1000;text-shadow:0 2px 3px #000}.nsa5-meter .miss{background:#67263b}.nsa5-meter .weak{background:#916427}.nsa5-meter .good{background:#27795e}.nsa5-meter .super{background:linear-gradient(90deg,#ffd341,#ff5c75,#ad5cff)}#nsa5Needle{position:absolute;top:-3px;bottom:-3px;width:4px;background:#fff;box-shadow:0 0 12px #fff;left:0;border-radius:4px}
    .nsa5-help{margin-top:9px;padding:10px 12px;background:#ffffff10;border-radius:14px}.nsa5-status{font-size:14px;font-weight:1000}.nsa5-sub{font-size:12px;color:#cbc8da;margin-top:3px}.nsa5-buttons{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:10px}.nsa5-small{border:0;border-radius:12px;padding:9px 13px;background:#ffffff18;color:#fff;font-weight:900;cursor:pointer}.nsa5-small.primary{background:linear-gradient(135deg,#20c7aa,#5d68ff)}
    @media(max-width:680px){#nsa5Menu,.nsa5-top{grid-template-columns:1fr}.nsa5-random{grid-column:auto}.nsa5-title{order:-1}.nsa5-score b{font-size:22px}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'nsa5Overlay';
  overlay.innerHTML = `
    <div id="nsa5Card">
      <div class="nsa5-head"><h2>🎮 2-Player Sports Arcade</h2><button id="nsa5Close" class="nsa5-close">×</button></div>
      <div id="nsa5Menu">
        <button class="nsa5-game" data-game="basketball"><b>🏀 Basket Chaos</b><span>W vs ↑. Two matching pixel players per team, one-button forward jumping, possession, steals, blocks, shots and dunks. First to 5.</span></button>
        <button class="nsa5-game" data-game="soccer"><b>⚽ Soccer Chaos</b><span>W vs ↑. Same people and same jump physics as basketball. Jump toward the way you face and kick on contact. First to 5.</span></button>
        <button class="nsa5-game" data-game="kickball"><b>🔴 Kickball Field Duel</b><span>Same player art, full diamond, timing bar, running, catches, pickups and throws. P1: WASD + F. P2: arrows + Enter.</span></button>
        <button class="nsa5-game" data-game="baseball"><b>⚾ Baseball Field Duel</b><span>Same player art, ballpark, pitcher, batter, runner, fielders, timing bar, catches and throws. P1: WASD + F. P2: arrows + Enter.</span></button>
        <button class="nsa5-game nsa5-random" data-game="random"><b>🎲 Random Sport</b><span>Choose one of the four games at random.</span></button>
      </div>
      <div id="nsa5Arena">
        <div class="nsa5-top">
          <div class="nsa5-score">PLAYER 1<b id="nsa5P1Score">0</b><span id="nsa5P1Info"></span></div>
          <div id="nsa5Title" class="nsa5-title"></div>
          <div class="nsa5-score">PLAYER 2<b id="nsa5P2Score">0</b><span id="nsa5P2Info"></span></div>
        </div>
        <div id="nsa5CanvasWrap">
          <canvas id="nsa5Canvas" width="960" height="540"></canvas>
          <div id="nsa5MeterPanel"><div id="nsa5MeterLabel" class="nsa5-meter-label"></div><div class="nsa5-meter"><span class="miss">MISS</span><span class="weak">WEAK</span><span class="good">GOOD</span><span class="super">SUPER</span><span class="good">GOOD</span><span class="weak">WEAK</span><span class="miss">MISS</span><i id="nsa5Needle"></i></div></div>
        </div>
        <div class="nsa5-help"><div id="nsa5Status" class="nsa5-status"></div><div id="nsa5Sub" class="nsa5-sub"></div></div>
        <div class="nsa5-buttons"><button id="nsa5Restart" class="nsa5-small primary">↻ Restart Match</button><button id="nsa5Back" class="nsa5-small">← Choose Sport</button></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = id => document.getElementById(id);
  const canvas = $('nsa5Canvas'), ctx = canvas.getContext('2d');
  const W=960,H=540, keys=new Set();
  let engine=null, mode=null, raf=0, last=0;

  const TEAM=[
    {jersey:'#25b7ff',trim:'#1647b7',shorts:'#173677'},
    {jersey:'#ff5d8f',trim:'#8d34c8',shorts:'#632184'}
  ];
  const SKINS=['#f0c39b','#d89c70','#9d6849','#6f472f'];
  const THEMES=[
    {name:'Backyard',sky:'#577fbe',ground:'#44784a',accent:'#d8f5ff'},
    {name:'Beach',sky:'#57a5ca',ground:'#d8b36b',accent:'#ffe28a'},
    {name:'Snow',sky:'#99b9d2',ground:'#ecf4fa',accent:'#88d9ff'},
    {name:'Night',sky:'#172044',ground:'#30465b',accent:'#5fe0ff'},
    {name:'Neon',sky:'#28143f',ground:'#21443f',accent:'#ff66d6'}
  ];

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
  function circle(x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
  function line(x1,y1,x2,y2,w,c){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
  function text(t,x,y,s=20,c='#fff',align='center',weight=900){ctx.fillStyle=c;ctx.font=`${weight} ${s}px system-ui,-apple-system,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(t,x,y)}
  function setScore(a,b){$('nsa5P1Score').textContent=a;$('nsa5P2Score').textContent=b}
  function status(a,b=''){$('nsa5Status').textContent=a;$('nsa5Sub').textContent=b}
  function setMeter(show,label=''){$('nsa5MeterPanel').classList.toggle('show',!!show);if(label)$('nsa5MeterLabel').textContent=label}

  function makePlayer(team,x,y,id=0){
    return {team,id,x,y,vx:0,vy:0,face:team===0?1:-1,scale:1,arm:1,skin:SKINS[(id+team)%SKINS.length],grounded:true,swing:0,holding:false,stun:0};
  }
  function drawPlayer(p,opts={}){
    const pal=TEAM[p.team], s=p.scale||1, skin=p.skin, face=p.face||1;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(clamp(p.vx/480,-.28,.28)*.18);
    ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(0,34*s,20*s,5*s,0,0,Math.PI*2);ctx.fill();
    rect(-12*s,-45*s,24*s,21*s,skin);rect(-10*s,-42*s,20*s,4*s,'#51362b');
    rect(-16*s,-24*s,32*s,37*s,pal.jersey);rect(-16*s,-4*s,32*s,5*s,pal.trim);
    rect(-13*s,13*s,10*s,24*s,pal.shorts);rect(3*s,13*s,10*s,24*s,pal.shorts);
    rect(-15*s,35*s,13*s,7*s,'#f4f4f4');rect(2*s,35*s,13*s,7*s,'#f4f4f4');
    const arm=(p.arm||1)*s, reach=(29+15*(p.swing||0))*arm;
    line(-13*s,-16*s,-22*s*face,-2*s,8*s,skin);
    line(13*s,-16*s,reach*face,-10*s,8*s,skin);
    if(opts.ballHeld) circle(reach*face,-12*s,opts.ballR||12,opts.ballColor||'#f58c2c');
    rect(-6*s,-14*s,12*s,12*s,'#ffffff20');
    ctx.restore();
  }
  function drawCrowd(){for(let x=18;x<W;x+=30){const y=48+((x*7)%12);rect(x,y,16,20,'#ffffff18');circle(x+8,y-4,6,SKINS[(x/30|0)%SKINS.length])}}
  function sharedJump(p,forward=265,up=510){
    if(p.stun>0)return;
    if(p.grounded || p.y>395){p.vy=-up;p.vx=p.face*forward;p.grounded=false}
    else p.vx+=p.face*forward*.18;
    p.swing=1;setTimeout(()=>{p.swing=0},120);
  }
  function autoFace(p,ball){
    if(Math.abs(p.vx)>45)p.face=Math.sign(p.vx);
    else if(ball&&Math.abs(ball.x-p.x)>22)p.face=Math.sign(ball.x-p.x);
  }
  function integratePlayer(p,dt,gravity,floor,left=30,right=W-30,slip=.90){
    p.stun=Math.max(0,p.stun-dt);p.vy+=gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(slip,dt*60);
    if(p.y>floor){p.y=floor;p.vy=0;p.grounded=true}else p.grounded=false;
    if(p.x<left){p.x=left;p.vx=Math.abs(p.vx)*.45;p.face=1}if(p.x>right){p.x=right;p.vx=-Math.abs(p.vx)*.45;p.face=-1}
  }

  function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function startLoop(){stopLoop();last=performance.now();raf=requestAnimationFrame(loop)}
  function loop(now){if(!engine||!overlay.classList.contains('show')){raf=0;return}const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;try{engine.update?.(dt);engine.draw?.()}catch(e){console.error('sports arcade v5',e);status('Game paused after an error.','Choose Sport and restart.');stopLoop();return}raf=requestAnimationFrame(loop)}
  function open(){overlay.classList.add('show');showMenu()}
  function close(){overlay.classList.remove('show');stopLoop();engine=null;mode=null;keys.clear()}
  function showMenu(){stopLoop();engine=null;mode=null;keys.clear();$('nsa5Menu').style.display='grid';$('nsa5Arena').classList.remove('show');setMeter(false)}
  function start(name){if(name==='random')name=pick(['basketball','soccer','kickball','baseball']);mode=name;$('nsa5Menu').style.display='none';$('nsa5Arena').classList.add('show');if(name==='basketball')startBasket();else if(name==='soccer')startSoccer();else startDiamond(name);startLoop()}

  function startBasket(){
    $('nsa5Title').textContent='🏀 Basket Chaos — First to 5';$('nsa5P1Info').textContent='W';$('nsa5P2Info').textContent='↑';setMeter(false);setScore(0,0);
    const g={kind:'basketball',scores:[0,0],players:[],ball:null,theme:pick(THEMES),gravity:1180,bounce:.74,freeze:0,winner:null,round:0,lastHolder:null};engine=g;resetBasket(g,true);
    g.update=dt=>updateBasket(g,dt);g.draw=()=>drawBasket(g);status('W vs ↑ — first to 5.','Touch the loose ball to grab it. Press your button to jump in the direction you face and shoot.');
  }
  function resetBasket(g,first=false){
    g.theme=pick(THEMES);g.gravity=rnd(980,1340);g.bounce=rnd(.64,.82);g.round++;g.freeze=first?0:.55;
    const floor=458;
    g.players=[makePlayer(0,240,floor,0),makePlayer(0,330,floor,1),makePlayer(1,630,floor,0),makePlayer(1,720,floor,1)];
    const scale=rnd(.90,1.13),arm=rnd(.82,1.3);for(const p of g.players){p.scale=scale*(p.id?rnd(.94,1.06):1);p.arm=arm*(p.id?rnd(.92,1.08):1)}
    g.ball={x:480,y:215,vx:rnd(-55,55),vy:0,r:rnd(11,16),holder:null,cool:0,lastTeam:null};
  }
  function basketAction(team){
    const g=engine;if(!g||g.kind!=='basketball'||g.winner||g.freeze>0)return;
    const ps=g.players.filter(p=>p.team===team), b=g.ball;
    const holder=b.holder!=null?g.players[b.holder]:null;
    for(const p of ps)sharedJump(p,280,530);
    if(holder&&holder.team===team){
      const targetX=team===0?858:102,targetY=176;
      const dx=targetX-b.x,dy=targetY-b.y,d=Math.max(1,Math.hypot(dx,dy));
      const near=Math.abs(b.x-targetX)<125;
      b.holder=null;holder.holding=false;b.cool=.24;b.lastTeam=team;
      if(near){b.vx=(team===0?1:-1)*rnd(250,340);b.vy=-rnd(180,260)}
      else {const speed=rnd(610,710);b.vx=dx/d*speed;b.vy=dy/d*speed-rnd(160,220)}
    }
  }
  function updateBasket(g,dt){
    if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;
    const floor=458,b=g.ball;b.cool=Math.max(0,b.cool-dt);
    for(const p of g.players){autoFace(p,b);integratePlayer(p,dt,g.gravity,floor,38,W-38,.91)}
    for(let i=0;i<g.players.length;i++)for(let j=i+1;j<g.players.length;j++){
      const a=g.players[i],c=g.players[j],d=dist(a,c),rr=38*(a.scale+c.scale)/2;
      if(d<rr){const nx=(c.x-a.x)/(d||1),push=(rr-d)*.5;a.x-=nx*push;c.x+=nx*push;const rel=Math.abs(a.vx-c.vx)+Math.abs(a.vy-c.vy);a.vx-=nx*55;c.vx+=nx*55;if(b.holder!=null&&rel>250&&Math.random()<.28){const h=g.players[b.holder];b.x=h.x+h.face*30;b.y=h.y-28;b.vx=h.face*rnd(150,230);b.vy=-rnd(120,220);h.holding=false;b.holder=null;b.cool=.3}}
    }
    if(b.holder!=null){
      const h=g.players[b.holder];b.x=h.x+h.face*(32*h.arm);b.y=h.y-30;b.vx=h.vx;b.vy=h.vy;h.holding=true;
    } else {
      b.vy+=g.gravity*.72*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.992,dt*60);
      if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*g.bounce}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.bounce}if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*g.bounce}if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}
      if(b.cool<=0){let best=-1,bd=1e9;for(let i=0;i<g.players.length;i++){const p=g.players[i],d=dist(p,b);if(d<45*p.scale+b.r&&d<bd){best=i;bd=d}}if(best>=0){b.holder=best;g.players[best].holding=true;b.lastTeam=g.players[best].team}}
    }
    if(b.holder==null){
      if(b.x>820&&b.x<895&&b.y>150&&b.y<215&&b.lastTeam===0&&b.vy>-80)scoreBasket(g,0);
      else if(b.x>65&&b.x<140&&b.y>150&&b.y<215&&b.lastTeam===1&&b.vy>-80)scoreBasket(g,1);
    }
  }
  function scoreBasket(g,team){
    if(g.freeze>0||g.winner)return;g.scores[team]++;setScore(...g.scores);if(g.scores[team]>=5){g.winner=team;status(`🏆 Player ${team+1} wins!`,'Restart for a rematch.');return}status(`Player ${team+1} scores!`,`${g.scores[0]} - ${g.scores[1]} • new random round`);resetBasket(g,false)
  }
  function drawHoop(x,side){const s=side===0?1:-1;line(x,105,x,220,10,'#d7dbe5');rect(x+(side===0?-3:-69),145,72,52,'#edf2f7');line(x+s*8,188,x+s*60,188,7,'#ff8744');line(x+s*20,190,x+s*25,225,2,'#ffffffaa');line(x+s*48,190,x+s*43,225,2,'#ffffffaa')}
  function drawBasket(g){
    rect(0,0,W,H,g.theme.sky);drawCrowd();rect(0,88,W,370,g.theme.ground);rect(0,458,W,82,'#b9783f');for(let x=0;x<W;x+=80)rect(x,458,2,82,'#ffffff22');line(480,458,480,520,3,'#ffffff55');drawHoop(78,0);drawHoop(882,1);
    for(let i=0;i<g.players.length;i++){const p=g.players[i];drawPlayer(p,{ballHeld:g.ball.holder===i,ballR:g.ball.r,ballColor:'#f58a2a'})}
    if(g.ball.holder==null){circle(g.ball.x,g.ball.y,g.ball.r,'#f58a2a');line(g.ball.x-g.ball.r,g.ball.y,g.ball.x+g.ball.r,g.ball.y,2,'#6c3517')}
    text(g.theme.name,480,24,17,'#fff');
  }

  function startSoccer(){
    $('nsa5Title').textContent='⚽ Soccer Chaos — First to 5';$('nsa5P1Info').textContent='W';$('nsa5P2Info').textContent='↑';setMeter(false);setScore(0,0);
    const g={kind:'soccer',scores:[0,0],players:[],ball:null,theme:pick(THEMES),gravity:1150,bounce:.72,slip:.94,freeze:0,winner:null,round:0};engine=g;resetSoccer(g,true);
    g.update=dt=>updateSoccer(g,dt);g.draw=()=>drawSoccer(g);status('W vs ↑ — first to 5.','Same people and same jump as basketball. Every press launches both teammates toward the way they face.');
  }
  function resetSoccer(g,first=false){
    g.theme=pick(THEMES);g.gravity=rnd(980,1300);g.bounce=rnd(.68,.88);g.slip=g.theme.name==='Snow'?rnd(.973,.988):rnd(.92,.96);g.freeze=first?0:.5;g.round++;
    const floor=460;
    g.players=[makePlayer(0,230,floor,0),makePlayer(0,330,floor,1),makePlayer(1,630,floor,0),makePlayer(1,730,floor,1)];
    const scale=rnd(.9,1.12);for(const p of g.players){p.scale=scale*(p.id?rnd(.95,1.05):1);p.arm=rnd(.9,1.15)}
    g.ball={x:480,y:250,vx:rnd(-40,40),vy:0,r:rnd(15,22),lastTeam:null};
  }
  function soccerAction(team){const g=engine;if(!g||g.kind!=='soccer'||g.winner||g.freeze>0)return;for(const p of g.players.filter(p=>p.team===team))sharedJump(p,300,515)}
  function updateSoccer(g,dt){
    if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;const floor=460,b=g.ball;
    for(const p of g.players){autoFace(p,b);integratePlayer(p,dt,g.gravity,floor,42,W-42,g.slip)}
    b.vy+=g.gravity*.72*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.994,dt*60);
    if(b.y<90+b.r){b.y=90+b.r;b.vy=Math.abs(b.vy)*g.bounce}if(b.y>floor-b.r){b.y=floor-b.r;b.vy=-Math.abs(b.vy)*g.bounce}
    for(const p of g.players){const d=dist(p,b),rr=32*p.scale+b.r;if(d<rr){const nx=(b.x-p.x)/(d||1),ny=(b.y-p.y)/(d||1);b.x+=nx*(rr-d+2);b.y+=ny*(rr-d+2);const airborne=!p.grounded,boost=airborne?1.18:1;b.vx+=p.face*rnd(350,470)*boost+p.vx*.45;b.vy+=-rnd(90,220)*boost+p.vy*.18;b.lastTeam=p.team}}
    const goalTop=285,goalBottom=472;
    if(b.x<0){if(b.y>goalTop&&b.y<goalBottom)scoreSoccer(g,1);else{b.x=b.r;b.vx=Math.abs(b.vx)*g.bounce}}
    if(b.x>W){if(b.y>goalTop&&b.y<goalBottom)scoreSoccer(g,0);else{b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.bounce}}
  }
  function scoreSoccer(g,team){if(g.freeze>0||g.winner)return;g.scores[team]++;setScore(...g.scores);if(g.scores[team]>=5){g.winner=team;status(`🏆 Player ${team+1} wins!`,'Restart for a rematch.');return}status(`⚽ Player ${team+1} GOAL!`,`${g.scores[0]} - ${g.scores[1]} • new random field`);resetSoccer(g,false)}
  function drawGoal(left){const x=left?0:W-92;rect(x,280,92,192,'#ffffff10');line(left?88:W-88,280,left?88:W-88,472,7,'#fff');line(left?0:W,280,left?88:W-88,280,7,'#fff');for(let y=300;y<470;y+=24)line(left?0:W,y,left?88:W-88,y,1,'#ffffff66')}
  function drawSoccer(g){rect(0,0,W,H,g.theme.sky);drawCrowd();rect(0,88,W,372,g.theme.ground);for(let x=0;x<W;x+=120)rect(x,88,60,372,'#ffffff09');line(480,90,480,460,4,'#fff8');ctx.strokeStyle='#fff8';ctx.lineWidth=4;ctx.beginPath();ctx.arc(480,275,72,0,Math.PI*2);ctx.stroke();drawGoal(true);drawGoal(false);for(const p of g.players)drawPlayer(p);circle(g.ball.x,g.ball.y,g.ball.r,'#f7f7f7');circle(g.ball.x,g.ball.y,Math.max(4,g.ball.r*.28),'#242424');text(g.theme.name,480,24,17,'#fff')}

  function startDiamond(kind){
    const isBase=kind==='baseball';$('nsa5Title').textContent=isBase?'⚾ Baseball Field Duel':'🔴 Kickball Field Duel';$('nsa5P1Info').textContent='WASD + F';$('nsa5P2Info').textContent='Arrows + Enter';setScore(0,0);
    const g={kind,scores:[0,0],inning:1,half:0,outs:0,offense:0,phase:'meter',meter:0,meterDir:1,theme:pick(THEMES),ball:null,batter:null,runner:null,fielder:null,pitcher:null,carry:false,throwing:false,message:'',winner:null};engine=g;resetDiamondPlay(g,true);
    g.update=dt=>updateDiamond(g,dt);g.draw=()=>drawDiamond(g);status(`${isBase?'Baseball':'Kickball'} — timing bar ready.`,diamondHelp(g));
  }
  function diamondHelp(g){return g.offense===0?'P1 bats/kicks with F. P2 fields with arrows + Enter.':'P2 bats/kicks with Enter. P1 fields with WASD + F.'}
  function resetDiamondPlay(g,first=false){
    const offense=g.offense,def=1-offense;g.phase='meter';g.meter=first?.12:Math.random()*.25;g.meterDir=1;g.carry=false;g.throwing=false;g.message='';
    g.batter=makePlayer(offense,155,430,0);g.batter.face=1;g.pitcher=makePlayer(def,370,340,1);g.pitcher.face=-1;g.fielder=makePlayer(def,650,280,0);g.fielder.face=-1;g.runner=null;
    g.ball={x:g.kind==='baseball'?350:225,y:g.kind==='baseball'?335:420,vx:0,vy:0,z:0,vz:0,r:g.kind==='baseball'?8:13,owner:null};
    setMeter(true,`${offense===0?'Player 1':'Player 2'}: stop the bar in SUPER`);status(`${g.kind==='baseball'?'Batter':'Kicker'} ready.`,diamondHelp(g));
  }
  function meterQuality(m){const d=Math.abs(m-.5);if(d<.055)return {name:'SUPER',power:1};if(d<.17)return {name:'GOOD',power:.78};if(d<.32)return {name:'WEAK',power:.52};return {name:'MISS',power:0}}
  function offenseAction(team){const g=engine;if(!g||!['baseball','kickball'].includes(g.kind)||g.offense!==team||g.phase!=='meter')return;const q=meterQuality(g.meter);if(q.power<=0){g.outs++;g.message='MISS — OUT!';setMeter(false);status(g.message,diamondHelp(g));return setTimeout(()=>advanceDiamond(g),650)}const b=g.ball,speed=(g.kind==='baseball'?620:560)*q.power+rnd(30,90);b.x=g.batter.x+35;b.y=g.batter.y-25;b.vx=speed;b.vy=-rnd(170,260)*q.power;b.z=10;b.vz=rnd(190,300)*q.power;g.phase='field';g.runner=makePlayer(team,160,440,1);g.runner.face=1;g.message=`${q.name}! Ball in play`;setMeter(false);status(g.message,'Defender: run to the ball, catch/pick it up, then throw toward first.')}
  function defenderInput(g,dt){const def=1-g.offense,p=g.fielder,s=235;if(def===0){if(keys.has('a')){p.vx=-s;p.face=-1}if(keys.has('d')){p.vx=s;p.face=1}if(keys.has('w'))p.vy=-s;if(keys.has('s'))p.vy=s}else{if(keys.has('arrowleft')){p.vx=-s;p.face=-1}if(keys.has('arrowright')){p.vx=s;p.face=1}if(keys.has('arrowup'))p.vy=-s;if(keys.has('arrowdown'))p.vy=s}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.72;p.vy*=.72;p.x=clamp(p.x,120,900);p.y=clamp(p.y,130,455)}
  function defenderAction(team){const g=engine;if(!g||!['baseball','kickball'].includes(g.kind)||team===g.offense||g.phase!=='field'||!g.carry)return;g.carry=false;g.throwing=true;const target={x:455,y:380};const dx=target.x-g.fielder.x,dy=target.y-g.fielder.y,d=Math.max(1,Math.hypot(dx,dy));g.ball.owner=null;g.ball.x=g.fielder.x+g.fielder.face*28;g.ball.y=g.fielder.y-25;g.ball.vx=dx/d*690;g.ball.vy=dy/d*690;g.ball.z=35;g.ball.vz=120;g.message='Throw to first!'}
  function updateDiamond(g,dt){
    if(g.winner)return;if(g.phase==='meter'){g.meter+=g.meterDir*dt*.86;if(g.meter>=1){g.meter=1;g.meterDir=-1}if(g.meter<=0){g.meter=0;g.meterDir=1}$('nsa5Needle').style.left=`calc(${g.meter*100}% - 2px)`;return}
    if(g.phase!=='field')return;defenderInput(g,dt);const b=g.ball,r=g.runner;
    if(r){r.vx=180;r.face=1;r.x+=r.vx*dt;r.y-=70*dt;r.y=clamp(r.y,360,440)}
    if(!g.carry){b.vz-=420*dt;b.z=Math.max(0,b.z+b.vz*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.992,dt*60);b.vy*=Math.pow(.992,dt*60);if(b.z<=0){b.vz=Math.abs(b.vz)*.28;b.vx*=.78;b.vy*=.78}const d=Math.hypot(g.fielder.x-b.x,g.fielder.y-b.y);if(d<34+b.r&&b.z<45){g.carry=true;b.owner=1-g.offense;g.message='Ball secured — throw!'}}else{b.x=g.fielder.x+g.fielder.face*28;b.y=g.fielder.y-26;b.z=24}
    const first={x:455,y:380};if(g.throwing&&!g.carry&&Math.hypot(b.x-first.x,b.y-first.y)<34){g.phase='done';const out=r&&r.x<445;g.message=out?'OUT at first!':'SAFE!';if(out)g.outs++;else g.scores[g.offense]++;setScore(...g.scores);status(g.message,diamondHelp(g));return setTimeout(()=>advanceDiamond(g),700)}
    if(r&&r.x>470&&g.phase==='field'){g.phase='done';g.scores[g.offense]++;setScore(...g.scores);g.message='SAFE — run scores!';status(g.message,diamondHelp(g));return setTimeout(()=>advanceDiamond(g),700)}
  }
  function advanceDiamond(g){if(g.outs>=3){g.outs=0;g.offense=1-g.offense;g.half++;if(g.half%2===0)g.inning++;if(g.inning>3){g.winner=g.scores[0]===g.scores[1]?-1:(g.scores[0]>g.scores[1]?0:1);status(g.winner<0?'🤝 Tie game!':`🏆 Player ${g.winner+1} wins!`,'Restart for a rematch.');return}}resetDiamondPlay(g,false)}
  function drawDiamondField(){rect(0,0,W,H,'#75a8d6');rect(0,85,W,455,'#4f8d4b');ctx.fillStyle='#c99d62';ctx.beginPath();ctx.moveTo(160,440);ctx.lineTo(455,380);ctx.lineTo(620,245);ctx.lineTo(455,140);ctx.closePath();ctx.fill();line(160,440,455,380,4,'#fff');line(160,440,455,140,4,'#fff');for(const b of [[160,440],[455,380],[620,245],[455,140]]){ctx.save();ctx.translate(b[0],b[1]);ctx.rotate(Math.PI/4);rect(-10,-10,20,20,'#fff');ctx.restore()}rect(0,70,W,15,'#355d34');for(let x=0;x<W;x+=35)circle(x,62,8,SKINS[(x/35|0)%SKINS.length])}
  function drawDiamond(g){drawDiamondField();text(`${g.kind==='baseball'?'BASEBALL':'KICKBALL'} • INNING ${Math.min(g.inning,3)} • OUTS ${g.outs}`,480,25,18,'#fff');drawPlayer(g.pitcher);drawPlayer(g.batter);drawPlayer(g.fielder,{ballHeld:g.carry,ballR:g.ball.r,ballColor:g.kind==='baseball'?'#fff':'#e34848'});if(g.runner)drawPlayer(g.runner);if(!g.carry){const shadow=Math.max(4,g.ball.r*(1-g.ball.z/240));ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(g.ball.x,g.ball.y+6,shadow,shadow*.38,0,0,Math.PI*2);ctx.fill();circle(g.ball.x,g.ball.y-g.ball.z*.28,g.ball.r,g.kind==='baseball'?'#fff':'#e34848')}if(g.message)text(g.message,480,510,18,'#fff')}

  window.addEventListener('keydown',e=>{
    if(!overlay.classList.contains('show')||!engine)return;const k=e.key.toLowerCase();keys.add(k);
    if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','enter','f'].includes(k))e.preventDefault();
    if(e.repeat)return;
    if(engine.kind==='basketball'){if(k==='w')basketAction(0);if(k==='arrowup')basketAction(1)}
    else if(engine.kind==='soccer'){if(k==='w')soccerAction(0);if(k==='arrowup')soccerAction(1)}
    else if(engine.kind==='kickball'||engine.kind==='baseball'){
      if(k==='f'){if(engine.offense===0)offenseAction(0);else defenderAction(0)}
      if(k==='enter'){if(engine.offense===1)offenseAction(1);else defenderAction(1)}
    }
    if(k==='escape')close();
  });
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));

  $('nsa5Menu').addEventListener('click',e=>{const c=e.target.closest('[data-game]');if(c)start(c.dataset.game)});
  $('nsa5Close').onclick=close;$('nsa5Back').onclick=showMenu;$('nsa5Restart').onclick=()=>mode&&start(mode);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  function addButton(){if(document.getElementById('localSportsBtn'))return;const bar=document.querySelector('.featurebar');if(!bar)return;const b=document.createElement('button');b.id='localSportsBtn';b.className='btn';b.textContent='🎮 2-Player Games';b.onclick=open;const mini=document.getElementById('minigamesBtn');if(mini&&mini.parentNode===bar)mini.after(b);else bar.appendChild(b)}
  addButton();new MutationObserver(addButton).observe(document.body,{childList:true,subtree:true});
})();