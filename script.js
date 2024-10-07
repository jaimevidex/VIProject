function init() {
  d3.csv("./data/genre_all_time_attribute.csv").then(function (data) {
    createBarchart(data, ".BarChart");
  });
}