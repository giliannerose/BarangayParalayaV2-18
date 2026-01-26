
document.addEventListener('DOMContentLoaded', function () {
  const cardz = document.querySelectorAll('.officialcard');
  const modalBody = document.getElementById('modalContent');
  const modalTitle = document.getElementById('officialModalLabel');

  cardz.forEach((card) => {
    card.addEventListener('click', function () {
      const name = this.querySelector('h3').textContent;
      const position = this.querySelector('p').textContent;
      const imgSrc = this.querySelector('img').src;

      modalTitle.textContent = name;
      modalBody.innerHTML = `
        <img src="${imgSrc}" alt="${name}">
        <h6>${position}</h6>
      `;
    

                  const term = this.dataset.term || "—";
                  const description = this.dataset.desc || "";
                  const advocacy = this.dataset.advocacy || "";
                  const contactinfo = this.dataset.contactinfo || "";

                      modalBody.innerHTML = `
                        <img src="${imgSrc}" alt="${name}">
                        <h6> ${position}</h6>
                        <p><strong>Term:</strong> ${term}</p>
                        <p> ${description}</p>
                        <p><strong>Advocacy:</strong> ${advocacy}</p>
                        <p><strong>Contact Info:</strong> ${contactinfo}</p>
                      `;

const openModal = new bootstrap.Modal(document.getElementById('officialModal'));
      openModal.show();

    });
  });
});
