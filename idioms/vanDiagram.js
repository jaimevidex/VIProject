let genre3 = null;

function createVanDiagram(data, containerId, minRangeValue, maxRangeValue, checkedGenres) {
  isBarchart = true;
  // Clear the existing chart elements
  d3.select(containerId).selectAll("*").remove();

  // Filter and process data
  const filteredData = data
    .map((d) => {
      const filteredData = { Genre: d.Genre };
      for (let i = minRangeValue; i <= maxRangeValue; i++) {
        filteredData[i] = d[i];
      }
      return filteredData;
    })
    .map((d) => {
      const popularityValues = Object.keys(d)
        .filter((key) => key !== "Genre")
        .map((key) => d[key]);
      const filteredValues = popularityValues.filter(
        (value) => value !== "0" && value !== undefined
      );
      const sum = filteredValues.reduce(
        (acc, value) => acc + parseInt(value),
        0
      );
      const average =
        filteredValues.length > 0 ? sum / filteredValues.length : 0;
      return { Genre: d.Genre, popularity: average };
    })
    .filter((d) => checkedGenres.includes(d.Genre));

  const jsonData = filteredData.map((d) => ({
    genre: d.Genre,
    popularity: d.popularity,
    color: colorMap[d.Genre],
  }));

  const width = 500;
  const height = 350;
  const margin = { bottom: 50, left: 50, right: 50, top: 50 };

  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .style("margin-bottom", "-30px")
    .text("Bar Chart");

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", [0, 0, width, height]);

  // Create scales
  const xScale = d3
    .scaleBand()
    .domain(d3.range(jsonData.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(jsonData, (d) => d.popularity) + 5])
    .range([height - margin.bottom, margin.top]);

  // Create bars
  const bars = svg
    .selectAll("rect")
    .data(jsonData.sort((a, b) => d3.descending(a.popularity, b.popularity)))
    .enter()
    .append("rect")
    .attr("class", "dataItem")
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => yScale(d.popularity))
    .attr("height", (d) => yScale(0) - yScale(d.popularity))
    .attr("width", xScale.bandwidth())
    .attr("fill", (d) => d.color)
    .attr("ry", 10)
    .on("mouseover", function () {
      if (minRangeValue - maxRangeValue != 0) {
        d3.select(this).style("cursor", "pointer").style("stroke-width", "3px");
      }
    })
    .on("mouseleave", function () {
      d3.select(this).style("stroke-width", "1px");
    })
    .on("click", function (event, d) {
      if (minRangeValue - maxRangeValue != 0) {
        selectGenre = d.genre;
        updateDashboard(minRangeValue, maxRangeValue, [selectGenre]);
      }
    });

  // Create x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat((i) => jsonData[i].genre))
    .attr("class", "xAxis")
    .attr("font-size", "10px")
    .attr("color", "black");

  // Create y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).ticks(null, jsonData.format))
    .attr("class", "yAxis")
    .attr("font-size", "10px")
    .attr("color", "black");
}