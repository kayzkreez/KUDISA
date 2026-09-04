const $=id=>document.getElementById(id);

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

$("messageForm").onsubmit=e=>{
  e.preventDefault(); const text=$("messageInput").value.trim(); if(!text)return;
  const div=document.createElement("div");div.className="bubble me";div.textContent=text;$("messages").appendChild(div);$("messageInput").value="";
  $("messages").scrollTop=$("messages").scrollHeight;
};

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

const dateIdeas=["Quiet dinner + walk","Cook together + conversation","Bookstore + coffee","Home movie + snacks","Picnic in a quiet place","Sunset drive + playlist"];
$("dateGenerator").onclick=()=>{
  const idea=dateIdeas[Math.floor(Math.random()*dateIdeas.length)];
  $("dateResult").textContent=`Kudisa pick: ${idea}. Keep the evening quiet and protect quality time.`;
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

const savedBirthday=localStorage.kudisaBirthday||"2003-07-17";
$("myBirthday").value=savedBirthday;
localStorage.kudisaBirthday=savedBirthday;
$("myBirthday").onchange=()=>{localStorage.kudisaBirthday=$("myBirthday").value; renderCalendar(); renderUpcoming();};
const savedColour=localStorage.kudisaColour||"";
if(savedColour)$("myColour").value=savedColour;
$("savePrefs").onclick=()=>{
  localStorage.kudisaColour=$("myColour").value;
  localStorage.kudisaDateStyle=$("myDateStyle").value;
  $("savePrefs").textContent="Saved";
  setTimeout(()=>$("savePrefs").textContent="Save preferences",1000);
};
if(localStorage.kudisaDateStyle)$("myDateStyle").value=localStorage.kudisaDateStyle;


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
