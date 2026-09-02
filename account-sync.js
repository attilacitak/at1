(()=>{
  if(window.__needohAccountSyncLoaded)return;
  const SB='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const H={apikey:KEY,'Content-Type':'application/json'};
  const PLAYER_KEY='needohPlayerName';
  const SESSION_KEY='needohAccountSessionV1';
  const ACCOUNT_NAME_KEY='needohAccountNameV1';
  const EXTRA_KEYS=['needohAdventureV4','needohAdventureV3','needohAdventureFinalV1','needohAdventureProgressFixV2'];
  let timer=0,busy=false,pending=false,lastSaved=0,lastError='',version=0;
  const token=localStorage.getItem(SESSION_KEY)||'';
  const accountName=String(localStorage.getItem(ACCOUNT_NAME_KEY)||localStorage.getItem(PLAYER_KEY)||'Player').trim();
  if(accountName)localStorage.setItem(PLAYER_KEY,accountName);

  function readJson(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(_){return null}}
  function envelope(){
    const extras={};
    for(const k of EXTRA_KEYS){const v=readJson(k);if(v!==null)extras[k]=v}
    return {__needohCloudVersion:1,state,extras};
  }
  async function rpc(name,body,keepalive=false){
    const r=await fetch(`${SB}/rest/v1/rpc/${name}`,{method:'POST',headers:H,body:JSON.stringify(body),keepalive});
    const text=await r.text();
    if(!r.ok)throw new Error(text||`Cloud save error ${r.status}`);
    return text?JSON.parse(text):null;
  }
  function expired(){try{parent.postMessage({type:'needohSessionExpired'},location.origin)}catch(_){} }
  async function cloudSave(force=false){
    clearTimeout(timer);
    if(!token)return false;
    if(busy){pending=true;return false}
    busy=true;pending=false;
    try{
      const r=await rpc('needoh_account_save',{p_session_token:token,p_save_data:envelope()},false);
      if(!r?.ok){if(r?.error==='SESSION_INVALID')expired();else lastError=r?.error||'Save failed';return false}
      version=Number(r.save_version)||version;lastSaved=Date.now();lastError='';return true;
    }catch(e){lastError='Offline — local progress is still saved';console.warn('Needoh cloud save failed',e);return false}
    finally{busy=false;if(pending)schedule(250)}
  }
  function schedule(ms=900){clearTimeout(timer);timer=setTimeout(()=>cloudSave(),ms)}

  if(typeof save==='function'){
    const previousSave=save;
    save=function(silent=false){const out=previousSave(silent);schedule();return out};
  }
  if(typeof savePlayerName==='function'){
    savePlayerName=function(){localStorage.setItem(PLAYER_KEY,accountName);try{render()}catch(_){}};
  }
  function timeText(){if(lastError)return lastError;if(!lastSaved)return'Waiting for first cloud save…';const s=Math.max(0,Math.floor((Date.now()-lastSaved)/1000));return s<5?'Cloud saved just now':`Cloud saved ${s}s ago`}
  function showAccount(){
    if(typeof openHub!=='function')return;
    openHub('☁️ Needoh Account',`<div class="notice"><b>Signed in as ${typeof escapeHtml==='function'?escapeHtml(accountName):accountName}</b><br>Your game progress is saved to this account and can be restored on another computer.</div><div class="card"><h3>Cloud Save</h3><p id="accountCloudStatus">${timeText()}</p><p class="small">Cloud save version: ${version||'new account'}</p><button class="btn primary" id="accountSaveNow">☁️ SAVE TO CLOUD NOW</button></div><div class="card danger-box"><h3>Account</h3><p class="small">Logging out removes this account’s local copy from this browser. Your cloud progress stays safe.</p><button class="btn danger" id="accountLogout">🚪 LOG OUT</button></div>`);
    const s=document.getElementById('accountSaveNow');if(s)s.onclick=async()=>{s.disabled=true;s.textContent='SAVING…';const ok=await cloudSave(true);s.disabled=false;s.textContent=ok?'✅ SAVED':'☁️ TRY AGAIN';const st=document.getElementById('accountCloudStatus');if(st)st.textContent=timeText()};
    const l=document.getElementById('accountLogout');if(l)l.onclick=async()=>{l.disabled=true;l.textContent='SAVING…';await cloudSave(true);try{parent.postMessage({type:'needohLogout'},location.origin)}catch(_){}};
  }
  function fixAccountButton(){
    if(accountName&&localStorage.getItem(PLAYER_KEY)!==accountName)localStorage.setItem(PLAYER_KEY,accountName);
    const b=document.getElementById('changeNameBtn');
    if(b){b.textContent='☁️ Account';b.title='Cloud account and logout';b.onclick=showAccount}
  }
  fixAccountButton();
  new MutationObserver(fixAccountButton).observe(document.body,{childList:true,subtree:true});
  setInterval(()=>{fixAccountButton();cloudSave()},15000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')cloudSave(true)});
  setTimeout(()=>cloudSave(true),1800);
  window.__needohCloudSave=cloudSave;
  window.__needohShowAccount=showAccount;
  window.__needohAccountSyncLoaded=true;
})();