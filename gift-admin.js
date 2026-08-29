const GIFT_REDEEM_KEY="needohRedeemedGiftCodes";

function giftEncodeText(text){
  const bytes=new TextEncoder().encode(text);
  let binary="";
  for(const b of bytes) binary+=String.fromCharCode(b);
  return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
function giftDecodeText(value){
  let s=String(value||"").replace(/-/g,"+").replace(/_/g,"/");
  while(s.length%4)s+="=";
  const binary=atob(s),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function giftChecksum(payload){
  let h=2166136261;
  const text=payload+"|NeedohAttilaGiftV1";
  for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);
  return(h>>>0).toString(36).toUpperCase().padStart(7,"0").slice(-7);
}
function makeGiftCode(gift){
  const payload=giftEncodeText(JSON.stringify(gift));
  return`GIFT-${payload}-${giftChecksum(payload)}`;
}
function parseGiftCode(code){
  const raw=String(code||"").trim();
  if(!/^GIFT-/i.test(raw))return null;
  const body=raw.slice(5),cut=body.lastIndexOf("-");
  if(cut<1)throw new Error("Invalid gift code");
  const payload=body.slice(0,cut),check=body.slice(cut+1).toUpperCase();
  if(giftChecksum(payload)!==check)throw new Error("Invalid gift code");
  const gift=JSON.parse(giftDecodeText(payload));
  if(!gift||gift.v!==1||!cleanPlayerName(gift.to)||!gift.type||!gift.id)throw new Error("Invalid gift code");
  return gift;
}
function getRedeemedGiftCodes(){
  try{
    const x=JSON.parse(localStorage.getItem(GIFT_REDEEM_KEY)||"[]");
    return Array.isArray(x)?x:[];
  }catch(e){return[]}
}
function markGiftRedeemed(code){
  const list=getRedeemedGiftCodes();
  if(!list.includes(code)){
    list.push(code);
    localStorage.setItem(GIFT_REDEEM_KEY,JSON.stringify(list.slice(-200)));
  }
}
function giftRewardText(gift){
  if(gift.type==="coins")return`${fmt(gift.value)} coins`;
  if(gift.type==="squishy")return`${rarity(gift.item).icon} ${gift.item} squishy`;
  if(gift.type==="worlds")return"all worlds unlocked";
  if(gift.type==="allSquishies")return"all squishies";
  if(gift.type==="power")return`${gift.value}× base multiplier`;
  return"reward";
}
function applyGift(gift){
  const target=cleanPlayerName(gift.to);
  if(target.toLowerCase()!==playerName().toLowerCase())throw new Error(`This gift is for ${target}, not ${playerName()}.`);
  if(gift.type==="coins"){
    const amount=Math.min(1e18,Math.max(1,Number(gift.value)||0));
    addCoins(amount);
  }else if(gift.type==="squishy"){
    const r=allRarities().find(x=>x.name===gift.item);
    if(!r)throw new Error("That squishy no longer exists.");
    if(!state.owned.includes(r.name))state.owned.push(r.name);
    state.selected=r.name;
  }else if(gift.type==="worlds"){
    state.world2Unlocked=state.world3Unlocked=state.world4Unlocked=true;
  }else if(gift.type==="allSquishies"){
    state.owned=[...new Set(allRarities().map(r=>r.name))];
  }else if(gift.type==="power"){
    state.baseMult*=Math.min(1000,Math.max(2,Number(gift.value)||2));
  }else{
    throw new Error("Unknown gift reward.");
  }
  checkAchievements();
  save(true);
  render();
}

showCodes=function(){
  openHub("🎟 Redeem Codes",`<div class="card"><h3>Enter a code</h3><input class="field" id="codeInput" placeholder="Type or paste code here"><button class="btn gold" id="redeemCodeBtn">Redeem</button></div><div class="notice" style="margin-top:12px">Regular promo codes are one-time per save. Admin gift codes can be made for a specific player name and are remembered separately on this browser.</div>`);
  $("redeemCodeBtn").onclick=redeemCode;
};
redeemCode=function(){
  const raw=String($("codeInput").value||"").trim();
  if(!raw)return;
  if(/^GIFT-/i.test(raw)){
    let gift;
    try{gift=parseGiftCode(raw)}catch(e){return toast(e.message||"Invalid gift code")}
    if(getRedeemedGiftCodes().includes(raw))return toast("Gift code already redeemed!");
    try{applyGift(gift)}catch(e){return toast(e.message||"Gift could not be redeemed")}
    markGiftRedeemed(raw);
    toast(`🎁 Gift from Attila: ${giftRewardText(gift)}!`);
    showCodes();
    return;
  }
  const code=raw.toUpperCase();
  if(state.redeemedCodes.includes(code))return toast("Code already redeemed!");
  const reward=CODES[code];
  if(!reward)return toast("Invalid code");
  state.redeemedCodes.push(code);
  addCoins(reward.coins);
  toast(`🎟 ${code}: ${reward.text}!`);
  save(true);
  render();
  showCodes();
};

showAdmin=function(){
  if(!isAdmin())return toast("Admin access requires the name Attila");
  const squishyOptions=allRarities().map(r=>`<option value="${escapeHtml(r.name)}">${r.icon} ${escapeHtml(r.name)}</option>`).join("");
  openHub("🛡️ Attila Admin Panel",`<div class="grid2"><div class="card"><h3>💰 Coins</h3><button class="btn gold" id="adminCoins">+1 Trillion Coins</button></div><div class="card"><h3>🌎 Worlds</h3><button class="btn gold" id="adminWorlds">Unlock All Worlds</button></div><div class="card"><h3>🎒 Squishies</h3><button class="btn gold" id="adminSquishies">Give All Squishies</button></div><div class="card"><h3>⚡ Power</h3><button class="btn gold" id="adminPower">100× Base Multiplier</button></div><div class="card"><h3>👹 Boss</h3><button class="btn danger" id="adminKillBoss">Defeat Current Boss</button></div><div class="card danger-box"><h3>🧹 Reset extras</h3><button class="btn danger" id="adminResetExtras">Reset Quests / Achievements / Codes</button></div></div><div class="card" style="margin-top:14px"><h3>🎁 Give Another Player Stuff</h3><p class="small">Create a gift code for an exact player name. They redeem it from 🎟 Codes on their own device.</p><label class="small" for="giftPlayer">Player name</label><input class="field" id="giftPlayer" maxlength="20" placeholder="Example: Arlo"><label class="small" for="giftType">Reward</label><select class="field" id="giftType"><option value="coins">🪙 Coins</option><option value="squishy">🫧 Specific Squishy</option><option value="worlds">🌎 Unlock All Worlds</option><option value="allSquishies">🎒 Give All Squishies</option><option value="power">⚡ Power Multiplier</option></select><div id="giftAmountWrap"><label class="small" id="giftAmountLabel" for="giftAmount">Coin amount</label><input class="field" id="giftAmount" type="number" min="1" max="1000000000000000000" value="1000000"></div><div id="giftSquishyWrap" style="display:none"><label class="small" for="giftSquishy">Squishy</label><select class="field" id="giftSquishy">${squishyOptions}</select></div><button class="btn admin" id="generateGiftCode">Generate Gift Code</button><div id="giftResult" style="display:none;margin-top:12px"><label class="small" for="giftCodeOutput">Send this code to the player</label><textarea class="field" id="giftCodeOutput" rows="4" readonly></textarea><div class="small" id="giftSummary"></div></div></div><p class="small" style="margin-top:12px">Admin is intentionally tied to the saved name “Attila.” Gift codes work across devices without a database, but this is game-level protection rather than secure account authentication.</p>`);
  $("adminCoins").onclick=()=>{addCoins(1e12);save(true);render();toast("🛡️ +1T coins")};
  $("adminWorlds").onclick=()=>{state.world2Unlocked=state.world3Unlocked=state.world4Unlocked=true;save(true);render();toast("🛡️ All worlds unlocked")};
  $("adminSquishies").onclick=()=>{state.owned=[...new Set(allRarities().map(r=>r.name))];save(true);render();toast("🛡️ All squishies granted")};
  $("adminPower").onclick=()=>{state.baseMult*=100;save(true);render();toast("🛡️ Power boosted")};
  $("adminKillBoss").onclick=()=>{ensureBoss();state.boss.hp=1;attackBoss()};
  $("adminResetExtras").onclick=()=>{state.claimedQuests=[];state.unlockedAchievements=[];state.claimedAchievements=[];state.redeemedCodes=[];save(true);toast("🛡️ Extras reset");showAdmin()};
  function updateGiftFields(){
    const type=$("giftType").value;
    $("giftAmountWrap").style.display=["coins","power"].includes(type)?"block":"none";
    $("giftSquishyWrap").style.display=type==="squishy"?"block":"none";
    if(type==="coins"){
      $("giftAmountLabel").textContent="Coin amount";
      $("giftAmount").value="1000000";
      $("giftAmount").max="1000000000000000000";
    }else if(type==="power"){
      $("giftAmountLabel").textContent="Power multiplier (2–1000×)";
      $("giftAmount").value="10";
      $("giftAmount").max="1000";
    }
  }
  $("giftType").onchange=updateGiftFields;
  updateGiftFields();
  $("generateGiftCode").onclick=()=>{
    const to=cleanPlayerName($("giftPlayer").value),type=$("giftType").value;
    if(!to)return toast("Enter the player's exact name");
    const gift={v:1,id:Date.now().toString(36)+Math.random().toString(36).slice(2,8),to,type};
    if(type==="coins"){
      gift.value=Math.min(1e18,Math.max(1,Math.floor(Number($("giftAmount").value)||0)));
      if(!gift.value)return toast("Enter a coin amount");
    }else if(type==="power"){
      gift.value=Math.min(1000,Math.max(2,Number($("giftAmount").value)||10));
    }else if(type==="squishy"){
      gift.item=$("giftSquishy").value;
    }
    const code=makeGiftCode(gift);
    $("giftCodeOutput").value=code;
    $("giftSummary").textContent=`For ${to}: ${giftRewardText(gift)}`;
    $("giftResult").style.display="block";
    $("giftCodeOutput").focus();
    $("giftCodeOutput").select();
    toast("🎁 Gift code generated!");
  };
};

$("codesBtn").onclick=showCodes;
$("adminBtn").onclick=showAdmin;
