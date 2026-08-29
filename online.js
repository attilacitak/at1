(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const baseHeaders={apikey:SB_KEY,'Content-Type':'application/json'};
  const pkey=(name=playerName())=>cleanPlayerName(name).toLowerCase();
  let checking=false;

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...baseHeaders,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();return t?JSON.parse(t):null;
  }

  async function syncPlayer(){
    const name=playerName();if(!name||name==='Player')return;
    const row=[{player_key:pkey(name),display_name:name,coins:Math.floor(Number(state.coins)||0),squishes:Math.floor(Number(state.squishes)||0),world:Math.max(1,Math.min(4,Number(state.world)||1)),updated_at:new Date().toISOString()}];
    try{await api('needoh_players?on_conflict=player_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(row)})}catch(e){console.warn('Online player sync failed',e)}
  }

  const oldSave=save;save=function(silent=false){const v=oldSave(silent);syncPlayer();return v};
  const oldSaveName=savePlayerName;savePlayerName=function(){oldSaveName();setTimeout(()=>{syncPlayer();checkGrants()},100)};

  showLeaderboard=async function(){
    openHub('🏆 Global Leaderboard','<div class="card">Loading global scores…</div>');
    try{
      await syncPlayer();
      const rows=await api('needoh_players?select=display_name,coins,squishes,world&order=coins.desc&limit=25');
      const html=(rows||[]).map((x,i)=>`<div class="leader-row"><b>#${i+1}</b><div><b>${escapeHtml(x.display_name)}</b><div class="small">World ${x.world} · ${fmt(Number(x.squishes||0))} squishes</div></div><div class="reward">🪙 ${fmt(Number(x.coins||0))}</div></div>`).join('');
      openHub('🏆 Global Leaderboard',`<div class="notice">Live scores shared across every device.</div>${html||'<div class="card">No players yet.</div>'}`);
    }catch(e){openHub('🏆 Global Leaderboard',`<div class="notice">Online leaderboard could not connect.</div><div class="small">${escapeHtml(e.message)}</div>`)}
  };

  async function getMessages(){return await api('needoh_messages?select=id,author,message_date,body,created_at&order=created_at.desc&limit=100')}
  showMessages=async function(){
    openHub('🌐 Global Messages','<div class="card">Loading global messages…</div>');
    try{
      const rows=await getMessages();
      const cards=(rows||[]).map(m=>`<div class="message-card"><div class="message-date">👤 ${escapeHtml(m.author)} · ${escapeHtml(m.message_date)}</div><div class="message-text">${escapeHtml(m.body)}</div></div>`).join('');
      openHub('🌐 Global Messages',`<div class="notice">These messages are shared with everyone.</div><div class="message-form"><input class="field" type="date" id="messageDate"><textarea class="field" id="messageText" maxlength="300" placeholder="Type a message..."></textarea><button class="btn primary" id="sendMessageBtn">Send</button></div><div class="messages-list">${cards||'<div class="card">No messages yet.</div>'}</div>`);
      $('messageDate').value=new Date().toISOString().slice(0,10);$('sendMessageBtn').onclick=sendMessage;
    }catch(e){openHub('🌐 Global Messages',`<div class="notice">Global messages could not connect.</div><div class="small">${escapeHtml(e.message)}</div>`)}
  };

  sendMessage=async function(){
    const text=String($('messageText')?.value||'').trim().slice(0,300),date=$('messageDate')?.value;
    if(!text||!date)return toast('Add a message and date');
    try{await api('needoh_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{author:playerName(),message_date:date,body:text}])});toast('🌐 Global message sent!');showMessages()}catch(e){toast('Could not send global message')}
  };

  function applyGrant(g){
    if(g.reward_type==='coins')addCoins(Number(g.amount)||0);
    else if(g.reward_type==='squishy'&&g.item){if(!state.owned.includes(g.item))state.owned.push(g.item);state.selected=g.item}
    else if(g.reward_type==='worlds')state.world2Unlocked=state.world3Unlocked=state.world4Unlocked=true;
    else if(g.reward_type==='allSquishies')state.owned=[...new Set(allRarities().map(r=>r.name))];
    else if(g.reward_type==='power')state.baseMult*=Math.max(2,Number(g.amount)||2);
  }

  async function checkGrants(){
    if(checking||playerName()==='Player')return;checking=true;
    try{
      const key=encodeURIComponent(pkey());
      const rows=await api(`needoh_grants?select=id,reward_type,amount,item&target_key=eq.${key}&claimed=eq.false&order=created_at.asc`);
      for(const g of rows||[]){applyGrant(g);oldSave(true);render();await api(`needoh_grants?id=eq.${encodeURIComponent(g.id)}&target_key=eq.${key}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({claimed:true,claimed_at:new Date().toISOString()})});toast('🎁 You received an admin reward!')}
    }catch(e){console.warn('Admin grant check failed',e)}finally{checking=false}
  }

  showAdmin=async function(){
    if(!isAdmin())return toast('Admin access requires the name Attila');
    openHub('🛡️ Attila Admin Panel','<div class="card">Loading online players…</div>');
    try{
      await syncPlayer();
      const players=await api('needoh_players?select=player_key,display_name,coins,world&order=display_name.asc&limit=200');
      const opts=(players||[]).filter(p=>p.player_key!=='attila').map(p=>`<option value="${escapeHtml(p.player_key)}">${escapeHtml(p.display_name)} — 🪙 ${fmt(Number(p.coins||0))} · World ${p.world}</option>`).join('');
      const squish=allRarities().map(r=>`<option value="${escapeHtml(r.name)}">${r.icon} ${escapeHtml(r.name)}</option>`).join('');
      openHub('🛡️ Attila Admin Panel',`<div class="card"><h3>🎁 Give Player Stuff</h3><label class="small">Player</label><select class="field" id="aPlayer">${opts||'<option value="">No other online players yet</option>'}</select><label class="small">Reward</label><select class="field" id="aType"><option value="coins">🪙 Coins</option><option value="squishy">🫧 Specific Squishy</option><option value="worlds">🌎 Unlock All Worlds</option><option value="allSquishies">🎒 All Squishies</option><option value="power">⚡ Power Multiplier</option></select><div id="aAmountWrap"><input class="field" id="aAmount" type="number" min="1" value="1000000"></div><div id="aSquishyWrap" style="display:none"><select class="field" id="aSquishy">${squish}</select></div><button class="btn admin" id="aGive">🎁 GIVE</button></div>`);
      const toggle=()=>{const t=$('aType').value;$('aAmountWrap').style.display=['coins','power'].includes(t)?'block':'none';$('aSquishyWrap').style.display=t==='squishy'?'block':'none';$('aAmount').value=t==='power'?'10':'1000000'};$('aType').onchange=toggle;toggle();
      $('aGive').onclick=async()=>{const target=$('aPlayer').value;if(!target)return toast('No player selected');const p=(players||[]).find(x=>x.player_key===target),type=$('aType').value,g={target_key:target,target_name:p?.display_name||target,admin_name:'Attila',reward_type:type};if(type==='coins')g.amount=Math.max(1,Math.floor(Number($('aAmount').value)||0));if(type==='power')g.amount=Math.max(2,Math.min(1000,Number($('aAmount').value)||10));if(type==='squishy')g.item=$('aSquishy').value;try{await api('needoh_grants',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([g])});toast(`🎁 Sent to ${g.target_name}!`)}catch(e){toast('Could not send reward')}};
    }catch(e){openHub('🛡️ Attila Admin Panel',`<div class="notice">Could not load online players.</div><div class="small">${escapeHtml(e.message)}</div>`)}
  };

  $('leaderBtn').textContent='🏆 Global Leaderboard';
  $('messagesBtn').textContent='🌐 Global Messages';
  $('leaderBtn').onclick=showLeaderboard;$('messagesBtn').onclick=showMessages;$('adminBtn').onclick=showAdmin;
  window.__needohOnlineLoaded=true;
  syncPlayer();checkGrants();setInterval(syncPlayer,5000);setInterval(checkGrants,5000);
})();