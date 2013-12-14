var mapOptions = {
  width: 30,
  height: 20,
  tileWidth: 20,
  tileHeight: 20,
  numCounties: 12
};

$(document).ready(function() {
  noise.seed(Math.random());

  Crafty.init(900,600, document.getElementById('game'));

  generateMap();

  /*$.get("html/tooltip.html", function(data) {
    Crafty.e('2D, DOM, HTML').attr({x: 0, y: 0}).replace(data);
  });*/
});

function generateMap() {
  var scale = 3.778624246;
  var xOffset = Math.floor(Math.random() * 1000);
  var yOffset = Math.floor(Math.random() * 1000);

  var center = new Crafty.math.Vector2D(0.5, 0.5);

  var map = new Map(mapOptions.width, mapOptions.height);

  for(var i = 0; i < mapOptions.width; ++i) {
    for(var j = 0; j < mapOptions.height; ++j) {
      var height = center.distanceSq(new Crafty.math.Vector2D(i / (mapOptions.width - 1), j / (mapOptions.height - 1)));
      height *= 3;
      height -= 0.5;

      if(noise.perlin2(i / scale + xOffset, j / scale + yOffset) + height > 0.1) {
         map.cell(i, j).land = false;
      } else {
        map.cell(i, j).land =  true;
      }
    }
  }

  var landIndices = Array();
  for(var i = 0; i < map.data.length; ++i) {
    landIndices.push(i);
  }

  landIndices = _.shuffle(landIndices);

  var countiesAssigned = 0;
  for(var i = 0; countiesAssigned < mapOptions.numCounties; ++i) {
    if(map.cell(landIndices[i]).land) {
      map.cell(landIndices[i]).county = countiesAssigned;
      ++countiesAssigned;
    }
  }

  var haveUnassignedCounties = true;
  while(haveUnassignedCounties) {
    haveUnassignedCounties = false;
    for(var i = 0; i < map.data.length; ++i) {
      var cell = map.cell(landIndices[i]);
      if(!cell.hasOwnProperty('county')) {
        haveUnassignedCounties = true;

        var neighbors = map.neighbors(landIndices[i]);

        var counties = _.compact(_.pluck(neighbors, 'county'));

        if(counties.length == 0)
          continue;

        cell.county = counties[Math.floor(Math.random() * counties.length)];
      }
    }
  }
  
  for(var i = 0; i < mapOptions.width; ++i) {
    for(var j = 0; j < mapOptions.height; ++j) {
      if(map.cell(i, j).land) {
        var color = 'green';
      } else {
        var color = 'blue';
      }
      var e = Crafty.e('2D, Color, DOM, HTML')
        .attr({x: i * mapOptions.tileWidth, y: j * mapOptions.tileHeight, w: mapOptions.tileWidth, h: mapOptions.tileHeight})
        .color(color);
      if(map.cell(i,j).hasOwnProperty('county') && map.cell(i,j).land) {
        e.replace('<span style="position: relative; top: 11px; left: 6px">' + map.cell(i,j).county + '</span');
      }
    }
  }
}