
document.addEventListener("DOMContentLoaded", () => {
  const srchBox = document.getElementById('search');
  const statBox = document.getElementById('status');
  const yearBox = document.getElementById('year');
  const cards = document.querySelectorAll('#projList article');
  const noRes = document.getElementById('noRes');

  function filterStuff() {
    const txt = srchBox.value.trim().toLowerCase();
    const stat = (statBox.value || "").toLowerCase();
    const year = yearBox.value;
    let showCnt = 0;

    cards.forEach(c => {
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

  projModal.addEventListener('show.bs.modal', e => {
    const art = e.relatedTarget.closest('article');
    document.getElementById('projModalLabel').textContent = art.dataset.title;
    document.getElementById('mStatus').textContent = art.dataset.status;
    document.getElementById('mStart').textContent = art.dataset.start;
    document.getElementById('mEnd').textContent = art.dataset.end;
    document.getElementById('mBudget').textContent = art.dataset.budget || 'N/A';
    document.getElementById('mLoc').textContent = art.dataset.location || 'N/A';
    document.getElementById('mLed').textContent = art.dataset.led || 'N/A';
    document.getElementById('mDesc').textContent = art.dataset.desc;
    document.getElementById('mImpact').textContent = art.dataset.impact || '';

    const modalImg = document.querySelector('#projModalBody img');
    modalImg.src = art.dataset.img;

    const modalBar = document.getElementById('modalProg');
    modalBar.style.width = '0%';
    modalBar.textContent = '0%';

    clearInterval(barTimer);

    let valNow = 0;
    const valTarget = parseInt(art.dataset.progress);
    barTimer = setInterval(() => {
      if (valNow >= valTarget) {
        clearInterval(barTimer);
      } else {
        valNow++;
        modalBar.style.width = valNow + '%';
        modalBar.textContent = valNow + '%';
      }
    }, 12);
  });

  projModal.addEventListener('hidden.bs.modal', () => {
    clearInterval(barTimer);
  });
});

// progress bars on 
window.addEventListener("load", () => {
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
});

