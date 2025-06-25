const width = 800;
const height = 500;
const padding = 60;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(data => {
  // Parse time format
  const parseTime = d3.timeParse("%M:%S");

  data.forEach(d => {
    d.Place = +d.Place;
    d.Seconds = +d.Seconds;
    d.Time = parseTime(d.Time);
    d.Year = +d.Year;
  });

  drawChart(data);
});
function drawChart(data) {
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
      .range([padding, width - padding]);
  
    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Time))
      .range([padding, height - padding]);
  
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);
  
    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);
      const tooltip = d3.select("#tooltip");

  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 6)
    .attr("fill", d => d.Doping ? "red" : "blue")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time.toISOString())
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 0.9)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`)
        .attr("data-year", d.Year)
        .html(`${d.Name} (${d.Nationality})<br>
               Year: ${d.Year}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>
               ${d.Doping}`)
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
}
