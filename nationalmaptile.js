
// create the map, assign to the mao div, and set it's lat, long, and zoom level (12)
//var map = L.map('map').setView([-100.0,35.0], 12);
var map = L.map('map').setView([34.0, -118.2], 6);

var attribution = '<a href="http://www.doi.gov">U.S. Department of the Interior</a> | <a href="http://www.usgs.gov">U.S. Geological Survey</a> | <a href="http://www.usgs.gov/laws/policies_notices.html">Policies</a>';

var tnmBasemapViewer = L.tileLayer('http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 14,
    attribution: attribution
}).addTo(map);

// Add baselayers and overlays to groups
var baseLayers = {
    "The National Map (Viewer)" : tnmBasemapViewer
};

var controlLayers = L.control.layers(baseLayers);

tnmBasemapViewer.addTo(map);



var owsrootUrl = 'http://104.236.163.66:8080/geoserver/ows';

var defaultParameters = {
    service : 'WFS',
    version : '1.0',
    request : 'GetFeature',
    typeName : 'US_ShalePlays_EIA_May2011',
    maxFeatures : '200',
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:4269'
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
                style: {"color":"#ff7800","weight":2},
                //
    		    // and bind a popup showing the street name for each feature extracted.
    		    //onEachFeature: function(feature, layer){
    		    //	layer.bindPopup("street: " + feature.properties.name);
                //    //console.log(feature.properties);
    		    //}
    	}).addTo(map);

        //var marker = L.marker([40.7543, -73.9858]).addTo(map);
    }
});
