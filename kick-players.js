(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const ownerAdmin=()=>playerName().toLowerCase()==='attila';
  const keyFor=(name=playerName())=>cleanPlayerName(name).toLowerCase();
  let checking=false;
  let activeKickId='';

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Kick error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();
    return t?JSON.parse(t):null;
  }

  function seenStorageKey(){return `needohSeenKick:${keyFor()}`}
  function seenKickId(){return localStorage.getItem(seenStorageKey())||''}
  function markKickSeen(id){if(id)localStorage.setItem(seenStorageKey(),String(id))}

  function showKickScreen(kick){
    if(!kick?.id)return;
    activeKickId=String(kick.id);
    try{if(typeof stopHold==='function')stopHold()}catch(e){}
    try{closeHub()}catch(e){}
    document.getElementById('needohKickScreen')?.remove();

    const overlay=document.createElement('div');
    overlay.id='needohKickScreen';
    Object.assign(overlay.style,{
      position:'fixed',inset:'0',zIndex:'2147483647',background:'radial-gradient(circle at 50% 25%,#53152b 0,#210a15 46%,#08060a 100%)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',boxSizing:'border-box',color:'#fff',textAlign:'center'
    });

    const card=document.createElement('div');
    Object.assign(card.style,{
      width:'min(760px,100%)',padding:'34px 26px',borderRadius:'28px',background:'rgba(0,0,0,.42)',
      border:'2px solid rgba(255,88,120,.65)',boxShadow:'0 25px 100px rgba(0,0,0,.65),0 0 60px rgba(255,45,90,.25)'
    });

    const boot=document.createElement('div');
    boot.textContent='👢';
    Object.assign(boot.style,{fontSize:'76px',marginBottom:'8px'});

    const title=document.createElement('div');
    title.textContent='YOU HAVE BEEN KICKED';
    Object.assign(title.style,{fontSize:'clamp(30px,7vw,64px)',fontWeight:'1000',letterSpacing:'1px',color:'#ff708c',textShadow:'0 0 28px rgba(255,80,120,.45)'});

    const by=document.createElement('div');
    by.textContent='You have been kicked by Attila for:';
    Object.assign(by.style,{fontSize:'clamp(17px,3vw,25px)',fontWeight:'850',marginTop:'18px',color:'#ffd6df'});

    const reason=document.createElement('div');
    reason.textContent=`“${String(kick.reason||'No reason provided')}”`;
    Object.assign(reason.style,{fontSize:'clamp(22px,4vw,38px)',lineHeight:'1.25',fontWeight:'1000',margin:'18px auto 24px',maxWidth:'660px',whiteSpace:'pre-wrap',wordBreak:'break-word'});

    const note=document.createElement('div');
    note.textContent='This is only a kick — you are not banned.';
    Object.assign(note.style,{fontSize:'14px',color:'#d8c7ce',marginBottom:'18px'});

    const btn=document.createElement('button');
    btn.textContent='↻ REJOIN GAME';
    Object.assign(btn.style,{border:'0',borderRadius:'16px',padding:'15px 26px',fontSize:'19px',fontWeight:'1000',cursor:'pointer',background:'linear-gradient(135deg,#ff7a94,#ffb449)',color:'#2a1016',boxShadow:'0 10px 32px rgba(0,0,0,.4)'});
    btn.onclick=()=>{markKickSeen(activeKickId);location.reload()};

    card.append(boot,title,by,reason,note,btn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  async function checkKick(){
    if(checking||playerName()==='Player'||ownerAdmin())return;
    checking=true;
    try{
      const key=encodeURIComponent(keyFor());
      const rows=await api(`needoh_kicks?select=id,target_key,target_name,admin_name,reason,created_at&target_key=eq.${key}&order=created_at.desc&limit=1`);
      const latest=rows?.[0];
      if(latest&&String(latest.id)!==seenKickId()&&String(latest.id)!==activeKickId)showKickScreen(latest);
    }catch(e){
      console.warn('Kick check failed',e);
    }finally{checking=false}
  }

  const previousShowAdmin=showAdmin;
  showAdmin=async function(){
    await previousShowAdmin();
    if(!ownerAdmin())return;
    const host=$('hubContent');
    if(!host||document.getElementById('kickPlayerBtn'))return;
    try{
      const players=await api('needoh_players?select=player_key,display_name,updated_at&order=updated_at.desc&limit=200');
      const others=(players||[]).filter(p=>p.player_key!=='attila');
      const options=others.map(p=>`<option value="${escapeHtml(p.player_key)}">${escapeHtml(p.display_name)}</option>`).join('');
      const card=document.createElement('div');
      card.className='card danger-box';
      card.style.marginTop='14px';
      card.innerHTML=`<h3>👢 Kick Player</h3><p class="small">Kick someone out of their current game session. They are NOT banned and can rejoin immediately.</p><label class="small">Player</label><select class="field" id="kickPlayerSelect">${options||'<option value="">No other players found</option>'}</select><label class="small">Reason</label><textarea class="field" id="kickReason" maxlength="200" placeholder="Type the reason they are being kicked..."></textarea><button class="btn danger" id="kickPlayerBtn">👢 KICK PLAYER</button>`;
      host.appendChild(card);

      $('kickPlayerBtn').onclick=async()=>{
        const target=$('kickPlayerSelect').value;
        const reason=String($('kickReason').value||'').trim().slice(0,200);
        if(!target)return toast('Choose a player');
        if(!reason)return toast('Enter a kick reason');
        const p=others.find(x=>x.player_key===target);
        if(!confirm(`Kick ${p?.display_name||target} for “${reason}”?`))return;
        try{
          await api('needoh_kicks',{
            method:'POST',headers:{Prefer:'return=minimal'},
            body:JSON.stringify([{target_key:target,target_name:p?.display_name||target,admin_name:'Attila',reason}])
          });
          toast(`👢 ${p?.display_name||target} was kicked`);
          $('kickReason').value='';
        }catch(e){
          console.warn('Could not kick player',e);
          toast('Could not kick player');
        }
      };
    }catch(e){
      console.warn('Could not load kick controls',e);
    }
  };

  $('adminBtn').onclick=showAdmin;
  checkKick();
  setInterval(checkKick,2000);
  window.__needohKickPlayersLoaded=true;
})();