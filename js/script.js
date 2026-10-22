function formatAmount(amount){return "₹" + amount.toLocaleString("en-IN");}
function daysLeft(dateString){
  const today = new Date();
  const deadline = new Date(dateString+"T23:59:59");
  return Math.ceil((deadline-today)/(1000*60*60*24));
}
function scholarshipCard(s){
  const saved = JSON.parse(localStorage.getItem("savedScholarships")||"[]");
  const isSaved = saved.includes(s.id);
  const days = daysLeft(s.deadline);
  return `<article class="scholarship-card">
    <div class="card-top"><span class="tag">${s.category}</span><button class="save-btn ${isSaved?'saved':''}" onclick="toggleSave(${s.id})">${isSaved?'★':'☆'}</button></div>
    <h3>${s.name}</h3><p class="provider">${s.provider}</p>
    <div class="amount">${formatAmount(s.amount)} <small>award</small></div>
    <div class="details"><span>🎓 ${s.course}</span><span>📍 ${s.state}</span><span>📊 ${s.minPercentage}%+</span></div>
    <div class="deadline ${days<=30?'urgent':''}">📅 Deadline: ${new Date(s.deadline).toLocaleDateString("en-IN")} ${days>0?`(${days} days left)`:"(closed)"}</div>
    <p>${s.description}</p>
    <div class="card-actions"><button class="btn small" onclick="showDetails(${s.id})">View Details</button><a class="btn small primary" href="${s.link}" target="_blank">Apply ↗</a></div>
  </article>`;
}
function renderScholarships(list, elementId="scholarshipList"){
  const el=document.getElementById(elementId); if(!el)return;
  el.innerHTML=list.length?list.map(scholarshipCard).join(""):`<div class="empty"><h3>No matching scholarships</h3><p>Try changing your search or filters.</p></div>`;
  const count=document.getElementById("scholarshipCount"); if(count)count.textContent=`Showing ${list.length} scholarship${list.length!==1?"s":""}`;
}
function filterScholarships(){
  const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
  const course=document.getElementById("courseFilter")?.value||"";
  const state=document.getElementById("stateFilter")?.value||"";
  const category=document.getElementById("categoryFilter")?.value||"";
  const result=scholarships.filter(s=>
    (s.name.toLowerCase().includes(q)||s.provider.toLowerCase().includes(q)||s.description.toLowerCase().includes(q)) &&
    (!course||s.course==="Any"||s.course===course) &&
    (!state||s.state==="All India"||s.state===state) &&
    (!category||s.category===category)
  );
  renderScholarships(result);
}
function toggleSave(id){
  let saved=JSON.parse(localStorage.getItem("savedScholarships")||"[]");
  if(saved.includes(id))saved=saved.filter(x=>x!==id);else saved.push(id);
  localStorage.setItem("savedScholarships",JSON.stringify(saved));
  if(document.getElementById("scholarshipList"))filterScholarships();
  if(document.getElementById("savedList"))renderSaved();
}
function renderSaved(){
  const ids=JSON.parse(localStorage.getItem("savedScholarships")||"[]");
  const list=scholarships.filter(s=>ids.includes(s.id));
  const el=document.getElementById("savedList"); if(!el)return;
  document.getElementById("savedCount").textContent=list.length;
  el.innerHTML=list.length?list.map(scholarshipCard).join(""):`<div class="empty"><h3>No saved scholarships yet</h3><p>Go to Scholarships and click ☆ to save an opportunity.</p></div>`;
}
function showDetails(id){
  const s=scholarships.find(x=>x.id===id);
  alert(`${s.name}\n\nProvider: ${s.provider}\nAward: ${formatAmount(s.amount)}\nCourse: ${s.course}\nMinimum percentage: ${s.minPercentage}%\nIncome limit: ${formatAmount(s.incomeLimit)}\nState: ${s.state}\nDeadline: ${new Date(s.deadline).toLocaleDateString("en-IN")}\n\n${s.description}`);
}
function setupEligibility(){
  const form=document.getElementById("eligibilityForm"); if(!form)return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const course=document.getElementById("eCourse").value;
    const income=Number(document.getElementById("eIncome").value);
    const percentage=Number(document.getElementById("ePercentage").value);
    const state=document.getElementById("eState").value;
    const matches=scholarships.filter(s=>
      (s.course==="Any"||s.course===course) &&
      percentage>=s.minPercentage &&
      income<=s.incomeLimit &&
      (s.state==="All India"||s.state===state)
    );
    const box=document.getElementById("eligibilityResult");
    box.innerHTML=`<div class="match-result"><h2>${matches.length} Matching Scholarship${matches.length!==1?"s":""} Found</h2><p>Based on your course, income, percentage and state.</p><div class="scholarship-grid">${matches.map(scholarshipCard).join("")}</div></div>`;
  });
}
function setupAuth(){
  const reg=document.getElementById("registerForm");
  if(reg)reg.addEventListener("submit",e=>{
    e.preventDefault();
    const user={name:rName.value,email:rEmail.value,password:rPassword.value,course:rCourse.value,year:rYear.value,state:rState.value};
    localStorage.setItem("demoUser",JSON.stringify(user));
    document.getElementById("registerMessage").innerHTML='<div class="success">Account created successfully! <a href="login.html">Login now</a>.</div>';
    reg.reset();
  });
  const login=document.getElementById("loginForm");
  if(login)login.addEventListener("submit",e=>{
    e.preventDefault();
    const user=JSON.parse(localStorage.getItem("demoUser")||"null");
    const msg=document.getElementById("loginMessage");
    if(user && loginEmail.value===user.email && loginPassword.value===user.password){
      localStorage.setItem("loggedIn","true");
      location.href="dashboard.html";
    }else msg.innerHTML='<div class="error">Invalid demo login. Register first or check your details.</div>';
  });
}
function loadDashboard(){
  const user=JSON.parse(localStorage.getItem("demoUser")||"null");
  const name=document.getElementById("welcomeName");
  if(name&&user)name.textContent=`Welcome, ${user.name} 👋`;
  renderSaved();
}
function logout(){localStorage.removeItem("loggedIn");location.href="index.html";}
function loadAdmin(){
  const count=document.getElementById("adminScholarshipCount"); if(count)count.textContent=scholarships.length;
  const table=document.getElementById("adminTable"); if(table)table.innerHTML=scholarships.map(s=>`<tr><td>${s.name}</td><td>${s.provider}</td><td>${formatAmount(s.amount)}</td><td>${new Date(s.deadline).toLocaleDateString("en-IN")}</td><td>${s.category}</td></tr>`).join("");
}
document.addEventListener("DOMContentLoaded",()=>{
  if(document.getElementById("featuredScholarships"))renderScholarships(scholarships.slice(0,3),"featuredScholarships");
  if(document.getElementById("scholarshipList")){renderScholarships(scholarships);["searchInput","courseFilter","stateFilter","categoryFilter"].forEach(id=>document.getElementById(id)?.addEventListener("input",filterScholarships));}
  setupEligibility(); setupAuth(); loadDashboard(); loadAdmin();
});