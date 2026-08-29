(() => {
  const SB_URL='https://xawvgrktcqbtmcbpuizg.supabase.co';
  const SB_KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
  const headers={apikey:SB_KEY,'Content-Type':'application/json'};
  const startedAt=Date.now();
  let initialized=false,lastSeenId=null,polling=false;

  async function api(path,opts={}){
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{...headers,...(opts.headers||{})}});
    if(!r.ok)throw new Error((await r.text())||`Announcement error ${r.status}`);
    if(r.status===204)return null;
    const t=await r.text();
    return t?JSON.parse(t):null;
  }

  function closeBroadcast(){
    document.getElementById('needohGlobalBroadcast')?.remove();
  }

  function showBroadcast(text){
    const message=String(text||'').trim();
    if(!message)return;
    try{if(typeof stopHold==='function')stopHold()}catch(e){}
    try{document.activeElement?.blur()}catch(e){}
    closeBroadcast();

    const overlay=document.createElement('div');
    overlay.id='needohGlobalBroadcast';
    Object.assign(overlay.style,{
      position:'fixed',inset:'0',zIndex:'2147483647',background:'rgba(5,7,20,.97)',
      display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',
      gap:'28px',padding:'28px',boxSizing:'border-box',textAlign:'center',color:'#fff'
    });

    const label=document.createElement('div');
    label.textContent='📢 ATTILA ANNOUNCEMENT';
    Object.assign(label.style,{
      fontSize:'clamp(18px,3vw,34px)',fontWeight:'1000',letterSpacing:'3px',
      color:'#ffd84d',textShadow:'0 0 22px rgba(255,216,77,.55)'
    });

    const words=document.createElement('div');
    words.textContent=message;
    Object.assign(words.style,{
      maxWidth:'1100px',maxHeight:'62vh',overflow:'auto',whiteSpace:'pre-wrap',wordBreak:'break-word',
      fontSize:'clamp(34px,8vw,88px)',lineHeight:'1.05',fontWeight:'1000',
      textShadow:'0 5px 25px rgba(0,0,0,.8)'
    });

    const button=document.createElement('button');
    button.textContent='OK — BACK TO GAME';
    Object.assign(button.style,{
      border:'0',borderRadius:'18px',padding:'16px 28px',fontSize:'20px',fontWeight:'900',
      cursor:'pointer',background:'#fff',color:'#11162a',boxShadow:'0 8px 30px rgba(0,0,0,.4)'
    });
    button.onclick=closeBroadcast;

    overlay.append(label,words,button);
    document.body.appendChild(overlay);
  }

  async function latestAttilaMessage(){
    const rows=await api('needoh_messages?select=id,author,body,created_at&author=ilike.Attila&order=created_at.desc&limit=1');
    return rows?.[0]||null;
  }

  async function checkBroadcast(){
    if(polling)return;
    polling=true;
    try{
      const latest=await latestAttilaMessage();
      if(!latest){initialized=true;return}
      if(!initialized){
        initialized=true;
        lastSeenId=latest.id;
        const created=Date.parse(latest.created_at)||0;
        if(created>=startedAt-1500)showBroadcast(latest.body);
        return;
      }
      if(latest.id!==lastSeenId){
        lastSeenId=latest.id;
        showBroadcast(latest.body);
      }
    }catch(e){
      console.warn('Global announcement check failed',e);
    }finally{
      polling=false;
    }
  }

  const previousSendMessage=sendMessage;
  sendMessage=async function(){
    if(!isAdmin())return previousSendMessage();
    const text=String($('messageText')?.value||'').trim().slice(0,300);
    const date=$('messageDate')?.value;
    if(!text||!date)return toast('Add a message and date');
    try{
      const rows=await api('needoh_messages',{
        method:'POST',
        headers:{Prefer:'return=representation'},
        body:JSON.stringify([{author:playerName(),message_date:date,body:text}])
      });
      const sent=rows?.[0];
      if(sent){initialized=true;lastSeenId=sent.id}
      showBroadcast(text);
      toast('📢 Global announcement sent!');
      showMessages();
    }catch(e){
      console.warn('Could not send announcement',e);
      toast('Could not send global announcement');
    }
  };

  checkBroadcast();
  setInterval(checkBroadcast,2000);
  window.__needohBroadcastLoaded=true;
})();