const yearSlider = document.getElementById("yearSlider");
const currentYear = document.getElementById("currentYear");
const leftInfoBox = document.getElementById("leftInfoBox");
const rightInfoBox = document.getElementById("rightInfoBox");
const statusBox = document.getElementById("statusBox");
const fieldCards = document.querySelectorAll(".field-card");

function showStatusBox(title, htmlContent) {
  statusBox.innerHTML = `
    <h2>${title}</h2>
    ${htmlContent}
  `;
  statusBox.classList.add("is-visible");
}

function hideStatusBox() {
  statusBox.classList.remove("is-visible");
}

/*slider*/
yearSlider.addEventListener("input", () => {
  currentYear.textContent = yearSlider.value;
});

/*hover akkers*/
fieldCards.forEach((card) => {
  const fieldName = card.dataset.field;

  card.addEventListener("mouseenter", () => {
    showStatusBox(
      fieldName,
      `${fieldName} information main panel voor jaar ${yearSlider.value}.`
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

/* data boomstam */
async function OmzetBoom() {
    try {
        // Inladen van de csv
        const data = await d3.csv("data/omzet_en_prijs.csv");

        const svg = d3.select("#tree-overlay");
        const width = 700;
        const height = 700;
        const centerX = width / 2;
        const centerY = height / 2;
        
        svg.attr("viewBox", `0 0 ${width} ${height}`);

        // Visualization Constants
        const innerRadius = 85; 
        const maxRadius = 310;
        const years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"];
        const ringWidth = (maxRadius - innerRadius) / years.length;

        // Color Palette
        const colorScale = d3.scaleOrdinal()
            .domain([...new Set(data.map(d => d.ras))])
            .range(["#5EB44D", "#EBD54C", "#E35B5B", "#7B42F5", "#B3B3B3", "#FFA33F", "#78C8F0"]);

        const g = svg.append("g")
            .attr("transform", `translate(${centerX}, ${centerY})`);

        // Loopen door elk jaar
        years.forEach((year, index) => {
            const yearData = data.filter(d => d.boekjaar === year);
            
            // Pie generator
            const pie = d3.pie()
                .value(d => +d.omzet)
                .sort(null);

            // Maken van de cirkels
            const arc = d3.arc()
                .innerRadius(innerRadius + (index * ringWidth))
                .outerRadius(innerRadius + ((index + 1) * ringWidth) - 3)
                .cornerRadius(3);

            // Tekenen van cirkelsegmenten
            const segments = g.append("g")
                .selectAll("path")
                .data(pie(yearData))
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", d => colorScale(d.data.ras))
                .attr("stroke", "white")
                .attr("stroke-width", "0.5px")
                .style("cursor", "pointer")
                .style("transition", "opacity 0.2s");

            //Status Box hover
            segments.on("mouseover", function(event, d) {
              d3.select(this).style("opacity", "0.7");
              
              // statusbox details over cirkelchart vanuit data (omzet_en_prijs)
              const detailedInfo = `
                <hr>
                <div class="status-section">
                  <h3>Omzet en prijs</h3>
                  <p><strong>Omzet:</strong> €${Number(d.data.omzet).toLocaleString()}</p>
                  <p><strong>Prijs per kg:</strong> €${d.data['prijs per kg']}</p>
                </div>
                <div class="status-section">
                  <h3>Productie</h3>
                  <p><strong>Hoeveelheid:</strong> ${Number(d.data['hoeveelheid (kg)']).toLocaleString()} kg</p>
                  <p><strong>Boekjaar:</strong> ${d.data.boekjaar}</p>
                </div>
              `;

              // Use your global function!
              showStatusBox(d.data.ras, detailedInfo);
          })
          .on("mouseout", function() {
              d3.select(this).style("opacity", "1");
              hideStatusBox(); // Use your global function!
          });
        });

        // Tekst midden boomstam
        const centerText = g.append("g").style("pointer-events", "none");
        
        centerText.append("text")
            .attr("text-anchor", "middle")
            .attr("y", -5)
            .style("font-family", "'Playfair Display', serif")
            .style("font-size", "22px")
            .style("fill", "#455D30")
            .style("font-weight", "bold")
            .text("Omzet per ras");

        centerText.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 20)
            .style("font-family", "'Playfair Display', serif")
            .style("font-size", "14px")
            .style("fill", "#607154")
            .style("font-style", "italic")
            .text("per boekjaar");

    } catch (error) {
        console.error("Error loading the CSV or drawing the chart:", error);
    }
}

// Tekenen van de boom
OmzetBoom();