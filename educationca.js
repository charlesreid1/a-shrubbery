// prefix defined in common.js

////////////////////////////////////
// Take care of county map first:
//
var zoomOrig = 6;
var map_county = L.map('education_county').setView([37.7, -119.5], zoomOrig);

var basemapViewer = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 18,
    attribution: "Mapbox"
}).addTo(map_county);



// counties in california
//rooturl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US37";
var rooturl = prefix + "educationca.geo.json"

// initialize empty GeoJson
var geoj = L.geoJson(false, {
        onEachFeature: onEachCounty
    }).addTo(map_county);

$.ajax({
    type: "GET",
    url: rooturl,
    success: function (data) {
        geoj.addData(data);
    }
});




////////////////////////////////
// Colors


// Random colors for political maps
var randomColors = d3.scale.category20c();


//// Variable-interval color scale
//// https://gist.github.com/mbostock/5144735
//var variableC = d3.scale.threshold()
//        .domain([30, 60, 120, 360])
//        .range(["#ffffcc","#c2e699","#78c679","#31a354","#006837"]);

// Constant-interval color scale
// http://bl.ocks.org/mbostock/4060606
//var constantC = d3.scale.threshold()
//        .domain([1,4])
//        .range(["#ffffcc","#c2e699","#78c679","#31a354","#006837"]);

colorbrewer = ['rgb(255,255,217)',
               'rgb(237,248,177)',
               'rgb(199,233,180)',
               'rgb(127,205,187)',
               'rgb(65,182,196)',
               'rgb(29,145,192)',
               'rgb(34,94,168)',
               'rgb(37,52,148)',
               'rgb(8,29,88)'];

var stateMeanEducationColor = d3.scale.quantize()
        .domain([1.5,3.5])
        .range(colorbrewer);

var tractMeanEducationColor = d3.scale.quantize()
        .domain([1.5,3.5])
        .range(colorbrewer);


///////////////////////////////



var myFillOpacity = 0.40;
var myThickFillOpacity = 0.90;




function onEachCounty(f, l) {
    if (f.properties) {
        l.on({
            click: doClick,
            mouseover: doMouseOver,
            mouseout: doMouseOut
            /*
            These are defined below...
            */
        });
        l.setStyle({  
            /*fillColor: randomColors( Math.round(Math.random()*15-1) ), */
            fillColor: stateMeanEducationColor(f.properties['Total_Ed_Mean']),
            fillOpacity: myFillOpacity,
            stroke: true,
            color: '#222',
            weight: 1
        });

        //var out = [];
        //for(key in f.properties){
        //    out.push(key+": "+f.properties[key]);
        //}
        //l.bindPopup(out.join("<br />"));
    }
}



////////////////////////////////////
// Take care of census map next:
//

var map_census = L.map('education_census').setView([37.7, -119.5], 7); 

var basemapViewer2 = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 18,
    attribution: "Mapbox"
}).addTo(map_census);




////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//
// change mouse click behavior of county map
//

function doMouseOver() {
    this.bringToFront();
    this.setStyle({
        weight:3,
        opacity: 1
    });
}

function doMouseOut() {
    this.bringToBack();
    this.setStyle({
        weight:1,
        opacity:0.8
    });
}

function doClick() {

    var county = this.feature.properties.name;

    var $tooltip = $('.county');
    $tooltip.text("County: "+county).show();



    red = '#4099FF';

    these_layer_ids = Object.keys(this._layers);



    // First, make sure no counties are red.
    // Restore any previously red counties
    // to their original color.
    geoj.eachLayer(function(layer) {

        // get leaflet ids for every shape in this county's layer
        those_layer_ids = Object.keys(layer._layers);

        // for each shape making up this county,
        those_layer_ids.forEach( function(that_layer_id) {

            var that_layer = layer['_layers'][that_layer_id]
            var options = that_layer['options'];
            
            // Check if county is alrady red. 
            // If so, make it un-red.
            if(options['fillColor']){
                // Get the county's current color.
                orig_fillColor = options['fillColor'];
                if(options['fillColor']===red) {
                    that_layer.setStyle({
                            'fillColor'   : options['originalFillColor'],
                            'fillOpacity' : myFillOpacity
                        });
                }
            }
        });
    });



    // Now make the county the user clicked red.
    // Some counties have multiple pieces,
    // so we need to use var these_layer_ids
    geoj.eachLayer(function(layer) {

        those_layer_ids = Object.keys(layer._layers);
        
        if( layer['_options'] ){

            these_layer_ids.forEach( function(this_layer_id) {

                those_layer_ids.forEach( function(that_layer_id) {

                    //console.log("this_layer_id = "+this_layer_id);
                    //console.log("that_layer_id = "+that_layer_id);

                    // these_layer_ids usually has one element,
                    // unless a county has two non-continguous parts.
                    //
                    if( this_layer_id==that_layer_id ) {

                        var that_layer = layer['_layers'][that_layer_id]
                        var options = that_layer['options'];

                        if(options['fillColor']){

                            // Get the county's current color.
                            orig_fillColor = options['fillColor'];

                            // Check if county is already red.
                            // If not, make it red.
                            if( orig_fillColor===red) {
                                var a=0;

                            } else {
                                // set style to red 
                                that_layer.setStyle({
                                    'fillColor' : red,
                                    'fillOpacity' : myThickFillOpacity,
                                    'originalFillColor' : orig_fillColor
                                });
                            }
                        }

                    } 
                });
            });
        }
    });



    // Now add census tracts for this county to the census tract map.
    //
    // Do this by grabbing the geo_id for the county,
    // and form that into a Census Reporter API URL.

    var geo_id = this.feature.properties.geoid;

    //censusurl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|"+geo_id;
    var censusurl = prefix + "educationca" + geo_id + ".geo.json";


    // initialize empty GeoJson
    var census_geoj = L.geoJson(false, {
            onEachFeature: onEachCensusFeature
        }).addTo(map_census);

    // Get the bounds for the census tract geometries.
    // Center and zoom the map.
    $.ajax({
        type: "GET",
        url: censusurl,
        success: function (data) {

            // remove the previous census tracts layer here
            //
            // do this by getting layers and removing them
            map_census.eachLayer(function(layer){
                if(layer._tiles) {
                    var a = 0;
                } else {
                    // this also removes census_geoj, 
                    // so we have to re-add it...
                    map_census.removeLayer(layer);
                }
            });

            census_geoj.addTo(map_census);
            census_geoj.addData(data);
            var bounds = census_geoj.getBounds();
            //map_census.panInsideBounds(bounds);
            //map_census.setZoom( map_census.getBoundsZoom(bounds) );
            map_census.fitBounds(bounds,animate=true);


        }
    });

    // Right here is the wrong place to use the 
    // Ajax data to set the map bounds. 
    //
    // Ajax is asynchronous - so when we get to 
    // this point in the script, the Ajax hasn't 
    // been loaded yet. 
    //
    // It took me a long while to figure that out.


}


function onEachCensusFeature(f, l) {
    if (f.properties) {
        /*
        l.on({
            click: doClick,
            mouseover: doMouseOver,
            mouseout: doMouseOut
        });
        */
        l.setStyle({  
            /*fillColor: countyColors( Math.round(Math.random()*15-1) ), */
            fillColor: tractMeanEducationColor(f.properties['Total_Ed_Mean']),
            fillOpacity: 0.50,
            stroke: false,
            color: '#222',
            weight: 1
        });
        //var out = [];
        //for(key in f.properties){
        //    out.push(key+": "+f.properties[key]);
        //}
        //l.bindPopup(out.join("<br />"));
    }
}


/////////////////////////////////////////////////////////

width = 300;

height = 100;

/// //var z = d3.scale.linear().domain(d3.range(0,1,0.1)).range(d3.range(0,1,0.1));
/// var z = d3.scale.linear().domain([0,1]);
/// console.log(z.domain()[0]);
/// console.log(z.domain()[1]);
/// console.log(z.domain()[3]);
/// console.log(z.domain()[9]);
//

state_dom0 = stateMeanEducationColor.domain()[0];
state_dom1 = stateMeanEducationColor.domain()[1];
state_step = (state_dom1 - state_dom0)/(stateMeanEducationColor.range().length);
stateMeanEducationColorDomain = d3.range( state_dom0, state_dom1+state_step, state_step );


// A position encoding for the key only.
var xkey = d3.scale.linear()
        .domain([1.5,3.5])
        .range([0,240]);

var xAxis = d3.svg.axis()
    .scale(xkey)
    .orient("bottom")
    .tickSize(13)
    .tickValues(stateMeanEducationColorDomain);

var svg = d3.select("div#education_county_scale").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(10,60)");

/*
domain is input
range is output
domain input... 
range output...
 */

g.selectAll("rect")
    .data(stateMeanEducationColor.range().map(function(d, i) {
      return {
            x0: i ? xkey(stateMeanEducationColorDomain[i]) : xkey.range()[0],
            x1: i < stateMeanEducationColorDomain.length ? xkey(stateMeanEducationColorDomain[i+1]) : xkey.range()[1],
            z: d
      };

    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return d.x0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .style("fill", function(d) { return d.z; });

g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", -6)
    .text("Mean Education Level");
