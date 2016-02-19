var get_color = function get_team_color(team, primary) {
  
    var coloroptions = [
        ["1","ANA","#91764B","#EF5225","Anaheim Ducks","Anaheim"],
        ["2","BOS","#FFC422","#000000","Boston Bruins","Boston"],
        ["3","BUF","#002E62","#FDBB2F","Buffalo Sabres","Buffalo"],
        ["4","CAR","#E03A3E","#8E8E90","Carolina Hurricanes","Carolina"],
        ["5","CBJ","#00285C","#A9B0B8","Columbus Blue Jackets","Columbus"],
        ["6","CGY","#E03A3E","#000000","Calgary Flames","Calgary"],
        ["7","CHI","#E3263A","#000000","Chicago Blackhawks","Chicago"],
        ["8","COL","#8B2942","#01548A","Colorado Avalanche","Colorado"],
        ["9","DAL","#006A4E","#000000","Dallas Stars","Dallas"],
        ["10","DET","#EC1F26","#EC1F26","Detroit Red Wings","Detroit"],
        ["11","EDM","#E66A20","#003777","Edmonton Oilers","Edmonton"],
        ["12","FLA","#D59C05","#C8213F","Florida Panthers","Florida"],
        ["13","L.A","#000000","#AFB7BA","Los Angeles Kings","Los Angeles"],
        ["14","MIN","#025736","#BF2B37","Minnesota Wild","Minnesota"],
        ["15","MTL","#BF2F38","#213770","Montreal Canadiens","Montreal"],
        ["16","N.J","#E03A3E","#000000","New Jersey Devils","New Jersey"],
        ["17","NSH","#FDBB2F","#002E62","Nashville Predators","Nashville"],
        ["18","NYI","#00529B","#F57D31","New York Islanders","NY Islanders"],
        ["19","NYR","#0161AB","#E6393F","New York Rangers","NY Rangers"],
        ["20","OTT","#E4173E","#000000","Ottawa Senators","Ottawa"],
        ["21","PHI","#F47940","#000000","Philadelphia Flyers","Philadelphia"],
        ["22","PHX","#8E0028","#EFE1C6","Phoenix Coyotes","Phoenix"],
        ["23","PIT","#D1BD80","#000000","Pittsburgh Penguins","Pittsburgh"],
        ["24","S.J","#F38F20","#05535D","San Jose Sharks","San Jose"],
        ["25","STL","#0546A0","#FFC325","St. Louis Blues","St. Louis"],
        ["26","T.B","#013E7D","#CCCCCC","Tampa Bay Lightning","Tampa Bay"],
        ["27","TOR","#003777","#003777","Toronto Maple Leafs","Toronto"],
        ["28","VAN","#07646F","#047A4A","Vancouver Canucks","Vancouver"],
        ["29","WPG","#0168AB","#002E62","Winnipeg Jets","Winnipeg"],
        ["30","WSH","#00214E","#CF132B","Washington Capitals","Washington"],
        ["31","ATL","#002E62","#0168AB","Atlanta Thrashers","Atlanta"],
        ["32","ARI","#8E0028","#EFE1C6","Arizona Coyotes","Arizona"]
    ]
    for (var i=0; i<coloroptions.length; i++) {
        var color = coloroptions[i];
        if (color[4].indexOf(team) != -1) {
            if (primary == true) {
                return color[2];
            } else {
                return color[3];
            }
        }
    }
}