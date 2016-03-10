function savePNG(button_id, svg_id) {
  d3.select(button_id).on("click", function(){
    var svgText = $(svg_id).html();
    var width = $(svg_id).width();
    if (width < 1140) {
        var height = $(svg_id).height();
        var multiple = 1140 / width;
        var newwidth = width * multiple;
        var newheight = height * multiple;
        svgText = svgText.replace("width=\"" + width + "\"", "width=\"" + newwidth + "\"").replace("height=\"" + height + "\"", "height=\"" + newheight + "\"")
    }
    canvg('canvas', svgText, { renderCallback: function () {
      var img = canvas.toDataURL("image/png");
      window.open(img);
      }});
  });
}