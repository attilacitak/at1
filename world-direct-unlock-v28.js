(() => {
  if (window.__needohWorldDirectUnlockV29) return;
  window.__needohWorldDirectUnlockV29 = true;

  const SAVE_KEY='needohSquishWorldSaveV2';
  const WORLD_CONFIG={
    1:{next:2,threshold:1e6,label:'🌊 World 2',flag:'world2Unlocked'},
    2:{next:3,threshold:1e10,label:'🌌 World 3',flag:'world3Unlocked'},
    3:{next:4,threshold:1e15,label:'🌠 World 4',flag:'world4Unlocked'},
    4:{next:5,threshold:1e21,label:'🪐 World 5',flag:'world5Unlocked'},
    5:{next:1,threshold:0,label:'🌎 World 1',flag:null}
  };
  const SUFFIX={'':1,'K':1e3,'M':1e6,'B':1e9,'T':1e12,'Qa':1e15,'Qi':1e18,'Sx':1e21,'Sp':1e24,'Oc':1e27,'No':1e30,'Dc':1e33,'UDc':1e36,'DDc':1e39,'TDc':1e42,'QaDc':1e45,'QiDc':1e48,'SxDc':1e51,'SpDc':1e54,'ODc':1e57,'NDc':1e60,'Vg':1e63,'UVg':1e66,'DVg':1e69,'TVg':1e72,'QaVg':1e75,'QiVg':1e78,'SxVg':1e81,'SpVg':1e84,'OcVg':1e87,'NoVg':1e90};

  function parseCoins(text){
    const s=String(text||'').replace(/[🪙,]/g,'').trim();
    const m=s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)([A-Za-z]+)?/i);
    if(!m)return NaN;
    const n=Number(m[1]);
    if(!Number.isFinite(n))return n;
    if(/e/i.test(m[1]))return n;
    const suffix=m[2]||'';
    if(Object.prototype.hasOwnProperty.call(SUFFIX,suffix))return n*SUFFIX[suffix];
    const key=Object.keys(SUFFIX).find(k=>k.toLowerCase()===suffix.toLowerCase());
    return key!==undefined?n*SUFFIX[key]:n;
  }

  function readSave(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')||{}}catch(_){return {}}}
  function writeSave(data){try{localStorage.setItem(SAVE_KEY,JSON.stringify(data));return true}catch(_){return false}}

  function currentWorld(){
    try{const w=Number(state?.world);if(Number.isFinite(w)&&w>0)return w}catch(_){}
    const badge=document.getElementById('worldBadge')?.textContent||'';
    const m=badge.match(/World\s*(\d+)/i);if(m)return Number(m[1])||1;
    const s=readSave();return Number(s.world)||1;
  }

  function realBalance(){
    let internal=0;try{internal=Number(state?.coins)||0}catch(_){}
    const visible=parseCoins(document.getElementById('coins')?.textContent||'');
    const saved=Number(readSave().coins)||0;
    return Math.max(internal,Number.isFinite(visible)?visible:0,saved);
  }

  function isUnlocked(cfg){
    if(!cfg.flag)return true;
    try{if(state?.[cfg.flag])return true}catch(_){}
    return !!readSave()[cfg.flag];
  }

  function persistTarget(cfg,balance){
    const s=readSave();
    s.coins=Math.max(Number(s.coins)||0,balance||0);
    s.world=cfg.next;
    if(cfg.flag)s[cfg.flag]=true;
    writeSave(s);

    let stateChanged=false;
    try{
      const internal=Number(state.coins)||0;
      if(balance>internal)state.coins=balance;
      if(cfg.flag)state[cfg.flag]=true;
      state.world=cfg.next;
      stateChanged=true;
    }catch(_){}

    if(stateChanged){
      try{if(typeof restock==='function')restock(true);else state.restockAt=Date.now()+60000}catch(_){}
      try{if(typeof resetBossForWorld==='function')resetBossForWorld()}catch(_){}
      try{if(typeof render==='function')render()}catch(_){}
      try{if(typeof save==='function')save(true)}catch(_){}
      try{window.__needohSyncWorldProgress?.()}catch(_){}
    }
    return stateChanged;
  }

  function directWorldChange(){
    const w=currentWorld();
    const cfg=WORLD_CONFIG[w];
    if(!cfg){
      try{if(typeof toast==='function')toast('This world is not configured yet')}catch(_){}
      return;
    }

    const balance=realBalance();
    const already=isUnlocked(cfg);
    if(!already&&cfg.threshold>0&&balance<cfg.threshold){
      let need=cfg.threshold;try{if(typeof fmt==='function')need=fmt(cfg.threshold)}catch(_){}
      try{if(typeof toast==='function')toast(`Reach ${need} coins first!`)}catch(_){}
      return;
    }

    const changed=persistTarget(cfg,balance);
    try{if(typeof toast==='function')toast(already?`Entered ${cfg.label}`:`${cfg.label} unlocked!`)}catch(_){}

    setTimeout(()=>{
      if(currentWorld()!==cfg.next||!changed)location.reload();
    },120);
  }

  window.addEventListener('click',e=>{
    const btn=e.target?.closest?.('#worldBtn');
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    directWorldChange();
  },true);

  window.__needohDirectWorldChange=directWorldChange;
})();
