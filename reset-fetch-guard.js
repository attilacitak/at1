(()=>{
if(window.__needohResetFetchGuardLoaded)return;
window.__needohResetFetchGuardLoaded=true;
const SB='https://xawvgrktcqbtmcbpuizg.supabase.co';
const KEY='sb_publishable_PjR-iiuLbcoFqzjF8W-7Rg_S4X5cWwa';
const nativeFetch=window.fetch.bind(window);
function requestUrl(input){try{if(typeof input==='string')return input;if(input instanceof URL)return input.href;return input?.url||''}catch(_){return''}}
function methodOf(input,init){return String(init?.method||input?.method||'GET').toUpperCase()}
window.fetch=async function(input,init){
  let url=requestUrl(input),method=methodOf(input,init);
  const isResetGet=method==='GET'&&url.startsWith(`${SB}/rest/v1/needoh_resets?`)&&!/[?&]claimed=/.test(url);
  if(!isResetGet)return nativeFetch(input,init);
  const guarded=url+(url.includes('?')?'&':'?')+'claimed=eq.false';
  const response=await nativeFetch(guarded,init);
  if(!response.ok)return response;
  try{
    const rows=await response.clone().json(),first=Array.isArray(rows)?rows[0]:null;
    if(first?.id){
      await nativeFetch(`${SB}/rest/v1/needoh_resets?id=eq.${encodeURIComponent(first.id)}`,{
        method:'PATCH',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({claimed:true,claimed_at:new Date().toISOString()})
      });
    }
  }catch(e){console.warn('Reset acknowledgement failed',e)}
  return response;
};
})();
