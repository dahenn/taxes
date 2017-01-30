//http://bl.ocks.org/d3noob/6eb506b129f585ce5c8a
Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

var divwidth = parseInt(d3.select('#pctincome').style('width'));
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 40},
    width =  divwidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

// Define the axes
var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y).ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.pctile_round); })
    .y(function(d) { return y(d.tax_diff); });

// Adds the svg canvas
var svg = d3.select("#pctincome")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

var lineSvg = svg.append("g");

var focus = svg.append("g")
    .style("display", "none");

var info = svg.append("g").style('display', 'none')
    .attr('transform','translate(' + (width/8) + ',' + (height/8) + ')');

// Get the data
d3.csv("data/avgs.csv", function(error, data) {
    data.forEach(function(d) {
        d.pctile_round = +d.pctile_round;
        d.tax_diff = -d.tax_diff;
        d.inc_round = +d.inc_round;
        d.pct_tax_diff = +d.pct_tax_diff;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.pctile_round; }));
    y.domain([0, d3.max(data, function(d) { return d.tax_diff; })]);

    // Add the valueline path.
    lineSvg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append('text')
            .text('Income Percentile')
            .attr('x',width - 40)
            .attr('dy', '-0.5em');

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
            .text('Tax Cut ($)')
            .attr('y',10)
            .attr('transform', 'rotate(-90)')
            .attr('dy', '0.5em');

   // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "white")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    // append the y line
    focus.append("line")
        .attr("class", "y")
        .style("stroke", "white")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    // append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "white")
        .attr("r", 4);

    // place text
    info.append("text")
        .attr("class", "y1")
        .attr("dx", 8)
        .attr("dy", "-.5em");
    info.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "1em");
    info.append("text")
        .attr("class", "y3")
        .attr("dx", 8)
        .attr("dy", "2.5em");
    info.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "4em");

    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null);  info.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none");  info.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
		    i = x0.toFixed(0),
		    d0 = data[i - 1],
		    d1 = data[i],
            d2 = data[i + 1]
		    d = x0 - d0.pctile_round > d1.pctile_round - x0 ? d2 : d1;

		focus.select("circle.y")
		    .attr("transform",
		          "translate(" + x(d.pctile_round) + "," +
		                         y(d.tax_diff) + ")");

		info.select("text.y1").text('Income Percentile: ' + (d.pctile_round-1) + ' to ' + d.pctile_round);
		info.select("text.y2").text('Tax Cut: $' + d.tax_diff.formatMoney(0));
        info.select("text.y3").text('Average Income: $' + d.inc_round.formatMoney(0));
        var format = d3.format('.2');
        info.select("text.y4").text('Post Tax Income Increase: ' + format(d.pct_tax_diff*100) + "%");

		focus.select(".x")
		    .attr("transform",
		          "translate(" + x(d.pctile_round) + "," +
		                         y(d.tax_diff) + ")")
		               .attr("y2", height - y(d.tax_diff));

		focus.select(".y")
		    .attr("transform",
		          "translate(" + width * -1 + "," +
		                         y(d.tax_diff) + ")")
		               .attr("x2", width + width);
	}

});
