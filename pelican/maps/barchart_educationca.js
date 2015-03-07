function columnChart(k) {

/*
 *
 * example of how to call this:
 *

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
  var margin = {top: 30, right: 10, bottom: 50, left: 50},
      width = 10,
      height = 10,
      xRoundBands = 0.2,
      xValue = function(d) { return d[xkey]; },
      yValue = function(d) { return d[ykey]; },
      xScale = d3.scale.ordinal(),
      yScale = d3.scale.linear(),
      yAxis = d3.svg.axis().scale(yScale).orient("left"),
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
        return a[1] - b[1];
      }

      // x = name
      // y = gender imbalance
      var scale = [];
      data.forEach(function(d) { 
          scale.push( [d.properties[xkey],d.properties[ykey]] );
      });
      scale.sort(compareIndex1);


      // Update the x-scale.
      console.log(xScale.length);
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
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "x axis zero");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // Update the bars.
      var bar = svg.select(".bars").selectAll(".bar").data(data);
      bar.enter().append("rect");
      bar.exit().remove();
      bar .attr("class", function(d, i) { return d.properties[ykey] < 0 ? "bar negative" : "bar positive"; })
          .attr("x", function(d) { return X(d); })
          .attr("y", function(d, i) { return d.properties[ykey] < 0 ? Y0() : Y(d); })
          .attr("width", xScale.rangeBand())
          .attr("height", function(d, i) { return Math.abs( Y(d) - Y0() ); });

    // x axis at the bottom of the chart
     g.select(".x.axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(xAxis.orient("bottom"));
    
    // zero line
     g.select(".x.axis.zero")
        .attr("transform", "translate(0," + Y0() + ")")
        .call(xAxis.tickFormat("").tickSize(0));
    
    
      // Update the y-axis.
      g.select(".y.axis")
        .call(yAxis);
          
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
