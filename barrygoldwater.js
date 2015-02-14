var width = 800,
    height = 600;

// width increase = move to right
// height increase = move to bottom
var projection = d3.geo.albersUsa()
    .scale(4000)
    .translate([width*1.4, height*0.10]);
    //.translate([width*3/4, height/2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var svg = d3.select("div.map").append("svg")
    .attr("width", width)
    .attr("height", height);



/*
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 2])
    .on("zoom", zoomed);
*/



// This is a hack.
// If running locally, change prefix to /
// Otherwise, keep a-shrubbery
//var prefix = "http://charlesreid1.github.io/a-shrubbery/";
var prefix = "/";

d3.json(prefix+"barrygoldwater.json", function(error, contours) {

    var contour = topojson.feature(contours, contours.objects.Elev_Contour);

    var onecontour = contour.features.filter(function(d) {
        return d.properties.CONTOURELE === 1840;
    });

    // http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object

    var scale = 1000;

    var center = d3.geo.centroid(contours);

    var path2 = d3.geo.path().projection(projection);

    var bounds = path2.bounds(contours);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    var offset  = [width/2 - (bounds[0][0] + bounds[1][0])/2,
                   height/2 - (bounds[0][1] + bounds[1][1])/2];

    //// new projection
    //projection2 = d3.geo.mercator().center(center)
    //        .scale(scale).translate(offset);
    //path2 = path2.projection(projection);


    // add a rectangle to see the bound of the svg
    svg.append("rect").attr('width', width).attr('height', height)
      .style('stroke', 'black').style('fill', 'none');


    //console.log("scale = "+scale);
    //console.log("hscale = "+hscale);
    //console.log("vscale = "+vscale);


        //.data(contour.features)
    svg.selectAll("path")
        .data(onecontour)
        .enter().append("path")
        .attr("d", path)
        .attr("class", function(d) { return "contour contour" + d.properties.CONTOURELE; })
        .style("stroke-width", "1")
        .style("stroke", "black")
        .style("fill", "red")

});

/*
function zoomed() {
    map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    contour.style("stroke-width", 0.5 / d3.event.scale);
}
*/
