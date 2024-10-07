function init() {
    d3.json("./data/dataset.json").then(function (data) {
        createHistogram(data, ".Histogram");
        createBubbleChart(data, ".BubbleChart");
        createRadarChart(data, ".RadarChart");
        createVanDiagram(data, ".VanDiagram");
    });

    const minRange = document.getElementById("minRange");
    const maxRange = document.getElementById("maxRange");

    // Add event listeners to both range inputs
    minRange.addEventListener("input", updateSlider);
    maxRange.addEventListener("input", updateSlider);
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
}
