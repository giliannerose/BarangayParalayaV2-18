console.log("admin-officials.js loaded");

async function loadOfficials() {
  const container = document.getElementById("officialList");

  if (!container) {
    console.error("officialList element not found");
    return;
  }

  try {
    const res = await fetch("/api/officials");
    if (!res.ok) throw new Error("Failed to fetch officials");

    const officials = await res.json();
    console.log("Officials loaded:", officials);

    container.innerHTML = "";

    if (officials.length === 0) {
      container.innerHTML = "<p>No officials found.</p>";
      return;
    }

    officials.forEach(o => {
      const div = document.createElement("div");
      div.innerHTML = `
        <b>${o.name}</b>
        <p>Position: ${o.position}</p>
        <button onclick="deleteOfficial('${o._id}')">Delete</button>
        <hr>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Load officials error:", err);
    container.innerHTML = "<p>Failed to load officials.</p>";
  }
}

async function createOfficial() {
  const nameInput = document.getElementById("officialName");
  const positionInput = document.getElementById("officialPosition");

  if (!nameInput || !positionInput) {
    alert("Official form fields not found");
    return;
  }

  const name = nameInput.value.trim();
  const position = positionInput.value.trim();

  if (!name || !position) {
    alert("Name and position are required");
    return;
  }

  try {
    const res = await fetch("/api/officials", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, position })
    });

    const data = await res.json();
    console.log("Create official response:", res.status, data);

    if (!res.ok) {
      alert(data.message || data.error || "Failed to create official");
      return;
    }

    alert("Official added");
    nameInput.value = "";
    positionInput.value = "";
    loadOfficials();

  } catch (err) {
    console.error("Create official error:", err);
    alert("Error adding official");
  }
}

async function deleteOfficial(id) {
  try {
    const res = await fetch("/api/officials/" + id, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    const data = await res.json();
    console.log("Delete official response:", res.status, data);

    if (!res.ok) {
      alert(data.message || data.error || "Failed to delete official");
      return;
    }

    alert("Official deleted");
    loadOfficials();

  } catch (err) {
    console.error("Delete official error:", err);
    alert("Error deleting official");
  }
}

document.addEventListener("DOMContentLoaded", loadOfficials);