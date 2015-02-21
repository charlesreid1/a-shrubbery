
// Outer Banks, NC
var map3 = L.map('map3').setView([35.4, -75.8], 8);

//var basemapViewer = L.tileLayer('http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
var basemapViewer = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 14,
    attribution: "Mapbox"
}).addTo(map3);

function enhanceLayer(f,l){
    var out = [];
    if (f.properties){
        l.bindPopup(f.properties['name']+"<br />GeoID: "+f.properties['geoid']);
        l.setStyle({  
            fillColor: '#FCC',
            fillOpacity: 0.20,
            stroke: true,
            color: '#222',
            weight: 1
        });
    }
}

rooturls = ["http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37055",
            "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37095",
            "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37013", 
            "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37177",
            "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37187",
            "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37137",
            "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37031",
            "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|05000US37049"]
            


rooturls.forEach(function(rooturl){

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
                onEachFeature: enhanceLayer
            }).addTo(map3)
        }
    });

});