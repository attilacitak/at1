(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const keyFor=(name=playerName())=>cleanPlayerName(name).toLowerCase();
  let processing=false;

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Online error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();
    return t?JSON.parse(t):null;
  }

  async function checkDeductions(){
    if(processing||playerName()==='Player')return;
    processing=true;
    try{
      const key=encodeURIComponent(keyFor());
      const rows=await api(`needoh_deductions?select=id,amount,admin_name&target_key=eq.${key}&claimed=eq.false&order=created_at.asc`);
      for(const d of rows||[]){
        const amount=Math.max(0,Math.floor(Number(d.amount)||0));
        const before=Math.max(0,Number(state.coins)||0);
        state.coins=Math.max(0,before-amount);
        save(true);
        render();
        await api(`needoh_deductions?id=eq.${encodeURIComponent(d.id)}&target_key=eq.${key}`,{
          method:'PATCH',
          headers:{Prefer:'return=minimal'},
          body:JSON.stringify({claimed:true,claimed_at:new Date().toISOString()})
        });
        const removed=Math.min(before,amount);
        toast(`🛡️ Attila took ${fmt(removed)} coins`);
      }
    }catch(e){
      console.warn('Admin deduction check failed',e);
    }finally{
      processing=false;
    }
  }

  const previousShowAdmin=showAdmin;
  showAdmin=async function(){
    await previousShowAdmin();
    if(!isAdmin())return;
    try{
      const players=await api('needoh_players?select=player_key,display_name,coins,world&order=display_name.asc&limit=200');
      const others=(players||[]).filter(p=>p.player_key!=='attila');
      const options=others.map(p=>`<option value="${escapeHtml(p.player_key)}">${escapeHtml(p.display_name)} — 🪙 ${fmt(Number(p.coins||0))}</option>`).join('');
      const host=$('hubContent');
      if(!host)return;
      const card=document.createElement('div');
      card.className='card danger-box';
      card.style.marginTop='14px';
      card.innerHTML=`<h3>💸 Take Player Coins</h3><p class="small">Choose a player and remove coins from their balance. Their balance will never go below 0.</p><label class="small">Player</label><select class="field" id="takePlayer">${options||'<option value="">No other online players yet</option>'}</select><label class="small">Amount to take</label><input class="field" id="takeAmount" type="number" min="1" value="1000"><button class="btn danger" id="takeCoinsBtn">💸 TAKE COINS</button>`;
      host.appendChild(card);
      $('takeCoinsBtn').onclick=async()=>{
        const target=$('takePlayer').value;
        const amount=Math.max(1,Math.floor(Number($('takeAmount').value)||0));
        if(!target)return toast('No player selected');
        if(!amount)return toast('Enter an amount');
        const p=others.find(x=>x.player_key===target);
        try{
          await api('needoh_deductions',{
            method:'POST',
            headers:{Prefer:'return=minimal'},
            body:JSON.stringify([{
              target_key:target,
              target_name:p?.display_name||target,
              admin_name:'Attila',
              amount
            }])
          });
          toast(`💸 Taking ${fmt(amount)} coins from ${p?.display_name||target}`);
        }catch(e){
          toast('Could not take coins');
        }
      };
    }catch(e){
      console.warn('Could not load take-coins admin control',e);
    }
  };

  $('adminBtn').onclick=showAdmin;
  checkDeductions();
  setInterval(checkDeductions,5000);
})();