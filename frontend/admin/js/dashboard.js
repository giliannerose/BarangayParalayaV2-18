

function showSection(section){

document.getElementById("announcementsSection").style.display="none"
document.getElementById("projectsSection").style.display="none"
document.getElementById("facilitiesSection").style.display="none"
document.getElementById("bookingsSection").style.display="none"

//sections

//announcements
if(section==="announcements"){
document.getElementById("announcementsSection").style.display="block"
loadAnnouncements()
}


//projects
if(section==="projects"){
document.getElementById("projectsSection").style.display="block"
loadProjects()
}

// facilities
if(section==="facilities"){
document.getElementById("facilitiesSection").style.display="block"
}

// bookings
if(section==="bookings"){
document.getElementById("bookingsSection").style.display="block"
loadBookings()
}

}

