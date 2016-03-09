function createBubbleGraph(data, x, y, color, size) {
    //console.log(data)
    $("#comparisonGraph").html("");


    var x = 'G60';
    var y = 'age'
    var color = 'games'
    var size = 'hit'

    
    var margin = {top: 20, right: 10, bottom: 30, left: 40},
        width = $("#skatersTableContainer").width(),
        height = width / 1.5 - margin.top - margin.bottom,
        maxradius = 0,
        maxheight = 0,
        minheight = 100000000,
        minwidth = 100000000,
        maxwidth = 0,
        mincolor = 100000000,
        maxcolor = 0;


    var dataset = $.map(data, function(obj, index) {
        var calc = {};
        calc.name = obj.name;
        calc.position = obj.position;
        calc.currentTeam = obj.currentTeamAbbr;
        calc.age = obj.age;
        calc.height = obj.height;
        calc.weight = obj.weight;
        calc.games = obj.games;
        calc.goals = obj.goals;
        calc.assists = obj.assists;
        calc.assists2 = obj.assists2;
        calc.points = obj.goals + obj.assists + obj.assists2;
        if (obj.toi != 0) {
            calc.G60 = ((obj.goals) / obj.toi * 3600).toFixed(2);
            calc.A60 = ((obj.assists + obj.assists2) / obj.toi * 3600).toFixed(2);
            calc.P60 = ((obj.goals + obj.assists + obj.assists2) / obj.toi *3600).toFixed(2)
        } else {
            calc.G60 = '';
            calc.A60 = '';
            calc.P60 = '';
        }
        calc.plusMinus = obj.gf - obj.ga;
        calc.hit = obj.hit;
        calc.sf = obj.sf;
        calc.fo_w = obj.fo_w;
        
        if (obj["fo_l"] != 0)
            calc.facPercent =  (obj["fo_w"] / (obj["fo_w"] + obj["fo_l"]) * 100).toFixed(2);
        else
            calc.facPercent = 0

        var time = obj["toi"] / obj["games"];
        var minutes = Math.floor(time / 60); // 7
        var seconds = Math.round(time % 60); // 30
        if (seconds < 10)
            seconds = "0" + seconds;
        if (minutes < 10)
            minutes = "0" + minutes
        calc.toiGm = minutes + ":" + Math.round(seconds);
        
        calc.x = calc[x];
        calc.y = calc[y];
        calc.color = calc[color]
        calc.size = calc[size];

        if (calc.size > maxradius) {
            maxradius = calc.size;
        }
        if (calc.y > maxheight) {
            maxheight = calc.y;
        }
        if (calc.y < minheight) {
            minheight = calc.y;
        }
        if (calc.x > maxwidth) {
            maxwidth = calc.x;
        }
        if (calc.x < minwidth) {
            minwidth = calc.x;
        }
        if (calc.color > maxcolor) {
            maxcolor = calc.color;
        }
        if (calc.color < mincolor) {
            mincolor = calc.color;
        }
        return calc;        
    });
    

    var color = d3.scale.linear().domain([Math.floor(mincolor), Math.round((mincolor + maxcolor) / 2), Math.ceil(maxcolor)]).range(["#FF2400", "#FFFFFF", "#0042FF"])
    var maxallowed = 35,
        minallowed = 2;
    var rr = maxallowed / maxradius;
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var color = d3.scale.linear().domain([Math.floor(mincolor), Math.round((mincolor + maxcolor) / 2), Math.ceil(maxcolor)]).range(["#FF2400", "#FFFFFF", "#0042FF"])
    var maxallowed = 35,
        minallowed = 2;
    var rr = maxallowed / maxradius;

    var svg = d3.select("#comparisonGraph")
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
    var xtext = "face"
    var ytext = "face"
    var colortext = "red"
    var sizetext = "size"

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) {
            return cpos(d.x, minwidth, maxwidth, width, maxallowed, xtext);
        })
        .attr("cy", function(d) {
            return height - cpos(d.y, minheight, maxheight, height, maxallowed, ytext);
        })
        .attr("r", function(d) {
            return cpos(d.size * rr, minallowed, maxallowed, maxallowed, 0, sizetext);
        })
        .attr("id", function(d) { return d["Team"].replace(" ", "") + d["season"]; })
        .attr("onclick", function(d) {
            return "toggleText(\"" + d["Team"].replace(" ", "") + d["season"] + "\");";
        })
        .style("fill", function(d) {
            return color(d.color);
        })
        .style("stroke", "black")

     var texts = svg.selectAll("text")
        .data(dataset)
        .enter();

}

function cpos(val, minval, maxval, distance, maxallowed, xtext) {
    if (xtext != "Time") {
        return (val - minval) / (maxval - minval) * (distance - maxallowed * 2) + maxallowed;
    } else {
        return (years(distance) * (startYear(val) - 2002));
    }
}