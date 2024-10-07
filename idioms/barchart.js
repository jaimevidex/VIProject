function createBarchart(data, containerId) {


  // Data pre-processing
  const genres = data.map((d) => d.Genre);
  const popularity = data.map((d) => d.popularity);
  console.log(genres);
  console.log(popularity);

  //create json object
  const jsonData = [];

  for (let i = 0; i < genres.length-1; i++) {
    jsonData.push({
      genre: genres[i],
      popularity: popularity[i],
    });
  }

  console.log(jsonData);

  const width = 800;
  const height = 400;
  const margin = {
    bottom: 50,
    left: 50,
    right: 50,
    top: 50,
  };

  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .text("Bar Chart");

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("height", height - margin.top - margin.bottom)
    .attr("width", width - margin.left - margin.right)
    .attr("viewBox", [0, 0, width, height]);

  // Create xScale as a band scale for the genre column values
  const x = d3
    .scaleBand()
    .domain(d3.range(jsonData.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // Create yScale as a linear scale for popularity values
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(jsonData.map(d=> d.popularity))]) // Ensure popularity values are numbers
    .range([height - margin.bottom, margin.bottom]);

  // Create the bars
  svg
  .append("g")
  .attr("fill", "steelblue")
  .selectAll("rect")
  .data(jsonData.sort((a, b) => d3.descending(a.popularity, b.popularity)))
  .join("rect")
  .attr("x", (d, i) => x(i))
  .attr("y", (d) => yScale(d.popularity))
  .attr("height", (d) => yScale(0) - yScale(d.popularity))
  .attr("width", x.bandwidth());


  //append to inside of each bar the popularity value
  svg
    .selectAll("text")
    .data(jsonData)
    .enter()
    .append("text")
    .attr("x", (d, i) => x(i) + x.bandwidth() / 2)
    .attr("y", (d) => yScale(d.popularity) - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("transform", `translate(0, ${height - margin.bottom / 2})`)
    .attr("fill", "black")
    .text((d) => d.popularity);

  // Create x-axis
  function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x).tickFormat((i) => jsonData[i].genre)
      )
      .attr("font-size", "10px")
      .attr("color", "black");
  }

  // Create y-axis
  function yAxis(g) {
    g.attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(null, jsonData.format))
      .attr("font-size", "10px")
      .attr("color", "black");
  }

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

}
