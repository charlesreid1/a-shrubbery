// prefix defined in common.js

// Make non-responsive
$("head").find('meta[name="viewport"]')
    .remove();


// any census tracts with population < pop_limit 
// are not displayed on the scatter plot
var pop_limit = 40;



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

// colorbrewer = ['rgb(255,255,217)',
//                'rgb(237,248,177)',
//                'rgb(199,233,180)',
//                'rgb(127,205,187)',
//                'rgb(65,182,196)',
//                'rgb(29,145,192)',
//                'rgb(34,94,168)',
//                'rgb(37,52,148)',
//                'rgb(8,29,88)'];
// 
// var stateMeanEducationColor = d3.scale.quantize()
//         .domain([1.5,3.5])
//         .range(colorbrewer);
// 
// var tractMeanEducationColor = d3.scale.quantize()
//         .domain([1.5,3.5])
//         .range(colorbrewer);



// // // /////////////////////////////
// // // // We are gonna distribute these points
// // // // according to an assumed distribution
// // // // of education levels.
// // // //
// // // // In particular, I'm going to assume
// // // // educations are distributed according to
// // // // a Weibull distribution, with
// // // // lamba = 1
// // // // k = 1.5
// // // //
// // // // Procedure looks like this:
// // // // turn our interval [a,b] into [0,1]
// // // // split [0,1] into N parts
// // // // transform the N interval values x
// // // // into values of the CDF F(x)
// // // // //
// // // 
// // // var weibull_domain = [],
// // //     xreal0 = 1.0,
// // //     xreal1 = 5.0;
// // // 
// // // N = 10;
// // // for (var i = 0; i < N; i++) {
// // //     // Weibull CDF
// // //     // see Wikipedia
// // // 
// // //     // start with our xhat location
// // //     // (xhat = scaled x, [0,1])
// // //     xhat = 0.1*(i+1);
// // //     Fxhat = 1 - Math.exp(-xhat*Math.sqrt(xhat));
// // // 
// // //     xreal = xreal0 + (xhat)*(xreal1 - xreal0)
// // //     Fxreal = xreal0 + (Fxhat)*(xreal1 - xreal0)
// // // 
// // //     weibull_domain.push(Fxreal);
// // // }
// // // 
// // // colorbrewer = ['rgb(255,255,255)',
// // //                'rgb(255,255,217)',
// // //                'rgb(237,248,177)',
// // //                'rgb(199,233,180)',
// // //                'rgb(127,205,187)',
// // //                'rgb(65,182,196)',
// // //                'rgb(29,145,192)',
// // //                'rgb(34,94,168)',
// // //                'rgb(37,52,148)',
// // //                'rgb(8,29,88)'];
// // // 
// // // var stateMeanEducationColor = d3.scale.quantize()
// // //         .domain(weibull_domain)
// // //         .range(colorbrewer);
// // // 
// // // var tractMeanEducationColor = d3.scale.quantize()
// // //         .domain(weibull_domain)
// // //         .range(colorbrewer);



stateMeanEducationColorDom = [1.5,3.5]

colorbrewer = ['rgb(255,255,255)',
               'rgb(255,255,217)',
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




var grays = ['rgb(247,247,247)',
             'rgb(204,204,204)',
             'rgb(150,150,150)',
             'rgb(99,99,99)',
             'rgb(37,37,37)'];

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
    .range([grays[0],
            grays[1],
            grays[2],
            grays[3],
            grays[4]]);



gender_imbalance_categories = ['Females better-educated than males (on average)',
                               'Males better-educated than females (on average)'];
var gender_imbalance_scale = d3.scale.ordinal()
    .domain(gender_imbalance_categories)
    .range(['#e4778a','#5b77a0']);




////////////////////////////////////
// County Map

// Take care of county map first:
//
var zoomOrig = 5;
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



////////////////////////
// add bar chart legend
//

var barlegendw = 400,
    barlegendh = 140;
var bclegend_xpos = 80,
    bclegend_ypos = 100;

var bcsvg= d3.select('div[id="barchartscale"]').append("svg")
    .attr("width", barlegendw)
    .attr("height",barlegendh);

var g2 = bcsvg.append("g")
    .attr("class", "ordinalkey")
    .attr("transform", "translate(0,0)");

// shape for each discrete ordinal value
// (these will be invisible, and are only
//  added to make the legend)
g2.selectAll("rect")
    .data(gender_imbalance_scale.domain().map(function(d, i) {
        return {
            name: d,
            color: gender_imbalance_scale(d)
        };
    }))
    .enter().append("rect") /*.attr("d",function(d) { return d.name; })*/
    .attr("data-legend",function(d) { return d.name;})
    .attr("class", "ordinalkey")
    .style("opacity","0.0")
    .style("fill", function(d) { return d.color; });

var legend = bcsvg.append("g")
  .attr("class","ordinalkey")
  .attr("transform","translate("+bclegend_xpos+","+bclegend_ypos+")")
  .style("font-size","12px")
  .style("font-color","#000")
  .call(d3.spacedlegend);


/////////////////////////
// now make the bar chart
// by calling columnChart

$.ajax({
    type: "GET",
    url: rooturl,
    success: function (data) {
        geoj.addData(data);

        ///////////////////////////
        // add bar chart
        var barw = 450,
            barh = 420;

        d3.select('div[id="barchart"]')
          .datum(data.features)
            .call(columnChart(['name','Gender_Imbalance'],map_county,map_census)
              .width(barw)
              .height(barh));


        /////////////////////////

    }
});





///////////////////////////////
// Decorate each county 


var myFillOpacity = 0.60;
var myThickFillOpacity = 0.80; 

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


        //var out = "";
        //out += "Name: "+f.properties['name']+"<br />";
        //out += "GeoID: "+f.properties['geoid']+"<br />";
        //out += "Total Ed Mean: "+f.properties['Total_Ed_Mean']+"<br />";
        //out += "Total Ed Var: "+f.properties['Total_Ed_Var']+"<br />";
        //out += "Total: "+f.properties['Total_Total'];
        //l.bindPopup(out);
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
var scatter_xpadding = 80;
var scatter_ypadding = 80;

var scattersvg = d3.select("div#scatterplot").append("svg")
    .attr("width",  scatter_width)
    .attr("height", scatter_height);



////////////////////////////////////////////////////////////////////////
//
// change mouse behavior of county map
//

function doCountyMouseOver() {
    this.bringToFront();
    this.setStyle({
        weight: 3,
        opacity:myMouseOverThickFillOpacity
    });

    var this_geoid = this.feature.properties['geoid'];
    d3.selectAll(".bar[geoid='"+this_geoid+"']")
        .classed({'active':true})
        .style("opacity",0.7);
}

function doCountyMouseOut() {
    this.bringToBack();
    this.setStyle({
        weight: 1,
        opacity:myMouseOutFillOpacity
    });

    var this_geoid = this.feature.properties['geoid'];
    d3.selectAll(".bar[geoid='"+this_geoid+"']")
        .classed({'active':false})
        .style("opacity",1.0);
}

function doCountyClick() {
    /*

    We do a couple of things here:

    1) de-highlight all counties
        [may want to update this behavior]

    2) highlight the clicked county 

    2-B) update bar chart

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
    // Step 2.5-B
    //
    // Highlight the bar on the bar chart
    // corresponding to this county.

    this_geoid = this.feature.properties['geoid'];
    d3.selectAll(".bar[geoid]")
        .classed({'selected':false});
    d3.selectAll(".bar[geoid='"+this_geoid+"']")
        .classed({'selected':true});

    // Step 2.5 C
    //
    // Update tooltip
    //d3.select('div[id="barchart"]')
    //    .call()
    write_labels(this.feature.properties);



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


    // Ajax: 
    // Load census tract data
    // Everything in this block depends on census data
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
            // In-between convenience step:
            //
            // Create a leaflet-to-geoid map
            // 
            // This was not necessary before
            // because our leaflet id was stored
            // together with our geoid.
            //
            // But for the scatterplot, each dot
            // only knows the geoid - not the leaflet id. 
            //
            // NOTE:
            // We could fix this by adding the leaflet id
            // as an attribute of the circles...

            var leafletid_to_geoid = {};
            var geoid_to_leafletid = {};

            map_census.eachLayer(function(layer) {
                if(layer['options']) {
                    if(layer['_layers']) {

                        layers = layer['_layers'];
                        for(var key in layers){

                            // NOTE:
                            // This will probably choke 
                            // on highlighting multi-entity 
                            // census tracts...
                            //
                            // This is one-to-many, not one-to-one
                            var lay = layers[key];
                            leaflet_id = lay._leaflet_id;
                            geo_id = lay.feature.properties['geoid'];

                            leafletid_to_geoid[leaflet_id] = geo_id
                            geoid_to_leafletid[geo_id] = leaflet_id
                        }

                    }
                }
            });

            // Next we'll use this to
            // add leaflet id as an attribute
            // to each circle, 
            // to make it easy to grab
            // a reference to the leaflet
            // object corresponding to the 
            // dot.

            // Done w in-between 
            // convenience step
            //
            // -------------------------------------




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


            var xkey = 'Total_Ed_Mean';
            var xlabel = 'Average Education Level';
            var ykey = 'Total_Ed_Var';
            var ylabel = 'Educational Diversity (Variance)';
            var rkey = 'Total_Total';

            var xmin = d3.min(data.features, function(d) { if(d.properties['Total_Total']>pop_limit) { return d.properties[xkey]; } });
            var xmax = d3.max(data.features, function(d) { if(d.properties['Total_Total']>pop_limit) { return d.properties[xkey]; } });

            var ymin = d3.min(data.features, function(d) { if(d.properties['Total_Total']>pop_limit) { return d.properties[ykey]; } });
            var ymax = d3.max(data.features, function(d) { if(d.properties['Total_Total']>pop_limit) { return d.properties[ykey]; } });

            var rmin = d3.min(data.features, function(d) { if(d.properties['Total_Total']>pop_limit) { return Math.log(d.properties[rkey]); } });
            var rmax = d3.max(data.features, function(d) { if(d.properties['Total_Total']>pop_limit) { return Math.log(d.properties[rkey]); } });

            //var mean_education_dom = [1.0,4.0];
            //var var_education_dom = [0.5,4];
            var mean_education_dom = [0.9*xmin,1.1*xmax];
            var var_education_dom = [0.9*ymin,1.1*ymax];

            var scatterg = scattersvg.selectAll("circle")
                .data(data.features)
                .enter()
                .append("circle")
                .attr("class","inactive scattercircles")
                .attr("geoid",function(d) {
                    return d.properties['geoid'];
                })
                .attr("leafletid",function(d) {
                    var geoid = d.properties['geoid'];
                    return geoid_to_leafletid[geoid];
                })
                .attr("id",function(d) {
                    return d.properties['geoid'];
                })
                .attr("cx",function(d) {
                    // each x value is shifted by 1.5 (the mean education domain left point)
                    var xnorm = (d.properties[xkey] - mean_education_dom[0])/(mean_education_dom[1] - mean_education_dom[0]);
                    if(xnorm > 0.01) {
                        return scatter_xpadding + xnorm*(scatter_width - 2*scatter_xpadding);
                    }
                })
                .attr("cy",function(d) {
                    var ynorm = (d.properties[ykey] - var_education_dom[0])/(var_education_dom[1] - var_education_dom[0]);
                    if(ynorm > 0.01) {
                        return (1-ynorm)*(scatter_height - 2*scatter_ypadding) + scatter_ypadding;
                    }
                })
                .attr("r", function(d) {
                    var r0 = 5;
                    if(d.properties['Total_Total']>pop_limit) {
                        return r0;
                    } else {
                        return 0;
                    }
                })
                .attr("fill",function(d) {
                    if(d.properties['Gender_Imbalance']>0) {
                        return gender_imbalance_scale.range()[0];
                    } else if(d.properties['Gender_Imbalance']<0) {
                        return gender_imbalance_scale.range()[1];
                    } else {
                        return '';
                    }
                })
                .on("mouseover",doScatterMouseOver)
                .on("mouseout", doScatterMouseOut)
                .on("click",    doScatterMouseClick);


            // -------
            // 3) Remove existing axis labels
            scattersvg.selectAll("g.axis").remove();
            scattersvg.selectAll("text.axislabel").remove();
            scattersvg.selectAll("text.axislabel").remove();

            // -------
            // 4) Construct the scatterplot axes
            
            var xrange0 = scatter_xpadding
            var xrange1 = scatter_width - scatter_xpadding 

            var yrange0 = scatter_height - scatter_ypadding
            var yrange1 = scatter_ypadding

            // Create scales to map values to pixel locations
            //(mean_education_dom and var_education_dom 
            // defined above)
            var xScale = d3.scale.linear()
                    .domain(mean_education_dom)
                    .range([xrange0,xrange1])
            var yScale = d3.scale.linear()
                    .domain(var_education_dom)
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
            xtrans = scatter_xpadding;
            ytrans = scatter_height - scatter_ypadding;

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
            yloc = scatter_height - scatter_ypadding/2
            scattersvg.append("text")
                .attr("class", "axislabel")
                .attr("id","xaxislabel")
                .attr("text-anchor", "middle")
                .attr("x",xloc)
                .attr("y",yloc)
                .text(xlabel);

            xloc = 0 - (scatter_height/2);
            yloc = scatter_ypadding/10;
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


        //var out = "";
        //out += "Name: "+f.properties['name']+"<br />";
        //out += "GeoID: "+f.properties['geoid']+"<br />";
        //out += "Total Ed Mean: "+f.properties['Total_Ed_Mean']+"<br />";
        //out += "Total Ed Var: "+f.properties['Total_Ed_Var']+"<br />";
        //out += "Total: "+f.properties['Total_Total'];
        //l.bindPopup(out);
    }
}






/////////////////////////////////////////////////////////
//
// Color Scales 
// ordinal and linear

var scales_width = 350;
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
        .domain([1.0,5.0])
        .range([0,450]);

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
        weight: 2.0,
        opacity:myMouseOverThickFillOpacity
    });
    var tract = this.feature.properties.name;
    var tract_geo_id = this.feature.properties.geoid;
    // --------------------------
    // Add census tract circle outline 
    d3.selectAll("circle[geoid='"+tract_geo_id+"']")
        .attr("class","active")
        .moveToFront();
}

function doCensusMouseOut() {

    this.bringToBack();
    this.setStyle({
        weight: 0.5,
        opacity: myMouseOutFillOpacity
    });

    var tract = this.feature.properties.name;
    var tract_geo_id = this.feature.properties.geoid;

    // --------------------------
    // Remove census tract outline
    d3.selectAll("circle[geoid='"+tract_geo_id+"']")
        .attr("class","inactive");

}




function doCensusClick() {

    var tract = this.feature.properties.name;
    var tract_geo_id = this.feature.properties.geoid;

    var $tooltip = $('.census');
    $tooltip.text(tract).show();

    // leaflet ids for clicked census tract
    these_layer_ids = Object.keys(this._layers);

    
    var red2 = '#df65b0';


    ////////////////////////////////////
    // When a user clicks on a census tract,
    // highlight that census tract
    // on the D3 scatter plot.
    //
    // This has two parts:
    // 1) Highlight census tract on map
    // 2) Highlight corresponding scatter plot element

    these_layer_ids.forEach(function(this_layer_id){

        // --------------------------
        // Step 1: 
        // Highlight census tract on map

        map_census.eachLayer(function(layer) {

            var that_layer_id = layer._leaflet_id;

            var options_ = layer['_options'];
            var options = layer['options'];

            if (this_layer_id==that_layer_id) {

                // This is pretty wonky.
                // I can't figure out when I use options or _options,
                // layers or _layers,
                // or what.

                var orig_fillColor = options['fillColor'];
                if(options['fillColor']!=red2) {
                    layer.setStyle({
                        fillColor: red2,
                        originalFillColor: orig_fillColor
                    });
                }

            } else if(options) {
                if(options['fillColor']==red2) {
                    layer.setStyle({
                        fillColor : options['originalFillColor']
                    });
                }
            }

        });

    });


    // --------------------------
    // Step 2: 

    // Highlight tract's dot on scatterplot

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

}

/////////////////////////////////////////////////////////
//
//
function doScatterMouseOver(d) {
    geo_id = d.properties['geoid'];

    // make scatterplot dot active
    d3.selectAll("circle[geoid='"+geo_id+"']")
        .attr("class","active scattercircles");

    this_layer_id = d3.select(this).attr("leafletid");

    // outline the census tract on the map
    // (make it active)
    map_census.eachLayer(function(layer) {

        // For each of these leaflet ids,
        // we need to obtain the shapes
        // in that particular layer
        that_layer_id = layer._leaflet_id;

        if (this_layer_id==that_layer_id) {
            layer.setStyle({
                weight: 2.0,
                opacity: myMouseOverThickFillOpacity
            });
        }
    });
}

function doScatterMouseOut(d) {
    geo_id = d.properties['geoid'];

    // make scatterplot dot inactive
    d3.selectAll("circle[geoid='"+geo_id+"']")
        .attr("class","inactive scattercircles");

    this_layer_id = d3.select(this).attr("leafletid");

    // remove outline on the census tract on the map
    // (make it inactive)
    map_census.eachLayer(function(layer) {

        // For each of these leaflet ids,
        // we need to obtain the shapes
        // in that particular layer
        that_layer_id = layer._leaflet_id;

        if (this_layer_id==that_layer_id) {
            layer.setStyle({
                weight: 0.5,
                opacity: myMouseOverThickFillOpacity
            });
        }
    });
}

function doScatterMouseClick(d) {

    // user clicked scatter plot point,
    // so highlight scatter plot point
    // then highlight corresponding census tract

    // get leaflet layer based on geoid

    var tract  = d.properties.name;
    var geo_id = d.properties['geoid'];


    red3 = '#df65b0';


    // --------------------------
    // Step 1: 
    // Highlight scatter plot point 

    // 1A: clear old highlighting 
    d3.selectAll("circle[fill='"+red3+"']")
        .attr("fill",function(d) { 
            if(d.properties['originalFill']) {
                return d.properties['originalFill'];
            }
        })
    .moveToBack();

    // 1B: save old color, set new color
    d3.selectAll("circle[geoid='"+geo_id+"']")
        .each(function(d){
            d.properties['originalFill'] = this.attributes.fill.value;
        })
    d3.selectAll("circle[geoid='"+geo_id+"']")
        .attr("class","active selected scattercircles")
        .attr("fill",red3)
        .moveToFront();



    // FIXME:
    // this does not account for the case 
    // of multiple leaflet IDs
    // (i.e., counties with multiple entities)



    // --------------------------
    // Step 2: 
    // Highlight census tract on map
    //
    // since much of this is shared with doCensusClick,
    // these two methods could be consolidated into a 
    // function that takes a geoid.
    this_layer_id = d3.select(this).attr("leafletid");
    map_census.eachLayer(function(layer) {

        var that_layer_id = layer._leaflet_id;

        var options_ = layer['_options'];
        var options = layer['options'];

        if (this_layer_id==that_layer_id) {

            // This is pretty wonky.
            // I can't figure out when I use options or _options,
            // layers or _layers,
            // or what.

            var opts = layer['_layers'][this_layer_id-1]['options'];
            var orig_fillColor = opts['fillColor'];
            layer.setStyle({
                fillColor: red3,
                originalFillColor: orig_fillColor
            });
        } else if(options) {
            if(options['fillColor']==red3) {
                layer.setStyle({
                    fillColor : options['originalFillColor']
                });
            }
        }

    });

}



