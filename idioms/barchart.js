function createLineChart(
  selectedData,
  containerId,
  minRangeValue,
  maxRangeValue,
  checkedGenres
) {
  // Clear the container
  d3.select(containerId).selectAll("*").remove();

  // Set dimensions for the line chart
  const width = 600;
  const height = 400;
  const margin = {
    bottom: 50,
    left: 50,
    right: 50,
    top: 50,
  };

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

  //make sure it represents all the years points but in the axis puts only from x to x years
  const xScale = d3
    .scaleLinear()
    .domain([minRangeValue, maxRangeValue])
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, parseInt(d3.max(selectedData.popularity)) + 5])
    .range([height - margin.bottom, margin.top]);

  // Create line generator
  const line = d3
    .line()
    .x((d, i) => xScale(years[i])) // Map each data point to its corresponding year
    .y((d) => yScale(d));

  // Append the line path
  svg
    .append("path")
    .datum(selectedData.popularity)
    .attr("fill", "none")
    .attr("stroke", selectedData.color) // Use color from selected data
    .attr("stroke-width", 2)
    .attr("d", line);

  // Append x and y axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"))); // Display only multiples of 5

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
      // Hide the line chart and bring back the bar chart
      d3.select(containerId).style("display", "none");
      d3.select(".Barchart").style("display", "block");
    });
}

function createBarchart(
  data,
  containerId,
  minRangeValue,
  maxRangeValue,
  checkedGenres
) {
  // Filter columns based on time range (minRangeValue and maxRangeValue)
  data = data.map((d) => {
    const filteredData = {};
    filteredData["Genre"] = d.Genre;
    for (let i = minRangeValue; i <= maxRangeValue; i++) {
      filteredData[i] = d[i];
    }
    return filteredData;
  });

  // Calculate the average popularity for each genre, ignoring missing values (0 or undefined)
  data = data.map((d) => {
    // Extract the numeric values, excluding the genre
    const popularityValues = Object.keys(d)
      .filter((key) => key !== "Genre")
      .map((key) => d[key]);

    // Filter out missing values
    const filteredValues = popularityValues.filter(
      (value) => value !== "0" && value !== undefined
    );

    // Calculate sum and average of popularity values
    const sum = filteredValues.reduce((acc, value) => acc + parseInt(value), 0);
    const average = filteredValues.length > 0 ? sum / filteredValues.length : 0;

    return {
      Genre: d.Genre,
      popularity: average,
    };
  });

  const filteredData = data.filter((d) => {
    return checkedGenres.includes(d.Genre);
  });

  const colorMap = {
    rock: "#1f77b4", // Blue
    pop: "#ff7f0e", // Orange
    rap: "#2ca02c", // Green
    rb: "#d62728", // Red
    country: "#9467bd", // Purple
  };

  const jsonData = filteredData.map((d) => ({
    genre: d.Genre,
    popularity: d.popularity,
    color: colorMap[d.Genre], // Assign color based on genre
  }));

  const width = 600;
  const height = 400;
  const margin = {
    bottom: 50,
    left: 50,
    right: 50,
    top: 50,
  };

  // Append chart title
  console.log(containerId);
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

  // Create xScale as a band scale for the genre column values
  const xScale = d3
    .scaleBand()
    .domain(d3.range(jsonData.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // Create yScale as a linear scale for popularity values
  const yScale = d3
    .scaleLinear()
    .domain([0, parseInt(d3.max(jsonData.map((d) => d.popularity))) + 5]) // Ensure popularity values are numbers
    .range([height - margin.bottom, margin.bottom]);

  // Create the bars
  svg
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
    .attr("stroke", "black")
    .on("mouseover", function (event, d) {
      if (minRangeValue - maxRangeValue != 0) {
        d3.select(this).style("cursor", "pointer").style("stroke-width", "3px");
      }
    })
    .on("mouseleave", function (event, d) {
      d3.select(this).style("stroke-width", "1px");
    })
    .on("click", function (event, d) {
      if (minRangeValue - maxRangeValue != 0) {
        // Hide the bar chart and display the line chart container
        d3.select(containerId).style("display", "none");
        d3.select(".Linechart").style("display", "block");

        d3.csv("./../data/genre_popularity_time.csv").then((data) => {
          // Reshape the data: Convert the wide format to a long format
          const longFormatData = [];
          data.forEach((row) => {
            const genre = row.Genre;
            for (let year = 1960; year <= 2021; year++) {
              longFormatData.push({
                genre: genre,
                year: year,
                popularity: +row[year], // Convert to number
              });
            }
          });

          // Filter for the selected genre
          const filteredData = longFormatData.filter(
            (item) => item.genre === d.genre
          );

          // Prepare the selected data
          const years = filteredData.map((item) => item.year);
          const popularity = filteredData.map((item) => item.popularity);

          const selectedData = {
            years: years,
            popularity: popularity,
            color: d.color, // Use the same color as the bar
          };

          // Call the createLineChart function
          createLineChart(
            selectedData,
            ".Linechart",
            minRangeValue,
            maxRangeValue,
            checkedGenres
          );
        });
      }
    });

  //append to inside of each bar the popularity value
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
  function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((i) => jsonData[i].genre))
      .attr("class", "xAxis")
      .attr("font-size", "10px")
      .attr("color", "black");
  }

  // Create y-axis
  function yAxis(g) {
    g.attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(null, jsonData.format))
      .attr("class", "yAxis")
      .attr("font-size", "10px")
      .attr("color", "black");
  }

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  console.log(svg);
}

function updateDashboard(minRangeValue, maxRangeValue, checkedGenres) {
  updateBarchart(minRangeValue, maxRangeValue, checkedGenres);
}

function updateBarchart(minRangeValue, maxRangeValue, checkedGenres) {
  d3.csv("./../data/genre_popularity_time.csv").then(function (data) {
    // Filter and process data for the selected genres and time range
    data = data.filter((d) => checkedGenres.includes(d.Genre));

    data = data.map((d) => {
      const filteredData = {};
      filteredData["Genre"] = d.Genre;
      for (let i = minRangeValue; i <= maxRangeValue; i++) {
        filteredData[i] = d[i];
      }
      return filteredData;
    });

    data = data.map((d) => {
      const popularityValues = Object.keys(d)
        .filter((key) => key !== "Genre")
        .map((key) => d[key]);

      const filteredValues = popularityValues.filter(
        (value) => value !== "0" && value !== undefined
      );
      const sum = filteredValues.reduce((acc, value) => acc + parseInt(value), 0);
      const average = filteredValues.length > 0 ? sum / filteredValues.length : 0;

      return { Genre: d.Genre, popularity: average };
    });

    const filteredData = data.filter((d) => checkedGenres.includes(d.Genre));
    const colorMap = {
      rock: "#1f77b4",
      pop: "#ff7f0e",
      rap: "#2ca02c",
      rb: "#d62728",
      country: "#9467bd"
    };

    const jsonData = filteredData.map((d) => ({
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
      .domain(d3.range(jsonData.length)) // Use the index of the data array as the domain
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(jsonData, (d) => d.popularity) + 5]) // Update based on new data
      .range([height - margin.bottom, margin.top]);

    // Bind new data to the existing bars and update their attributes
    const bars = svg.selectAll("rect.dataItem")
      .data(jsonData, (d) => d.genre);

    bars.transition()
      .duration(1000)
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d.popularity))
      .attr("height", (d) => yScale(0) - yScale(d.popularity))
      .attr("width", xScale.bandwidth())
      .attr("fill", (d) => d.color);

    // Handle enter pattern for new bars
    bars.enter()
      .append("rect")
      .attr("class", "dataItem")
      .attr("x", (d, i) => xScale(i))
      .attr("y", yScale(0)) // Start from the bottom for smooth transition
      .attr("height", 0)
      .attr("width", xScale.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("stroke", "black")
      .on("mouseover", function () {
        d3.select(this).style("cursor", "pointer").style("stroke-width", "3px");
      })
      .on("mouseleave", function () {
        d3.select(this).style("stroke-width", "1px");
      })
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.popularity))
      .attr("height", (d) => yScale(0) - yScale(d.popularity));

    // Remove bars that are no longer in the data
    bars.exit().transition().duration(1000).attr("height", 0).attr("y", yScale(0)).remove();

    // Update x-axis with smooth transition
    const xAxis = d3.axisBottom(xScale).tickFormat((i) => jsonData[i].genre);
    svg.select("g.xAxis")
      .transition()
      .duration(1000)
      .call(xAxis);

    // Update y-axis with smooth transition
    const yAxis = d3.axisLeft(yScale).ticks(null, jsonData.format);
    svg.select("g.yAxis")
      .transition()
      .duration(1000)
      .call(yAxis);
  });
}
