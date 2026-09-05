(() => {
  if (window.__needohStageInputFinalV1) return;
  window.__needohStageInputFinalV1 = true;

  const SOUND_KEY='needohHoldSoundV1';
  const TRACKS={
    abnormal:'dWXMw_jOtSI',
    uranium:'EYsvBhN0dnc',
    monocle:'eYIum8HMB0Y'
  };
  let holding=false;
  let pointerId=null;
  let timer=null;
  let lastPoint={clientX:0,clientY:0};
  let playRetries=[];

  const selected=()=>localStorage.getItem(SOUND_KEY)||'classic';

  function insideNeedoh(e){
    const n=document.getElementById('needoh');
    if(!n)return false;
    const r=n.getBoundingClientRect();
    return Number.isFinite(e.clientX)&&Number.isFinite(e.clientY)&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
  }

  function command(frame,func,args=[]){
    try{frame?.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'https://www.youtube.com')}catch(_){ }
  }

  function ensureFrame(key){
    if(!TRACKS[key])return null;
    let host=document.getElementById('coreYouTubeFrameHost');
    if(!host){
      let panel=document.getElementById('coreYouTubePanel');
      if(!panel){
        panel=document.createElement('div');
        panel.id='coreYouTubePanel';
        panel.style.cssText='position:fixed;left:16px;bottom:16px;width:210px;z-index:50000;background:#0d1020;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.18)';
        panel.innerHTML='<div id="coreYouTubeTitle" style="padding:8px 10px;color:white;font-weight:900;font-size:12px">YouTube Hold Music</div><div id="coreYouTubeFrameHost"></div>';
        document.body.appendChild(panel);
      }
      host=document.getElementById('coreYouTubeFrameHost');
    }
    let f=document.getElementById(`coreYT_${key}`);
    if(!f){
      f=document.createElement('iframe');
      f.id=`coreYT_${key}`;
      f.allow='autoplay; encrypted-media; picture-in-picture';
      f.setAttribute('allowfullscreen','');
      f.style.cssText='display:block;width:210px;height:200px;border:0;background:#000';
      const id=TRACKS[key];
      f.src=`https://www.youtube.com/embed/${id}?enablejsapi=1&playsinline=1&controls=1&rel=0&loop=1&playlist=${id}`;
      host?.appendChild(f);
    }
    document.querySelectorAll('#coreYouTubeFrameHost iframe').forEach(x=>x.style.display=x===f?'block':'none');
    const panel=document.getElementById('coreYouTubePanel');if(panel)panel.style.display='block';
    return f;
  }

  function pauseMusic(){
    playRetries.forEach(clearTimeout);playRetries=[];
    document.querySelectorAll('#coreYouTubeFrameHost iframe').forEach(f=>command(f,'pauseVideo'));
  }

  function playMusic(){
    const key=selected();
    if(key==='classic'||!TRACKS[key])return;
    try{if(state?.sound===false)return}catch(_){ }
    pauseMusic();
    const f=ensureFrame(key);if(!f)return;
    const play=()=>{if(!holding||selected()!==key)return;command(f,'setVolume',[70]);command(f,'playVideo')};
    play();
    playRetries=[setTimeout(play,150),setTimeout(play,400),setTimeout(play,800)];
  }

  const priorSound=typeof playSquishSound==='function'?playSquishSound:null;
  if(priorSound){
    playSquishSound=function(r){
      if(holding&&selected()!=='classic')return;
      return priorSound(r);
    };
  }

  function earn(){
    if(!holding||typeof squish!=='function')return;
    try{squish(lastPoint)}catch(e){console.error('Final hold squish failed',e);stop({})}
  }

  function start(e){
    if(!insideNeedoh(e)||holding)return;
    if(e.pointerType==='mouse'&&e.button!==0)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    holding=true;
    pointerId=e.pointerId??null;
    lastPoint={clientX:e.clientX||0,clientY:e.clientY||0};
    try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch(_){ }
    document.getElementById('needoh')?.classList.add('core-holding');
    playMusic();
    earn();
    clearInterval(timer);timer=setInterval(earn,105);
  }

  function move(e){
    if(!holding)return;
    if(pointerId!==null&&e.pointerId!=null&&e.pointerId!==pointerId)return;
    lastPoint={clientX:e.clientX||0,clientY:e.clientY||0};
  }

  function stop(e){
    if(holding&&pointerId!==null&&e?.pointerId!=null&&e.pointerId!==pointerId)return;
    holding=false;pointerId=null;clearInterval(timer);timer=null;pauseMusic();
    const n=document.getElementById('needoh');
    if(n){n.classList.remove('core-holding');n.classList.remove('squishing');void n.offsetWidth;n.classList.add('squishing')}
  }

  const stage=document.getElementById('stage');
  if(!stage)return;
  stage.style.touchAction='none';
  stage.addEventListener('pointerdown',start,{capture:true,passive:false});
  stage.addEventListener('pointermove',move,{capture:true,passive:true});
  stage.addEventListener('pointerup',stop,{capture:true,passive:true});
  stage.addEventListener('pointercancel',stop,{capture:true,passive:true});
  window.addEventListener('pointerup',stop,true);
  window.addEventListener('pointercancel',stop,true);
  window.addEventListener('blur',()=>stop({}),true);
})();