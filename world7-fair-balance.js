(()=>{
if(window.__needohWorld7FairLoaded)return;
const W5_UNLOCK=1e19,W6_UNLOCK=1e23,W7_UNLOCK=1e27;
const W5=[
{name:'Transcendent',icon:'🪐',color:'#5ae9ff',glow:'#5ae9ff',shape:'48% 52% 39% 61% / 61% 42% 58% 39%',mult:7.5e8,chance:72,min:1.5e19,max:2.4e19,sound:680},
{name:'Celestial',icon:'🌠',color:'#c78cff',glow:'#e5c4ff',shape:'36% 64% 56% 44% / 45% 55% 45% 55%',mult:3e9,chance:24,min:6e19,max:9e19,sound:760},
{name:'Omniversal',icon:'♾️',color:'#ff66d4',glow:'#ffb2ec',shape:'50% 35% 50% 35% / 35% 50% 35% 50%',mult:1.5e10,chance:4,min:3e20,max:5e20,sound:900}
];
const W6=[
{name:'Glitched',icon:'👾',color:'linear-gradient(135deg,#31ff9a,#10131d,#9b5cff)',glow:'#31ff9a',shape:'35% 65% 57% 43% / 63% 35% 65% 37%',mult:7e10,chance:48,min:1e23,max:2e23,sound:440},
{name:'Corrupted',icon:'☣️',color:'linear-gradient(135deg,#ff365d,#130b19,#8c2cff)',glow:'#ff365d',shape:'68% 32% 41% 59% / 31% 67% 33% 69%',mult:3e11,chance:26,min:4e23,max:8e23,sound:130},
{name:'Hacker',icon:'💻',color:'linear-gradient(135deg,#00ff8c,#052d22,#041711)',glow:'#00ff8c',shape:'24% 76% 31% 69% / 71% 26% 74% 29%',mult:1.5e12,chance:14,min:1.5e24,max:3e24,sound:510},
{name:'Matrix',icon:'🟩',color:'linear-gradient(135deg,#b3ff4f,#0a180a,#00a84f)',glow:'#8dff58',shape:'56% 44% 67% 33% / 42% 61% 39% 58%',mult:8e12,chance:8,min:6e24,max:1.2e25,sound:610},
{name:'Singularity',icon:'🕳️',color:'radial-gradient(circle at 42% 38%,#ffffff 0 3%,#b76cff 6%,#15102a 35%,#020207 70%)',glow:'#c06dff',shape:'50%',mult:5e13,chance:4,min:2.5e25,max:5e25,sound:55}
];
const W7=[
{name:'Neon Void',icon:'🟣',color:'linear-gradient(135deg,#4dfcff,#5b2cff,#05050b)',glow:'#75f7ff',shape:'44% 56% 36% 64% / 58% 42% 58% 42%',mult:2e14,chance:45,min:1e27,max:2e27,sound:520},
{name:'Quantum',icon:'⚛️',color:'linear-gradient(135deg,#96ffef,#386cff,#8d45ff)',glow:'#96ffef',shape:'61% 39% 53% 47% / 34% 66% 42% 58%',mult:8e14,chance:28,min:4e27,max:8e27,sound:660},
{name:'Paradox',icon:'🔀',color:'linear-gradient(135deg,#ff5fb7,#4c1c86,#61efff)',glow:'#ff80c9',shape:'28% 72% 63% 37% / 67% 31% 69% 33%',mult:4e15,chance:15,min:1.5e28,max:3e28,sound:710},
{name:'Reality',icon:'🪞',color:'linear-gradient(135deg,#ffffff,#7af5ff,#a16dff,#111225)',glow:'#e4fbff',shape:'50% 50% 29% 71% / 41% 59% 41% 59%',mult:2e16,chance:8,min:6e28,max:1.2e29,sound:880},
{name:'Omega',icon:'Ω',color:'radial-gradient(circle at 35% 25%,#fff 0 3%,#ffd45d 8%,#8e35ff 42%,#05030b 78%)',glow:'#ffd45d',shape:'50%',mult:1e17,chance:4,min:2.5e29,max:5e29,sound:64}
];
const names=new Set([...W5,...W6,...W7].map(x=>x.name));
function replace(base,arr){const out=[...base].filter(x=>!names.has(x.name));for(const r of arr)out.push(r);return out}
const baseAll=allRarities;
allRarities=function(){return replace(baseAll(),[...W5,...W6,...W7])};
const baseWorld=worldList;
worldList=function(w=state.world){w=Number(w);if(w===5)return W5;if(w===6)return W6;if(w===7)return W7;return baseWorld(w)};
const baseUnlocked=isWorldUnlocked;
isWorldUnlocked=function(w){w=Number(w);if(w===5)return !!state.world5Unlocked;if(w===6)return !!state.world6Unlocked;if(w===7)return !!state.world7Unlocked;return baseUnlocked(w)};
state.world7Unlocked=!!state.world7Unlocked;
WORLD_META[4]={...(WORLD_META[4]||{}),next:5,threshold:W5_UNLOCK,nextText:'🪐 World 5',info:'Reach 10 quintillion coins to enter the Celestial Nexus.'};
WORLD_META[5]={...(WORLD_META[5]||{}),name:'🪐 World 5 — Celestial Nexus',next:6,threshold:W6_UNLOCK,nextText:'🧪 World 6',info:'Reach 100 sextillion coins to breach the Glitched Dimension.'};
WORLD_META[6]={...(WORLD_META[6]||{}),name:'🧪 World 6 — Glitched Dimension',next:7,threshold:W7_UNLOCK,nextText:'🌌 World 7',info:'Reach 1 octillion coins to fracture reality and unlock World 7.'};
WORLD_META[7]={name:'🌌 World 7 — Reality Fracture',next:1,threshold:0,nextText:'🌎 World 1',info:'Reality Fracture: hunt 🟣 Neon Void through Ω Omega squishies.'};
const baseSwitch=switchWorld;
switchWorld=function(){const w=Number(state.world);if(w===4){if(!state.world5Unlocked){if(Number(state.coins)<W5_UNLOCK)return toast(`Reach ${fmt(W5_UNLOCK)} coins first!`);state.world5Unlocked=true;toast('🪐 World 5 unlocked!')}state.world=5;restock(true);if(typeof resetBossForWorld==='function')resetBossForWorld();render();save(true);return}if(w===5){if(!state.world6Unlocked){if(Number(state.coins)<W6_UNLOCK)return toast(`Reach ${fmt(W6_UNLOCK)} coins first!`);state.world6Unlocked=true;toast('🧪 World 6 unlocked!')}state.world=6;restock(true);if(typeof resetBossForWorld==='function')resetBossForWorld();render();save(true);return}if(w===6){if(!state.world7Unlocked){if(Number(state.coins)<W7_UNLOCK)return toast(`Reach ${fmt(W7_UNLOCK)} coins first!`);state.world7Unlocked=true;toast('🌌 World 7 unlocked!')}state.world=7;restock(true);if(typeof resetBossForWorld==='function')resetBossForWorld();render();save(true);return}if(w===7){state.world=1;restock(true);if(typeof resetBossForWorld==='function')resetBossForWorld();render();save(true);return}return baseSwitch()};
const baseBoss=typeof bossStatsForWorld==='function'?bossStatsForWorld:null;
if(baseBoss)bossStatsForWorld=function(w){w=Number(w);if(w===5)return{name:'Celestial Devourer',icon:'🐉',hp:5e20,reward:1e21};if(w===6)return{name:'Rift Architect',icon:'🧬',hp:5e24,reward:1e25};if(w===7)return{name:'Reality Eater',icon:'🪞',hp:5e28,reward:1e29};return baseBoss(w)};
const basePool=typeof availableBoxPool==='function'?availableBoxPool:null;
if(basePool)availableBoxPool=function(){let p=[...basePool()].filter(x=>!names.has(x.name));if(state.world5Unlocked)p.push(...W5);if(state.world6Unlocked)p.push(...W6);if(state.world7Unlocked)p.push(...W7);return p};
const baseRender=render;
render=function(){const v=baseRender();const w=Number(state.world),btn=$('worldBtn'),bar=$('worldProgress'),txt=$('progressText'),info=$('worldInfo');if(!btn)return v;let unlock=0,flag='',label='';if(w===4){unlock=W5_UNLOCK;flag='world5Unlocked';label='🪐 World 5'}else if(w===5){unlock=W6_UNLOCK;flag='world6Unlocked';label='🧪 World 6'}else if(w===6){unlock=W7_UNLOCK;flag='world7Unlocked';label='🌌 World 7'}else if(w===7){btn.textContent='🌎 Return to World 1';if(bar)bar.style.width='100%';if(txt)txt.textContent='🌌 REALITY FRACTURE ENDGAME';if(info)info.textContent=WORLD_META[7].info;return v}else return v;const yes=!!state[flag];btn.textContent=yes?`${label} unlocked — ENTER`:`🔒 ${label} — ${fmt(unlock)} 🪙`;if(bar)bar.style.width=(yes?100:Math.min(100,Number(state.coins)/unlock*100))+'%';if(txt)txt.textContent=yes?`${label} unlocked!`:`${fmt(state.coins)} / ${fmt(unlock)} coins`;if(info)info.textContent=WORLD_META[w].info;return v};
$('worldBtn').onclick=switchWorld;render();
window.__needohWorld7FairLoaded=true;window.__needohWorld7={W5_UNLOCK,W6_UNLOCK,W7_UNLOCK,W7};
})();