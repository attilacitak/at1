(() => {
  if(window.__needohPvpLiveInvitesLoaded)return;

  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const HEADERS={apikey:SB_KEY,'Content-Type':'application/json'};
  let busy=false;
  let currentInviteId='';
  let timer=null;

  const myKey=()=>{
    try{return cleanPlayerName(playerName()).toLowerCase()}catch(e){return String(playerName?.()||'Player').trim().toLowerCase()}
  };

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...HEADERS,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`PvP invite error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();return t?JSON.parse(t):null;
  }

  async function rpc(name,body){
    return api(`rpc/${name}`,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
  }

  function ensureStyle(){
    if(document.getElementById('pvpLiveInviteStyles'))return;
    const s=document.createElement('style');s.id='pvpLiveInviteStyles';s.textContent=`
      #pvpLiveInviteCard{position:fixed;right:16px;top:16px;z-index:65000;width:min(370px,calc(100vw - 32px));background:linear-gradient(145deg,rgba(31,30,58,.98),rgba(18,18,34,.98));border:1px solid rgba(255,217,94,.52);border-radius:18px;box-shadow:0 18px 60px rgba(0,0,0,.52),0 0 30px rgba(255,217,94,.16);padding:14px;animation:pvpInviteIn .24s cubic-bezier(.2,.9,.2,1)}
      #pvpLiveInviteCard .pvp-invite-head{display:flex;align-items:center;gap:10px;margin-bottom:9px}
      #pvpLiveInviteCard .pvp-invite-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(135deg,rgba(255,82,123,.2),rgba(118,95,255,.24));font-size:27px;box-shadow:inset 0 0 16px rgba(255,255,255,.05)}
      #pvpLiveInviteCard h3{margin:0;font-size:17px}#pvpLiveInviteCard p{margin:4px 0 0;color:#d6d5e4;font-size:12px}
      #pvpLiveInviteCard .pvp-invite-squishy{display:flex;justify-content:space-between;gap:9px;align-items:center;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:9px;margin:9px 0}
      #pvpLiveInviteCard .pvp-invite-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      #pvpLiveInviteCard .pvp-invite-expire{font-size:10px;color:#aaaabd;text-align:center;margin-top:7px}
      @keyframes pvpInviteIn{from{opacity:0;transform:translateY(-14px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      @media(max-width:620px){#pvpLiveInviteCard{right:8px;top:8px;width:calc(100vw - 16px);padding:11px;border-radius:15px}}
    `;document.head.appendChild(s);
  }

  function removeCard(){const c=document.getElementById('pvpLiveInviteCard');if(c)c.remove();currentInviteId=''}

  function secondsLeft(inv){return Math.max(0,Math.ceil((Date.parse(inv.expires_at)-Date.now())/1000))}

  function renderInvite(inv){
    ensureStyle();
    if(!inv||inv.status!=='waiting'||inv.opponent_key!==myKey()||secondsLeft(inv)<=0){removeCard();return}
    let c=document.getElementById('pvpLiveInviteCard');
    if(!c){c=document.createElement('div');c.id='pvpLiveInviteCard';document.body.appendChild(c)}
    currentInviteId=inv.id;
    const left=secondsLeft(inv);
    c.innerHTML=`<div class="pvp-invite-head"><div class="pvp-invite-icon">⚔️</div><div><h3>PvP Challenge!</h3><p><b>${escapeHtml(inv.challenger_name||'Player')}</b> wants to fight you.</p></div></div><div class="pvp-invite-squishy"><div><div class="small">Opponent</div><b>${escapeHtml(inv.challenger_squishy||'Common')}</b></div><div style="font-size:20px">VS</div><div style="text-align:right"><div class="small">You will use</div><b>${escapeHtml(state.selected||'Common')}</b></div></div><div class="pvp-invite-actions"><button class="btn gold" id="pvpInstantAccept" ${busy?'disabled':''}>⚔️ ACCEPT</button><button class="btn danger" id="pvpInstantDecline" ${busy?'disabled':''}>DECLINE</button></div><div class="pvp-invite-expire">Challenge expires in ${left}s</div>`;
    $('pvpInstantAccept').onclick=()=>acceptInvite(inv);
    $('pvpInstantDecline').onclick=()=>declineInvite(inv);
  }

  function combatPower(){
    try{if(window.__needohPvp?.power)return Math.max(1,Math.floor(window.__needohPvp.power()))}catch(e){}
    let mult=1;try{mult=Math.max(1,Number(rarity(state.selected)?.mult)||1)}catch(e){}
    const prestige=Math.max(0,Number(state.mega?.prestige?.count)||0),world=Math.max(1,Number(state.world)||1),shiny=String(state.selected||'').startsWith('Shiny ')?18:0;
    return Math.max(25,Math.min(1000,Math.round(55+Math.log10(mult+1)*24+prestige*12+world*8+shiny)));
  }

  async function acceptInvite(inv){
    if(busy)return;busy=true;renderInvite(inv);
    try{
      await rpc('needoh_pvp_sync_player',{p_player_key:myKey(),p_player_name:playerName()});
      await rpc('needoh_pvp_accept',{p_match_id:inv.id,p_actor_key:myKey(),p_actor_name:playerName(),p_squishy:state.selected||'Common',p_power:combatPower()});
      removeCard();toast(`⚔️ Battle started vs ${inv.challenger_name}!`);
      if(window.__needohPvp?.battle)window.__needohPvp.battle(inv.id);
      else if(window.__needohPvp?.show)window.__needohPvp.show();
    }catch(e){
      console.warn('Instant PvP accept failed',e);
      const msg=String(e.message||e);
      toast(msg.includes('challenge unavailable')?'That challenge expired or was cancelled':'Could not accept PvP challenge');
      if(msg.includes('challenge unavailable')||msg.includes('not your challenge'))removeCard();
    }finally{busy=false}
  }

  async function declineInvite(inv){
    if(busy)return;busy=true;renderInvite(inv);
    try{await rpc('needoh_pvp_decline',{p_match_id:inv.id,p_actor_key:myKey()});removeCard();toast('PvP challenge declined')}
    catch(e){console.warn('Instant PvP decline failed',e);toast('Could not decline PvP challenge')}
    finally{busy=false}
  }

  async function poll(){
    if(playerName()==='Player'){removeCard();return}
    try{
      const now=new Date().toISOString();
      const rows=await api(`needoh_pvp_matches?select=id,challenger_key,challenger_name,opponent_key,opponent_name,challenger_squishy,status,created_at,expires_at&opponent_key=eq.${encodeURIComponent(myKey())}&status=eq.waiting&expires_at=gt.${encodeURIComponent(now)}&order=created_at.asc&limit=5`);
      const inv=rows?.[0];
      if(inv)renderInvite(inv);else removeCard();
    }catch(e){console.warn('PvP invite poll failed',e)}
  }

  ensureStyle();
  poll();
  timer=setInterval(poll,900);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});
  window.addEventListener('focus',poll);
  window.__needohPvpLiveInvites={poll};
  window.__needohPvpLiveInvitesLoaded=true;
})();