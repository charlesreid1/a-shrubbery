
////////////////////////////////////
// Take care of county map first:
//
var zoomOrig = 6;
var map_county = L.map('education_county').setView([35.8, -78.6], zoomOrig);

var basemapViewer = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
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

// counties in north carolina
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
    var geo_id = this.feature.properties.geoid;

    var $tooltip = $('.county');
    $tooltip.text("County: "+county).show();



    // http://en.wikipedia.org/wiki/Carolina_blue
    red = '#56A0D3';


    // this used to work, I don't know why it doesn't anymore:
    //these_layer_ids = Object.keys(this._layers);

    these_layer_ids = [this._leaflet_id];

    console.log(this);
    console.log(this._leaflet_id);


    // First, make sure no counties are red.
    // Restore any previously red counties
    // to their original color.
    geoj.eachLayer(function(layer) {

        // get leaflet ids for every shape in this county's layer
        console.log(layer);
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



    // Now add census tracts for this county to the census tract map.
    //
    // Do this by grabbing the geo_id for the county,
    // and form that into a Census Reporter API URL.

    var geo_id = this.feature.properties.geoid;

    census_url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|"+geo_id;




    // initialize empty GeoJson
    var census_geoj = L.geoJson(false, {
            onEachFeature: onEachCensusFeature
        }).addTo(map_census);

    // Get the bounds for the census tract geometries.
    // Center and zoom the map.
    $.ajax({
        type: "GET",
        url: census_url,
        success: function (data) {

            // remove the previous census tracts layer here
            //
            // do this by getting layers and removing them
            map_census.eachLayer(function(layer){
                if(layer._tiles) {
                    var a = 0;
                } else {
                    // this also removes census_geoj, 
                    // so we have to re-add it...
                    map_census.removeLayer(layer);
                }
            });

            census_geoj.addTo(map_census);
            census_geoj.addData(data);
            var bounds = census_geoj.getBounds();
            //map_census.panInsideBounds(bounds);
            //map_census.setZoom( map_census.getBoundsZoom(bounds) );
            map_census.fitBounds(bounds,animate=true);


        }
    });

    // Right here is the wrong place to use the 
    // Ajax data to set the map bounds. 
    //
    // Ajax is asynchronous - so when we get to 
    // this point in the script, the Ajax hasn't 
    // been loaded yet. 
    //
    // It took me a long while to figure that out.


}


function onEachCensusFeature(f, l) {
    if (f.properties) {
        /*
        l.on({
            click: doClick,
            mouseover: doMouseOver,
            mouseout: doMouseOut
        });
        */
        l.setStyle({  
            fillColor: '#FCC',
            fillOpacity: myFillOpacity,
            stroke: true,
            color: '#222',
            weight: 1
        });
        l.bindPopup(f.properties['name']);
    }
}
