$(document).ready(function() {
  noise.seed(Math.random());

  Crafty.init(900,600, document.getElementById('game'));

  $.get("html/tooltip.html", function(data) {
    Crafty.e('2D, DOM, HTML').attr({x: 0, y: 0}).replace(data);
  });
});