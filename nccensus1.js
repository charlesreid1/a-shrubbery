
// Outer Banks, NC
var map = L.map('map').setView([35.6, -76.4], 8);

//var basemapViewer = L.tileLayer('http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
var basemapViewer = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 14,
    attribution: "Mapbox"
}).addTo(map);

var baseLayers = {
    "Mapbox" : basemapViewer
};

var controlLayers = L.control.layers(baseLayers);

basemapViewer.addTo(map);

function enhanceLayer(f,l){
    var out = [];
    if (f.properties){
        //if(f.properties['name']==='Beaufort County, NC') {
        //    console.log(f);
        //}
        l.bindPopup("County: "+f.properties['name']+"<br />GeoID: "+f.properties['geoid']);
        l.setStyle({  
            fillColor: '#CCF',
            fillOpacity: 0.20,
            stroke: true,
            color: '#222',
            weight: 1
        });
    }
}

rooturl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US37";

$.ajax({
    type: "GET",
    url: rooturl,
    success: function (data) {
    	var geojson = new L.geoJson(data, {
    		onEachFeature: enhanceLayer
        }).addTo(map);
    }
});
