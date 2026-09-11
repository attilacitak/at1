(() => {
  if (window.__needohSportsRandomFaithfulV6) return;
  window.__needohSportsRandomFaithfulV6 = true;

  const oldOverlay = document.getElementById('nsa5Overlay');
  const oldMenu = document.getElementById('nsa5Menu');
  const oldArena = document.getElementById('nsa5Arena');

  const basketCard = oldMenu?.querySelector('[data-game="basketball"]');
  const soccerCard = oldMenu?.querySelector('[data-game="soccer"]');
  if (basketCard) basketCard.innerHTML = '<b>🏀 Basket Chaos — Random Physics</b><span>W vs ↑. Two players per team, one-button ragdoll jumping, real possession, steals, blocks, shots and dunks. First to 5. Everything changes after a basket.</span>';
  if (soccerCard) soccerCard.innerHTML = '<b>⚽ Soccer Chaos — Random Physics</b><span>W vs ↑. Two players per team, the same ragdoll jump system, hard contact kicks, big goals, and random fields/balls after every goal. First to 5.</span>';

  const style = document.createElement('style');
  style.id = 'needohSportsRandomFaithfulV6Styles';
  style.textContent = `
    #nsr6Overlay{position:fixed;inset:0;z-index:540;background:rgba(4,7,17,.95);display:none;align-items:center;justify-content:center;padding:12px}
    #nsr6Overlay.show{display:flex}
    #nsr6Card{width:min(1180px,100%);max-height:96vh;overflow:auto;background:linear-gradient(145deg,#101833,#2e183f);border:1px solid #ffffff25;border-radius:24px;padding:14px;color:white;box-shadow:0 32px 110px #000c}
    .nsr6-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.nsr6-head h2{margin:0;font-size:22px}.nsr6-close{width:40px;height:40px;border:0;border-radius:50%;background:#ffffff18;color:#fff;font-size:22px;cursor:pointer}
    .nsr6-scorebar{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin:10px 0}.nsr6-score{background:#ffffff12;border-radius:14px;padding:9px 12px;text-align:center;font-weight:900}.nsr6-score b{display:block;font-size:32px}.nsr6-title{font-size:19px;font-weight:1000;color:#ffd95e;min-width:280px;text-align:center}
    #nsr6CanvasWrap{position:relative;width:100%;aspect-ratio:960/540;border-radius:18px;overflow:hidden;border:1px solid #ffffff20;background:#0b1020}#nsr6Canvas{display:block;width:100%;height:100%;image-rendering:pixelated;touch-action:none}
    .nsr6-help{margin-top:9px;padding:10px 12px;border-radius:14px;background:#ffffff10}.nsr6-status{font-weight:1000;font-size:14px}.nsr6-sub{font-size:12px;color:#d0cddd;margin-top:3px}.nsr6-buttons{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:10px}.nsr6-btn{border:0;border-radius:12px;padding:9px 13px;background:#ffffff18;color:white;font-weight:900;cursor:pointer}.nsr6-btn.primary{background:linear-gradient(135deg,#1fc5a7,#5e68ff)}
    #nsr6RoundTag{position:absolute;left:12px;top:12px;padding:7px 10px;border-radius:999px;background:#080c18c9;border:1px solid #ffffff25;color:#fff;font-size:12px;font-weight:900;pointer-events:none}
    #nsr6Flash{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;font-size:52px;font-weight:1000;text-shadow:0 4px 18px #000;opacity:0;transition:opacity .12s}.nsr6-flash-on{opacity:1!important}
    @media(max-width:680px){.nsr6-scorebar{grid-template-columns:1fr}.nsr6-title{order:-1}.nsr6-score b{font-size:24px}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'nsr6Overlay';
  overlay.innerHTML = `
    <div id="nsr6Card">
      <div class="nsr6-head"><h2>🎮 Random Physics Duel</h2><button id="nsr6Close" class="nsr6-close">×</button></div>
      <div class="nsr6-scorebar">
        <div class="nsr6-score">PLAYER 1 <small>W</small><b id="nsr6P1">0</b></div>
        <div id="nsr6Title" class="nsr6-title"></div>
        <div class="nsr6-score">PLAYER 2 <small>↑</small><b id="nsr6P2">0</b></div>
      </div>
      <div id="nsr6CanvasWrap"><canvas id="nsr6Canvas" width="960" height="540"></canvas><div id="nsr6RoundTag"></div><div id="nsr6Flash"></div></div>
      <div class="nsr6-help"><div id="nsr6Status" class="nsr6-status"></div><div id="nsr6Sub" class="nsr6-sub"></div></div>
      <div class="nsr6-buttons"><button id="nsr6Restart" class="nsr6-btn primary">↻ Restart</button><button id="nsr6Back" class="nsr6-btn">← Sports Menu</button></div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = id => document.getElementById(id);
  const canvas = $('nsr6Canvas');
  const ctx = canvas.getContext('2d');
  const W = 960, H = 540;
  let game = null, raf = 0, last = 0, currentMode = null;

  const TEAM = [
    {shirt:'#25b9ff',dark:'#1747b4',short:'#163672'},
    {shirt:'#ff5d8f',dark:'#8c34c7',short:'#642185'}
  ];
  const SKINS = ['#f2c49c','#d99b70','#9d6848','#6e472f'];
  const THEMES = [
    {name:'Backyard',sky:'#5c83bf',ground:'#4c8a4e',line:'#eef8ef',crowd:'#32573a'},
    {name:'Beach',sky:'#55a9cf',ground:'#dcb66c',line:'#fff2b3',crowd:'#8c6a37'},
    {name:'Snow',sky:'#9bbbd5',ground:'#edf5fb',line:'#b9dff5',crowd:'#71889a'},
    {name:'Night',sky:'#172044',ground:'#33485c',line:'#8ce9ff',crowd:'#1e2839'},
    {name:'Neon',sky:'#28143f',ground:'#21473f',line:'#80ffe0',crowd:'#160e27'}
  ];
  const BALL_TYPES = {
    basketball:[
      {name:'Classic',r:15,color:'#f58c2b',mass:1,bounce:.72},
      {name:'Heavy',r:17,color:'#bd6d25',mass:1.35,bounce:.58},
      {name:'Light',r:13,color:'#ffab43',mass:.72,bounce:.86},
      {name:'Big Ball',r:22,color:'#f58c2b',mass:1.08,bounce:.68}
    ],
    soccer:[
      {name:'Soccer Ball',r:16,color:'#f7f7f7',mass:1,bounce:.72},
      {name:'Beach Ball',r:23,color:'#f9d85f',mass:.65,bounce:.88},
      {name:'Tiny Ball',r:11,color:'#ffffff',mass:.8,bounce:.82},
      {name:'Heavy Ball',r:18,color:'#dedede',mass:1.4,bounce:.58}
    ]
  };

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const d2=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
  function circle(x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
  function line(x1,y1,x2,y2,w,c){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
  function text(t,x,y,s=20,c='#fff',align='center',weight=900){ctx.fillStyle=c;ctx.font=`${weight} ${s}px system-ui,-apple-system,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(t,x,y)}

  function makeGuy(team,x,y,id){
    return {team,id,x,y,vx:0,vy:0,angle:0,av:0,face:team===0?1:-1,grounded:true,scale:1,arm:1,leg:1,skin:SKINS[(id+team)%SKINS.length],action:0,stun:0};
  }

  function handPoint(p){
    const s=p.scale, reach=34*p.arm*s, localX=p.face*reach, localY=-15*s;
    const ca=Math.cos(p.angle), sa=Math.sin(p.angle);
    return {x:p.x+localX*ca-localY*sa,y:p.y+localX*sa+localY*ca};
  }
  function footPoint(p){
    const s=p.scale, localX=p.face*14*s, localY=38*p.leg*s;
    const ca=Math.cos(p.angle), sa=Math.sin(p.angle);
    return {x:p.x+localX*ca-localY*sa,y:p.y+localX*sa+localY*ca};
  }

  function drawGuy(p,heldBall=null){
    const pal=TEAM[p.team], s=p.scale, skin=p.skin;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);
    ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(0,40*s,20*s,5*s,0,0,Math.PI*2);ctx.fill();
    rect(-12*s,-47*s,24*s,22*s,skin);
    rect(-10*s,-44*s,20*s,4*s,'#51362b');
    rect(-16*s,-25*s,32*s,38*s,pal.shirt);rect(-16*s,-5*s,32*s,5*s,pal.dark);
    rect(-13*s,13*s,10*s,26*p.leg,pal.short);rect(3*s,13*s,10*s,26*p.leg,pal.short);
    rect(-15*s,37*p.leg,13*s,7*s,'#f7f7f7');rect(2*s,37*p.leg,13*s,7*s,'#f7f7f7');
    const swing=1+0.45*p.action;
    line(-13*s,-16*s,-p.face*23*s,-2*s,8*s,skin);
    line(13*s,-16*s,p.face*34*p.arm*s*swing,-14*s,8*s,skin);
    rect(-6*s,-14*s,12*s,12*s,'#ffffff22');
    if(heldBall){circle(p.face*34*p.arm*s*swing,-14*s,heldBall.r,heldBall.color)}
    ctx.restore();
  }

  function drawCrowd(theme){
    rect(0,55,W,70,theme.crowd);
    for(let x=15;x<W;x+=27){const row=((x/27)|0)%2, y=83+row*22;circle(x,y,6,SKINS[((x/27)|0)%SKINS.length]);rect(x-7,y+7,14,14,((x/27)|0)%2?'#ffffff25':'#00000025')}
  }

  function normalizeAngle(a){while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a}
  function facingFromMotion(p){
    if(Math.abs(p.vx)>85)p.face=Math.sign(p.vx);
    if(Math.abs(p.angle)>2.35){p.face*=-1;p.angle=normalizeAngle(p.angle-Math.sign(p.angle)*Math.PI)}
  }
  function integrateGuy(p,dt,g){
    p.stun=Math.max(0,p.stun-dt);p.action=Math.max(0,p.action-dt*4.4);
    p.vy+=g.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=p.av*dt;
    p.vx*=Math.pow(g.slip,dt*60);p.av*=Math.pow(.965,dt*60);
    if(p.y>g.floor){p.y=g.floor;p.vy=0;p.grounded=true;p.angle*=Math.pow(.65,dt*60);p.av*=.72}else p.grounded=false;
    if(p.x<38){p.x=38;p.vx=Math.abs(p.vx)*.55;p.face=1;p.av+=1.1}
    if(p.x>W-38){p.x=W-38;p.vx=-Math.abs(p.vx)*.55;p.face=-1;p.av-=1.1}
    facingFromMotion(p);
  }
  function collideGuys(players){
    for(let i=0;i<players.length;i++)for(let j=i+1;j<players.length;j++){
      const a=players[i],b=players[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),min=46*(a.scale+b.scale)/2;
      if(d>0&&d<min){const nx=dx/d,ny=dy/d,push=(min-d)*.5;a.x-=nx*push;b.x+=nx*push;const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel<0){const imp=-rel*.55;a.vx-=nx*imp;b.vx+=nx*imp;a.vy-=ny*imp*.25;b.vy+=ny*imp*.25;a.av-=nx*.7;b.av+=nx*.7}}
    }
  }

  function teamAction(team){
    if(!game||game.freeze>0||game.winner)return;
    const own=game.players.filter(p=>p.team===team);
    own.forEach((p,idx)=>{
      const boost = p.grounded ? 1 : .34;
      p.vy -= game.jumpY*boost;
      p.vx += p.face*game.jumpX*boost;
      p.av += p.face*rnd(1.7,3.3)*boost*(idx?-.78:1);
      p.grounded=false;p.action=1;
    });
    if(game.kind==='basketball')basketAction(team,own);
  }

  function basketAction(team,own){
    const b=game.ball;
    if(b.heldBy==null)return;
    const holder=game.players[b.heldBy];
    if(!holder||holder.team!==team)return;
    const targetX=team===0?875:85, targetY=188;
    const dx=targetX-holder.x, dy=targetY-holder.y;
    const close=Math.abs(dx)<170;
    b.heldBy=null;b.justReleased=.18;
    if(close){
      b.vx=holder.face*(430+Math.abs(dx)*1.15);
      b.vy=-310;
    }else{
      const time=clamp(Math.abs(dx)/520,.55,1.05);
      b.vx=dx/time;
      b.vy=(dy-.5*game.gravity*.66*time*time)/time;
    }
    b.lastTeam=team;b.x=holder.x+holder.face*38*holder.scale;b.y=holder.y-18*holder.scale;
  }

  function randomRound(kind, first=false){
    const g=game;
    g.theme=pick(THEMES);g.ballType=pick(BALL_TYPES[kind]);g.gravity=rnd(960,1250);g.slip=rnd(.982,.994);g.jumpX=rnd(250,315);g.jumpY=rnd(500,565);g.round=(g.round||0)+1;g.freeze=first?0:.55;
    const sharedScale=rnd(.88,1.15), sharedArm=rnd(.82,1.28), sharedLeg=rnd(.9,1.15);
    g.players.forEach(p=>{p.scale=sharedScale*(p.id%2?rnd(.94,1.06):1);p.arm=sharedArm;p.leg=sharedLeg;p.angle=rnd(-.08,.08);p.av=0;p.vx=0;p.vy=0;p.face=p.team===0?1:-1;p.action=0;p.stun=0});
    $('nsr6RoundTag').textContent=`${g.theme.name} • ${g.ballType.name}`;
  }

  function startBasketball(){
    currentMode='basketball';$('nsr6Title').textContent='🏀 BASKET CHAOS — FIRST TO 5';$('nsr6P1').textContent='0';$('nsr6P2').textContent='0';
    const floor=456;
    game={kind:'basketball',scores:[0,0],players:[makeGuy(0,245,floor,0),makeGuy(0,335,floor,1),makeGuy(1,625,floor,0),makeGuy(1,715,floor,1)],ball:{x:480,y:220,vx:0,vy:0,r:15,color:'#f58c2b',heldBy:null,lastTeam:null,justReleased:0,prevY:220},floor,gravity:1100,slip:.99,jumpX:280,jumpY:535,freeze:0,winner:null,round:0};
    randomRound('basketball',true);resetBasketPositions(true);
    $('nsr6Status').textContent='W vs ↑ — one button controls both players on your team.';
    $('nsr6Sub').textContent='Grab the loose ball automatically. Press your button to jump; if your team is holding the ball, that same press shoots or dunks.';
  }
  function resetBasketPositions(first=false){
    const g=game,f=g.floor;
    const pos=[[235,325],[635,725]];
    g.players.forEach((p,i)=>{const lane=p.team===0?0:1;p.x=pos[lane][p.id];p.y=f;p.vx=0;p.vy=0;p.angle=0;p.face=p.team===0?1:-1;p.action=0});
    Object.assign(g.ball,{x:480,y:first?220:185,vx:rnd(-35,35),vy:0,r:g.ballType.r,color:g.ballType.color,mass:g.ballType.mass,bounce:g.ballType.bounce,heldBy:null,lastTeam:null,justReleased:0,prevY:185});
  }

  function updateBasket(dt){
    const g=game;if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;
    g.players.forEach(p=>integrateGuy(p,dt,g));collideGuys(g.players);
    const b=g.ball;b.justReleased=Math.max(0,b.justReleased-dt);b.prevY=b.y;
    if(b.heldBy!=null){
      const h=g.players[b.heldBy];
      if(!h){b.heldBy=null}else{const hp=handPoint(h);b.x=hp.x;b.y=hp.y;b.vx=h.vx;b.vy=h.vy;}
    }else{
      b.vy+=g.gravity*.66*b.mass*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.992,dt*60);
      if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*b.bounce}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*b.bounce}
      if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*b.bounce}if(b.y>g.floor+28-b.r){b.y=g.floor+28-b.r;b.vy=-Math.abs(b.vy)*b.bounce;b.vx*=.92}
      if(b.justReleased<=0){
        let best=-1,bestD=Infinity;
        g.players.forEach((p,i)=>{const hp=handPoint(p),d=Math.min(d2(hp,b),Math.hypot(p.x-b.x,p.y-12*p.scale-b.y));if(d<38*p.scale+b.r&&d<bestD){best=i;bestD=d}});
        if(best>=0){b.heldBy=best;b.lastTeam=g.players[best].team;g.players[best].action=.35}
      }
    }
    if(b.heldBy!=null){
      const holder=g.players[b.heldBy];
      for(let i=0;i<g.players.length;i++){
        const p=g.players[i];if(p.team===holder.team)continue;
        const hp=handPoint(holder), op=handPoint(p);
        if((p.action>.35&&Math.hypot(op.x-hp.x,op.y-hp.y)<52)||(d2(p,holder)<38&&(Math.abs(p.vx-holder.vx)>140))){
          b.heldBy=null;b.justReleased=.22;b.vx=p.face*280+p.vx*.45;b.vy=-190;holder.stun=.2;holder.av+=p.face*2.1;break;
        }
      }
    }
    if(b.heldBy==null&&b.vy>0){
      if(b.prevY<194&&b.y>=194&&b.x>846&&b.x<914)score(0,'BASKET!');
      else if(b.prevY<194&&b.y>=194&&b.x>46&&b.x<114)score(1,'BASKET!');
    }
  }

  function startSoccer(){
    currentMode='soccer';$('nsr6Title').textContent='⚽ SOCCER CHAOS — FIRST TO 5';$('nsr6P1').textContent='0';$('nsr6P2').textContent='0';
    const floor=447;
    game={kind:'soccer',scores:[0,0],players:[makeGuy(0,235,floor,0),makeGuy(0,335,floor,1),makeGuy(1,625,floor,0),makeGuy(1,725,floor,1)],ball:{x:480,y:300,vx:0,vy:0,r:16,color:'#fff',prevX:480},floor,gravity:1080,slip:.99,jumpX:285,jumpY:535,freeze:0,winner:null,round:0};
    randomRound('soccer',true);resetSoccerPositions();
    $('nsr6Status').textContent='W vs ↑ — both teammates jump together.';
    $('nsr6Sub').textContent='The jump always launches the player in the direction they are facing. Feet, body and head can all kick the ball; action frames kick much harder.';
  }
  function resetSoccerPositions(){
    const g=game,f=g.floor, pos=[[220,335],[625,740]];
    g.players.forEach(p=>{p.x=pos[p.team][p.id];p.y=f;p.vx=0;p.vy=0;p.angle=0;p.face=p.team===0?1:-1;p.action=0});
    Object.assign(g.ball,{x:480,y:300,vx:rnd(-30,30),vy:0,r:g.ballType.r,color:g.ballType.color,prevX:480});
  }
  function updateSoccer(dt){
    const g=game;if(g.freeze>0){g.freeze-=dt;return}if(g.winner)return;
    g.players.forEach(p=>integrateGuy(p,dt,g));collideGuys(g.players);
    const b=g.ball;b.prevX=b.x;b.vy+=g.gravity*.73*g.ballType.mass*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.993,dt*60);
    if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*g.ballType.bounce}if(b.y>g.floor+30-b.r){b.y=g.floor+30-b.r;b.vy=-Math.abs(b.vy)*g.ballType.bounce;b.vx*=.94}
    const goalTop=285;
    if(b.x<b.r&&b.y<goalTop){b.x=b.r;b.vx=Math.abs(b.vx)*g.ballType.bounce}
    if(b.x>W-b.r&&b.y<goalTop){b.x=W-b.r;b.vx=-Math.abs(b.vx)*g.ballType.bounce}
    for(const p of g.players){
      const fp=footPoint(p), body={x:p.x,y:p.y-5*p.scale};
      const footD=d2(fp,b), bodyD=d2(body,b);
      if(footD<24*p.scale+b.r||bodyD<31*p.scale+b.r){
        const strong=p.action>.15;
        const dir=p.face;
        const power=strong?rnd(520,690):rnd(225,340);
        b.vx=dir*power+p.vx*.62;
        b.vy-=strong?rnd(180,275):rnd(60,120);
        p.av-=dir*(strong?1.6:.5);
      }
    }
    if(b.y>goalTop&&b.y<g.floor+32){
      if(b.x<-b.r*.15)score(1,'GOAL!');
      else if(b.x>W+b.r*.15)score(0,'GOAL!');
    }
  }

  function score(team,label){
    const g=game;if(g.freeze>0||g.winner)return;
    g.scores[team]++;$('nsr6P1').textContent=g.scores[0];$('nsr6P2').textContent=g.scores[1];
    const flash=$('nsr6Flash');flash.textContent=`${label}  ${g.scores[0]} - ${g.scores[1]}`;flash.classList.add('nsr6-flash-on');setTimeout(()=>flash.classList.remove('nsr6-flash-on'),520);
    if(g.scores[team]>=5){g.winner=team;$('nsr6Status').textContent=`🏆 Player ${team+1} wins!`;$('nsr6Sub').textContent='First to 5. Restart for a rematch.';return}
    randomRound(g.kind,false);
    if(g.kind==='basketball')resetBasketPositions(false);else resetSoccerPositions();
  }

  function drawBackground(g){
    rect(0,0,W,H,g.theme.sky);drawCrowd(g.theme);rect(0,125,W,H-125,g.theme.ground);
  }
  function drawBasket(){
    const g=game;drawBackground(g);
    rect(0,g.floor+32,W,H-g.floor-32,'#9b643d');line(480,127,480,g.floor+30,3,'#ffffff55');ctx.strokeStyle='#ffffff55';ctx.lineWidth=3;ctx.beginPath();ctx.arc(480,345,70,0,Math.PI*2);ctx.stroke();
    rect(26,128,11,116,'#e6edf5');rect(37,135,58,9,'#dce7f1');line(70,146,70,194,5,'#f5f5f5');line(48,194,112,194,7,'#ff774f');
    rect(W-37,128,11,116,'#e6edf5');rect(W-95,135,58,9,'#dce7f1');line(W-70,146,W-70,194,5,'#f5f5f5');line(W-112,194,W-48,194,7,'#ff774f');
    for(let i=0;i<5;i++){line(52+i*13,198,58+i*10,225,2,'#ffffffbb');line(W-52-i*13,198,W-58-i*10,225,2,'#ffffffbb')}
    g.players.forEach((p,i)=>drawGuy(p,g.ball.heldBy===i?g.ball:null));
    if(g.ball.heldBy==null){circle(g.ball.x,g.ball.y,g.ball.r,g.ball.color);ctx.strokeStyle='#6e3f17';ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.ball.x,g.ball.y,g.ball.r*.72,-1.1,1.1);ctx.stroke();line(g.ball.x-g.ball.r,g.ball.y,g.ball.x+g.ball.r,g.ball.y,1.5,'#6e3f17')}
  }
  function drawSoccer(){
    const g=game;drawBackground(g);rect(0,g.floor+30,W,H-g.floor-30,g.theme.ground);
    line(480,130,480,g.floor+30,3,'#ffffff80');ctx.strokeStyle='#ffffff80';ctx.lineWidth=3;ctx.beginPath();ctx.arc(480,345,72,0,Math.PI*2);ctx.stroke();
    rect(0,284,13,194,'#e9eef1');rect(13,284,95,9,'#e9eef1');rect(0,469,108,9,'#e9eef1');
    rect(W-13,284,13,194,'#e9eef1');rect(W-108,284,95,9,'#e9eef1');rect(W-108,469,108,9,'#e9eef1');
    for(let y=300;y<466;y+=22){line(13,y,105,y,1,'#ffffff45');line(W-105,y,W-13,y,1,'#ffffff45')}
    for(let x=20;x<105;x+=20){line(x,292,x,470,1,'#ffffff35');line(W-x,292,W-x,470,1,'#ffffff35')}
    g.players.forEach(p=>drawGuy(p));
    circle(g.ball.x,g.ball.y,g.ball.r,g.ball.color);if(g.ballType.name==='Soccer Ball'){circle(g.ball.x,g.ball.y,g.ball.r*.3,'#222');for(let a=0;a<5;a++){const an=a*Math.PI*2/5;circle(g.ball.x+Math.cos(an)*g.ball.r*.62,g.ball.y+Math.sin(an)*g.ball.r*.62,g.ball.r*.16,'#222')}}
  }

  function draw(){if(!game)return;if(game.kind==='basketball')drawBasket();else drawSoccer()}
  function update(dt){if(!game)return;if(game.kind==='basketball')updateBasket(dt);else updateSoccer(dt);draw()}
  function loop(now){if(!overlay.classList.contains('show')||!game){raf=0;return}const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;try{update(dt)}catch(e){console.error('sports random v6',e);$('nsr6Status').textContent='Game paused after an error.';cancelAnimationFrame(raf);raf=0;return}raf=requestAnimationFrame(loop)}
  function startLoop(){if(raf)cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop)}
  function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0}

  function open(mode){
    currentMode=mode;oldOverlay?.classList.remove('show');overlay.classList.add('show');if(mode==='basketball')startBasketball();else startSoccer();startLoop();
  }
  function back(){
    overlay.classList.remove('show');stopLoop();game=null;if(oldOverlay){oldOverlay.classList.add('show');if(oldMenu)oldMenu.style.display='grid';oldArena?.classList.remove('show')}
  }
  function closeAll(){overlay.classList.remove('show');stopLoop();game=null}

  window.addEventListener('click', e => {
    const card=e.target?.closest?.('#nsa5Menu [data-game]');
    if(!card)return;
    const which=card.dataset.game;
    if(which!=='basketball'&&which!=='soccer')return;
    e.preventDefault();e.stopImmediatePropagation();open(which);
  }, true);

  window.addEventListener('keydown', e => {
    if(!overlay.classList.contains('show')||!game)return;
    if(e.repeat)return;
    if(e.key.toLowerCase()==='w'){e.preventDefault();teamAction(0)}
    else if(e.key==='ArrowUp'){e.preventDefault();teamAction(1)}
    else if(e.key==='Escape'){e.preventDefault();back()}
  }, true);

  $('nsr6Restart').onclick=()=>{if(currentMode==='basketball')startBasketball();else startSoccer()};
  $('nsr6Back').onclick=back;
  $('nsr6Close').onclick=closeAll;
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeAll()});
})();
