
////////////////////////////////////////////////////

var map = L.map('map').setView([37.7, -122.4], 6);
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'US Census Bureau',
    maxZoom: 18
}).addTo(map);



function getColorBlue(d) {
    // 6 scale blues
    var colors = ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'];
    return colors[Math.round((d/0.50)*colors.length)];
};

key1 = 'A_Below100PovLn_PublicTrans_CountyPct'

function enhanceLayer1(f,l){
    var out = [];
    if (f.properties){
        l.setStyle({    
            fillColor: getColorBlue(f.properties[key1]),
            fillOpacity: 0.80,
            stroke: true,
            color: '#222',
            weight: 1
        });
        l.on({
            mouseover: layerMouseover,
            mouseout: layerMouseout,
            click: layerMouseclick
        });
    }
}

var $tooltip = $('.county');

function layerMouseover() {
    this.bringToFront();
    this.setStyle({
        weight:3,
        opacity: 1
    });
}

function layerMouseout() {
    this.bringToBack();
    this.setStyle({
        weight:1,
        opacity:.8
    });
}

var Nclicks = 0;
function layerMouseclick() {
    var county = this.feature.properties.name;
    $tooltip.text("County: "+county).show();

    red = '#ff0000';

    these_layer_ids = Object.keys(this._layers);


    // First, make sure no counties are red.
    // Restore any previously red counties
    // to their original color.
    map.eachLayer(function(layer) {
        if(layer.options) {
            if( layer['options']['fillColor'] ) {
                if(layer.options['fillColor']===red) {
                    //console.log("Returning active fill color back to original fill color.");
                    //console.log("Before: "+layer.options['fillColor']);
                    layer.setStyle(
                        {'fillColor':layer.options['originalFillColor'] }
                    )
                    //console.log("After: "+layer.options['fillColor']);
                    //console.log("Original: "+layer.options['originalFillColor']);
                }
            }
        }
    });



    // Now make the county the user clicked red.
    // Some counties have multiple pieces,
    // so we need to use var these_layer_ids
    map.eachLayer(function(layer,ii) {
        
        if( layer['options'] ){

            these_layer_ids.forEach( function(this_layer_id) {

                if(layer['_leaflet_id']==this_layer_id) {
                    if(layer['options']['fillColor']){
                        // Get the county's current color.
                        orig_fillColor = layer['options']['fillColor'];

                        // Check if county is already red.
                        // If not, make it red.
                        if( orig_fillColor===red) {
                            var a=0;

                        } else {
                            // set style to red 
                            layer.setStyle({
                                'fillColor' : red,
                                'originalFillColor' : orig_fillColor
                            });
                        }

                    } else {
                        layer.setStyle({
                            'fillColor' : red,
                            'originalFillColor' : red
                        });
                    }
                }
            });
        }
    });




    data_keys = Object.keys(this.feature.properties);
    this.feature.properties['A_Below100PovLn_BikeEtc_CountyPct'];

    // Assemble our pie chart data
    key1 = 'A_Below100PovLn_Walked_CountyPct';
    key2 = 'A_Below100PovLn_BikeEtc_CountyPct';
    key3 = 'A_Below100PovLn_PublicTrans_CountyPct';
    key4 = 'A_Below100PovLn_DroveCarpool_CountyPct';
    key5 = 'A_Below100PovLn_DroveAlone_CountyPct';

    lab1 = 'Walked'
    lab2 = 'Biked'
    lab3 = 'Public Transit'
    lab4 = 'Carpool'
    lab5 = 'Drove Alone'

    pie_data = [{'cat' : lab1, 'key' : key1, 'dat' : this.feature.properties[key1]},
                {'cat' : lab2, 'key' : key2, 'dat' : this.feature.properties[key2]},  
                {'cat' : lab3, 'key' : key3, 'dat' : this.feature.properties[key3]},  
                {'cat' : lab4, 'key' : key4, 'dat' : this.feature.properties[key4]},  
                {'cat' : lab5, 'key' : key5, 'dat' : this.feature.properties[key5]}]  






    // This basically uses data0 and data1 to 
    // update new locations for pie slices.
    // it then draws the new ones. 
    // its mostly magic.
    //
    // http://bl.ocks.org/mbostock/5682158
    //
    //
    //
    //we have to set path hree, 
    //as we don't update it after we 
    //make our initial drawing...
    //

    //console.log("Path, just before our first transition:");
    //path.each(function(d,i){ console.log(d);});

    // path[0] = {'startAngle' : 0
    //            'endAngle' : 1.25}
    //
    // path[1] = {'startAngle' : 1.25,
    //            'endAngle' : 2.51


    var data0 = path.data(); 
    var data1 = pie(pie_data);

    path = path.data(data1, key);

    var labelr = radius + 30;

    Nclicks = Nclicks + 1;

    ////////////////////////////////////////////
    // animate transitions
    //
    path.enter().append("path")
        .each(function(d, i) { 
            //console.log("Data0:");
            //console.log(data0);
            //console.log("Data1:");
            //console.log(data1);
            this._current = findNeighborArc(i, data0, data1, key) || d; 
        })
        .attr("fill", function(d) { 
            return color(d.data.cat); })

    path.exit()
        .datum(function(d, i) { 
            return findNeighborArc(i, data1, data0, key) || d; 
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();

    path.transition()
        .duration(750)
        .attrTween("d", arcTween);

    ////////////////////////////////////////////


    // Labels

    // Calculate position 
    //txts.remove();
    //txts = path.append("text")

    /*
    // 02/18/2015
    // early evening
    //
    // YOU ARE HERE
    //
    // This is correctly computing new arcs from the centroid.
    // However, updating the text label location isn't working.
    //
    txts.attr("transform", function(d) { 
            //console.log(d.data.cat);
            //console.log(arc.centroid(d));
            return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { 
            return d.data.cat; 
        });
    */

    // --------------------------------------------------------
    // Start labels code
    // 
    // from http://bl.ocks.org/dbuezas/9306799
    // adding labels with lines
    //
    // note that there isn't a PIE, 
    // per se, just a bunch of things
    // using a pie() function to split 
    // information apart and use it for 
    // drawing shapes.
    var text = svg.select(".labels").selectAll("text")
        .data(data1);
        //.data(pie(pie_data));
        //.data(pie(init_data), key);
    
    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .style("font-size", "11px")
        .attr("transform", function(d) { 
            return "translate(" + arc.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.cat;
        });
    
    //function midAngle(d){
    //    return d.startAngle + (d.endAngle - d.startAngle)/2;
    //}
    
    
    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                //pos[1] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });
    
    text.exit()
        .remove();
    
    
    //polylines
    
    var polyline = svg.select(".lines").selectAll("polyline")
        .data(data1);
    
    polyline.enter()
        .append("polyline");
    
    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                //pos[1] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };          
        });
    
    polyline.exit()
        .remove();
    
    
    // End labels code
    // ----------------------------------------------------------



}

function key(d) {
    return d.data.cat;
}

function findNeighborArc(i, data0, data1, key) {
  var d;
  return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
      : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
      : null;
}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length, m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

function arcTween(d) {
    var i = d3.interpolate(this._current, d);
    this._current = i(0);
    return function(t) { return arc(i(t)); };
}














/////////////////////////////////////////////////////////////////
// add geojson to map


//var prefix = "http://charlesreid1.github.io/a-shrubbery/";
var prefix = "/"
var geoj1 = new L.geoJson.ajax(
                    prefix+"cacommuterincome.geojson",
                    {onEachFeature : enhanceLayer1}
                ).addTo(map);


// end add geojson
/////////////////////////////////////////////////////////////////









////////////////////////////////////////////////////
//// d3 geom

var categories = ["Walked", "Biked", "Public Transit", "Carpool", "Drove Alone"];


// set size of canvas
// width and height
var width = 500,
    height = 500,
    padding = 180,
    radius = Math.min(width-padding, height-padding) / 2;

var color = d3.scale.ordinal()
    .domain(categories)
    .range(["#018571", "#80cdc1", "#ddd", "#dfc27d", "#a6611a"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 1.0)
    .outerRadius(radius * 1.0);

var outerOuterArc = d3.svg.arc()
    .innerRadius(radius * 2.0)
    .outerRadius(radius * 2.0);

lab1 = 'Walked'
lab2 = 'Biked'
lab3 = 'Public Transit'
lab4 = 'Carpool'
lab5 = 'Drove Alone'

init_data = [{'cat' : lab1, 'dat' : 1.0},
             {'cat' : lab2, 'dat' : 1.0},  
             {'cat' : lab3, 'dat' : 1.0},  
             {'cat' : lab4, 'dat' : 1.0},  
             {'cat' : lab5, 'dat' : 1.0}];

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.dat; });

var svg = d3.select("div.graph").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("g").attr("class","labels");
svg.append("g").attr("class","lines");

var g = svg.selectAll(".arc")
    .data(pie(init_data))
    .enter().append("g")
    .attr("class","arc");

g.append("path")
    .attr("d", arc)
    .attr("data-legend", function(d){
        return d.data.cat; })
    .attr("data-legend-pos",function(d,i) {
        return categories[i]; })
    .style("fill", function(d) { 
        return color(d.data.cat); });


/*
//////////////////////////////////
// DO NOT DELETE
/////////////////////////////////
// This works. adds labels on top of arcs.
txts = g.append("text")
    .attr("transform", function(d) { 
        return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { 
        return d.data.cat; 
    });
//////////////////////////////////
// END DO NOT DELETE
/////////////////////////////////
*/


    
// --------------------------------------------------------
// Start labels code
// 
// from http://bl.ocks.org/dbuezas/9306799
// adding labels with lines
//
// note that there isn't a PIE, 
// per se, just a bunch of things
// using a pie() function to split 
// information apart and use it for 
// drawing shapes.
var text = svg.select(".labels").selectAll("text")
    .data(pie(init_data));;
    //.data(pie(init_data), key);

text.enter()
    .append("text")
    .attr("dy", ".35em")
    .style("font-size", "11px")
    .attr("transform", function(d) { 
        return "translate(" + arc.centroid(d) + ")"; })
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.data.cat;
    });

function midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
}


text.transition().duration(1000)
    .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            //pos[1] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
        };
    })
    .styleTween("text-anchor", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start":"end";
        };
    });

text.exit()
    .remove();


//polylines

var polyline = svg.select(".lines").selectAll("polyline")
    .data(pie(init_data), key);

polyline.enter()
    .append("polyline");

polyline.transition().duration(1000)
    .attrTween("points", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            //pos[1] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };          
    });

polyline.exit()
    .remove();


// End labels code
// ----------------------------------------------------------


// add a legend 
// via d3.legend.js
legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(-20,-20)")
    .style("font-size", "11px")
    .call(d3.legend)



var path = svg.selectAll("path");


// we shouldn't need to do this to animate the plot.
// setting the initial state just gives transitions 
// a starting point.
// 
// the problem is with the first transition,
// not picking up the initial data.
//


// since the first graph is messed up...
// walk through what the subsequent graphs do.

data_init0 = path.data();
data_init1 = pie(init_data);

path = path.data(data_init1, key);


// Animate transitions...
path.each(function(d, i) { 
        this._current = findNeighborArc(i, data_init0, data_init1, key) || d; 
    })
    .attr("fill", function(d) { 
        return color(d.data.cat); })

// this happens when user clicks on a county
path.exit()
    .datum(function(d, i) { 
        return findNeighborArc(i, data_init1, data_init0, key) || d; 
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTween)
    .remove();

// this happens on page load
path.transition()
    .duration(750)
    .attrTween("d", arcTween);

// end d3 geom 
/////////////////////////////////////////////////////////////////







