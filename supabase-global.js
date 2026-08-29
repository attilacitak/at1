(() => {
  const SB_URL = 'https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY = 'sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };
  const playerKey = (name = playerName()) => cleanPlayerName(name).toLowerCase();
  let applyingGrant = false;

  async function sb(path, options = {}) {
    const res = await fetch(`${SB_URL}/rest/v1/${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    if (!res.ok) throw new Error((await res.text()) || `Supabase error ${res.status}`);
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  async function syncPlayer() {
    const name = playerName();
    if (!name || name === 'Player') return;
    const body = [{ player_key: playerKey(name), display_name: name, coins: Math.floor(state.coins || 0), squishes: Math.floor(state.squishes || 0), world: Math.max(1, Math.min(4, Number(state.world) || 1)), updated_at: new Date().toISOString() }];
    try {
      await sb('needoh_players?on_conflict=player_key', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(body) });
    } catch (e) { console.warn('Player sync failed', e); }
  }

  const originalSave = save;
  save = function(silent = false) {
    const out = originalSave(silent);
    syncPlayer();
    return out;
  };

  const originalSavePlayerName = savePlayerName;
  savePlayerName = function() {
    originalSavePlayerName();
    setTimeout(() => { syncPlayer(); checkAdminGrants(); }, 100);
  };

  showLeaderboard = async function() {
    openHub('🏆 Global Leaderboard', '<div class="card">Loading global scores…</div>');
    try {
      await syncPlayer();
      const rows = await sb('needoh_players?select=display_name,coins,squishes,world&order=coins.desc&limit=25');
      const html = (rows || []).map((x, i) => `<div class="leader-row"><b>#${i + 1}</b><div><b>${escapeHtml(x.display_name)}</b><div class="small">World ${x.world} · ${fmt(Number(x.squishes || 0))} squishes</div></div><div class="reward">🪙 ${fmt(Number(x.coins || 0))}</div></div>`).join('');
      openHub('🏆 Global Leaderboard', html || '<div class="card">No players yet.</div>');
    } catch (e) {
      openHub('🏆 Global Leaderboard', `<div class="notice">Could not load global scores right now.</div><div class="small">${escapeHtml(e.message)}</div>`);
    }
  };

  async function loadGlobalMessages() {
    return await sb('needoh_messages?select=id,author,message_date,body,created_at&order=created_at.desc&limit=100');
  }

  showMessages = async function() {
    openHub('🌐 Global Messages', '<div class="card">Loading messages…</div>');
    try {
      const messages = await loadGlobalMessages();
      const cards = (messages || []).map(m => `<div class="message-card"><div class="message-date">👤 ${escapeHtml(m.author)} · ${escapeHtml(m.message_date)}</div><div class="message-text">${escapeHtml(m.body)}</div></div>`).join('');
      openHub('🌐 Global Messages', `<div class="notice">These messages are shared with everyone playing the game.</div><div class="message-form"><input class="field" type="date" id="messageDate"><textarea class="field" id="messageText" maxlength="300" placeholder="Type a message..."></textarea><button class="btn primary" id="sendMessageBtn">Send</button></div><div class="messages-list">${cards || '<div class="card">No messages yet.</div>'}</div>`);
      $('messageDate').value = new Date().toISOString().slice(0, 10);
      $('sendMessageBtn').onclick = sendMessage;
    } catch (e) {
      openHub('🌐 Global Messages', `<div class="notice">Could not load global messages right now.</div><div class="small">${escapeHtml(e.message)}</div>`);
    }
  };

  sendMessage = async function() {
    const text = String($('messageText')?.value || '').trim().slice(0, 300);
    const date = $('messageDate')?.value;
    if (!text || !date) return toast('Add a message and date');
    try {
      await sb('needoh_messages', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify([{ author: playerName(), message_date: date, body: text }]) });
      toast(`🌐 Message sent by ${playerName()}!`);
      showMessages();
    } catch (e) { toast('Could not send global message'); }
  };

  function applyGrant(g) {
    if (g.reward_type === 'coins') addCoins(Number(g.amount) || 0);
    else if (g.reward_type === 'squishy') {
      if (g.item && rarity(g.item)) {
        if (!state.owned.includes(g.item)) state.owned.push(g.item);
        state.selected = g.item;
      }
    } else if (g.reward_type === 'worlds') {
      state.world2Unlocked = state.world3Unlocked = state.world4Unlocked = true;
    } else if (g.reward_type === 'allSquishies') {
      state.owned = [...new Set(allRarities().map(r => r.name))];
    } else if (g.reward_type === 'power') {
      state.baseMult *= Math.max(2, Number(g.amount) || 2);
    }
  }

  async function checkAdminGrants() {
    if (applyingGrant || playerName() === 'Player') return;
    applyingGrant = true;
    try {
      const key = encodeURIComponent(playerKey());
      const grants = await sb(`needoh_grants?select=id,target_name,admin_name,reward_type,amount,item,created_at&target_key=eq.${key}&claimed=eq.false&order=created_at.asc`);
      for (const g of grants || []) {
        applyGrant(g);
        save(true);
        render();
        await sb(`needoh_grants?id=eq.${encodeURIComponent(g.id)}&target_key=eq.${key}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ claimed: true, claimed_at: new Date().toISOString() }) });
        const reward = g.reward_type === 'coins' ? `${fmt(Number(g.amount || 0))} coins` : g.reward_type === 'squishy' ? g.item : g.reward_type === 'worlds' ? 'all worlds' : g.reward_type === 'allSquishies' ? 'all squishies' : `${Number(g.amount || 2)}× power`;
        toast(`🎁 Attila gave you ${reward}!`);
      }
    } catch (e) { console.warn('Grant check failed', e); }
    finally { applyingGrant = false; }
  }

  async function getPlayers() {
    const rows = await sb('needoh_players?select=player_key,display_name,coins,world,updated_at&order=display_name.asc&limit=200');
    return rows || [];
  }

  showAdmin = async function() {
    if (!isAdmin()) return toast('Admin access requires the name Attila');
    openHub('🛡️ Attila Admin Panel', '<div class="card">Loading players…</div>');
    try {
      await syncPlayer();
      const players = await getPlayers();
      const options = players.filter(p => p.player_key !== 'attila').map(p => `<option value="${escapeHtml(p.player_key)}">${escapeHtml(p.display_name)} — 🪙 ${fmt(Number(p.coins || 0))} · World ${p.world}</option>`).join('');
      const squishies = allRarities().map(r => `<option value="${escapeHtml(r.name)}">${r.icon} ${escapeHtml(r.name)}</option>`).join('');
      openHub('🛡️ Attila Admin Panel', `<div class="card"><h3>🎁 Give Another Player Stuff</h3><p class="small">Choose a player who has opened the game, choose a reward, then press Give. Their game will receive it automatically.</p><label class="small">Player</label><select class="field" id="directPlayer">${options || '<option value="">No other players yet</option>'}</select><label class="small">Reward</label><select class="field" id="directType"><option value="coins">🪙 Coins</option><option value="squishy">🫧 Specific Squishy</option><option value="worlds">🌎 Unlock All Worlds</option><option value="allSquishies">🎒 Give All Squishies</option><option value="power">⚡ Power Multiplier</option></select><div id="directAmountWrap"><label class="small" id="directAmountLabel">Coin amount</label><input class="field" id="directAmount" type="number" min="1" value="1000000"></div><div id="directSquishyWrap" style="display:none"><label class="small">Squishy</label><select class="field" id="directSquishy">${squishies}</select></div><button class="btn admin" id="directGive">🎁 GIVE</button></div><div class="grid2" style="margin-top:14px"><div class="card"><h3>💰 Me</h3><button class="btn gold" id="adminCoins">+1 Trillion Coins</button></div><div class="card"><h3>🌎 Me</h3><button class="btn gold" id="adminWorlds">Unlock All Worlds</button></div><div class="card"><h3>🎒 Me</h3><button class="btn gold" id="adminSquishies">Give All Squishies</button></div><div class="card"><h3>⚡ Me</h3><button class="btn gold" id="adminPower">100× Base Multiplier</button></div></div><p class="small" style="margin-top:12px">Players appear here after they open the new version of the game at least once.</p>`);
      $('adminCoins').onclick = () => { addCoins(1e12); save(true); render(); toast('🛡️ +1T coins'); };
      $('adminWorlds').onclick = () => { state.world2Unlocked = state.world3Unlocked = state.world4Unlocked = true; save(true); render(); toast('🛡️ All worlds unlocked'); };
      $('adminSquishies').onclick = () => { state.owned = [...new Set(allRarities().map(r => r.name))]; save(true); render(); toast('🛡️ All squishies granted'); };
      $('adminPower').onclick = () => { state.baseMult *= 100; save(true); render(); toast('🛡️ Power boosted'); };
      function updateFields() {
        const type = $('directType').value;
        $('directAmountWrap').style.display = ['coins','power'].includes(type) ? 'block' : 'none';
        $('directSquishyWrap').style.display = type === 'squishy' ? 'block' : 'none';
        if (type === 'coins') { $('directAmountLabel').textContent = 'Coin amount'; $('directAmount').value = '1000000'; }
        if (type === 'power') { $('directAmountLabel').textContent = 'Power multiplier (2–1000×)'; $('directAmount').value = '10'; }
      }
      $('directType').onchange = updateFields; updateFields();
      $('directGive').onclick = async () => {
        const target = $('directPlayer').value;
        if (!target) return toast('No player selected');
        const p = players.find(x => x.player_key === target);
        const type = $('directType').value;
        const grant = { target_key: target, target_name: p?.display_name || target, admin_name: 'Attila', reward_type: type };
        if (type === 'coins') grant.amount = Math.max(1, Math.floor(Number($('directAmount').value) || 0));
        if (type === 'power') grant.amount = Math.max(2, Math.min(1000, Number($('directAmount').value) || 10));
        if (type === 'squishy') grant.item = $('directSquishy').value;
        try {
          await sb('needoh_grants', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify([grant]) });
          toast(`🎁 Sent to ${grant.target_name}!`);
        } catch (e) { toast('Could not send reward'); }
      };
    } catch (e) {
      openHub('🛡️ Attila Admin Panel', `<div class="notice">Could not load players right now.</div><div class="small">${escapeHtml(e.message)}</div>`);
    }
  };

  $('leaderBtn').onclick = showLeaderboard;
  $('messagesBtn').onclick = showMessages;
  $('adminBtn').onclick = showAdmin;

  syncPlayer();
  checkAdminGrants();
  setInterval(syncPlayer, 5000);
  setInterval(checkAdminGrants, 5000);
})();