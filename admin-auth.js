(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const SESSION_KEY='needohAttilaAdminUnlockedV1';
  let ownerUnlocked=sessionStorage.getItem(SESSION_KEY)==='1';
  let configuredCache=null;
  let authBusy=false;

  async function rpc(name,body={}){
    const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers,body:JSON.stringify(body)});
    const text=await r.text();
    if(!r.ok)throw new Error(text||`Admin auth error ${r.status}`);
    return text?JSON.parse(text):null;
  }

  function ownerName(){return playerName().toLowerCase()==='attila'}
  function ownerAuthorized(){return ownerName()&&ownerUnlocked}
  function lockOwner(){
    ownerUnlocked=false;
    sessionStorage.removeItem(SESSION_KEY);
    updateOwnerButton();
  }
  function unlockOwner(){
    ownerUnlocked=true;
    sessionStorage.setItem(SESSION_KEY,'1');
    updateOwnerButton();
  }
  window.__needohIsOwnerAdmin=ownerAuthorized;
  window.__needohLockOwnerAdmin=lockOwner;

  const delegatedAwareIsAdmin=isAdmin;
  isAdmin=function(){
    if(ownerName())return ownerAuthorized();
    return delegatedAwareIsAdmin();
  };

  function updateOwnerButton(){
    const btn=$('adminBtn');
    if(!btn||!ownerName())return;
    btn.style.display='inline-block';
    btn.textContent=ownerAuthorized()?'🛡️ Admin':'🔒 Admin Login';
  }

  async function passwordConfigured(force=false){
    if(configuredCache!==null&&!force)return configuredCache;
    configuredCache=!!(await rpc('needoh_admin_password_status'));
    return configuredCache;
  }

  function authNotice(text){
    const el=$('adminAuthNotice');
    if(el){el.textContent=text;el.style.display='block'}
  }

  async function showAuthScreen(){
    if(!ownerName())return toast('Use the player name Attila for owner admin');
    let configured;
    try{configured=await passwordConfigured(true)}catch(e){console.warn('Admin password status failed',e);return toast('Could not check admin password')}

    if(!configured){
      openHub('🔐 Create Attila Admin Password',`<div class="notice">Set the password once here. After this, any computer using the player name <b>Attila</b> must enter this password to open the owner Admin panel.</div><div class="card"><h3>Create Admin Password</h3><label class="small">New password</label><input class="field" id="adminNewPassword" type="password" maxlength="128" autocomplete="new-password" placeholder="At least 6 characters"><label class="small">Confirm password</label><input class="field" id="adminConfirmPassword" type="password" maxlength="128" autocomplete="new-password" placeholder="Type it again"><button class="btn admin" id="setAdminPasswordBtn">🔐 SET ADMIN PASSWORD</button><div id="adminAuthNotice" class="small" style="display:none;margin-top:10px;color:#ff9bad"></div></div><p class="small" style="margin-top:12px">The password itself is not stored in the game or sent back to browsers; Supabase stores a salted password hash.</p>`);
      $('setAdminPasswordBtn').onclick=async()=>{
        if(authBusy)return;
        const p=String($('adminNewPassword').value||'');
        const c=String($('adminConfirmPassword').value||'');
        if(p.length<6)return authNotice('Password must be at least 6 characters.');
        if(p!==c)return authNotice('The two passwords do not match.');
        authBusy=true;$('setAdminPasswordBtn').disabled=true;
        try{
          const ok=await rpc('needoh_admin_set_password',{p_new_password:p,p_old_password:null});
          if(!ok)return authNotice('Could not set the password. If one was already created on another device, reload and log in instead.');
          configuredCache=true;unlockOwner();toast('🔐 Attila admin password created');closeHub();try{render()}catch(e){}setTimeout(()=>showAdmin(),0);
        }catch(e){console.warn('Set admin password failed',e);authNotice('Could not set the admin password.');}
        finally{authBusy=false;const b=$('setAdminPasswordBtn');if(b)b.disabled=false}
      };
      return;
    }

    openHub('🔒 Attila Admin Login',`<div class="notice">This computer needs the Attila admin password before owner controls can open.</div><div class="card"><h3>Enter Admin Password</h3><input class="field" id="adminLoginPassword" type="password" maxlength="128" autocomplete="current-password" placeholder="Admin password"><button class="btn admin" id="adminLoginBtn">🔓 UNLOCK ADMIN</button><div id="adminAuthNotice" class="small" style="display:none;margin-top:10px;color:#ff9bad"></div></div><p class="small" style="margin-top:12px">The unlock lasts only for this browser tab/session. A different computer must enter the password too.</p>`);
    const login=async()=>{
      if(authBusy)return;
      const p=String($('adminLoginPassword').value||'');
      if(!p)return authNotice('Enter the admin password.');
      authBusy=true;$('adminLoginBtn').disabled=true;
      try{
        const ok=await rpc('needoh_admin_verify_password',{p_password:p});
        if(!ok)return authNotice('Wrong password.');
        unlockOwner();toast('🔓 Attila admin unlocked');closeHub();try{render()}catch(e){}setTimeout(()=>showAdmin(),0);
      }catch(e){console.warn('Admin login failed',e);authNotice('Could not verify the password.');}
      finally{authBusy=false;const b=$('adminLoginBtn');if(b)b.disabled=false}
    };
    $('adminLoginBtn').onclick=login;
    $('adminLoginPassword').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
    setTimeout(()=>$('adminLoginPassword')?.focus(),50);
  }
  window.__needohPromptAdminLogin=showAuthScreen;

  function appendPasswordManager(){
    if(!ownerAuthorized())return;
    const host=$('hubContent');
    if(!host||document.getElementById('adminPasswordManager'))return;
    const card=document.createElement('div');
    card.id='adminPasswordManager';
    card.className='card';
    card.style.marginTop='14px';
    card.innerHTML=`<h3>🔐 Attila Admin Password</h3><p class="small">Use the same password to unlock the Attila owner panel on another computer.</p><details><summary style="cursor:pointer;font-weight:900">Change password</summary><label class="small">Current password</label><input class="field" id="adminOldPassword" type="password" maxlength="128" autocomplete="current-password"><label class="small">New password</label><input class="field" id="adminChangedPassword" type="password" maxlength="128" autocomplete="new-password"><label class="small">Confirm new password</label><input class="field" id="adminChangedConfirm" type="password" maxlength="128" autocomplete="new-password"><button class="btn admin" id="changeAdminPasswordBtn">CHANGE PASSWORD</button><div id="adminPasswordChangeNotice" class="small" style="margin-top:8px"></div></details><button class="btn danger" id="lockAdminSessionBtn" style="margin-top:12px">🔒 LOCK ADMIN ON THIS COMPUTER</button>`;
    host.appendChild(card);
    $('changeAdminPasswordBtn').onclick=async()=>{
      const oldP=String($('adminOldPassword').value||''),newP=String($('adminChangedPassword').value||''),confirmP=String($('adminChangedConfirm').value||'');
      const notice=$('adminPasswordChangeNotice');
      if(newP.length<6){notice.textContent='New password must be at least 6 characters.';return}
      if(newP!==confirmP){notice.textContent='New passwords do not match.';return}
      $('changeAdminPasswordBtn').disabled=true;
      try{
        const ok=await rpc('needoh_admin_set_password',{p_new_password:newP,p_old_password:oldP});
        notice.textContent=ok?'✅ Password changed. Other computers must use the new password.':'❌ Current password is wrong.';
        if(ok)configuredCache=true;
      }catch(e){console.warn('Change password failed',e);notice.textContent='❌ Could not change password.'}
      finally{$('changeAdminPasswordBtn').disabled=false}
    };
    $('lockAdminSessionBtn').onclick=()=>{lockOwner();closeHub();toast('🔒 Attila admin locked on this computer')};
  }

  const underlyingShowAdmin=showAdmin;
  showAdmin=async function(){
    if(ownerName()&&!ownerAuthorized())return showAuthScreen();
    const result=await underlyingShowAdmin();
    if(ownerAuthorized())appendPasswordManager();
    return result;
  };

  const underlyingRender=render;
  render=function(){const v=underlyingRender();updateOwnerButton();return v};

  const underlyingSavePlayerName=savePlayerName;
  savePlayerName=function(){
    const before=playerName().toLowerCase();
    const v=underlyingSavePlayerName();
    const after=playerName().toLowerCase();
    if(before!==after)lockOwner();
    updateOwnerButton();
    return v;
  };

  $('adminBtn').onclick=showAdmin;
  updateOwnerButton();
  setInterval(updateOwnerButton,350);
  window.__needohAdminAuthLoaded=true;
})();