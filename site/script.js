var margin = { top: 20, right: 80, bottom: 30, left: 80 },
  width = 1400 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
var brushHeight = 50;

var globalData = [],
  filteredData = [],
  activeGenre = "";

// setup x
var xValue = function(d) {
    return d.year;
  }, // data -> value
  xScale = d3.scale.linear().range([0, width]), // value -> display
  xMap = function(d) {
    return xScale(xValue(d));
  }, // data -> display
  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.format("d"));

// setup y
var yValue = function(d) {
    return d.rating;
  }, // data -> value
  yScale = d3.scale.linear().range([height, 0]), // value -> display
  yMap = function(d) {
    return yScale(yValue(d));
  }, // data -> display
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("left");

// x axis brush
var xValueBrush = function(d) {
    return d.year;
  }, // data -> value
  xScaleBrush = d3.scale.linear().range([0, width]), // value -> display
  xMapBrush = function(d) {
    return xScaleBrush(xValueBrush(d));
  }, // data -> display
  xAxisBrush = d3.svg
    .axis()
    .scale(xScaleBrush)
    .orient("bottom")
    .tickFormat(d3.format("d"));
// setup y brush
var yValueBrush = function(d) {
    return d.rating;
  }, // data -> value
  yScaleBrush = d3.scale.linear().range([brushHeight, 0]), // value -> display
  yMapBrush = function(d) {
    return yScaleBrush(yValue(d));
  }, // data -> display
  yAxisBrush = d3.svg
    .axis()
    .scale(yScaleBrush)
    .orient("left");

var brushScale = d3.scale.linear().range([0, width]),
  brushAxis = d3.svg
    .axis()
    .scale(xScaleBrush)
    .orient("top")
    .tickFormat(d3.format("d"));
var brush = d3.svg
  .brush()
  .x(xScaleBrush)
  .on("brushend", brushed);

// custom colors
function customColors(n) {
  var colors = [
    "#9e9e9e",
    "#d84315",
    "#ff5722",
    "#ff9800",
    "#ffc107",
    "#ffeb3b"
  ];
  return colors[n % colors.length];
}
// setup fill color
var cValue = function(d) {
    return d.genre.split(",")[0];
  },
  color = d3.scale.category20();

// add the graph canvas to the body of the webpage
var svg = d3
  .select("#scatter-graph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + brushHeight * 2)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// x and y axis domains
xScale.domain([1920, 2020]);
yScale.domain([7, 10]);
yScaleBrush.domain([7, 10]);
xScaleBrush.domain([1920, 2020]);
// x-axis
svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Release year");
// y-axis
svg
  .append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("IMDb rating");
var brushGroup = svg
  .append("g")
  .attr("class", "brush-group")
  .attr("transform", "translate(0," + (height + 20) + ")");
brushGroup
  .append("g")
  .attr("class", "x-brush-axis")
  .attr("transform", "translate(0," + (brushHeight + 20) + ")")
  .attr("height", brushHeight)
  .call(brushAxis)
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end");
var brushElement = brushGroup.append("g");

brushElement
  .call(brush)
  .selectAll("rect")
  .attr("height", brushHeight);

// load data
d3.json("data.json", function(error, data) {
  globalData = [...data];
  filteredData = [...data];

  update(data);

  // draw legend
  drawLegend();
});

var dialogWrapper = document.querySelector(".dialog__wrapper");
var title = document.querySelector(".dialog__title");
var desc = document.querySelector(".dialog__description");
var poster = document.querySelector(".dialog__image img");
var imdb = document.querySelector(".dialog__imdb span");
var writers = document.querySelector(".dialog__writers span");
var actors = document.querySelector(".dialog__actors span");
var awards = document.querySelector(".dialog__awards span");
var genre = document.querySelector(".dialog__genre span");
var runtime = document.querySelector(".dialog__runtime span");

document.querySelector(".show-all").addEventListener("click", () => {
  filteredData = [...globalData];
  activeGenre = "";
  document.querySelector(".search").value = "";
  brushElement.call(brush.clear());

  update(globalData);
});

document
  .querySelector(".search")
  .addEventListener("keyup", filterAndUpdateData);

dialogWrapper.addEventListener("click", e => {
  if (e.target.className === "dialog__wrapper") {
    dialogWrapper.classList.add("hidden");
  }
});

function drawLegend() {
  var legend = svg
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });
  // draw legend colored rectangles
  legend
    .append("rect")
    .attr("x", width + 50)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color)
    .on("click", filterByGenre);
  // draw legend text
  legend
    .append("text")
    .attr("x", width + 34)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });
}

function OnMovieClick(d) {
  var url = "http://www.omdbapi.com/?apikey=94499cbb&t=" + d.title;
  d3.json(url, d => {
    title.textContent = `${d.Title} (${d.Year})`;
    desc.textContent = d.Plot;
    imdb.textContent = `${d.imdbRating} (${d.imdbVotes} votes)`;
    poster.setAttribute("src", d.Poster);

    writers.textContent = d.Writer;
    actors.textContent = d.Actors;
    awards.textContent = d.Awards;
    genre.textContent = d.Genre;
    runtime.textContent = d.Runtime;

    dialogWrapper.classList.remove("hidden");
  });
}

function brushed() {
  filterAndUpdateData();
}

function filterByGenre(genre) {
  activeGenre = genre;
  filterAndUpdateData(genre);
}

function filterAndUpdateData() {
  let temp = [...globalData];
  if (activeGenre !== "") {
    temp = temp.filter(v => v.genre.split(",")[0] === activeGenre);
  }
  var text = document.querySelector(".search").value;
  if (text) {
    temp = temp.filter(v => v.title.toLowerCase().includes(text.toLowerCase()));
  }
  filteredData = [...temp];
  var data = filteredData;
  if (!brush.empty()) {
    data = filteredData.filter(
      v => v.year > brush.extent()[0] && v.year < brush.extent()[1]
    );
  }
  update(data);
}

function update(data, yDomain, yMapCustom) {
  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue) - 2, d3.max(data, xValue) + 2]);

  yScale.domain([d3.min(data, yValue) - 0.2, 9.5]);

  // x-axis
  svg
    .select(".x")
    .transition()
    .call(xAxis);

  // y-axis
  svg
    .select(".y")
    .transition()
    .call(yAxis);

  var brushDots = brushGroup
    .selectAll(".brush-dot")
    .data(filteredData, d => d.id);

  brushDots.exit().remove();
  brushDots
    .enter()
    .append("circle")
    .attr("class", "brush-dot")
    .attr("r", 0);

  brushDots
    .transition()
    .duration(500)
    .attr("r", 2)
    .attr("cx", xMapBrush)
    .attr("cy", yMapBrush)
    .style("fill", function(d) {
      return color(cValue(d));
    });

  // draw dots
  dots = svg.selectAll(".dot").data(data, d => d.id);

  dots.exit().remove();

  dots
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 0);

  dots
    .transition()
    .duration(500)
    .attr("r", 6)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .style("fill", function(d) {
      return color(cValue(d));
    });

  dots
    .on("mouseover", function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip
        .html(d.title + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 0);
    })
    .on("click", OnMovieClick);
}
