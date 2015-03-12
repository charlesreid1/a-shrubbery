function write_labels(properties) {

    // Select the svg element, if it exists.
    var svg = d3.select("#barchart").selectAll("svg");

    // calling textBlock() returns the function object textBlock().my
    // via which we set the "label" property of the textBlock outer func
    //var tb = d3.textBlock();
    //var tb = d3.textBlock().label(function(d) {
    //    return d.label;
    //});
    // First, remove old labels
    svg.selectAll("g.lab").remove();

    // d.properties is a single dict.
    // we need to say [d.properties]
    // instead of d.properties
    //
    print_pop  = function(z) { return "Name: "+z['name'] };
    print_mean = function(z) { 
        rounded = Math.round(z['Total_Ed_Mean']*100)/100;
        lab = "Mean Education Level: "+rounded;
        return lab;
    };
    print_var = function(z) {
        rounded = Math.round(z['Total_Ed_Var']*100)/100;
        lab = "Education Level Variance: "+rounded;
        return lab;
    };
    print_gender = function(z) {
       rounded = Math.round(z['Gender_Imbalance']*100)/100; 
       lab = "Gender Imbalance: "+rounded;
        return lab;
    };
    var print_functions = [print_pop,print_mean,print_var,print_gender];
    var x_shifts = [200,200,200,200];
    var y_shifts = [60,100,140,180];
    var i = 0;

    var item = svg.selectAll("rect.lab")
        .data([properties])
        .enter();

    print_functions.forEach(function(printfunction) {
        var tb = d3.textBlock().label(printfunction);
        item.append("g")
            .attr("transform", function(d) { 
                return "translate("+x_shifts[i]+","+y_shifts[i]+")"; })
            .classed({'lab':true})
            .attr("width",100)
            .attr("height",100)
            .call(tb);
        i = i + 1;
    });

}

