
function create_co(divid, data) {
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("border-radius", 3)
        .attr("class", "tooltip-inner")
        .text("a simple tooltip");
    var maxwidth = 600;
    var margin = {top: 150, right: 0, bottom: 10, left: 150},
        width = $("#gameStatsContent").width() - 100 - margin.left + margin.right,
        height = $("#gameStatsContent").width() - 100 - margin.top - margin.bottom;
    if (width > maxwidth)
      width = height = maxwidth;
    var x = d3.scale.ordinal().rangeBands([0, width]),
        z = d3.scale.linear().domain([0, 4]).clamp(true),
        c = d3.scale.category10().domain(d3.range(10));
    var ramp = d3.scale.linear().domain([0, 50, 100]).range(["red", "gray", "blue"]);
    var boxScale = d3.scale.linear()
        .domain([
            d3.min(data["links"], function(d) { return d.TOI; }),
            d3.max(data["links"], function(d) { return d.TOI; })])
        .range([3, width / data["nodes"].length]);
    var svg = d3.select(divid).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        //.style("margin-left", - margin.left + "px")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")")
        .attr("fill", "white");
    
      var matrix = [],
          nodes = data.nodes,
          n = nodes.length;
      // Compute index per node.
      nodes.forEach(function(node, i) {
        node.index = i;
        node.count = node.toi;
        console.log(node, i);
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
      });
      // Convert links to matrix; count character occurrences.
      data.links.forEach(function(link) {
        matrix[link.source][link.target].z = link.TOI;
        matrix[link.source][link.target].percent = link["cf%"];
        matrix[link.source][link.target].evf = link["evf"];
        matrix[link.source][link.target].eva = link["eva"];
        matrix[link.source][link.target].source = link["source"];
        matrix[link.source][link.target].target = link["target"];
      });
      // Precompute the orders.
      var orders = {
        name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
        count: d3.range(n).sort(function(a, b) { return nodes[b].toi - nodes[a].toi; }),
        group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
      };
      // The default sort order.
      x.domain(orders.name);
      svg.append("rect")
          .attr("class", "background")
          .attr("fill", "#eee")
          .attr("width", width)
          .attr("height", height);
      var row = svg.selectAll(".row")
          .data(matrix)
        .enter().append("g")
          .attr("class", "row")
          .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
          .each(row);
      row.append("line")
          .attr("x2", width);
      row.append("text")
          .attr("x", -6)
          .attr("y", x.rangeBand() / 2)
          .attr("dy", ".32em")
          .attr("text-anchor", "end")
          .attr("fill", function(d, i) { return get_color(nodes[i]["team"], true) })
          .text(function(d, i) { return nodes[i].name; });
      var column = svg.selectAll(".column")
          .data(matrix)
        .enter().append("g")
          .attr("class", "column")
          .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
      column.append("line")
          .attr("x1", - width);
      column.append("text")
          .attr("x", 6)
          .attr("y", x.rangeBand() / 2)
          .attr("dy", ".32em")
          .attr("text-anchor", "start")
          .attr("fill", function(d, i) { return get_color(nodes[i]["team"], true) })
          .text(function(d, i) { return nodes[i].name; });
      function row(row) {
        var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function(d) { return d.z; }))
          .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", function(d) { return x.rangeBand(); }) //function(d) { return boxScale(d.z); })
            .attr("height", function(d) { return boxScale(d.z); })
            .style("fill", function(d) { return ramp(d.percent); }) //return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
            .on("mouseover", mouseover)
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", mouseout);
      }
      function mouseover(p) {
        d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
        d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
        tooltip.html("<b>" + data["nodes"][p.source].name + "</b> with " + data["nodes"][p.target].name + "<br /><b>TOI: </b>" + format_toi(p.z) + "<br /><b>Corsi For: </b>" + p.evf + "<br /><b>Corsi Against: </b>" + p.eva + "<br /><b>CF%: </b>" + p.percent + "%");
        tooltip.style("visibility", "visible")
      }
      function mouseout() {
        d3.selectAll("text").classed("active", false);
        tooltip.style("visibility", "hidden");
      }
      d3.select("#order").on("change", function() {
        clearTimeout(timeout);
        order(this.value);
      });
      function format_toi(t) {
        var minutes = Math.floor(t / 60);
        var seconds = t - minutes * 60;
        if (seconds.toString().length == 1)
          seconds = "0" + seconds;
        if (minutes.toString().length == 1)
          minutes =  "0" + minutes;
        return minutes + ":" + seconds
      }
      function order(value) {
        x.domain(orders[value]);
        console.log(value, orders[value])
        var t = svg.transition().duration(2500);
        t.selectAll(".row")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
          .selectAll(".cell")
            .delay(function(d) { return x(d.x) * 4; })
            .attr("x", function(d) { return x(d.x); });
        t.selectAll(".column")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
      }
      var timeout = setTimeout(function() {
        order("group");
        d3.select("#order").property("selectedIndex", 2).node().focus();
      }, 5000);
svg.append("text")
    .attr("x", -100)
    .attr("y", -25)
    .attr("text-anchor", "left")
    .style("font-size", "12px")
    .style("fill", "grey")
    .text("firstlinestats.com")
}