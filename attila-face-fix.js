(() => {
  const IMAGE='/attila-squishy-face.jpg?v=4';

  function ensureStyle(){
    if(document.getElementById('attilaFaceFixStyle'))return;
    const s=document.createElement('style');
    s.id='attilaFaceFixStyle';
    s.textContent=`
      #needoh.attila-face-active{overflow:hidden!important;background:#1a1200!important;border:4px solid #ffd84d!important;box-shadow:0 0 40px #ffd84d,0 0 85px rgba(255,184,33,.7),inset 0 0 24px rgba(255,255,255,.18)!important}
      #needoh.attila-face-active::before{display:none!important}
      #needoh .attila-face-img{position:absolute;inset:-2px;width:calc(100% + 4px);height:calc(100% + 4px);object-fit:cover;object-position:50% 50%;border-radius:inherit;display:none;pointer-events:none;z-index:20;opacity:1!important;filter:none!important}
      #needoh.attila-face-active .attila-face-img{display:block!important}
    `;
    document.head.appendChild(s);
  }

  function ensureImage(){
    ensureStyle();
    const n=$('needoh');
    if(!n)return null;
    let img=n.querySelector('.attila-face-img');
    if(!img){
      img=document.createElement('img');
      img.className='attila-face-img';
      img.alt='ATTILA Squishy';
      img.draggable=false;
      img.onload=()=>{img.dataset.loaded='1';};
      img.onerror=()=>{console.error('ATTILA face image failed to load',IMAGE);};
      n.appendChild(img);
    }
    if(img.getAttribute('src')!==IMAGE)img.src=IMAGE;
    return img;
  }

  function apply(){
    const n=$('needoh');
    if(!n)return;
    const active=state?.selected==='ATTILA';
    const img=ensureImage();
    n.classList.toggle('attila-face-active',active);
    if(active){
      n.style.backgroundImage='none';
      n.style.background='#1a1200';
      if(img){img.style.display='block';img.style.visibility='visible';}
    }else if(img){
      img.style.display='none';
    }
  }

  const previousRender=render;
  render=function(){
    const v=previousRender();
    apply();
    return v;
  };

  apply();
  setTimeout(apply,100);
  setTimeout(apply,800);
  setInterval(()=>{if(state?.selected==='ATTILA')apply()},1500);
  window.__needohAttilaFaceFixLoaded=true;
})();