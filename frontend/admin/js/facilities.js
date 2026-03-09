// CREATE FACILITY
async function createFacility(){

const name = document.getElementById("facilityName").value
const description = document.getElementById("facilityDescription").value
const category = document.getElementById("facilityCategory").value
const capacity = document.getElementById("facilityCapacity").value
const operatingHours = document.getElementById("facilityHours").value
const managedBy = document.getElementById("facilityManagedBy").value
const image = document.getElementById("facilityImage").value


const res = await fetch("/api/facilities",{
method:"POST",
headers:getAuthHeaders(),
body:JSON.stringify({
name,
description,
category,
capacity,
operatingHours,
managedBy,
image
})
})

alert("Facility created")

document.getElementById("facilityName").value=""
document.getElementById("facilityDescription").value=""
document.getElementById("facilityCapacity").value=""
document.getElementById("facilityHours").value=""
document.getElementById("facilityManagedBy").value=""
document.getElementById("facilityImage").value=""

loadFacilities()

}



// LOAD FACILITIES
async function loadFacilities(){

const res = await fetch("/api/facilities")
const facilities = await res.json()

const container = document.getElementById("facilityList")

container.innerHTML=""

facilities.forEach(f=>{

const div=document.createElement("div")

div.innerHTML=`
<b>${f.name}</b>

<p>${f.description}</p>

<p>Category: ${f.category}</p>

<button onclick="deleteFacility('${f._id}')">Delete</button>

<hr>
`

container.appendChild(div)

})

}



// DELETE FACILITY
async function deleteFacility(id){

const res = await fetch("/api/facilities/"+id,{
method:"DELETE",
headers:getAuthHeaders()
})

alert("Facility deleted")

loadFacilities()

}


loadFacilities()