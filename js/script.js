const yearSlider = document.getElementById("yearSlider");
const currentYear = document.getElementById("currentYear");
const leftInfoBox = document.getElementById("leftInfoBox");
const rightInfoBox = document.getElementById("rightInfoBox");
const statusBox = document.getElementById("statusBox");
const fieldCards = document.querySelectorAll(".field-card");
let activeMetric = "omzet";

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
async function OmzetBoom(metric = "omzet") {
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
        const rasKleuren = {
            "Milwa": "#256E0A",
            "Junami": "#256E0A",
            "Elstar": "#55A837",
            "Golden": "#EEDB4A",
            "Jonagold": "#F1952B",
            "Jonagored": "#F1952B",
            "kroet/industrie appels": "#B9A7A7",
            "Delcorf": "#89CCFD",
            "Braeburn": "#6B2FD3",
            "Joly-Red": "#D54848"
        };

        const colorScale = d3.scaleOrdinal()
            .domain(Object.keys(rasKleuren))
            .range(Object.values(rasKleuren));

        let g = svg.select("g.ring-group");
        if (g.empty()) {
            g = svg.append("g")
                .attr("class", "ring-group")
                .attr("transform", `translate(${centerX}, ${centerY})`);
        }
        // Loopen door elk jaar
        years.forEach((year, index) => {
            const yearData = data.filter(d => d.boekjaar === year);

            // Pie generator
            const pie = d3.pie()
                .value(d => +d[metric])
                .sort((a, b) => +b.omzet - +a.omzet);

            // Maken van de cirkels
            const arc = d3.arc()
                .innerRadius(innerRadius + (index * ringWidth))
                .outerRadius(innerRadius + ((index + 1) * ringWidth) - 3)
                .cornerRadius(3);

            const arcHover = d3.arc()
                .innerRadius(innerRadius + (index * ringWidth) - 4)
                .outerRadius(innerRadius + ((index + 1) * ringWidth) + 4)
                .cornerRadius(3);

            const pieData = pie(yearData);

            let ringG = g.select(`g.ring-${index}`);
            if (ringG.empty()) {
                ringG = g.append("g").attr("class", `ring-${index}`);
            }

            const segments = ringG.selectAll("path")
                .data(pieData, d => d.data.ras);

            const entered = segments.enter()
                .append("path")
                .attr("fill", d => colorScale(d.data.ras))
                .attr("stroke", "white")
                .attr("stroke-width", "0.5px")
                .style("cursor", "pointer")
                .style("transition", "opacity 0.2s")
                .each(function(d) {
                    this._current = { startAngle: d.startAngle, endAngle: d.startAngle };
                });
            const merged = entered.merge(segments);

            merged
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .raise()
                        .transition()
                        .duration(150)
                        .ease(d3.easeCubicOut)
                        .attr("d", arcHover(d))
                        .style("filter", "drop-shadow(0 0 6px rgba(255,255,255,0.85))");
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
                    showStatusBox(d.data.ras, detailedInfo);
                })
                .on("mouseout", function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(150)
                        .ease(d3.easeCubicOut)
                        .attr("d", arc(d))
                        .style("filter", null);
                    hideStatusBox();
                });

            merged.transition()
                .duration(600)
                .ease(d3.easeCubicInOut)
                .attrTween("d", function(d) {
                    const prev = this._current || { startAngle: d.startAngle, endAngle: d.startAngle };
                    const interpolate = d3.interpolate(prev, d);
                    this._current = d;
                    return t => arc(interpolate(t));
                });

            segments.exit()
                .transition()
                .duration(600)
                .ease(d3.easeCubicInOut)
                .attrTween("d", function(d) {
                    const interpolate = d3.interpolate(d, { startAngle: d.startAngle, endAngle: d.startAngle });
                    return t => arc(interpolate(t));
                })
                .remove();
        });

        // Tekst midden boomstam
        if (svg.select("text.center-label").empty()) {
            const centerText = g.append("g").style("pointer-events", "none");

            centerText.append("text")
                .attr("class", "center-label")
                .attr("text-anchor", "middle")
                .attr("y", -5)
                .style("font-family", "'Playfair Display', serif")
                .style("font-size", "22px")
                .style("fill", "#455D30")
                .style("font-weight", "bold")
                .text(`${metric}`);

            centerText.append("text")
                .attr("class", "center-sublabel")
                .attr("text-anchor", "middle")
                .attr("y", 20)
                .style("font-family", "'Playfair Display', serif")
                .style("font-size", "14px")
                .style("fill", "#607154")
                .style("font-style", "italic")
                .text("per boekjaar");
        } else {
            svg.select("text.center-label").text(`${metric}`);
        }

    } catch (error) {
        console.error("Error loading the CSV or drawing the chart:", error);
    }
}

document.querySelectorAll(".metric-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".metric-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeMetric = btn.dataset.metric;
        OmzetBoom(activeMetric);
    });
});

// Tekenen van de boom
OmzetBoom(activeMetric);