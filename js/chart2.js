/******************* PIE 1 *******************/

var piewidth = 275,
    pieheight = 275,
    pieradius = Math.min(piewidth, pieheight) / 2;

var piecolor = d3.scale.ordinal()
    .range(["#71ae72", "#315631"]);

var piearc = d3.svg.arc()
    .outerRadius(pieradius - 0)
    .innerRadius(0);

var pielabelArc = d3.svg.arc()
    .outerRadius(pieradius - 40)
    .innerRadius(pieradius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return -d.pct; });

var pie1svg = d3.select("#pie1").append("svg")
    .attr("width", piewidth)
    .attr("height", pieheight)
    .attr('style','margin-top:25px;')
  .append("g")
    .attr("transform", "translate(" + piewidth / 2 + "," + pieheight / 2 + ")");

d3.csv("data/payout50.csv", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
      d.payout=+d.payout;
      d.pct=+d.pct;
      d.perhh=+d.perhh;
  });

  var g = pie1svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", piearc)
      .style("fill", function(d) { return piecolor(d.data.payout); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + pielabelArc.centroid(d) +")"; })
      .attr("dy", ".35em")
      .attr('text-anchor','middle')
      .attr('class', function(d) { return (d.data.payout/1000000000).toFixed(0); })
      .text(function(d) { return (d.data.pct*-100).toFixed(1) + "%"; });

  d3.select("#p50").selectAll('span#amt')
    .data(data)
    .text(function(d) { return "$" + (d.payout/1000000000).toFixed(1) + "B"; });

  d3.select("#p50").selectAll('span#perhh')
    .data(data)
    .text(function(d) { return "$" + (d.perhh/1000).toFixed(1) + "K"; });

  d3.select("#p50").selectAll('span#pct')
    .data(data)
    .text(function(d) { return (-d.pct*100).toFixed(1) + "%"; });

    d3.select("#p50").select("#disp")
      .text((-data[0].pct/.50).toFixed(1) + "x");

});

/******************* PIE 2 *******************/

var pie2svg = d3.select("#pie2").append("svg")
    .attr("width", piewidth)
    .attr("height", pieheight)
    .attr('style','margin-top:25px;')
  .append("g")
    .attr("transform", "translate(" + piewidth / 2 + "," + pieheight / 2 + ")");

d3.csv("data/payout90.csv", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
      d.payout=+d.payout;
      d.pct=+d.pct;
      d.perhh=+d.perhh;
  });

  var g = pie2svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", piearc)
      .style("fill", function(d) { return piecolor(d.data.payout); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + pielabelArc.centroid(d) +")"; })
      .attr("dy", ".35em")
      .attr('text-anchor','middle')
      .attr('class', function(d) { return (d.data.payout/1000000000).toFixed(0); })
      .text(function(d) { return (d.data.pct*-100).toFixed(1) + "%"; });

  d3.select("#p90").selectAll('span#amt')
    .data(data)
    .text(function(d) { return "$" + (d.payout/1000000000).toFixed(1) + "B"; });

  d3.select("#p90").selectAll('span#perhh')
    .data(data)
    .text(function(d) { return "$" + (d.perhh/1000).toFixed(1) + "K"; });

  d3.select("#p90").selectAll('span#pct')
    .data(data)
    .text(function(d) { return (-d.pct*100).toFixed(1) + "%"; });

  d3.select("#p90").select("#disp")
    .text((-data[0].pct/.10).toFixed(1) + "x");

});

/******************* PIE 3 *******************/

var pie3svg = d3.select("#pie3").append("svg")
    .attr("width", piewidth)
    .attr("height", pieheight)
    .attr('style','margin-top:25px;')
  .append("g")
    .attr("transform", "translate(" + piewidth / 2 + "," + pieheight / 2 + ")");

d3.csv("data/payout99.csv", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
      d.payout=+d.payout;
      d.pct=+d.pct;
      d.perhh=+d.perhh;
  });

  var g = pie3svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", piearc)
      .style("fill", function(d) { return piecolor(d.data.payout); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + pielabelArc.centroid(d) +")"; })
      .attr("dy", ".35em")
      .attr('text-anchor','middle')
      .attr('class', function(d) { return (d.data.payout/1000000000).toFixed(0); })
      .text(function(d) { return (d.data.pct*-100).toFixed(1) + "%"; });

  d3.select("#p99").selectAll('span#amt')
    .data(data)
    .text(function(d) { return "$" + (d.payout/1000000000).toFixed(1) + "B"; });

  d3.select("#p99").selectAll('span#perhh')
    .data(data)
    .text(function(d) { return "$" + (d.perhh/1000).toFixed(1) + "K"; });

  d3.select("#p99").selectAll('span#pct')
    .data(data)
    .text(function(d) { return (-d.pct*100).toFixed(1) + "%"; });

    d3.select("#p99").select("#disp")
      .text((-data[0].pct/.01).toFixed(1) + "x");

});
