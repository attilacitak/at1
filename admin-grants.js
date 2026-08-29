(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const MAX_DURATION_SECONDS=7*24*60*60;
  const baseIsAdmin=isAdmin;
  let delegatedAdminActive=false;
  let delegatedAdminEndsAt=0;
  let delegatedGrantId='';
  let checking=false;

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();
    return t?JSON.parse(t):null;
  }

  function keyFor(name=playerName()){
    return cleanPlayerName(name).toLowerCase();
  }
  function isPermanentAdmin(){
    return keyFor()==='attila';
  }
  function delegatedLeft(){
    return Math.max(0,delegatedAdminEndsAt-Date.now());
  }
  function formatTime(ms){
    const total=Math.ceil(Math.max(0,ms)/1000);
    if(total>=86400){
      const d=Math.floor(total/86400),h=Math.floor((total%86400)/3600);
      return `${d}d ${h}h`;
    }
    if(total>=3600){
      const h=Math.floor(total/3600),m=Math.floor((total%3600)/60);
      return `${h}h ${m}m`;
    }
    const m=Math.floor(total/60),s=total%60;
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  isAdmin=function(){
    return baseIsAdmin() || (delegatedAdminActive && delegatedLeft()>0);
  };

  function updateAdminButton(){
    const btn=$('adminBtn');
    if(!btn)return;
    if(isPermanentAdmin()){
      btn.style.display='inline-block';
      btn.textContent='🛡️ Admin';
      return;
    }
    if(isAdmin()){
      btn.style.display='inline-block';
      btn.textContent=`🛡️ Admin · ${formatTime(delegatedLeft())}`;
    }else{
      btn.style.display='none';
      btn.textContent='🛡️ Admin';
    }
  }

  function applyGrant(row){
    const wasActive=delegatedAdminActive && delegatedLeft()>0;
    const now=Date.now();
    const start=Date.parse(row?.starts_at||0);
    const end=Date.parse(row?.ends_at||0);
    const active=!!row && !row.revoked && start<=now && end>now;
    delegatedAdminActive=active;
    delegatedAdminEndsAt=active?end:0;
    delegatedGrantId=active?String(row.id||''):'';
    updateAdminButton();
    if(active&&!wasActive){
      toast(`🛡️ Timed admin granted for ${formatTime(end-now)}`);
      try{render()}catch(e){}
    }else if(!active&&wasActive){
      const title=$('hubTitle');
      if(title&&/admin/i.test(title.textContent||''))try{closeHub()}catch(e){}
      toast('⌛ Timed admin expired');
      try{render()}catch(e){}
    }
  }

  async function checkMyGrant(){
    if(checking||isPermanentAdmin()||playerName()==='Player'){
      updateAdminButton();
      return;
    }
    checking=true;
    try{
      const key=encodeURIComponent(keyFor());
      const rows=await api(`needoh_admin_grants?select=id,target_key,target_name,starts_at,ends_at,revoked,created_at&target_key=eq.${key}&revoked=eq.false&order=ends_at.desc&limit=20`);
      const now=Date.now();
      const active=(rows||[]).find(r=>Date.parse(r.starts_at||0)<=now&&Date.parse(r.ends_at||0)>now&&!r.revoked);
      applyGrant(active||null);
    }catch(e){
      console.warn('Timed admin check failed',e);
      updateAdminButton();
    }finally{
      checking=false;
    }
  }

  function durationSeconds(){
    const value=Math.max(1,Number($('timedAdminDuration')?.value)||10);
    const unit=$('timedAdminUnit')?.value||'minutes';
    const scale=unit==='days'?86400:unit==='hours'?3600:60;
    return Math.max(60,Math.min(MAX_DURATION_SECONDS,Math.floor(value*scale)));
  }

  async function renderGrantManager(){
    if(!isPermanentAdmin())return;
    const host=$('hubContent');
    if(!host||document.getElementById('timedAdminCard'))return;
    try{
      const [players,grants]=await Promise.all([
        api('needoh_players?select=player_key,display_name,coins,world&order=display_name.asc&limit=200'),
        api('needoh_admin_grants?select=id,target_key,target_name,starts_at,ends_at,revoked,created_at&revoked=eq.false&order=ends_at.desc&limit=100')
      ]);
      const others=(players||[]).filter(p=>p.player_key!=='attila');
      const options=others.map(p=>`<option value="${escapeHtml(p.player_key)}">${escapeHtml(p.display_name)}</option>`).join('');
      const now=Date.now();
      const active=(grants||[]).filter(g=>!g.revoked&&Date.parse(g.starts_at||0)<=now&&Date.parse(g.ends_at||0)>now);
      const activeHtml=active.length?active.map(g=>`<div class="card-row" style="margin-top:8px"><div><b>🛡️ ${escapeHtml(g.target_name)}</b><div class="small">Ends in ${formatTime(Date.parse(g.ends_at)-now)}</div></div><button class="btn danger" data-revoke-admin="${escapeHtml(g.id)}">Revoke Now</button></div>`).join(''):'<div class="small">No temporary admins active.</div>';

      const card=document.createElement('div');
      card.id='timedAdminCard';
      card.className='card';
      card.style.marginTop='14px';
      card.innerHTML=`<h3>⏱️ Give Timed Admin</h3><p class="small">Give another player full game-admin controls temporarily. Only Attila can give or revoke timed admin.</p><label class="small">Player</label><select class="field" id="timedAdminPlayer">${options||'<option value="">No other online players yet</option>'}</select><div class="grid2"><div><label class="small">Duration</label><input class="field" id="timedAdminDuration" type="number" min="1" value="10"></div><div><label class="small">Unit</label><select class="field" id="timedAdminUnit"><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option></select></div></div><button class="btn admin" id="giveTimedAdminBtn">🛡️ GIVE TIMED ADMIN</button><div style="margin-top:14px"><h3 style="font-size:15px">Active Temporary Admins</h3>${activeHtml}</div><p class="small" style="margin-top:10px">Maximum duration: 7 days.</p>`;
      host.appendChild(card);

      $('giveTimedAdminBtn').onclick=async()=>{
        const target=$('timedAdminPlayer').value;
        if(!target)return toast('Choose a player');
        const p=others.find(x=>x.player_key===target);
        const seconds=durationSeconds();
        const start=new Date();
        const end=new Date(start.getTime()+seconds*1000);
        try{
          await api(`needoh_admin_grants?target_key=eq.${encodeURIComponent(target)}&revoked=eq.false`,{
            method:'PATCH',
            headers:{Prefer:'return=minimal'},
            body:JSON.stringify({revoked:true,revoked_at:new Date().toISOString()})
          });
          await api('needoh_admin_grants',{
            method:'POST',
            headers:{Prefer:'return=minimal'},
            body:JSON.stringify([{
              target_key:target,
              target_name:p?.display_name||target,
              granted_by:'Attila',
              starts_at:start.toISOString(),
              ends_at:end.toISOString()
            }])
          });
          toast(`🛡️ ${p?.display_name||target} has admin for ${formatTime(seconds*1000)}`);
          showAdmin();
        }catch(e){
          console.warn('Could not grant timed admin',e);
          toast('Could not give timed admin');
        }
      };

      document.querySelectorAll('[data-revoke-admin]').forEach(btn=>{
        btn.onclick=async()=>{
          const id=btn.dataset.revokeAdmin;
          try{
            await api(`needoh_admin_grants?id=eq.${encodeURIComponent(id)}`,{
              method:'PATCH',
              headers:{Prefer:'return=minimal'},
              body:JSON.stringify({revoked:true,revoked_at:new Date().toISOString()})
            });
            toast('🛡️ Temporary admin revoked');
            showAdmin();
          }catch(e){
            console.warn('Could not revoke timed admin',e);
            toast('Could not revoke admin');
          }
        };
      });
    }catch(e){
      console.warn('Could not load timed admin manager',e);
    }
  }

  const previousShowAdmin=showAdmin;
  showAdmin=async function(){
    if(!isAdmin())return toast('Admin access required');
    await previousShowAdmin();
    if(isPermanentAdmin())await renderGrantManager();
  };

  $('adminBtn').onclick=showAdmin;
  checkMyGrant();
  setInterval(checkMyGrant,2000);
  setInterval(()=>{
    if(delegatedAdminActive&&delegatedLeft()<=0)applyGrant(null);
    else updateAdminButton();
  },1000);
})();