(()=>{
  if(window.__needohAccountGateLoaded)return;
  const SB='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const H={apikey:KEY,'Content-Type':'application/json'};
  const SAVE_KEY='needohSquishWorldSaveV2';
  const PLAYER_KEY='needohPlayerName';
  const SESSION_KEY='needohAccountSessionV1';
  const ACCOUNT_NAME_KEY='needohAccountNameV1';
  const EXTRA_KEYS=['needohAdventureV4','needohAdventureV3','needohAdventureFinalV1','needohAdventureProgressFixV2'];
  const game=document.getElementById('game');
  if(!game)return;
  let mode='login',busy=false;

  function readJson(key){try{const v=localStorage.getItem(key);return v?JSON.parse(v):null}catch(_){return null}}
  function localEnvelope(){
    const state=readJson(SAVE_KEY);
    if(!state)return null;
    const extras={};
    for(const k of EXTRA_KEYS){const v=readJson(k);if(v!==null)extras[k]=v}
    return {__needohCloudVersion:1,state,extras};
  }
  function clearGameLocal(){
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PLAYER_KEY);
    for(const k of EXTRA_KEYS)localStorage.removeItem(k);
  }
  function applyCloud(saveData,playerName){
    localStorage.setItem(PLAYER_KEY,String(playerName||'Player'));
    if(!saveData){
      localStorage.removeItem(SAVE_KEY);
      for(const k of EXTRA_KEYS)localStorage.removeItem(k);
      return;
    }
    if(saveData.__needohCloudVersion&&saveData.state&&typeof saveData.state==='object'){
      localStorage.setItem(SAVE_KEY,JSON.stringify(saveData.state));
      const extras=saveData.extras&&typeof saveData.extras==='object'?saveData.extras:{};
      for(const k of EXTRA_KEYS){
        if(Object.prototype.hasOwnProperty.call(extras,k)&&extras[k]!=null)localStorage.setItem(k,JSON.stringify(extras[k]));
        else localStorage.removeItem(k);
      }
      return;
    }
    if(typeof saveData==='object')localStorage.setItem(SAVE_KEY,JSON.stringify(saveData));
  }
  async function rpc(name,body={}){
    const r=await fetch(`${SB}/rest/v1/rpc/${name}`,{method:'POST',headers:H,body:JSON.stringify(body)});
    const text=await r.text();
    if(!r.ok)throw new Error(text||`Account request failed (${r.status})`);
    return text?JSON.parse(text):null;
  }
  function storeSession(token,name){
    localStorage.setItem(SESSION_KEY,token);
    localStorage.setItem(ACCOUNT_NAME_KEY,name);
    localStorage.setItem(PLAYER_KEY,name);
  }
  function clearSession(){
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ACCOUNT_NAME_KEY);
  }
  function startGame(result){
    const name=String(result?.player_name||localStorage.getItem(ACCOUNT_NAME_KEY)||'Player');
    if(result?.session_token)storeSession(result.session_token,name);
    else localStorage.setItem(PLAYER_KEY,name);
    applyCloud(result?.save_data??null,name);
    gate.classList.add('hidden');
    game.style.visibility='visible';
    game.src='/raw-game?v=10';
  }

  const style=document.createElement('style');
  style.textContent=`
    #needohAccountGate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;color:#fff;font-family:Inter,ui-rounded,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:radial-gradient(circle at 15% 12%,#44e8c929,transparent 26%),radial-gradient(circle at 86% 15%,#c14fff30,transparent 28%),linear-gradient(135deg,#0f1529,#261238)}
    #needohAccountGate.hidden{display:none}#needohAccountGate *{box-sizing:border-box}
    .nag-card{width:min(480px,100%);padding:27px;border-radius:26px;background:#ffffff0e;border:1px solid #ffffff22;box-shadow:0 28px 100px #0008;backdrop-filter:blur(16px)}
    .nag-logo{text-align:center;font-size:48px}.nag-title{text-align:center;margin:4px 0 2px;font-size:29px;font-weight:1000}.nag-sub{text-align:center;color:#c9c9da;font-size:13px;line-height:1.45;margin:0 0 18px}
    .nag-tabs{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:5px;background:#0004;border-radius:15px;margin-bottom:14px}.nag-tab{border:0;border-radius:11px;padding:10px;background:transparent;color:#c9c9da;font-weight:900;cursor:pointer}.nag-tab.on{background:linear-gradient(135deg,#21d8ae,#666cff);color:white}
    .nag-label{display:block;font-size:12px;color:#cac9db;font-weight:800;margin-top:9px}.nag-input{width:100%;border:1px solid #ffffff26;background:#0005;color:#fff;border-radius:14px;padding:13px 14px;font-size:16px;outline:none;margin-top:5px}.nag-input:focus{border-color:#7cf7d4;box-shadow:0 0 0 3px #7cf7d422}
    .nag-check{display:flex;gap:9px;align-items:flex-start;padding:11px;margin:11px 0;background:#ffd95e12;border:1px solid #ffd95e2d;border-radius:13px;color:#ffe99d;font-size:12px;line-height:1.35}.nag-check input{margin-top:2px}
    .nag-btn{width:100%;border:0;border-radius:14px;padding:13px;margin-top:12px;color:white;font-weight:1000;font-size:16px;cursor:pointer;background:linear-gradient(135deg,#1fd5a9,#6467ff)}.nag-btn:disabled{opacity:.5;cursor:wait}.nag-error{min-height:20px;margin-top:10px;text-align:center;color:#ff9bad;font-size:13px;font-weight:850}.nag-foot{text-align:center;color:#aeadc4;font-size:11px;line-height:1.45;margin-top:10px}.nag-loading{text-align:center;padding:24px 0}.nag-spinner{width:42px;height:42px;border:4px solid #ffffff22;border-top-color:#7cf7d4;border-radius:50%;margin:0 auto 13px;animation:nagspin .8s linear infinite}@keyframes nagspin{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(style);
  const gate=document.createElement('div');
  gate.id='needohAccountGate';
  document.body.appendChild(gate);
  game.style.visibility='hidden';

  function hasLocalProgress(){return !!readJson(SAVE_KEY)}
  function setError(msg=''){const e=document.getElementById('nagError');if(e)e.textContent=msg}
  function renderForm(){
    const oldName=(localStorage.getItem(ACCOUNT_NAME_KEY)||localStorage.getItem(PLAYER_KEY)||'').slice(0,20);
    gate.innerHTML=`<div class="nag-card"><div class="nag-logo">🫧</div><div class="nag-title">Needoh Squish World</div><p class="nag-sub">Your progress is now saved to your account. Use the same name and password on any computer to continue.</p><div class="nag-tabs"><button class="nag-tab ${mode==='login'?'on':''}" id="nagLoginTab">LOG IN</button><button class="nag-tab ${mode==='create'?'on':''}" id="nagCreateTab">CREATE ACCOUNT</button></div><label class="nag-label">PLAYER NAME</label><input class="nag-input" id="nagName" maxlength="20" autocomplete="username" value="${oldName.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}"><label class="nag-label">PASSWORD</label><input class="nag-input" id="nagPass" type="password" maxlength="128" autocomplete="${mode==='create'?'new-password':'current-password'}" placeholder="At least 8 characters">${mode==='create'?`<label class="nag-label">CONFIRM PASSWORD</label><input class="nag-input" id="nagConfirm" type="password" maxlength="128" autocomplete="new-password" placeholder="Type password again"><div id="nagOwnerWrap"></div>${hasLocalProgress()?'<label class="nag-check"><input type="checkbox" id="nagImport" checked><span><b>Import progress already on this device</b><br>Your current coins, squishies, worlds, Forge items and Adventure progress will become this account’s starting save.</span></label>':''}`:''}<button class="nag-btn" id="nagSubmit">${mode==='create'?'CREATE ACCOUNT & PLAY':'LOG IN & PLAY'}</button><div class="nag-error" id="nagError"></div><div class="nag-foot">Passwords are never stored as plain text. Keep your password somewhere safe; there is no email attached to these username-only accounts.</div></div>`;
    document.getElementById('nagLoginTab').onclick=()=>{if(!busy){mode='login';renderForm()}};
    document.getElementById('nagCreateTab').onclick=()=>{if(!busy){mode='create';renderForm()}};
    document.getElementById('nagSubmit').onclick=submit;
    const updateOwnerField=()=>{const w=document.getElementById('nagOwnerWrap');if(!w)return;const own=String(document.getElementById('nagName')?.value||'').trim().toLowerCase()==='attila';w.innerHTML=own?'<label class="nag-label">ATTILA ADMIN PASSWORD</label><input class="nag-input" id="nagOwnerPass" type="password" maxlength="128" autocomplete="current-password" placeholder="Required to reserve owner account"><div class="nag-check"><span>👑 The Attila username is reserved for the game owner and requires the existing admin password when the account is first created.</span></div>':'';document.getElementById('nagOwnerPass')?.addEventListener('keydown',e=>{if(e.key==='Enter')submit()})};
    document.getElementById('nagName')?.addEventListener('input',updateOwnerField);updateOwnerField();
    for(const id of ['nagName','nagPass','nagConfirm'])document.getElementById(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')submit()});
  }
  function errorText(code,result){
    if(code==='NAME_TAKEN')return 'That player name already has an account. Choose Log In or use another name.';
    if(code==='NAME_INVALID')return 'Use 2–20 characters: letters, numbers, spaces, _ or -.';
    if(code==='PASSWORD_INVALID')return 'Password must be at least 8 characters.';
    if(code==='INVALID_LOGIN')return 'Player name or password is incorrect.';
    if(code==='LOCKED')return 'Too many incorrect attempts. This name is temporarily locked for about 10 minutes.';
    if(code==='SAVE_TOO_LARGE')return 'Your current save is too large to import.';
    if(code==='OWNER_RESERVED')return 'Attila is reserved for the game owner. Create it using the Attila admin password.';
    if(code==='OWNER_AUTH_REQUIRED')return 'The Attila admin password is incorrect.';
    return result?.error?'Account error: '+result.error:'Could not connect to the account server.';
  }
  async function submit(){
    if(busy)return;
    const name=String(document.getElementById('nagName')?.value||'').replace(/\s+/g,' ').trim();
    const password=String(document.getElementById('nagPass')?.value||'');
    if(name.length<2)return setError('Enter a player name with at least 2 characters.');
    if(password.length<8)return setError('Password must be at least 8 characters.');
    if(mode==='create'&&password!==String(document.getElementById('nagConfirm')?.value||''))return setError('The passwords do not match.');
    busy=true;const btn=document.getElementById('nagSubmit');if(btn){btn.disabled=true;btn.textContent='CONNECTING…'}setError('');
    try{
      let result;
      if(mode==='create'){
        const useLocal=!!document.getElementById('nagImport')?.checked;
        const initial=useLocal?localEnvelope():null;
        if(name.toLowerCase()==='attila'){const adminPassword=String(document.getElementById('nagOwnerPass')?.value||'');if(!adminPassword){setError('Enter the Attila admin password to create the owner account.');return}result=await rpc('needoh_account_create_owner',{p_player_name:name,p_password:password,p_initial_save:initial,p_admin_password:adminPassword});}
        else result=await rpc('needoh_account_create',{p_player_name:name,p_password:password,p_initial_save:initial});
      }else result=await rpc('needoh_account_login',{p_player_name:name,p_password:password});
      if(!result?.ok){setError(errorText(result?.error,result));return}
      storeSession(result.session_token,result.player_name);
      startGame(result);
    }catch(e){console.warn('Needoh account request failed',e);setError('Could not connect. Check your internet connection and try again.')}finally{busy=false;const b=document.getElementById('nagSubmit');if(b){b.disabled=false;b.textContent=mode==='create'?'CREATE ACCOUNT & PLAY':'LOG IN & PLAY'}}
  }
  function renderLoading(){gate.innerHTML='<div class="nag-card"><div class="nag-loading"><div class="nag-spinner"></div><b>Loading your Needoh account…</b></div></div>'}
  async function resume(){
    const token=localStorage.getItem(SESSION_KEY);
    if(!token){renderForm();return}
    renderLoading();
    try{
      const r=await rpc('needoh_account_resume',{p_session_token:token});
      if(r?.ok){startGame(r);return}
    }catch(e){console.warn('Needoh account resume failed',e)}
    clearSession();
    mode='login';renderForm();setError('Your saved login expired. Log in again to continue.');
  }
  async function doLogout(){
    const token=localStorage.getItem(SESSION_KEY);
    try{if(token)await rpc('needoh_account_logout',{p_session_token:token})}catch(_){}
    clearSession();clearGameLocal();
    try{sessionStorage.removeItem('needohAttilaAdminUnlockedV1')}catch(_){}
    location.reload();
  }
  window.addEventListener('message',e=>{
    if(e.source!==game.contentWindow||!e.data||typeof e.data!=='object')return;
    if(e.data.type==='needohLogout')doLogout();
    if(e.data.type==='needohSessionExpired'){
      clearSession();
      location.reload();
    }
  });
  window.__needohAccountGate={resume,logout:doLogout};
  window.__needohAccountGateLoaded=true;
  resume();
})();