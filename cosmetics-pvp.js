(() => {
  if (window.__needohCosmeticsPvpLoaded) return;

  const SB_URL = 'https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY = 'sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const HEADERS = { apikey: SB_KEY, 'Content-Type': 'application/json' };
  const notifiedChallenges = new Set();
  const notifiedTurns = new Map();
  let battleTimer = null;
  let pvpBusy = false;

  const myKey = () => cleanPlayerName(playerName()).toLowerCase();

  async function api(path, opts = {}) {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...opts,
      headers: { ...HEADERS, ...(opts.headers || {}) }
    });
    if (!r.ok) throw new Error((await r.text()) || `PvP error ${r.status}`);
    if (r.status === 204) return null;
    const t = await r.text();
    return t ? JSON.parse(t) : null;
  }

  async function rpc(name, body) {
    return api(`rpc/${name}`, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(body)
    });
  }

  function ensureStyles() {
    if (document.getElementById('cosmeticsPvpStyles')) return;
    const s = document.createElement('style');
    s.id = 'cosmeticsPvpStyles';
    s.textContent = `
      #mega2CosmeticOverlay{position:absolute!important;inset:0!important;left:0!important;top:0!important;width:100%!important;height:100%!important;transform:none!important;font-size:0!important;line-height:0!important;overflow:visible!important;filter:none!important;pointer-events:none!important;z-index:12!important}
      #mega2CosmeticOverlay.none{display:none!important}
      #mega2CosmeticOverlay::before,#mega2CosmeticOverlay::after{content:"";position:absolute;pointer-events:none}
      .mega2-trail{filter:none!important}
      #mega2CosmeticOverlay.crown::before{width:112px;height:58px;left:50%;top:4px;transform:translateX(-50%);clip-path:polygon(4% 100%,4% 48%,16% 63%,27% 8%,40% 62%,50% 18%,61% 62%,74% 8%,86% 63%,96% 48%,96% 100%);background:linear-gradient(180deg,#fff8bf 0%,#ffe45f 26%,#f4b91e 62%,#a86d00 100%);filter:drop-shadow(0 5px 3px rgba(0,0,0,.42)) drop-shadow(0 0 11px rgba(255,210,55,.72));border-radius:0 0 13px 13px}
      #mega2CosmeticOverlay.crown::after{width:74px;height:15px;left:50%;top:44px;transform:translateX(-50%);border-radius:999px;background:radial-gradient(circle at 12% 50%,#ff4d8c 0 5px,transparent 5.5px),radial-gradient(circle at 50% 50%,#65dcff 0 5px,transparent 5.5px),radial-gradient(circle at 88% 50%,#83ff76 0 5px,transparent 5.5px),linear-gradient(180deg,#ffe777,#be7d00);box-shadow:0 0 8px rgba(255,226,91,.8)}
      #mega2CosmeticOverlay.halo::before{width:108px;height:28px;left:50%;top:17px;transform:translateX(-50%) rotate(-3deg);border:7px solid #ffe98a;border-radius:50%;background:rgba(255,238,134,.08);box-shadow:0 0 12px #fff1a1,0 0 26px rgba(255,211,63,.9),inset 0 0 10px rgba(255,255,255,.7);animation:realHaloFloat 1.8s ease-in-out infinite alternate}
      @keyframes realHaloFloat{to{transform:translateX(-50%) translateY(-6px) rotate(3deg)}}
      #mega2CosmeticOverlay.sunglasses::before,#mega2CosmeticOverlay.sunglasses::after{width:60px;height:38px;top:111px;background:linear-gradient(155deg,#111 0%,#252535 55%,#050509 100%);border:5px solid #15151d;border-radius:12px 12px 18px 18px;box-shadow:inset 8px 7px 8px rgba(255,255,255,.08),0 5px 8px rgba(0,0,0,.36)}
      #mega2CosmeticOverlay.sunglasses::before{left:74px;transform:rotate(3deg);box-shadow:inset 8px 7px 8px rgba(255,255,255,.08),0 5px 8px rgba(0,0,0,.36),55px -5px 0 -26px #15151d}
      #mega2CosmeticOverlay.sunglasses::after{right:74px;transform:rotate(-3deg)}
      #mega2CosmeticOverlay.fire::before{inset:20px;border-radius:44%;z-index:-1;background:radial-gradient(circle at 50% 70%,rgba(255,244,129,.96),rgba(255,151,25,.75) 25%,rgba(255,55,15,.47) 48%,transparent 70%),radial-gradient(ellipse at 25% 35%,rgba(255,190,40,.58),transparent 42%),radial-gradient(ellipse at 76% 28%,rgba(255,77,18,.55),transparent 43%);filter:blur(12px);animation:realFirePulse .7s ease-in-out infinite alternate}
      #mega2CosmeticOverlay.fire::after{inset:28px;border-radius:50%;background:radial-gradient(circle at 15% 82%,#ffe46d 0 3px,transparent 4px),radial-gradient(circle at 28% 20%,#ff7b28 0 4px,transparent 5px),radial-gradient(circle at 72% 14%,#ffe361 0 3px,transparent 4px),radial-gradient(circle at 86% 65%,#ff6323 0 4px,transparent 5px),radial-gradient(circle at 55% 4%,#fff0a1 0 3px,transparent 4px);animation:realEmbers 1.05s linear infinite}
      @keyframes realFirePulse{from{transform:scale(.94);opacity:.72}to{transform:scale(1.08);opacity:1}}
      @keyframes realEmbers{to{transform:translateY(-18px) rotate(8deg);opacity:.35}}
      #mega2CosmeticOverlay.lightning::before,#mega2CosmeticOverlay.lightning::after{width:38px;height:126px;top:70px;background:linear-gradient(180deg,#fff,#a7f4ff 38%,#41c8ff 72%,#786cff);clip-path:polygon(45% 0,78% 0,57% 34%,91% 34%,24% 100%,42% 57%,8% 57%);filter:drop-shadow(0 0 7px #a8f5ff) drop-shadow(0 0 16px #4cc8ff);animation:realZap .45s steps(2,end) infinite}
      #mega2CosmeticOverlay.lightning::before{left:30px;transform:rotate(-14deg)}
      #mega2CosmeticOverlay.lightning::after{right:30px;top:82px;transform:rotate(14deg) scale(.9)}
      @keyframes realZap{0%,100%{opacity:.28}50%{opacity:1}}
      #mega2CosmeticOverlay.stars::before{inset:12px;border-radius:50%;background:radial-gradient(circle at 12% 25%,#fff7a4 0 4px,transparent 5px),radial-gradient(circle at 82% 18%,#fff 0 3px,transparent 4px),radial-gradient(circle at 92% 58%,#ffe15e 0 5px,transparent 6px),radial-gradient(circle at 22% 78%,#fff 0 4px,transparent 5px),radial-gradient(circle at 58% 3%,#ffd95e 0 4px,transparent 5px),radial-gradient(circle at 64% 88%,#fff4a0 0 3px,transparent 4px);filter:drop-shadow(0 0 8px #ffe97e);animation:realStarsOrbit 3.4s linear infinite}
      #mega2CosmeticOverlay.stars::after{width:18px;height:18px;left:27px;top:112px;background:#fff3a0;clip-path:polygon(50% 0,61% 36%,100% 50%,61% 64%,50% 100%,39% 64%,0 50%,39% 36%);box-shadow:207px -54px 0 #fff,168px 95px 0 #ffd95e,48px -82px 0 #fff4a0;animation:realStarTwinkle .9s ease-in-out infinite alternate}
      @keyframes realStarsOrbit{to{transform:rotate(360deg)}}
      @keyframes realStarTwinkle{to{transform:scale(1.45);opacity:.45}}
      #mega2CosmeticOverlay.trail::before{inset:3px;border-radius:50%;z-index:-1;background:conic-gradient(from 0deg,rgba(255,65,92,.55),rgba(255,187,65,.55),rgba(255,241,88,.55),rgba(75,255,143,.55),rgba(72,211,255,.58),rgba(132,92,255,.58),rgba(255,88,205,.55),rgba(255,65,92,.55));filter:blur(18px);opacity:.9;animation:realRainbowOrbit 2.8s linear infinite}
      #mega2CosmeticOverlay.trail::after{width:155px;height:52px;left:56%;top:61%;border-radius:50%;transform:rotate(24deg);background:linear-gradient(90deg,rgba(255,66,92,.68),rgba(255,209,64,.55),rgba(84,255,137,.45),rgba(70,204,255,.32),transparent);filter:blur(15px);animation:realTrailWave 1.2s ease-in-out infinite alternate}
      @keyframes realRainbowOrbit{to{transform:rotate(360deg)}}
      @keyframes realTrailWave{to{transform:rotate(16deg) translateX(18px) scaleX(1.12);opacity:.55}}
      .cos-visual-preview{height:44px!important;width:70px;margin:0 auto 7px;position:relative!important;font-size:0!important;display:block!important}.cos-visual-preview::before,.cos-visual-preview::after{content:"";position:absolute}.cos-visual-preview.none::before{content:"—";font-size:28px;color:#aaa;left:50%;top:50%;transform:translate(-50%,-50%)}.cos-visual-preview.crown::before{inset:2px 5px;background:linear-gradient(#fff0a0,#d99b00);clip-path:polygon(0 100%,5% 42%,22% 62%,31% 4%,46% 61%,58% 15%,70% 61%,82% 4%,95% 42%,100% 100%)}.cos-visual-preview.halo::before{width:58px;height:18px;border:5px solid #ffe478;border-radius:50%;left:6px;top:8px;box-shadow:0 0 12px #ffd95e}.cos-visual-preview.sunglasses::before,.cos-visual-preview.sunglasses::after{width:28px;height:19px;background:#101017;border:3px solid #34343f;border-radius:7px;top:11px}.cos-visual-preview.sunglasses::before{left:3px}.cos-visual-preview.sunglasses::after{right:3px}.cos-visual-preview.fire::before{inset:2px;border-radius:50%;background:radial-gradient(circle,#fff09a 0 12%,#ff9b24 35%,#ff351e 58%,transparent 72%);filter:blur(4px)}.cos-visual-preview.lightning::before{width:22px;height:42px;left:24px;top:1px;background:#a9f4ff;clip-path:polygon(45% 0,80% 0,58% 34%,92% 34%,20% 100%,42% 58%,8% 58%);filter:drop-shadow(0 0 6px #4bd4ff)}.cos-visual-preview.stars::before{inset:0;background:radial-gradient(circle at 18% 30%,#fff 0 3px,transparent 4px),radial-gradient(circle at 72% 18%,#ffe45d 0 4px,transparent 5px),radial-gradient(circle at 84% 72%,#fff 0 3px,transparent 4px),radial-gradient(circle at 35% 75%,#ffe45d 0 4px,transparent 5px)}.cos-visual-preview.trail::before{inset:1px;border-radius:50%;background:conic-gradient(#ff455c,#ffcf45,#55f28c,#54d9ff,#8d68ff,#ff5dcf,#ff455c);filter:blur(5px)}
      .pvp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.pvp-card{background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,68,126,.06));border:1px solid rgba(255,255,255,.11);border-radius:17px;padding:13px}.pvp-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.pvp-kpi{text-align:center;background:rgba(0,0,0,.2);border-radius:13px;padding:9px}.pvp-kpi b{display:block;font-size:20px}.pvp-player{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:10px;margin:7px 0}.pvp-online{display:inline-block;width:8px;height:8px;border-radius:50%;background:#65ef9a;box-shadow:0 0 8px #65ef9a;margin-right:5px}.pvp-recent{display:inline-block;width:8px;height:8px;border-radius:50%;background:#85869b;margin-right:5px}.pvp-arena{display:grid;grid-template-columns:1fr 80px 1fr;gap:10px;align-items:center;margin:12px 0}.pvp-vs{text-align:center;font-size:30px;font-weight:1000;color:#ffd95e}.pvp-fighter{text-align:center;background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(0,0,0,.14));border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:14px;min-height:235px}.pvp-fighter.turn{outline:2px solid #7cf7d4;box-shadow:0 0 24px rgba(124,247,212,.24)}.pvp-blob{width:104px;height:104px;margin:5px auto 9px;background:var(--pvp-bg);border-radius:var(--pvp-shape);box-shadow:inset -13px -14px 22px rgba(0,0,0,.18),inset 11px 11px 20px rgba(255,255,255,.15),0 0 28px var(--pvp-glow);animation:pvpFloat 1.8s ease-in-out infinite alternate}@keyframes pvpFloat{to{transform:translateY(-6px) rotate(3deg)}}.pvp-hp{height:15px;background:rgba(255,255,255,.09);border-radius:99px;overflow:hidden;margin:8px 0}.pvp-hp>div{height:100%;background:linear-gradient(90deg,#64ef99,#ffe15d,#ff4e72);transition:width .3s}.pvp-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:12px 0}.pvp-actions .btn{min-width:120px}.pvp-log{max-height:210px;overflow:auto;background:rgba(0,0,0,.18);border-radius:14px;padding:10px}.pvp-log div{padding:5px 7px;border-bottom:1px solid rgba(255,255,255,.06);font-size:12px}.pvp-log div:last-child{border-bottom:0}.pvp-rank{display:grid;grid-template-columns:40px 1fr auto;gap:9px;align-items:center;padding:9px;border-radius:13px;background:rgba(255,255,255,.055);margin:6px 0}.pvp-win{padding:12px;border-radius:15px;text-align:center;background:linear-gradient(135deg,rgba(255,217,94,.16),rgba(124,247,212,.12));border:1px solid rgba(255,217,94,.3);font-weight:1000;font-size:20px}@media(max-width:720px){.pvp-grid,.pvp-kpis{grid-template-columns:1fr 1fr}.pvp-arena{grid-template-columns:1fr}.pvp-vs{font-size:20px}.pvp-fighter{min-height:0}}@media(max-width:480px){.pvp-grid,.pvp-kpis{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function upgradeCosmeticCards() {
    document.querySelectorAll('.m2-cosmetic').forEach(card => {
      const btn = card.querySelector('[data-m2-cos]');
      const preview = card.querySelector('.emoji');
      const id = btn?.dataset?.m2Cos;
      if (!preview || !id) return;
      preview.textContent = '';
      preview.className = `emoji cos-visual-preview ${id}`;
    });
  }

  function combatPower() {
    let mult = 1;
    try { mult = Math.max(1, Number(rarity(state.selected)?.mult) || 1); } catch (e) {}
    const prestige = Math.max(0, Number(state.mega?.prestige?.count) || 0);
    const world = Math.max(1, Number(state.world) || 1);
    const shiny = String(state.selected || '').startsWith('Shiny ') ? 18 : 0;
    return Math.max(25, Math.min(1000, Math.round(55 + Math.log10(mult + 1) * 24 + prestige * 12 + world * 8 + shiny)));
  }

  async function syncPvpPlayer() {
    if (playerName() === 'Player') return null;
    try { return await rpc('needoh_pvp_sync_player', { p_player_key: myKey(), p_player_name: playerName() }); }
    catch (e) { console.warn('PvP sync failed', e); return null; }
  }

  function ensurePvpButton() {
    if ($('pvpBtn')) return;
    const bar = document.querySelector('.featurebar');
    if (!bar) return;
    const b = document.createElement('button');b.className = 'btn';b.id = 'pvpBtn';b.textContent = '⚔️ PvP';b.onclick = showPvp;bar.insertBefore(b, $('adminBtn'));
  }

  function matchSide(m) {
    const challenger = m.challenger_key === myKey();
    return {challenger,myName:challenger?m.challenger_name:m.opponent_name,enemyName:challenger?m.opponent_name:m.challenger_name,mySquishy:challenger?m.challenger_squishy:m.opponent_squishy,enemySquishy:challenger?m.opponent_squishy:m.challenger_squishy,myHp:Number(challenger?m.challenger_hp:m.opponent_hp)||0,enemyHp:Number(challenger?m.opponent_hp:m.challenger_hp)||0,myMax:Number(challenger?m.challenger_max_hp:m.opponent_max_hp)||1,enemyMax:Number(challenger?m.opponent_max_hp:m.challenger_max_hp)||1,myGuard:challenger?m.challenger_guard:m.opponent_guard,enemyGuard:challenger?m.opponent_guard:m.challenger_guard};
  }

  async function challengePlayer(key, name) {
    if (pvpBusy) return;if (playerName() === 'Player') return toast('Set your player name first');if (!key || key === myKey()) return;pvpBusy = true;
    try {await syncPvpPlayer();const id=await rpc('needoh_pvp_create_challenge',{p_challenger_key:myKey(),p_challenger_name:playerName(),p_opponent_key:key,p_opponent_name:name,p_squishy:state.selected||'Common',p_power:combatPower()});toast(`⚔️ Challenge sent to ${name}!`);setTimeout(showPvp,250);return id;}
    catch(e){const msg=String(e.message||e);toast(msg.includes('challenge already exists')?'A PvP match with that player is already open':'Could not send PvP challenge');}finally{pvpBusy=false;}
  }

  async function acceptChallenge(id){if(pvpBusy)return;pvpBusy=true;try{await syncPvpPlayer();await rpc('needoh_pvp_accept',{p_match_id:id,p_actor_key:myKey(),p_actor_name:playerName(),p_squishy:state.selected||'Common',p_power:combatPower()});toast('⚔️ Battle started!');showBattle(id)}catch(e){toast('Could not accept that challenge')}finally{pvpBusy=false}}
  async function declineChallenge(id){try{await rpc('needoh_pvp_decline',{p_match_id:id,p_actor_key:myKey()});toast('PvP challenge declined');showPvp()}catch(e){toast('Could not decline challenge')}}
  async function cancelChallenge(id){try{await rpc('needoh_pvp_cancel',{p_match_id:id,p_actor_key:myKey()});toast('PvP challenge cancelled');showPvp()}catch(e){toast('Could not cancel challenge')}}

  async function showPvp() {
    ensureStyles();ensurePvpButton();if(playerName()==='Player')return toast('Set a player name before using PvP');openHub('⚔️ PvP Arena','<div class="card">Loading PvP Arena…</div>');
    try {
      await syncPvpPlayer();
      const [statsRows,matches,players,ranks]=await Promise.all([api(`needoh_pvp_stats?select=*&player_key=eq.${encodeURIComponent(myKey())}&limit=1`),api('needoh_pvp_matches?select=*&order=updated_at.desc&limit=120'),api('needoh_players?select=player_key,display_name,selected_squishy,world,updated_at&order=updated_at.desc&limit=150'),api('needoh_pvp_stats?select=player_key,player_name,rating,wins,losses,win_streak,best_streak,matches&order=rating.desc,wins.desc&limit=10')]);
      const me=statsRows?.[0]||{rating:1000,wins:0,losses:0,win_streak:0,best_streak:0,matches:0};const myMatches=(matches||[]).filter(m=>m.challenger_key===myKey()||m.opponent_key===myKey());const incoming=myMatches.filter(m=>m.status==='waiting'&&m.opponent_key===myKey()&&Date.parse(m.expires_at)>Date.now());const outgoing=myMatches.filter(m=>m.status==='waiting'&&m.challenger_key===myKey()&&Date.parse(m.expires_at)>Date.now());const active=myMatches.filter(m=>m.status==='active');const history=myMatches.filter(m=>m.status==='finished').slice(0,8);
      const dedup=new Map();for(const p of players||[])if(p.player_key&&p.player_key!==myKey()&&!dedup.has(p.player_key))dedup.set(p.player_key,p);const opponents=[...dedup.values()].slice(0,24);
      const incomingHtml=incoming.map(m=>`<div class="pvp-player"><div><b>⚔️ ${escapeHtml(m.challenger_name)}</b><div class="small">Challenges you with ${escapeHtml(m.challenger_squishy)}</div></div><div><button class="btn gold" data-pvp-accept="${m.id}">Accept</button> <button class="btn danger" data-pvp-decline="${m.id}">Decline</button></div></div>`).join('');
      const activeHtml=active.map(m=>{const s=matchSide(m);return `<div class="pvp-player"><div><b>${escapeHtml(s.myName)} vs ${escapeHtml(s.enemyName)}</b><div class="small">${m.turn_key===myKey()?'🟢 YOUR TURN':'⏳ Opponent turn'} · ${escapeHtml(s.mySquishy)} vs ${escapeHtml(s.enemySquishy)}</div></div><button class="btn gold" data-pvp-open="${m.id}">OPEN BATTLE</button></div>`}).join('');
      const outgoingHtml=outgoing.map(m=>`<div class="pvp-player"><div><b>Waiting for ${escapeHtml(m.opponent_name)}</b><div class="small">Your ${escapeHtml(m.challenger_squishy)} · expires ${new Date(m.expires_at).toLocaleTimeString()}</div></div><button class="btn danger" data-pvp-cancel="${m.id}">Cancel</button></div>`).join('');
      const opponentHtml=opponents.map(p=>{const online=Date.now()-Date.parse(p.updated_at)<90000;return `<div class="pvp-player"><div><b><span class="${online?'pvp-online':'pvp-recent'}"></span>${escapeHtml(p.display_name||p.player_key)}</b><div class="small">${online?'ONLINE':'Recently seen'} · World ${Number(p.world)||1} · ${escapeHtml(p.selected_squishy||'Common')}</div></div><button class="btn gold" data-pvp-challenge="${escapeHtml(p.player_key)}" data-name="${escapeHtml(p.display_name||p.player_key)}">FIGHT</button></div>`}).join('');
      const rankHtml=(ranks||[]).map((r,i)=>`<div class="pvp-rank"><b>#${i+1}</b><div><b>${escapeHtml(r.player_name)}</b><div class="small">${r.wins}W / ${r.losses}L · streak ${r.win_streak}</div></div><span class="reward">🏆 ${r.rating}</span></div>`).join('');
      const histHtml=history.map(m=>`<div class="small" style="padding:5px 0">${m.winner_key===myKey()?'✅ WIN':'❌ LOSS'} vs ${escapeHtml(m.challenger_key===myKey()?m.opponent_name:m.challenger_name)} · ${new Date(m.updated_at).toLocaleString()}</div>`).join('');
      openHub('⚔️ PvP Arena',`<div class="notice">Fight real players with your currently selected squishy. Quick Attack always hits, Power Hit is stronger but can miss, and Guard cuts the next hit by 55%.</div><div class="pvp-kpis"><div class="pvp-kpi"><span class="small">Rating</span><b>${me.rating}</b></div><div class="pvp-kpi"><span class="small">Record</span><b>${me.wins}-${me.losses}</b></div><div class="pvp-kpi"><span class="small">Win Streak</span><b>${me.win_streak}</b></div><div class="pvp-kpi"><span class="small">Combat Power</span><b>${combatPower()}</b></div></div>${incomingHtml?`<h3>🚨 Incoming Challenges</h3>${incomingHtml}`:''}${activeHtml?`<h3>🔥 Active Battles</h3>${activeHtml}`:''}${outgoingHtml?`<h3>⏳ Sent Challenges</h3>${outgoingHtml}`:''}<div class="pvp-grid" style="margin-top:12px"><div class="pvp-card"><h3>👥 Challenge Players</h3>${opponentHtml||'<div class="small">No other players have checked in yet.</div>'}</div><div class="pvp-card"><h3>🏆 PvP Leaderboard</h3>${rankHtml||'<div class="small">No ranked players yet.</div>'}</div></div>${histHtml?`<div class="pvp-card" style="margin-top:10px"><h3>📜 Recent Battles</h3>${histHtml}</div>`:''}`);
      document.querySelectorAll('[data-pvp-accept]').forEach(b=>b.onclick=()=>acceptChallenge(b.dataset.pvpAccept));document.querySelectorAll('[data-pvp-decline]').forEach(b=>b.onclick=()=>declineChallenge(b.dataset.pvpDecline));document.querySelectorAll('[data-pvp-cancel]').forEach(b=>b.onclick=()=>cancelChallenge(b.dataset.pvpCancel));document.querySelectorAll('[data-pvp-open]').forEach(b=>b.onclick=()=>showBattle(b.dataset.pvpOpen));document.querySelectorAll('[data-pvp-challenge]').forEach(b=>b.onclick=()=>challengePlayer(b.dataset.pvpChallenge,b.dataset.name));
    } catch(e){console.warn('PvP arena failed',e);openHub('⚔️ PvP Arena','<div class="notice">PvP could not connect right now.</div>')}
  }

  function fighterHtml(name,squishy,hp,maxHp,guard,turn){const rr=rarity(squishy||'Common');const pct=Math.max(0,Math.min(100,(Number(hp)||0)/Math.max(1,Number(maxHp)||1)*100));return `<div class="pvp-fighter ${turn?'turn':''}"><div class="small">${turn?'🟢 TURN':' '}</div><div class="pvp-blob" style="--pvp-bg:${rr.color};--pvp-glow:${rr.glow};--pvp-shape:${rr.shape}"></div><h3>${escapeHtml(name)}</h3><div><b>${rr.icon} ${escapeHtml(squishy||'Common')}</b></div><div class="pvp-hp"><div style="width:${pct}%"></div></div><div class="small">❤️ ${Math.max(0,Number(hp)||0)} / ${Math.max(1,Number(maxHp)||1)} ${guard?' · 🛡 Guarded':''}</div></div>`}

  function renderBattle(m){let root=$('pvpBattleRoot');if(!root){openHub('⚔️ PvP Battle','<div id="pvpBattleRoot"></div>');root=$('pvpBattleRoot')}const s=matchSide(m),myTurn=m.status==='active'&&m.turn_key===myKey(),finished=m.status==='finished',won=finished&&m.winner_key===myKey(),log=Array.isArray(m.combat_log)?m.combat_log:[],logHtml=log.slice(-12).reverse().map(x=>`<div>${escapeHtml(x?.text||'')}</div>`).join('');root.innerHTML=`${finished?`<div class="pvp-win">${won?'🏆 YOU WON!':'💥 BATTLE LOST'}</div>`:`<div class="notice">${myTurn?'⚔️ YOUR TURN — choose a move.':'⏳ Waiting for '+escapeHtml(s.enemyName)+'…'}</div>`}<div class="pvp-arena">${fighterHtml(s.myName,s.mySquishy,s.myHp,s.myMax,s.myGuard,myTurn)}<div class="pvp-vs">VS</div>${fighterHtml(s.enemyName,s.enemySquishy,s.enemyHp,s.enemyMax,s.enemyGuard,m.status==='active'&&!myTurn)}</div><div class="pvp-actions"><button class="btn primary" data-pvp-action="quick" ${myTurn?'':'disabled'}>⚔️ Quick Attack</button><button class="btn danger" data-pvp-action="power" ${myTurn?'':'disabled'}>💥 Power Hit</button><button class="btn gold" data-pvp-action="guard" ${myTurn?'':'disabled'}>🛡️ Guard</button><button class="btn" id="pvpBackArena">← Arena</button></div><div class="pvp-card"><h3>Battle Log</h3><div class="pvp-log">${logHtml||'<div>Battle starting…</div>'}</div></div>`;root.querySelectorAll('[data-pvp-action]').forEach(b=>b.onclick=()=>pvpAction(m.id,b.dataset.pvpAction));$('pvpBackArena').onclick=()=>{stopBattlePolling();showPvp()};if(finished)setTimeout(syncPvpPlayer,200)}
  async function refreshBattle(id){try{const rows=await api(`needoh_pvp_matches?select=*&id=eq.${encodeURIComponent(id)}&limit=1`),m=rows?.[0];if(!m)return;renderBattle(m);if(m.status!=='active')stopBattlePolling()}catch(e){console.warn('Battle refresh failed',e)}}
  function stopBattlePolling(){if(battleTimer)clearInterval(battleTimer);battleTimer=null}
  async function showBattle(id){stopBattlePolling();openHub('⚔️ PvP Battle','<div id="pvpBattleRoot"><div class="card">Loading battle…</div></div>');await refreshBattle(id);battleTimer=setInterval(()=>{if(!$('hubModal')?.classList.contains('show')||$('hubTitle')?.textContent!=='⚔️ PvP Battle')return stopBattlePolling();refreshBattle(id)},2200)}
  async function pvpAction(id,action){if(pvpBusy)return;pvpBusy=true;try{const result=await rpc('needoh_pvp_action',{p_match_id:id,p_actor_key:myKey(),p_action:action}),m=Array.isArray(result)?result[0]:result;if(m)renderBattle(m);else await refreshBattle(id)}catch(e){const msg=String(e.message||e);toast(msg.includes('not your turn')?'Wait for your opponent':'PvP move failed')}finally{pvpBusy=false}}

  function injectPvpMegaCard(){if($('hubTitle')?.textContent!=='🚀 Needoh Mega+ Expansion')return;const grid=document.querySelector('#hubContent .m2-grid');if(!grid||$('pvpMegaCard'))return;const c=document.createElement('div');c.className='m2-card';c.id='pvpMegaCard';c.innerHTML='<div style="font-size:30px">⚔️</div><h3>PvP Arena</h3><p>Challenge other players, battle turn-by-turn, build a win streak and climb the rating leaderboard.</p><button class="btn gold" id="pvpMegaOpen">OPEN</button>';grid.prepend(c);$('pvpMegaOpen').onclick=showPvp}
  function hookMega(){const exp=window.__needohMegaExpansion2;if(!exp||window.__needohPvpMegaHooked)return;const base=exp.show,wrapped=()=>{base();setTimeout(()=>{injectPvpMegaCard();upgradeCosmeticCards()},0)};exp.show=wrapped;if($('megaBtn'))$('megaBtn').onclick=wrapped;window.__needohPvpMegaHooked=true}

  async function pollPvp(){if(playerName()==='Player')return;try{const rows=await api('needoh_pvp_matches?select=id,challenger_key,challenger_name,opponent_key,status,turn_key,updated_at,expires_at&order=updated_at.desc&limit=80');for(const m of rows||[]){if(m.status==='waiting'&&m.opponent_key===myKey()&&Date.parse(m.expires_at)>Date.now()&&!notifiedChallenges.has(m.id)){notifiedChallenges.add(m.id);toast(`⚔️ ${m.challenger_name} challenged you to PvP!`)}if(m.status==='active'&&(m.challenger_key===myKey()||m.opponent_key===myKey())&&m.turn_key===myKey()){const marker=String(m.updated_at||'');if(notifiedTurns.get(m.id)!==marker){notifiedTurns.set(m.id,marker);if($('hubTitle')?.textContent!=='⚔️ PvP Battle')toast('⚔️ Your PvP turn!')}}}}catch(e){}}

  ensureStyles();ensurePvpButton();hookMega();upgradeCosmeticCards();syncPvpPlayer();
  const observer=new MutationObserver(()=>{upgradeCosmeticCards();injectPvpMegaCard();hookMega()});observer.observe(document.body,{subtree:true,childList:true});
  setInterval(pollPvp,6500);setInterval(()=>{ensurePvpButton();hookMega()},3000);
  window.__needohPvp={show:showPvp,battle:showBattle,power:combatPower};window.__needohCosmeticsPvpLoaded=true;
})();