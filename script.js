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
let artist = null;
let keyword = null;

// Get all the artists names from the csv file artist_search_table
let artists = [];

function init() {
  d3.csv("./data/artist_search_table.csv").then((data) => {
    data.forEach((d) => {
      console.log(d.artist);
      artists.push(d.artist);
    });

    d3.csv("./data/genre_popularity_time.csv").then((data) => {
      createBarchart(data, ".Barchart", minRangeValue, maxRangeValue, genres);
      createBubblechart(
        data,
        ".Bubblechart",
        minRangeValue,
        maxRangeValue,
        genres
      );
      createRadarchart(
        data,
        ".Radarchart",
        minRangeValue,
        maxRangeValue,
        genres
      );
    });
  });
  /* 
  CREATE THE VENN DIAGRAM HERE WITH A DEFAULT ARTIST
  */
  d3.csv("./data/venn_table.csv").then((data) => {
    // filter the data to only send the data from the beatles
    data = data.filter((d) => d.artist === "The Beatles");
    createVennDiagram(
      data,
      ".Venndiagram",
      minRangeValue,
      maxRangeValue,
      genres,
      "The Beatles"
    );
  });

  const minRange = document.getElementById("minRange");
  const maxRange = document.getElementById("maxRange");

  minRange.addEventListener("input", updateSlider);
  maxRange.addEventListener("input", updateSlider);

  document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", updateGenreSelection);
  });

  document
    .getElementById("keyword")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        updateKeywordSearch();
      }
    });

  document
    .getElementById("userInput")
    .addEventListener("input", function (event) {
      handleInputChange(event);
    });

  document
    .getElementById("userInput")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        updateArtistSearch();
      }
    });

  document
    .getElementById("searchIcon")
    .addEventListener("click", function (e) {
      updateArtistSearch();
    });
}

// Function to handle input changes
function handleInputChange(e) {
  let userData = document.getElementById("userInput").value; // User entered data
  let emptyArray = [];
  if (userData) {
    emptyArray = artists.filter((data) => {
      // Filtering array value and user characters to lowercase and return only those words which start with user entered chars
      return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      // Passing return data inside li tag
      return (data = "<li>" + data + "</li>");
    });
    document.getElementById("searchInput").classList.add("active"); // Show autocomplete box
    showSuggestions(emptyArray);
    let allList = resultBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      // Adding onclick function in all li tag
      allList[i].setAttribute("onclick", "select(this)");
    }
  } else {
    document.getElementById("searchInput").classList.remove("active"); // Hide autocomplete box
  }
}

// Function to select list item
function select(element) {
  let selectData = element.textContent;
  document.getElementById("userInput").value = selectData; // Passing the selected list data inside textfield
  document.getElementById("searchInput").classList.remove("active"); // Hide autocomplete box
}

// Function to show suggestions
function showSuggestions(list) {
  console.log(list);
  let listData;
  if (!list.length) {
    userValue = input.value;
    listData = "<li>" + userValue + "</li>";
  } else {
    listData = list.join("");
  }
  resultBox.innerHTML = listData;
}

function updateArtistSearch() {
  artist = document.getElementById("userInput").value;

  console.log(artist);

  updateDashboard(minRangeValue, maxRangeValue, genres, artist, keyword);
}

function updateKeywordSearch() {
  keyword = document.getElementById("keyword").value;

  console.log(keyword);

  updateDashboard(minRangeValue, maxRangeValue, genres, artist, keyword);
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

  updateDashboard(minRangeValue, maxRangeValue, genres, artist, keyword);
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
  updateDashboard(minRangeValue, maxRangeValue, genres, artist, keyword);
}

function updateDashboard(
  minRangeValue,
  maxRangeValue,
  checkedGenres,
  artist,
  keyword
) {
  // clean the data so that only musics from that artist are shown and contains the keyword
  updateVennDiagram(artist, checkedGenres, keyword);

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
      createBarchart(
        data,
        ".Barchart",
        minRangeValue,
        maxRangeValue,
        checkedGenres
      );
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
