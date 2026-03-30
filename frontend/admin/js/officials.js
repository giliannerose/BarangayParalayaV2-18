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
        <p>Term: ${o.term || ""}</p>
        <p>Contact: ${o.contactInfo || ""}</p>
        <p>Order: ${o.order ?? ""}</p>
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
  const name = document.getElementById("officialName").value.trim();
  const position = document.getElementById("officialPosition").value.trim();
  const term = document.getElementById("officialTerm").value.trim();
  const description = document.getElementById("officialDescription").value.trim();
  const advocacy = document.getElementById("officialAdvocacy").value.trim();
  const contactInfo = document.getElementById("officialContactInfo").value.trim();
  const image = document.getElementById("officialImage").value.trim();
  const order = parseInt(document.getElementById("officialOrder").value);

  if (!name || !position || !term || !description || !advocacy || !contactInfo || !image || isNaN(order)) {
    alert("Please fill out all fields");
    return;
  }

  try {
    const res = await fetch("/api/officials", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        position,
        term,
        description,
        advocacy,
        contactInfo,
        image,
        order
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || data.error || "Failed to create official");
      return;
    }

    alert("Official added");

    document.getElementById("officialName").value = "";
    document.getElementById("officialPosition").value = "";
    document.getElementById("officialTerm").value = "";
    document.getElementById("officialDescription").value = "";
    document.getElementById("officialAdvocacy").value = "";
    document.getElementById("officialContactInfo").value = "";
    document.getElementById("officialImage").value = "";
    document.getElementById("officialOrder").value = "";

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