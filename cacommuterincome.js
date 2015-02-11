//// pass variable from Jinja to Javascript
//var jinjaData = $('#jinja-site-url');
//var SITEURL = jinjaData[0]['dataset']['siteurl'];



key1 = 'A_Below100PovLn_PublicTrans_CountyPct'
//key2 = 'B_Btwn100_149PovLn_PublicTrans_CountyPct'
key3 = 'C_Above150PovLn_PublicTrans_CountyPct'



// create the map, assign to the map div, and set it's lat, long, and zoom level (12)
var m1 = L.map('map1').setView([37.7, -122.4], 6);
//var m2 = L.map('map2').setView([37.7, -122.4], 6);
var m3 = L.map('map3').setView([37.7, -122.4], 6);

// Add MapBox Tiles
// https://www.mapbox.com/developers/api/maps/
tl1 = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
});
tl1.addTo(m1);

//tl.addTo(m2);

tl3 = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
});
tl3.addTo(m3);


function getColorGreen(d) {
    // 6 scale greens
    var colors = ['rgb(237,248,251)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(44,162,95)','rgb(0,109,44)'];
    return colors[Math.round(d*colors.length)];
};

function getColorBlue(d) {
    // 6 scale blues
    var colors = ['rgb(239,243,255)','rgb(198,219,239)','rgb(158,202,225)','rgb(107,174,214)','rgb(49,130,189)','rgb(8,81,156)'];
    return colors[Math.round(d*colors.length)];
};

function getColorPink(d) {
    // 6 scale magenta
    var colors = ['rgb(254,235,226)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(197,27,138)','rgb(122,1,119)'];
    return colors[Math.round(d*colors.length)];
};

function getColorOrange(d) {
    // 6 scale OrRd
    var colors = ['rgb(254,240,217)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(227,74,51)','rgb(179,0,0)']
    return colors[Math.round(d*colors.length)];
};

// f = feature, l = layer
//
function enhanceLayer1(f,l){
    var out = [];
    if (f.properties){
        l.bindPopup("Percentage: "+(f.properties[key1]*100).toFixed());
        l.setStyle({    
            fillColor: getColorBlue(f.properties[key1]),
            fillOpacity: 1.00,
            stroke: true,
            color: '#222',
            weight: 2
        });
    }
}

function enhanceLayer2(f,l){
    var out = [];
    if (f.properties){
        l.bindPopup("Percentage: "+(f.properties[key1]*100).toFixed());
        l.setStyle({    
            fillColor: getColorBlue(f.properties[key2]),
            fillOpacity: 1.00,
            stroke: true,
            color: '#222',
            weight: 2
        });
    }
}

function enhanceLayer3(f,l){
    var out = [];
    if (f.properties){
        l.bindPopup("Percentage: "+(f.properties[key1]*100).toFixed());
        l.setStyle({    
            fillColor: getColorOrange(f.properties[key3]),
            fillOpacity: 1.00,
            stroke: true,
            color: '#222',
            weight: 2
        });
    }
}

// "/"+SITEURL+
var prefix = "http://charlesreid1.github.io/a-shrubbery/";
var geoj1 = new L.geoJson.ajax(prefix+"cacommuterincome.geojson",{onEachFeature:enhanceLayer1}).addTo(m1);
//var geoj2 = new L.geoJson.ajax(prefix+"cacommuterincome.geojson",{onEachFeature:enhanceLayer2}).addTo(m2);
var geoj3 = new L.geoJson.ajax(prefix+"cacommuterincome.geojson",{onEachFeature:enhanceLayer3}).addTo(m3);
