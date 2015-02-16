
// create the map, assign to the mao div, and set it's lat, long, and zoom level (12)
//var map = L.map('map').setView([-100.0,35.0], 12);
var map = L.map('map').setView([32.8, -113.5], 10);
//var map = L.map('map').setView([-113.5, 32.5], 10);

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



////////////////////////////////////////////////////////////

L.TopoJSON = L.GeoJSON.extend({  
  addData: function(jsonData) {    
    if (jsonData.type === "Topology") {
      for (key in jsonData.objects) {
        geojson = topojson.feature(jsonData, jsonData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }  
});

function enhanceLayer(f,l){
    if (f.properties){
        l.setStyle({    
            fillColor: '#000',
            fillOpacity: 0.50,
            stroke: true,
            color: '#000',
            weight: 1
        });
    }
}





var prefix = "http://charlesreid1.github.io/a-shrubbery/";
//var prefix = "/";
var url = prefix+"barrygoldwater_red.json"




var colorScale = chroma  
  .scale(['#D5FFE3', '#007131'])
  .domain([0,1]);




var topoLayer = new L.TopoJSON();

function addTopoData(topoData){  
    topoLayer.addData(topoData);
    topoLayer.addTo(map);

    // iterate over each layer
    topoLayer.eachLayer(handleLayer);  
}

$.getJSON(url)
  .done(addTopoData);



function handleLayer(layer){  

  var randomValue = Math.random(),
    fillColor = colorScale(randomValue).hex();


  layer.setStyle({
    fillColor : fillColor,
    fillOpacity: 1,
    color:'#555',
    weight:3,
    opacity:0.5
  });


  layer.on({
    mouseover: enterLayer,
    mouseout: leaveLayer
  });
}


var $tooltip = $('.elevation');

function enterLayer(){  
  var elevation = this.feature.properties.CONTOURELE;
  //$tooltip.text("Selected contour: "+elevation+" m").show();
  $tooltip.text("Selected contour: "+elevation+" m").show();

  this.bringToFront();
  this.setStyle({
    weight:3,
    opacity: 1
  });
}

function leaveLayer(){  
  //$tooltip.hide();
  $tooltip.text("Selected contour:").show();

  this.bringToBack();
  this.setStyle({
    weight:3,
    opacity:.8
  });
}

