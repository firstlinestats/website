function savePNG(button_id, svg_id) {
  d3.select(button_id).on("click", function(){
    var svgText = $(svg_id).html();
    canvg('canvas', svgText, { renderCallback: function () {
      var img = canvas.toDataURL("image/png");
      window.open(img);
      }});
  });
}