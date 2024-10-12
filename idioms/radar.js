let isRadarchart = null;
let genre2 = null;

function createRadarchart(data, containerId, minRangeValue, maxRangeValue, checkedGenres) {
  // Data for the radar chart with multiple values per axis
  const data1 = [
    { axis: "love", values: [0.8, 0.6, 0.2, 0.6, 0.7] },
    { axis: "houses", values: [0.6, 0.4, 0.1, 0.4, 0.3] },
    { axis: "name", values: [0.9, 0.7, 0.8, 0.2, 0.3] },
    { axis: "tonight", values: [0.7, 0.5, 0.6, 0.6, 0.5] },
    { axis: "courtyard", values: [0.5, 0.3, 0.2, 0.5, 0.7] }
  ];

  // Set up SVG dimensions
  const width = 500;
  const height = 350;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  // Calculate the radius of the radar chart
  const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right, margin.bottom, margin.left);

  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .style("margin-bottom", "-30px")
    .text("Radar Chart");

  // Create the SVG container
  const svg = d3.select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Calculate the number of axes (one per data point)
  const angleSlice = (Math.PI * 2) / data1.length;

  // Create a scale for each axis, scaling the data values (0 to 1) to the radar chart radius
  const rScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, radius]);

  // Create the radar chart axes (spokes)
  const axes = svg.selectAll(".axis")
    .data(data1)
    .enter()
    .append("g")
    .attr("class", "axis");

  // Draw each axis line from the center outward
  axes.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => rScale(1) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("y2", (d, i) => rScale(1) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2);

  // Add labels to each axis
  axes.append("text")
    .attr("x", (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("y", (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text(d => d.axis);

  // Create the radar line generator for each set of values
  const radarLine = d3.lineRadial()
    .radius(d => rScale(d))
    .angle((d, i) => i * angleSlice)
    .curve(d3.curveLinearClosed);

  // Loop over the number of value sets (since there are 5 values per axis)
  const numValueSets = data1[0].values.length;

  // Create the radar chart area (polygon) for each set of values
  for (let setIdx = 0; setIdx < numValueSets; setIdx++) {
    const valueSet = data1.map(d => d.values[setIdx]); // Extract the current set of values
    
    // Append the radar chart area (polygon) for this set of values
    svg.append("path")
      .datum(valueSet)
      .attr("d", radarLine)
      .attr("fill", d3.schemeCategory10[setIdx]) // Use different color for each set
      .attr("fill-opacity", 0.3)
      .attr("stroke", d3.schemeCategory10[setIdx])
      .attr("stroke-width", 2);
  }

  // Draw circles at each data point on the radar chart for each set of values
  for (let setIdx = 0; setIdx < numValueSets; setIdx++) {
    const valueSet = data1.map(d => d.values[setIdx]);

    const circles = svg.selectAll(`.radar-circle-${setIdx}`)
      .data(valueSet)
      .enter()
      .append("circle")
      .attr("class", `radar-circle-${setIdx}`)
      .attr("r", 4)
      .attr("cx", (d, i) => rScale(d) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("fill", d3.schemeCategory10[setIdx])
      .attr("fill-opacity", 0.8);
      
      // Add mouseover and mouseout events to the circles
    circles
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("r", 6) // Increase circle size on hover
          .attr("stroke", "black") // Optional: Add a stroke around the circle
          .attr("stroke-width", 2); // Make stroke visible
        
        const tooltipText = `Value: ${valueSet[setIdx]}`;
        const textSize = tooltipText.length * 6; // Adjust size based on text length

        // Append background rectangle for the tooltip
        svg
          .append("rect")
          .attr("id", "tooltip-bg") // Assign id for easy removal
          .attr("x", d3.select(this).attr("cx") - textSize / 2)
          .attr("y", d3.select(this).attr("cy") - 25) // Position above the circle
          .attr("width", textSize)
          .attr("height", 20)
          .attr("fill", "lightgray") // Background color
          .attr("rx", 4) // Rounded corners
          .attr("ry", 4); // Rounded corners

        // Append tooltip text
        svg
          .append("text")
          .attr("id", "tooltip") // Assign id for easy removal
          .attr("x", d3.select(this).attr("cx"))
          .attr("y", d3.select(this).attr("cy") - 10) // Position above the circle
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(tooltipText);
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("r", 4) // Reset circle size
          .attr("stroke-width", 0); // Remove stroke

        // Remove tooltip and background
        d3.select("#tooltip").remove();
        d3.select("#tooltip-bg").remove();
      });  
  }

  
}