const yearSlider = document.getElementById("yearSlider");
const currentYear = document.getElementById("currentYear");
const leftInfoBox = document.getElementById("leftInfoBox");
const rightInfoBox = document.getElementById("rightInfoBox");
const statusBox = document.getElementById("statusBox");
const fieldCards = document.querySelectorAll(".field-card");

function showStatusBox(title, text) {
  statusBox.innerHTML = `
    <h2>${title}</h2>
    <p>${text}</p>
  `;
  statusBox.classList.add("is-visible");
}

function hideStatusBox() {
  statusBox.classList.remove("is-visible");
}

/*slider*/
yearSlider.addEventListener("input", () => {
  currentYear.textContent = yearSlider.value;

  showStatusBox(
    "Geselecteerd jaar",
    `Akker informatie voor jaar: <strong>${yearSlider.value}</strong>.`
  );
});

/*hover akkers*/
fieldCards.forEach((card) => {
  const fieldName = card.dataset.field;

  card.addEventListener("mouseenter", () => {
    showStatusBox(
      fieldName,
      `${fieldName} information main panel voor jaar <strong>${yearSlider.value}</strong>.`
    );
  });

  card.addEventListener("mouseleave", () => {
    hideStatusBox();
  });
});

/* hover infobox */
leftInfoBox.addEventListener("mouseenter", () => {
  showStatusBox(
    "Left panel",
    "Left info box information in main panel."
  );
});

leftInfoBox.addEventListener("mouseleave", () => {
  hideStatusBox();
});

rightInfoBox.addEventListener("mouseenter", () => {
  showStatusBox(
    "Right panel",
    "Right info box information in main panel."
  );
});

rightInfoBox.addEventListener("mouseleave", () => {
  hideStatusBox();
});