function shotChart(data) {
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = $("#tableView").width() - margin.left - margin.right,
        height = width * 0.425 + margin.left;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain([-100, 100]);
    y.domain([43, -43]);

    var color = d3.scale.category10();

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var svg = d3.select("#shotChart").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("svg:image")
        .attr("xlink:href", "/static/svg/rink.png")
        .attr("width", width - margin.left)
        .attr("height", height - margin.top);

    console.log(data);

    svg.selectAll(".dot")
        .data(data["home"])
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .style("fill", function(d) { return "red"; })
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html(d.x + ", " + d.y)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
}