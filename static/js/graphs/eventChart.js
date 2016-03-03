function create_shot_attempts(data, divid, valtype, hometeam, awayteam) {
    // add the graph canvas to the body of the webpage
    var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = $("#tableView").width() - margin.left - margin.right,
        height = width * 0.425 + margin.left;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    console.log(data);
    // setup x 
    var xValue = function(d) { return d.seconds; }, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d)); }, // data -> display
        xAxis = d3.svg.axis().scale(xScale).tickValues([20*60, 40*60, 60*60]).tickFormat(function(d) { return d/60; }).orient("bottom");
    // setup y
    var yValue = function(d) { return d.value; }, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d)); }, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");
    // setup fill color
    var cValue = function(d) { return "black";},
        color = d3.scale.category10();
    // add the tooltip area to the webpage
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("border-radius", 3)
        .attr("class", "tooltip-inner")
        .text("a simple tooltip");

    var svg = d3.select(divid).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var homeMax = d3.max(data["home" + valtype], yValue) + 1;
    var awayMax = d3.max(data["away" + valtype], yValue) + 1;
    var yScaleMax = Math.max(homeMax, awayMax);
    xScale.domain([0, d3.max([60*60, d3.max(data["home" + valtype], xValue)])]);
    yScale.domain([0, yScaleMax]);
    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Time");
    // y-axis
    if (valtype == "sa")
        var header = "Shot Attempts By Team";
    else
        var header = "Scoring Chances By Team";
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(header);
    function format_toi(t) {
        var minutes = Math.floor(t / 60);
        var seconds = t - minutes * 60;
        return minutes + ":" + seconds
    }
    if (valtype == "sa")
        var header = "Shot Attempts By Team";
    else
        var header = "Scoring Chances By Team";
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 4))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(header);
    var line = d3.svg.line()
        .interpolate("step-after")
        .x(xMap)
        .y(yMap);
    createPeriods(svg, data["pend"]);
    svg.append("path")
        .datum(data["home" + valtype])
        .attr('stroke', get_color(hometeam, true))
        .attr('stroke-width', 2)
        .attr('fill', "none")
        .attr("d", line);
    
    svg.append("path")
        .datum(data["away" + valtype])
        .attr('stroke', get_color(awayteam, true))
        .attr('stroke-width', 2)
        .attr('fill', "none")
        .attr("d", line);
    createPP(svg, data["homepp"], hometeam);
    createPP(svg, data["awaypp"], awayteam);
    createGoals(svg, data["homegoal"], hometeam);
    createGoals(svg, data["awaygoal"], awayteam);
    svg.append("rect")
        .attr("x", 90)
        .attr("y", 4)
        .attr("width", 150)
        .attr("height", 20)
        .style("fill", "white")
        .style("stroke", "none")
    svg.append("text")
        .attr("x", margin.left + 50)
        .attr("y", margin.top)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("fill", "grey")
        .text("firstlinestats.com")
    createLegend(hometeam, awayteam);
    function mouseover(p) {
        //tooltip.html(p["full_name"] + "<br />SF:" + p.SF + "<br />SA:" + p.SA + "<br />TOI:" + format_toi(p.TOI));
        tooltip.style("visibility", "visible")
    }
    function mouseout() {
        d3.selectAll("text").classed("active", false);
        tooltip.style("visibility", "hidden");
    }
    function createPP(svg, data, teamname) {
        for (var i=0; i<data.length; i++) {
            var penl = data[i];
            svg.append("rect")
                .attr("x", xMap(penl))
                .attr("y", 0)
                .attr("width", xScale(penl["length"]))
                .attr("height", height)
                .attr("fill", get_color(teamname, true))
                .attr("opacity", 0.5)
        }
    }
    function createPeriods(svg, periods) {
        for (var i=0; i<periods.length; i++) {
            var seconds = periods[i];
            svg.append("line")
                .attr("x1", xScale(seconds))
                .attr("y1", 0)
                .attr("x2", xScale(seconds))
                .attr("y2", height)
                .style("fill", "none")
                .style("stroke", "grey")
                .style("stroke-width", 2)
                .style("stroke-dasharray", ("3, 3"))
                .style("opacity", 1)
        }
    }
    function createGoals(svg, goals, teamname) {
        for (var i=0; i<goals.length; i++) {
            var seconds = goals[i];
            svg.append("line")
                .attr("x1", xMap(seconds))
                .attr("y1", 0)
                .attr("x2", xMap(seconds))
                .attr("y2", height)
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", 6)
                .style("opacity", 1);
            svg.append("line")
                .attr("x1", xMap(seconds))
                .attr("y1", 0)
                .attr("x2", xMap(seconds))
                .attr("y2", height)
                .style("fill", "none")
                .style("stroke", get_color(teamname, true))
                .style("stroke-width", 2)
                .style("opacity", 1);
        }
    }
    function createLegend(hometeam, awayteam) {
        var legendRectSize = 18;
        var legendSpacing = 4;
        var data = [];
        data.push({name: hometeam, title: hometeam + " PP", opacity: 0.5},
            {name: awayteam, title: awayteam + " PP", opacity: 0.5},
            {name: hometeam, title: hometeam + " Goal", opacity: 1},
            {name: awayteam, title: awayteam + " Goal", opacity: 1})
        svg.append('rect')
            .attr('x', legendRectSize + margin.left - 10)
            .attr('y', margin.top + legendRectSize + 10)
            .attr('width', legendRectSize * 8)
            .attr('height', legendRectSize * 6)
            .style('fill', 'white')
            .style('stroke', 'black')
        var legend = svg.selectAll('.legend')
            .data(data)
          .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height;
                var horz = -2 * legendRectSize;
                var vert = i * height + offset;
                return 'translate(' + horz + ',' + vert + ')';
            });
        legend.append('rect')
            .attr('x', legendRectSize + margin.left + margin.right + 15)
            .attr('y', legendRectSize + margin.top)
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d) { return get_color(d.name, true); })
            .style('stroke', color)
            .style('opacity', function(d) { return d.opacity; })
            .style("stroke", function(d) { if (d.opacity == 0.5) return "none"; else return "black";});
        legend.append('rect')
            .attr('x', legendRectSize + margin.left + margin.right + 15)
            .attr('y', legendRectSize + margin.top)
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', "none")
            .style('stroke', color)
            .style("stroke", function(d) { if (d.opacity == 0.5) return "none"; else return "black";});
        legend.append('text')
            .attr('x', legendRectSize * 2 + margin.left + margin.right + 20)
            .attr('y', legendRectSize + margin.top + legendRectSize / 1.5)
            .style("text-anchor", "start")
            .text(function(d) { return d.title; });
    }
}