
////////////////////////////////////////////////////

var map = L.map('map').setView([37.7, -122.4], 6);
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hhcmxlc3JlaWQxIiwiYSI6ImpreUJGM3MifQ.w5rSM7MjHv-SnOnt3gcqHA',{
    attribution: 'US Census Bureau',
    maxZoom: 18
}).addTo(map);



function getColorBlue(d) {
    // 6 scale blues
    var colors = ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'];
    return colors[Math.round((d/0.75)*colors.length)];
};



/*
{
"A_Below100PovLn_BikeEtc": 122.0,
"A_Below100PovLn_BikeEtc_CountyPct": 0.02109631679059312,
"A_Below100PovLn_DroveAlone": 4175.0,
"A_Below100PovLn_DroveAlone_CountyPct": 0.7219436278748055,
"A_Below100PovLn_DroveCarpool": 651.0,
"A_Below100PovLn_DroveCarpool_CountyPct": 0.11257132975964032,
"A_Below100PovLn_PublicTrans": 69.0,
"A_Below100PovLn_PublicTrans_CountyPct": 0.011931523430745288,
"A_Below100PovLn_Walked": 216.0,
"A_Below100PovLn_Walked_CountyPct": 0.03735085595711568,
"B_Btwn100_149PovLn_BikeEtc": 102.0,
"B_Btwn100_149PovLn_BikeEtc_CountyPct": 0.01766845660834921,
"B_Btwn100_149PovLn_DroveAlone": 4579.0,
"B_Btwn100_149PovLn_DroveAlone_CountyPct": 0.793175125584618,
"B_Btwn100_149PovLn_DroveCarpool": 593.0,
"B_Btwn100_149PovLn_DroveCarpool_CountyPct": 0.10271955655638317,
"B_Btwn100_149PovLn_PublicTrans": 52.0,
"B_Btwn100_149PovLn_PublicTrans_CountyPct": 0.009007448467001558,
"B_Btwn100_149PovLn_Walked": 205.0,
"B_Btwn100_149PovLn_Walked_CountyPct": 0.035510133379525376,
"C_Above150PovLn_BikeEtc": 1098.0,
"C_Above150PovLn_BikeEtc_CountyPct": 0.020321667191056984,
"C_Above150PovLn_DroveAlone": 44567.0,
"C_Above150PovLn_DroveAlone_CountyPct": 0.8248412948122374,
"C_Above150PovLn_DroveCarpool": 4246.0,
"C_Above150PovLn_DroveCarpool_CountyPct": 0.07858451629620034,
"C_Above150PovLn_PublicTrans": 371.0,
"C_Above150PovLn_PublicTrans_CountyPct": 0.006866428531768799,
"C_Above150PovLn_Walked": 754.0,
"C_Above150PovLn_Walked_CountyPct": 0.013954951786937128,
"geoid": "05000US06089",
"name": "Shasta County, CA"
}
*/


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
    key1 = 'A_Below100PovLn_BikeEtc_CountyPct';
    key2 = 'A_Below100PovLn_DroveAlone_CountyPct';
    key3 = 'A_Below100PovLn_DroveCarpool_CountyPct';
    key4 = 'A_Below100PovLn_PublicTrans_CountyPct';
    key5 = 'A_Below100PovLn_Walked_CountyPct';

    lab1 = 'Bike'
    lab2 = 'Drove Alone'
    lab3 = 'Drove Carpool'
    lab4 = 'Public Transit'
    lab5 = 'Walked'

    pie_data = [{'cat' : lab1, 'key' : key1, 'dat' : this.feature.properties[key1]},
                {'cat' : lab2, 'key' : key2, 'dat' : this.feature.properties[key2]},  
                {'cat' : lab3, 'key' : key3, 'dat' : this.feature.properties[key3]},  
                {'cat' : lab4, 'key' : key4, 'dat' : this.feature.properties[key4]},  
                {'cat' : lab5, 'key' : key5, 'dat' : this.feature.properties[key5]}]  

    //console.log("Data for "+this.feature.properties['name']);
    //console.log(pie_data);



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

    console.log("Path, just before our first transition:");
    path.each(function(d,i){ console.log(d);});
    //
    // path[0] = {'startAngle' : 0
    //            'endAngle' : 1.25}
    //
    // path[1] = {'startAngle' : 1.25,
    //            'endAngle' : 2.51
    //            


    var data0 = path.data(); 
    var data1 = pie(pie_data);

    //console.log("Nclicks: "+Nclicks);
    //console.log("Data0 to Data1 transition:");
    //console.log("Data0:");
    //console.log(data0);
    //console.log("Data1:");
    //console.log(data1);

    path = path.data(data1, key);

    var labelr = radius + 30;

    Nclicks = Nclicks + 1;

    ////////////////////////////////////////////
    // animate transitions
    //
    path.enter().append("path")
        .each(function(d, i) { 
            console.log("Data0:");
            console.log(data0);
            console.log("Data1:");
            console.log(data1);
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


    ///// Arc Labels ///// 
    // Calculate position 
    path.append("text")
        .attr("transform", function(d) { 
            return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { 
            return d.data.cat; 
        });




    // trying a third time to get 
    // some damn text labels 
    // on this damn pie chart.
    //
    // http://jsfiddle.net/nrabinowitz/GQDUS/

    /*
    var labelr = radius + 30;
    var mytxt = path.enter().append("path")
            .each(function(d, i) { this._current = findNeighborArc(i, data0, data1, key) || d; })
            .attr("fill", function(d) { 
                return color(d.data.cat); })
            .append("text")
    mytxt.attr("transform", function(d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * labelr) +  ',' +
               (y/h * labelr) +  ")"; 
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })
        .text(function(d,i) { 
            return d.data.cat; });
    */



    /*

    // Now add text labels
    //
    // don't ask...
    //
    // http://jsfiddle.net/thudfactor/HdwTH/
    // 
    pied_arc = d3.svg.arc()
        .innerRadius(radius - 70)
        .outerRadius(radius - 10);

    enteringLabels = svg.select(".labels").data(categories).enter();
    labelGroups = enteringLabels.append("g").attr("class", "label");
    labelGroups.append("circle").attr({
        x: 0,
        y: 0,
        r: 2,
        fill: "#000",
        transform: function (d, i) {
            centroid = pied_arc.centroid(d);
            return "translate(" + pied_arc.centroid(d) + ")";
        },
            'class': "label-circle"
    });

    // "When am I ever going to use this?" I said in 
    // 10th grade trig.
    cDim = {'labelRadius':175};
    textLines = labelGroups.append("line").attr({
        x1: function (d, i) {
            return pied_arc.centroid(d)[0];
        },
        y1: function (d, i) {
            return pied_arc.centroid(d)[1];
        },
        x2: function (d, i) {
            centroid = pied_arc.centroid(d);
            midAngle = Math.atan2(centroid[1], centroid[0]);
            x = Math.cos(midAngle) * cDim.labelRadius;
            return x;
        },
        y2: function (d, i) {
            centroid = pied_arc.centroid(d);
            midAngle = Math.atan2(centroid[1], centroid[0]);
            y = Math.sin(midAngle) * cDim.labelRadius;
            return y;
        },
            'class': "label-line"
    });



    console.log(labelGroups);
    textLabels = labelGroups.append("text").attr({
        x: function (d, i) {
            centroid = pied_arc.centroid(d);
            midAngle = Math.atan2(centroid[1], centroid[0]);
            x = Math.cos(midAngle) * cDim.labelRadius;
            sign = (x > 0) ? 1 : -1
            labelX = x + (5 * sign)
            return labelX;
        },
        y: function (d, i) {
            centroid = pied_arc.centroid(d);
            midAngle = Math.atan2(centroid[1], centroid[0]);
            y = Math.sin(midAngle) * cDim.labelRadius;
            console.log(d);
            return y;
        },
            'text-anchor': function (d, i) {
            centroid = pied_arc.centroid(d);
            midAngle = Math.atan2(centroid[1], centroid[0]);
            x = Math.cos(midAngle) * cDim.labelRadius;
            return (x > 0) ? "start" : "end";
        },
            'class': 'label-text'
    })
    .text(function (d) {
        return d;
    });

    */


    /*
    // now add text labels
    // 
    // via 
    // http://bl.ocks.org/dbuezas/9306799
    //
    var text = svg.select(".labels").selectAll("text")
        .data(data1, key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return d.data.label;
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


    var polyline = svg.select(".lines").selectAll("polyline")
        .data(data1, key);
    
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
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };          
        });
    
    polyline.exit()
        .remove();
    
        */

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
    console.log("Tween: this._current =");
    console.log(this._current);
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





////////////////////////////////////////////////////
//// d3 geom

var categories = ["Walked", "Biked", "Public Transit", "Drove Carpool", "Drove Alone"];


var width = 300,
    height = 300,
    padding = 30,
    radius = Math.min(width-padding, height-padding) / 2;

var color = d3.scale.ordinal()
    .domain(categories)
    .range(["#018571", "#80cdc1", "#f5f5f5", "#dfc27d", "#a6611a"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

lab1 = 'Biked';
lab2 = 'Drove Alone';
lab3 = 'Drove Carpool';
lab4 = 'Public Transit';
lab5 = 'Walked';
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
    .style("fill", function(d) { 
        return color(d.data.cat); });

g.append("text")
    .attr("transform", function(d) { 
        return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { 
        return d.data.cat; 
    });

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


// animate transitions...
/*
path.enter().append("path")
    .each(function(d, i) { 
        this._current = findNeighborArc(i, data_init0, data_init1, key) || d; 
    })
    .attr("fill", function(d) { 
        return color(d.data.cat); })

path.each(function(d){console.log(this._current);});

(5 x undefined)
*/
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

path.append("text")
    .attr("transform", function(d) { 
        return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { 
        return d.data.cat; 
    });


// // //// we have to set ._current 
// // //// for this path in order to 
// // //// make the first animation work.
// // //path.each(function(d, i) { 
// // //    this._current = findNeighborArc(i, data_init0, data_init1, key) || d; 
// // //    //console.log("Dat in this._current for init:");
// // //    //console.log(this._current);
// // //});






/////
/////g.exit()
/////        .datum(function(d, i) { return findNeighborArc(i, data_init1, data_init0, key) || d; })
/////      .transition()
/////        .duration(750)
/////        .attrTween("d", arcTween)
/////        .remove();
/////
/////g.transition()
/////        .duration(750)
/////        .attrTween("d", arcTween);



/*



// Make sure we can make a very simple pie chart
// from an array variable
//
// Here's what CSV/JSON data looks like when 
// imported, and so how we have to organize
// our data by hand.
var mydat = [{'cat' : 'A', 'dat' : 0.40 },
             {'cat' : 'B', 'dat' : 0.80 },
             {'cat' : 'C', 'dat' : 0.15 },
             {'cat' : 'D', 'dat' : 0.16 },
             {'cat' : 'E', 'dat' : 0.23 }];

mydat.forEach(function(d) {
    //console.log(d.cat);
    //console.log(d.dat);
    d.dat = +d.dat;
}); 



// If we're using a Javascript variable,
// we don't need the callback function
// provided by d3.csv()
//
// We can just set to work on the 
// drawing directly:
//

var g = svg.selectAll(".arc")
    .data(pie(mydat))
    .enter().append("g")
    .attr("class","arc");

g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.dat); });

g.append("text")
    .attr("transform", function(d) { 
        //console.log(d.dat); 
        //console.log(arc);
        return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { 
        console.log(d.data.cat); 
        return d.data.cat; 
    });



*/





/*
// Make a pie chart from CSV data
// (useful, but not what we want)
// 
d3.csv("data.csv", function(error, data) {

  data.forEach(function(d) {
    d.population = +d.population;
  });

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.age; });

});
*/

