
var width = 800,
    height = 600;

// 37.7, -122.4
// 
// http://bl.ocks.org/mbostock/4090848
//
var projection = d3.geo.albersUsa()
    .scale(1400)
    .translate([width*3/4, height/2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("cacommuterincome.json", function(error, ca) {

  console.log(ca);

  var subunits = topojson.feature(ca, ca.objects.collection);

  svg.selectAll(".subunit")
      .data(subunits.features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.properties.geoid; })
      .attr("d", path);



});


