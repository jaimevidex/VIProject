function RadarChart(data, id, minRangeValue, maxRangeValue, checkedGenres) {
  const radarData = [
    { axis: "danceability", values: [] },
    { axis: "energy", values: [] },
    { axis: "key", values: [] },
    { axis: "speechiness", values: [] },
    { axis: "acousticness", values: [] },
    { axis: "instrumentalness", values: [] },
    { axis: "valence", values: [] },
    { axis: "tempo", values: [] },
  ];

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
        radarData[j].values.push(tableData[i][j]);
      }
    }
    console.log(radarData);
    updateRadarChart(radarData, id);
  });

  function updateRadarChart(radarData, id) {
    const scaleList = [
      [0.0, 0.225, 0.45, 0.675, 0.9], // accousticness
      [0.0, 0.2, 0.4, 0.6, 0.8], // danceability
      [0.0, 2.75, 5.5, 8.25, 11], // key
      [0.0, 0.1, 0.2, 0.3, 0.4], // speechiness
      [0.0, 0.225, 0.45, 0.675, 0.9], // energy
      [0.0, 0.075, 0.15, 0.225, 0.3], // instrumentalness
      [0.0, 0.25, 0.5, 0.75, 1.0], // valence
      [0.0, 50, 100, 150, 200], // tempo
    ];

    var config = {
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
      levels: 5,
      labelFactor: 1.25,
      wrapWidth: 60,
      opacityArea: 0.35,
      dotRadius: 4,
      opacityCircles: 0.1,
      strokeWidth: 2,
    };

    var myColor = d3.scaleOrdinal().domain(radarData).range(d3.schemeSet2);

    var radius = 200;

    var allAxis = radarData.map((i) => i.axis),
      total = allAxis.length,
      Format = d3.format(".1f"),
      angleSlice = (Math.PI * 2) / total;

    var svg = d3.select(id).select("svg");

    if (svg.empty()) {
      svg = d3
        .select(id)
        .append("svg")
        .attr("width", 700 + config.margin.left + config.margin.right)
        .attr("height", 500 + config.margin.top + config.margin.bottom)
        .attr("class", "radar" + id);

      var g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" +
            (700 / 2 + config.margin.left) +
            "," +
            (500 / 2 + config.margin.top) +
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
        .attr("r", (d) => (radius / config.levels) * d * 0.96)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", config.opacityCircles)
        .style("filter", "url(#glow)");

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

      var axis = axisGrid
        .selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

      for (let attribute = 0; attribute < 8; attribute++) {
        axis
          .append("text")
          .attr("class", "textscale")
          .style("font-size", "10px")
          .attr("fill", "#737373")
          .data(scaleList[attribute])
          .attr("x", 2)
          .attr("dy", "-8")
          .attr("y", (d, i) => (-radius * i) / 5 + 12)
          .attr("transform", (d, i) => {
            var angleI = (angleSlice * attribute * 180) / Math.PI;
            var flip = angleI < 90 || angleI > 270 ? false : true;
            return "rotate(" + angleI + ")";
          })
          .text((d) => {
            if (attribute == 0) {
              return Format(d);
            } else {
              if (d != 0) {
                return Format(d);
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
        .attr("text-anchor", "middle")
        .attr(
          "x",
          (d, i) => radius * 1.3 * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "y",
          (d, i) => radius * 1.1 * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .text((d) => d);

      var blobWrapper = g
        .selectAll(".radarWrapper")
        .data(
          radarData[0].values.map((_, i) => radarData.map((d) => d.values[i]))
        )
        .enter()
        .append("g")
        .attr("class", "radarWrapper");

      var radarLine = d3
        .lineRadial()
        .curve(d3.curveLinearClosed)
        .radius((d, i) => rScaleList[i](d))
        .angle((d, i) => i * angleSlice);

      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", (d, i) => radarLine(d))
        .style("fill", (d, i) => myColor(i))
        .style("fill-opacity", config.opacityArea)
        .on("mouseover", function (d, i) {
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.1);
          d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
        })
        .on("mouseout", function () {
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", config.opacityArea);
        });

      blobWrapper
        .append("path")
        .attr("class", "radarStroke")
        .attr("d", (d, i) => radarLine(d))
        .style("stroke-width", config.strokeWidth + "px")
        .style("stroke", (d, i) => myColor(i))
        .style("fill", "none")
        .style("filter", "url(#glow)");

      blobWrapper
        .selectAll(".radarCircle")
        .data((d, i) => d)
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", config.dotRadius)
        .attr(
          "cx",
          (d, i) => rScaleList[i](d) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, i) => rScaleList[i](d) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .style("fill", myColor(0))
        .style("fill-opacity", 0.8);

      var blobCircleWrapper = g
        .selectAll(".radarCircleWrapper")
        .data(
          radarData[0].values.map((_, i) => radarData.map((d) => d.values[i]))
        )
        .enter()
        .append("g")
        .attr("class", "radarCircleWrapper");

      blobCircleWrapper
        .selectAll(".radarInvisibleCircle")
        .data((d, i) => d)
        .enter()
        .append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", config.dotRadius * 1.5)
        .attr(
          "cx",
          (d, i) => rScaleList[i](d) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, i) => rScaleList[i](d) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (event, d) {
          newX = parseFloat(d3.select(this).attr("cx")) - 10;
          newY = parseFloat(d3.select(this).attr("cy")) - 10;

          tooltip
            .attr("x", newX)
            .attr("y", newY)
            .text(d)
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
        .style("opacity", 0);

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
        .curve(d3.curveLinearClosed)
        .radius((d, i) => rScaleList[i](d))
        .angle((d, i) => i * angleSlice);

      var blobWrapper = g
        .selectAll(".radarWrapper")
        .data(
          radarData[0].values.map((_, i) => radarData.map((d) => d.values[i]))
        );

      blobWrapper
        .select(".radarArea")
        .transition()
        .duration(1000)
        .attr("d", (d, i) => radarLine(d));

      blobWrapper
        .select(".radarStroke")
        .transition()
        .duration(1000)
        .attr("d", (d, i) => radarLine(d));

      blobWrapper
        .selectAll(".radarCircle")
        .data((d, i) => d)
        .transition()
        .duration(1000)
        .attr(
          "cx",
          (d, i) => rScaleList[i](d) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          "cy",
          (d, i) => rScaleList[i](d) * Math.sin(angleSlice * i - Math.PI / 2)
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

//update radarchart ith animations
function updateRadarChart(minRangeValue, maxRangeValue, checkedGenres) {
  const radarData = [
    { axis: "danceability", values: [] },
    { axis: "energy", values: [] },
    { axis: "key", values: [] },
    { axis: "speechiness", values: [] },
    { axis: "acousticness", values: [] },
    { axis: "instrumentalness", values: [] },
    { axis: "valence", values: [] },
    { axis: "tempo", values: [] },
  ];

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
        radarData[j].values.push(tableData[i][j]);
      }
    }
    console.log(radarData);
    updateChart(radarData, ".Radarchart");
  });

  function updateChart(radarData, id) {
    const scaleList = [
      [0.0, 0.25, 0.5, 0.75, 1.0], // accousticness
      [0.0, 0.25, 0.5, 0.75, 1.0], // danceability
      [0.0, 2.75, 5.5, 8.25, 11], // key
      [0.0, 0.25, 0.5, 0.75, 1.0], // speechiness
      [0.0, 0.25, 0.5, 0.75, 1.0], // energy
      [0.0, 0.25, 0.5, 0.75, 1.0], // instrumentalness
      [0.0, 0.25, 0.5, 0.75, 1.0], // valence
      [0.0, 50, 100, 150, 200], // tempo
    ];

    var config = {
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
      levels: 5,
      labelFactor: 1.25,
      wrapWidth: 60,
      opacityArea: 0.35,
      dotRadius: 4,
      opacityCircles: 0.1,
      strokeWidth: 2,
    };

    var myColor = d3.scaleOrdinal().domain(radarData).range(d3.schemeSet2);

    var radius = 200;

    var allAxis = radarData.map((i) => i.axis),
      total = allAxis.length,
      Format = d3.format(".1f"),
      angleSlice = (Math.PI * 2) / total;

    var svg = d3.select(id).select("svg");

    // Remove existing SVG elements
    svg.remove();

    // Create new SVG elements
    svg = d3
      .select(id)
      .append("svg")
      .attr("width", 700 + config.margin.left + config.margin.right)
      .attr("height", 500 + config.margin.top + config.margin.bottom)
      .attr("class", "radar" + id);

    var g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          (700 / 2 + config.margin.left) +
          "," +
          (500 / 2 + config.margin.top) +
          ")"
      );

    var filter = g.append("defs").append("filter").attr("id", "glow"),
      feGaussianBlur = filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur"),
      feMerge = filter.append("feMerge"),
      feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
      feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    var axisGrid = g.append("g").attr("class", "axisWrapper");

    axisGrid
      .selectAll(".levels")
      .data(d3.range(1, config.levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d) => (radius / config.levels) * d * 0.96)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", config.opacityCircles)
      .style("filter", "url(#glow)");

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

    var axis = axisGrid
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    for (let attribute = 0; attribute < 8; attribute++) {
      axis
        .append("text")
        .attr("class", "textscale")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .data(scaleList[attribute])
        .attr("x", 2)
        .attr("dy", "-8")
        .attr("y", (d, i) => (-radius * i) / 5 + 12)
        .attr("transform", (d, i) => {
          var angleI = (angleSlice * attribute * 180) / Math.PI;
          var flip = angleI < 90 || angleI > 270 ? false : true;
          return "rotate(" + angleI + ")";
        })
        .text((d) => {
          if (attribute == 0) {
            return Format(d);
          } else {
            if (d != 0) {
              return Format(d);
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
      .attr("text-anchor", "middle")
      .attr(
        "x",
        (d, i) => radius * 1.3 * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "y",
        (d, i) => radius * 1.1 * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .text((d) => d);

    var blobWrapper = g
      .selectAll(".radarWrapper")
      .data(
        radarData[0].values.map((_, i) => radarData.map((d) => d.values[i]))
      )
      .enter()
      .append("g")
      .attr("class", "radarWrapper");

    var radarLine = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d, i) => rScaleList[i](d))
      .angle((d, i) => i * angleSlice);

    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", (d, i) => radarLine(d))
      .style("fill", (d, i) => myColor(i))
      .style("fill-opacity", config.opacityArea)
      .on("mouseover", function (d, i) {
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);
        d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", config.opacityArea);
      });

    blobWrapper
      .append("path")
      .attr("class", "radarStroke")
      .attr("d", (d, i) => radarLine(d))
      .style("stroke-width", config.strokeWidth + "px")
      .style("stroke", (d, i) => myColor(i))
      .style("fill", "none")
      .style("filter", "url(#glow)");

    blobWrapper
      .selectAll(".radarCircle")
      .data((d, i) => d)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", config.dotRadius)
      .attr(
        "cx",
        (d, i) => rScaleList[i](d) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) => rScaleList[i](d) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style("fill", myColor(0))
      .style("fill-opacity", 0.8);

    var blobCircleWrapper = g
      .selectAll(".radarCircleWrapper")
      .data(
        radarData[0].values.map((_, i) => radarData.map((d) => d.values[i]))
      )
      .enter()
      .append("g")
      .attr("class", "radarCircleWrapper");

    blobCircleWrapper
      .selectAll(".radarInvisibleCircle")
      .data((d, i) => d)
      .enter()
      .append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", config.dotRadius * 1.5)
      .attr(
        "cx",
        (d, i) => rScaleList[i](d) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) => rScaleList[i](d) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function (event, d) {
        newX = parseFloat(d3.select(this).attr("cx")) - 10;
        newY = parseFloat(d3.select(this).attr("cy")) - 10;

        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(d)
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
      .style("opacity", 0);

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
