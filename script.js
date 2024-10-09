const colorMap = {
  rock: "#1f77b4", // Blue
  pop: "#ff7f0e", // Orange
  rap: "#2ca02c", // Green
  rb: "#d62728", // Red
  country: "#9467bd", // Purple
};

let minRangeValue = 1960;
let maxRangeValue = 2021;
let genres = ["rock", "pop", "rap", "country", "rb"];

function init() {
  d3.csv("./data/genre_popularity_time.csv").then((data) => {
    createBarchart(data, ".Barchart", minRangeValue, maxRangeValue, genres);
  });

  const minRange = document.getElementById("minRange");
  const maxRange = document.getElementById("maxRange");

  minRange.addEventListener("input", updateSlider);
  maxRange.addEventListener("input", updateSlider);

  document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", updateGenreSelection);
  });
}

function updateSlider(event) {
  const minRange = document.getElementById("minRange");
  const maxRange = document.getElementById("maxRange");
  const minOutput = document.getElementById("minOutput");
  const maxOutput = document.getElementById("maxOutput");

  minOutput.textContent = minRange.value;
  maxOutput.textContent = maxRange.value;

  if (
    event.target.id === "minRange" &&
    parseInt(maxRange.value) <= parseInt(minRange.value)
  ) {
    minRange.value = maxRange.value;
    minOutput.textContent = minRange.value;
  }

  if (
    event.target.id === "maxRange" &&
    parseInt(minRange.value) >= parseInt(maxRange.value)
  ) {
    maxRange.value = minRange.value;
    maxOutput.textContent = maxRange.value;
  }

  minRangeValue = parseInt(minRange.value);
  maxRangeValue = parseInt(maxRange.value);

  updateDashboard(minRangeValue, maxRangeValue, genres);
}

function updateGenreSelection() {
  const genreCheckboxes = Array.from(
    document.querySelectorAll(".genre-checkbox")
  );
  const checkedGenres = genreCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (checkedGenres.length === 0) {
    genreCheckboxes.forEach((checkbox) => {
      if (genres.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
    return;
  }

  genres = checkedGenres;
  updateDashboard(minRangeValue, maxRangeValue, genres);
}