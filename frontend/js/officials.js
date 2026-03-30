document.addEventListener("DOMContentLoaded", initOfficials);

let allOfficials = [];

async function initOfficials() {
  try {
    const res = await fetch("/api/officials");
    if (!res.ok) throw new Error("Failed to load officials");

    allOfficials = await res.json();

    populatePositionFilter(allOfficials);
    renderOfficials(allOfficials);

    document
      .getElementById("searchOfficial")
      .addEventListener("input", filterOfficials);

    document
      .getElementById("positionFilter")
      .addEventListener("change", filterOfficials);

  } catch (err) {
    console.error(err);
    document.getElementById("officialsGrid").innerHTML =
      `<p class="text-danger text-center">Failed to load officials.</p>`;
  }
}

function populatePositionFilter(officials) {
  const positionFilter = document.getElementById("positionFilter");

  const uniquePositions = [...new Set(officials.map(o => o.position).filter(Boolean))];

  uniquePositions.sort();

  uniquePositions.forEach(position => {
    const option = document.createElement("option");
    option.value = position.toLowerCase();
    option.textContent = position;
    positionFilter.appendChild(option);
  });
}

function filterOfficials() {
  const searchValue = document
    .getElementById("searchOfficial")
    .value
    .toLowerCase()
    .trim();

  const selectedPosition = document
    .getElementById("positionFilter")
    .value
    .toLowerCase();

  const filtered = allOfficials.filter(o => {
    const nameMatch = (o.name || "").toLowerCase().includes(searchValue);
    const positionMatch =
      selectedPosition === "all" ||
      (o.position || "").toLowerCase() === selectedPosition;

    return nameMatch && positionMatch;
  });

  renderOfficials(filtered);
}

function renderOfficials(officials) {
  const grid = document.getElementById("officialsGrid");
  grid.innerHTML = "";

  if (officials.length === 0) {
    grid.innerHTML = `<p class="text-center">No officials found.</p>`;
    return;
  }

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
    <img src="${o.image}" alt="${o.name}" class="img-fluid rounded mb-3">
    <h6>${o.position}</h6>
    <p><strong>Term:</strong> ${o.term || "—"}</p>
    <p>${o.description || ""}</p>
    <p><strong>Advocacy:</strong> ${o.advocacy || ""}</p>
    <p><strong>Contact Info:</strong> ${o.contactInfo || ""}</p>
  `;

  new bootstrap.Modal(document.getElementById("officialModal")).show();
}