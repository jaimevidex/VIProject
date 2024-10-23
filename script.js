const colorMap = {
  rock: "#f53b57", // Red
  pop: "#ffa801", // Orange
  rap: "#05c46b", // Green
  rb: "#0fbcf9", // Blue
  country: "#3c40c6", // Purple
};

let minRangeValue = 1960;
let maxRangeValue = 2021;
let genres = ["rock", "pop", "rap", "country", "rb"];
let artist = null;
let keyword = null;

// Get all the artists names from the csv file artist_search_table
let artists = [];
let keywords = [];

function initArtists() {
  return d3.csv("./data/artist_search_table.csv").then((data) => {
    data.forEach((d) => {
      artists.push(d.artist);
    });
  });
}

function initKeywords() {
  return d3.csv("./data/keyword_search_table.csv").then((data) => {
    data.forEach((d) => {
      keywords.push(d.keyword);
    });
  });
}

//function that receives a genre in a string and returns its color
function getColor(genre) {
  switch (genre) {
    case "rock":
      return colorMap.rock;
    case "pop":
      return colorMap.pop;
    case "rap":
      return colorMap.rap;
    case "country":
      return colorMap.country;
    case "rb":
      return colorMap.rb;
  }
}

function init() {
  // Initialize the arrays and wait for them to be filled to then do the rest of the code
  localStorage.clear();
  initArtists().then(() => {
    initKeywords().then(() => {
      d3.csv("./data/genre_popularity_time.csv").then((data) => {
        createBarchart(data, ".Barchart", minRangeValue, maxRangeValue, genres);
        createBubblechart(
          data,
          ".Bubblechart",
          minRangeValue,
          maxRangeValue,
          genres
        );
        RadarChart(
          colorMap,
          data,
          ".Radarchart",
          minRangeValue,
          maxRangeValue,
          genres
        );
      });
    });
  });
  /* 
  CREATE THE VENN DIAGRAM HERE WITH A DEFAULT ARTIST
  */
  d3.csv("./data/venn_table.csv").then((data) => {
    // filter the data to only send the data from the beatles
    data = data.filter((d) => d.artist === "Ariana Grande");
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
  minRange.addEventListener("mouseup", sliderChange);
  maxRange.addEventListener("mouseup", sliderChange);

  document.getElementById("selectAll").addEventListener("click", function (e) { 
    document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
      checkbox.checked = true;
    });
    updateGenreSelection();
  });

  document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", updateGenreSelection);
  });

  document
    .getElementById("userInput")
    .addEventListener("input", function (event) {
      handleInputChange(event);
    });

  document
    .getElementById("userInput")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        updateArtistSearch();
      }
    });

  document
    .getElementById("wordInput")
    .addEventListener("input", function (event) {
      handleKeywordInputSearchChange(event);
    });

  document
    .getElementById("wordInput")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        updateKeywordSearch();
      }
    });

  document.getElementById("searchIcon").addEventListener("click", function (e) {
    updateArtistSearch();
  });

  document.getElementById("searchKeywordIcon").addEventListener("click", function (e) {
    updateKeywordSearch();
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
    let allList = document.getElementById("resultBox").querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      // Adding onclick function in all li tag
      allList[i].setAttribute("onclick", "select(this)");
    }
  } else {
    document.getElementById("searchInput").classList.remove("active"); // Hide autocomplete box
  }
}

function handleKeywordInputSearchChange(e) {
  let userData = document.getElementById("wordInput").value; // User entered data
  let emptyArray = [];
  if (userData) {
    emptyArray = keywords.filter((data) => {
      // Filtering array value and user characters to lowercase and return only those words which start with user entered chars
      return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      // Passing return data inside li tag
      return (data = "<li>" + data + "</li>");
    });
    document.getElementById("keywordInput").classList.add("active"); // Show autocomplete box
    showKeywordSuggestions(emptyArray);
    console.log(emptyArray);
    let allList = document
      .getElementById("resultKeyword")
      .querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      // Adding onclick function in all li tag
      allList[i].setAttribute("onclick", "selectKeyword(this)");
    }
  } else {
    document.getElementById("keywordInput").classList.remove("active"); // Hide autocomplete box
  }
}

// Function to select list item
function select(element) {
  let selectData = element.textContent;
  document.getElementById("userInput").value = selectData; // Passing the selected list data inside textfield
  document.getElementById("searchInput").classList.remove("active"); // Hide autocomplete box
}

function selectKeyword(element) {
  let selectData = element.textContent;
  document.getElementById("wordInput").value = selectData; // Passing the selected list data inside textfield
  document.getElementById("keywordInput").classList.remove("active"); // Hide autocomplete box
}

// Function to show suggestions
function showSuggestions(list) {
  console.log(list);
  let listData;
  if (!list.length) {
    userValue = document.getElementById("userInput").value;
    listData = "<li>" + userValue + "</li>";
  } else {
    listData = list.join("");
  }
  document.getElementById("resultBox").innerHTML = listData;
}

function showKeywordSuggestions(list) {
  console.log(list);
  let listData;
  if (!list.length) {
    userValue = document.getElementById("wordInput").value;
    listData = "<li>" + userValue + "</li>";
  } else {
    listData = list.join("");
  }
  document.getElementById("resultKeyword").innerHTML = listData;
}

function updateArtistSearch() {
  artist = document.getElementById("userInput").value;
  // Check if the artist is in the list of artists comparing everything in lowercase
  if (!artists.some((a) => a.toLowerCase() === artist.toLowerCase())) {
    swal.fire(artist + " not found, make sure you typed the name correctly.");
    return;
  } else {
    artist = artists.find((a) => a.toLowerCase() === artist.toLowerCase());
  }

  console.log(artist);

  //get time range and genre from the artist data file
  d3.csv("./data/artist_search_table.csv").then((data) => {
    data = data.filter((d) => d.artist === artist);
    time_interval = data[0].time_interval.replace(/['"(),]/g, "").split(" ");
    minRangeValue = parseInt(time_interval[0]);
    maxRangeValue = parseInt(time_interval[1]);
    document.getElementById("minRange").value = minRangeValue;
    document.getElementById("maxRange").value = maxRangeValue;
    document.getElementById("minOutput").textContent = minRangeValue;
    document.getElementById("maxOutput").textContent = maxRangeValue;
    //select the genres of the artist
    genres = [data[0].genre];
    document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
      checkbox.checked = genres.includes(checkbox.value);
    });
    console.log(genres);
    updateDashboard(minRangeValue, maxRangeValue, genres, artist, keyword);
  });
}

function updateKeywordSearch() {
  keyword = document.getElementById("wordInput").value;

  console.log(keyword);

   //get time range and genre from the keyword data file
   d3.csv("./data/keyword_search_table.csv").then((data) => {
    data = data.filter((d) => d.keyword === keyword);
    time_interval = data[0].time_interval.replace(/['"(),]/g, "").split(" ");
    minRangeValue = Math.max(parseInt(time_interval[0]), 1962);
    maxRangeValue = Math.min(parseInt(time_interval[1]), 2021);
    document.getElementById("minRange").value = minRangeValue;
    document.getElementById("maxRange").value = maxRangeValue;
    document.getElementById("minOutput").textContent = minRangeValue;
    document.getElementById("maxOutput").textContent = maxRangeValue;
    //select the genres of the keyword from string to array
    const genresString = data[0].genres.replace(/'/g, '"');
    genres = JSON.parse(genresString);
    document.querySelectorAll(".genre-checkbox").forEach((checkbox) => {
      checkbox.checked = genres.includes(checkbox.value);
    });
    console.log(genres);
    updateDashboard(minRangeValue, maxRangeValue, genres, artist, keyword);
  });

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
}

function sliderChange(event) {
  const minRange = document.getElementById("minRange");
  const maxRange = document.getElementById("maxRange");

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
  keyword,
  wasByClick
) {
  // clean the data so that only musics from that artist are shown and contains the keyword
  if (artist !== localStorage.getItem("artist") && artist !== undefined && artist !== null) {
    updateVennDiagram(artist, getColor(checkedGenres[0]));
  }

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
        data,wasByClick
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
    updateLinechart(minRangeValue, maxRangeValue, checkedGenres[0], false);
  }
  updateRadarChart(
    minRangeValue,
    maxRangeValue,
    checkedGenres
  );
}
