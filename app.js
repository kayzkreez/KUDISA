const $=id=>document.getElementById(id);


/* KUDISA profile/session layer */
const KUDISA_PROFILES = {
  tadisa: { name: "Tadisa", code: "224", fullName: "Tadisa Chachora", birthday: "2005-10-10", colour: "Black", prefs: "Quiet spaces · Quality time · Family oriented · Choir · Women's University" },
  kuda: { name: "Kuda", code: "BME", fullName: "Kudakwashe", birthday: "2003-07-17", colour: "", prefs: "" }
};
let currentProfile = localStorage.getItem("kudisaCurrentProfile") || "";
let personalData = JSON.parse(localStorage.getItem("kudisaPersonalData") || '{"tadisa":[],"kuda":[]}');
let sharedActivities = JSON.parse(localStorage.getItem("kudisaSharedActivities") || "[]");
let chatMessages = JSON.parse(localStorage.getItem("kudisaChatMessages") || "[]");
let profileData = JSON.parse(localStorage.getItem("kudisaProfiles") || JSON.stringify(KUDISA_PROFILES));

function escapeHTML(value){return String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function saveProfileData(){localStorage.setItem("kudisaProfiles",JSON.stringify(profileData));}
function savePersonal(){localStorage.setItem("kudisaPersonalData",JSON.stringify(personalData));}
function saveShared(){localStorage.setItem("kudisaSharedActivities",JSON.stringify(sharedActivities));}
function saveChat(){localStorage.setItem("kudisaChatMessages",JSON.stringify(chatMessages));}

function applyProfileUI(){
  if(!currentProfile){
    $("loginGate").style.display="grid";
    document.querySelector(".app-shell").style.display="none";
    return;
  }
  $("loginGate").style.display="none";
  document.querySelector(".app-shell").style.display="block";
  const p=profileData[currentProfile];
  $("currentProfileBadge").textContent=`${p.name} · ${p.code}`;
  $("personalPanelTitle").textContent=`${p.name}'s contributions`;
  $("personalThingInput").placeholder=`Something ${p.name} wants to add`;
  renderPersonal();
  renderPartner();
  renderShared();
  renderCombinedProfile();
  renderMessages();
}
function login(profile){
  currentProfile=profile;
  localStorage.setItem("kudisaCurrentProfile",profile);
  $("loginError").textContent="";
  applyProfileUI();
}
document.querySelectorAll("[data-login-profile]").forEach(b=>b.addEventListener("click",()=>{
  $("loginCode").value=b.dataset.loginProfile==="tadisa"?"224":"BME";
  $("loginCode").focus();
}));
$("loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  const code=$("loginCode").value.trim();
  const match=Object.keys(KUDISA_PROFILES).find(k=>profileData[k].code===code);
  if(!match){$("loginError").textContent="Incorrect code. Use 224 for Tadisa or BME for Kuda.";return;}
  login(match);
});
$("logoutBtn").addEventListener("click",()=>{
  currentProfile="";
  localStorage.removeItem("kudisaCurrentProfile");
  applyProfileUI();
});
function renderPersonal(){
  const items=personalData[currentProfile]||[];
  $("personalThings").innerHTML=items.map((x,i)=>`<div class="stack-item"><div><strong>${escapeHTML(x.title)}</strong><small>${escapeHTML(x.note||"")}</small></div><button type="button" class="secondary" data-personal-delete="${i}">Remove</button></div>`).join("")||'<p class="small">Nothing added yet.</p>';
  document.querySelectorAll("[data-personal-delete]").forEach(b=>b.onclick=()=>{personalData[currentProfile].splice(Number(b.dataset.personalDelete),1);savePersonal();applyProfileUI();});
}
function renderPartner(){
  const partner=currentProfile==="kuda"?"tadisa":"kuda";
  const items=personalData[partner]||[];
  $("partnerThings").innerHTML=items.map(x=>`<div class="stack-item"><div><strong>${escapeHTML(x.title)}</strong><small>${escapeHTML(x.note||"")}</small></div><span class="chip">${profileData[partner].name}</span></div>`).join("")||'<p class="small">Nothing added from the other profile yet.</p>';
}
$("addPersonalThing").addEventListener("click",()=>{
  const title=$("personalThingInput").value.trim(); if(!title)return;
  personalData[currentProfile].push({title,note:$("personalNoteInput").value.trim(),at:new Date().toISOString()});
  $("personalThingInput").value="";$("personalNoteInput").value="";savePersonal();applyProfileUI();
});
$("addPartnerThing").addEventListener("click",()=>{
  const partner=currentProfile==="kuda"?"tadisa":"kuda";const title=$("partnerThingInput").value.trim();if(!title)return;
  personalData[partner].push({title,note:$("partnerNoteInput").value.trim(),at:new Date().toISOString()});
  $("partnerThingInput").value="";$("partnerNoteInput").value="";savePersonal();applyProfileUI();
});
function renderShared(){
  const rows=[...sharedActivities].sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  $("sharedFeed").innerHTML=rows.map((x,i)=>`<div class="shared-item"><div><strong>${escapeHTML(x.title)}</strong><small>${escapeHTML(x.date||"No date")} · added by ${escapeHTML(x.by)}</small></div><button type="button" class="secondary" data-shared-delete="${i}">Remove</button></div>`).join("")||'<p class="small">No shared events yet.</p>';
  document.querySelectorAll("[data-shared-delete]").forEach(b=>b.onclick=()=>{sharedActivities.splice(Number(b.dataset.sharedDelete),1);saveShared();renderShared();});
}
$("sharedActivityForm").addEventListener("submit",e=>{
  e.preventDefault();const title=$("sharedActivityInput").value.trim();if(!title)return;
  sharedActivities.push({title,date:$("sharedActivityDate").value,by:profileData[currentProfile].name});
  $("sharedActivityInput").value="";$("sharedActivityDate").value="";saveShared();renderShared();
});
function renderMessages(){
  const rows=chatMessages.length?chatMessages:[{sender:"tadisa",text:"I hope we keep choosing each other."},{sender:"kuda",text:"Today, tomorrow, forever."}];
  $("messages").innerHTML=rows.map(x=>{
    const mine=x.sender===currentProfile;
    const name=profileData[x.sender]?.name||x.sender;
    return `<div class="message-row ${mine?"me":"them"}"><div class="message-meta">${escapeHTML(name)}</div><div class="bubble ${mine?"me":"them"}">${escapeHTML(x.text)}</div></div>`;
  }).join("");
  $("messages").scrollTop=$("messages").scrollHeight;
}
$("messageForm").addEventListener("submit",e=>{
  e.preventDefault();const text=$("messageInput").value.trim();if(!text)return;
  chatMessages.push({sender:currentProfile,text,at:new Date().toISOString()});saveChat();$("messageInput").value="";renderMessages();
});
function renderCombinedProfile(){
  const k=profileData.kuda,t=profileData.tadisa;
  $("combinedProfileTitle").textContent=`${k.name} + ${t.name}`;
  $("combinedProfileText").textContent=`${k.name}'s profile and ${t.name}'s profile are kept individually, then surfaced together in Our Life, Chat, Calendar and shared activities.`;
  $("combinedProfileChips").innerHTML=[`Kuda · ${k.birthday||"Birthday not set"}`,`Tadisa · ${t.birthday||"Birthday not set"}`,`Anniversary · 7 July`].map(x=>`<span class="chip">${escapeHTML(x)}</span>`).join("");
}
function fillProfileForms(){
  const k=profileData.kuda,t=profileData.tadisa;
  $("kudaName").value=k.fullName||k.name;$("kudaBirthday").value=k.birthday||"2003-07-17";$("kudaColour").value=k.colour||"";$("kudaPrefs").value=k.prefs||"";
  $("tadisaName").value=t.fullName||t.name;$("tadisaBirthday").value=t.birthday||"2005-10-10";$("tadisaColour").value=t.colour||"Black";$("tadisaPrefs").value=t.prefs||"";
}
$("saveKudaProfile").addEventListener("click",()=>{
  const p=profileData.kuda;p.fullName=$("kudaName").value.trim()||"Kudakwashe";p.name="Kuda";p.code="BME";p.birthday=$("kudaBirthday").value||"2003-07-17";p.colour=$("kudaColour").value.trim();p.prefs=$("kudaPrefs").value.trim();saveProfileData();applyProfileUI();fillProfileForms();
});
$("saveTadisaProfile").addEventListener("click",()=>{
  const p=profileData.tadisa;p.fullName=$("tadisaName").value.trim()||"Tadisa Chachora";p.name="Tadisa";p.code="224";p.birthday=$("tadisaBirthday").value||"2005-10-10";p.colour=$("tadisaColour").value.trim();p.prefs=$("tadisaPrefs").value.trim();saveProfileData();applyProfileUI();fillProfileForms();
});
fillProfileForms();
applyProfileUI();

/* supplied couple photo editing */
const PHOTO_KEY="kudisaCouplePhoto";
const CAPTION_KEY="kudisaCouplePhotoCaption";
const savedPhoto=localStorage.getItem(PHOTO_KEY);
if(savedPhoto)$("couplePhoto").src=savedPhoto;
if(localStorage.getItem(CAPTION_KEY))$("couplePhotoCaption").textContent=localStorage.getItem(CAPTION_KEY);
$("photoInput").addEventListener("change",e=>{
  const file=e.target.files?.[0];if(!file)return;
  const reader=new FileReader();reader.onload=()=>{localStorage.setItem(PHOTO_KEY,reader.result);$("couplePhoto").src=reader.result;};reader.readAsDataURL(file);
});
$("removePhoto").addEventListener("click",()=>{
  localStorage.removeItem(PHOTO_KEY);$("couplePhoto").src="kudisa-couple.jpg";
});

/* dedicated date planner */
const planDateIdeas=[
  {intent:"Connection",activity:"Quiet dinner + 20-minute phone-free conversation",backup:"Cook together at home",question:"What is one thing you want us to protect this year?"},
  {intent:"Adventure",activity:"Sunset drive + new place to explore",backup:"Home movie-and-snacks night",question:"What experience should we add to our 100-date list?"},
  {intent:"Relaxation",activity:"Farmhouse-style picnic + music + slow evening",backup:"At-home spa and playlist night",question:"What would make our future home feel like us?"},
  {intent:"Celebration",activity:"Dress up, dinner and a small surprise",backup:"Favourite meal and memory slideshow",question:"Which memory are you most grateful we made together?"}
];
let lastPlan=null;
function generateDatePlan(){
  const intent=$("planIntent").value,budget=Math.max(0,Number($("planBudget").value)||0),setting=$("planSetting").value,crowd=$("planCrowd").value;
  const pool=planDateIdeas.filter(x=>x.intent===intent);const base=pool[0]||planDateIdeas[0];
  lastPlan={...base,budget,setting,crowd,date:$("planDate").value||new Date().toISOString().slice(0,10)};
  $("plannedDateResult").innerHTML=`<h3>${escapeHTML(base.activity)}</h3><p>Intent: ${escapeHTML(intent)} · Budget: ${budget} · Setting: ${escapeHTML(setting)} · Crowd: ${escapeHTML(crowd)}</p><p><strong>Backup:</strong> ${escapeHTML(base.backup)}</p><p><strong>Conversation:</strong> ${escapeHTML(base.question)}</p>`;
}
$("generatePlanDate").addEventListener("click",generateDatePlan);
$("savePlannedDate").addEventListener("click",()=>{
  if(!lastPlan)generateDatePlan();
  sharedActivities.push({title:`Date: ${lastPlan.activity}`,date:lastPlan.date,by:profileData[currentProfile].name});
  saveShared();renderShared();
  const current=JSON.parse(localStorage.getItem("kudisaCalendarEvents")||"[]");
  current.push({title:`Date: ${lastPlan.activity}`,date:lastPlan.date,type:"date"});
  localStorage.setItem("kudisaCalendarEvents",JSON.stringify(current));
  if(typeof renderCalendar==="function"){renderCalendar();renderUpcoming();renderCustomEvents();}
});
$("saveDateReflection").addEventListener("click",()=>{
  const value=$("dateReflection").value.trim();if(!value)return;
  localStorage.setItem("kudisaLastDateReflection",value);
  $("dateReflection").value="";
  alert("Date reflection saved to Kudisa memories.");
});

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active-section"));
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  const section=$(id); if(section)section.classList.add("active-section");
  const tab=document.querySelector(`.tab[data-target="${id}"]`); if(tab)tab.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>showSection(t.dataset.target)));

const start=new Date("2026-07-07T00:00:00");
function anniversary(){
  const now=new Date(), days=Math.max(0,Math.floor((now-start)/86400000));
  $("daysTogether").textContent=days.toLocaleString();
  let next=new Date(now.getFullYear(),6,7);
  if(next<=now)next=new Date(now.getFullYear()+1,6,7);
  const d=Math.ceil((next-now)/86400000);
  $("anniversaryCountdown").textContent=`${d} days until the next 7 July`;
}
anniversary();

$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.kudisaDark=document.body.classList.contains("dark")};
if(localStorage.kudisaDark==="true")document.body.classList.add("dark");



$("saveSong").onclick=()=>{
  const title=$("songTitle").value.trim()||"Our song";const artist=$("songArtist").value.trim()||"Unknown artist";
  $("savedSong").textContent=title;$("savedArtist").textContent=artist;$("savedReason").textContent=$("songReason").value.trim();
  localStorage.kudisaSong=JSON.stringify({title,artist,reason:$("songReason").value});
};
if(localStorage.kudisaSong){const s=JSON.parse(localStorage.kudisaSong);$("savedSong").textContent=s.title;$("savedArtist").textContent=s.artist;$("savedReason").textContent=s.reason}

$("addPlaylist").onclick=()=>{
  const name=prompt("Playlist name:");if(!name)return;
  const span=document.createElement("span");span.className="chip";span.textContent=name;$("playlists").appendChild(span);
};

let dateCount=Number(localStorage.kudisaDates||0);$("dateCount").textContent=dateCount;
$("completeDate").onclick=()=>{if(dateCount<100)dateCount++;localStorage.kudisaDates=dateCount;$("dateCount").textContent=dateCount;};

const combos=["Black + White","Navy + White","Brown + Black","Beige + White","Black + Beige","Navy + Beige"];
$("styleGenerator").onclick=()=>{
  const c=combos[Math.floor(Math.random()*combos.length)];
  $("styleResult").textContent=`Try ${c}: coordinate the palette without wearing identical outfits.`;
};

const milestones=[
 ["High school best friends",true],["Started dating · 7 July",true],
 ["First trip together",false],["Engagement",false],["Wedding",false],
 ["First home",false],["Farmhouse",false]
];
function renderMilestones(){
  $("milestones").innerHTML=milestones.map((m,i)=>`<label class="milestone ${m[1]?"done":""}"><input type="checkbox" ${m[1]?"checked":""} data-m="${i}">${m[0]}</label>`).join("");
  document.querySelectorAll("[data-m]").forEach(x=>x.onchange=()=>{milestones[x.dataset.m][1]=x.checked;renderMilestones()});
}
renderMilestones();

let bucket=JSON.parse(localStorage.kudisaBucket||'["Visit Victoria Falls","Take a road trip","Build our farmhouse","Have our small wedding","Buy Tadisa a Range Rover","Create our dream garden"]');
function renderBucket(){$("bucket").innerHTML=bucket.map((x,i)=>`<label class="milestone"><input type="checkbox" data-b="${i}">${escapeHtml(x)}</label>`).join("");document.querySelectorAll("[data-b]").forEach(x=>x.onchange=()=>x.parentElement.classList.toggle("done",x.checked))}
renderBucket();
$("addBucket").onclick=()=>{const v=$("bucketInput").value.trim();if(!v)return;bucket.push(v);localStorage.kudisaBucket=JSON.stringify(bucket);$("bucketInput").value="";renderBucket()};

let guests=0;$("addGuest").onclick=()=>{if(guests<100)guests++;$("guestCount").textContent=`${guests} / 100`};

function money(){
  const income=Math.max(0,Number($("income").value)||0);
  $("target").textContent=fmt(income*120);$("invest").textContent=fmt(income*.10);$("emergency").textContent=fmt(income*4);$("expenses").textContent=fmt(income*.55);
}
function fmt(n){return "$"+n.toLocaleString(undefined,{maximumFractionDigits:2})}
$("income").oninput=money;money();

let tasks=JSON.parse(localStorage.kudisaTasks||"[]");
function renderTasks(){
  $("taskList").innerHTML=tasks.map((t,i)=>`<label class="task ${t.done?"done":""}"><input type="checkbox" data-t="${i}" ${t.done?"checked":""}><span>${escapeHtml(t.text)}</span><small>${escapeHtml(t.owner)}</small></label>`).join("");
  const done=tasks.filter(t=>t.done).length;$("taskStatus").textContent=`${done} complete`;$("nextTask").textContent=tasks.find(t=>!t.done)?.text||"All tasks complete";
  document.querySelectorAll("[data-t]").forEach(x=>x.onchange=()=>{tasks[x.dataset.t].done=x.checked;localStorage.kudisaTasks=JSON.stringify(tasks);renderTasks()});
}
$("addTask").onclick=()=>{const text=$("taskInput").value.trim();if(!text)return;tasks.push({text,owner:$("taskOwner").value,done:false});localStorage.kudisaTasks=JSON.stringify(tasks);$("taskInput").value="";renderTasks()};
renderTasks();

$("addMemory").onclick=()=>{
  const title=prompt("Memory title:");if(!title)return;
  const note=prompt("What do you want to remember?","A moment worth keeping.");
  const a=document.createElement("article");a.className="memory card";a.innerHTML=`<div class="memory-photo">TK</div><div><span class="eyebrow">MEMORY</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(note||"")}</p></div>`;$("memoryList").prepend(a);
};
function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

// School timetable: persisted locally for the prototype.
let classes = JSON.parse(localStorage.kudisaClasses || "[]");
function renderClasses(){
  document.querySelectorAll(".class-item").forEach(x=>x.remove());
  classes.forEach(c=>{
    const days=[...document.querySelectorAll(".day")];
    const day=days.find(d=>d.querySelector("b")?.textContent===c.day);
    if(day){
      const el=document.createElement("div");
      el.className="class-item";
      el.innerHTML=`${escapeHtml(c.subject)}<small>${escapeHtml(c.time)}${c.room?" · "+escapeHtml(c.room):""}</small>`;
      day.appendChild(el);
    }
  });
}
$("saveClass").onclick=()=>{
  const subject=$("subjectInput").value.trim()||"Social Work";
  classes.push({subject,day:$("subjectDay").value,time:$("subjectTime").value.trim()||"Time TBC",room:$("subjectRoom").value.trim()});
  localStorage.kudisaClasses=JSON.stringify(classes);
  $("subjectInput").value="";$("subjectTime").value="";$("subjectRoom").value="";
  renderClasses();
};
$("addClass").onclick=()=>showSection("school");
renderClasses();


// Kudisa calendar + recurring birthday/anniversary reminders.
const monthState=new Date(); monthState.setDate(1);
const tadisaBirthday="2005-10-10";
const anniversaryDate="2026-07-07";
let customEvents=JSON.parse(localStorage.kudisaCalendarEvents||"[]");
function dateKey(y,m,d){return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`}
function todayKey(){const n=new Date();return dateKey(n.getFullYear(),n.getMonth(),n.getDate())}
function recurringEventsForYear(year){
  return [
    {title:"Our anniversary",date:`${year}-07-07`,type:"anniversary",recurring:true,source:"July 7"},
    {title:"Kudakwashe's birthday",date:`${year}-07-17`,type:"birthday",recurring:true,source:"17 July 2003"},
    {title:"Tadisa's birthday",date:`${year}-10-10`,type:"birthday",recurring:true,source:"10 October 2005"}
  ];
}
function allEventsForYear(year){return recurringEventsForYear(year).concat(customEvents.filter(e=>new Date(e.date+"T00:00:00").getFullYear()===year));}
function renderCalendar(){
  const y=monthState.getFullYear(),m=monthState.getMonth();
  $("calendarTitle").textContent=new Intl.DateTimeFormat(undefined,{month:"long",year:"numeric"}).format(new Date(y,m,1));
  const first=new Date(Date.UTC(y,m,1)).getUTCDay(), days=new Date(Date.UTC(y,m+1,0)).getUTCDate();
  const ev=allEventsForYear(y); let html="";
  for(let i=0;i<first;i++)html+='<div class="cal-day empty"></div>';
  for(let d=1;d<=days;d++){
    const key=dateKey(y,m,d), dayEvents=ev.filter(e=>e.date===key); const today=key===todayKey();
    html+=`<div class="cal-day ${today?"today":""}"><strong>${d}</strong>${dayEvents.map(e=>`<span class="cal-event ${e.type||"important"}">${escapeHtml(e.title)}</span>`).join("")}</div>`;
  }
  $("calendarGrid").innerHTML=html;
}
function nextOccurrence(mmdd){
  const now=new Date(); let d=new Date(now.getFullYear(),mmdd[0]-1,mmdd[1]); if(d<new Date(now.getFullYear(),now.getMonth(),now.getDate()))d.setFullYear(now.getFullYear()+1); return d;
}
function daysUntil(d){const a=new Date();a.setHours(0,0,0,0);return Math.ceil((d-a)/86400000)}
function renderUpcoming(){
  const recurring=[{title:"Tadisa's birthday",d:nextOccurrence([10,10]),type:"birthday"},{title:"Kudakwashe's birthday",d:nextOccurrence([7,17]),type:"birthday"},{title:"Our anniversary",d:nextOccurrence([7,7]),type:"anniversary"}];
  const custom=customEvents.map(e=>({...e,d:new Date(e.date+"T00:00:00")})).filter(e=>e.d>=new Date(new Date().setHours(0,0,0,0)));
  const items=recurring.concat(custom).sort((a,b)=>a.d-b.d).slice(0,8);
  $("upcomingEvents").innerHTML=items.map(e=>`<div class="reminder"><div><strong>${escapeHtml(e.title)}</strong><small>${e.d.toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"})}</small></div><strong>${daysUntil(e.d)}d</strong></div>`).join("")||'<p class="small">No upcoming dates.</p>';
}
function renderCustomEvents(){
  $("customEvents").innerHTML=customEvents.map((e,i)=>`<div class="reminder"><div><strong>${escapeHtml(e.title)}</strong><small>${escapeHtml(e.date)} · ${escapeHtml(e.type)}</small></div><button type="button" class="secondary" data-delete-event="${i}">Remove</button></div>`).join("")||'<p class="small">No custom dates yet.</p>';
  document.querySelectorAll("[data-delete-event]").forEach(b=>b.onclick=()=>{customEvents.splice(Number(b.dataset.deleteEvent),1);localStorage.kudisaCalendarEvents=JSON.stringify(customEvents);renderCalendar();renderUpcoming();renderCustomEvents();});
}
$("prevMonth").onclick=()=>{monthState.setMonth(monthState.getMonth()-1);renderCalendar()};
$("nextMonth").onclick=()=>{monthState.setMonth(monthState.getMonth()+1);renderCalendar()};
$("eventForm").onsubmit=e=>{e.preventDefault();const title=$("eventTitle").value.trim(),date=$("eventDate").value;if(!title||!date)return;customEvents.push({title,date,type:$("eventType").value});localStorage.kudisaCalendarEvents=JSON.stringify(customEvents);e.target.reset();renderCalendar();renderUpcoming();renderCustomEvents();};
$("calendarAlerts").onchange=()=>localStorage.kudisaCalendarAlerts=$("calendarAlerts").checked?"true":"false";
if(localStorage.kudisaCalendarAlerts==="false")$("calendarAlerts").checked=false;
$("reminderTiming").onchange=()=>localStorage.kudisaReminderTiming=$("reminderTiming").value;
if(localStorage.kudisaReminderTiming)$("reminderTiming").value=localStorage.kudisaReminderTiming;
function importantReminders(){
  const now=new Date();now.setHours(0,0,0,0); const offsets=$("reminderTiming").value.split(",").map(Number);
  const events=allEventsForYear(now.getFullYear()).concat(allEventsForYear(now.getFullYear()+1));
  return events.map(e=>{const d=new Date(e.date+"T00:00:00");return {e,d,days:Math.round((d-now)/86400000)}}).filter(x=>offsets.includes(x.days));
}
function updateReminderAlert(){
  const matches=importantReminders();
  if($("calendarAlerts").checked && matches.length){$("alertBox").textContent=matches.map(x=>`${x.e.title}: ${x.days===0?"today":x.days+" days"}`).join(" · ");}
  else $("alertBox").textContent="No reminder due today.";
  return matches;
}
$("enableNotifications").onclick=async()=>{
  if(!("Notification" in window)){ $("notificationStatus").textContent="Browser notifications unavailable"; return; }
  const permission=await Notification.requestPermission();
  $("notificationStatus").textContent=permission==="granted"?"Notifications on":"Notifications off";
  if(permission==="granted") sendDueNotifications();
};
function sendDueNotifications(){
  if(!window.Notification || Notification.permission!=="granted")return;
  const due=updateReminderAlert(); const sent=JSON.parse(localStorage.kudisaSentReminders||"{}"); const today=todayKey();
  due.forEach(x=>{const id=x.e.title+"|"+x.e.date+"|"+today;if(sent[id])return;new Notification("Kudisa reminder",{body:`${x.e.title} is ${x.days===0?"today":x.days+" days away"}.`});sent[id]=true;});
  localStorage.kudisaSentReminders=JSON.stringify(sent);
}
renderCalendar();renderUpcoming();renderCustomEvents();updateReminderAlert();
if("Notification" in window && Notification.permission==="granted"){$("notificationStatus").textContent="Notifications on";sendDueNotifications();}
