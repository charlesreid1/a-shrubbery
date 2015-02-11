//// pass variable from Jinja to Javascript
//var jinjaData = $('#jinja-site-url');
//var SITEURL = jinjaData[0]['dataset']['siteurl'];

// create the map, assign to the map div, and set it's lat, long, and zoom level (12)
var m = L.map('map').setView([38, -118], 6);

// Add MapBox Tiles
// https://www.mapbox.com/developers/api/maps/
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(m);



function getColor(d) {
    // d should be between 0 and 1
    // 
    // colorbrewer will dump out color scales as js arrays,
    // so it's easy to copy-and-paste here.

    //// 6 scale blues
    //var colors = ['rgb(239,243,255)','rgb(198,219,239)','rgb(158,202,225)','rgb(107,174,214)','rgb(49,130,189)','rgb(8,81,156)'];

    // 9 scale OrRd
    var colors = ['rgb(255,247,236)','rgb(254,232,200)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(179,0,0)','rgb(127,0,0)']

    //// 9 scale PuBuGn
    //var colors = ['rgb(255,247,251)','rgb(236,226,240)','rgb(208,209,230)','rgb(166,189,219)','rgb(103,169,207)','rgb(54,144,192)','rgb(2,129,138)','rgb(1,108,89)','rgb(1,70,54)']

    return colors[Math.round(d*colors.length)];
}



// f = feature, l = layer
function enhanceLayer(f,l){

    var out = [];
    if (f.properties){

        //// -----------
        //// add popup
        //for(key in f.properties){
        //    out.push(key+": "+f.properties[key]);
        //}
        //l.bindPopup(out.join("<br />"));

        //console.log(f.properties.A_Below100PovLn_DroveAlone);

        // -----------
        // set style based on property
        //
        // http://leafletjs.com/reference.html#path-options
        //
        l.setStyle({    
            fillColor: getColor(f.properties['A_Below100PovLn_DroveAlone_CountyPct']),
            fillOpacity: 0.75,
            stroke: false
        });

    }

}

// "/"+SITEURL+
var prefix = "http://charlesreid1.github.io/a-shrubbery/";
var geoj = new L.geoJson.ajax(prefix+"cacommuterincome.geojson",{onEachFeature:enhanceLayer}).addTo(m);

