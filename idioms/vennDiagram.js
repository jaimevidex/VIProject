let isVendiagram = null;
let genre3 = null;

function createVennDiagram(data, containerId) {
  localStorage.setItem("artist", data[0].artist);
  // Extract the keywords from the data
  const set1 = JSON.parse(data[0].artist_keywords).slice(0, 5);
  const set2 = JSON.parse(data[0].genre_keywords).slice(0, 5);
  const genre = data[0].genre;

  // Calculate the unique and common values between the two sets
  const set1Unique = set1.filter((d) => !set2.includes(d)); // Unique to set 1
  const set2Unique = set2.filter((d) => !set1.includes(d)); // Unique to set 2
  const common = set1.filter((d) => set2.includes(d)); // Common between both

  // Set up SVG dimensions
  const width = (window.innerWidth - 370) / 2;
  const height = (window.innerHeight - 50 - 164) / 2;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  // Append chart title
  d3.select(containerId)
    .append("h3")
    .style("margin-left", `${margin.left}px`)
    .style("margin-bottom", "-30px")
    .style("font-size", "24px")
    .style("font-weight", "500")
    .style("transform", "translate(0, 20px)") //translate up 20px
    .text("Artists and Genres Keywords");

  // Create the SVG container
  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${width / 2},${(height+100) / 2}) scale(1.4)`);


  // Draw the circles for the Venn diagram with overlap
  const circle1 = svg
    .append("circle")
    .attr("cx", -60) // Adjust position for overlap
    .attr("cy", 0)
    .attr("r", 0) // Start with radius 0
    .attr("fill", "#d2dae2")
    .attr("opacity", 0.5)
    .transition() // Add transition
    .duration(1000) // Duration of 1 second
    .attr("r", 100); // Animate radius to 100

  const circle2 = svg
    .append("circle")
    .attr("cx", 60) // Adjust position for overlap
    .attr("cy", 0)
    .attr("r", 0) // Start with radius 0
    .attr("fill", "#d2dae2")
    .attr("opacity", 0.5)
    .transition() // Add transition
    .duration(1000) // Duration of 1 second
    .attr("r", 100);

  // Add the artist's name near the left circle
  svg
    .append("text")
    .attr("x", 0) // Adjust the x-position to the left of the first circle
    .attr("y", 0) // Align vertically with the center of the first circle
    .attr("text-anchor", "middle")
    .text("Search for an Artist!") // Artist's name from the data
    .attr("font-size", "16px")
    .attr("font-weight", "bold");  
}

function updateVennDiagram(artist, color) {
  localStorage.setItem("artist", artist);
  artistKeywords = [];
  genreKeywords = [];
  genre = "";

  // Get the data for the Venn diagram
  d3.csv("data/venn_table.csv").then((data) => {
    // Filter the data for the selected artist match in lowercase
    const artistData = data.filter(
      (d) => d.artist.toLowerCase() === artist.toLowerCase()
    );

    // Extract the keywords pass them to a literal array
    artistKeywords = JSON.parse(artistData[0].artist_keywords).slice(0, 5);

    genre = artistData[0].genre;

    // Extract the keywords for the selected genres
    genreKeywords = JSON.parse(artistData[0].genre_keywords).slice(0, Math.min(5, artistData[0].genre_keywords.length));

    // Update the Venn diagram with the new data
    const data1 = [{ keywords: artistKeywords, keywords1: genreKeywords }];

    // Extract the keywords from the data
    const set1 = data1[0].keywords;
    const set2 = data1[0].keywords1;

    // Calculate the unique and common values between the two sets
    const set1Unique = set1.filter((d) => !set2.includes(d)); // Unique to set 1
    const set2Unique = set2.filter((d) => !set1.includes(d)); // Unique to set 2
    const common = set1.filter((d) => set2.includes(d)); // Common between both

    // Calculate the maximum height required for the text elements
    const maxTextHeight =
      Math.max(set1Unique.length, set2Unique.length, common.length) * 45 + 40;

    // Set the radius of the circles based on the maximum text height
    const radius = maxTextHeight / 2;

    // Set up SVG dimensions
    const width = (window.innerWidth - 370) / 2;
    const height = (window.innerHeight - 50 - 164) / 2;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Clean circles and texts
    d3.select(".Venndiagram").select("svg").selectAll("circle").remove();
    d3.select(".Venndiagram").select("svg").selectAll("text").remove();

    d3.select(".Venndiagram")
      .select("h3")
      .text("Artists and Genres Keywords");

    // Select the existing SVG element
    const svg = d3
      .select(".Venndiagram")
      .select("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .append("g")
      .attr("transform", `translate(${width / 2},${(height+100) / 2}), scale(1.4)`);

    // clean old title
    d3.select(".Venndiagram").select("h3").text("");

    d3.select(".Venndiagram")
      .select("h3")
      .style("margin-left", `${margin.left}px`)
      .style("margin-bottom", "-30px")
      .style("font-size", "24px")
      .style("transform", "translate(0, 20px)") //translate up 20px
      .style("font-weight", "500")
      .text("Comparing " + artist + " and other " + genre + " artists");

    const circle1 = svg
      .append("circle")
      .attr("cx", -60) // Adjust position for overlap
      .attr("cy", 0)
      .attr("r", 0) // Start with radius 0
      .attr("fill", "#d2dae2")
      .attr("opacity", 0.5)
      .transition() // Add transition
      .duration(1000) // Duration of 1 second
      .attr("r", 100) // Animate radius to 100
      .on("end", function () {
        // Ensure the rest of the code runs after the transition
        d3.select(this)
          .on("mouseover", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 110)
              .attr("cx", -70)
              .attr("cursor", "pointer")
              .attr("opacity", 1);
          })
          .on("mouseleave", function () {
            d3.select(this)
              .transition()
              .duration(300)
              .attr("r", 100)
              .attr("cx", -60)
              .attr("opacity", 0.5);
          })
          .on("click", function () {
            // Join the keywords array into a nicely formatted string with line breaks
            const formattedKeywords = JSON.parse(
              artistData[0].artist_keywords
            ).join(",\n");

            // Display the alert with formatted keywords
            swal.fire({
              title: "All the Keywords",
              text: formattedKeywords,
              icon: "question",
            });
          });
      });

    
    const circle2 = svg
      .append("circle")
      .attr("cx", 60) // Adjust position for overlap
      .attr("cy", 0)
      .attr("r", 0) // Start with radius 0
      .attr("fill", color)
      .attr("opacity", 0.5)
      .transition() // Add transition
      .duration(1000) // Duration of 1 second
      .attr("r", 100) // Animate radius to 100
      .on("end", function () {
        // Ensure the rest of the code runs after the transition
        d3.select(this)
          .on("mouseover", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 110)
              .attr("cx", 70)
              .attr("cursor", "pointer")
              .attr("opacity", 1);
          })
          .on("mouseleave", function () {
            d3.select(this)
              .transition()
              .duration(300)
              .attr("r", 100)
              .attr("cx", 60)
              .attr("opacity", 0.5);
          })
          .on("click", function () {
            // Join the keywords array into a nicely formatted string with line breaks
            const formattedKeywords = JSON.parse(
              artistData[0].genre_keywords
            ).join(",\n");

            // Display the alert with formatted keywords
            swal.fire({
              title: "All the Keywords",
              text: formattedKeywords,
              icon: "question",
            });
          });
      });

    // Calculate the starting y position for centering the text
    const startY1 = -((set1Unique.length - 1) * 35) / 2;
    const startY2 = -((set2Unique.length - 1) * 35) / 2;
    const startYCommon = -((common.length - 1) * 25) / 2;

    // Add the artist's name near the left circle
    svg
      .append("text")
      .attr("class", "artist-name")
      .attr("x", -80) // Adjust the x-position to the left of the first circle
      .attr("y", -110) // Align vertically with the center of the first circle
      .attr("text-anchor", "middle")
      .text(artist) // Artist's name from the data
      .attr("font-size", "14px")
      .attr("font-weight", "bold");

    // Add the artist's name near the left circle
    svg
      .append("text")
      .attr("x", 80) // Adjust the x-position to the left of the first circle
      .attr("y", 120) // Align vertically with the center of the first circle
      .attr("text-anchor", "middle")
      .text(`Other ${genre} artists`) // Artist's name from the data
      .attr("font-size", "14px")
      .attr("font-weight", "bold");

    // Add text for the unique values in the first circle
    svg
      .selectAll(".set1-text")
      .data(set1Unique)
      .enter()
      .append("text")
      .attr("x", -70) // Position in the first circle
      .attr("y", (d, i) => startY1 + i * 35) // Distribute text vertically
      .attr("text-anchor", "middle")
      .style("font-weight", "600")
      .text((d) => d)
      .attr("font-size", "12px");

    // Add text for the unique values in the second circle
    svg
      .selectAll(".set2-text")
      .data(set2Unique)
      .enter()
      .append("text")
      .attr("x", 70) // Position in the second circle
      .attr("y", (d, i) => startY2 + i * 35) // Distribute text vertically
      .attr("text-anchor", "middle")
      .style("font-weight", "600")
      .text((d) => d)
      .attr("font-size", "12px");

    // Add text for the common values in the overlapping area
    svg
      .selectAll(".common-text")
      .data(common)
      .enter()
      .append("text")
      .attr("x", 0) // Position in the center
      .attr("y", (d, i) => startYCommon + i * 25) // Distribute text vertically
      .attr("text-anchor", "middle")
      .style("font-weight", "600")
      .text((d) => d)
      .attr("font-size", "12px");
  });
}
