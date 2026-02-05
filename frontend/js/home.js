document.addEventListener("DOMContentLoaded", () => {

  function shortenText(text, maxLength = 50) {
  if (!text) return "";
  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
}

  const previewArea = document.getElementById("announcePreview");
  const modalBox = new bootstrap.Modal(document.getElementById("announceModal"));
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalDate = document.getElementById("modalDate");
  const modalImg = document.getElementById("modalImg");


  //announcements
  fetch("/api/announcements")
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch announcements");
    }
    return res.json();
  })
  .then(data => {
    const latest = data.slice(0, 3); // Home preview rule
    renderPreview(latest);
    previewArea.classList.remove("d-none");
  })
  .catch(err => {
    previewArea.innerHTML = `<p class="text-danger">Unable to load announcements.</p>`;
    console.error(err);
  });

  

  function renderPreview(arr) {
    previewArea.innerHTML = "";
    arr.forEach(a => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-sm-6 fadeItem";

      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 clickableCard" style="cursor:pointer;">
          <img src="${a.img || 'img/placeholder.jpg'}" class="card-img-top rounded" alt="${a.title}">
          <div class="card-body text-center">
            <h6 class="card-title text-success">${a.title}</h6>
            <p class="small text-muted mb-1">${a.month} • ${a.date}</p>
          </div>
        </div>
      `;


      const card = col.querySelector(".clickableCard");
      card.addEventListener("click", () => {
        modalTitle.textContent = a.title;
        modalText.innerHTML = `
          <p>${a.text}</p>
          <p class="mt-2">${a.details}</p>
          <p class="fw-bold text-muted mt-3">Posted by: ${a.postedBy}</p>
        `;
        modalDate.textContent = `${a.month.toUpperCase()} | ${a.date}`;
        if (a.img) {
          modalImg.src = a.img;
          modalImg.classList.remove("d-none");
        } else {
          modalImg.classList.add("d-none");
        }
        modalBox.show();
      });

      previewArea.appendChild(col);

      setTimeout(() => col.classList.add("fadeVisible"), 100);
    });
  }



  const projPreview = document.getElementById("projPreview");
  const projModal = new bootstrap.Modal(document.getElementById("projModal"));

  fetch("/api/projects")
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch projects");
    }
    return res.json();
  })
  .then(data => {
    const ongoing = data.filter(p => p.status === "ongoing");
    renderProjects(ongoing);
  })
  .catch(err => {
    projPreview.innerHTML = `<p class="text-danger">Unable to load projects.</p>`;
    console.error(err);
  });


  function renderProjects(arr) {
    projPreview.innerHTML = "";
    arr.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-sm-6 fadeItem";
      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 clickableCard" style="cursor:pointer;">
          <img src="${p.image || 'img/placeholder.jpg'}" class="card-img-top" alt="${p.title}">
          <div class="card-body text-center">
            <h6 class="card-title text-success fw-semibold">${p.title}</h6>
            <p class="small text-muted">
              ${shortenText(p.description, 140)}
            </p>
          </div>
        </div>
      `;


      col.querySelector(".clickableCard").addEventListener("click", () => {
        document.getElementById("mStatus").textContent = p.status;
        document.getElementById("mStart").textContent = p.startDate || "N/A";
        document.getElementById("mEnd").textContent = p.endDate || "N/A";
        document.getElementById("mBudget").textContent = p.budget || "N/A";
        document.getElementById("mLoc").textContent = p.location || "N/A";
        document.getElementById("mLed").textContent = p.ledBy || "N/A";
        document.getElementById("mDesc").textContent = p.description || "";
        document.getElementById("mImpact").textContent = p.impact || "";
        document.querySelector("#projModalBody img").src = p.image || "img/placeholder.jpg";


        // Progress bar
        const modalBar = document.getElementById("modalProg");
        modalBar.style.width = "0%";
        modalBar.textContent = "0%";
        let progress = 0;
        const timer = setInterval(() => {
          if (progress >= p.progress) {
            clearInterval(timer);
          } else {
            progress++;
            modalBar.style.width = progress + "%";
            modalBar.textContent = progress + "%";
          }
        }, 15);

        projModal.show();
      });

      projPreview.appendChild(col);
      setTimeout(() => col.classList.add("fadeVisible"), 100);
    });
  }


// facility

  const facPreview = document.getElementById("facPreview");
  const facModal = new bootstrap.Modal(document.getElementById("facModal"));

  // Facility data
  fetch("/api/facilities")
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch facilities");
    }
    return res.json();
  })
  .then(data => {
    renderFacilities(data);
  })
  .catch(err => {
    facPreview.innerHTML = `<p class="text-danger">Unable to load facilities.</p>`;
    console.error(err);
  });


  function renderFacilities(arr) {
    facPreview.innerHTML = "";
    arr.forEach(f => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6 fadeItem";
      col.innerHTML = `
        <div class="card shadow-sm border-0 clickableCard" style="cursor:pointer;">
          <img src="${f.image || 'img/placeholder.jpg'}" class="card-img-top" alt="${f.name}">
            <h6 class="card-title text-success fw-semibold">${f.name}</h6>
            <p class="small text-muted">${shortenText(f.description, 80)}</p>
          </div>
        </div>
      `;

      col.querySelector(".clickableCard").addEventListener("click", () => {
        document.getElementById("facTitle").textContent = f.name;
        document.getElementById("facImg").src = f.image || "img/placeholder.jpg";
        document.getElementById("facDesc").textContent = f.description || "";
        document.getElementById("facLed").textContent = f.managedBy || "N/A";
        document.getElementById("facCap").textContent = f.capacity || "N/A";
        document.getElementById("facTime").textContent = f.operatingHours || "N/A";


        const list = document.getElementById("facFeatures");
        list.innerHTML = "";
        f.features.forEach(feat => {
          const li = document.createElement("li");
          li.textContent = "• " + feat;
          list.appendChild(li);
        });

        facModal.show();
      });

      facPreview.appendChild(col);
      setTimeout(() => col.classList.add("fadeVisible"), 100);
    });
  }


  const officialPreview = document.getElementById("officialPreview");
  const officialModal = new bootstrap.Modal(document.getElementById("officialModal"));

  // featured officials
  fetch("/api/officials")
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch officials");
    }
    return res.json();
  })
  .then(data => {
    const featured = data.slice(0, 4); // Home rule
    renderOfficials(featured);
  })
  .catch(err => {
    officialPreview.innerHTML = `<p class="text-danger">Unable to load officials.</p>`;
    console.error(err);
  });


  function renderOfficials(arr) {
    officialPreview.innerHTML = "";
    arr.forEach(o => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6 fadeItem";

      col.innerHTML = `
        <div class="card shadow-sm border-0 clickableCard text-center" style="cursor:pointer;">
         <img src="${o.image || 'img/placeholder.jpg'}"
          class="rounded-circle mx-auto mt-3"
          width="120" height="120"
          alt="${o.name}">

      <h6 class="card-title text-success fw-semibold">${o.name}</h6>
      <p class="small text-muted mb-0">Role: ${o.position}</p>
          </div>
        </div>
      `;

    
      col.querySelector(".clickableCard").addEventListener("click", () => {
        document.getElementById("officialModalLabel").textContent = o.name;
        document.getElementById("offImg").src = o.image || "img/placeholder.jpg";
        document.getElementById("offPos").textContent = o.position;
        document.getElementById("offTerm").textContent = o.term || "N/A";
        document.getElementById("offDesc").textContent = o.description || "";
        document.getElementById("offAdv").textContent = o.advocacy || "";
        document.getElementById("offContact").textContent = o.contactInfo || "N/A";


        officialModal.show();
      });

      officialPreview.appendChild(col);
      setTimeout(() => col.classList.add("fadeVisible"), 100);
    });
  }
});
