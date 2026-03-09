

function showSection(section){

document.getElementById("announcementsSection").style.display="none"
document.getElementById("projectsSection").style.display="none"
document.getElementById("facilitiesSection").style.display="none"

//sections
if(section==="announcements"){
document.getElementById("announcementsSection").style.display="block"
loadAnnouncements()
}

if(section==="projects"){
document.getElementById("projectsSection").style.display="block"
loadProjects()
}


if(section==="facilities"){
document.getElementById("facilitiesSection").style.display="block"
}

}

