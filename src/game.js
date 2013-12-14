$(document).ready(function() {
  noise.seed(Math.random());

  Crafty.init(900,600, document.getElementById('game'));
  Crafty.e('2D, Canvas, Color').attr({x: 0, y: 0, w: 100, h: 100}).color('#F00');
});