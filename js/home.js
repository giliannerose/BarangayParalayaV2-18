document.addEventListener("DOMContentLoaded", () => {
  const previewArea = document.getElementById("announcePreview");
  const modalBox = new bootstrap.Modal(document.getElementById("announceModal"));
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalDate = document.getElementById("modalDate");
  const modalImg = document.getElementById("modalImg");

  fetch("data/announcements.json")
  .then(res => res.json())
  .then(data => {
    const latest = data.slice(0, 3); 
    renderPreview(latest);
    document.getElementById("announcePreview").classList.remove("d-none"); // show only after render
  })
    .catch(err => {
      previewArea.innerHTML = `<p class="text-danger">Error loading announcements.</p>`;
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


  const projects = [
    {
      title: "Paralaya Estero Cleanup",
      status: "Ongoing",
      start: "January 2025",
      end: "June 2025",
      budget: "120,000",
      location: "Zone 1, Barangay Paralaya",
      led: "Barangay Officials and Volunteers",
      desc: "The Paralaya Estero Cleanup Drive is an ongoing community-led initiative aimed at rehabilitating and restoring the paralaya waterway. This project focuses on removing plastic waste, debris, and other pollutants to improve the water quality and surrounding ecosystem. The efforts are driven by local residents and volunteers, with a current progress of 60% completion. The ultimate goal is to create a healthier, cleaner environment for the community and local marine life, transforming the estero from a polluted channel into a vibrant and sustainable part of the local environment.",
      short: "A community effort to clean and rehabilitate the main estero in Barangay Paralaya.",
      impact: "Will improve water flow and reduce flooding for 80 households.",
      img: "img/projects/estero cleanup.jpg",
      progress: 60
    },
    {
      title: "Paralaya Community Garden",
      status: "Completed",
      start: "March 2024",
      end: "September 2024",
      budget: "85,000",
      location: "Zone 3, Barangay Paralaya",
      led: "Barangay Agriculture Committee and Youth Volunteers",
      desc: "The Brgy. Paralaya Community Garden is a successfully completed initiative that transformed a formerly unused lot into a lush, productive green space. This project, now at 100% completion, provides residents with a shared area for growing vegetables and herbs. The garden not only promotes food sustainability within the community but also serves as a hub for local engagement and education on urban farming",
      short : "A completed urban farming project that promotes food sustainability.", 
      impact: "Provides a sustainable source of fresh produce for 40+ households, promotes environmental awareness, and strengthens community cooperation through shared urban farming efforts",
      img: "img/projects/community garden.jpg",
      progress: 100
    },
    {
      title: "Barangay Park",
      status: "Ongoing",
      start: "February 2025",
      end: "November 2025",
      budget: "150,000",
      location: "Zone 2, Barangay Paralaya (near Barangay Hall)",
      led: "Barangay Council and Sangguniang Kabataan",
      desc: "The Barangay Park is an ongoing project designed to create a recreational hub for the local community. With 40% of the work completed, the project is currently focused on laying the groundwork for key features such as a children's play area, walking paths, and landscaped green spaces. Once finished, the park will offer a safe and accessible environment for residents of all ages to enjoy outdoor activities and foster a stronger sense of community.",
      short: "A new community park with play areas and green spaces under development.",
      impact: "Will serve as a safe, accessible recreational space for residents of all ages, encourage physical activity, and foster stronger community connections and youth engagement.",
      img: "img/projects/brgy park.jpg",
      progress: 40
    }
  ];

  renderProjects(projects);

  function renderProjects(arr) {
    projPreview.innerHTML = "";
    arr.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-sm-6 fadeItem";
      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 clickableCard" style="cursor:pointer;">
          <img src="${p.img}" class="card-img-top" alt="${p.title}">
          <div class="card-body text-center">
            <h6 class="card-title text-success fw-semibold">${p.title}</h6>
            <p class="small text-muted">${p.short}</p>
          </div>
        </div>
      `;

      col.querySelector(".clickableCard").addEventListener("click", () => {
        document.getElementById("projModalLabel").textContent = p.title;
        document.getElementById("mStatus").textContent = p.status;
        document.getElementById("mStart").textContent = p.start;
        document.getElementById("mEnd").textContent = p.end;
        document.getElementById("mBudget").textContent = p.budget;
        document.getElementById("mLoc").textContent = p.location;
        document.getElementById("mLed").textContent = p.led;
        document.getElementById("mDesc").textContent = p.desc;
        document.getElementById("mImpact").textContent = p.impact;
        document.querySelector("#projModalBody img").src = p.img;

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
  const facilities = [
    {
      name: "Function Hall",
      short: "Spacious venue for gatherings and private events.",
      desc: "A spacious enclosed venue for gatherings, seminars, and private celebrations. Includes chairs, tables, and a basic sound system.",
      img: "img/facilities/function hall.jpg",
      led: "Barangay Admin Office",
      capacity: "Up to 150 people",
      hours: "8:00 AM – 10:00 PM",
      features: [
        "Tables and chairs",
        "Podium and sound system",
        "Ceiling fans and ventilation",
        "Comfort rooms",
        "Stage area",
        "Electrical outlets"
      ]
    },
    {
      name: "Sports Complex",
      short: "Covered court ideal for sports and assemblies.",
      desc: "A covered court ideal for basketball, volleyball, and community events. Also used for barangay-wide assemblies.",
      img: "img/facilities/basketballcourt4.jpg",
      led: "Youth Council",
      capacity: "Up to 300 people",
      hours: "6:00 AM – 9:00 PM",
      features: [
        "Basketball court",
        "Bleacher seating",
        "Lighting system",
        "Sound setup area"
      ]
    },
    {
      name: "Health Center",
      short: "Provides consultations and first aid services.",
      desc: "Provides free consultations, first aid, and preventive health services for residents. Staffed by barangay health workers.",
      img: "img/facilities/clinic.jpg",
      led: "Barangay Health Workers",
      capacity: "10 patients at a time",
      hours: "8:00 AM – 5:00 PM",
      features: [
        "Consultation room",
        "Treatment area",
        "Waiting area",
        "Pharmacy counter"
      ]
    },
    {
      name: "Library / Study Area",
      short: "Quiet study place and literacy hub.",
      desc: "A quiet place for students and residents to study or access reference materials. Also used for literacy programs.",
      img: "img/facilities/library.jpg",
      led: "Barangay Education Committee",
      capacity: "Up to 40 people",
      hours: "9:00 AM – 6:00 PM",
      features: [
        "Study tables and chairs",
        "Wi-Fi access",
        "Community reference books",
        "Air-conditioned room"
      ]
    }
  ];

  renderFacilities(facilities);

  function renderFacilities(arr) {
    facPreview.innerHTML = "";
    arr.forEach(f => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6 fadeItem";
      col.innerHTML = `
        <div class="card shadow-sm border-0 clickableCard" style="cursor:pointer;">
          <img src="${f.img}" class="card-img-top" alt="${f.name}">
          <div class="card-body text-center">
            <h6 class="card-title text-success fw-semibold">${f.name}</h6>
            <p class="small text-muted">${f.short}</p>
          </div>
        </div>
      `;

      col.querySelector(".clickableCard").addEventListener("click", () => {
        document.getElementById("facTitle").textContent = f.name;
        document.getElementById("facImg").src = f.img;
        document.getElementById("facDesc").textContent = f.desc;
        document.getElementById("facLed").textContent = f.led;
        document.getElementById("facCap").textContent = f.capacity;
        document.getElementById("facTime").textContent = f.hours;

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
  const officials = [

    {
      name: "Manuel Garcia III",
      pos: "Barangay Captain",
      term: "2022–Present",
      desc: "Dedicated to leading Barangay Paralaya with transparency and compassion. Focuses on improving local infrastructure, disaster response, and community safety.",
      advocacy: "A safer, cleaner, and united Barangay Paralaya.",
      contact: "manuelgarcia@paralaya.gmail.com",
      img: "img/officials/manuel.garcia.III.png",
    },


    {
      name: "Bianca Sofia Aquino",
      pos: "Barangay Secretary",
      term: "2022–Present",
      desc: "Responsible for maintaining barangay records and ensuring accurate documentation of community events and certifications.",
      advocacy: "Promotes transparency and efficient government service.",
      contact: "biancaaquino@paralaya.gmail.com",
      img: "img/officials/bianca.sofia.aquino.png"
    },
    
    {
      name: "Roderick Alvaro",
      pos: "Barangay Tanod",
      term: "2022–Present",
      desc: "Conducts barangay patrols and helps maintain peace and security in the community.",
      advocacy: "Dedicated to peacekeeping and maintaining community order.",
      contact: "roderickalvaro@paralaya.gmail.com",
      img: "img/officials/roderick.alvaro.png"
    },
    {
      name: "Brad San Jose",
      pos: "Barangay Councilor",
      term: "2022–Present",
      desc: "Focuses on peace and order initiatives and helps coordinate barangay patrols and community events.",
      advocacy: "Promotes unity, safety, and discipline within the barangay.",
      contact: "bradsanjose@paralaya.gmail.com",
      img: "img/officials/brad.sanjose.png"
    }
  ];

  renderOfficials(officials);

  function renderOfficials(arr) {
    officialPreview.innerHTML = "";
    arr.forEach(o => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6 fadeItem";

      col.innerHTML = `
        <div class="card shadow-sm border-0 clickableCard text-center" style="cursor:pointer;">
          <img src="${o.img}" class="rounded-circle mx-auto mt-3" width="120" height="120" alt="${o.name}">
          <div class="card-body">
            <h6 class="card-title text-success fw-semibold">${o.name}</h6>
            <p class="small text-muted mb-0">Role: ${o.pos}</p>
          </div>
        </div>
      `;

    
      col.querySelector(".clickableCard").addEventListener("click", () => {
        document.getElementById("officialModalLabel").textContent = o.name;
        document.getElementById("offImg").src = o.img;
        document.getElementById("offPos").textContent = o.pos;
        document.getElementById("offTerm").textContent = o.term;
        document.getElementById("offDesc").textContent = o.desc;
        document.getElementById("offAdv").textContent = o.advocacy;
        document.getElementById("offContact").textContent = o.contact;

        officialModal.show();
      });

      officialPreview.appendChild(col);
      setTimeout(() => col.classList.add("fadeVisible"), 100);
    });
  }
});
