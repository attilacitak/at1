(()=>{
if(window.__needohSafeCloudLoaded)return;
const SB='https://xawvgrktcqbtmcbpuizg.supabase.co';
const KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
const H={apikey:KEY,'Content-Type':'application/json'};
const SESSION_KEY='needohAccountSessionV1',ACCOUNT_NAME_KEY='needohAccountNameV1',PLAYER_KEY='needohPlayerName';
const EXTRA_KEYS=['needohAdventureV4','needohAdventureV3','needohAdventureFinalV1','needohAdventureProgressFixV2'];
let timer=0,busy=false,pending=false,lastSaved=0,lastError='',version=0,disconnected=false;
const token=localStorage.getItem(SESSION_KEY)||'';
const accountName=String(localStorage.getItem(ACCOUNT_NAME_KEY)||localStorage.getItem(PLAYER_KEY)||'').trim();
if(!token||!accountName)return;
localStorage.setItem(PLAYER_KEY,accountName);
function readJson(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(_){return null}}
function envelope(){const extras={};for(const k of EXTRA_KEYS){const v=readJson(k);if(v!==null)extras[k]=v}return{__needohCloudVersion:2,state,extras}}
async function rpc(name,body,timeout=7000){const c=new AbortController(),tm=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(`${SB}/rest/v1/rpc/${name}`,{method:'POST',headers:H,body:JSON.stringify(body),signal:c.signal});const text=await r.text();if(!r.ok)throw new Error(text||`Cloud error ${r.status}`);return text?JSON.parse(text):null}finally{clearTimeout(tm)}}
function schedule(ms=3500){clearTimeout(timer);if(!disconnected)timer=setTimeout(()=>cloudSave(),ms)}
async function cloudSave(force=false){clearTimeout(timer);if(disconnected||!token)return false;if(busy){pending=true;return false}busy=true;pending=false;try{const r=await rpc('needoh_account_save',{p_session_token:token,p_save_data:envelope()});if(!r?.ok){if(r?.error==='SESSION_INVALID'){disconnected=true;lastError='Session expired — local save is still safe';}else lastError=r?.error||'Cloud save failed';return false}version=Number(r.save_version)||version;lastSaved=Date.now();lastError='';return true}catch(e){lastError=e?.name==='AbortError'?'Cloud save timed out — local save is safe':'Offline — local save is safe';return false}finally{busy=false;if(pending&&!disconnected)schedule(1500)}}
if(typeof save==='function'){const originalSave=save;save=function(silent=false){const out=originalSave(silent);schedule();return out}}
if(typeof savePlayerName==='function'){savePlayerName=function(){localStorage.setItem(PLAYER_KEY,accountName);try{render()}catch(_){}}}
function timeText(){if(disconnected)return lastError||'Cloud disconnected';if(lastError)return lastError;if(!lastSaved)return'Waiting for first cloud save…';const s=Math.max(0,Math.floor((Date.now()-lastSaved)/1000));return s<5?'Cloud saved just now':`Cloud saved ${s}s ago`}
function showAccount(){if(typeof openHub!=='function')return;openHub('☁️ Needoh Account',`<div class="notice"><b>Signed in as ${typeof escapeHtml==='function'?escapeHtml(accountName):accountName}</b><br>Your progress is saved to this account.</div><div class="card"><h3>Cloud Save</h3><p id="safeCloudStatus">${timeText()}</p><p class="small">Cloud save version: ${version||'new account'}</p><button class="btn primary" id="safeSaveNow">☁️ SAVE TO CLOUD NOW</button></div><div class="card danger-box"><h3>Account</h3><p class="small">Log out to switch players. The game will return to the account screen.</p><button class="btn danger" id="safeLogout">🚪 LOG OUT</button></div>`);const s=document.getElementById('safeSaveNow');if(s)s.onclick=async()=>{s.disabled=true;s.textContent='SAVING…';const ok=await cloudSave(true);s.disabled=false;s.textContent=ok?'✅ SAVED':'☁️ TRY AGAIN';const st=document.getElementById('safeCloudStatus');if(st)st.textContent=timeText()};const l=document.getElementById('safeLogout');if(l)l.onclick=logout}
async function logout(){try{await cloudSave(true)}catch(_){}try{await rpc('needoh_account_logout',{p_session_token:token},5000)}catch(_){}localStorage.removeItem(SESSION_KEY);localStorage.removeItem(ACCOUNT_NAME_KEY);try{sessionStorage.removeItem('needohAttilaAdminUnlockedV1')}catch(_){}location.replace('/account-login.html?v=2&logout=1')}
function fixButton(){localStorage.setItem(PLAYER_KEY,accountName);const b=document.getElementById('changeNameBtn');if(b){b.textContent='☁️ Account';b.title='Cloud account and logout';b.onclick=showAccount}}
fixButton();new MutationObserver(fixButton).observe(document.body,{childList:true,subtree:true});setInterval(fixButton,2500);setInterval(()=>cloudSave(),45000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')cloudSave(true)});setTimeout(()=>cloudSave(true),3000);window.__needohCloudSave=cloudSave;window.__needohShowAccount=showAccount;window.__needohSafeCloudLoaded=true;
})();