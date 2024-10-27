let isBubblechart = null;
let genre1 = null;

let bubbleData = [];
let rScale = null;
let svg = null;

const width = (window.innerWidth - 370) / 2;
const height = (window.innerHeight - 50 - 164) / 2;
const margin = { bottom: 50, left: 50, right: 50, top: 50 };
const topPadding = 50;

// Main function to create the bubble chart
function createBubblechart(data, containerId, minRangeValue, maxRangeValue, checkedGenres) {
  d3.csv("data/bubble_table.csv").then(function (table) {
    // Filter data based on genres and range
    populateBubbleData(table, minRangeValue, maxRangeValue, checkedGenres);

    // Add header text
    d3.select(containerId)
      .append("h2")
      .style("margin-left", `${margin.left}px`)
      .style("margin-bottom", "-20px")
      .style("font-weight", "500")
      .style("color", "#222f3e")
      .style("transform", "translate(0, 20px)")
      .text("Usage of Keywords in Songs");

    svg = d3.select(containerId)
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("viewBox", [0, 0, width, height]);

    rScale = d3.scaleLinear()
      .domain([0, d3.max(bubbleData, d => d.r)])
      .range([5, 50]);

    d3.forceSimulation(bubbleData)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(80))
      .force("collision", d3.forceCollide().radius(d => rScale(d.r * 1.2)))
      .force("boundary-collision", boundaryCollision)
      .on("tick", ticked);

    // Bind and create circles and labels
    updateCirclesAndLabels();
  });
}

// Helper function to populate bubble data
function populateBubbleData(table, minRangeValue, maxRangeValue, checkedGenres) {
  bubbleData = [];
  checkedGenres.forEach((genre) => {
    let genreKeywords = table.filter(row => row.genre === genre);
    let keywordSums = genreKeywords.map(row => {
      let yearRangeValues = Object.keys(row)
        .filter(year => year >= minRangeValue && year <= maxRangeValue)
        .map(year => +row[year]);
      return {
        label: row.keyword,
        genre: genre,
        r: d3.sum(yearRangeValues)
      };
    });

    keywordSums.sort((a, b) => b.r - a.r);
    bubbleData = bubbleData.concat(keywordSums.slice(0, 3));
  });
}

// Function to update the bubble chart with new data
function updateBubblechart(minRangeValue, maxRangeValue, checkedGenres) {
  d3.csv("data/bubble_table.csv").then(function (table) {
    populateBubbleData(table, minRangeValue, maxRangeValue, checkedGenres);

    rScale = d3.scaleLinear()
      .domain([0, d3.max(bubbleData, d => d.r)])
      .range([5, 50]);

    d3.forceSimulation(bubbleData)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(80))
      .force("collision", d3.forceCollide().radius(d => rScale(d.r * 1.2)))
      .force("boundary-collision", boundaryCollision)
      .on("tick", ticked);

    // Update circles and labels
    updateCirclesAndLabels();
  });
}

// Updates circles and labels based on bubbleData
function updateCirclesAndLabels() {
  // Remove existing circles and labels
  svg.selectAll(".bubble").remove();
  svg.selectAll(".bubble-text").remove();

  // Create new circles for the updated bubble data
  svg.selectAll(".bubble")
    .data(bubbleData, d => d.label + d.genre)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("id", d => `circle-${d.label}-${d.genre}`)
    .attr("r", d => rScale(d.r * 1.2))
    .attr("fill", d => colorMap[d.genre])
    .attr("cx", width / 2) // Set initial position; will be updated by the simulation
    .attr("cy", height / 2) // Set initial position; will be updated by the simulation
    .on("mouseover", handleHover)
    .on("mouseout", handleMouseOut);

  // Create new labels for the updated bubble data
  svg.selectAll(".bubble-text")
    .data(bubbleData, d => d.label + d.genre)
    .enter()
    .append("text")
    .attr("class", "bubble-text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .style("font-size", d => Math.min(2 * rScale(d.r), (2 * rScale(d.r) - 8) / 4) + "px")
    .style("fill", "white")
    .style("font-weight", "600")
    .style("user-select", "none")
    .on("mouseover", handleHover)
    .on("mouseout", handleMouseOut)
    .text(d => d.label);
}


// Custom force for boundary collision
function boundaryCollision() {
  bubbleData.forEach(d => {
    if (d.x - rScale(d.r) < 0) d.x = rScale(d.r);
    if (d.x + rScale(d.r) > width) d.x = width - rScale(d.r);
    if (d.y - rScale(d.r) < topPadding) d.y = rScale(d.r) + topPadding;
    if (d.y + rScale(d.r) > height) d.y = height - rScale(d.r);
  });
}

// Function for simulation tick updates
function ticked() {
  svg.selectAll(".bubble")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  svg.selectAll(".bubble-text")
    .attr("x", d => d.x)
    .attr("y", d => d.y);
}

// Hover handlers
function handleHover(event, d) {
  d3.select(`#circle-${d.label}-${d.genre}`)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  const tooltipText = ` Appearances: ${d.r} `;
  const textSize = tooltipText.length * 6;

  // Position the tooltip background below the circle
  svg.append("rect")
    .attr("id", "tooltip-bg")
    .attr("x", d.x - textSize / 2)
    .attr("y", d.y + rScale(d.r) ) // Adjusted for below the circle
    .attr("width", textSize)
    .attr("height", 20)
    .attr("fill", "lightgray")
    .attr("rx", 4)
    .attr("ry", 4);

  // Position the tooltip text below the background rectangle
  svg.append("text")
    .attr("id", "tooltip")
    .attr("x", d.x)
    .attr("y", d.y + rScale(d.r) + 15) // Adjusted for below the background
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .text(tooltipText);
}

function handleMouseOut(event, d) {
  d3.select(`#circle-${d.label}-${d.genre}`)
    .attr("stroke-width", 0);

  d3.select("#tooltip").remove();
  d3.select("#tooltip-bg").remove();
}
