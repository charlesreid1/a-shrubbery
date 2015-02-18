
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

function layerMouseclick() {
    var county = this.feature.properties.name;
    $tooltip.text("County: "+county).show();

    red = '#ff0000';

    these_layer_ids = Object.keys(this._layers);


    // print the leaflet ids of map layers for our county
    //console.log(these_layer_ids);


    // print every single layer object on the leaflet map
    //map.eachLayer(function(layer) {
    //    console.log(layer);
    //});


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


    // Just drawing the plot doesn't work.
    // Nothing gets updated.
    //
    // Need to look at donut transition example.
    //
    // remember, we set the value() function for pie
    // above (well, below actually) to be d.dat 
    // (so, in this case, pie_data.dat)
    //
    //
    // http://bl.ocks.org/mbostock/5682158
    //
    var data0 = path.data();
    var data1 = pie(pie_data);

    // second arg is handle to key function
    path = path.data(data1, key);

    path.enter().append("path")
        .each(function(d, i) { this._current = findNeighborArc(i, data0, data1, key) || d; })
        .attr("fill", function(d) { return color(d.data.cat); })
      .append("title")
        .text(function(d) { return d.data.cat; });

    path.exit()
        .datum(function(d, i) { return findNeighborArc(i, data1, data0, key) || d; })
      .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();

    path.transition()
        .duration(750)
        .attrTween("d", arcTween);

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





////////////////////////////////////////////////////
//// d3 geom


var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20();

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.dat; });

var svg = d3.select("div.graph").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var path = svg.selectAll("path");



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

