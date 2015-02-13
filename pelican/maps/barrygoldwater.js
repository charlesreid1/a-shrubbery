
var width = 800,
    height = 600;

// 32.571952, -113.473564
// 
// http://bl.ocks.org/mbostock/4090848
//
// doesn't work:
//    .center([32.57, 113.47])
//    .center(["32.57", "-113.47"])
//

// http://bl.ocks.org/mbostock/4707858

//var projection = d3.geo.mercator()
var projection = d3.geo.albersUsa()
    .scale(1400)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(1);


var zoom = d3.behavior.zoom()
    .scaleExtent([1, 2])
    .on("zoom", zoomed);


// This is inserted as <body> is being constructed,
// so <svg> occurs wherever this .js file is called.
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

var map = svg.append("g");



// This is a hack.
// If running locally, change prefix to /
// Otherwise, keep a-shrubbery
//var prefix = "http://charlesreid1.github.io/a-shrubbery/";
var prefix = "/";

d3.json(prefix+"barrygoldwater.json", function(error, contours) {

    var contour = topojson.feature(contours, contours.objects.Elev_Contour);

    var b = path.bounds(contour),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    var shortcontours = contour.features.filter(function(d) {
        return d.properties.CONTOURELE<1400;
    });

    var onecontour = contour.features.filter(function(d) {
        return d.properties.CONTOURELE === 1840;
    });


    /*
    var b = path.bounds(onecontour);
    console.log(b);

    var b = path.bounds(onecontour),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    */

    projection.scale(1).translate([0, 0]);
    projection
        .scale(s)
        .translate(t);

    map.selectAll(".contour")
            .data(contours)
        .enter().append("path")
            .attr("class", "contour")
            .attr("class", function(d) { return "contour contour" + d.properties.CONTOURELE; })
            .attr("d", path);

    //svg.selectAll(".subunit")
    //    .data(subunits.features)
    //  .enter().append("path")
    //    .attr("class", function(d) { return "subunit subunit" + d.properties.geoid; })
    //    .attr("d", path);

});

function zoomed() {
    map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    contour.style("stroke-width", 0.5 / d3.event.scale);
}

