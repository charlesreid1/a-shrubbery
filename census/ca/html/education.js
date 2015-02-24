
///////////////////////////////////////////////

var map = L.map('map').setView([37.7, -119.5], 5);
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'US Census Bureau',
    maxZoom: 18
}).addTo(map);


L.TopoJSON = L.GeoJSON.extend({  
  addData: function(jsonData) {    
    if (jsonData.type === "Topology") {
      for (key in jsonData.objects) {
        geojson = topojson.feature(jsonData, jsonData.objects[key]);
        console.log(geojson);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }  
});
// Copyright (c) 2013 Ryan Clark



countyColors = d3.scale.category20c();


// f = feature, l = layer
function enhanceLayer(f,l){

    // add popup
    if (f.properties){
        var out = [];
        for(key in f.properties){
            out.push(key+": "+f.properties[key]);
        }
        l.bindPopup(out.join("<br />"));

        // http://leafletjs.com/reference.html#path-options
        l.setStyle({    
            fillColor: countyColors(Math.round(Math.rand()*20)),//fillColor: getColor(f.properties['derived_quantity']/10.0),
            fillOpacity: 0.75,
            stroke: false
        });
    }
}


var topoLayer = new L.TopoJSON();
 
$.getJSON('education_CA.topo.json')
  .done(addTopoData);
 
function addTopoData(topoData){  

  console.log(topoData);

  topoLayer.addData(topoData);
  topoLayer.addTo(map);
}



