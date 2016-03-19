function createBubbleGraph(dataset, xvalue, yvalue, color, size, xtext, ytext, colortext, sizetext) {
    $("#comparison-graph").html("");
    var margin = {top: 20, right: 10, bottom: 30, left: 40},
        width = $("#skatersTabContent").width(),
        height = 500;

    for (var i=0; i<dataset.length; i++) {
        var row = dataset[i];
        row.x = parseFloat(row[xvalue]);
        row.y = parseFloat(row[yvalue]);
        row.color = parseFloat(row[color]);
        row.size = parseFloat(row[size]);
    }

    var minX = d3.min(dataset, function(d) { return d.x; }),
        maxX = d3.max(dataset, function(d) { return d.x; }),
        minY = d3.min(dataset, function(d) { return d.y; }),
        maxY = d3.max(dataset, function(d) { return d.y; }),
        minRadius = d3.min(dataset, function(d) { return d.size; }),
        maxRadius = d3.max(dataset, function(d) { return d.size; });
    var xValue = function(d) { return d.x;}, // data -> value
        xScale = d3.scale.linear().domain([minX, maxX]).range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    // setup y
    var yValue = function(d) { return d.y;}, // data -> value
        yScale = d3.scale.linear().domain([minY, maxY]).range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");
    var rValue = function(d) { return d.size; },
        rScale = d3.scale.linear().domain([minRadius, maxRadius]).range([2, 20]),
        rMap = function(d) { return rScale(rValue(d));};
    // setup fill color
    var cValue = function(d) { return "black";},
        maxColor = d3.max(dataset, function(d) { return d.color; }),
        minColor = d3.min(dataset, function(d) { return d.color; });

    var x = d3.scale.linear()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);
    var color = d3.scale.linear().domain([minColor, (maxColor + minColor) / 2, maxColor]).range(["#FF2400", "#FFFFFF", "#0042FF"])
    var maxallowed = 35,
        minallowed = 2;
    var svg = d3.select("#comparison-graph")
        .insert("svg", "svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")")
        .attr("fill", "white");
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("r", rMap)
        .attr("id", function(d) { return d["id"] + d["name"].replace(" ", "") + d["season"]; })
        .attr("onclick", function(d) {
            return "toggleText(\"" + d["name"].replace(" ", "") + d["season"] + "\");";
        })
        .style("fill", function(d) {
            return color(d.color);
        })
        .style("stroke", "black")
    var texts = svg.selectAll("text")
        .data(dataset)
        .enter();
    texts.append("text")
        .html(function(d) {
            return d["name"];
        })
        .attr("x", xMap)
        .attr("y", yMap)
        .attr("id", function(d) { return d["id"] + d["name"].replace(" ", "") + d["season"] + "team"; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .style("text-anchor", "middle");
    texts.append("text")
        .html(function(d) {
            return d["season"];
        })
        .attr("x", xMap)
        .attr("y", function(d) { return yMap(d) + 10; })
        .attr("id", function(d) { return d["id"] + d["name"].replace(" ", "") + d["season"] + "season"; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .style("text-anchor", "middle");
    if (xtext != "Time") {
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10)
            .tickFormat(function(d) {
                return formatAxisText(d, xtext);
            });
    } else {
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(0);
    }
    if (ytext != "Time") {
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10)
            .tickFormat(function(d) { return formatAxisText(d, ytext); });
    } else {
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(0);
    }
    x.domain([d3.min(dataset, function(d) { return d.x; }), d3.max(dataset, function(d) { return d.x; })]);
    y.domain([d3.min(dataset, function(d) { return d.y; }), d3.max(dataset, function(d) { return d.y; })]);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width - 50)
      .attr("dy", "-.71em")
      .style("text-anchor", "end")
      .text(xtext);
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(ytext);
    var legendRectSize = 18;
    var legendSpacing = 4;
    var legend = svg.selectAll('.legend')
      .data(color.domain().reverse())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height + offset;
        return 'translate(' + horz + ',' + vert + ')';
      });
    legend.append('rect')
      .attr('x', legendRectSize + margin.left + margin.right + 15)
      .attr('y', legendRectSize + margin.top)
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color)
      .style("stroke", "black");
    legend.append('text')
      .attr('x', legendRectSize + margin.left + margin.right + 60)
      .attr('y', legendRectSize + margin.top + legendRectSize / 1.5)
      .style("text-anchor", "start")
      .text(function(d) { return d; });
    var texts = colortext.split(",");
    for (var i=0; i<texts.length; i++) {
        var text = texts[i];
        if (i != texts.length - 1) {
            text = text + ",";
        }
        svg.append("g")
          .attr("class", "x axis")
        .append("text")
          .attr("dx", "4em")
          .attr("dy", (11 + i) + "em")
          .style("text-anchor", "left")
          .text(text)
    }
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 4))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(xtext + " vs " + ytext + ",");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 18 - (margin.top / 4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Colored by " + colortext + ", Sized by " + sizetext);
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", height - margin.bottom)
        .attr("text-anchor", "left")
        .style("font-size", "12px")
        .text("firstlinestats.com")
}
function formatAxisText(d, text) {
    if (text == "Time") {
        return startYear(d);
    }
    else if (text.indexOf("Fraction") >= 0 || text.indexOf("Percentage") >= 0) {
        return d + "%";
    } else {
        return d;
    }
}
function toggleText(circleid) {
    $("#" + circleid + "team").toggle();
    $("#" + circleid + "season").toggle();
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).style("text-anchor", "right").append("tspan").attr("x", "80").attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").style("text-anchor", "right").attr("x", "80").attr("y", y).attr("dy", "1em").text(word);
      }
    }
  });
}
