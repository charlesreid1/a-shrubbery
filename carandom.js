// create the map, assign to the map div, and set it's lat, long, and zoom level (12)
var map = L.map('map').setView([37.8, -96], 4);

// Add MapBox Tiles
// https://www.mapbox.com/developers/api/maps/
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);

//// var owsrootUrl = 'http://104.236.163.66:8080/geoserver/ows';
//// 
//// var defaultParameters = {
////     service : 'WFS',
////     version : '1.0',
////     request : 'GetFeature',
////     typeName : 'oilgas:jp_dmyo_1664',
////     maxFeatures : '500',
////     outputFormat : 'text/javascript',
////     format_options : 'callback:getJson',
////     SrsName : 'EPSG:4008'
//// };

L.geoJson(carandom, {
    style: {"color":"#0000AA","weight":2}
}).addTo(map);

