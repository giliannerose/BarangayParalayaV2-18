

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