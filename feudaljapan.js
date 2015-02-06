
// create the map, assign to the mao div, and set it's lat, long, and zoom level (12)
// NYC
var map = L.map('map').setView([40.754306, -73.985861], 4);

// big thanks to
// http://gis.stackexchange.com/questions/64406/getting-wfs-data-from-geoserver-into-leaflet
// for making this script a lot better



// Add MapBox Tiles
// list of styles:
// https://www.mapbox.com/developers/api/maps/
//L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.pencil/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
//L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);


var owsrootUrl = 'http://104.236.163.66:8080/geoserver/ows';

var defaultParameters = {
    service : 'WFS',
    version : '1.0',
    request : 'GetFeature',
    typeName : 'feudaljapan1',
    maxFeatures : '100',
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:4008'
};

var parameters = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parameters);

//ajax to get map features
$.ajax({
    type: "POST",
    url: URL,
    dataType: 'jsonp',
    jsonpCallback : 'getJson',

    //upon success extraction of data
    success: function (data) {

        console.log(data);

        // the data.geometry field contains coordinate/location data.
        //
        // now use this page on Leaflet+GeoJSON:
        // http://leafletjs.com/examples/geojson.html

    	//create a new geojson layer
    	var geojson = new L.geoJson(data, {

    	    // apply a style 
            style: {"color":"#0000AA","weight":2},

    	}).addTo(map);

    }
});
