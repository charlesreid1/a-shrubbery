var width = 800,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(800)
    .translate([width*3/4, height/2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var svg = d3.select("div.map").append("svg")
    .attr("width", width)
    .attr("height", height);


// This is a hack.
// If running locally, change prefix to /
// Otherwise, keep a-shrubbery
var prefix = "http://charlesreid1.github.io/a-shrubbery/";
//var prefix = "/";

d3.json(prefix+"d3basicmap.json", function(error, ca) {

    var subunits = topojson.feature(ca, ca.objects.d3basicmap);

    var b = path.bounds(subunits),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];



    // http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object

    var center = d3.geo.centroid(ca);

    var path2 = d3.geo.path().projection(projection);

    var bounds = path2.bounds(ca);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
        height - (bounds[0][1] + bounds[1][1])/2];

    // new projection
    projection2 = d3.geo.mercator().center(center)
            .scale(scale).translate(offset);
    path2 = path2.projection(projection);



    // add a rectangle to see the bound of the svg
    svg.append("rect").attr('width', width).attr('height', height)
      .style('stroke', 'black').style('fill', 'none');

    svg.selectAll("path")
        .data(subunits.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", function(d) { return "subunit subunit" + d.properties.geoid; })
        .style("stroke-width", "1")
        .style("stroke", "black")
    //  .style("fill", "red")

});

