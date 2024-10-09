let isBarchart = true;
let selectGenre = null;
let allGenres = ["pop","rock","rb","country","rap"];

function createBarchart(data, containerId, minRangeValue, maxRangeValue, checkedGenres) {
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
        updateDashboard(minRangeValue, maxRangeValue, [selectGenre]);
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

function createLinechart(selectedData, containerId, minRangeValue, maxRangeValue, checkedGenres, originalData) {
  isBarchart = false;
  // Clear the existing chart elements
  d3.select(containerId).selectAll("*").remove();

  const width = 600;
  const height = 400;
  const margin = { bottom: 50, left: 50, right: 50, top: 50 };

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
  
 // Create circles and apply transitions
  svg
    .selectAll("circle")
    .data(selectedData.popularity)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(years[i]))
    .attr("cy", height - margin.bottom) // Start from bottom
    .attr("r", 5)
    .attr("fill", selectedData.color)
    .attr("stroke", "black")
    .transition() // Apply the transition
    .duration(1000)
    .attr("cy", (d) => yScale(d)); // Transition the 'cy' attribute

  // Attach event handlers after the transition
  svg
    .selectAll("circle")
    .on("mouseover", function (event) {
        d3.select(this)
            .attr("r", 8)
            .attr("stroke-width", 2);
    })
    .on("mouseleave", function (event) {
        d3.select(this)
            .attr("r", 5)
            .attr("stroke-width", 1);
    });

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
        allGenres
      );

      checkAllGenres();
    });
}

function checkAllGenres() {
  const checkboxes = document.querySelectorAll('.genre-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true; // Set each checkbox to checked
  });
  updateFrontend(); // Update the frontend to reflect changes
}

function updateFrontend() {
  // Get all checked genre checkboxes
  const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked')).map(checkbox => checkbox.value);

  // Get all existing genre buttons
  const genreButtons = document.querySelectorAll('.genre-button'); // Assuming these buttons already exist

  // Update the button text based on checked genres
  genreButtons.forEach(button => {
    const genre = button.value; // Assuming button has a value that corresponds to the checkbox
    if (selectedGenres.includes(genre)) {
      button.textContent = `${genre.charAt(0).toUpperCase() + genre.slice(1)} (Selected)`;
    } else {
      button.textContent = `${genre.charAt(0).toUpperCase() + genre.slice(1)} (Not Selected)`;
    }
  });
}

function updateDashboard(minRangeValue, maxRangeValue, checkedGenres) {
  if (checkedGenres.length === 1 && isBarchart) {
    console.log("Transform to line chart");
    // Update checkboxes
    document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
      checkbox.checked = checkedGenres.includes(checkbox.value);
    });
    // Update selectedGenres array
    genres = checkedGenres;
    // Transform to line chart if only one genre is selected
    const selectedGenre = checkedGenres[0];
    d3.csv("./data/genre_popularity_time.csv").then((data) => {
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
      createLinechart(
        { popularity, color },
        ".Barchart",
        minRangeValue,
        maxRangeValue,
        checkedGenres,
        data
      );
    });
  } else if (checkedGenres.length > 1 && !isBarchart) {
    console.log("Transform to bar chart");
    // Transform to bar chart if more than one genre is selected
    d3.csv("./data/genre_popularity_time.csv").then((data) => {
      createBarchart(data, ".Barchart", minRangeValue, maxRangeValue, checkedGenres);
    });
  } else if (checkedGenres.length > 1 && isBarchart) {
    console.log("Update bar chart");
    // Update bar chart if more than one genre is selected
    updateBarchart(minRangeValue, maxRangeValue, checkedGenres);
  } else if (checkedGenres.length === 1 && !isBarchart) {
    console.log("Update line chart");
    // Update line chart if only one genre is selected
    updateLinechart(minRangeValue, maxRangeValue, checkedGenres[0]);
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
      .domain(d3.range(jsonData.length))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(jsonData, (d) => d.popularity) + 5])
      .range([height - margin.bottom, margin.top]);

    // Bind new data to the existing bars and update their attributes
    const bars = svg.selectAll("rect.dataItem").data(jsonData, (d) => d.genre);

    bars
      .transition()
      .duration(1000)
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
      })
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.popularity))
      .attr("height", (d) => yScale(0) - yScale(d.popularity));

    // Remove bars that are no longer in the data
    bars.exit().transition().duration(1000).attr("height", 0).attr("y", yScale(0)).remove();

    // Update x-axis with smooth transition
    svg
      .select("g.xAxis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale).tickFormat((i) => jsonData[i].genre));

    // Update y-axis with smooth transition
    svg
      .select("g.yAxis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale).ticks(null, jsonData.format));
  });
}

function updateLinechart(minRangeValue, maxRangeValue, selectedGenre) {
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
      .duration(1000)
      .attr("d", line)
      .attr("stroke", color);

    // Calculate tick interval based on the selected time range
    const timeRange = maxRangeValue - minRangeValue;
    let tickInterval = 1;
    if (timeRange > 10) tickInterval = Math.ceil(timeRange / 10);

    // Update x-axis without transition
    svg
      .select("g.xAxis")
      .call(
        d3.axisBottom(xScale)
          .ticks((maxRangeValue - minRangeValue) / tickInterval)
          .tickFormat(d3.format("d"))
      );

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
        // Clear the line chart
        d3.select(".Barchart").selectAll("*").remove();
        // Recreate the bar chart
        createBarchart(
          data,
          ".Barchart",
          minRangeValue,
          maxRangeValue,
          genres
        );
      });
  });
}