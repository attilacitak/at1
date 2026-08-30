(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const ATTILA={
    name:'ATTILA',icon:'👑',
    color:'linear-gradient(135deg,#080808 0%,#3b2b00 34%,#ffd84d 58%,#6b4c00 76%,#111 100%)',
    glow:'#ffd84d',shape:'42% 58% 45% 55% / 55% 40% 60% 45%',
    mult:1e15,chance:0,min:0,max:0,sound:1080,limited:true,ownerOnly:true
  };
  const keyFor=(name=playerName())=>cleanPlayerName(name).toLowerCase();
  const ownerName=()=>keyFor()==='attila';
  const ownerAuthorized=()=>!!window.__needohIsOwnerAdmin?.();
  const temporaryAdmin=()=>isAdmin()&&!ownerAuthorized()&&!ownerName();
  let checkingGift=false;

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();return t?JSON.parse(t):null;
  }

  const previousAllRarities=allRarities;
  allRarities=function(){
    const list=previousAllRarities();
    return list.some(r=>r.name==='ATTILA')?list:[...list,ATTILA];
  };
  window.__needohAttilaRarity=ATTILA;

  function ensureOwnerHasAttila(){
    if(!ownerAuthorized())return false;
    if(!state.owned.includes('ATTILA')){
      state.owned.push('ATTILA');
      state.selected='ATTILA';
      save(true);render();
      toast('👑 ATTILA Squishy unlocked!');
      return true;
    }
    return false;
  }

  async function allowedGiftForMe(){
    if(ownerName())return true;
    const key=encodeURIComponent(keyFor());
    const rows=await api(`needoh_grants?select=id&target_key=eq.${key}&reward_type=eq.squishy&item=eq.ATTILA&admin_name=eq.Attila&limit=1`);
    return !!rows?.length;
  }

  async function enforceAttilaOwnership(){
    if(checkingGift||playerName()==='Player')return;
    if(ownerAuthorized()){ensureOwnerHasAttila();return}
    if(!state.owned.includes('ATTILA'))return;
    checkingGift=true;
    try{
      if(!(await allowedGiftForMe())){
        state.owned=state.owned.filter(x=>x!=='ATTILA');
        if(state.selected==='ATTILA')state.selected=state.owned[0]||'Common';
        save(true);render();
      }
    }catch(e){console.warn('ATTILA ownership check failed',e)}
    finally{checkingGift=false}
  }

  function safeSquishies(){return allRarities().filter(r=>!r.ownerOnly)}

  async function showTemporaryGivePanel(){
    openHub('🛡️ Temporary Admin — Give Only','<div class="card">Loading players…</div>');
    try{
      const players=await api('needoh_players?select=player_key,display_name,coins,world&order=display_name.asc&limit=200');
      const choices=(players||[]).filter(p=>p.player_key!=='attila');
      const opts=choices.map(p=>`<option value="${escapeHtml(p.player_key)}">${escapeHtml(p.display_name)} — 🪙 ${fmt(Number(p.coins)||0)} · World ${p.world}</option>`).join('');
      const squish=safeSquishies().map(r=>`<option value="${escapeHtml(r.name)}">${r.icon} ${escapeHtml(r.name)}</option>`).join('');
      openHub('🛡️ Temporary Admin — Give Only',`<div class="notice">🎁 Temporary admins can GIVE only. Taking coins/progress, resets, kicks, timed-admin management, owner events, and the 👑 ATTILA Squishy are locked.</div><div class="card"><h3>🎁 Give Player Stuff</h3><label class="small">Player</label><select class="field" id="tempGivePlayer">${opts||'<option value="">No eligible players found</option>'}</select><label class="small">Reward</label><select class="field" id="tempGiveType"><option value="coins">🪙 Coins</option><option value="squishy">🫧 Specific Squishy</option><option value="worlds">🌎 Unlock Worlds 1–4</option><option value="allSquishies">🎒 All Normal Squishies</option><option value="power">⚡ Power Multiplier</option></select><div id="tempAmountWrap"><input class="field" id="tempGiveAmount" type="number" min="1" value="1000000"></div><div id="tempSquishWrap" style="display:none"><select class="field" id="tempGiveSquishy">${squish}</select></div><button class="btn admin" id="tempGiveBtn">🎁 GIVE</button></div>`);
      const toggle=()=>{const t=$('tempGiveType').value;$('tempAmountWrap').style.display=['coins','power'].includes(t)?'block':'none';$('tempSquishWrap').style.display=t==='squishy'?'block':'none';$('tempGiveAmount').value=t==='power'?'10':'1000000'};
      $('tempGiveType').onchange=toggle;toggle();
      $('tempGiveBtn').onclick=async()=>{
        const target=$('tempGivePlayer').value;if(!target)return toast('Choose a player');
        const p=choices.find(x=>x.player_key===target),type=$('tempGiveType').value;
        const g={target_key:target,target_name:p?.display_name||target,admin_name:playerName(),reward_type:type};
        if(type==='coins')g.amount=Math.max(1,Math.floor(Number($('tempGiveAmount').value)||0));
        if(type==='power')g.amount=Math.max(2,Math.min(1000,Number($('tempGiveAmount').value)||10));
        if(type==='squishy'){
          g.item=$('tempGiveSquishy').value;
          if(g.item==='ATTILA')return toast('ATTILA Squishy is owner-only');
        }
        try{await api('needoh_grants',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([g])});toast(`🎁 Sent to ${g.target_name}!`)}
        catch(e){console.warn('Temporary admin gift failed',e);toast('Could not send reward')}
      };
    }catch(e){openHub('🛡️ Temporary Admin — Give Only',`<div class="notice">Could not load players.</div><div class="small">${escapeHtml(e.message)}</div>`)}
  }

  async function appendOwnerAttilaCard(){
    if(!ownerAuthorized())return;
    ensureOwnerHasAttila();
    const host=$('hubContent');
    if(!host||document.getElementById('attilaSquishyOwnerCard'))return;
    try{
      const players=await api('needoh_players?select=player_key,display_name&order=display_name.asc&limit=200');
      const others=(players||[]).filter(p=>p.player_key!=='attila');
      const opts=others.map(p=>`<option value="${escapeHtml(p.player_key)}">${escapeHtml(p.display_name)}</option>`).join('');
      const card=document.createElement('div');
      card.id='attilaSquishyOwnerCard';card.className='card';card.style.marginTop='14px';
      card.innerHTML=`<h3>👑 ATTILA Squishy — OWNER EXCLUSIVE</h3><div style="display:flex;align-items:center;gap:14px;margin:10px 0"><div style="width:78px;height:78px;border-radius:42% 58% 45% 55% / 55% 40% 60% 45%;background:linear-gradient(135deg,#080808,#3b2b00,#ffd84d,#111);box-shadow:0 0 28px #ffd84d"></div><div><b>👑 ATTILA</b><div class="small">×${fmt(ATTILA.mult)} multiplier · Only the real Attila owner can create this gift.</div></div></div><label class="small">Gift ATTILA Squishy to</label><select class="field" id="attilaGiftPlayer">${opts||'<option value="">No other players found</option>'}</select><button class="btn gold" id="giftAttilaSquishyBtn">👑 GIFT ATTILA SQUISHY</button><p class="small" style="margin-top:8px">It cannot drop from boxes/events and temporary admins cannot give it.</p>`;
      host.appendChild(card);
      $('giftAttilaSquishyBtn').onclick=async()=>{
        const target=$('attilaGiftPlayer').value;if(!target)return toast('Choose a player');
        const p=others.find(x=>x.player_key===target);
        try{
          await api('needoh_grants',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{target_key:target,target_name:p?.display_name||target,admin_name:'Attila',reward_type:'squishy',item:'ATTILA'}])});
          toast(`👑 ATTILA Squishy gifted to ${p?.display_name||target}!`);
        }catch(e){console.warn('ATTILA gift failed',e);toast('Could not gift ATTILA Squishy')}
      };
    }catch(e){console.warn('Could not load ATTILA gift controls',e)}
  }

  const previousShowAdmin=showAdmin;
  showAdmin=async function(){
    if(temporaryAdmin())return showTemporaryGivePanel();
    const result=await previousShowAdmin();
    if(ownerAuthorized())await appendOwnerAttilaCard();
    return result;
  };

  const previousShowMessages=showMessages;
  showMessages=async function(){
    if(!temporaryAdmin())return previousShowMessages();
    openHub('💬 Global Chat','<div class="card">Loading chat…</div>');
    try{
      const rows=await api('needoh_messages?select=id,author,author_key,badge,body,created_at&order=created_at.desc&limit=100');
      const cards=(rows||[]).map(m=>{const badge=m.badge==='OWNER'?'<span class="chat-badge owner">OWNER</span>':m.badge==='TEMP ADMIN'?'<span class="chat-badge temp">TEMP ADMIN</span>':'';return `<div class="message-card"><div class="chat-meta"><b>${m.author_key==='system'?'📢':'👤'} ${escapeHtml(m.author)}</b>${badge}<span>${new Date(m.created_at).toLocaleString()}</span></div><div class="message-text">${escapeHtml(m.body)}</div></div>`}).join('');
      openHub('💬 Global Chat',`<div class="notice">Temporary admins can chat, but cannot delete or mute messages.</div><div class="message-form" style="grid-template-columns:1fr auto"><textarea class="field" id="messageText" maxlength="300" placeholder="Type a message..."></textarea><button class="btn primary" id="sendMessageBtn">Send</button></div><div class="messages-list">${cards||'<div class="card">No messages yet.</div>'}</div>`);
      $('sendMessageBtn').onclick=sendMessage;
    }catch(e){openHub('💬 Global Chat','<div class="notice">Chat could not connect.</div>')}
  };

  $('adminBtn').onclick=showAdmin;
  $('messagesBtn').onclick=showMessages;
  enforceAttilaOwnership();
  setInterval(enforceAttilaOwnership,4000);
  window.__needohTemporaryAdminGiveOnly=temporaryAdmin;
  window.__needohAttilaSquishyLoaded=true;
})();