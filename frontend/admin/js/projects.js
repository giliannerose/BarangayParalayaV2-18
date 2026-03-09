async function createProject(){

const title=document.getElementById("projectTitle").value
const description=document.getElementById("projectDescription").value
const status=document.getElementById("projectStatus").value
const progress=document.getElementById("projectProgress").value
const image=document.getElementById("projectImage").value
const startDate=document.getElementById("projectStartDate").value
const endDate=document.getElementById("projectEndDate").value
const budget=document.getElementById("projectBudget").value
const location=document.getElementById("projectLocation").value
const ledBy=document.getElementById("projectLedBy").value
const impact=document.getElementById("projectImpact").value
const year=document.getElementById("projectYear").value

await fetch("/api/projects",{
method:"POST",
headers:getAuthHeaders(),
body:JSON.stringify({
title,
description,
status,
progress,
image,
startDate,
endDate,
budget,
location,
ledBy,
impact,
year
})
})

alert("Project created")

loadProjects()

}

async function loadProjects(){

const res=await fetch("/api/projects")
const projects=await res.json()

const container=document.getElementById("projectList")

container.innerHTML=""

projects.forEach(p=>{

const div=document.createElement("div")

div.innerHTML=`

<b>${p.title}</b>

<p>${p.description}</p>

<p>Status: ${p.status}</p>

<p>Progress: ${p.progress}%</p>

<button onclick="deleteProject('${p._id}')">Delete</button>

<hr>

`

container.appendChild(div)

})

}

//delete

async function deleteProject(id){

await fetch("/api/projects/"+id,{
method:"DELETE",
headers:getAuthHeaders()
})

alert("Project deleted")

loadProjects()

}