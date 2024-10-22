function RadarChart(
  colors,
  data,
  id,
  minRangeValue,
  maxRangeValue,
  checkedGenres
) {
  const radarData = checkedGenres.map((genre) => ({
    genre: genre,
    color: colors[genre],
    polygon: [
      { axis: "danceability", value: 0 },
      { axis: "energy", value: 0 },
      { axis: "key", value: 0 },
      { axis: "speechiness", value: 0 },
      { axis: "acousticness", value: 0 },
      { axis: "instrumentalness", value: 0 },
      { axis: "valence", value: 0 },
      { axis: "tempo", value: 0 },
    ],
  }));

  d3.csv("./data/genre_all_time_attribute.csv").then(function (table) {
    let tableData = [];
    for (let i = 0; i < checkedGenres.length; i++) {
      let genreData = [];
      for (let j = minRangeValue; j <= maxRangeValue; j++) {
        let yearData = [];
        for (let k = 3; k < table.columns.length; k++) {
          let filtered = table.filter(
            (d) => d.Genre === checkedGenres[i] && d.Year == j
          );
          if (filtered.length > 0) {
            let value = filtered[0][table.columns[k]];
            yearData.push(value);
          } else {
            yearData.push(null);
          }
        }
        genreData.push(yearData);
      }
      let genreDataAvg = [];
      for (let k = 0; k < genreData[0].length; k++) {
        let values = [];
        for (let j = 0; j < genreData.length; j++) {
          values.push(genreData[j][k]);
        }
        if (k == 2 || k == 7) {
          genreDataAvg.push(mode(values));
        } else {
          genreDataAvg.push(average(values));
        }
      }
      tableData.push(genreDataAvg);
    }

    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].length; j++) {
        radarData[i].polygon[j].value = tableData[i][j];
      }
    }
    console.log(radarData);
    areas = [];
    radarData.forEach((d) => {
      values = 1;
      d.polygon.forEach((p) => {
        //pass p.value from a string to a float
        value = parseFloat(p.value);
        values = values * value;
      });
      areas.push(values);
    });
    // Combine radarData with areas
    let radarDataWithAreas = radarData.map((d, index) => ({
      ...d,
      area: areas[index],
    }));

    // Sort radarDataWithAreas by area in descending order
    radarDataWithAreas.sort((a, b) => b.area - a.area);

    // Extract sorted radarData
    let sortedRadarData = radarDataWithAreas.map((d) => {
      let { area, ...rest } = d;
      return rest;
    });

    createRadarChart(sortedRadarData, id);
  });

  function createRadarChart(radarData, id) {
    const scaleList = [
      [0.0, 0.25, 0.5, 0.75, 1.0], // danceability
      [0.0, 0.225, 0.45, 0.675, 0.9], // energy
      [0.0, 2.75, 5.5, 8.25, 11], // key
      [0.0, 0.1, 0.2, 0.3, 0.4], // speechiness
      [0.0, 0.225, 0.45, 0.675, 0.9], // acousticness
      [0.0, 0.075, 0.15, 0.225, 0.3], // instrumentalness
      [0.0, 0.25, 0.5, 0.75, 1.0], // valence
      [0.0, 50, 100, 150, 200], // tempo
    ];

    var config = {
      margin: { top: 60, right: 50, bottom: 60, left: 50 },
      levels: 4,
      wrapWidth: 40,
      opacityArea: 0.35,
      dotRadius: 3,
      opacityCircles: 0.075,
      strokeWidth: 2,
    };

    var height = (window.innerHeight - 64) / 2;
    var width = (window.innerWidth - 300) / 2;

    var radius = height / 2;

    var allAxis = radarData[0].polygon.map((i) => i.axis),
      total = allAxis.length,
      Format = d3.format(".1f"),
      angleSlice = (Math.PI * 2) / total;

    var svg = d3.select(id).select("svg");

    if (svg.empty()) {
      svg = d3
        .select(id)
        .append("svg")
        .attr("width", width + config.margin.left + config.margin.right)
        .attr("height", height + config.margin.top + config.margin.bottom)
        .attr("class", "radar" + id);

      var g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" +
            (width / 2 + config.margin.left) +
            "," +
            (height / 2 + config.margin.top) +
            ")"
        );

      var filter = g.append("defs").append("filter").attr("id", "glow"),
        feGaussianBlur = filter
          .append("feGaussianBlur")
          .attr("stdDeviation", "2.5")
          .attr("result", "coloredBlur"),
        feMerge = filter.append("feMerge"),
        feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
        feMergeNode_2 = feMerge
          .append("feMergeNode")
          .attr("in", "SourceGraphic");

      var axisGrid = g.append("g").attr("class", "axisWrapper");

      axisGrid
        .selectAll(".levels")
        .data(d3.range(1, config.levels + 1).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", (d) => (radius / config.levels) * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", config.opacityCircles)
        .style("filter", "url(#glow)");

      //
      var rScaleList = [
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[0][4]]),
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[1][4]]),
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[2][4]]),
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[3][4]]),
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[4][4]]),
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[5][4]]),
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[6][4]]),
        d3.scaleLinear().range([0, radius]).domain([0, scaleList[7][4]]),
      ];

      // Draw the axis
      var axis = axisGrid
        .selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

      //
      for (let attribute = 0; attribute < 8; attribute++) {
        axis
          .append("text")
          .attr("class", "textscale")
          .style("font-size", "10px")
          .style("user-select", "none")
          .attr("fill", "#737373")
          .data(scaleList[attribute])
          .attr("x", 4)
          .attr("dy", "-4")
          .attr("y", (d, i) => (-radius * i) / 4)
          .attr("transform", (d, i) => {
            var angleI = (angleSlice * attribute * 180) / Math.PI;
            var flip = angleI < 90 || angleI > 270 ? false : true;
            return "rotate(" + angleI + ")";
          })
          .text((d) => {
            if (attribute == 0) {
              return d; // Use the exact value from scaleList
            } else {
              if (d != 0) {
                return d; // Use the exact value from scaleList
              }
            }
          });
      }

      axis
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

      axis
        .append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .style("user-select", "none")
        .attr("text-anchor", "middle")
        .attr(
          "x",
          (d, i) => radius * 1.2 * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "y",
          (d, i) => radius * 1.2 * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .text((d) => d);

      var blobWrapper = g
        .selectAll(".radarWrapper")
        .data(radarData)
        .enter()
        .append("g")
        .attr("class", "radarWrapper");

    
      //The radial line function
      var radarLine = d3
        .lineRadial()
        .curve(d3.curveCatmullRomClosed)
        .radius(function (d, i) {
          return rScaleList[i](d.value);
        })
        .angle(function (d, i) {
          return i * angleSlice;
        });

      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", (d) => radarLine(d.polygon))
        .style("fill", (d, i) => d.color)
        .style("fill-opacity", config.opacityArea)
        .on("mouseover", function (d, i) {
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.1);
          d3.select(this).transition().duration(200).style("fill-opacity", 0.8);

          //make other polygons lines to decrease opacity
          d3.selectAll(".radarStroke")
            .transition()
            .duration(200)
            .style("stroke-opacity", 0.1);
        })
        .on("mouseout", function () {
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", config.opacityArea);

          d3.selectAll(".radarStroke")
            .transition()
            .duration(200)
            .style("stroke-opacity", 1);
        });

      blobWrapper
        .append("path")
        .attr("class", "radarStroke")
        .attr("d", (d) => radarLine(d.polygon))
        .style("stroke-width", config.strokeWidth + "px")
        .style("stroke", (d, i) => d.color)
        .style("fill", "none")
        .style("filter", "url(#glow)");

      blobWrapper
        .selectAll(".radarCircle")
        .data((d) => d.polygon)
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", config.dotRadius)
        .attr(
          "cx",
          (d, i) =>
            rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, i) =>
            rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .style("fill", function (d, i, nodes) {
          // Get the parent data to access the color
          const parentData = d3.select(nodes[i].parentNode).datum();
          return parentData.color;
        })
        .style("fill-opacity", 0.8);

      var blobCircleWrapper = g
        .selectAll(".radarCircleWrapper")
        .data(radarData)
        .enter()
        .append("g")
        .attr("class", "radarCircleWrapper");

      blobCircleWrapper
        .selectAll(".radarInvisibleCircle")
        .data((d) => d.polygon)
        .enter()
        .append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", config.dotRadius * 1)
        .attr(
          "cx",
          (d, i) =>
            rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, i) =>
            rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (event, d) {
          newX = parseFloat(d3.select(this).attr("cx")) - 10;
          newY = parseFloat(d3.select(this).attr("cy")) - 10;

          tooltip
            .attr("x", newX)
            .attr("y", newY)
            .text(d.value)
            .transition()
            .duration(200)
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          tooltip.transition().duration(200).style("opacity", 0);
        });

      var tooltip = g
        .append("text")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("user-select", "none");

      function wrap(text, width) {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4,
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text
              .text(null)
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", dy + "em");

          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                .text(word);
            }
          }
        });
      }
    } else {
      var g = svg.select("g");

      var rScaleList = [
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[0][4]]),
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[1][4]]),
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[2][4]]),
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[3][4]]),
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[4][4]]),
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[5][4]]),
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[6][4]]),
        d3
          .scaleLinear()
          .range([0, radius - 50])
          .domain([0, scaleList[7][4]]),
      ];

      var radarLine = d3
        .lineRadial()
        .curve(d3.curveCatmullRomClosed)
        .radius((d, i) => rScaleList[i](d.value))
        .angle((d, i) => i * angleSlice);

      var blobWrapper = g.selectAll(".radarWrapper").data(radarData);

      blobWrapper
        .select(".radarArea")
        .transition()
        .duration(1000)
        .attr("d", (d) => radarLine(d.polygon));

      blobWrapper
        .select(".radarStroke")
        .transition()
        .duration(1000)
        .attr("d", (d) => radarLine(d.polygon));

      blobWrapper
        .selectAll(".radarCircle")
        .data((d) => d.polygon)
        .transition()
        .duration(1000)
        .attr(
          "cx",
          (d, i) =>
            rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, i) =>
            rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2)
        );
    }
  }

  function average(values) {
    const validValues = values.filter(
      (v) => v !== null && v !== undefined && v !== 0
    );
    const sum = validValues.reduce((acc, val) => acc + parseFloat(val), 0);
    return sum / validValues.length;
  }

  function mode(values) {
    const frequency = {};
    let maxFreq = 0;
    let modeValue = null;

    values.forEach((value) => {
      if (value !== null && value !== undefined && value !== 0) {
        frequency[value] = (frequency[value] || 0) + 1;
        if (frequency[value] > maxFreq) {
          maxFreq = frequency[value];
          modeValue = value;
        }
      }
    });

    return modeValue;
  }
}

//update radarchart with animations
function updateRadarChart(minRangeValue, maxRangeValue, checkedGenres) {
  const radarData = checkedGenres.map((genre) => ({
    genre: genre,
    color: getColor(genre),
    polygon: [
      { axis: "danceability", value: 0 },
      { axis: "energy", value: 0 },
      { axis: "key", value: 0 },
      { axis: "speechiness", value: 0 },
      { axis: "acousticness", value: 0 },
      { axis: "instrumentalness", value: 0 },
      { axis: "valence", value: 0 },
      { axis: "tempo", value: 0 },
    ],
  }));

  d3.csv("./data/genre_all_time_attribute.csv").then(function (table) {
    let tableData = [];
    for (let i = 0; i < checkedGenres.length; i++) {
      let genreData = [];
      for (let j = minRangeValue; j <= maxRangeValue; j++) {
        let yearData = [];
        for (let k = 3; k < table.columns.length; k++) {
          let filtered = table.filter(
            (d) => d.Genre === checkedGenres[i] && d.Year == j
          );
          if (filtered.length > 0) {
            let value = filtered[0][table.columns[k]];
            yearData.push(value);
          } else {
            yearData.push(null);
          }
        }
        genreData.push(yearData);
      }
      let genreDataAvg = [];
      for (let k = 0; k < genreData[0].length; k++) {
        let values = [];
        for (let j = 0; j < genreData.length; j++) {
          values.push(genreData[j][k]);
        }
        if (k == 2 || k == 7) {
          genreDataAvg.push(mode(values));
        } else {
          genreDataAvg.push(average(values));
        }
      }
      tableData.push(genreDataAvg);
    }

    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].length; j++) {
        radarData[i].polygon[j].value = tableData[i][j];
      }
    }
    console.log(radarData);
    areas = [];
    radarData.forEach((d) => {
      values = 1;
      d.polygon.forEach((p) => {
        //pass p.value from a string to a float
        value = parseFloat(p.value);
        values = values * value;
      });
      areas.push(values);
    });
    // Combine radarData with areas
    let radarDataWithAreas = radarData.map((d, index) => ({
      ...d,
      area: areas[index],
    }));

    // Sort radarDataWithAreas by area in descending order
    radarDataWithAreas.sort((a, b) => b.area - a.area);

    // Extract sorted radarData
    let sortedRadarData = radarDataWithAreas.map((d) => {
      let { area, ...rest } = d;
      return rest;
    });

    updateChart(sortedRadarData, ".Radarchart");
  });

  function updateChart(radarData, id) {
    const scaleList = [
      [0.0, 0.25, 0.5, 0.75, 1.0], // danceability
      [0.0, 0.225, 0.45, 0.675, 0.9], // energy
      [0.0, 2.75, 5.5, 8.25, 11], // key
      [0.0, 0.1, 0.2, 0.3, 0.4], // speechiness
      [0.0, 0.225, 0.45, 0.675, 0.9], // acousticness
      [0.0, 0.075, 0.15, 0.225, 0.3], // instrumentalness
      [0.0, 0.25, 0.5, 0.75, 1.0], // valence
      [0.0, 50, 100, 150, 200], // tempo
    ];

    var config = {
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
      levels: 4,
      wrapWidth: 60,
      opacityArea: 0.25,
      dotRadius: 3,
      opacityCircles: 0.1,
      strokeWidth: 2,
    };

    var height = (window.innerHeight - 64) / 2;
    var width = (window.innerWidth - 300) / 2;

    var radius = height / 2;

    var allAxis = radarData[0].polygon.map((i) => i.axis),
      total = allAxis.length,
      Format = d3.format(".1f"),
      angleSlice = (Math.PI * 2) / total;

    var svg = d3.select(id).select("svg");

    var g = svg.select("g");

    var axisGrid = g.select("g").attr("class", "axisWrapper");

    var rScaleList = [
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[0][4]]),
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[1][4]]),
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[2][4]]),
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[3][4]]),
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[4][4]]),
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[5][4]]),
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[6][4]]),
      d3.scaleLinear().range([0, radius]).domain([0, scaleList[7][4]]),
    ];

    var radarLine = d3
      .lineRadial()
      .curve(d3.curveCatmullRomClosed)
      .radius((d, i) => rScaleList[i](d.value))
      .angle((d, i) => i * angleSlice);

    var blobWrapper = g.selectAll(".radarWrapper").data(radarData);

    // Handle the exit selection
    blobWrapper.exit().remove();

    // Handle the enter selection
    var blobWrapperEnter = blobWrapper
      .enter()
      .append("g")
      .attr("class", "radarWrapper");

    blobWrapperEnter
      .append("path")
      .attr("class", "radarArea")
      .style("fill", (d, i) => d.color)
      .style("fill-opacity", config.opacityArea)
      .on("mouseover", function (d, i) {
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);
        d3.select(this).transition().duration(200).style("fill-opacity", 0.9);

        //make other polygons lines to decrease opacity
        d3.selectAll(".radarStroke")
          .transition()
          .duration(200)
          .style("stroke-opacity", 0.1);
      })
      .on("mouseout", function () {
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", config.opacityArea);

        d3.selectAll(".radarStroke")
          .transition()
          .duration(200)
          .style("stroke-opacity", 1);
      });

    blobWrapperEnter
      .append("path")
      .attr("class", "radarStroke")
      .style("stroke-width", config.strokeWidth + "px")
      .style("stroke", (d, i) => d.color)
      .style("fill", "none")
      .style("filter", "url(#glow)");

    blobWrapperEnter
      .selectAll(".radarCircle")
      .data((d) => d.polygon)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", config.dotRadius)
      .style("fill-opacity", 0.8);

    // Handle the update selection
    blobWrapper = blobWrapperEnter.merge(blobWrapper);

    blobWrapper
      .select(".radarArea")
      .transition()
      .duration(1000)
      .attr("d", (d) => radarLine(d.polygon))
      .style("fill", (d, i) => d.color); // Update fill color

    blobWrapper
      .select(".radarStroke")
      .transition()
      .duration(1000)
      .attr("d", (d) => radarLine(d.polygon))
      .style("stroke", (d, i) => d.color); // Update stroke color

    blobWrapper
      .selectAll(".radarCircle")
      .data((d) => d.polygon)
      .transition()
      .duration(1000)
      .attr(
        "cx",
        (d, i) =>
          rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) =>
          rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style("fill", function (d, i, nodes) {
        // Get the parent data to access the color
        const parentData = d3.select(nodes[i].parentNode).datum();
        return parentData.color;
      });

    // Handle radarInvisibleCircle update
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper").data(radarData);

    // Handle the exit selection
    blobCircleWrapper.exit().remove();

    // Handle the enter selection
    var blobCircleWrapperEnter = blobCircleWrapper
      .enter()
      .append("g")
      .attr("class", "radarCircleWrapper");

    blobCircleWrapperEnter
      .selectAll(".radarInvisibleCircle")
      .data((d) => d.polygon)
      .enter()
      .append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", config.dotRadius * 1)
      .attr(
        "cx",
        (d, i) =>
          rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) =>
          rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function (event, d) {
        newX = parseFloat(d3.select(this).attr("cx")) - 10;
        newY = parseFloat(d3.select(this).attr("cy")) - 10;

        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(d.value)
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // Handle the update selection
    blobCircleWrapper = blobCircleWrapperEnter.merge(blobCircleWrapper);

    blobCircleWrapper
      .selectAll(".radarInvisibleCircle")
      .data((d) => d.polygon)
      .transition()
      .duration(1000)
      .attr(
        "cx",
        (d, i) =>
          rScaleList[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) =>
          rScaleList[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2)
      );

    var tooltip = g
      .append("text")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("user-select", "none");
  }

  function average(values) {
    const validValues = values.filter(
      (v) => v !== null && v !== undefined && v !== 0
    );
    const sum = validValues.reduce((acc, val) => acc + parseFloat(val), 0);
    return sum / validValues.length;
  }

  function mode(values) {
    const frequency = {};
    let maxFreq = 0;
    let modeValue = null;

    values.forEach((value) => {
      if (value !== null && value !== undefined && value !== 0) {
        frequency[value] = (frequency[value] || 0) + 1;
        if (frequency[value] > maxFreq) {
          maxFreq = frequency[value];
          modeValue = value;
        }
      }
    });

    return modeValue;
  }
}
