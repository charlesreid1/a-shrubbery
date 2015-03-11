function columnChart(k,mycountymap,mycensusmap) {
    /*
     * example of how to call this:
     */
    /*
    d3.select("body").append("div").attr("class","example");
    var data = [{"letter" : "A", "frequency" : 0.08167},
                {"letter" : "B", "frequency" : 0.01492},
                {"letter" : "C", "frequency" : -0.02782},
                {"letter" : "D", "frequency" : -0.04253},
                {"letter" : "E", "frequency" : 0.12702}];
    d3.select(".example")
      .datum(data)
        .call(columnChart(['letter','frequency'])
          .width(400)
          .height(400)
          .x(function(d, i) { return d[0]; })
          .y(function(d, i) { return d[1]; }));
    */

    var xkey = k[0],
        ykey = k[1];
    var geoidkey = 'geoid';
    var margin = {top: 30, right: 10, bottom: 50, left: 60},
        width = 10,
        height = 10,
        xRoundBands = 0.1,
        xValue = function(d) { return d[xkey]; },
        yValue = function(d) { return d[ykey]; },
        geoidValue = function(d) { return d[geoidkey]; },
        xScale = d3.scale.ordinal(),
        yScale = d3.scale.linear(),
        yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(function(d) { return Math.round(d) + "%"; }),
        xAxis = d3.svg.axis().scale(xScale);


    function chart(selection) {

      selection.each(function(data) {

        // if we sort, 
        // we probably do it here:
        // grab values then sort then pass to scale

        //
        // sort on array value 1
        //
        // sort: via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        function compareIndex1(a, b) {
          return b[1] - a[1];
        }

        // x = name
        // y = gender imbalance
        var scale = [];
        data.forEach(function(d) { 
            scale.push( [d.properties[xkey],d.properties[ykey],d.properties[geoidkey]] );
        });
        scale.sort(compareIndex1);


        // Update the x-scale.
        xScale
            .domain(scale.map(function(s) { return s[0];} ))
            .rangeRoundBands([0, width - margin.left - margin.right], xRoundBands);
           

        // Update the y-scale.
        yScale
            .domain(d3.extent(scale.map(function(s) { return s[1];} )))
            .range([height - margin.top - margin.bottom, 0])
            .nice();
            

        // Select the svg element, if it exists.
        var svg = d3.select(this).selectAll("svg").data([data]);

        // Otherwise, create the skeletal chart.
        var gEnter = svg.enter().append("svg").append("g");
        gEnter.append("g").attr("class", "bars");
        gEnter.append("g").attr("class", "y axis");
        gEnter.append("g").attr("class", "bar x axis zero");

        // Update the outer dimensions.
        svg .attr("width", width)
            .attr("height", height);

        // Update the inner dimensions.
        var g = svg.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



      // Before we create the bars,
      // we will need to tie them to layers on the 
      // leaflet map, to link them
      // for things like mouseover events.
      //
      // To do this, we create a map of 
      // geoids to leafletids

      var leafletid_to_geoid = {};
      var geoid_to_leafletid = {};

      mycountymap.eachLayer(function(layer) {
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



       // Update the bars.
       var bar = svg.select(".bars").selectAll(".bar").data(data);
       bar.enter().append("rect");
       bar.exit().remove();
       bar.attr("class", function(d, i) { 
                  return d.properties[ykey] < 0 ? "bar negative" : "bar positive"; 
              })
              .attr("x", function(d) { 
                  return X(d); 
              })
              .attr("y", function(d) { 
                  return d.properties[ykey] < 0 ? Y0() : Y(d); 
              })
              .attr("leafletid",function(d) {
                  var geoid = d.properties['geoid'];
                  var leafletid = geoid_to_leafletid[geoid];
                  return leafletid;
              })
              .attr("geoid", function(d) { 
                  return d.properties[geoidkey]; 
              })
              .attr("height", function(d, i) { 
                  return Math.abs( Y(d) - Y0() ); 
              })
              .attr("width", xScale.rangeBand())
              .on("mouseover",doBarMouseOver)
              .on("mouseout", doBarMouseOut)
              .on("click",    doBarMouseClick);

      // zero line
      g.select(".x.axis.zero")
          .attr("transform", "translate(0," + Y0() + ")")
          .call(xAxis.tickFormat("").tickSize(0));
      
      // Update the y-axis.
      g.select(".y.axis")
          .call(yAxis);
            
      });



      // Axis labels
      var svg = d3.select("#barchart").selectAll("svg");

      var yax_label = "Percent Difference in Mean Education Levels by Gender";
      var yax_xloc = 0 - (height/2);
      var yax_yloc = 0;//margin['left'];
      svg.append("text")
          .attr("class", "axislabel")
          .attr("id","yaxislabel")
          .attr("text-anchor", "middle")
          .attr("x",yax_xloc)
          .attr("y",yax_yloc)
          .attr("dy", "1em")
          .attr("transform", "rotate(-90)")
          .text(yax_label);


      // add textblock with instructions
      var svg = d3.select("#barchart").selectAll("svg"),
          xshft = 100,
          yshft = 100,
          tb = d3.textBlock().label('Click a county on the left or a bar on the chart to begin.');

      var item = svg.selectAll("rect.lab")
          .data([0])
          .enter();

      svg.selectAll("g.lab")
          item.append("g")
          .attr("transform",function(d) {
              return "translate("+xshft+","+yshft+")";
          })
      .classed({'lab':true})
          .attr("width",100)
          .attr("height",100)
          .call(tb);

    }



    function doBarMouseOver(d) {

        var geo_id = d.properties['geoid'];
        d3.selectAll(".bar[geoid='"+geo_id+"']")
            .classed({'active':true});

        this_layer_id = d3.select(this).attr("leafletid");
    
        // outline the county on the map
        // (make it active)
        mycountymap.eachLayer(function(layer) {
    
            // For each of these leaflet ids,
            // we need to obtain the shapes
            // in that particular layer
            that_layer_id = layer._leaflet_id;
    
            if (this_layer_id==that_layer_id) {
                layer.setStyle({
                    weight: 3.0,
                    opacity: myMouseOverThickFillOpacity
                });
            }
        });
    }

    function doBarMouseOut(d) {

        var geo_id = d.properties['geoid'];
        d3.selectAll(".bar[geoid='"+geo_id+"']")
            .classed({'active':false});
    
        this_layer_id = d3.select(this).attr("leafletid");
    
        // remove outline on the census tract on the county map
        // (make it inactive)
        mycountymap.eachLayer(function(layer) {
    
            // For each of these leaflet ids,
            // we need to obtain the shapes
            // in that particular layer
            that_layer_id = layer._leaflet_id;
    
            if (this_layer_id==that_layer_id) {
                layer.setStyle({
                    weight: 1.0,
                    opacity: myMouseOverThickFillOpacity
                });
            }
        });
    }

    function doBarMouseClick(d) {
        /*
         * This mirrors doCountyClick.
         *
         * We do a couple of things here:
         *   - make all bars unselected
         *   - make clicked bar selected
         *   - zoom to that county's census tracts in census tract map
         *   - update scatterplot
         */

        // user clicked scatter plot point,
        // so highlight scatter plot point
        // then highlight corresponding census tract
    
        // get leaflet layer based on geoid
    
        var tract  = d.properties.name;
        var geo_id = d.properties['geoid'];

        red3 = '#df65b0';


        // --------------------------
        // Step 1: 
        // Highlight selected bar 

        var geo_id = d.properties['geoid'];

        d3.selectAll(".bar[geoid]")
            .classed({'selected':false});

        d3.selectAll(".bar[geoid='"+geo_id+"']")
            .classed({'selected':true});

    
        // FIXME:
        // this does not account for the case 
        // of multiple leaflet IDs
        // (i.e., counties with multiple entities)
    

        // --------------------------
        // Step 1-B: 
        // Add information about selected county
        // to info box on bar chart


        write_labels(d.properties)



        // --------------------------
        // Step 2: 
        // Highlight county on county map
        //
        this_layer_id = d3.select(this).attr("leafletid");
        mycountymap.eachLayer(function(layer) {
    
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
                if(orig_fillColor != red3 ) {
                    layer.setStyle({
                        fillColor: red3,
                        originalFillColor: orig_fillColor
                    });
                }

            } else if(options) {
                if(options['fillColor']==red3) {
                    layer.setStyle({
                        fillColor : options['originalFillColor']
                    });
                }
            }
    
        });


        // -------------------------------------
        // Step 3:
        // Add census tracts for this county to the census tract map.
        //
        // Do this by grabbing the geo_id for the county,
        // and form that into a Census Reporter API URL.

        //censusurl = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|"+geo_id;
        var censusurl = prefix + "educationca" + geo_id + ".geo.json";


        // initialize empty GeoJson
        var census_geoj = L.geoJson(false, {
                onEachFeature: onEachCensusFeature
            }).addTo(mycensusmap);


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
                mycensusmap.eachLayer(function(layer){
                    if(layer._tiles) {
                        var a = 0;
                    } else {
                        // this also removes census_geoj, 
                        // i.e., the layer we're trying to add,
                        // so we have to re-add it in a few lines...
                        mycensusmap.removeLayer(layer);
                    }
                });
                census_geoj.addTo(mycensusmap);
                census_geoj.addData(data);

                // -------
                // 2. Get census tract bounds
                var bounds = census_geoj.getBounds();

                // ------
                // 3. Fit map to bounds
                //map_census.panInsideBounds(bounds);
                //map_census.setZoom( map_census.getBoundsZoom(bounds) );
                mycensusmap.fitBounds(bounds,animate=true);




                // -------------------------------------
                //
                // In-between convenience step:
                //
                // Create a leaflet-to-geoid map
                //
                // This is different from the one done above,
                // on line 101,
                // b/c this is for the census tract map,
                // and it is done in this ajax block,
                // so it is done asynchronously from above code.
                //
                // That means there won't be any conflicts
                // with variables, too.
                //
                var leafletid_to_geoid = {};
                var geoid_to_leafletid = {};

                mycensusmap.eachLayer(function(layer) {
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
                        return greenColor(Math.random());
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
    
    }


    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
      return xScale(d.properties[xkey]);
    }

    function Y0() {
      return yScale(0);
    }

    // The x-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
      return yScale(d.properties[ykey]);
    }

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

    return chart;
}