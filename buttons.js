// prefix defined in common.js

// create the map, assign to the map div, and set it's lat, long, and zoom level (12)
var m = L.map('map').setView([38, -118], 6);

// Add MapBox Tiles
// https://www.mapbox.com/developers/api/maps/
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(m);

var blue = ['rgb(241,238,246)','rgb(208,209,230)','rgb(166,189,219)','rgb(116,169,207)','rgb(54,144,192)','rgb(5,112,176)','rgb(3,78,123)'];
var red  = ['rgb(254,240,217)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(153,0,0)'];

function getBlue(d) {
    return blue[Math.floor(d*blue.length)];
}
function getRed(d) {
    return red[Math.floor(d*red.length)];
}

// f = feature, l = layer
function enhanceLayer(f,l){

    // add popup
    var out = [];
    if (f.properties){
        for(key in f.properties){
            out.push(key+": "+f.properties[key]);
        }
        l.bindPopup(out.join("<br />"));

        // http://leafletjs.com/reference.html#path-options
        l.setStyle({    
            fillColor: getRed(f.properties['derived_quantity']/10.0),
            fillOpacity: 0.8,
            stroke: false
        });
    }
}

d3.select("a.map-button-red")
    .on("mouseover",doMouseOver)
    .on("click", doRedClick);

d3.select("a.map-button-blue")
    .on("mouseover",doMouseOver)
    .on("click", doBlueClick);


var geoj = new L.geoJson.ajax(prefix+"carandom.geojson",{onEachFeature:enhanceLayer}).addTo(m);



function doMouseOver(f,l) {
    console.log("hello");
}


function doRedClick(f,l){
    console.log("hello");
    console.log(f.properties);
    if (f.properties) {
        l.setStyle({
            fillColor: getRed(f.properties['derived_quantity']/10.0),
            fillOpacity: 0.8,
            stroke: false
        });
    }
}


function doBlueClick(f,l){
    console.log("hello");
    console.log(f.properties);
    if (f.properties) {
        l.setStyle({
            fillColor: getBlue(f.properties['derived_quantity']/10.0),
            fillOpacity: 0.8,
            stroke: false
        });
    }
}
