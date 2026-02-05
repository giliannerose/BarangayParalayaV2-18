

console.log("about.js loaded");

fetch("http://localhost:3000/api/about")
  .then(response => response.json())
  .then(data => {
    console.log("About data:", data);
    // About text
    document.getElementById("aboutText").textContent = data.aboutText;
    document.getElementById("vision").textContent = data.vision;
    document.getElementById("mission").textContent = data.mission;

    // Goals
    const goalsList = document.getElementById("goalsList");
    goalsList.innerHTML = "";
    data.goals.forEach(goal => {
      const li = document.createElement("li");
      li.textContent = goal;
      goalsList.appendChild(li);
    });

    // Emergency contacts
    const emergencyList = document.getElementById("emergencyList");
    emergencyList.innerHTML = "";

    const contacts = data.emergencyContacts;
    for (const key in contacts) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${formatLabel(key)}:</strong> ${contacts[key]}`;
      emergencyList.appendChild(li);
    }

    // Office info
    document.getElementById("officeAddress").textContent = data.officeInfo.address;
    document.getElementById("officeEmail").textContent = data.officeInfo.email;
    document.getElementById("officePhone").textContent = data.officeInfo.phone;
    document.getElementById("officeHours").textContent = data.officeInfo.officeHours;

  })
  .catch(error => {
    console.error("Error loading About page:", error);
  });


function formatLabel(text) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase());
}
