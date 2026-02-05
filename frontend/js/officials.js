document.addEventListener("DOMContentLoaded", fetchOfficials);

async function fetchOfficials() {
  const res = await fetch("http://localhost:3000/api/officials");
  const officials = await res.json();
  renderOfficials(officials);
}

function renderOfficials(officials) {
  const grid = document.getElementById("officialsGrid");
  grid.innerHTML = "";

  officials.forEach(o => {
    const card = document.createElement("article");
    card.className = "officialcard";

    card.innerHTML = `
      <img src="${o.image}" alt="${o.name}">
      <h3>${o.name}</h3>
      <p>Position: ${o.position}</p>
    `;

    card.addEventListener("click", () => openModal(o));
    grid.appendChild(card);
  });
}

function openModal(o) {
  document.getElementById("officialModalLabel").textContent = o.name;

  document.getElementById("modalContent").innerHTML = `
    <img src="${o.image}" alt="${o.name}">
    <h6>${o.position}</h6>
    <p><strong>Term:</strong> ${o.term || "—"}</p>
    <p>${o.description || ""}</p>
    <p><strong>Advocacy:</strong> ${o.advocacy || ""}</p>
    <p><strong>Contact Info:</strong> ${o.contactInfo || ""}</p>
  `;

  new bootstrap.Modal(
    document.getElementById("officialModal")
  ).show();
}
