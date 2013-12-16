var mapOptions = {
  width: 28,
  height: 42,
  tileWidth: 20,
  tileHeight: 20,
  numCounties: 30
};

var canvasWidth = 912;
var canvasHeight = 544; // 344 is 100% height
var mapHeight = mapOptions.height * mapOptions.tileHeight / 4 + (mapOptions.tileHeight / 4 * 3);

var HUDButtons;

var tooltip;
var tooltipData;

var bishopPopover;
var bishopPopoverTemplate;

var errorTemplate;

var game = {
  map: undefined,
  counties: [],
  bishops: [],

  totalFollowers: function() {
    var r = 0;
    for(var i = 0; i < this.counties.length; ++i) {
      r += this.counties[i].converts;
    }
    return r;
  },

  month: 1,
  money: 20000
};

function openBishopDialog() {
  openDialog('bishop', {bishops: game.bishops});

  for(var i = 0; i < game.bishops.length; ++i) {
    var fn = function() {
      var index = i;
      $('#bishop-' + game.bishops[index].name).on('mouseenter', function(e) {
        bishopPopover.replace(bishopPopoverTemplate(game.bishops[index]));
        bishopPopover.visible = true;
      });

      $('#bishop-' + game.bishops[index].name).on('mousemove', function(e) {
        followMouse(
          bishopPopover,
          e.clientX - $('#game').offset().left,
          e.clientY - $('#game').offset().top,
          $('#bishop-popover').width(),
          $('#bishop-popover').height());
        //bishopPopover.attr({x: e.clientX - $('#game').offset().left + 10, y: e.clientY - $('#game').offset().top + 10})
      });

      $('#bishop-' + game.bishops[index].name).on('mouseleave', function(e) {
        bishopPopover.visible = false;
      });
    };
    fn();
  }
}

function followMouse(element, canvasX, canvasY, width, height) {
  if(canvasX < canvasWidth / 2) {
    var x = canvasX + 10;
  } else {
    var x = canvasX - width - 10;
  }

  if(canvasY < canvasHeight / 2) {
    var y = canvasY + 10;
  } else {
    var y = canvasY - height - 10;
  }

  element.attr({x: x, y: y});
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

  Crafty.sprite(32, "assets/church.png", {
    churchSmall: [0, 0, 1, 1]
  });

  generateMap();
  generateCounties();

  //Crafty.viewport.y = -(mapHeight - canvasHeight) / 4;

  $.get("html/tooltip.html", function(data) {
    tooltipData = doT.template(data);
    tooltip = Crafty.e('2D, DOM, HTML').attr({x: 4, y: -Crafty.viewport.y + canvasHeight - 160, z: 10000, visible: false});
  });

  $.get("html/bishop_popover.html", function(data) {
    bishopPopoverTemplate = doT.template(data);
    bishopPopover = Crafty.e('2D, DOM, HTML').attr({x: 0, y: 0, z: 20000});
  });

  $.get("html/button_bar.html", function(data) {
    HUDButtons = Crafty.e('2D, DOM, HTML').attr({x: canvasWidth - 168, y: -Crafty.viewport.y + canvasHeight - 84, z: 9999, w: 180})
      .replace(data);
    $('#manage-bishops').on('click', openBishopDialog);

    $('#end-turn').on('click', endTurn);
  });

  $.get('html/error.html', function(data) {
    errorTemplate = doT.template(data);
  });

  loadDialog('county');
  loadDialog('bishop');

  $('#manage-bishops').tooltip({delay: { show: 1000}});

  game.bishops = [];

  var countiesByLucrativeness = _.sortBy(game.counties, function(c) { return c.lucrativeness();});
  var startingCounty = countiesByLucrativeness[randRange(0, 4)];
  addChurch(startingCounty);
  startingCounty.bishop = generateBishop();
  startingCounty.bishop.charisma = randRange(60, 71);
  startingCounty.converts = randRange(90, 110);

  updateGlobalStateUI();
});

function updateGlobalStateUI() {
  $('#week-num').html(game.month);
  $('#num-followers').html(game.totalFollowers());
  $('#treasury').html(toMoneyFormat(game.money));
}

function signalError(error) {
  $('#error').html(errorTemplate({error: error}));
}

function toMoneyFormat(amount) {
  var DecimalSeparator = Number("1.2").toLocaleString().substr(1,1);

  var AmountWithCommas = amount.toLocaleString();
  var arParts = String(AmountWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = (arParts.length > 1 ? arParts[1] : '');
  decPart = (decPart + '00').substr(0,2);

  return '$' + intPart + DecimalSeparator + decPart;
}

function toPopulationFormat(amount) {
  return amount.toLocaleString();
}

function toFuzzyFormat(amount) {
  if(amount <= 0) {
    return 'None';
  }
  if(amount < 20) {
    return 'Very Low (' + amount + ')';
  } else if(amount < 40) {
    return 'Low (' + amount + ')';
  } else if(amount < 60) {
    return 'Moderate (' + amount + ')';
  } else if(amount < 80) {
    return 'High (' + amount + ')';
  } else {
    return 'Very High (' + amount + ')';
  }
}

function endTurn() {
  game.counties.forEach(updateFervor);
  game.counties.forEach(updateConverts);
  game.counties.forEach(updateHostility);

  ++game.month;
  updateGlobalStateUI();
}

function updateFervor(county) {
  amt = Math.min(Math.abs(county.internalFervorShock), 2);
  county.internalFervorShock -= sign(county.internalFervorShock) * amt;
}

function updateConverts(county) {
  var growth = 0;

  if(county.church && county.bishop) {
    growth += county.church.bishopCharismaRate() * county.bishop.charisma;
  }

  growth -= county.fervorTitheModifier() * county.tithe
  growth -= 0.1 * county.hostility;
  county.converts = clamp(Math.round(county.converts * (1 + growth/100)), 0, county.population);
}

function updateHostility(county) {
  county.hostility += randRangeFloat(county.hostilityDrift - county.hostilityRange, 
    county.hostilityDrift + county.hostilityRange);
  county.hostility = clamp(county.hostility);
}

function expandChurch(county) {
  var churchMoney = 20000
  if(game.money < churchMoney) {
    signalError('Not enough money! You need ' + toMoneyFormat(churchMoney));
  } else {
    game.money -= churchMoney;
    county.church.level += 1;
    updateGlobalStateUI();
    openDialog('county', county);
  }
}

function addChurch(county) {
  county.church = new Church();
  var cell = county.cells[randRange(0, county.cells.length)];
  var x = cell.entity._x;
  var y = cell.entity._y - 22;
  var z = cell.entity._z + 3000;
  county.church.entity = Crafty.e('2D, DOM, churchSmall').attr({x:x, y:y, z:z});
}

function generateBishop() {
  return new Bishop(
    'Mccreepy-San',
    randRange(0, 101),
    randRange(0, 101),
    randRange(0, 101),
    randRange(0, 101));
}

function generateCounties() {

  game.counties = Array(mapOptions.numCounties);
  for(var i = 0; i < mapOptions.numCounties; ++i) {
    game.counties[i] = new County(
      countyNames[i],
      0, // pop
      0, // converts
      randRange(2500, 6000), // income
      randRange(0, 101), // initial hostility
      10); //initial fervor shock
  }

  for(var i = 0; i < game.map.data.length; ++i) {
    var cell = game.map.cell(i);
    if(cell.land) {
      cell.county = game.counties[cell.county - 1];
      cell.county.cells.push(cell);
    } else {
      cell.county = undefined;
    }
    
  }

  game.counties.forEach(function(county) {
    var low = 2500 * county.cells.length;
    var high = 15000 * county.cells.length;
    county.population = randRange(low, high);
    county.converts = 0;

    county.setNeighbors(game.map);
  });

  // set hostility
  var avgLucrativeness = _.reduce(game.counties, function(memo, f, i, l) {
    return memo + f.lucrativeness() / l.length;
  }, 0);

  game.counties.forEach(function(county) {
    var normLucrativeness = county.lucrativeness() / avgLucrativeness;
    county.hostility = Math.round(100 * (1 / (1 + Math.exp(1 - normLucrativeness))));
  });
}

function generateMap() {
  var scale = 4.818624246;
  var xOffset = Math.floor(Math.random() * 1000);
  var yOffset = Math.floor(Math.random() * 1000);

  var center = new Crafty.math.Vector2D(0.5, 0.5);

  game.map = new Map(mapOptions.width, mapOptions.height);

  for(var i = 0; i < mapOptions.width; ++i) {
    for(var j = 0; j < mapOptions.height; ++j) {
      var height = center.distanceSq(new Crafty.math.Vector2D(i / (mapOptions.width - 1), j / (mapOptions.height - 1)));
      height *= 1.8;
      height -= 0.23;

      if(noise.perlin2(i / scale + xOffset, j / scale + yOffset) + height > 0.1) {
        game.map.cell(i, j).land = false;
      } else {
        game.map.cell(i, j).land = true;
      }
    }
  }

  var landIndices = Array();
  for(var i = 0; i < game.map.data.length; ++i) {
    landIndices.push(i);
  }

  landIndices = _.shuffle(landIndices);

  var countiesAssigned = 0;
  for(var i = 0; countiesAssigned < mapOptions.numCounties; ++i) {
    if(game.map.cell(landIndices[i]).land) {
      game.map.cell(landIndices[i]).county = countiesAssigned + 1;
      ++countiesAssigned;
    }
  }

  var haveUnassignedCounties = true;
  while(haveUnassignedCounties) {
    haveUnassignedCounties = false;
    for(var i = 0; i < game.map.data.length; ++i) {
      var cell = game.map.cell(landIndices[i]);
      if(!cell.county) {
        haveUnassignedCounties = true;

        var neighbors = game.map.neighbors(landIndices[i]);

        var neighboringCounties = _.compact(_.pluck(neighbors, 'county'));

        if(neighboringCounties.length == 0)
          continue;

        cell.county = neighboringCounties[randRange(0, neighboringCounties.length)];
      }
    }
  }
  
  var iso = Crafty.isometric.size(32);
  for(var i = mapOptions.width - 1; i >= 0; --i) {
    for(var j = 0; j < mapOptions.height; ++j) {
      if(game.map.cell(i, j).land) {
        var create = function() {
          var x = i; //closures
          var y = j;

          var borderName = '';

          if(!game.map.northNeighbor(i, j) || !game.map.northNeighbor(i, j).land || game.map.northNeighbor(i,j).county != game.map.cell(i,j).county)
            borderName += 'North';

          if(!game.map.eastNeighbor(i, j) || !game.map.eastNeighbor(i, j).land || game.map.eastNeighbor(i,j).county != game.map.cell(i,j).county)
            borderName += 'East';

          if(!game.map.southNeighbor(i, j) || !game.map.southNeighbor(i, j).land || game.map.southNeighbor(i,j).county != game.map.cell(i,j).county)
            borderName += 'South';

          if(!game.map.westNeighbor(i, j) || !game.map.westNeighbor(i, j).land || game.map.westNeighbor(i,j).county != game.map.cell(i,j).county)
            borderName += 'West';

          game.map.cell(i,j).borderName = borderName;

          var e = Crafty.e('2D, DOM, groundBorder' + borderName + ', Mouse')
            .attr('z', i+1 * j+1)
            .areaMap([16,0],[32,8],[32,24],[16,32],[0,24],[0,8])
            .bind('Click', function(e) {
              if(dialogCloseEvent && e.timeStamp == dialogCloseEvent.timeStamp) {
                console.log('HACK HACK HACK');
                return; // HACK HACK HACK HACK
              }
              console.log(x + ', ' + y + ': ' + game.map.cell(x, y).county);

              tooltip.visible = false;
              var county = game.map.cell(x,y).county;
              openDialog('county', county);
              var bishop = county.bishop;
              if(bishop) {
                $('#bishop-' + bishop.name).on('mouseenter', function(e) {
                  bishopPopover.replace(bishopPopoverTemplate(bishop));
                  bishopPopover.visible = true;
                });

                $('#bishop-' + bishop.name).on('mousemove', function(e) {
                  followMouse(
                    bishopPopover,
                    e.clientX - $('#game').offset().left,
                    e.clientY - $('#game').offset().top,
                    $('#bishop-popover').width(),
                    $('#bishop-popover').height());
                  //bishopPopover.attr({x: e.clientX - $('#game').offset().left + 10, y: e.clientY - $('#game').offset().top + 10})
                });

                $('#bishop-' + bishop.name).on('mouseleave', function(e) {
                  bishopPopover.visible = false;
                });
              }

              if(county.church) {
                $('#tithe').on('change', function(e) {
                  var tithe = parseInt($(this).val());
                  if(isNaN(tithe)) {
                    tithe = 0;
                  } else {
                    tithe = clamp(tithe);
                  }
                  $(this).val(tithe);
                  county.tithe = tithe;
                });

                $('#bishop-pay').on('change', function(e) {
                  var pay = parseInt($(this).val());
                  if(isNaN(pay)) {
                    pay = 0;
                  } else {
                    pay = clamp(pay, 0, 10000);
                  }
                  $(this).val(pay);
                  county.bishopPay = pay;
                });

                $('#expand-church').on('click', function() {
                  expandChurch(county);
                })
              }
            })
            .bind('MouseOver', function(e) {
              var county = game.map.cell(x,y).county;
              county.setHighlight(true);

              var html = tooltipData(county);
              tooltip.replace(html);
              tooltip.visible = true;

            })
            .bind('MouseOut', function() {
              var county = game.map.cell(x,y).county;
              county.setHighlight(false);

              tooltip.visible = false;
            });
          game.map.cell(i, j).entity = e;
          iso.place(i, j, 0, e);
        }
        create();
      }
    }
  }
}