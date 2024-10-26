let isBubblechart = null;
let genre1 = null;

function createBubblechart(data, containerId, minRangeValue, maxRangeValue, checkedGenres) {
  let bubbleData = [];

  d3.csv("data/bubble_table.csv").then(function (table) {
    // Loop through checkedGenres to extract data for each genre
    checkedGenres.forEach((genre) => {
      let genreKeywords = table.filter(row => row.genre === genre);
      let keywordSums = genreKeywords.map(row => {
        let yearRangeValues = Object.keys(row)
          .filter(year => year >= minRangeValue && year <= maxRangeValue)
          .map(year => +row[year]); // Convert to numeric
        return {
          label: row.keyword,
          genre: genre,
          r: d3.sum(yearRangeValues)
        };
      });

      keywordSums.sort((a, b) => b.r - a.r);
      bubbleData = bubbleData.concat(keywordSums.slice(0, 3));
    });

    // Set up SVG dimensions
    const width = (window.innerWidth - 350) / 2;
    const height = (window.innerHeight - 50 - 64) / 2;
    const margin = { bottom: 50, left: 50, right: 50, top: 50 };
    const topPadding = 50; // Padding to keep circles below header text

    // Append chart title
    d3.select(containerId)
      .append("h2")
      .style("margin-left", `${margin.left}px`)
      .style("margin-bottom", "-30px")
      .text("Usage of Keywords in Songs");

    // Create SVG container
    const svg = d3
      .select(containerId)
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("viewBox", [0, 0, width, height]);

    // Define radius scale
    const rScale = d3.scaleLinear()
      .domain([0, d3.max(bubbleData, d => d.r)])
      .range([5, 50]);

    // Create tooltip container with higher z-index
    const tooltipGroup = d3.select(containerId)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "black")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("color", "white")
      .style("opacity", 0)
      .style("pointer-events", "none"); // Avoids interfering with hover events on bubbles

    const tooltipKeyword = tooltipGroup.append("div").attr("class", "tooltip-keyword");
    const tooltipSum = tooltipGroup.append("div").attr("class", "tooltip-sum");

    const simulation = d3.forceSimulation(bubbleData)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(80))
      .force("collision", d3.forceCollide().radius(d => rScale(d.r * 1.2)))
      .force("boundary-collision", boundaryCollision) // Custom boundary collision force
      .on("tick", ticked);

    // Bind data and create circles
    let circles = svg.selectAll(".bubble")
      .data(bubbleData, d => d.label);

    circles.exit().remove();

    circles = circles.enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", d => rScale(d.r * 1.2))
      .attr("fill", d => colorMap[d.genre])
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .on("mouseover", (event, d) => {
        tooltipGroup.style("opacity", 1);
        tooltipKeyword.text(`Keyword: ${d.label}`);
        tooltipSum.text(`Sum: ${d.r}`);
      })
      .on("mousemove", (event) => {
        tooltipGroup
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mouseout", () => tooltipGroup.style("opacity", 0))
      .merge(circles);

    // Bind data and create labels
    let labels = svg.selectAll(".bubble-text")
      .data(bubbleData, d => d.label);

    labels.exit().remove();

    labels = labels.enter()
      .append("text")
      .attr("class", "bubble-text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("font-size", d => Math.min(2 * rScale(d.r), (2 * rScale(d.r) - 8) / 4) + "px")
      .style("fill", "white")
      .style("font-weight", "600")
      .text(d => d.label)
      .attr("x", width / 2)
      .attr("y", height / 2)
      .on("mouseover", (event, d) => {
        tooltipGroup.style("opacity", 1);
        tooltipKeyword.text(`Keyword: ${d.label}`);
        tooltipSum.text(`Sum: ${d.r}`);
      })
      .on("mousemove", (event) => {
        tooltipGroup
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mouseout", () => tooltipGroup.style("opacity", 0))
      .merge(labels);

    // Custom force for boundary collision
    function boundaryCollision() {
      bubbleData.forEach(d => {
        if (d.x - rScale(d.r) < 0) d.x = rScale(d.r);
        if (d.x + rScale(d.r) > width) d.x = width - rScale(d.r);
        if (d.y - rScale(d.r) < topPadding) d.y = rScale(d.r) + topPadding;
        if (d.y + rScale(d.r) > height) d.y = height - rScale(d.r);
      });
    }

    function ticked() {
      circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    }
  });
}

function updateBubblechart(minRangeValue, maxRangeValue, checkedGenres) {
  d3.csv("data/bubble_table.csv").then(function (table) {
    let bubbleData = [];

    checkedGenres.forEach((genre) => {
      let genreKeywords = table.filter(row => row.genre === genre);
      let keywordSums = genreKeywords.map(row => {
        let yearRangeValues = Object.keys(row)
          .filter(year => year >= minRangeValue && year <= maxRangeValue)
          .map(year => +row[year]); // Convert to numeric
        return {
          label: row.keyword,
          genre: genre,
          r: d3.sum(yearRangeValues)
        };
      });

      keywordSums.sort((a, b) => b.r - a.r);
      bubbleData = bubbleData.concat(keywordSums.slice(0, 3));
    });

    // Set up dimensions and scales
    const width = (window.innerWidth - 350) / 2;
    const height = (window.innerHeight - 50 - 64) / 2;
    const topPadding = 50;
    const rScale = d3.scaleLinear()
      .domain([0, d3.max(bubbleData, d => d.r)])
      .range([5, 50]);

    const svg = d3.select(".Bubblechart svg");

    // Tooltip setup
    const tooltipGroup = d3.select(".Bubblechart")
      .select(".tooltip");

    if (tooltipGroup.empty()) {
      // Create tooltip if it doesn't exist yet
      tooltipGroup = d3.select(".Bubblechart")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "black")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("color", "white")
        .style("opacity", 0)
        .style("pointer-events", "none"); // Avoids interfering with hover events on bubbles
    }

    const tooltipKeyword = tooltipGroup.select(".tooltip-keyword");
    const tooltipSum = tooltipGroup.select(".tooltip-sum");

    // Update circles with new data
    let circles = svg.selectAll(".bubble")
      .data(bubbleData, d => d.label);

    circles.exit().remove();

    circles = circles.enter()
      .append("circle")
      .attr("class", "bubble")
      .merge(circles)
      .attr("r", d => rScale(d.r * 1.2))
      .attr("fill", d => colorMap[d.genre])
      .on("mouseover", (event, d) => {
        tooltipGroup.style("opacity", 1);
        tooltipKeyword.text(`Keyword: ${d.label}`);
        tooltipSum.text(`Sum: ${d.r}`);
      })
      .on("mousemove", (event) => {
        tooltipGroup
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mouseout", () => tooltipGroup.style("opacity", 0));

    // Update labels with new data
    let labels = svg.selectAll(".bubble-text")
      .data(bubbleData, d => d.label);

    labels.exit().remove();

    labels = labels.enter()
      .append("text")
      .attr("class", "bubble-text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("fill", "white")
      .style("font-weight", "600")
      .merge(labels)
      .text(d => d.label)
      .style("font-size", d => Math.min(2 * rScale(d.r), (2 * rScale(d.r) - 8) / 4) + "px")
      .on("mouseover", (event, d) => {
        tooltipGroup.style("opacity", 1);
        tooltipKeyword.text(`Keyword: ${d.label}`);
        tooltipSum.text(`Sum: ${d.r}`);
      })
      .on("mousemove", (event) => {
        tooltipGroup
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 30}px`);
      })
      .on("mouseout", () => tooltipGroup.style("opacity", 0));

    const simulation = d3.forceSimulation(bubbleData)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(80))
      .force("collision", d3.forceCollide().radius(d => rScale(d.r * 1.2)))
      .force("boundary-collision", boundaryCollision) // Custom boundary collision force
      .on("tick", ticked);

    // Custom force for boundary collision
    function boundaryCollision() {
      bubbleData.forEach(d => {
        if (d.x - rScale(d.r) < 0) d.x = rScale(d.r);
        if (d.x + rScale(d.r) > width) d.x = width - rScale(d.r);
        if (d.y - rScale(d.r) < topPadding) d.y = rScale(d.r) + topPadding;
        if (d.y + rScale(d.r) > height) d.y = height - rScale(d.r);
      });
    }

    function ticked() {
      circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    }
  });
}
