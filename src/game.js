var mapOptions = {
  width: 28,
  height: 40,
  tileWidth: 20,
  tileHeight: 20,
  numCounties: 30
};

var canvasWidth = 912;
var canvasHeight = 344;

var tooltip;
var tooltipData;

function randRange(low, high) {
  return Math.floor(Math.random() * (high - low)) + low;
}

$(document).ready(function() {
  noise.seed(Math.random());

  Crafty.init(canvasWidth,canvasHeight, document.getElementById('game'));

  Crafty.sprite(32, "assets/ground.png", {
    groundBorder: [0,0,1,1],
    groundBorderNorth: [0,1,1,1],
    groundBorderNorthEastSouth: [0,2,1,1],
    groundBorderEastSouth: [0,3,1,1],
    groundBorderNorthEastSouthWest: [1,0,1,1],
    groundBorderWest: [1,1,1,1],
    groundBorderEastSouthWest: [1,2,1,1],
    groundBorderSouthWest: [1,3,1,1],
    groundBorderNorthWest: [2,0,1,1],
    groundBorderSouth: [2,1,1,1],
    groundBorderNorthSouthWest: [2,2,1,1],
    groundBorderNorthSouth: [2,3,1,1],
    groundBorderNorthEastWest: [3,0,1,1],
    groundBorderEast: [3,1,1,1],
    groundBorderNorthEast: [3,2,1,1],
    groundBorderEastWest: [3,3,1,1],
  });

  Crafty.sprite(32, "assets/ground_highlight.png", {
    groundHighlightBorder: [0,0,1,1],
    groundHighlightBorderNorth: [0,1,1,1],
    groundHighlightBorderNorthEastSouth: [0,2,1,1],
    groundHighlightBorderEastSouth: [0,3,1,1],
    groundHighlightBorderNorthEastSouthWest: [1,0,1,1],
    groundHighlightBorderWest: [1,1,1,1],
    groundHighlightBorderEastSouthWest: [1,2,1,1],
    groundHighlightBorderSouthWest: [1,3,1,1],
    groundHighlightBorderNorthWest: [2,0,1,1],
    groundHighlightBorderSouth: [2,1,1,1],
    groundHighlightBorderNorthSouthWest: [2,2,1,1],
    groundHighlightBorderNorthSouth: [2,3,1,1],
    groundHighlightBorderNorthEastWest: [3,0,1,1],
    groundHighlightBorderEast: [3,1,1,1],
    groundHighlightBorderNorthEast: [3,2,1,1],
    groundHighlightBorderEastWest: [3,3,1,1],
  });


  generateMap();

  $.get("html/tooltip.html", function(data) {
    tooltipData = doT.template(data);
    tooltip = Crafty.e('2D, DOM, HTML').attr({x: 0, y: 0, z: 10000});
  });
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
        map.cell(i, j).land = true;
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
      map.cell(landIndices[i]).county = countiesAssigned + 1;
      ++countiesAssigned;
    }
  }

  var haveUnassignedCounties = true;
  while(haveUnassignedCounties) {
    haveUnassignedCounties = false;
    for(var i = 0; i < map.data.length; ++i) {
      var cell = map.cell(landIndices[i]);
      if(!cell.county) {
        haveUnassignedCounties = true;

        var neighbors = map.neighbors(landIndices[i]);

        var counties = _.compact(_.pluck(neighbors, 'county'));

        if(counties.length == 0)
          continue;

        cell.county = counties[Math.floor(Math.random() * counties.length)];
      }
    }
  }

  var skepticisms = ['Very low', 'Low', 'Moderate', 'High', 'Very high'];

  var counties = Array(mapOptions.numCounties);
  for(var i = 0; i < mapOptions.numCounties; ++i) {
    var pop= Math.round(Math.random() * 95000 + 5000);
    counties[i] = new County(
      countyNames[randRange(0, countyNames.length)],
      pop,
      Math.round(Math.random() * pop),
      skepticisms[randRange(0, skepticisms.length)],
      Math.round(Math.random() * 45000 + 30000));
  }
  
  var iso = Crafty.isometric.size(32);
  for(var i = mapOptions.width - 1; i >= 0; --i) {
    for(var j = 0; j < mapOptions.height; ++j) {
      if(map.cell(i, j).land) {
        var create = function() {
          var x = i; //closures
          var y = j;

          var borderName = '';

          if(!map.northNeighbor(i, j) || !map.northNeighbor(i, j).land || map.northNeighbor(i,j).county != map.cell(i,j).county)
            borderName += 'North';

          if(!map.eastNeighbor(i, j) || !map.eastNeighbor(i, j).land || map.eastNeighbor(i,j).county != map.cell(i,j).county)
            borderName += 'East';

          if(!map.southNeighbor(i, j) || !map.southNeighbor(i, j).land || map.southNeighbor(i,j).county != map.cell(i,j).county)
            borderName += 'South';

          if(!map.westNeighbor(i, j) || !map.westNeighbor(i, j).land || map.westNeighbor(i,j).county != map.cell(i,j).county)
            borderName += 'West';

          map.cell(i,j).borderName = borderName;

          var e = Crafty.e('2D, DOM, groundBorder' + borderName + ', Mouse')
            .attr('z', i+1 * j+1)
            .areaMap([16,0],[32,8],[32,24],[16,32],[0,24],[0,8])
            .bind('Click', function() {
              console.log(x + ', ' + y + ': ' + map.cell(x, y).county);
            })
            .bind('MouseOver', function(e) {
              var county = map.cell(x,y).county;
              for(var k = 0; k < map.data.length; ++k) {
                if(map.cell(k) && map.cell(k).entity && map.cell(k).county == county) {
                  map.cell(k).setHighlight(true);
                }
              }

              var c = {
                name: counties[county - 1].name,
                population: counties[county - 1].population,
                converts: counties[county - 1].converts,
                skepticism: counties[county - 1].skepticism,
                income: counties[county - 1].income
              };

              var html = tooltipData(c);
              tooltip.replace(html);

              $('#county-popover').removeClass('hidden');
              $('#county-popover').addClass('visible');
            })
            .bind('MouseMove', function(e) {
              var tooltipX = e.layerX;
              if(e.layerX > canvasWidth / 2) {
                var tooltipX = e.layerX - 270;
              }

              var tooltipY = e.layerY;
              if(e.layerY > canvasHeight / 2) {
                var tooltipY = e.layerY - 145;
              }

              tooltip.attr({x: tooltipX, y: tooltipY});
            })
            .bind('MouseOut', function() {
              var county = map.cell(x,y).county;
              for(var k = 0; k < map.data.length; ++k) {
                if(map.cell(k) && map.cell(k).entity && map.cell(k).county == county) {
                  map.cell(k).setHighlight(false);
                }
              }
              $('#county-popover').addClass('hidden');
              $('#county-popover').removeClass('visible');
            });
          map.cell(i, j).entity = e;
          iso.place(i, j, 0, e);
        }
        create();
      }
    }
  }
}