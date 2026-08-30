(() => {
  const IMAGE='/attila-squishy.webp?v=2';

  function ensureStyle(){
    if(document.getElementById('attilaFaceFixStyle'))return;
    const s=document.createElement('style');
    s.id='attilaFaceFixStyle';
    s.textContent=`
      #needoh.attila-face-active{overflow:hidden!important;background:#1a1200!important;border:4px solid #ffd84d!important;box-shadow:0 0 40px #ffd84d,0 0 85px rgba(255,184,33,.7),inset 0 0 24px rgba(255,255,255,.18)!important}
      #needoh.attila-face-active::before{display:none!important}
      #needoh .attila-face-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 48%;border-radius:inherit;display:none;pointer-events:none;z-index:2;transform:scale(1.04)}
      #needoh.attila-face-active .attila-face-img{display:block}
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
      img.src=IMAGE;
      img.draggable=false;
      n.appendChild(img);
    }
    return img;
  }

  function apply(){
    const n=$('needoh');
    if(!n)return;
    const active=state?.selected==='ATTILA';
    ensureImage();
    n.classList.toggle('attila-face-active',active);
    if(active){
      n.style.backgroundImage='none';
      n.style.background='#1a1200';
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
  window.__needohAttilaFaceFixLoaded=true;
})();