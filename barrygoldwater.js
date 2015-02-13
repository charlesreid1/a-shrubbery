

var width = 800,
    height = 600;

// 32.571952, -113.473564
// 
// http://bl.ocks.org/mbostock/4090848
//
var projection = d3.geo.albersUsa()
    .center([32.57, -113.47])
    .scale(1400)
    .translate([width*3/4, height/2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(1);

// This is inserted as <body> is being constructed,
// so <svg> occurs wherever this .js file is called.
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// This is a hack.
// If running locally, change prefix to /
// Otherwise, keep a-shrubbery
var prefix = "http://charlesreid1.github.io/a-shrubbery/";
//var prefix = "/";

d3.json(prefix+"barrygoldwater.json", function(error, ca) {

  //console.log(ca);
  var subunits = topojson.feature(ca, ca.objects.d3basicmap);

  svg.selectAll(".subunit")
      .data(subunits.features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit subunit" + d.properties.geoid; })
      .attr("d", path);



});

