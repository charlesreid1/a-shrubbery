
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



    data_keys = Object.keys(this.feature.properties);



    // Well, here's proof of concept that we can
    // assemble a vector of data to send over to
    // the D3 pie chart:
    // 
    //console.log(this.feature);
    //console.log(this.feature.properties['A_Below100PovLn_BikeEtc_CountyPct']);

    // Now if only we could figure out if 
    // any county (other than the one just clicked)
    // has a class equal to "active" 
    // and if so, turn it off.



    /*
    // Initial figuring out:

    //console.log(geoj1);
    //console.log(Object.keys(geoj1));
    //
    // this is a dictionary indexed by leaflet IDs
    //console.log(geoj1._layers);
    */ 



    /*

    // Here, we set the style of whatever county
    // has just been clicked.
    //
    // If it is not red, we make it red.
    // If it is already red, we return it to its old color.
    //
    //
    // This seems like an extremely cumbersome way
    // to access the feature that's just been clicked,
    // but... whatever, I guess. That's JS/D3 for you.

    my_leaflet_id   = this._leaflet_id;
    this_layer      = this._layers[ my_leaflet_id-1 ];
    options_dict    = this_layer['options'];


    red = '#ff0000';

    if (options_dict['fillColor']===red) {

        this.setStyle({
            'fillColor' : getColorBlue(this.feature.properties[key1])
        });

    } else {

        this.setStyle({
            'fillColor' : '#ff0000'
        });

    }

    */


    // A better approach would be to loop through 
    // all tags representing all counties,
    // and set the clicked one to be "active"
    // and turn off any other county that was active.
    // Then css style for "active" is defined as having 
    // fillColor: #ff0000.

    // But how do we get a feature/layer iterator?
    // //
    // likee this... except this is more than just countiees.
    // and we arent accessing/modifying the county
    // css class. just the fillColor and other style
    // properties.
    //
    // whatever. it never is a victory. 
    // just limp over the finish line.
    red = '#ff0000';



    // This is hacky and is creating problems when a layer 
    // consists of multiple pieces.
    //
    my_leaflet_id   = this._leaflet_id;
    //this_layer      = this._layers[ my_leaflet_id-1 ];
    //options_dict    = this_layer['options'];
    //orig_fillColor  = options_dict['fillColor'];
    //console.log(this._leaflet_id);
    //console.log(this._layers);



    //var keys = Object.keys(this._layers);
    //keys.forEach(function(d) {
    //    //console.log(typeof(d.toString()));
    //    //console.log(this._layers);
    //    //layer = this._layers[d]['options'];
    //    //layer = this._layers[d.toString()]['options'];
    //});



    //console.log(this._layers[37]['options']);
    //console.log(typeof(this._layers));

    //this_layer      = this._layers[ my_leaflet_id-1 ];


    // Fill clicked counties with red 
    map.eachLayer(function(layer) {
        if( layer['options'] ) {
            if( layer['options']['fillColor'] ) {

                // set fill color to red

                orig_fillColor = layer['options']['fillColor'];
                if( orig_fillColor === red ){
                    var a=0;
                } else {
                    layer.setStyle({
                        'fillColor' : red,
                        'originalFillColor' : orig_fillColor
                    });
                }

            }
        }
    });



    //if(orig_fillColor===red) {

    //    var a=0;

    //} else {

    //    this.setStyle({
    //        'fillColor' : red,
    //        'originalFillColor' : orig_fillColor

    //    });

    //}


    // Restore any previously red counties
    // to their original color
    map.eachLayer( function(layer) { 
        if(layer.options) {
            if( layer['options']['fillColor'] ) {

                if(layer.options['fillColor']===red) {

                    // Improve this: 
                    // dont' check for my leaflet id, which is 
                    // by nature excluding other entities,
                    // but instead grab Object.keys(self._layers)
                    // and use it here.
                    //
                    // if layer._leaflet_id in Object.keys(self._layers)
                    //
                    if(layer._leaflet_id == my_leaflet_id-1) {
                        var a=0;

                    } else {
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
        }
    });
    map._onResize(); 



    


    // This is where you would put D3 bindings

    /*

    https://github.com/mbostock/d3/wiki/Selections
    
    As a simple example, consider the case where the existing selection is empty, and we wish to create new nodes to match our data:
    
    d3.select("body").selectAll("div")
        .data([4, 8, 15, 16, 23, 42])
      .enter().append("div")
        .text(function(d) { return d; });
    
    Assuming that the body is initially empty, the above code will create six new DIV elements, append them to the body in order, and assign their text content as the associated (string-coerced) number:
    
    <div>4</div>
    <div>8</div>
    <div>15</div>
    <div>16</div>
    <div>23</div>
    <div>42</div>
    
    Note: the data method cannot be used to clear previously-bound data; use selection.datum instead.

    */
}

//var prefix = "http://charlesreid1.github.io/a-shrubbery/";
var prefix = "/"
var geoj1 = new L.geoJson.ajax(
                    prefix+"cacommuterincome.geojson",
                    {onEachFeature : enhanceLayer1}
                ).addTo(map);





////////////////////////////////////////////////////


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

