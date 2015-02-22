

// Outer Banks, NC
var map2 = L.map('map2').setView([35.8, -75.8], 8);

//var basemapViewer = L.tileLayer('http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
var basemapViewer2 = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 14,
    attribution: "Mapbox"
}).addTo(map2);

function enhanceLayer2(f,l){
    var out = [];
    if (f.properties){
        l.bindPopup(f.properties['name']+"<br />GeoID: "+f.properties['geoid']);
        l.setStyle({  
            fillColor: '#CCF',
            fillOpacity: 0.20,
            stroke: true,
            color: '#222',
            weight: 1
        });
    }
}

rooturl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37055";

$.ajax({
    type: "GET",
    url: rooturl,
    success: function (data) {
    	var geojson = new L.geoJson(data, {
            style: {
                fillColor: '#CFC',
                fillOpacity: 0.20,
                stroke: true,
                color: '#222',
                weight: 1
            },

    		onEachFeature: function(feature, layer){
                popupText = "";
                popupText += feature.properties.name;
    		}

    	}).addTo(map2);

    }
});

