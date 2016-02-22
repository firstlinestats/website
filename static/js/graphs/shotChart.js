function shotChart(data) {
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = $("#tableView").width() - margin.left - margin.right,
        height = width * 0.425 + margin.left;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain([-100, 100]);
    y.domain([-42.5, 42.5]);

    var color = d3.scale.category10();

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    // add the tooltip area to the webpage
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("border-radius", 3)
        .attr("class", "tooltip-inner")
        .text("a simple tooltip");

    var svg = d3.select("#shotChart").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("svg:image")
        .attr("xlink:href", "/static/svg/rink.png")
        .attr("width", width - margin.left)
        .attr("height", height - margin.top);

    var dangerZoneHome = [{x: 89, y: -9},
        {x: 69, y: -22}, {x: 54, y: -22},
        {x: 54, y: -9}, {x: 44, y: -9},
        {x: 44, y: 9}, {x: 54, y: 9},
        {x: 54, y: 22}, {x: 69, y: 22},
        {x: 89, y: 9}, {x: 89, y: -9}];

    var highDangerZoneHome = [{x: 89, y: -9},
        {x: 69, y: -9}, {x: 69, y: 9},
        {x: 89, y: 9}, {x: 89, y: -9}];

    var dangerZone = [dangerZoneHome];
    dangerZone.push(highDangerZoneHome);
    var dangerZoneAway = [];
    for (var points in dangerZoneHome) {
        var p = dangerZoneHome[points];
        dangerZoneAway.push({x: -p.x, y: p.y});
    }
    var highDangerZoneAway = [];
    for (var points in highDangerZoneHome) {
        var p = highDangerZoneHome[points];
        highDangerZoneAway.push({x: -p.x, y: p.y});
    }
    dangerZone.push(dangerZoneAway);
    dangerZone.push(highDangerZoneAway);


    svg.selectAll("polygon")
        .data(dangerZone)
      .enter().append("polygon")
        .attr("points",function(d) {
            return d.map(function(d) {
                return [x(d.x), y(d.y)].join(",");
            }).join(" ");
        })
        .attr("stroke","black")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("opacity", 0.1);

    svg.selectAll(".dot")
        .data(data["home"].concat(data["away"]))
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .style("fill", function(d) {
            if (d.type == "GOAL") {
                return "#FF0000";
            } else if (d.type == "BLOCKED_SHOT") {
                return "#00FF00";
            } else if (d.type == "MISSED_SHOT") {
                return "#000000";
            } else {
                return "#0000FF";
            }
        })
        .style("stroke", function() {
            return "#000000";
        })
        .on("mouseover", function(d) {
            tooltip.html(d.danger);
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(d){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(d) {
            d3.selectAll("text").classed("active", false);
            tooltip.style("visibility", "hidden");
        });

}
