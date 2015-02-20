
////////////////////////////////////////////////////

var map = L.map('map').setView([37.7, -119.5], 6);
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'US Census Bureau',
    maxZoom: 18
}).addTo(map);






function getColorBlue(d) {
    //// 6 scale blues
    //var colors = ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'];
    // 5 scale tan/brown
    //var colors = [ '#f6e8c3', '#dfc27d', '#bf812d', '#8c510a', '#543005', ];
    //return colors[Math.round((d/0.50)*colors.length)];
};

countyColors = d3.scale.category20c();

var myFillOpacity = 0.55;
var myThickFillOpacity = 0.90;

var polylineOpacity = 0.30;

var pctDisplayThreshold = 0.02;


key1 = 'A_Below100PovLn_PublicTrans_CountyPct'

function enhanceLayer1(f,l){
    var out = [];
    if (f.properties){
        l.setStyle({    
            fillColor: countyColors( Math.round(Math.random()*15-1) ),
            //getColorBlue(f.properties[key1]),
            fillOpacity: myFillOpacity,
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

    red = '#ff0000'
    //red = '#7a0177';//purple
    //red = '#80cdc1'//dark turq

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
                        {
                            'fillColor':layer.options['originalFillColor'],
                            'fillOpacity' : myFillOpacity
                        }
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
                                'fillOpacity' : myThickFillOpacity,
                                'originalFillColor' : orig_fillColor
                            });
                        }

                    } else {
                        layer.setStyle({
                            'fillColor' : red,
                            'fillOpacity' : myThickFillOpacity,
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
    key1_1 = 'A_Below100PovLn_Walked_CountyPct';
    key2_1 = 'A_Below100PovLn_BikeEtc_CountyPct';
    key3_1 = 'A_Below100PovLn_PublicTrans_CountyPct';
    key4_1 = 'A_Below100PovLn_DroveCarpool_CountyPct';
    key5_1 = 'A_Below100PovLn_DroveAlone_CountyPct';

    key1_2 = 'B_Btwn100_149PovLn_Walked_CountyPct';
    key2_2 = 'B_Btwn100_149PovLn_BikeEtc_CountyPct';
    key3_2 = 'B_Btwn100_149PovLn_PublicTrans_CountyPct';
    key4_2 = 'B_Btwn100_149PovLn_DroveCarpool_CountyPct';
    key5_2 = 'B_Btwn100_149PovLn_DroveAlone_CountyPct';

    key1_3 = 'C_Above150PovLn_Walked_CountyPct';
    key2_3 = 'C_Above150PovLn_BikeEtc_CountyPct';
    key3_3 = 'C_Above150PovLn_PublicTrans_CountyPct';
    key4_3 = 'C_Above150PovLn_DroveCarpool_CountyPct';
    key5_3 = 'C_Above150PovLn_DroveAlone_CountyPct';

    lab1 = 'Walked'
    lab2 = 'Biked'
    lab3 = 'Public Transit'
    lab4 = 'Carpool'
    lab5 = 'Drove Alone'

    pie_data1 = [{'cat' : lab1, 'key' : key1_1, 'dat' : this.feature.properties[key1_1]},
                 {'cat' : lab2, 'key' : key2_1, 'dat' : this.feature.properties[key2_1]},  
                 {'cat' : lab3, 'key' : key3_1, 'dat' : this.feature.properties[key3_1]},  
                 {'cat' : lab4, 'key' : key4_1, 'dat' : this.feature.properties[key4_1]},  
                 {'cat' : lab5, 'key' : key5_1, 'dat' : this.feature.properties[key5_1]}]  

    pie_data2 = [{'cat' : lab1, 'key' : key1_2, 'dat' : this.feature.properties[key1_2]},
                 {'cat' : lab2, 'key' : key2_2, 'dat' : this.feature.properties[key2_2]},  
                 {'cat' : lab3, 'key' : key3_2, 'dat' : this.feature.properties[key3_2]},  
                 {'cat' : lab4, 'key' : key4_2, 'dat' : this.feature.properties[key4_2]},  
                 {'cat' : lab5, 'key' : key5_2, 'dat' : this.feature.properties[key5_2]}]  

    pie_data3 = [{'cat' : lab1, 'key' : key1_3, 'dat' : this.feature.properties[key1_3]},
                 {'cat' : lab2, 'key' : key2_3, 'dat' : this.feature.properties[key2_3]},  
                 {'cat' : lab3, 'key' : key3_3, 'dat' : this.feature.properties[key3_3]},  
                 {'cat' : lab4, 'key' : key4_3, 'dat' : this.feature.properties[key4_3]},  
                 {'cat' : lab5, 'key' : key5_3, 'dat' : this.feature.properties[key5_3]}]  



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


    //var data0 = path.data(); 
    //var data1 = pie(pie_data);

    var data0_1 = path1.data(); 
    var data1_1 = pie(pie_data1);

    var data0_2 = path2.data(); 
    var data1_2 = pie(pie_data2);

    var data0_3 = path3.data(); 
    var data1_3 = pie(pie_data3);



    //path = path.data(data1, key);
    path1 = path1.data(data1_1, key);
    path2 = path2.data(data1_2, key);
    path3 = path3.data(data1_3, key);



    var labelr = radius + 30;

    Nclicks = Nclicks + 1;

    ////////////////////////////////////////////
    // animate transitions
    //
    /*
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
    */

    path1.enter().append("path")
        .each(function(d, i) { 
            this._current = findNeighborArc(i, data0_1, data1_1, key) || d; 
        })
        .attr("fill", function(d) { 
            return color(d.data.cat); })

    path2.enter().append("path")
        .each(function(d, i) { 
            this._current = findNeighborArc(i, data0_2, data1_2, key) || d; 
        })
        .attr("fill", function(d) { 
            return color(d.data.cat); })

    path3.enter().append("path")
        .each(function(d, i) { 
            this._current = findNeighborArc(i, data0_3, data1_3, key) || d; 
        })
        .attr("fill", function(d) { 
            return color(d.data.cat); })




    /*
    path.exit()
        .datum(function(d, i) { 
            return findNeighborArc(i, data1, data0, key) || d; 
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();
    */

    path1.exit()
        .datum(function(d, i) { 
            return findNeighborArc(i, data1_1, data0_1, key) || d; 
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();
    path2.exit()
        .datum(function(d, i) { 
            return findNeighborArc(i, data1_2, data0_2, key) || d; 
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();
    path3.exit()
        .datum(function(d, i) { 
            return findNeighborArc(i, data1_3, data0_3, key) || d; 
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();




    /*
    path.transition()
        .duration(750)
        .attrTween("d", arcTween);
    */

    path1.transition()
        .duration(750)
        .attrTween("d", arcTween);
    path2.transition()
        .duration(750)
        .attrTween("d", arcTween);
    path3.transition()
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


    /*
    var text = svg.select(".labels").selectAll("text")
        .data(data1);
        //.data(pie(pie_data));
        //.data(pie(init_data), key);
    */

    var text1 = svg1.select(".labels").selectAll("text")
        .data(data1_1);
    var text2 = svg2.select(".labels").selectAll("text")
        .data(data1_2);
    var text3 = svg3.select(".labels").selectAll("text")
        .data(data1_3);



    
    //text.append("text")
    /*
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
    */

    text1.enter()
        .append("text")
        .attr("dy", ".35em")
        .style("font-size", "11px")
        .attr("transform", function(d) { 
            return "translate(" + arc.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.cat;
        });
    text2.enter()
        .append("text")
        .attr("dy", ".35em")
        .style("font-size", "11px")
        .attr("transform", function(d) { 
            return "translate(" + arc.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.cat;
        });
    text3.enter()
        .append("text")
        .attr("dy", ".35em")
        .style("font-size", "11px")
        .attr("transform", function(d) { 
            return "translate(" + arc.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.cat;
        });




    /*
    text.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? 1.0 : 0.0;
        });
    */
    text1.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? 1.0 : 0.0;
        });
    text2.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? 1.0 : 0.0;
        });
    text3.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? 1.0 : 0.0;
        });


    
    //function midAngle(d){
    //    return d.startAngle + (d.endAngle - d.startAngle)/2;
    //}
    

    /*
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
    */

    text1.transition().duration(1000)
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
    text2.transition().duration(1000)
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
    text3.transition().duration(1000)
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




    
    /*
    text.exit()
        .remove();
    */
    text1.exit()
        .remove();
    text2.exit()
        .remove();
    text3.exit()
        .remove();




    
    
    //polylines
    
    /*
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

    polyline.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? polylineOpacity : 0.0;
        });
    
    polyline.exit()
        .remove();
    */


    // ------------


    var polyline1 = svg1.select(".lines").selectAll("polyline")
        .data(data1_1);
    
    polyline1.enter()
        .append("polyline");
    
    polyline1.transition().duration(1000)
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

    polyline1.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? polylineOpacity : 0.0;
        });
    
    polyline1.exit()
        .remove();
    

    // ------------


    var polyline2 = svg2.select(".lines").selectAll("polyline")
        .data(data1_2);
    
    polyline2.enter()
        .append("polyline");
    
    polyline2.transition().duration(1000)
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

    polyline2.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? polylineOpacity : 0.0;
        });
    
    polyline2.exit()
        .remove();
    

    // ------------


    var polyline3 = svg3.select(".lines").selectAll("polyline")
        .data(data1_3);
    
    polyline3.enter()
        .append("polyline");
    
    polyline3.transition().duration(1000)
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

    polyline3.style("opacity",function(d) {
            var visible = (d.data.dat > pctDisplayThreshold);
            return visible ? polylineOpacity : 0.0;
        });
    
    polyline3.exit()
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
    height = 400,
    padding = 100,
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

//var svg = d3.select("div.graph").append("svg")
//    .attr("width", width)
//    .attr("height", height)
//  .append("g")
//    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var svg1 = d3.select("div.graph1").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var svg2 = d3.select("div.graph2").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var svg3 = d3.select("div.graph3").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//svg.append("g").attr("class","labels");
//svg.append("g").attr("class","lines");
svg1.append("g").attr("class","labels");
svg1.append("g").attr("class","lines");
svg2.append("g").attr("class","labels");
svg2.append("g").attr("class","lines");
svg3.append("g").attr("class","labels");
svg3.append("g").attr("class","lines");

//var g = svg.selectAll(".arc")
//    .data(pie(init_data))
//    .enter().append("g")
//    .attr("class","arc");
var g1 = svg1.selectAll(".arc")
    .data(pie(init_data))
    .enter().append("g")
    .attr("class","arc");
var g2 = svg2.selectAll(".arc")
    .data(pie(init_data))
    .enter().append("g")
    .attr("class","arc");
var g3 = svg3.selectAll(".arc")
    .data(pie(init_data))
    .enter().append("g")
    .attr("class","arc");

/*
g.append("path")
    .attr("d", arc)
    .attr("data-legend", function(d){
        return d.data.cat; })
    .attr("data-legend-pos",function(d,i) {
        return categories[i]; })
    .style("fill", function(d) { 
        return color(d.data.cat); });
*/
g1.append("path")
    .attr("d", arc)
    .attr("data-legend", function(d){
        return d.data.cat; })
    .attr("data-legend-pos",function(d,i) {
        return categories[i]; })
    .style("fill", function(d) { 
        return color(d.data.cat); });
g2.append("path")
    .attr("d", arc)
    .attr("data-legend", function(d){
        return d.data.cat; })
    .attr("data-legend-pos",function(d,i) {
        return categories[i]; })
    .style("fill", function(d) { 
        return color(d.data.cat); });
g3.append("path")
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



//var text = svg.select(".labels").selectAll("text")
//    .data(pie(init_data));;
var text1 = svg1.select(".labels").selectAll("text")
    .data(pie(init_data));;
var text2 = svg2.select(".labels").selectAll("text")
    .data(pie(init_data));;
var text3 = svg3.select(".labels").selectAll("text")
    .data(pie(init_data));;


//text.enter()
//    .append("text")
//    .attr("dy", ".35em")
//    .style("font-size", "11px")
//    .attr("transform", function(d) { 
//        return "translate(" + arc.centroid(d) + ")"; })
//    .style("text-anchor", "middle")
//    .text(function(d) {
//        return d.data.cat;
//    });
text1.enter()
    .append("text")
    .attr("dy", ".35em")
    .style("font-size", "11px")
    .attr("transform", function(d) { 
        return "translate(" + arc.centroid(d) + ")"; })
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.data.cat;
    });
text2.enter()
    .append("text")
    .attr("dy", ".35em")
    .style("font-size", "11px")
    .attr("transform", function(d) { 
        return "translate(" + arc.centroid(d) + ")"; })
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.data.cat;
    });
text3.enter()
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




/*
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
*/

text1.transition().duration(1000)
    .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
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
text1.exit()
    .remove();

text2.transition().duration(1000)
    .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
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
text2.exit()
    .remove();

text3.transition().duration(1000)
    .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
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
text3.exit()
    .remove();




//polylines

/*
var polyline = svg.select(".lines").selectAll("polyline")
    .data(pie(init_data), key);
*/
var polyline1 = svg1.select(".lines").selectAll("polyline")
    .data(pie(init_data), key);
var polyline2 = svg2.select(".lines").selectAll("polyline")
    .data(pie(init_data), key);
var polyline3 = svg3.select(".lines").selectAll("polyline")
    .data(pie(init_data), key);

/*
polyline.enter()
    .append("polyline");
*/
polyline1.enter()
    .append("polyline");
polyline2.enter()
    .append("polyline");
polyline3.enter()
    .append("polyline");


/*
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
*/

polyline1.transition().duration(1000)
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
polyline2.transition().duration(1000)
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
polyline3.transition().duration(1000)
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


/*
polyline.exit()
    .remove();
*/
polyline1.exit()
    .remove();
polyline2.exit()
    .remove();
polyline3.exit()
    .remove();



// End labels code
// ----------------------------------------------------------


// add a legend 
// via d3.legend.js
/*
legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(-20,-20)")
    .style("font-size", "11px")
    .call(d3.legend)
*/

legend1 = svg1.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(-20,-20)")
    .style("font-size", "11px")
    .call(d3.legend)

legend2 = svg2.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(-20,-20)")
    .style("font-size", "11px")
    .call(d3.legend)

legend3 = svg3.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(-20,-20)")
    .style("font-size", "11px")
    .call(d3.legend)



/*
var path = svg.selectAll("path");
*/
var path1 = svg1.selectAll("path");
var path2 = svg2.selectAll("path");
var path3 = svg3.selectAll("path");


// we shouldn't need to do this to animate the plot.
// setting the initial state just gives transitions 
// a starting point.
// 
// the problem is with the first transition,
// not picking up the initial data.
//


// since the first graph is messed up...
// walk through what the subsequent graphs do.

//data_init0 = path.data();
//data_init1 = pie(init_data);
//
data_init0_1 = path1.data();
data_init1_1 = pie(init_data);

data_init0_2 = path2.data();
data_init1_2 = pie(init_data);

data_init0_3 = path3.data();
data_init1_3 = pie(init_data);



//path = path.data(data_init1, key);
path1 = path1.data(data_init1_1, key);
path2 = path2.data(data_init1_2, key);
path3 = path3.data(data_init1_3, key);






// Animate transitions...
/*
path.each(function(d, i) { 
        this._current = findNeighborArc(i, data_init0, data_init1, key) || d; 
    })
    .attr("fill", function(d) { 
        return color(d.data.cat); })
*/

path1.each(function(d, i) { 
        this._current = findNeighborArc(i, data_init0_1, data_init1_1, key) || d; 
    })
    .attr("fill", function(d) { 
        return color(d.data.cat); })

path2.each(function(d, i) { 
        this._current = findNeighborArc(i, data_init0_2, data_init1_2, key) || d; 
    })
    .attr("fill", function(d) { 
        return color(d.data.cat); })

path3.each(function(d, i) { 
        this._current = findNeighborArc(i, data_init0_3, data_init1_3, key) || d; 
    })
    .attr("fill", function(d) { 
        return color(d.data.cat); })








// this happens when user clicks on a county
/*
path.exit()
    .datum(function(d, i) { 
        return findNeighborArc(i, data_init1, data_init0, key) || d; 
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTween)
    .remove();
*/

path1.exit()
    .datum(function(d, i) { 
        return findNeighborArc(i, data_init1_1, data_init0_1, key) || d; 
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTween)
    .remove();
path2.exit()
    .datum(function(d, i) { 
        return findNeighborArc(i, data_init1_2, data_init0_2, key) || d; 
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTween)
    .remove();
path3.exit()
    .datum(function(d, i) { 
        return findNeighborArc(i, data_init1_3, data_init0_3, key) || d; 
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTween)
    .remove();





// this happens on page load
//path.transition()
//    .duration(750)
//    .attrTween("d", arcTween);
path1.transition()
    .duration(750)
    .attrTween("d", arcTween);
path2.transition()
    .duration(750)
    .attrTween("d", arcTween);
path3.transition()
    .duration(750)
    .attrTween("d", arcTween);






// end d3 geom 
/////////////////////////////////////////////////////////////////







