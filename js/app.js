// ══ XP SYSTEM ══
function xpForLevel(lvl){if(lvl<=1)return 0;let t=0,b=200;for(let i=2;i<=lvl;i++){t+=Math.round(b);b*=1.5;}return t;}
function getLevelFromXP(xp){let l=1;while(xpForLevel(l+1)<=xp)l++;return l;}
function xpProgressInLevel(xp){const l=getLevelFromXP(xp),s=xpForLevel(l),e=xpForLevel(l+1),p=Math.min(100,Math.round(((xp-s)/(e-s))*100));return{lvl:l,start:s,end:e,pct:p};}
const LEVEL_TITLES=['','Initiate','Apprentice','Scholar','Adept','Mage','Archmage','Sage','Elder','Champion','Legend','Myth','Eternal','Transcendent','Celestial','Cosmic'];
function levelTitle(l){return LEVEL_TITLES[Math.min(l,LEVEL_TITLES.length-1)]||'Immortal';}

// ══ ACHIEVEMENTS ══
const ACHIEVEMENTS=[
  {id:'first_blood',icon:'⚔️',name:'First Blood',desc:'Complete your first quiz node',xp:50,condition:u=>u.totalNodes>=1},
  {id:'scholar',icon:'📜',name:'Scholar',desc:'Complete 5 quiz nodes',xp:100,condition:u=>u.totalNodes>=5},
  {id:'sage',icon:'🧙',name:'Sage',desc:'Complete 15 quiz nodes',xp:200,condition:u=>u.totalNodes>=15},
  {id:'veteran',icon:'🗡️',name:'Veteran',desc:'Complete 25 quiz nodes',xp:400,condition:u=>u.totalNodes>=25},
  {id:'streak2',icon:'🔥',name:'Spark',desc:'2-day streak',xp:30,condition:u=>u.bestStreak>=2},
  {id:'streak3',icon:'🔥',name:'On Fire',desc:'3-day streak',xp:75,condition:u=>u.bestStreak>=3},
  {id:'streak7',icon:'🌋',name:'Inferno',desc:'7-day streak',xp:200,condition:u=>u.bestStreak>=7},
  {id:'streak14',icon:'☄️',name:'Comet',desc:'14-day streak',xp:500,condition:u=>u.bestStreak>=14},
  {id:'streak30',icon:'☀️',name:'Solar Forge',desc:'30-day streak',xp:1000,condition:u=>u.bestStreak>=30},
  {id:'perfect',icon:'💎',name:'Flawless',desc:'Complete a node without losing a heart',xp:100,condition:u=>u.perfectNodes>=1},
  {id:'perfectx3',icon:'💎',name:'Diamond Scholar',desc:'3 perfect nodes',xp:200,condition:u=>u.perfectNodes>=3},
  {id:'perfectx5',icon:'👑',name:'Crown of Perfection',desc:'5 perfect nodes',xp:300,condition:u=>u.perfectNodes>=5},
  {id:'perfectx10',icon:'🌟',name:'Untouchable',desc:'10 perfect nodes',xp:600,condition:u=>u.perfectNodes>=10},
  {id:'lvl3',icon:'⭐',name:'Rising Star',desc:'Reach Level 3',xp:50,condition:u=>getLevelFromXP(u.xp)>=3},
  {id:'lvl5',icon:'🌟',name:'Apprentice Mage',desc:'Reach Level 5',xp:150,condition:u=>getLevelFromXP(u.xp)>=5},
  {id:'lvl10',icon:'🏆',name:'Grand Scholar',desc:'Reach Level 10',xp:400,condition:u=>getLevelFromXP(u.xp)>=10},
  {id:'xp200',icon:'✨',name:'First Steps',desc:'Earn 200 XP',xp:0,condition:u=>u.xp>=200},
  {id:'xp500',icon:'💫',name:'Gathering Power',desc:'Earn 500 XP',xp:50,condition:u=>u.xp>=500},
  {id:'xp1000',icon:'⭐',name:'Thousand Points',desc:'Earn 1,000 XP',xp:100,condition:u=>u.xp>=1000},
  {id:'xp2500',icon:'🌠',name:'Constellation',desc:'Earn 2,500 XP',xp:150,condition:u=>u.xp>=2500},
  {id:'xp5000',icon:'🌌',name:'Supernova',desc:'Earn 5,000 XP',xp:500,condition:u=>u.xp>=5000},
  {id:'boss1',icon:'💀',name:'Boss Slayer',desc:'Defeat your first Boss node',xp:200,condition:u=>u.bossesDefeated>=1},
  {id:'boss3',icon:'🐲',name:'Dragon Hunter',desc:'Defeat 3 Boss nodes',xp:500,condition:u=>u.bossesDefeated>=3},
  {id:'quest1',icon:'🗺️',name:'Quest Bearer',desc:'Complete your first full quest',xp:250,condition:u=>u.questsCompleted>=1},
  {id:'quest2',icon:'🧭',name:'Dual Conqueror',desc:'Complete two full quests',xp:500,condition:u=>u.questsCompleted>=2},
];
function checkAchievements(){
  const n=[];
  ACHIEVEMENTS.forEach(a=>{if(!UDATA.achievements.includes(a.id)&&a.condition(UDATA)){UDATA.achievements.push(a.id);UDATA.xp+=a.xp;n.push(a);}});
  if(n.length)saveUserData({achievements:UDATA.achievements,xp:UDATA.xp});return n;
}
function renderAchievements(){
  const grid=document.getElementById('ach-grid');grid.innerHTML='';
  ACHIEVEMENTS.forEach(a=>{
    const u=UDATA.achievements.includes(a.id);
    const c=document.createElement('div');c.className='ach-card '+(u?'unlocked':'locked-a');
    c.innerHTML=`<div class="ach-icon">${u?a.icon:'🔒'}</div><div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div><div class="ach-xp">${u?'Earned +'+a.xp+' XP':'+'+a.xp+' XP on unlock'}</div></div>`;
    grid.appendChild(c);
  });
}

// ══ AUTH ══
let USER=null;
let UDATA={xp:0,streak:0,bestStreak:0,lastActivityDate:null,completedNodes:{},achievements:[],totalNodes:0,perfectNodes:0,bossesDefeated:0,questsCompleted:0};
function waitForFB(){return new Promise(r=>{if(window._fbReady){r();return;}window.addEventListener('fbready',r,{once:true});});}
async function initAuth(){
  await waitForFB();
  const{auth,onAuthStateChanged}=window._fb;
  onAuthStateChanged(auth,async user=>{
    if(user){USER=user;await loadUserData();showApp();}
    else{USER=null;UDATA={xp:0,streak:0,bestStreak:0,lastActivityDate:null,completedNodes:{},achievements:[],totalNodes:0,perfectNodes:0,bossesDefeated:0,questsCompleted:0};showAuthScreen();}
  });
}
function switchAuthTab(tab){
  document.querySelectorAll('.auth-tab').forEach((t,i)=>t.classList.toggle('active',(i===0)===(tab==='login')));
  document.getElementById('auth-form-login').style.display=tab==='login'?'flex':'none';
  document.getElementById('auth-form-signup').style.display=tab==='signup'?'flex':'none';
}
async function doLogin(){
  const{auth,signInWithEmailAndPassword}=window._fb;
  const email=document.getElementById('login-email').value.trim(),pw=document.getElementById('login-pw').value;
  const btn=document.getElementById('login-btn'),err=document.getElementById('login-err');
  err.textContent='';btn.disabled=true;btn.textContent='Entering...';
  try{await signInWithEmailAndPassword(auth,email,pw);}
  catch(e){err.textContent=friendlyAuthError(e.code);btn.disabled=false;btn.textContent='Enter the Sanctum';}
}
async function doSignup(){
  const{auth,createUserWithEmailAndPassword,updateProfile}=window._fb;
  const name=document.getElementById('signup-name').value.trim(),email=document.getElementById('signup-email').value.trim(),pw=document.getElementById('signup-pw').value;
  const btn=document.getElementById('signup-btn'),err=document.getElementById('signup-err');
  if(!name){err.textContent='Enter your display name, scholar.';return;}
  err.textContent='';btn.disabled=true;btn.textContent='Forging account...';
  try{const cred=await createUserWithEmailAndPassword(auth,email,pw);await updateProfile(cred.user,{displayName:name});await initUserData(cred.user);}
  catch(e){err.textContent=friendlyAuthError(e.code);btn.disabled=false;btn.textContent='Begin Your Quest';}
}
async function doSignout(){const{auth,signOut}=window._fb;await signOut(auth);closeDropdown();}
function friendlyAuthError(code){
  const m={'auth/user-not-found':'No account found.','auth/wrong-password':'Incorrect password.','auth/invalid-email':'Invalid email.','auth/email-already-in-use':'Email already registered.','auth/weak-password':'Password must be at least 6 characters.','auth/invalid-credential':'Invalid email or password.','auth/too-many-requests':'Too many attempts. Wait a moment.'};
  return m[code]||'Something went wrong. Try again.';
}
function todayStr(){return new Date().toISOString().split('T')[0];}
async function initUserData(user){
  const{db,doc,setDoc,serverTimestamp}=window._fb;
  const fresh={displayName:user.displayName||'Scholar',xp:0,streak:0,bestStreak:0,lastActivityDate:todayStr(),completedNodes:{},achievements:[],totalNodes:0,perfectNodes:0,bossesDefeated:0,questsCompleted:0,createdAt:serverTimestamp()};
  await setDoc(doc(db,'users',user.uid),fresh);Object.assign(UDATA,fresh);
}
async function loadUserData(){
  const{db,doc,getDoc}=window._fb;
  const snap=await getDoc(doc(db,'users',USER.uid));
  if(snap.exists()){UDATA={xp:0,streak:0,bestStreak:0,lastActivityDate:null,completedNodes:{},achievements:[],totalNodes:0,perfectNodes:0,bossesDefeated:0,questsCompleted:0,...snap.data()};checkDailyStreak();}
  else await initUserData(USER);
}
async function saveUserData(delta={}){
  const{db,doc,updateDoc}=window._fb;
  Object.assign(UDATA,delta);
  try{await updateDoc(doc(db,'users',USER.uid),UDATA);}catch(e){console.error('Firestore save error:',e);}
}
function normDate(val){if(!val||val==='null')return null;if(typeof val.toDate==='function')return val.toDate().toISOString().split('T')[0];return String(val).substring(0,10);}
function checkDailyStreak(){
  const today=todayStr(),last=normDate(UDATA.lastActivityDate);
  if(!last||last===today)return;
  const diff=Math.round((new Date(today)-new Date(last))/86400000);
  if(diff>=1){UDATA.streak=0;saveUserData({streak:0});}
}

// ══ QUESTS ══
let QUESTS=[];
function _lsKey(){return'sq_quests_'+(USER?.uid||'guest');}
function _lsSave(quests){try{localStorage.setItem(_lsKey(),JSON.stringify(quests));}catch(_){}}
function _lsLoad(){try{const d=localStorage.getItem(_lsKey());return d?JSON.parse(d):[];}catch(_){return[];}}
async function loadQuests(){
  const{db,collection,getDocs}=window._fb;
  try{
    const snap=await getDocs(collection(db,'quests',USER.uid,'items'));
    QUESTS=[];snap.forEach(d=>QUESTS.push({...d.data(),_docId:d.id}));
    const lsQ=_lsLoad(),fsIds=new Set(QUESTS.map(q=>q.id));
    lsQ.forEach(q=>{if(!fsIds.has(q.id))QUESTS.push(q);});
  }catch(e){console.warn('Firestore unavailable:',e.message);QUESTS=_lsLoad();}
}
async function saveQuestToFirestore(quest){
  const{db,doc,setDoc}=window._fb;
  const all=_lsLoad().filter(q=>q.id!==quest.id);all.push(quest);_lsSave(all);
  try{await setDoc(doc(db,'quests',USER.uid,'items',quest.id),quest);}catch(e){console.warn('Firestore save skipped:',e.message);}
}
async function deleteQuestFromFirestore(questId){
  const{db,doc,deleteDoc}=window._fb;
  _lsSave(_lsLoad().filter(q=>q.id!==questId));
  try{await deleteDoc(doc(db,'quests',USER.uid,'items',questId));}catch(e){console.warn('Firestore delete skipped:',e.message);}
}

// ══ UI ══
function showAuthScreen(){document.getElementById('auth-screen').style.display='flex';document.getElementById('app-shell').style.display='none';}
async function showApp(){
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('app-shell').style.display='flex';
  await loadQuests();updateHeaderStats();updateHeaderAvatar();showPage('home');
}
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const p=document.getElementById('page-'+name);if(p)p.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  if(name==='home')document.getElementById('tab-quests')?.classList.add('active');
  if(name==='upload')document.getElementById('tab-upload')?.classList.add('active');
  if(name==='achievements')document.getElementById('tab-ach')?.classList.add('active');
  if(name==='leaderboard')document.getElementById('tab-lb')?.classList.add('active');
  if(name==='home')renderHome();
  if(name==='achievements')renderAchievements();
  if(name==='levels')renderLevelTree();
  if(name==='leaderboard')loadLeaderboard();
  if(name==='upload')resetUploadPage();
  closeDropdown();
  // Scroll to top on page change
  window.scrollTo(0,0);
}
function updateHeaderStats(){
  const{lvl,pct}=xpProgressInLevel(UDATA.xp);
  document.getElementById('hdr-xp').textContent=UDATA.xp.toLocaleString();
  document.getElementById('hdr-streak').textContent=UDATA.streak;
  document.getElementById('hdr-lvl-lbl').textContent=`LVL ${lvl} · XP`;
  document.getElementById('hdr-xp-fill').style.width=pct+'%';
}
function toggleDropdown(){const d=document.getElementById('dropdown');d.style.display=d.style.display==='none'?'block':'none';}
function closeDropdown(){const d=document.getElementById('dropdown');if(d)d.style.display='none';}
document.addEventListener('click',e=>{if(!e.target.closest('.hdr-right'))closeDropdown();});
function openModal({title,body,confirmText='Charge!',onConfirm}){
  document.getElementById('modal-title').textContent=title;
  document.getElementById('modal-body').textContent=body;
  document.getElementById('modal-confirm').textContent=confirmText;
  document.getElementById('modal-confirm').onclick=()=>{closeModal();onConfirm&&onConfirm();};
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(){document.getElementById('modal-overlay').classList.remove('open');}
function showLevelUp(l){document.getElementById('lu-title').textContent=`Level ${l} — ${levelTitle(l)}!`;document.getElementById('levelup-overlay').classList.add('show');}
function closeLevelUp(){document.getElementById('levelup-overlay').classList.remove('show');}
let _toastTimer;
function showToast(msg,dur=4000){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(_toastTimer);_toastTimer=setTimeout(()=>t.classList.remove('show'),dur);
}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function levenshtein(a,b){
  const m=a.length,n=b.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i||j));
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDropdown();}});

// ══ HOME ══
function renderHome(){
  const firstName=USER?.displayName?.split(' ')[0]||'Scholar';
  document.getElementById('home-greeting').textContent=`Welcome back, ${firstName}`;
  const s=UDATA.streak||0;
  document.getElementById('home-streak-msg').textContent=
    s>=7?`🔥 ${s}-day streak — the forge burns bright!`:
    s>=3?`🔥 ${s}-day streak — keep the flame alive!`:
    s===1?'✨ You studied today — streak begun!':
    '⚔️ Begin a quest today to start your streak.';
  renderFilterPills();
  const active=[],available=[],done=[];
  filterQuests(QUESTS).forEach(q=>{
    const completed=q.nodes.filter(n=>UDATA.completedNodes[n.id]).length;
    const total=q.nodes.length,pct=Math.round((completed/total)*100);
    const entry={q,completed,total,pct};
    if(completed===0)available.push(entry);
    else if(completed===total)done.push(entry);
    else active.push(entry);
  });
  renderQuestGrid('grid-active',active,'active');
  renderQuestGrid('grid-available',available,'available');
  renderQuestGrid('grid-done',done,'completed');
  document.getElementById('sh-active').style.display=active.length?'':'none';
  document.getElementById('sh-done').style.display=done.length?'':'none';
  document.getElementById('sh-available').style.display=available.length?'':'none';
  const total=active.length+available.length+done.length;
  document.getElementById('no-quests').style.display=(QUESTS.length===0&&!document.getElementById('quest-search').value)?'':'none';
  document.getElementById('no-results').style.display=(total===0&&QUESTS.length>0)?'':'none';
}
function renderQuestGrid(gridId,items,status){
  const grid=document.getElementById(gridId);grid.innerHTML='';
  items.forEach(({q,completed,total,pct})=>{
    const card=document.createElement('div');
    card.className='quest-card'+(status==='completed'?' completed':'');
    const bc={active:'badge-active',available:'badge-available',completed:'badge-completed'}[status];
    const bt={active:'In Progress',available:'Available',completed:'✓ Completed'}[status];
    const fc=status==='completed'?'done':'active';
    let actions='';
    if(status==='available')actions=`<button class="btn-sm btn-start" onclick="openPath('${q.id}')">Start Quest ⚔️</button>`;
    else if(status==='active')actions=`<button class="btn-sm btn-continue" onclick="openPath('${q.id}')">Continue →</button>`;
    else actions=`<button class="btn-sm btn-continue" onclick="openPath('${q.id}')">View Path</button><button class="btn-sm btn-restart" onclick="restartQuest('${q.id}')">↺ Restart</button>`;
    const tagsHtml=(q.tags||[]).map(t=>`<span class="tag-pill">${t}</span>`).join('');
    card.innerHTML=`
      <div class="qc-top"><span class="qc-emoji">${q.emoji||'📚'}</span><span class="qc-badge ${bc}">${bt}</span></div>
      <div class="qc-title">${q.title}</div>
      <div class="qc-sub">${q.subtitle||''}</div>
      ${tagsHtml?`<div class="quest-tags">${tagsHtml}</div>`:''}
      <div class="qc-meta"><span>📖 ${total} nodes</span><span>⭐ ${q.xpTotal||0} XP</span><span>✓ ${completed}/${total}</span></div>
      <div class="prog-wrap"><div class="prog-lbl"><span>Progress</span><span>${pct}%</span></div><div class="prog-bar"><div class="prog-fill ${fc}" style="width:${pct}%"></div></div></div>
      <div class="qc-actions">${actions}</div>`;
    grid.appendChild(card);
  });
}
function restartQuest(questId){
  const q=QUESTS.find(x=>x.id===questId);if(!q)return;
  showConfirm(`Restart "${q.title}"?`,'Node progress for this quest will be reset.','Restart',()=>{
    const cn={...(UDATA.completedNodes||{})};
    q.nodes.forEach(n=>delete cn[n.id]);
    saveUserData({completedNodes:cn});renderHome();showToast('↺ Quest reset.');
  });
}

// ══ PATH ══
const QT_ICONS={mcq:'📜',fill:'✍️',match:'🔗',truefalse:'⚡',mixed:'⚔️'};
function openPath(questId){
  const q=QUESTS.find(x=>x.id===questId);if(!q)return;
  window._currentQuestId=questId;
  const completed=q.nodes.filter(n=>UDATA.completedNodes[n.id]).length,total=q.nodes.length,pct=Math.round((completed/total)*100);
  document.getElementById('path-eyebrow').textContent=q.subtitle||'Quest Path';
  document.getElementById('path-title').textContent=`${q.emoji||'📚'} ${q.title}`;
  document.getElementById('path-sub').textContent=`${completed} of ${total} nodes conquered`;
  document.getElementById('path-pct').textContent=pct+'%';
  document.getElementById('path-prog-fill').style.width=pct+'%';
  renderPath(q);showPage('path');
}
function renderPath(q){
  const container=document.getElementById('quest-path');container.innerHTML='';
  q.nodes.forEach((node,i)=>{
    const done=!!UDATA.completedNodes[node.id];
    const prevOk=i===0||!!UDATA.completedNodes[q.nodes[i-1].id];
    const active=!done&&prevOk,locked=!done&&!active;
    if(i>0){const conn=document.createElement('div');conn.className='path-connector'+(done?' done':'')+(node.type==='boss'?' boss':'');container.appendChild(conn);}
    const nodeEl=document.createElement('div');
    const isActive=active&&!done;
    nodeEl.className='path-node'+(locked?' locked':'')+(isActive?' active-node':'');
    const cc=done?'done':active?'active':'locked-c';
    const bc=node.type==='boss'?' boss':'';
    const icon=node.type==='boss'?'💀':done?'✓':active?(QT_ICONS[node.quizType]||'📜'):'🔒';
    nodeEl.innerHTML=`<div class="node-circle ${cc}${bc}">${icon}${done?'<div class="node-badge">✓</div>':''}</div><div class="node-info"><div class="node-type">${node.type} · ${node.quizType} · ${node.difficulty}</div><div class="node-name">${node.name}</div><div class="node-desc">${node.desc}</div><div class="node-xp">+${node.xp} XP · ${node.questions.length} challenges</div></div>`;
    if(!locked)nodeEl.onclick=()=>openNodeModal(node);
    container.appendChild(nodeEl);
  });
}
function openNodeModal(node){
  const done=!!UDATA.completedNodes[node.id];
  openModal({title:node.type==='boss'?`💀 Boss Battle: ${node.name}`:`⚔️ ${node.name}`,body:`${node.desc}\n\n${node.questions.length} challenges · +${node.xp} XP\nDifficulty: ${node.difficulty.toUpperCase()}${done?'\n\n✓ Already conquered. Play again?':''}`,confirmText:done?'Play Again':'Charge!',onConfirm:()=>startQuiz(node)});
}

// ══ DELETE QUEST ══
function promptDeleteQuest(){
  const questId=window._currentQuestId;const q=QUESTS.find(x=>x.id===questId);if(!q)return;
  document.getElementById('delete-quest-body').textContent=`This will permanently delete "${q.title}" and all its nodes. Your XP earned will be kept. This cannot be undone.`;
  document.getElementById('delete-confirm-input').value='';document.getElementById('delete-err').textContent='';
  document.getElementById('delete-quest-overlay').classList.add('open');
}
function closeDeleteModal(){document.getElementById('delete-quest-overlay').classList.remove('open');}
async function confirmDeleteQuest(){
  const questId=window._currentQuestId;const q=QUESTS.find(x=>x.id===questId);if(!q)return;
  const val=document.getElementById('delete-confirm-input').value.trim();
  if(val!==q.title){document.getElementById('delete-err').textContent='Quest name does not match. Try again.';return;}
  closeDeleteModal();await deleteQuestFromFirestore(questId);
  QUESTS=QUESTS.filter(x=>x.id!==questId);showPage('home');showToast(`🗑 "${q.title}" deleted.`);
}

// ══ QUIZ ══
const QUIZ={node:null,questions:[],qIdx:0,hearts:3,score:0};
function startQuiz(node){QUIZ.node=node;QUIZ.questions=shuffle([...node.questions]);QUIZ.qIdx=0;QUIZ.hearts=3;QUIZ.score=0;renderQ();showPage('quiz');}
function renderQ(){
  const q=QUIZ.questions[QUIZ.qIdx],total=QUIZ.questions.length,pct=(QUIZ.qIdx/total)*100;
  document.getElementById('qpf').style.width=pct+'%';
  document.getElementById('qcounter').textContent=`${QUIZ.qIdx+1} / ${total}`;
  document.getElementById('hearts').textContent='❤️'.repeat(QUIZ.hearts)+'🖤'.repeat(3-QUIZ.hearts);
  document.getElementById('next-btn').style.display='none';
  const fb=document.getElementById('feedback');fb.className='feedback';fb.textContent='';
  const card=document.getElementById('quiz-card');card.innerHTML='';card.style.animation='';
  const badge=document.createElement('div');badge.className='quiz-type-badge';
  const TN={mcq:'📜 Multiple Choice',fill:'✍️ Fill in the Blank',match:'🔗 Match the Terms',truefalse:'⚡ True or False'};
  badge.textContent=TN[q.type]||'⚔️ Challenge';card.appendChild(badge);
  const qEl=document.createElement('div');qEl.className='quiz-q';qEl.textContent=q.q;card.appendChild(qEl);
  if(q.type==='mcq')renderMCQ(card,q);
  else if(q.type==='truefalse')renderTF(card,q);
  else if(q.type==='fill')renderFill(card,q);
  else if(q.type==='match')renderMatch(card,q);
}
function renderMCQ(card,q){
  const opts=document.createElement('div');opts.className='options';
  ['A','B','C','D'].forEach((key,i)=>{
    if(i>=q.options.length)return;
    const btn=document.createElement('button');btn.className='opt-btn';
    btn.innerHTML=`<span class="opt-key">${key}</span>${q.options[i]}`;
    btn.onclick=()=>{
      if(btn.disabled)return;
      Array.from(opts.children).forEach(b=>b.disabled=true);
      const ok=(i===q.answer);btn.classList.add(ok?'correct':'wrong');
      if(!ok&&opts.children[q.answer])opts.children[q.answer].classList.add('correct');
      if(ok)QUIZ.score++;else loseHeart();
      showFeedback(ok,q.exp||(ok?'Correct!':`Answer: ${q.options[q.answer]}`));
      document.getElementById('next-btn').style.display='';
    };
    opts.appendChild(btn);
  });
  card.appendChild(opts);
  const kbh=e=>{
    const i=['a','b','c','d'].indexOf(e.key.toLowerCase());
    if(i>=0&&opts.children[i]&&!opts.children[i].disabled){opts.children[i].click();document.removeEventListener('keydown',kbh);return;}
    if(e.key==='Enter'&&document.getElementById('next-btn').style.display!=='none'){nextQ();document.removeEventListener('keydown',kbh);}
  };
  document.addEventListener('keydown',kbh);
}
function renderTF(card,q){
  const opts=document.createElement('div');opts.className='options';
  [{label:'True ✓',val:true,key:'T'},{label:'False ✗',val:false,key:'F'}].forEach(({label,val,key})=>{
    const btn=document.createElement('button');btn.className='opt-btn';
    btn.innerHTML=`<span class="opt-key">${key}</span>${label}`;
    btn.onclick=()=>{
      if(btn.disabled)return;
      Array.from(opts.children).forEach(b=>b.disabled=true);
      const ok=(val===q.answer);btn.classList.add(ok?'correct':'wrong');
      if(!ok)opts.children[q.answer?0:1].classList.add('correct');
      if(ok)QUIZ.score++;else loseHeart();
      showFeedback(ok,q.exp||(ok?'Correct!':'Not quite.'));
      document.getElementById('next-btn').style.display='';
    };
    opts.appendChild(btn);
  });
  card.appendChild(opts);
}
function renderFill(card,q){
  const wrap=document.createElement('div');
  if(q.hint){const hint=document.createElement('div');hint.style.cssText='font-size:13px;color:var(--textdim);font-style:italic;margin-bottom:8px';hint.innerHTML=`💡 Hint: ${q.hint}`;wrap.appendChild(hint);}
  const inp=document.createElement('input');inp.type='text';inp.className='fill-input';inp.placeholder='Type your answer...';inp.autocomplete='off';
  wrap.appendChild(inp);card.appendChild(wrap);
  const sub=document.createElement('button');sub.className='btn-primary';sub.style.cssText='margin-top:12px;font-size:13px;padding:13px;width:100%;text-align:center';sub.textContent='Submit Answer →';card.appendChild(sub);
  const check=()=>{
    if(inp.disabled)return;
    const val=inp.value.trim().toLowerCase().replace(/[^a-z0-9\s\-]/gi,'');
    const ans=(q.answer||'').toLowerCase().replace(/[^a-z0-9\s\-]/gi,'');
    const ok=val===ans||val.includes(ans)||ans.includes(val)||(ans.length<=10&&levenshtein(val,ans)<=1);
    inp.className='fill-input '+(ok?'correct':'wrong');inp.disabled=true;sub.disabled=true;
    if(ok){QUIZ.score++;showFeedback(true,q.exp||`✓ "${q.answer}" — correct!`);}
    else{loseHeart();showFeedback(false,`The answer was: "${q.answer}". ${q.exp||''}`);}
    document.getElementById('next-btn').style.display='';
  };
  sub.onclick=check;inp.addEventListener('keydown',e=>{if(e.key==='Enter')check();});
  setTimeout(()=>inp.focus(),80);
}
function renderMatch(card,q){
  const pairs=[...(q.pairs||[])],lefts=pairs.map(p=>p[0]),rights=shuffle(pairs.map(p=>p[1]));
  let selL=null,selR=null;const mc={n:0};
  const grid=document.createElement('div');grid.className='match-grid';
  lefts.forEach((term,i)=>{
    const el=document.createElement('div');el.className='match-item';el.textContent=term;el.dataset.idx=i;
    el.onclick=()=>{if(el.classList.contains('matched'))return;grid.querySelectorAll('.match-item[data-idx]').forEach(e=>e.classList.remove('selected'));el.classList.add('selected');selL={el,index:i};tryMatch();};
    grid.appendChild(el);
  });
  rights.forEach(def=>{
    const el=document.createElement('div');el.className='match-item';el.textContent=def;el.dataset.def=def;
    el.onclick=()=>{if(el.classList.contains('matched'))return;grid.querySelectorAll('.match-item[data-def]').forEach(e=>e.classList.remove('selected'));el.classList.add('selected');selR={el,def};tryMatch();};
    grid.appendChild(el);
  });
  card.appendChild(grid);
  function tryMatch(){
    if(!selL||!selR)return;
    const cd=pairs[selL.index][1];
    if(selR.def===cd){
      selL.el.classList.remove('selected');selL.el.classList.add('matched');
      selR.el.classList.remove('selected');selR.el.classList.add('matched');
      mc.n++;
      if(mc.n===pairs.length){QUIZ.score++;showFeedback(true,'All pairs matched!');document.getElementById('next-btn').style.display='';}
    }else{
      selL.el.classList.add('bad');selR.el.classList.add('bad');loseHeart();
      setTimeout(()=>{if(selL)selL.el.classList.remove('selected','bad');if(selR)selR.el.classList.remove('selected','bad');if(QUIZ.hearts<=0){showFeedback(false,'Out of hearts — moving on!');document.getElementById('next-btn').style.display='';}},600);
    }
    selL=null;selR=null;
  }
}
function loseHeart(){
  QUIZ.hearts=Math.max(0,QUIZ.hearts-1);
  document.getElementById('hearts').textContent='❤️'.repeat(QUIZ.hearts)+'🖤'.repeat(3-QUIZ.hearts);
  const card=document.getElementById('quiz-card');card.style.animation='none';card.offsetHeight;card.style.animation='shake .3s';
}
function showFeedback(ok,msg){
  const el=document.getElementById('feedback');el.textContent=(ok?'✓ ':'✗ ')+msg;el.className='feedback show '+(ok?'ok':'bad');
}
function nextQ(){QUIZ.qIdx++;if(QUIZ.qIdx>=QUIZ.questions.length)finishQuiz();else renderQ();}
function confirmExitQuiz(){showConfirm('Retreat from Battle?','Progress on this node will not be saved.','Retreat',()=>exitToPath());}
function exitToPath(){const q=window._currentQuestId;if(q)openPath(q);else showPage('home');}

async function finishQuiz(){
  const{node,questions,score,hearts}=QUIZ;
  const total=questions.length,pct=total>0?score/total:0,perfect=hearts===3;
  const isFirst=!UDATA.completedNodes[node.id];
  let earned=0;
  if(isFirst&&pct>=0.6){earned=Math.round(node.xp*pct);if(perfect)earned=Math.round(earned*1.2);}
  document.getElementById('ri').textContent=pct>=0.8?'🏆':pct>=0.5?'⚔️':'💀';
  document.getElementById('rt').textContent=pct>=0.8?'Quest Node Conquered!':pct>=0.5?'A Hard-Fought Battle':'Defeated... For Now';
  document.getElementById('rs').textContent=pct>=0.8?(perfect?'Perfect run! ':'')+'You proved your mastery.':pct>=0.5?'You survived. Return to sharpen your blade.':'Every defeat is wisdom. Rise again, scholar.';
  document.getElementById('res-score').textContent=score+'/'+total;
  document.getElementById('res-xp').textContent=isFirst?'+'+earned:'+0 (replay)';
  document.getElementById('retry-btn').onclick=function(){startQuiz(node);};
  const delta={xp:(UDATA.xp||0)+earned};
  if(pct>=0.6){
    var cn=Object.assign({},UDATA.completedNodes||{});var isNew=!cn[node.id];cn[node.id]=true;delta.completedNodes=cn;
    if(isNew&&isFirst){
      delta.totalNodes=(UDATA.totalNodes||0)+1;
      if(node.type==='boss')delta.bossesDefeated=(UDATA.bossesDefeated||0)+1;
      if(perfect)delta.perfectNodes=(UDATA.perfectNodes||0)+1;
      var fq=QUESTS.find(function(x){return x.nodes.some(function(n){return n.id===node.id;});});
      if(fq){var allDone=fq.nodes.every(function(n){return cn[n.id];});if(allDone)delta.questsCompleted=(UDATA.questsCompleted||0)+1;}
    }
    var today=todayStr(),lastStr=normDate(UDATA.lastActivityDate);
    if(lastStr!==today){var ns=(UDATA.streak||0)+1;delta.streak=ns;delta.bestStreak=Math.max(UDATA.bestStreak||0,ns);delta.lastActivityDate=today;}
  }
  await saveUserData(delta);updateHeaderStats();
  var li=xpProgressInLevel(UDATA.xp);
  document.getElementById('res-streak').textContent='🔥 '+UDATA.streak;
  document.getElementById('res-lvl-lbl').textContent='Level '+li.lvl+' Progress';
  document.getElementById('res-pct').textContent=li.pct+'%';
  document.getElementById('res-xp-fill').style.width=li.pct+'%';
  var oldLvl=getLevelFromXP(UDATA.xp-earned);if(li.lvl>oldLvl)showLevelUp(li.lvl);
  if(isFirst){var na=checkAchievements();if(na.length){na.forEach(function(a,i){setTimeout(function(){showToast('Achievement: '+a.name+'! +'+a.xp+' XP');},1200+i*2000);});updateHeaderStats();}}
  showPage('result');
}

let _confirmCallback=null;
function showConfirm(title,body,confirmText,onConfirm){
  document.getElementById('confirm-title').textContent=title;
  document.getElementById('confirm-body').textContent=body;
  document.getElementById('confirm-ok-btn').textContent=confirmText||'Confirm';
  _confirmCallback=onConfirm;document.getElementById('confirm-overlay').classList.add('open');
}
function confirmResolve(yes){document.getElementById('confirm-overlay').classList.remove('open');if(yes&&_confirmCallback)_confirmCallback();_confirmCallback=null;}
function goNextNode(){
  const questId=window._currentQuestId;if(!questId){exitToPath();return;}
  const q=QUESTS.find(x=>x.id===questId);if(!q){exitToPath();return;}
  const next=q.nodes.find(n=>{const done=!!UDATA.completedNodes[n.id],idx=q.nodes.indexOf(n),prevOk=idx===0||!!UDATA.completedNodes[q.nodes[idx-1].id];return!done&&prevOk;});
  if(next)openNodeModal(next);else{exitToPath();showToast('🏆 All nodes conquered! Quest complete!');}
}

// ══ SEARCH & FILTER ══
let _activeFilters=new Set();
function getAllTags(){const t=new Set();QUESTS.forEach(q=>(q.tags||[]).forEach(x=>t.add(x)));return[...t].sort();}
function renderFilterPills(){
  const c=document.getElementById('filter-pills');if(!c)return;c.innerHTML='';
  getAllTags().forEach(tag=>{
    const pill=document.createElement('div');pill.className='filter-pill'+(_activeFilters.has(tag)?' active':'');
    pill.textContent=tag;pill.onclick=()=>{if(_activeFilters.has(tag))_activeFilters.delete(tag);else _activeFilters.add(tag);renderHome();};
    c.appendChild(pill);
  });
}
function filterQuests(quests){
  const q=(document.getElementById('quest-search')?.value||'').trim().toLowerCase();
  return quests.filter(x=>{
    const tags=(x.tags||[]).map(t=>t.toLowerCase());
    const ms=!q||x.title.toLowerCase().includes(q)||(x.subtitle||'').toLowerCase().includes(q)||tags.some(t=>t.includes(q));
    const mf=_activeFilters.size===0||[..._activeFilters].every(f=>(x.tags||[]).includes(f));
    return ms&&mf;
  });
}

// ══ PROFILE ══
let _pendingAvatarDataURL=null;
function openProfileModal(){
  document.getElementById('profile-name-input').value=USER?.displayName||'';
  document.getElementById('profile-err').textContent='';_pendingAvatarDataURL=null;
  renderAvatarPreview();document.getElementById('profile-modal-overlay').classList.add('open');
}
function closeProfileModal(){document.getElementById('profile-modal-overlay').classList.remove('open');_pendingAvatarDataURL=null;}
function renderAvatarPreview(){
  const wrap=document.getElementById('avatar-preview-wrap');if(!wrap)return;
  const url=_pendingAvatarDataURL||UDATA.avatarUrl||null;
  wrap.innerHTML=url?`<img src="${url}" alt="avatar" style="width:100%;height:100%;object-fit:cover">`:'<span>👤</span>';
}
function handleAvatarUpload(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{_pendingAvatarDataURL=ev.target.result;renderAvatarPreview();};r.readAsDataURL(f);}
async function saveProfile(){
  const{updateProfile}=window._fb;const name=document.getElementById('profile-name-input').value.trim();const err=document.getElementById('profile-err');
  if(!name){err.textContent='Name cannot be empty.';return;}err.textContent='Saving...';
  try{
    await updateProfile(USER,{displayName:name});
    const u={displayName:name};if(_pendingAvatarDataURL){u.avatarUrl=_pendingAvatarDataURL;UDATA.avatarUrl=_pendingAvatarDataURL;}
    await saveUserData(u);closeProfileModal();updateHeaderAvatar();renderHome();showToast('✓ Profile updated!');
  }catch(e){err.textContent='Failed to save. Try again.';}
}
document.addEventListener('DOMContentLoaded',()=>{const i=document.getElementById('avatar-file-input');if(i)i.addEventListener('change',handleAvatarUpload);});
function updateHeaderAvatar(){
  const btn=document.getElementById('avatar-btn');const url=UDATA.avatarUrl||null;
  if(btn)btn.innerHTML=url?`<img style="width:36px;height:36px;border-radius:50%;object-fit:cover" src="${url}" alt="avatar">`:'👤';
}

// ══ LEVEL TREE ══
function renderLevelTree(){
  const c=document.getElementById('level-tree');if(!c)return;c.innerHTML='';
  const xp=UDATA.xp||0,cur=getLevelFromXP(xp),start=Math.max(1,cur-3),end=cur+8,fade=cur+5;
  for(let l=start;l<=end;l++){
    if(l>start){const cn=document.createElement('div');cn.className='level-tree-connector'+(l<=cur?' done':'');c.appendChild(cn);}
    const n=document.createElement('div');
    const done=l<cur,isCur=l===cur,faded=l>fade;
    n.className='level-tree-node'+(done?' done':'')+(isCur?' current':'')+(faded?' faded':'');
    if(faded)n.style.opacity=Math.max(0.08,Math.min(0.25,0.25-(l-fade)*0.04)).toString();
    const xr=`${xpForLevel(l).toLocaleString()} – ${xpForLevel(l+1).toLocaleString()} XP`;
    n.innerHTML=`<div class="lt-num">${done?'✓':isCur?'⚡':'○'}</div><div class="lt-info"><div class="lt-title">Level ${l} — ${levelTitle(l)}</div><div class="lt-xp">${xr}</div></div><div class="lt-badge">${done?'Done':isCur?'Current':'Locked'}</div>`;
    c.appendChild(n);
  }
  c.innerHTML+=`<div class="tree-infinity">· · · ∞ · · ·</div><div class="tree-infinity-sub">Levels go on forever</div>`;
  const cn=c.querySelector('.current');if(cn)setTimeout(()=>cn.scrollIntoView({behavior:'smooth',block:'center'}),100);
}

// ══ LEADERBOARD ══
async function loadLeaderboard(){
  const{db}=window._fb;const c=document.getElementById('lb-list');if(!c)return;
  c.innerHTML='<div class="lb-loading">Loading rankings...</div>';
  try{
    const{collection,getDocs,orderBy,query,limit}=window._fb;let snap;
    try{const q=query(collection(db,'users'),orderBy('xp','desc'),limit(50));snap=await getDocs(q);}
    catch{snap=await getDocs(collection(db,'users'));}
    const users=[];snap.forEach(d=>{const x=d.data();users.push({uid:d.id,name:x.displayName||'Anonymous Scholar',xp:x.xp||0,avatarUrl:x.avatarUrl||null});});
    users.sort((a,b)=>b.xp-a.xp);
    if(!users.length){c.innerHTML='<div class="lb-loading">No scholars yet — be the first!</div>';return;}
    c.innerHTML='';
    users.forEach((u,i)=>{
      const rank=i+1,isMe=u.uid===USER?.uid,lvl=getLevelFromXP(u.xp),medal=rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank;
      const tc=rank===1?' top1':rank===2?' top2':rank===3?' top3':'';
      const row=document.createElement('div');row.className='lb-row'+tc+(isMe?' me':'');
      row.innerHTML=`<div class="lb-rank">${medal}</div><div class="lb-avatar">${u.avatarUrl?`<img src="${u.avatarUrl}" alt="">`:' 👤'}</div><div style="flex:1;min-width:0"><div class="lb-name">${u.name}</div><div class="lb-lvl">Lv.${lvl} ${levelTitle(lvl)}</div></div><div><div class="lb-xp">${u.xp.toLocaleString()}</div><div class="lb-lvl" style="text-align:right">XP</div></div>`;
      c.appendChild(row);
    });
  }catch(e){c.innerHTML='<div class="lb-loading">Could not load leaderboard.</div>';}
}

// ══ PDF UPLOAD & OPENROUTER ══
const OR_KEY='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';
let _pendingQuest=null,_pendingTags=[];
function resetUploadPage(){
  document.getElementById('upload-step-1').style.display='';
  document.getElementById('upload-step-2').style.display='none';
  document.getElementById('upload-step-3').style.display='none';
  _pendingQuest=null;_pendingTags=[];
}
function handleDrop(e){
  e.preventDefault();document.getElementById('upload-zone').classList.remove('drag');
  const f=e.dataTransfer.files[0];if(f&&f.type==='application/pdf')processPDF(f);
  else showToast('Please drop a PDF file.');
}
function handlePDFUpload(e){const f=e.target.files[0];if(f)processPDF(f);}

async function processPDF(file){
  document.getElementById('upload-step-1').style.display='none';
  document.getElementById('upload-step-2').style.display='';
  document.getElementById('pdf-input').value='';
  const status=document.getElementById('processing-status');
  try{
    status.textContent='Reading your scroll...';
    const text=await extractTextFromPDF(file,status);
    if(text.trim().length<200)throw new Error('PDF has too little readable text. Try a different file.');
    status.textContent='Consulting the ancient AI oracle...';
    const quest=await generateQuestFromText(text,status);
    _pendingQuest=quest;_pendingTags=[...(quest.tags||[])];
    document.getElementById('upload-step-2').style.display='none';
    document.getElementById('upload-step-3').style.display='';
    document.getElementById('quest-name-input').value=quest.title||'';
    document.getElementById('quest-emoji-input').value=quest.emoji||'📚';
    renderTagsDisplay();
  }catch(err){
    console.error(err);
    document.getElementById('upload-step-2').style.display='none';
    document.getElementById('upload-step-1').style.display='';
    showToast('⚠️ '+err.message,7000);
  }
}

async function extractTextFromPDF(file,status){
  if(!window.pdfjsLib){
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload=res;s.onerror=()=>rej(new Error('Failed to load PDF.js'));
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  const arrayBuffer=await file.arrayBuffer();
  const pdf=await window.pdfjsLib.getDocument({data:arrayBuffer}).promise;
  let fullText='';
  const maxPages=Math.min(pdf.numPages,40);
  for(let i=1;i<=maxPages;i++){
    status.textContent=`Reading page ${i} of ${maxPages}...`;
    const page=await pdf.getPage(i);
    const content=await page.getTextContent();
    fullText+=content.items.map(x=>x.str).join(' ')+'\n';
  }
  return fullText.slice(0,12000);
}

async function generateQuestFromText(pdfText,status){
  const prompt=`You are a quest designer for a gamified learning app called StudyQuest. Analyse this study material and generate a complete quest in JSON format.

The quest must follow this EXACT structure:
{
  "title": "Epic quest title (dramatic, Cinzel-style)",
  "subtitle": "Subject · Topic description",
  "emoji": "relevant emoji",
  "tags": ["Subject", "Grade/Level"],
  "nodes": [
    {
      "id": "n_1",
      "type": "lesson",
      "name": "Dramatic node name",
      "desc": "Brief description",
      "xp": 40,
      "quizType": "mcq",
      "difficulty": "easy",
      "questions": [
        {"type":"mcq","q":"Question?","options":["A","B","C","D"],"answer":0,"exp":"Explanation"}
      ]
    }
  ]
}

Question types:
- mcq: options array (4 items), answer is index 0-3, exp field
- truefalse: answer is boolean true/false, exp field
- fill: answer is the word/phrase, optional hint field
- match: pairs array of [term, definition] (4 pairs)

Rules:
- Create 6-8 nodes. Last node MUST be type "boss", quizType "mixed", difficulty "hard"
- Boss: 5-6 questions mixing all types. Regular nodes: 4-5 questions each
- XP: easy=35-40, medium=50-60, hard=70-80, boss=120-150
- Base ALL questions on the actual study material content below
- Node names must be dramatic and thematic
- IDs must be unique: "n_1", "n_2" etc.

Return ONLY valid JSON. No markdown fences, no explanation.

STUDY MATERIAL:
${pdfText}`;

  const FREE_MODELS=['openrouter/free','deepseek/deepseek-r1:free','meta-llama/llama-3.3-70b-instruct:free','google/gemma-3-12b-it:free'];
  let text='';
  for(let mi=0;mi<FREE_MODELS.length;mi++){
    const model=FREE_MODELS[mi];
    status.textContent=`Consulting oracle (${model.split('/')[1].split(':')[0]})...`;
    const resp=await fetch('https://openrouter.ai/api/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+OR_KEY,'HTTP-Referer':'https://studyquest.app','X-Title':'StudyQuest'},
      body:JSON.stringify({model,messages:[{role:'user',content:prompt}],max_tokens:8000,temperature:0.7})
    });
    if(resp.status===429||resp.status===503){if(mi===FREE_MODELS.length-1)throw new Error('All free models are rate limited. Please try again in a minute.');continue;}
    if(!resp.ok){
      let msg=`OpenRouter error (${resp.status})`;
      try{const e=await resp.json();if(e?.error?.message)msg+=': '+e.error.message;}catch(_){}
      if(mi===FREE_MODELS.length-1)throw new Error(msg);continue;
    }
    const data=await resp.json();
    text=data.choices?.[0]?.message?.content||'';if(text)break;
  }
  if(!text)throw new Error('No response from AI. Please try again.');
  let jsonStr=text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```\s*$/,'').trim();
  if(!jsonStr.startsWith('{')){const m=jsonStr.match(/\{[\s\S]*\}/);if(!m)throw new Error('Could not find JSON in response.');jsonStr=m[0];}
  let quest;
  try{quest=JSON.parse(jsonStr);}catch(_){throw new Error('Could not parse AI response. Try again.');}
  if(!quest.nodes?.length)throw new Error('No quest nodes returned. Try a more text-rich PDF.');
  quest.id='q_'+Date.now();quest.xpTotal=quest.nodes.reduce((s,n)=>s+(n.xp||0),0);
  return quest;
}

function renderTagsDisplay(){
  const c=document.getElementById('tags-display');c.innerHTML='';
  _pendingTags.forEach((tag,i)=>{
    const pill=document.createElement('span');pill.className='tag-pill';pill.style.cursor='pointer';
    pill.innerHTML=`${tag} <span class="tag-remove" onclick="removeTag(${i})">✕</span>`;
    c.appendChild(pill);
  });
}
function removeTag(i){_pendingTags.splice(i,1);renderTagsDisplay();}
function handleTagInput(e){if(e.key==='Enter'){e.preventDefault();addTag();}}
function addTag(){
  const inp=document.getElementById('tag-input');const val=inp.value.trim();
  if(val&&!_pendingTags.includes(val)){_pendingTags.push(val);renderTagsDisplay();}
  inp.value='';
}
async function saveQuest(){
  const name=document.getElementById('quest-name-input').value.trim();
  const emoji=document.getElementById('quest-emoji-input').value.trim()||'📚';
  const err=document.getElementById('naming-err');
  if(!name){err.textContent='Please name your quest.';return;}
  if(!_pendingQuest){err.textContent='No quest data found. Please re-upload.';return;}
  err.textContent='Saving to your sanctum...';
  _pendingQuest.title=name;_pendingQuest.emoji=emoji;_pendingQuest.tags=[..._pendingTags];
  try{
    await saveQuestToFirestore(_pendingQuest);QUESTS.push(_pendingQuest);
    showPage('home');showToast(`⚔️ "${name}" added to your sanctum!`);
  }catch(e){err.textContent='Failed to save. Try again.';}
}

document.addEventListener('DOMContentLoaded',()=>{initAuth();});
