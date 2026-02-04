
document.addEventListener("DOMContentLoaded", function() {
  const viewBtns = document.querySelectorAll(".view-btn");
  const modFac = new bootstrap.Modal(document.getElementById("facModal"));
  const modBook = new bootstrap.Modal(document.getElementById("bookModal"));
  const toastMsg = new bootstrap.Toast(document.getElementById("msgToast"));
  const srchFld = document.getElementById("searchFld");
  const sortOpt = document.getElementById("sortOpt");
  const resetBtn = document.getElementById("resetBtn");
  const openBook = document.getElementById("openBook");
  const bookFromModal = document.getElementById("bookFromModal");
  const formBook = document.getElementById("frmBook");
  const facilityGrid = document.getElementById("facilityGrid");
  const facilitySelect = document.getElementById("bookFac");

    


  // detailsmodal
        viewBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const name = btn.dataset.fac;
            const f = facInfo[name];

            document.getElementById("facTitle").textContent = name;
            document.getElementById("facImg").src = f.img;
            document.getElementById("facDesc").textContent = f.desc;
            document.getElementById("facCap").textContent = f.capacity;
            document.getElementById("facTime").textContent = f.hours;
            document.getElementById("facLed").textContent = f.led;

            const list = document.getElementById("facFeatures");
            list.innerHTML = "";
            f.features.forEach(feat => {
            const li = document.createElement("li");
            li.innerHTML = "• " + feat;
            list.appendChild(li);
            });

            modFac.show();
        });
        });


  // cant choose past date
  const today = new Date().toISOString().split("T")[0];
    document.getElementById("bookDate").setAttribute("min", today);



  openBook.addEventListener("click", () => modBook.show());
  bookFromModal.addEventListener("click", () => {
    modFac.hide();
    modBook.show();
  });

  formBook.addEventListener("submit", async function (ev) {
  ev.preventDefault();

  const payload = {
    facilityId: document.getElementById("bookFac").dataset.id,
    fullName: document.getElementById("userNm").value.trim(),
    email: document.getElementById("userMail").value.trim(),
    contactNumber: document.getElementById("userNum").value.trim(),
    date: document.getElementById("bookDate").value,
    time: document.getElementById("bookTime").value,
    purpose: document.getElementById("bookReason").value.trim()
  };

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Request failed");

    modBook.hide();
    toastMsg.show();
    formBook.reset();

  } catch (err) {
    alert("Failed to save booking");
    console.error(err);
  }
});


  // search
  srchFld.addEventListener("input", function () {
  const term = srchFld.value.toLowerCase();
  const cards = document.querySelectorAll(".facility-card");

  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(term) ? "block" : "none";
  });
});

 sortOpt.addEventListener("change", function () {
  const chosen = sortOpt.value;
  const cards = document.querySelectorAll(".facility-card");

  cards.forEach(card => {
    if (chosen === "all" || card.dataset.cat === chosen) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});



  resetBtn.addEventListener("click", function () {
  srchFld.value = "";
  sortOpt.value = "all";

  const cards = document.querySelectorAll(".facility-card");
  cards.forEach(card => card.style.display = "block");
});


  async function loadFacilities() {
  try {
    const res = await fetch("/api/facilities");
    const facilities = await res.json();

    facilityGrid.innerHTML = "";
    facilitySelect.innerHTML = `<option value="">Select a facility</option>`;

    facilities.forEach(fac => {
      // Create facility card
      const card = document.createElement("article");
      card.className = "facility-card";
      card.dataset.cat = fac.category;
      card.dataset.name = fac.name;

      card.innerHTML = `
        <h4>${fac.name}</h4>
        <figure>
          <img src="${fac.image}" alt="${fac.name}">
        </figure>
        <button type="button" class="view-btn">view details</button>
      `;

      // View details click
      card.querySelector(".view-btn").addEventListener("click", () => {
        showFacilityDetails(fac);
      });

      facilityGrid.appendChild(card);

      // Add to booking dropdown
      const opt = document.createElement("option");
      opt.textContent = fac.name;
      opt.value = fac.name;
      opt.dataset.id = fac._id; // IMPORTANT
      facilitySelect.appendChild(opt);
    });

  } catch (err) {
    console.error("Error loading facilities:", err);
  }
}

function showFacilityDetails(f) {
  document.getElementById("facTitle").textContent = f.name;
  document.getElementById("facImg").src = f.image;
  document.getElementById("facDesc").textContent = f.description;
  document.getElementById("facCap").textContent = f.capacity;
  document.getElementById("facTime").textContent = f.operatingHours;
  document.getElementById("facLed").textContent = f.managedBy;

  const list = document.getElementById("facFeatures");
  list.innerHTML = "";
  (f.features || []).forEach(feat => {
    const li = document.createElement("li");
    li.textContent = "• " + feat;
    list.appendChild(li);
  });

  modFac.show();
}

facilitySelect.addEventListener("change", function () {
  const selected = this.options[this.selectedIndex];
  this.dataset.id = selected.dataset.id;
});

loadFacilities();

async function loadBookings() {
  try {
    const res = await fetch("/api/bookings");
    const bookings = await res.json();

    const tbody = document.getElementById("bookingTableBody");
    tbody.innerHTML = "";

    bookings.forEach(b => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${b.facilityId?.name || "N/A"}</td>
        <td>${b.fullName}</td>
        <td>${b.date}</td>
        <td>${b.time}</td>
        <td>${b.purpose}</td>
        <td>${b.status}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Failed to load bookings", err);
  }
}

loadBookings();



});
