let isBubblechart = null;
let genre1 = null;

function createBubblechart(data, containerId, minRangeValue, maxRangeValue, checkedGenres) {
  const data1 = [
    { r: 20, label: "love" },
    { r: 40, label: "houses" },
    { r: 50, label: "name" },
    { r: 30, label: "tonight" },
    { r: 60, label: "courtyard" },
];

  // Set up SVG dimensions
  const width = 500;
  const height = 350;
  const margin = { bottom: 50, left: 50, right: 50, top: 50 };

  
  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .style("margin-bottom", "-30px")
    .text("Bubble Chart");

  // Create the SVG container
  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", [0, 0, width, height]);

  // Create a scale for the radius to make sure the bubbles fit well
  const rScale = d3.scaleLinear()
  .domain([0, d3.max(data1, d => d.r)])
  .range([5, 50]); // Adjust bubble size range as needed

  // Create a force simulation to center the bubbles and prevent overlap
  const simulation = d3.forceSimulation(data1)
  .force("center", d3.forceCenter(width / 2, height / 2))  // Center force
  .force("charge", d3.forceManyBody().strength(80))  // Slight repulsion to prevent overlap
  .force("collision", d3.forceCollide().radius(d => rScale(d.r*1.2)))  // Avoid overlap
  .on("tick", ticked);  // Update positions on each tick

  // Bind data and create circles for each data point
  const circles = svg.selectAll(".bubble")
  .data(data1)
  .enter()
  .append("circle")
  .attr("class", "bubble")
  .attr("r", d => rScale(d.r * 1.2))  // Set radius based on scaled data
  .attr("fill", (d, i) => d3.schemeCategory10[i % 10]); // Use D3's color scheme

  // Bind data and create text elements for each circle
  const labels = svg.selectAll(".bubble-text")
    .data(data1)
    .enter()
    .append("text")
    .attr("class", "bubble-text")
    .attr("text-anchor", "middle")  // Center text horizontally
    .attr("dy", ".35em")  // Adjust vertical alignment
    // Set font size based on radius of circle not giving
    .style("font-size", d => Math.min(2 * rScale(d.r), (2 * rScale(d.r) - 8) / 4) + "px")
    .style("fill", "white")  // Set text color
    .style("font-weight", "600")  // Avoid text being clickable
    .text(d => d.label);  // Set the label text

  // Function to update circle positions on each tick of the simulation
  function ticked() {
    circles
      .attr("cx", d => d.x)  // Use x from simulation
      .attr("cy", d => d.y);  // Use y from simulation
    labels
      .attr("x", d => d.x)  // Set x to match circle's cx
      .attr("y", d => d.y);  // Set y to match circle's cy
  }   
}