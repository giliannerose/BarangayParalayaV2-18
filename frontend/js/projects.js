


async function loadProjects() {
  const res = await fetch("/api/projects");
  const projects = await res.json();
  renderProjects(projects);
}

function renderProjects(projects) {
  const list = document.getElementById("projList");
  list.innerHTML = "";

  projects.forEach(p => {
    const article = document.createElement("article");
    article.className = "fadeItem";

    article.setAttribute("data-title", p.title);
    article.setAttribute("data-status", p.status);
    article.setAttribute("data-progress", p.progress);
    article.setAttribute("data-desc", p.description);
    article.setAttribute("data-img", p.image);
    article.setAttribute("data-start", p.startDate);
    article.setAttribute("data-end", p.endDate);
    article.setAttribute("data-budget", p.budget);
    article.setAttribute("data-location", p.location);
    article.setAttribute("data-led", p.ledBy);
    article.setAttribute("data-impact", p.impact);


      article.innerHTML = `
    <h3>${p.title}</h3>
    <p>Status: ${p.status}</p>

    <div class="progress" style="height:15px;width:50%;">
      <div class="progress-bar bg-success" style="width:0%;">0%</div>
    </div>

    <div class="project-description mt-2">
      <img src="${p.image}" width="40%">
      <p>${p.description}</p>
    </div>
  `;

      const btn = document.createElement("button");
    btn.className = "btn btn-outline-success mt-2";
    btn.textContent = "View Details";



      btn.addEventListener("click", () => {
        // Populate modal content
        document.getElementById("projModalLabel").textContent = article.dataset.title;
        document.getElementById("mStatus").textContent = article.dataset.status;
        document.getElementById("mStart").textContent = article.dataset.start;
        document.getElementById("mEnd").textContent = article.dataset.end;
        document.getElementById("mBudget").textContent = article.dataset.budget || "N/A";
        document.getElementById("mLoc").textContent = article.dataset.location || "N/A";
        document.getElementById("mLed").textContent = article.dataset.led || "N/A";
        document.getElementById("mDesc").textContent = article.dataset.desc;
        document.getElementById("mImpact").textContent = article.dataset.impact || "";

        const modalImg = document.querySelector("#projModalBody img");
        modalImg.src = article.dataset.img;

        // Progress bar
        const modalBar = document.getElementById("modalProg");
        modalBar.style.width = "0%";
        modalBar.textContent = "0%";

        let valNow = 0;
        const valTarget = parseInt(article.dataset.progress);
        const barTimer = setInterval(() => {
          if (valNow >= valTarget) {
            clearInterval(barTimer);
          } else {
            valNow++;
            modalBar.style.width = valNow + "%";
            modalBar.textContent = valNow + "%";
          }
        }, 12);

        // Open modal AFTER data is set
        const modalEl = document.getElementById("projModal");
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      });



    article.appendChild(btn);



    list.appendChild(article);
  });

  animateProgressBars();
}



document.addEventListener("DOMContentLoaded", () => {
  loadProjects();

  const srchBox = document.getElementById('search');
  const statBox = document.getElementById('status');
  const yearBox = document.getElementById('year');

  function getCards() {
  return document.querySelectorAll('#projList article');
}

  const noRes = document.getElementById('noRes');



  function filterStuff() {
    const txt = srchBox.value.trim().toLowerCase();
    const stat = (statBox.value || "").toLowerCase();
    const year = yearBox.value;
    let showCnt = 0;

    getCards().forEach(c => {
      const title = c.dataset.title.toLowerCase();
      const s = c.dataset.status.toLowerCase();
      const start = c.dataset.start;
      const end = c.dataset.end;

      const inYear = !year || start.includes(year) || end.includes(year);

      const matchesSearch = title.includes(txt) || txt === '';
      const matchesStatus = stat === '' || s === stat;
      const matchesYear = inYear;

      const isVisible = matchesSearch && matchesStatus && matchesYear;

      c.classList.toggle('d-none', !isVisible);
      if (isVisible) showCnt++;
    });

    noRes.classList.toggle('d-none', showCnt > 0);
  }


  srchBox.addEventListener('input', filterStuff);
  statBox.addEventListener('change', filterStuff);
  yearBox.addEventListener('change', filterStuff);

  filterStuff();


  const projModal = document.getElementById('projModal');
  let barTimer;



  projModal.addEventListener('hidden.bs.modal', () => {
    clearInterval(barTimer);
  });
});

// progress bars on 
function animateProgressBars() {
  document.querySelectorAll("#projList article").forEach(article => {
    const progressBar = article.querySelector(".progress-bar");
    const target = parseInt(article.dataset.progress);

    let current = 0;
    const fill = setInterval(() => {
      if (current >= target) {
        clearInterval(fill);
      } else {
        current++;
        progressBar.style.width = current + "%";
        progressBar.textContent = current + "%";
      }
    }, 15);
  });
}


