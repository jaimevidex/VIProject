let isVendiagram = null;
let genre3 = null;

function createVanDiagram(data, containerId, minRangeValue, maxRangeValue, genres) {
  // Data for the Venn diagram
  const data1 = [
    { keywords: ["annoy", "beach", "choice", "love", "extra"],
      keywords1: ["love", "faggot", "extra", "gay", "house"] }
  ];

  // Extract the keywords from the data
  const set1 = data1[0].keywords;
  const set2 = data1[0].keywords1;

  // Calculate the unique and common values between the two sets
  const set1Unique = set1.filter(d => !set2.includes(d)); // Unique to set 1
  const set2Unique = set2.filter(d => !set1.includes(d)); // Unique to set 2
  const common = set1.filter(d => set2.includes(d)); // Common between both

  // Set up SVG dimensions
  const width = 500;
  const height = 350;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .style("margin-bottom", "-30px")
    .text("Venn Diagram");

  // Create the SVG container
  const svg = d3.select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Draw the circles for the Venn diagram with overlap
  const circle1 = svg.append("circle")
    .attr("cx", -60) // Adjust position for overlap
    .attr("cy", 0)
    .attr("r", 100)
    .attr("fill", "lightblue")
    .attr("opacity", 0.5);

  const circle2 = svg.append("circle")
    .attr("cx", 60) // Adjust position for overlap
    .attr("cy", 0)
    .attr("r", 100)
    .attr("fill", "lightgreen")
    .attr("opacity", 0.5);

  // Add text for the unique values in the first circle
  svg.selectAll(".set1-text")
    .data(set1Unique)
    .enter()
    .append("text")
    .attr("x", -80) // Position in the first circle
    .attr("y", (d, i) => -40 + i * 45) // Distribute text vertically
    .attr("text-anchor", "middle")
    .text(d => d)
    .attr("font-size", "14px");

  // Add text for the unique values in the second circle
  svg.selectAll(".set2-text")
    .data(set2Unique)
    .enter()
    .append("text")
    .attr("x", 80) // Position in the second circle
    .attr("y", (d, i) => -40 + i * 45) // Distribute text vertically
    .attr("text-anchor", "middle")
    .text(d => d)
    .attr("font-size", "14px");

  // Add text for the common values in the overlapping area
  svg.selectAll(".common-text")
    .data(common)
    .enter()
    .append("text")
    .attr("x", 0) // Position in the center
    .attr("y", (d, i) => -15 + i * 35) // Distribute text vertically
    .attr("text-anchor", "middle")
    .text(d => d)
    .attr("font-size", "14px");
}
