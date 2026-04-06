const yearSlider = document.getElementById("yearSlider");
const currentYear = document.getElementById("currentYear");
const leftInfoBox = document.getElementById("leftInfoBox");
const rightInfoBox = document.getElementById("rightInfoBox");
const statusBox = document.getElementById("statusBox");

yearSlider.addEventListener("input", () => {
  currentYear.textContent = yearSlider.value;

  statusBox.innerHTML = `
    <h2>Geselecteerd jaar</h2>
    <p>Akker informatie voor jaar: <strong>${yearSlider.value}</strong>.</p>
  `;
});

/* Field interactions */
const fieldCards = document.querySelectorAll(".field-card");

fieldCards.forEach((card, index) => {
  const fieldName = card.dataset.field;

  /*card.addEventListener("mouseenter", () => {
    leftInfoBox.innerHTML = `
      <h3>${fieldName}</h3>
      <p>Placeholder information for this field in year <strong>${yearSlider.value}</strong>.</p>
    `;
  });
  */

  card.addEventListener("click", () => {
    statusBox.innerHTML = `
      <h2>${fieldName}</h2>
      <p>${fieldName} information main panel.</p>
    `;
  });
});

/* D3 tree apples */
const apples = [
  { id: 1, name: "Apple 1", x: 100,  y: 80,  color: "#d62828", type: "Placeholder red apple" },
  { id: 2, name: "Apple 2", x: 200, y: 105, color: "#d62828", type: "Placeholder red apple" },
  { id: 3, name: "Apple 3", x: 100,  y: 185, color: "#f77f00", type: "Placeholder orange apple" },
  { id: 4, name: "Apple 4", x: 200, y: 245, color: "#2a9d8f", type: "Placeholder green apple" },
  { id: 5, name: "Apple 5", x: 100, y: 300, color: "#8d99ae", type: "Placeholder custom apple" }
];

const svg = d3.select("#treeSvg");

const appleGroups = svg
  .selectAll("g.apple")
  .data(apples)
  .enter()
  .append("g")
  .attr("class", "apple")
  .attr("transform", d => `translate(${d.x}, ${d.y})`)
  .style("cursor", "pointer")
  .on("mouseenter", function (event, d) {
    d3.select(this).select("ellipse")
      .transition()
      .duration(120)
      .attr("rx", 30)
      .attr("ry", 25);

    /*
    rightInfoBox.innerHTML = `
      <h3>${d.name}</h3>
      <p>${d.type}<br>Year: <strong>${yearSlider.value}</strong></p>
    `;
    */
  })
  .on("mouseleave", function () {
    d3.select(this).select("ellipse")
      .transition()
      .duration(120)
      .attr("rx", 27)
      .attr("ry", 22);
  })
  .on("click", function (event, d) {
    statusBox.innerHTML = `
      <h2>${d.name}</h2>
      <p>${d.name} information main panel.</p>
    `;
  });

appleGroups
  .append("ellipse")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("rx", 27)
  .attr("ry", 22)
  .attr("fill", "transparent")
  .attr("stroke", d => d.color)
  .attr("stroke-width", 4);
/*
appleGroups
  .append("text")
  .attr("x", -22)
  .attr("y", -28)
  .attr("font-size", "13px")
  .attr("font-weight", "700")
  .text(d => d.id <= 2 ? d.name : "");
*/
/* Bottom boxes can also be hovered/clicked */
leftInfoBox.addEventListener("click", () => {
  statusBox.innerHTML = `
    <h2>Left panel</h2>
    <p>Left info box information in main panel.</p>
  `;
});

rightInfoBox.addEventListener("click", () => {
  statusBox.innerHTML = `
    <h2>Right panel</h2>
    <p>Right info box information in main panel.</p>
  `;
});