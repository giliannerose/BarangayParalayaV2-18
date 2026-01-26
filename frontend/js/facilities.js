
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
  const cards = document.querySelectorAll(".facility-card");

  //  facilities desc 
        const facInfo = {
        "Function Hall": {
            desc: "A spacious enclosed venue for gatherings, seminars, and private celebrations. Includes chairs, tables, and a basic sound system.",
            img: "img/facilities/function hall.jpg",
            led: "Led by Barangay Admin Office",
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
        "Sports Complex": {
            desc: "A covered court ideal for basketball, volleyball, and other community events. Also used for barangay-wide assemblies and outreach programs.",
            img: "img/facilities/basketballcourt4.jpg",
            led: "Led by Youth Council",
            capacity: "Up to 300 people",
            hours: "6:00 AM – 9:00 PM",
            features: [
            "Covered basketball court",
            "Bleacher seating",
            "Lighting system for night use",
            "Sound system setup area"
            ]
        },
        "Health Center": {
            desc: "Provides free consultations, first aid, and preventive health services for residents. Staffed by barangay health workers and visiting nurses.",
            img: "img/facilities/clinic.jpg",
            led: "Led by Barangay Health Workers",
            capacity: "10 patients at a time",
            hours: "8:00 AM – 5:00 PM",
            features: [
            "Consultation room",
            "Treatment area",
            "Waiting area",
            "Pharmacy counter"
            ]
        },
        "Library/Study Area": {
            desc: "A quiet place for students and residents to study or access reference materials. Occasionally used for literacy programs and workshops.",
            img: "img/facilities/library.jpg",
            led: "Led by Barangay Education Committee",
            capacity: "Up to 40 people",
            hours: "9:00 AM – 6:00 PM",
            features: [
            "Study tables and chairs",
            "Wi-Fi access",
            "Community reference books",
            "Air-conditioned room"
            ]
        }
        };


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

  formBook.addEventListener("submit", function(ev) {
    ev.preventDefault();

    let dataArr = JSON.parse(localStorage.getItem("bookingsList") || "[]");
    const info = {
        nm: document.getElementById("userNm").value.trim(),
        mail: document.getElementById("userMail").value.trim(),
        num: document.getElementById("userNum").value.trim(),
        fac: document.getElementById("bookFac").value,
        date: document.getElementById("bookDate").value,
        time: document.getElementById("bookTime").value,
        why: document.getElementById("bookReason").value.trim()
  };


    dataArr.push(info);
    localStorage.setItem("bookingsList", JSON.stringify(dataArr));
    modBook.hide();
    toastMsg.show();
    formBook.reset();
  });

  // search
  srchFld.addEventListener("input", function() {
    let term = srchFld.value.toLowerCase();
    cards.forEach(c => {
      let nm = c.dataset.name.toLowerCase();
      c.style.display = nm.includes(term) ? "block" : "none";
    });
  });

  sortOpt.addEventListener("change", function() {
    let chosen = sortOpt.value;
    cards.forEach(c => {
      if (chosen === "all" || c.dataset.cat === chosen) {
        c.style.display = "block";
      } else {
        c.style.display = "none";
      }
    });
  });


  resetBtn.addEventListener("click", function() {
    srchFld.value = "";
    sortOpt.value = "all";
    cards.forEach(c => (c.style.display = "block"));
  });
});
