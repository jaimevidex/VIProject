let isBubblechart = null;
let genre1 = null;

function createBubblechart(data, containerId, minRangeValue, maxRangeValue, checkedGenres) {
  let bubbleData = [];

  d3.csv("data/bubble_table.csv").then(function (table) {
    // Loop through checkedGenres to extract data for each genre
    for (let i = 0; i < checkedGenres.length; i++) {
      let keywordData = [];
      let uniqueLabels = new Set();  // Keep track of unique labels

      // Loop through the years (columns) based on the range
      for (let year = minRangeValue; year <= maxRangeValue; year++) {
        let yearColumn = year.toString();  // Convert year to string to match column names
        table.forEach((row) => {
          if (row.genre === checkedGenres[i] && row[yearColumn] !== "0") {
            if (!uniqueLabels.has(row.keyword)) {  // Only add if the keyword is not already in the Set
              uniqueLabels.add(row.keyword);  // Add keyword to the Set to track uniqueness
              keywordData.push({ r: +row[yearColumn], label: row.keyword, genre: row.genre });
            }
          }
        });
      }

      // Sort the data by the 'r' value in descending order
      keywordData.sort((a, b) => b.r - a.r);

      // Take only the top 3 most used unique keywords
      let top3Keywords = keywordData.slice(0, 3);

      // Combine the top 3 keywords for the current genre into bubbleData
      bubbleData = bubbleData.concat(top3Keywords);
    }

    console.log(bubbleData);

    // Now that bubbleData is populated, proceed with the rest of the chart creation logic
    
    // Set up SVG dimensions
    const width = (window.innerWidth - 350) / 2;
    const height = (window.innerHeight - 50 - 64) / 2;
    const margin = { bottom: 50, left: 50, right: 50, top: 50 };

    // Append chart title
    d3.select(containerId)
      .append("h2")
      .style("margin-left", `${margin.left}px`)
      .style("margin-bottom", "-30px")
      .text("Usage of Keywords in Songs");

    // Create the SVG container
    const svg = d3
      .select(containerId)
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("viewBox", [0, 0, width, height]);

    // Create a scale for the radius to make sure the bubbles fit well
    const rScale = d3.scaleLinear()
      .domain([0, d3.max(bubbleData, d => d.r)])
      .range([5, 50]); // Adjust bubble size range as needed

    // Create a force simulation to center the bubbles and prevent overlap
    const simulation = d3.forceSimulation(bubbleData)
      .force("center", d3.forceCenter(width / 2, height / 2))  // Center force
      .force("charge", d3.forceManyBody().strength(80))  // Slight repulsion to prevent overlap
      .force("collision", d3.forceCollide().radius(d => rScale(d.r * 1.2)))  // Avoid overlap
      .on("tick", ticked);  // Update positions on each tick

    // Bind data and create circles for each data point
    const circles = svg.selectAll(".bubble")
      .data(bubbleData)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", d => rScale(d.r * 1.2))  // Set radius based on scaled data
      .attr("fill", d => colorMap[d.genre]); // Use D3's color scheme

    // Bind data and create text elements for each circle
    const labels = svg.selectAll(".bubble-text")
      .data(bubbleData)
      .enter()
      .append("text")
      .attr("class", "bubble-text")
      .attr("text-anchor", "middle")  // Center text horizontally
      .attr("dy", ".35em")  // Adjust vertical alignment
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
  });
}

function updateBubblechart(minRangeValue, maxRangeValue, checkedGenres) {
  let bubbleData = [];

  d3.csv("data/bubble_table.csv").then(function (table) {
    for (let i = 0; i < checkedGenres.length; i++) {
      let keywordData = [];
      let uniqueLabels = new Set();

      for (let year = minRangeValue; year <= maxRangeValue; year++) {
        let yearColumn = year.toString();
        table.forEach((row) => {
          if (row.genre === checkedGenres[i] && row[yearColumn] !== "0") {
            if (!uniqueLabels.has(row.keyword)) {
              uniqueLabels.add(row.keyword);
              keywordData.push({ r: +row[yearColumn], label: row.keyword, genre: row.genre });
            }
          }
        });
      }

      keywordData.sort((a, b) => b.r - a.r);
      let top3Keywords = keywordData.slice(0, 3);
      bubbleData = bubbleData.concat(top3Keywords);
    }

    const width = (window.innerWidth - 350) / 2;
    const height = (window.innerHeight - 50 - 64) / 2;

    const svg = d3.select(".Bubblechart").select("svg");

    const rScale = d3.scaleLinear()
      .domain([0, d3.max(bubbleData, d => d.r)])
      .range([5, 50]);

    const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(80))
      .force("collision", d3.forceCollide().radius(d => rScale(d.r * 1.2)))
      .on("tick", ticked);

    simulation.nodes(bubbleData).alpha(1).restart();

    const circles = svg.selectAll(".bubble").data(bubbleData, d => d.label);

    circles
      .transition()
      .duration(1000)
      .attr("r", d => rScale(d.r * 1.2))
      .attr("fill", d => colorMap[d.genre]);

    circles.enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", d => rScale(d.r * 1.2))
      .attr("fill", d => colorMap[d.genre])
      .attr("cx", width / 2)  // Set initial x position
      .attr("cy", height / 2) // Set initial y position
      .merge(circles);

    const labels = svg.selectAll(".bubble-text").data(bubbleData, d => d.label);

    labels
      .transition()
      .duration(1000)
      .text(d => d.label)
      .style("font-size", d => Math.min(2 * rScale(d.r), (2 * rScale(d.r) - 8) / 4) + "px");

    labels.enter()
      .append("text")
      .attr("class", "bubble-text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("fill", "white")
      .style("font-weight", "600")
      .attr("x", width / 2) // Set initial x position for labels
      .attr("y", height / 2) // Set initial y position for labels
      .text(d => d.label)
      .merge(labels);

    circles.exit().remove();
    labels.exit().remove();

    function ticked() {
      svg.selectAll(".bubble").attr("cx", d => d.x).attr("cy", d => d.y);
      svg.selectAll(".bubble-text").attr("x", d => d.x).attr("y", d => d.y);
    }
  });
}


