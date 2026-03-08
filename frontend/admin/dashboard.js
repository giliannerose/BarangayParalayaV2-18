
const params = new URLSearchParams(window.location.search);
const urlToken = params.get("token");

if (urlToken) {
  localStorage.setItem("token", urlToken);
  window.history.replaceState({}, document.title, "/admin/dashboard.html");
}

// get stored token
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "/admin-login.html";
}

function getAuthHeaders(){
return{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
}
}

function logout(){
localStorage.removeItem("token")
window.location.href="/admin-login.html"
}

// CREATE ANNOUNCEMENT
async function createAnnouncement(){

const title=document.getElementById("title").value
const text=document.getElementById("text").value
const details=document.getElementById("details").value
const postedBy=document.getElementById("postedBy").value
const month=document.getElementById("month").value
const date=document.getElementById("date").value
const cat=document.getElementById("cat").value
const img=document.getElementById("img").value

const res=await fetch("/api/announcements",{
method:"POST",
headers:getAuthHeaders(),
body:JSON.stringify({
title,
text,
details,
postedBy,
month,
date,
cat,
img
})
})



alert("Announcement created")

document.getElementById("title").value=""
document.getElementById("text").value=""
document.getElementById("details").value=""
document.getElementById("postedBy").value=""
document.getElementById("date").value=""

loadAnnouncements()

}


// LOAD ANNOUNCEMENTS
async function loadAnnouncements(){

const res=await fetch("/api/announcements")
const announcements=await res.json()

const container=document.getElementById("announcementList")

container.innerHTML=""

announcements.forEach(a=>{

const div=document.createElement("div")

div.innerHTML=` <b>${a.title}</b>

<p>${a.text}</p>

<button onclick="deleteAnnouncement('${a._id}')">Delete</button>

<hr>
`

container.appendChild(div)

})

}

// DELETE ANNOUNCEMENT
async function deleteAnnouncement(id){

const res=await fetch("/api/announcements/"+id,{
method:"DELETE",
headers:getAuthHeaders()
})

alert("Deleted")

loadAnnouncements()
}

loadAnnouncements()

function showSection(section){

document.getElementById("announcementsSection").style.display="none"


//sections
if(section==="announcements"){
document.getElementById("announcementsSection").style.display="block"
}

}