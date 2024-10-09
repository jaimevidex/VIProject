let isBarchart = true;
let selectGenre = null;

function createBarchart(
  data,
  containerId,
  minRangeValue,
  maxRangeValue,
  checkedGenres
) {
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

  const colorMap = {
    rock: "#1f77b4",
    pop: "#ff7f0e",
    rap: "#2ca02c",
    rb: "#d62728",
    country: "#9467bd",
  };

  const jsonData = filteredData.map((d) => ({
    genre: d.Genre,
    popularity: d.popularity,
    color: colorMap[d.Genre],
  }));

  const width = 600;
  const height = 400;
  const margin = { bottom: 50, left: 50, right: 50, top: 50 };

  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
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
        // Uncheck all checkboxes except the selected genre
        d3.selectAll(".genre-checkbox").each(function () {
          if (this.value === d.genre) {
            this.checked = true;
          } else {
            this.checked = false;
          }
        });
        // Transition bars to zero height
        bars
          .transition()
          .duration(1000)
          .attr("height", 0)
          .attr("y", yScale(0))
          .remove()
          .on("end", function () {
            // Create line chart after bars are removed
            const longFormatData = [];
            data.forEach((row) => {
              const genre = row.Genre;
              for (let year = 1960; year <= 2021; year++) {
                longFormatData.push({
                  genre: genre,
                  year: year,
                  popularity: +row[year],
                });
              }
            });

            const filteredData = longFormatData.filter(
              (item) => item.genre === d.genre
            );
            const years = filteredData.map((item) => item.year);
            const popularity = filteredData.map((item) => item.popularity);

            const selectedData = {
              years: years,
              popularity: popularity,
              color: d.color,
            };
            createLineChart(
              selectedData,
              containerId,
              minRangeValue,
              maxRangeValue,
              checkedGenres,
              data
            );
          });
      }
    });

  // Append popularity values inside bars
  svg
    .selectAll("text")
    .data(jsonData)
    .enter()
    .append("text")
    .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.popularity) - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("transform", `translate(0, ${height - margin.bottom / 2})`)
    .attr("fill", "black")
    .text((d) => d.popularity);

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

function createLineChart(
  selectedData,
  containerId,
  minRangeValue,
  maxRangeValue,
  checkedGenres,
  originalData
) {
  isBarchart = false;
  // Clear the existing chart elements
  d3.select(containerId).selectAll("*").remove();

  // Set dimensions for the line chart
  const width = 600;
  const height = 400;
  const margin = { bottom: 50, left: 50, right: 50, top: 50 };

  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .text("Line Chart");

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // Define scales for x and y axes
  const years = d3.range(minRangeValue, maxRangeValue + 1);
  const xScale = d3
    .scaleLinear()
    .domain([minRangeValue, maxRangeValue])
    .range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(selectedData.popularity) + 5])
    .range([height - margin.bottom, margin.top]);

  // Create line generator
  const line = d3
    .line()
    .x((d, i) => xScale(years[i]))
    .y((d) => yScale(d));

  // Append the line path with transition
  const path = svg
    .append("path")
    .datum(selectedData.popularity)
    .attr("fill", "none")
    .attr("stroke", selectedData.color)
    .attr("stroke-width", 2)
    .attr("d", line);

  const totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  // Append x and y axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  // Append a cross (close button) to return to the bar chart
  svg
    .append("text")
    .attr("x", width - 30)
    .attr("y", margin.top)
    .attr("font-size", "24px")
    .attr("cursor", "pointer")
    .text("✖")
    .on("click", function () {
      // Clear the line chart
      d3.select(containerId).selectAll("*").remove();
      // Recreate the bar chart
      createBarchart(
        originalData,
        containerId,
        minRangeValue,
        maxRangeValue,
        checkedGenres
      );
    });
}

function updateDashboard(minRangeValue, maxRangeValue, checkedGenres) {
  if (checkedGenres.length === 1 && isBarchart) {
    console.log("Transform to line chart");
      // Transform to line chart if only one genre is selected
      const selectedGenre = checkedGenres[0];
      const longFormatData = [];
      d3.csv("./../data/genre_popularity_time.csv").then(data => {
          data.forEach(row => {
              const genre = row.Genre;
              for (let year = minRangeValue; year <= maxRangeValue; year++) {
                  longFormatData.push({
                      genre: genre,
                      year: year,
                      popularity: +row[year],
                  });
              }
          });

          const filteredData = longFormatData.filter(item => item.genre === selectedGenre);
          const years = filteredData.map(item => item.year);
          const popularity = filteredData.map(item => item.popularity);

          const selectedData = {
              years: years,
              popularity: popularity,
              color: colorMap[selectedGenre],
          };

          isBarchart = false;
          selectGenre = selectedGenre; // Store the selected genre
          createLineChart(selectedData, ".Barchart", minRangeValue, maxRangeValue, checkedGenres, data);
      });
  } else if (checkedGenres.length > 1 && isBarchart) {
    console.log("Transform to bar chart");
      // Transform to bar chart if more than one genre is selected
      d3.csv("./../data/genre_popularity_time.csv").then(data => {
          isBarchart = true;
          selectGenre = null; // Clear the selected genre
          d3.select(".Barchart").selectAll("*").remove(); // Clear the line chart elements
          createBarchart(data, ".Barchart", minRangeValue, maxRangeValue, checkedGenres);
      });
  } else {
      // Update the current chart
      if (isBarchart) {
          updateBarchart(minRangeValue, maxRangeValue, checkedGenres);
      } else {
          updateLinechart(minRangeValue, maxRangeValue, selectGenre); // Use the stored selected genre
      }
  }
}

function updateBarchart(minRangeValue, maxRangeValue, checkedGenres) {
  d3.csv("./../data/genre_popularity_time.csv").then(data => {
      // Filter and process data for the selected genres and time range
      const filteredData = data
          .filter(d => checkedGenres.includes(d.Genre))
          .map(d => {
              const filteredData = { Genre: d.Genre };
              for (let i = minRangeValue; i <= maxRangeValue; i++) {
                  filteredData[i] = d[i];
              }
              return filteredData;
          })
          .map(d => {
              const popularityValues = Object.keys(d)
                  .filter(key => key !== "Genre")
                  .map(key => d[key]);
              const filteredValues = popularityValues.filter(
                  value => value !== "0" && value !== undefined
              );
              const sum = filteredValues.reduce(
                  (acc, value) => acc + parseInt(value),
                  0
              );
              const average =
                  filteredValues.length > 0 ? sum / filteredValues.length : 0;
              return { Genre: d.Genre, popularity: average };
          })
          .filter(d => checkedGenres.includes(d.Genre));

      const colorMap = {
          rock: "#1f77b4",
          pop: "#ff7f0e",
          rap: "#2ca02c",
          rb: "#d62728",
          country: "#9467bd",
      };

      const jsonData = filteredData.map(d => ({
          genre: d.Genre,
          popularity: d.popularity,
          color: colorMap[d.Genre],
      }));

      const width = 600;
      const height = 400;
      const margin = { bottom: 50, left: 50, right: 50, top: 50 };

      // Select the existing SVG element
      const svg = d3.select(".Barchart").select("svg");

      // Define the updated scales based on new data
      const xScale = d3
          .scaleBand()
          .domain(d3.range(jsonData.length))
          .range([margin.left, width - margin.right])
          .padding(0.1);
      const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(jsonData, d => d.popularity) + 5])
          .range([height - margin.bottom, margin.top]);

      // Bind new data to the existing bars and update their attributes
      const bars = svg.selectAll("rect.dataItem").data(jsonData, d => d.genre);

      bars
          .transition()
          .duration(1000)
          .attr("x", (d, i) => xScale(i))
          .attr("y", d => yScale(d.popularity))
          .attr("height", d => yScale(0) - yScale(d.popularity))
          .attr("width", xScale.bandwidth())
          .attr("fill", d => d.color)
          .attr("rx", 5) // Rounded top corners
          .attr("ry", 5); // Rounded top corners

      // Handle enter pattern for new bars
      bars
          .enter()
          .append("rect")
          .attr("class", "dataItem")
          .attr("x", (d, i) => xScale(i))
          .attr("y", yScale(0))
          .attr("height", 0)
          .attr("width", xScale.bandwidth())
          .attr("fill", d => d.color)
          .attr("rx", 5) // Rounded top corners
          .attr("ry", 5) // Rounded top corners
          .on("mouseover", function () {
              d3.select(this).style("cursor", "pointer").style("stroke-width", "3px");
          })
          .on("mouseleave", function () {
              d3.select(this).style("stroke-width", "1px");
          })
          .on("click", function (event, d) {
              if (minRangeValue - maxRangeValue != 0) {
                  selectGenre = d.genre;
                  // Uncheck all checkboxes except the selected genre
                  d3.selectAll(".genre-checkbox").each(function () {
                      if (this.value === d.genre) {
                          this.checked = true;
                      } else {
                          this.checked = false;
                      }
                  });
                  bars
                      .transition()
                      .duration(1000)
                      .attr("height", 0)
                      .attr("y", yScale(0))
                      .remove();

                  // Create line chart
                  const years = d3.range(minRangeValue, maxRangeValue + 1);
                  const line = d3
                      .line()
                      .x((d, i) => xScale(years[i]))
                      .y(d => yScale(d));

                  svg
                      .append("path")
                      .datum(d.popularity)
                      .attr("fill", "none")
                      .attr("stroke", d.color)
                      .attr("stroke-width", 2)
                      .attr("d", line);

                  // Append x and y axes
                  svg
                      .append("g")
                      .attr("transform", `translate(0,${height - margin.bottom})`)
                      .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

                  svg
                      .append("g")
                      .attr("transform", `translate(${margin.left},0)`)
                      .call(d3.axisLeft(yScale));

                  // Append a cross (close button) to return to the bar chart
                  svg
                      .append("text")
                      .attr("x", width - 30)
                      .attr("y", margin.top)
                      .attr("font-size", "24px")
                      .attr("cursor", "pointer")
                      .text("✖")
                      .on("click", function () {
                          d3.select(containerId).style("display", "none");
                          d3.select(".Barchart").style("display", "block");
                      });
              }
          })
          .transition()
          .duration(1000)
          .attr("y", d => yScale(d.popularity))
          .attr("height", d => yScale(0) - yScale(d.popularity));

      // Remove bars that are no longer in the data
      bars.exit().transition().duration(1000).attr("height", 0).attr("y", yScale(0)).remove();

      // Update x-axis with smooth transition
      svg
          .select("g.xAxis")
          .transition()
          .duration(1000)
          .call(d3.axisBottom(xScale).tickFormat(i => jsonData[i].genre));

      // Update y-axis with smooth transition
      svg
          .select("g.yAxis")
          .transition()
          .duration(1000)
          .call(d3.axisLeft(yScale).ticks(null, jsonData.format));
  });
}

function updateLinechart(minRangeValue, maxRangeValue, selectedGenre) {
  d3.csv("./../data/genre_popularity_time.csv").then(data => {
      // Filter and process data for the selectedGenre and time range
      const longFormatData = [];
      data.forEach(row => {
          const genre = row.Genre;
          for (let year = minRangeValue; year <= maxRangeValue; year++) {
              longFormatData.push({
                  genre: genre,
                  year: year,
                  popularity: +row[year],
              });
          }
      });

      const selectedData = longFormatData.filter(item => item.genre === selectedGenre);

      const colorMap = {
          rock: "#1f77b4",
          pop: "#ff7f0e",
          rap: "#2ca02c",
          rb: "#d62728",
          country: "#9467bd",
      };

      const jsonData = selectedData.map(d => ({
          year: d.year,
          popularity: d.popularity,
          color: colorMap[d.genre],
      }));

      const width = 600;
      const height = 400;
      const margin = { bottom: 50, left: 50, right: 50, top: 50 };

      // Select the existing SVG element
      const svg = d3.select(".Barchart").select("svg");

      // Define the updated scales based on new data
      const xScale = d3
          .scaleLinear()
          .domain([minRangeValue, maxRangeValue])
          .range([margin.left, width - margin.right]);
      const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(jsonData, d => d.popularity) + 5])
          .range([height - margin.bottom, margin.top]);

      // Create line generator
      const line = d3
          .line()
          .x(d => xScale(d.year))
          .y(d => yScale(d.popularity));

      // Bind new data to the existing path and update its attributes
      const path = svg.select("path");
      path
          .datum(jsonData)
          .transition()
          .duration(1000)
          .attr("d", line)
          .attr("stroke", jsonData[0].color);

      // Update x-axis with smooth transition
      svg
          .select("g.xAxis")
          .transition()
          .duration(1000)
          .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

      // Update y-axis with smooth transition
      svg.select("g.yAxis").transition().duration(1000).call(d3.axisLeft(yScale));

      // Append a cross (close button) to return to the bar chart
      svg
          .select("text")
          .attr("x", width - 30)
          .attr("y", margin.top)
          .attr("font-size", "24px")
          .attr("cursor", "pointer")
          .text("✖")
          .on("click", function () {
              d3.select(containerId).style("display", "none");
              d3.select(".Barchart").style("display", "block");
              // Recheck the genre checkboxes in the barchart data
              d3.selectAll(".genre-checkbox").each(function () {
                  if (checkedGenres.includes(this.value)) {
                      this.checked = true;
                  }
              });
          });
  });
}