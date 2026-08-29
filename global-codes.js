(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    const text=await r.text();
    if(!r.ok){const err=new Error(text||`Online error ${r.status}`);err.status=r.status;throw err}
    return text?JSON.parse(text):null;
  }

  function normalizeCode(value){
    return String(value||'').toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,24);
  }

  const previousRedeemCode=redeemCode;
  redeemCode=async function(){
    const input=$('codeInput');
    const raw=String(input?.value||'').trim();
    if(!raw)return;
    const code=normalizeCode(raw);
    if(!code)return previousRedeemCode();

    try{
      const rows=await api(`needoh_global_codes?select=code,amount,active&code=eq.${encodeURIComponent(code)}&active=eq.true&limit=1`);
      const promo=rows?.[0];
      if(!promo)return previousRedeemCode();
      if(playerName()==='Player')return toast('Choose a player name first');

      const redemption=[{code:promo.code,player_key:cleanPlayerName(playerName()).toLowerCase(),player_name:playerName()}];
      try{
        await api('needoh_code_redemptions',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(redemption)});
      }catch(e){
        if(e.status===409||/duplicate|unique/i.test(e.message))return toast('Global code already redeemed!');
        throw e;
      }

      const amount=Math.max(1,Math.floor(Number(promo.amount)||0));
      addCoins(amount);
      save(true);
      render();
      toast(`🎟 ${promo.code}: ${fmt(amount)} coins!`);
      showCodes();
    }catch(e){
      console.warn('Global code redeem failed',e);
      toast('Could not redeem global code');
    }
  };

  const previousShowCodes=showCodes;
  showCodes=function(){
    previousShowCodes();
    const note=document.querySelector('#hubContent .notice');
    if(note)note.textContent='Regular codes and Attila-created global codes can be redeemed here. Global codes work across devices and each player can use each code once.';
    if($('redeemCodeBtn'))$('redeemCodeBtn').onclick=redeemCode;
  };

  const previousShowAdmin=showAdmin;
  showAdmin=async function(){
    await previousShowAdmin();
    if(!isAdmin())return;
    const host=$('hubContent');
    if(!host)return;

    const card=document.createElement('div');
    card.className='card';
    card.style.marginTop='14px';
    card.innerHTML=`<h3>🎟️ Create Global Code</h3>
      <p class="small">Create a promo code everyone can use once. The reward is shared online across every device.</p>
      <label class="small">Code</label>
      <input class="field" id="globalCodeName" maxlength="24" placeholder="Example: ATTILA100">
      <label class="small">Coins each player gets</label>
      <input class="field" id="globalCodeAmount" type="number" min="1" max="1000000000000000000" value="1000000">
      <button class="btn admin" id="createGlobalCodeBtn">🎟️ CREATE GLOBAL CODE</button>
      <div id="globalCodeResult" class="notice" style="display:none;margin-top:12px"></div>
      <div id="globalCodeList" class="small" style="margin-top:12px">Loading your global codes…</div>`;
    host.appendChild(card);

    async function refreshCodes(){
      try{
        const rows=await api('needoh_global_codes?select=code,amount,active,created_at&order=created_at.desc&limit=20');
        $('globalCodeList').innerHTML=(rows||[]).length
          ? '<b>Active global codes:</b><br>'+rows.map(x=>`${escapeHtml(x.code)} — 🪙 ${fmt(Number(x.amount||0))}${x.active?'':' (off)'}`).join('<br>')
          : 'No global codes created yet.';
      }catch(e){$('globalCodeList').textContent='Could not load global codes.'}
    }

    $('globalCodeName').oninput=()=>{$('globalCodeName').value=normalizeCode($('globalCodeName').value)};
    $('createGlobalCodeBtn').onclick=async()=>{
      const code=normalizeCode($('globalCodeName').value);
      const amount=Math.min(1e18,Math.max(1,Math.floor(Number($('globalCodeAmount').value)||0)));
      if(code.length<3)return toast('Code must be at least 3 characters');
      if(!amount)return toast('Enter a coin amount');
      try{
        await api('needoh_global_codes',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{code,reward_type:'coins',amount,created_by:'Attila',active:true}])});
        $('globalCodeResult').style.display='block';
        $('globalCodeResult').innerHTML=`✅ <b>${escapeHtml(code)}</b> created — everyone can redeem it once for 🪙 ${fmt(amount)} coins.`;
        $('globalCodeName').value='';
        toast('🎟️ Global code created!');
        refreshCodes();
      }catch(e){
        if(e.status===409||/duplicate|unique/i.test(e.message))return toast('That global code already exists');
        console.warn('Global code creation failed',e);
        toast('Could not create global code');
      }
    };
    refreshCodes();
  };

  $('codesBtn').onclick=showCodes;
  $('adminBtn').onclick=showAdmin;
})();