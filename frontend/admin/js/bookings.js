async function loadBookings(){

const res = await fetch("/api/bookings")
const bookings = await res.json()

const container = document.getElementById("bookingList")

container.innerHTML = ""

bookings.forEach(b => {

const div = document.createElement("div")

div.innerHTML = `

<b>${b.fullName}</b> requested <b>${b.facilityId?.name || "Facility"}</b>

<p>Date: ${b.date} | Time: ${b.time}</p>

<p>Status: <b>${b.status}</b></p>

<button onclick="updateBookingStatus('${b._id}','approved')" class="btn btn-success btn-sm">Approve</button>

<button onclick="updateBookingStatus('${b._id}','rejected')" class="btn btn-danger btn-sm">Reject</button>

<hr>

`

container.appendChild(div)

})

}

async function updateBookingStatus(id, status){

await fetch("/api/bookings/" + id + "/status", {
method: "PUT",
headers: getAuthHeaders(),
body: JSON.stringify({ status })
})

alert("Booking updated")

loadBookings()

}