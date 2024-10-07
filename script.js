
//create variables to store the min and max values of the sliders and the genres that are checked
let minRangeValue = 1962;
let maxRangeValue = 2022;
let genres = ["rock", "pop", "rap", "country", "rb"];

function init() {
    d3.csv("./data/genre_all_time_attribute.csv").then(function (data) {
      createBarchart(data, ".Barchart", minRangeValue, maxRangeValue, genres);
    });

    const minRange = document.getElementById("minRange");
    const maxRange = document.getElementById("maxRange");

    // Add event listeners to both range inputs
    minRange.addEventListener("input", updateSlider);
    maxRange.addEventListener("input", updateSlider);

    // Add event listener to each genre checkbox
    const genreCheckboxes =  document.querySelectorAll(".genre-checkbox");
    genreCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", updateGenreSelection));
}

function updateSlider(event) {
    const minRange = document.getElementById("minRange");
    const maxRange = document.getElementById("maxRange");
    const minOutput = document.getElementById("minOutput");
    const maxOutput = document.getElementById("maxOutput");

    // Set the minimum and maximum output values
    minOutput.textContent = minRange.value;
    maxOutput.textContent = maxRange.value;

    // Check which slider is being used
    const selected = event.target.id;

    // If max slider is moved and it goes below the min slider
    if (selected === "minRange" && parseInt(maxRange.value) <= parseInt(minRange.value)) {
        // Set both to the same value to stop movement
        minRange.value = maxRange.value; 
        minOutput.textContent = minRange.value; // Update displayed min value
    }

    // If min slider is moved and it goes above the max slider
    if (selected === "maxRange" && parseInt(minRange.value) >= parseInt(maxRange.value)) {
        // Set both to the same value to stop movement
        maxRange.value = minRange.value; 
        maxOutput.textContent = maxRange.value; // Update displayed max value
    }

    // Update the global variables
    minRangeValue = parseInt(minRange.value);
    maxRangeValue = parseInt(maxRange.value);
    console.log(minRangeValue, maxRangeValue);
}

function updateGenreSelection() {
const genreCheckboxes = [
  document.getElementById("rock_checkbox"),
  document.getElementById("pop_checkbox"),
  document.getElementById("rap_checkbox"),
  document.getElementById("country_checkbox"),
  document.getElementById("rb_checkbox")
]

//create an array with the genres that are checked
const checkedGenres = genreCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);

//update the global variable
genres = checkedGenres;

console.log(genres);

}
