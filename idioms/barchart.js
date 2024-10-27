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

  const jsonData = filteredData.map((d) => ({
    genre: d.Genre,
    popularity: d.popularity,
    color: colorMap[d.Genre],
  }));

  const width = (window.innerWidth - 370) / 2;
  const height = (window.innerHeight - 50 - 164) / 2;
  const margin = { bottom: 50, left: 50, right: 50, top: 50 };

  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .style("margin-bottom", "-30px")
    .style("font-size", "24px")
    .style("color", "#222f3e")
    .style("font-weight", "500")
    .text("Popularity of Genres Over Time");

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

  // Create y-axis
  const yAxis = d3.axisLeft(yScale).ticks(null, jsonData.format);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("font-size", "16px")
    .attr("color", "#222f3e")
    .select(".domain")
    .remove(); // Remove the vertical line

  // Add horizontal grid lines
  svg
    .selectAll("line.horizontalGrid")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("class", "horizontalGrid")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("y1", (d) => yScale(d))
    .attr("y2", (d) => yScale(d))
    .attr("stroke", "grey")
    .attr("stroke-opacity", 0.3)
    .attr("stroke-width", "1.5")
    .attr("rx", 10)
    .attr("ry", 10); // Rounded corners

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
    .on("mouseover", function (event, d) {
      if (minRangeValue - maxRangeValue != 0) {
        d3.select(this).style("cursor", "pointer").style("stroke-width", "3px");

        // append text in the bottom of the bar with the value of the popularity passed by the yScale
        svg
          .append("text")
          .attr("class", `${d.genre}`)
          .attr("x", d3.select(this).attr("x"))
          .attr("y", d3.select(this).attr("y"))
          .attr("font-size", "32px")
          .attr("font-weight", "700")
          .attr("fill", "white")
          .style(
            "transform",
            `translate(${d3.select(this).attr("width")}px, ${
              d3.select(this).attr("height") - 10
            }px)`
          )
          .style("opacity", 0)
          .text(d.popularity.toFixed(1));

        svg
          .select(`text.${d.genre}`)
          .transition()
          .duration(500)
          .style(
            "transform",
            `translate(${d3.select(this).attr("width") - 72}px, ${
              d3.select(this).attr("height") - 10
            }px)`
          )
          .style("opacity", 1);
      }
    })
    .on("mouseleave", function (event, d) {
      d3.select(this).style("stroke-width", "1px");

      svg
        .select(`text.${d.genre}`)
        .transition()
        .duration(300)
        .style(
          "transform",
          `translate(${d3.select(this).attr("width")}px, ${
            d3.select(this).attr("height") - 10
          }px)`
        )
        .style("opacity", 0)
        .on("end", function () {
          svg.select(`text.${d.genre}`).remove();
        });
    })
    .on("click", function (event, d) {
      //get checked genres from html element
      genres = [];
      document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
        if (checkbox.checked) {
          genres.push(checkbox.value);
        }
      });
      localStorage.setItem("selectedGenres", JSON.stringify(genres));
      if (minRangeValue - maxRangeValue != 0) {
        selectGenre = d.genre;
        updateDashboard(
          minRangeValue,
          maxRangeValue,
          [selectGenre],
          null,
          null,
          true
        );
      }
    });

  // Create x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3.axisBottom(xScale).tickFormat((i) => jsonData[i].genre.toUpperCase())
    )
    .attr("class", "xAxis")
    .attr("font-size", "12px")
    .attr("font-weight", "600")
    .attr("color", "#222f3e");
}

function createLinechart(
  selectedData,
  containerId,
  minRangeValue,
  maxRangeValue,
  checkedGenres,
  originalData,
  wasByClick
) {
  isBarchart = false;
  // Clear the existing chart elements
  d3.select(containerId).selectAll("*").remove();

  const width = (window.innerWidth - 370) / 2;
  const height = (window.innerHeight - 50 - 164) / 2;
  const margin = { bottom: 50, left: 50, right: 50, top: 50 };

  //get checked genre
  const selectedGenre = document.querySelector(".genre-checkbox:checked").value;
  const selectedGenreCap =
    selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1);

  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .style("margin-bottom", "-30px")
    .style("font-size", "24px")
    .style("font-weight", "500")
    .style("color", "#222f3e")
    .text("Popularity of " + selectedGenreCap + " Over Time");

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", [0, 0, width, height]);

  // Define scales
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
    .x((d, i) => xScale(minRangeValue + i))
    .y((d) => yScale(d));

  // Append path
  svg
    .append("path")
    .datum(selectedData.popularity)
    .attr("fill", "none")
    .attr("stroke", selectedData.color)
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add circles on each data point
  svg
    .selectAll("circle")
    .data(selectedData.popularity)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(minRangeValue + i))
    .attr("cy", (d) => yScale(d))
    .attr("r", 4) // Radius of the circle
    .attr("fill", selectedData.color)
    .on("mouseover", function (event, d) {
      d3.select(this)
        .attr("r", 6) // Increase circle size on hover
        .attr("stroke", "black") // Optional: Add a stroke around the circle
        .attr("stroke-width", 2); // Make stroke visible

      const tooltipText = `Popularity: ${d}`;
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

  // Append x-axis
  svg
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

  // Append y-axis
  svg
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  // Append a cross (close button) to return to the bar chart
  if (wasByClick) {
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
        const selectedGenres = JSON.parse(
          localStorage.getItem("selectedGenres")
        );
        // chcek the selectedGenres checkboxes
        document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
          checkbox.checked = selectedGenres.includes(checkbox.value);
        });
        createBarchart(
          originalData,
          containerId,
          minRangeValue,
          maxRangeValue,
          selectedGenres
        );
        updateDashboard(minRangeValue, maxRangeValue, selectedGenres);
      });
  }
}

function updateBarchart(minRangeValue, maxRangeValue, checkedGenres) {
  d3.csv("./data/genre_popularity_time.csv").then((data) => {
    // Filter and process data for the selected genres and time range
    const filteredData = data
      .filter((d) => checkedGenres.includes(d.Genre))
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

    // Sort the jsonData in descending order based on popularity
    const jsonData = filteredData
      .map((d) => ({
        genre: d.Genre,
        popularity: d.popularity,
        color: colorMap[d.Genre],
      }))
      .sort((a, b) => d3.descending(a.popularity, b.popularity));

    const width = (window.innerWidth - 370) / 2;
    const height = (window.innerHeight - 50 - 164) / 2;
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
      .domain([0, d3.max(jsonData, (d) => d.popularity) + 5])
      .range([height - margin.bottom, margin.top]);

    // Update horizontal grid lines with smooth transition
    const gridLines = svg.selectAll("line.horizontalGrid").data(yScale.ticks());

    gridLines
      .enter()
      .append("line")
      .attr("class", "horizontalGrid")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "grey")
      .attr("stroke-opacity", 0)
      .attr("stroke-width", "1.5")
      .merge(gridLines)
      .lower()
      .transition()
      .duration(500)
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke-opacity", 0.3);

    // Change opacity to 0 for grid lines that are no longer in the data
    gridLines.exit().transition().duration(500).attr("stroke-opacity", 0);

    // Bind new data to the existing bars and update their attributes
    const bars = svg.selectAll("rect.dataItem").data(jsonData, (d) => d.genre);

    bars
      .transition()
      .duration(500)
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d.popularity))
      .attr("height", (d) => yScale(0) - yScale(d.popularity))
      .attr("width", xScale.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("rx", 5)
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
      .attr("fill", (d) => d.color)
      .attr("rx", 5)
      .attr("ry", 5)
      .on("mouseover", function (event, d) {
        if (minRangeValue - maxRangeValue != 0) {
          d3.select(this).style("cursor", "pointer").style("stroke-width", "3px");
  
          // append text in the bottom of the bar with the value of the popularity passed by the yScale
          svg
            .append("text")
            .attr("class", `${d.genre}`)
            .attr("x", d3.select(this).attr("x"))
            .attr("y", d3.select(this).attr("y"))
            .attr("font-size", "32px")
            .attr("font-weight", "700")
            .attr("fill", "white")
            .style(
              "transform",
              `translate(${d3.select(this).attr("width")}px, ${
                d3.select(this).attr("height") - 10
              }px)`
            )
            .style("opacity", 0)
            .text(d.popularity.toFixed(1));
  
          svg
            .select(`text.${d.genre}`)
            .transition()
            .duration(500)
            .style(
              "transform",
              `translate(${d3.select(this).attr("width") - 72}px, ${
                d3.select(this).attr("height") - 10
              }px)`
            )
            .style("opacity", 1);
        }
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).style("stroke-width", "1px");
  
        svg
          .select(`text.${d.genre}`)
          .transition()
          .duration(300)
          .style(
            "transform",
            `translate(${d3.select(this).attr("width")}px, ${
              d3.select(this).attr("height") - 10
            }px)`
          )
          .style("opacity", 0)
          .on("end", function () {
            svg.select(`text.${d.genre}`).remove();
          });
      })
      .on("click", function (event, d) {
        //get checked genres from html element
        genres = [];
        document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
          if (checkbox.checked) {
            genres.push(checkbox.value);
          }
        });
        localStorage.setItem("selectedGenres", JSON.stringify(genres));
        if (minRangeValue - maxRangeValue != 0) {
          selectGenre = d.genre;
          updateDashboard(
            minRangeValue,
            maxRangeValue,
            [selectGenre],
            null,
            null,
            true
          );
        }
      })
      .transition()
      .duration(500)
      .attr("y", (d) => yScale(d.popularity))
      .attr("height", (d) => yScale(0) - yScale(d.popularity));

    // Remove bars that are no longer in the data
    bars
      .exit()
      .transition()
      .duration(500)
      .attr("height", 0)
      .attr("y", yScale(0))
      .remove();

    // Update x-axis with smooth transition
    svg
      .select("g.xAxis")
      .transition()
      .duration(500)
      .call(
        d3.axisBottom(xScale).tickFormat((i) => jsonData[i].genre.toUpperCase())
      );

    // Update y-axis with smooth transition and remove vertical line
    const yAxis = d3.axisLeft(yScale).ticks(null, jsonData.format);

    svg
      .select("g.yAxis")
      .transition()
      .duration(500)
      .call(yAxis)
      .select(".domain")
      .attr("stroke", "none");
  });
}

function updateLinechart(
  minRangeValue,
  maxRangeValue,
  selectedGenre,
  wasByClick
) {
  d3.csv("./data/genre_popularity_time.csv").then((data) => {
    // Filter and process data for the selectedGenre and time range
    const longFormatData = [];
    data.forEach((row) => {
      for (let year = minRangeValue; year <= maxRangeValue; year++) {
        longFormatData.push({
          genre: row.Genre,
          year: year,
          popularity: +row[year],
        });
      }
    });

    const selectedData = longFormatData.filter(
      (item) => item.genre === selectedGenre
    );

    const popularity = selectedData.map((d) => d.popularity);
    const color = colorMap[selectedGenre];

    const width = (window.innerWidth - 370) / 2;
    const height = (window.innerHeight - 50 - 164) / 2;
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
      .domain([0, d3.max(popularity) + 5])
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3
      .line()
      .x((d, i) => xScale(minRangeValue + i))
      .y((d) => yScale(d));

    // Bind new data to the existing path and update its attributes with transition
    const path = svg.select("path");
    path
      .datum(popularity)
      .transition()
      .duration(500)
      .attr("d", line)
      .attr("stroke", color);

    // Calculate tick interval based on the selected time range
    const timeRange = maxRangeValue - minRangeValue;
    let tickInterval = 1;
    if (timeRange > 10) tickInterval = Math.ceil(timeRange / 10);

    svg.select("g.xAxis").selectAll("*").remove();

    // Update x-axis without transition
    svg.select("g.xAxis").call(
      d3
        .axisBottom(xScale)
        .ticks((maxRangeValue - minRangeValue) / tickInterval)
        .tickFormat(d3.format("d"))
    );

    // Update y-axis with smooth transition
    svg.select("g.yAxis").transition().duration(500).call(d3.axisLeft(yScale));

    // Tooltip div for hover effects
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#f9f9f9")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("display", "none");

    // Bind circles to data points and update with transition
    const circles = svg.selectAll("circle").data(popularity);

    // Remove any old circles no longer in use
    circles.exit().transition().duration(500).attr("r", 0).remove();

    // Enter new circles for new data points
    circles
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(minRangeValue + i))
      .attr("cy", (d) => yScale(d))
      .attr("r", 0) // Start with radius 0 for animation
      .attr("fill", color)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("r", 4) // Increase circle size on hover
          .attr("stroke", "black") // Optional: Add a stroke around the circle
          .attr("stroke-width", 2); // Make stroke visible

        const tooltipText = `Popularity: ${d}`;
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
      })
      .merge(circles) // Merge enter and update selections
      .transition()
      .duration(500)
      .attr("cx", (d, i) => xScale(minRangeValue + i))
      .attr("cy", (d) => yScale(d))
      .attr("r", 4); // Animate to final radius

    // Append a cross (close button) to return to the bar chart
    if (wasByClick) {
      svg
        .select("text")
        .attr("x", width - 30)
        .attr("y", margin.top)
        .attr("font-size", "24px")
        .attr("cursor", "pointer")
        .text("✖")
        .on("click", function () {
          // Clear the line chart
          d3.select(".Barchart").selectAll("*").remove();
          // Recreate the bar chart
          createBarchart(
            data,
            ".Barchart",
            minRangeValue,
            maxRangeValue,
            JSON.parse(localStorage.getItem("selectedGenres"))
          );
        });
    }
  });
}
