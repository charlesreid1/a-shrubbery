
////////////////////////////////////
// Take care of county map first:
//

var map_county = L.map('education_county').setView([35.8, -78.6], 7);

var basemapViewer = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 14,
    attribution: "Mapbox"
}).addTo(map_county);

//var baseLayers = {
//    "Mapbox" : basemapViewer
//};
//
//var controlLayers = L.control.layers(baseLayers);
//
//basemapViewer.addTo(map_county);

rooturl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US37";

// initialize empty GeoJson
var geoj = L.geoJson(false, {
        onEachFeature: onEachFeature
    }).addTo(map_county);

$.ajax({
    type: "GET",
    url: rooturl,
    success: function (data) {
        geoj.addData(data);
    }
});



var myFillOpacity = 0.20;
var myThickFillOpacity = 0.90;




function onEachFeature(f, l) {
    if (f.properties) {
        l.on({
            click: doClick,
            mouseover: doMouseOver,
            mouseout: doMouseOut
            /*
            These are defined below...
            */
        });
        l.setStyle({  
            fillColor: '#CCF',
            fillOpacity: myFillOpacity,
            stroke: true,
            color: '#222',
            weight: 1
        });
        l.bindPopup("County: "+f.properties['name']+"<br />GeoID: "+f.properties['geoid']);
    }
}



////////////////////////////////////
// Take care of census map next:
//

var map_census = L.map('education_census').setView([35.8, -78.6], 7); 

var basemapViewer2 = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 14,
    attribution: "Mapbox"
}).addTo(map_census);




////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//
// change mouse click behavior of county map
//

function doMouseOver() {
    this.bringToFront();
    this.setStyle({
        weight:3,
        opacity: 1
    });
}

function doMouseOut() {
    this.bringToBack();
    this.setStyle({
        weight:1,
        opacity:0.8
    });
}

function doClick() {

    var county = this.feature.properties.name;

    //$tooltip.text("County: "+county).show();



    red = '#00ff00'

    these_layer_ids = Object.keys(this._layers);



    // First, make sure no counties are red.
    // Restore any previously red counties
    // to their original color.
    geoj.eachLayer(function(layer) {

        // get leaflet ids for every shape in this county's layer
        those_layer_ids = Object.keys(layer._layers);

        // for each shape making up this county,
        those_layer_ids.forEach( function(that_layer_id) {

            var that_layer = layer['_layers'][that_layer_id]
            var options = that_layer['options'];
            
            // Check if county is alrady red. 
            // If so, make it un-red.
            if(options['fillColor']){
                // Get the county's current color.
                orig_fillColor = options['fillColor'];
                if(options['fillColor']===red) {
                    that_layer.setStyle({
                            'fillColor'   : options['originalFillColor'],
                            'fillOpacity' : myFillOpacity
                        });
                }
            }
        });
    });








    /*
    geoj.eachLayer(function(layer) {
        console.log(layer);
        if(layer['_options']) {
            if( layer['_options']['fillColor'] ) {
                if(layer['_options']['fillColor']===red) {
                    //console.log("Returning active fill color back to original fill color.");
                    //console.log("Before: "+layer.options['fillColor']);
                    layer.setStyle(
                        {
                            'fillColor'   : layer['_options']['originalFillColor'],
                            'fillOpacity' : myFillOpacity
                        }
                    )
                    //console.log("After: "+layer.options['fillColor']);
                    //console.log("Original: "+layer.options['originalFillColor']);
                }
            }
        }
    });
    */



    // Now make the county the user clicked red.
    // Some counties have multiple pieces,
    // so we need to use var these_layer_ids
    geoj.eachLayer(function(layer) {

        those_layer_ids = Object.keys(layer._layers);
        
        if( layer['_options'] ){

            these_layer_ids.forEach( function(this_layer_id) {

                those_layer_ids.forEach( function(that_layer_id) {

                    //console.log("this_layer_id = "+this_layer_id);
                    //console.log("that_layer_id = "+that_layer_id);

                    // these_layer_ids usually has one element,
                    // unless a county has two non-continguous parts.
                    //
                    if( this_layer_id==that_layer_id ) {

                        var that_layer = layer['_layers'][that_layer_id]
                        var options = that_layer['options'];

                        if(options['fillColor']){

                            // Get the county's current color.
                            orig_fillColor = options['fillColor'];

                            // Check if county is already red.
                            // If not, make it red.
                            if( orig_fillColor===red) {
                                var a=0;

                            } else {
                                // set style to red 
                                that_layer.setStyle({
                                    'fillColor' : red,
                                    'fillOpacity' : myThickFillOpacity,
                                    'originalFillColor' : orig_fillColor
                                });
                            }
                        }

                    } 
                });
            });
        }
    });

}


