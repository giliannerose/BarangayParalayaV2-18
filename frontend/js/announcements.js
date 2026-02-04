document.addEventListener("DOMContentLoaded", () => {
  const listArea = document.getElementById("announceList");
  const modalBox = new bootstrap.Modal(document.getElementById("announceModal"));
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalDate = document.getElementById("modalDate");
  const modalImg = document.getElementById("modalImg");
  const searchMonth = document.getElementById("searchMonth");
  const sortSelect = document.getElementById("sort");
  const catSelect = document.getElementById("cat");
  const monthTabs = document.querySelectorAll("#monthTabs button");

  let newsData = [];
  let filteredNews = [];

 
  fetch("/api/announcements")
  .then(res => {
    if (!res.ok) throw new Error("Failed to load announcements");
    return res.json();
  })
  .then(data => {
    newsData = data;
    filteredNews = [...newsData];
    renderAnnouncements(filteredNews);
  })
  .catch(err => {
    listArea.innerHTML = `<p class="text-danger text-center mt-3">Error loading announcements.</p>`;
    console.error(err);
  });


  function renderAnnouncements(arr) {
    listArea.innerHTML = "";
    arr.forEach((a) => {
      const div = document.createElement("div");
      div.className = "col-md-5 fadeItem";
      div.innerHTML = `
        <article class="p-3 bg-light rounded shadow-sm h-100">
          <h5 class="text-success border-bottom border-warning pb-1">${a.title}</h5>
          <small class="text-muted d-block mb-2">${a.month.charAt(0).toUpperCase() + a.month.slice(1)} • ${a.date}</small>
          <button class="btn btn-sm btn-success viewBtn">View</button>
        </article>
      `;

      
      div.querySelector(".viewBtn").addEventListener("click", () => {
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


      listArea.appendChild(div);
      setTimeout(() => div.classList.add("fadeVisible"), 100);
    });
  }

  //  filters
  function updateView() {
    const searchVal = searchMonth.value.toLowerCase();
    const catVal = catSelect.value;
    let res = newsData.filter(
      (n) =>
        (n.month.toLowerCase().includes(searchVal) || searchVal === "") &&
        (catVal === "all" || n.cat === catVal)
    );

    if (sortSelect.value === "new") {
      res.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      res.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    filteredNews = res;
    renderAnnouncements(res);
  }

  // Event listeners
  searchMonth.addEventListener("input", updateView);
  sortSelect.addEventListener("change", updateView);
  catSelect.addEventListener("change", updateView);

  monthTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      monthTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const m = btn.dataset.month;
            filteredNews =
              m === "all"
                ? newsData
                : newsData.filter(
                    (x) => x.month?.toLowerCase().trim() === m
            );
      renderAnnouncements(filteredNews);
    });
  });
});
