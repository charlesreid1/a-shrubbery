// prefix defined in common.js



// Make non-responsive
$("head").find('meta[name="viewport"]')
    .remove();


////////////////////////////////////
// County Map

// Take care of county map first:
//
var zoomOrig = 6;
var map_county = L.map('education_county').setView([37.7, -119.5], zoomOrig);

var basemapViewer = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 18,
    attribution: "Mapbox"
}).addTo(map_county);



// counties in california
//rooturl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US37";
var rooturl = prefix + "educationca.geo.json"

// initialize empty GeoJson
var geoj = L.geoJson(false, {
        onEachFeature: onEachCounty
    }).addTo(map_county);

$.ajax({
    type: "GET",
    url: rooturl,
    success: function (data) {
        geoj.addData(data);
    }
});




////////////////////////////////
// Colors


// Random colors for political maps
var randomColors = d3.scale.category20c();


//// Variable-interval color scale
//// https://gist.github.com/mbostock/5144735
//var variableC = d3.scale.threshold()
//        .domain([30, 60, 120, 360])
//        .range(["#ffffcc","#c2e699","#78c679","#31a354","#006837"]);

// Constant-interval color scale
// http://bl.ocks.org/mbostock/4060606
//var constantC = d3.scale.threshold()
//        .domain([1,4])
//        .range(["#ffffcc","#c2e699","#78c679","#31a354","#006837"]);

colorbrewer = ['rgb(255,255,217)',
               'rgb(237,248,177)',
               'rgb(199,233,180)',
               'rgb(127,205,187)',
               'rgb(65,182,196)',
               'rgb(29,145,192)',
               'rgb(34,94,168)',
               'rgb(37,52,148)',
               'rgb(8,29,88)'];

var stateMeanEducationColor = d3.scale.quantize()
        .domain([1.5,3.5])
        .range(colorbrewer);

var tractMeanEducationColor = d3.scale.quantize()
        .domain([1.5,3.5])
        .range(colorbrewer);

short_ed_categories = ['<HS',  
                       'HS,As',
                       'Ba',   
                       'Ma',   
                       'PhD'];
ed_categories = ['1 Less than high school',
                 '2 High school, associates degree',
                 '3 Bachelors degree',
                 '4 Masters degree',
                 '5 PhD/Professional School'];

var categoriesEducationScale = d3.scale.ordinal()
    .domain(ed_categories)
    .range([colorbrewer[0],
            colorbrewer[2],
            colorbrewer[4],
            colorbrewer[6],
            colorbrewer[8]]);




///////////////////////////////
// Decorate each county 


var myFillOpacity = 0.40;
var myThickFillOpacity = 0.90; 

var myMouseOutFillOpacity = 0.40;
var myMouseOverThickFillOpacity = 1.0; 



function onEachCounty(f, l) {
    if (f.properties) {
        l.on({
            click: doCountyClick,
            mouseover: doCountyMouseOver,
            mouseout: doCountyMouseOut
            /*
            These are defined below...
            */
        });
        l.setStyle({  
            /*fillColor: randomColors( Math.round(Math.random()*15-1) ), */
            fillColor: stateMeanEducationColor(f.properties['Total_Ed_Mean']),
            fillOpacity: myFillOpacity,
            stroke: true,
            color: '#222',
            weight: 1
        });

        //var out = [];
        //for(key in f.properties){
        //    out.push(key+": "+f.properties[key]);
        //}
        //l.bindPopup(out.join("<br />"));
    }
}



////////////////////////////////////
// Census Tract Map

// Take care of census map next:
//

var map_census = L.map('education_census').setView([37.7, -119.5], 7); 

var basemapViewer2 = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{ 
    maxZoom: 18,
    attribution: "Mapbox"
}).addTo(map_census);





////////////////////////////////////////////
// Scatterplot 

var myScatterFillOpacity = 0.40;
var myScatterThickFillOpacity = 0.90; 

var scatter_width  = 400;
var scatter_height = 400;
var scatter_padding = 80;

var scattersvg = d3.select("div#scatterplot").append("svg")
    .attr("width",  scatter_width)
    .attr("height", scatter_height);




////////////////////////////////////////////////////////////////////////
//
// change mouse click behavior of county map
//

function doCountyMouseOver() {
    this.bringToFront();
    this.setStyle({
        weight:3,
        opacity:myMouseOverThickFillOpacity
    });
}

function doCountyMouseOut() {
    this.bringToBack();
    this.setStyle({
        weight:1,
        opacity:myMouseOutFillOpacity
    });
}

function doCountyClick() {
    /*

    We do a couple of things here:

    1) de-highlight all counties
        [may want to update this behavior]

    2) highlight the clicked county 

    3) zoom to that county's census tracts 
        in the census tract map 

    4) update scatterplot

     */

    var county = this.feature.properties.name;

    var $tooltip = $('.county');
    $tooltip.text(county).show();

    red = '#df65b0';

    these_layer_ids = Object.keys(this._layers);


    // -------------------------------------
    // Step 1:
    // De-highlight all counties
    // 
    // Restore any previously hilited counties
    // to their original color.
    geoj.eachLayer(function(layer) {

        // get leaflet ids for every shape in the current 
        // geoj layer
        those_layer_ids = Object.keys(layer._layers);

        // NOTE: this is necessary because
        // some counties/census tracts have
        // islands or other non-contiguous 
        // entities

        // for each shape making up the current 
        // geoj layer, 
        those_layer_ids.forEach( function(that_layer_id) {

            var that_layer = layer['_layers'][that_layer_id]
            var options = that_layer['options'];
            
            // Check if county is alrady hilited. 
            // If so, make it un-hilited.
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



    // -------------------------------------
    // Step 2:
    // Make the county the user clicked red.
    //
    // Some counties have multiple pieces,
    // so we need to use var these_layer_ids
    geoj.eachLayer(function(layer) {

        those_layer_ids = Object.keys(layer._layers);

        if( layer['_options'] ){

            these_layer_ids.forEach( function(this_layer_id) {

                those_layer_ids.forEach( function(that_layer_id) {

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



    // -------------------------------------
    // Step 3:
    // Add census tracts for this county to the census tract map.
    //
    // Do this by grabbing the geo_id for the county,
    // and form that into a Census Reporter API URL.

    var geo_id = this.feature.properties.geoid;

    //censusurl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|"+geo_id;
    var censusurl = prefix + "educationca" + geo_id + ".geo.json";


    // initialize empty GeoJson
    var census_geoj = L.geoJson(false, {
            onEachFeature: onEachCensusFeature
        }).addTo(map_census);


    // Census tract data
    $.ajax({
        type: "GET",
        url: censusurl,
        success: function (data) {


            // ---------------------------
            // Zoom to the county's census tracts
            // on the census tract map.
            //
            // This involves a few steps:
            // 1) Remove previous census tract layers
            // 2) Get bounds for the census tract geometries.
            // 3) Center and zoom the map.

            // -------
            // 1. Remove the previous census tracts layer here
            map_census.eachLayer(function(layer){
                if(layer._tiles) {
                    var a = 0;
                } else {
                    // this also removes census_geoj, 
                    // i.e., the layer we're trying to add,
                    // so we have to re-add it in a few lines...
                    map_census.removeLayer(layer);
                }
            });
            census_geoj.addTo(map_census);
            census_geoj.addData(data);

            // -------
            // 2. Get census tract bounds
            var bounds = census_geoj.getBounds();

            // ------
            // 3. Fit map to bounds
            //map_census.panInsideBounds(bounds);
            //map_census.setZoom( map_census.getBoundsZoom(bounds) );
            map_census.fitBounds(bounds,animate=true);





            // -------------------------------------
            //
            // Step 4: Scatter Plot
            //

            // Update the scatter plot
            // to show each census tract
            // in the selected county,
            // one circle per census tract
            //
            // This will not use the properties
            // of the county, but rather
            // will use the properties of each
            // census tract that is in our county.
            //

            // This is another multi-step procedure:
            //
            // 1. Remove existing dots from scatterplot
            // 2. Add new dots to scatterplot


            // -------
            // 1) Remove existing dots
            scattersvg.selectAll("circle").remove();


            // -------
            // 2) Add new dots
            var greenColor = d3.scale.linear()
                .domain([0, 1])
                .range(["#ada", "#595"]);


            /*
            data.features.forEach(function(d){
                console.log(d.properties);//['Total_Ed_Mean']);
            });

            console.log(d3.max(data.features,function(d){
                            return d.properties['Total_Ed_Mean'];
                        })
            );
            */

            var xkey = 'Total_Ed_Mean';
            var xlabel = 'Average Education Level';
            var ykey = 'Total_Ed_Var';
            var ylabel = 'Educational Diversity (Variance)';
            var rkey = 'Total_Total';

            var xmin = d3.min(data.features, function(d) { return d.properties[xkey]; });
            var xmax = d3.max(data.features, function(d) { return d.properties[xkey]; });

            var ymin = d3.min(data.features, function(d) { return d.properties[ykey]; });
            var ymax = d3.max(data.features, function(d) { return d.properties[ykey]; });

            var rmin = d3.min(data.features, function(d) { return Math.log(d.properties[rkey]); });
            var rmax = d3.max(data.features, function(d) { return Math.log(d.properties[rkey]); });

            var scatterg = scattersvg.selectAll("circle")
                .data(data.features)
                .enter()
                .append("circle")
                .attr("geoid",function(d) {
                    return d.properties['geoid'];
                })
                .attr("id",function(d) {
                    return d.properties['geoid'];
                })
                .attr("cx", function(d) {
                    var xnorm = d.properties[xkey]/xmax;
                    var plotwidth = (scatter_width - 2*scatter_padding);
                    return scatter_padding + xnorm*plotwidth;
                })
                .attr("cy", function(d) {
                    var ynorm = d.properties[ykey]/ymax;
                    var plotheight = (scatter_height - 2*scatter_padding);
                    return scatter_padding + ynorm*plotheight;
                })
                .attr("r", function(d) {
                    var r0 = 6;
                    var rnorm = Math.log(d.properties[rkey])/rmax;
                    var result = r0*rnorm;
                    if (isFinite(result)) {
                        return result;
                    } else {
                        return 0;
                    }
                })
                .attr("fill",function(d) {
                    return greenColor(Math.random());
                });

            // -------
            // 3) Remove existing axis labels
            scattersvg.selectAll("g.axis").remove();
            scattersvg.selectAll("text.axislabel").remove();
            scattersvg.selectAll("text.axislabel").remove();

            // -------
            // 4) Construct the scatterplot axes
            
            var xrange0 = scatter_padding
            var xrange1 = scatter_width - scatter_padding

            var yrange0 = scatter_height - scatter_padding
            var yrange1 = scatter_padding

            // Create scales to map values to pixel locations
            var xScale = d3.scale.linear()
                    .domain([1.5,4.5])
                    .range([xrange0,xrange1])
            var yScale = d3.scale.linear()
                    .domain([0,1])
                    .range([yrange0,yrange1])

            // Create axes from scales 
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5);
            
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
            	.ticks(10)
            	.tickFormat(function(d) { return Math.round(d*100)/100; });

            // Translate x and y axes
            //
            // xtrans = x translation of y axis
            // ytrans = y tanslation of x axis
            xtrans = scatter_padding;
            ytrans = scatter_height - scatter_padding;

            scattersvg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + ytrans + ")")
                .call(xAxis);
            scattersvg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + xtrans + ",0)")
                .call(yAxis);

            // Axis labels
            xloc = scatter_width - (scatter_width/2);
            yloc = scatter_height - scatter_padding/2
            scattersvg.append("text")
                .attr("class", "axislabel")
                .attr("id","xaxislabel")
                .attr("text-anchor", "middle")
                .attr("x",xloc)
                .attr("y",yloc)
                .text(xlabel);

            xloc = 0 - (scatter_height/2);
            yloc = scatter_padding/10;
            scattersvg.append("text")
                .attr("class", "axislabel")
                .attr("id","yaxislabel")
                .attr("text-anchor", "middle")
                .attr("x",xloc)
                .attr("y",yloc)
                .attr("dy", "1em")
                .attr("transform", "rotate(-90)")
                .text(ylabel);


        }
    });

    // NOTE:
    // Right here is the wrong place to use the 
    // Ajax data to set the map bounds. 
    //
    // Ajax is asynchronous - so when we get to 
    // this point in the script, the Ajax hasn't 
    // been loaded yet. 
    //
    // It took me a long while to figure that out.



    // -------------------------------------
    // Step 5: Bar Chart

    // You can obtain properties of this county
    // by using this.feature:
    //var county = this.feature.properties.name;
    //console.log(this.feature.properties);

}


function onEachCensusFeature(f, l) {
    if (f.properties) {
        l.on({
            click: doCensusClick,
            mouseover: doCensusMouseOver,
            mouseout: doCensusMouseOut
        });
        l.setStyle({  
            /*fillColor: countyColors( Math.round(Math.random()*15-1) ), */
            fillColor: tractMeanEducationColor(f.properties['Total_Ed_Mean']),
            fillOpacity: 0.50,
            stroke: true,
            color: '#222',
            weight: 0.5
        });
        //var out = [];
        //for(key in f.properties){
        //    out.push(key+": "+f.properties[key]);
        //}
        //l.bindPopup(out.join("<br />"));
    }
}






/////////////////////////////////////////////////////////
//
//
// Color Scales 
// ordinal and linear

var scales_width = 300;
var scales_height = 140;

var svg = d3.select("div#education_county_scale").append("svg")
    .attr("width",  scales_width)
    .attr("height", scales_height);




// ----------------------------------------
//
// Linear color scale

var lincolor_xpos = 10;
var lincolor_ypos = 100;


var state_dom0 = stateMeanEducationColor.domain()[0];
var state_dom1 = stateMeanEducationColor.domain()[1];
var state_step = (state_dom1 - state_dom0)/(stateMeanEducationColor.range().length);
var stateMeanEducationColorDomain = d3.range( state_dom0, state_dom1+state_step, state_step );


// A position encoding for the key only.
var xkey = d3.scale.linear()
        .domain([1.5,3.5])
        .range([0,240]);

var xAxis = d3.svg.axis()
    .scale(xkey)
    .orient("bottom")
    .tickSize(13)
    .tickValues(stateMeanEducationColorDomain);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate("+lincolor_xpos+","+lincolor_ypos+")");

/*
domain is input
range is output
domain input... 
range output...
 */

g.selectAll("rect")
    .data(stateMeanEducationColor.range().map(function(d, i) {
      return {
            x0: i ? xkey(stateMeanEducationColorDomain[i]) : xkey.range()[0],
            x1: i < stateMeanEducationColorDomain.length ? xkey(stateMeanEducationColorDomain[i+1]) : xkey.range()[1],
            z: d
      };

    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return d.x0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .style("fill", function(d) { return d.z; });

var lincolor_text_ypos = -6;
g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", lincolor_text_ypos)
    .text("Mean Education Level");



// ----------------------------------------
//
// Ordinal color scale

var ordinalcolor_xpos = 30;
var ordinalcolor_ypos = 15;

// the overall container
var g2 = svg.append("g")
    .attr("class", "ordinalkey")
    .attr("transform", "translate(0,0)");

// shape for each discrete ordinal value
// (these will be invisible, and are only
//  added to make the legend)
g2.selectAll("rect")
    .data(categoriesEducationScale.domain().map(function(d, i) {
        return {
            name: d,
            color: categoriesEducationScale(d)
        };
    }))
    .enter().append("rect") /*.attr("d",function(d) { return d.name; })*/
    .attr("data-legend",function(d) { return d.name;})
    .attr("data-legend-pos",function(d) { return d.name;})
    .attr("class", "ordinalkey")
    .style("opacity","0.0")
    .style("fill", function(d) { return d.color; });


/*
legend_data = [{'cat' : ed_categories[0], 'dat' : 1.0},
               {'cat' : ed_categories[1], 'dat' : 2.0},  
               {'cat' : ed_categories[2], 'dat' : 3.0},  
               {'cat' : ed_categories[3], 'dat' : 4.0},  
               {'cat' : ed_categories[4], 'dat' : 5.0}];
*/

var legend = svg.append("g")
  .attr("class","ordinalkey")
  .attr("transform","translate("+ordinalcolor_xpos+","+ordinalcolor_ypos+")")
  .style("font-size","12px")
  .style("font-color","#000")
  .call(d3.legend);

/*
// select tags with class mylegend 
// bind it to legend_data
// create one <g> tag for each legend entry

var g = svg.selectAll(".legend")
    .data(legend_data)
    .enter().append("g")
    .attr("class","legend");

g.append("path")
    .attr("data-legend", function(d){
        return d.cat; })
    .attr("data-legend-pos",function(d,i) {
        return categories[i]; })
    .style("fill", function(d) { 
        return stateMeanEducationColor(d.dat); });
*/





/////////////////////////////////////////////////////////
// Extend D3 to make moving circles and things
// to the front/back easier...
//
// http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
//
// Call like this:
//
// circles.on("mouseover",function(){
//     var sel = d3.select(this);
//     sel.moveToFront();
// });

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};




///////////////////////////////////////////////////////////////
// Link census tract map to D3 scatterplot

function doCensusMouseOver() {
    this.bringToFront();
    this.setStyle({
        weight:2,
        opacity:myMouseOverThickFillOpacity
    });
}

function doCensusMouseOut() {
    this.bringToBack();
    this.setStyle({
        weight:0.5,
        opacity: myMouseOutFillOpacity
    });
}




function doCensusClick() {

    var tract = this.feature.properties.name;
    var tract_geo_id = this.feature.properties.geoid;

    // leaflet ids for clicked census tract
    these_layer_ids = Object.keys(this._layers);


    ////////////////////////////////////
    // When a user clicks on a census tract,
    // highlight that census tract
    // on the D3 scatter plot.
    //
    // This has two parts:
    // 1) Highlight census tract on map
    // 2) Highlight corresponding scatter plot element


    // --------------------------
    // Step 1: 
    // Highlight census tract on map

    red2 = '#df65b0';


    //console.log(these_layer_ids);
    //console.log(tract_geo_id);

    map_census.eachLayer(function(layer) {

        // For each of these leaflet ids,
        // we need to obtain the shapes
        // in that particular layer
        // and change their fill color.
        that_layer_id = layer._leaflet_id;
        
        // NOTE:
        // when we were doing eachLayer() method
        // for geojson data,
        // we used Object.keys(layer._layers) 
        // 
        // but now we're doing eachLayer() method
        // of leaflet map.
        //
        // So we use layer._leaflet_id 

        if(layer['options']){

            var options = layer['options'];

            // -------------------------------------
            // Step 1A:
            // De-highlight all census tracts
            // 
            // Check if tract is alrady hilited. 
            // If so, make it un-hilited.
            if(options['fillColor']){
                // Get the tract's current color.
                orig_fillColor = options['fillColor'];
                if(options['fillColor']===red2) {
                    layer.setStyle({
                            'fillColor'   : options['originalFillColor'],
                            'fillOpacity' : myFillOpacity
                    });
                }
            }

            // -------------------------------------
            // Step 1B:
            // Make the tract the user clicked red.
            //
            these_layer_ids.forEach(function(this_layer_id){

                if( this_layer_id==that_layer_id ) {
                    if(options['fillColor']){
                        // Get the county's current color.
                        orig_fillColor = options['fillColor'];

                        // Check if county is already red.
                        // If not, make it red.
                        if( orig_fillColor!=red2) {
                            // set style to red 
                            layer.setStyle({
                                'fillColor' : red,
                                'fillOpacity' : myThickFillOpacity,
                                'originalFillColor' : orig_fillColor
                            });
                        }
                    }
                }
            });
        }
    });


    // --------------------------
    // Step 2: 

    // Highlight tract's dot on scatterplot
    //console.log(tract_geo_id);

    // -------
    // Step 2A: remove hiliting
    // (restore original color from object's properties)
    d3.selectAll("circle[fill='"+red2+"']")
            .attr("fill",function(d) { 
                if(d.properties['originalFill']) {
                    return d.properties['originalFill'];
                }
            })
            .moveToBack();

    // -------
    // Step 2B: hilite circle 
    // (save original color in object's properties)
    d3.selectAll("circle[geoid='"+tract_geo_id+"']")
        .each(function(d){
            d.properties['originalFill'] = this.attributes.fill.value;
        })
        .style("fill-opacity",myScatterThickFillOpacity)
        .attr("fill",red2)
        .moveToFront();

    /*(

    scattersvg.selectAll("circle[geoid='"+tract_geo_id+"']")
            .attr('opacity',1)
            .attr("fill",red2);

    mycirc.attr("fill",function(d) {
        return red2;
    });
    */

}






