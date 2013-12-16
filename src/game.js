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

// global entities
var HUDButtons;
var tooltip;
var bishopPopover;

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
  money: 20000,
  pendingBishops: {}
};

function openBishopDialog() {
  openDialog('bishop', {bishops: game.bishops});
}

function followMouse(element, canvasX, canvasY, width, height) {
  if(canvasX < canvasWidth / 2) {
    var x = canvasX + 10;
  } else {
    var x = canvasX - width - 20;
  }

  if(canvasY < canvasHeight / 2) {
    var y = canvasY;
  } else {
    var y = canvasY - height - 30;
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
    church1: [0, 0, 1, 1],
    church2: [2, 0, 2, 2],
    church3: [0, 2, 4, 2]
  });

  generateMap();
  generateCounties();

  //Crafty.viewport.y = -(mapHeight - canvasHeight) / 4;
  Crafty.viewport.y += 24;

  loadSnippet('tooltip', function(data) {
    tooltip = Crafty.e('2D, DOM, HTML').attr({x: 4, y: -Crafty.viewport.y + canvasHeight - 160, z: 10000, visible: false});
  });

  loadSnippet('bishop_popover', function(data) {
    bishopPopover = Crafty.e('2D, DOM, HTML').attr({x: 0, y: 0, z: 20000});
  });

  $.get("html/button_bar.html", function(data) {
    HUDButtons = Crafty.e('2D, DOM, HTML').attr({x: canvasWidth - 168, y: -Crafty.viewport.y + canvasHeight - 84, z: 9999, w: 180})
      .replace(data);
    $('#manage-bishops').on('click', openBishopDialog);

    $('#end-turn').on('click', endTurn);
  });

  loadSnippet('error');
  loadSnippet('info_alert');

  loadDialog('county', countyDialogConfig);
  loadDialog('bishop', bishopDialogConfig);
  loadDialog('bishop_add', bishopAddDialogConfig);
  loadDialog('info', function() {})
  loadDialog('end_turn', function() {})

  $('#manage-bishops').tooltip({delay: { show: 1000}});

  game.bishops.push(generateBishop());

  var countiesByLucrativeness = _.sortBy(game.counties, function(c) { return c.lucrativeness();});
  var startingCounty = countiesByLucrativeness[randRange(0, 4)];
  addChurch(startingCounty);
  startingCounty.bishop = generateBishop();
  startingCounty.bishop.charisma = randRange(60, 71);
  startingCounty.converts = randRange(90, 110);

  updateGlobalStateUI();

  loadDialog('begin_game', function() {}, function() { openDialog('begin_game', {});}, beginGameDialogClose);
});

function beginGameDialogClose(d) {
  var name = $('#religion-name-input').val();
  game.name = name;
  updateGlobalStateUI();
}

function countyDialogConfig(county) {
  var bishop = county.bishop;

  $('#spread-pamphlets').on('click', function() {
    spreadPamphlets(county);
  });

  if(bishop) {
    $('#bishop-' + bishop.index).on('mouseenter', function(e) {
      bishopPopover.replace(compileSnippet('bishop_popover', bishop));
      bishopPopover.visible = true;
    });

    $('#bishop-' + bishop.index).on('mousemove', function(e) {
      followMouse(
        bishopPopover,
        e.clientX - $('#game').offset().left,
        e.clientY - $('#game').offset().top,
        $('#bishop-popover').width(),
        $('#bishop-popover').height());
    });

    $('#bishop-' + bishop.index).on('mouseleave', function(e) {
      bishopPopover.visible = false;
    });
  } else {
    $('#add-bishop').on('click', function() {
      addBishop(county);
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
    });

    $('#remove-bishop').on('click', function() {
      removeBishop(county);
    });
  } else {
    $('#build-church').on('click', function() {
      buildChurch(county);
    });
  }
}

function bishopDialogConfig(bishops) {
  bishopDialogMouseovers(bishops);

  $('#add-bishop').on('click', function() {
    recruitBishop(bishops);
  });
}

function bishopAddDialogConfig(bishops, dialog) {
  bishopDialogMouseovers(bishops);
  for(var i = 0; i < bishops.bishops.length; ++i) {
    var fn = function() {
      var index = i;
      console.log('set click on ' + index + ': ' + bishops.bishops[index].index);
      $('#bishop-' + bishops.bishops[index].index).on('click', function(e) {
        bishops.county.bishop = bishops.bishops[index];
        bishops.bishops.splice(index, 1);
        dialog.close();
        openDialog('county', bishops.county);
      });
    };
    fn();
  }
}

function bishopDialogMouseovers(bishops) {
  bishops = bishops.bishops;
  for(var i = 0; i < bishops.length; ++i) {
    var fn = function() {
      var index = i;

      console.log('set mouseover on ' + index + ': ' + bishops[index].index);

      $('#bishop-' + bishops[index].index).on('mouseenter', function(e) {
        bishopPopover.replace(compileSnippet('bishop_popover', bishops[index]));
        bishopPopover.visible = true;
      });

      $('#bishop-' + bishops[index].index).on('mousemove', function(e) {
        followMouse(
          bishopPopover,
          e.clientX - $('#game').offset().left,
          e.clientY - $('#game').offset().top,
          $('#bishop-popover').width(),
          $('#bishop-popover').height());
      });

      $('#bishop-' + bishops[index].index).on('mouseleave', function(e) {
        bishopPopover.visible = false;
      });
    };
    fn();
  }
}

function updateGlobalStateUI() {
  $('#religion-name').html(game.name);
  $('#week-num').html(game.month);
  $('#num-followers').html(game.totalFollowers());
  $('#treasury').html(toMoneyFormat(game.money));
}

function signalError(error) {
  $('#error').html(compileSnippet('error', {error: error}));
}

function toMoneyFormat(amount) {
  var DecimalSeparator = Number("1.2").toLocaleString().substr(1,1);

  var AmountWithCommas = amount.toLocaleString();
  var arParts = String(AmountWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = (arParts.length > 1 ? arParts[1] : '');
  decPart = (decPart + '00').substr(0,2);

  var sign = '';
  if(intPart[0] == '-') {
    sign = '-';
    intPart = intPart.substr(1);
  }

  var r = sign + '$' + intPart + DecimalSeparator + decPart;

  if(amount < 0) {
    r = '<span class="text-danger">' + r + '</span>';
  }
  return r;
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
  var lastMoney = game.money;

  var events = [];

  game.counties.forEach(updateFervor);
  game.counties.forEach(updateConverts);
  game.counties.forEach(updateHostility);
  game.counties.forEach(updateMoney);
  game.counties.forEach(function(county) { updateBishopDefections(county, events);});

  if(game.pendingBishops[game.month]) {
    game.pendingBishops[game.month].forEach(function(b) {
      game.bishops.push(b);
    });

    delete game.pendingBishops[game.month];
  }

  ++game.month;
  updateGlobalStateUI();

  if(events.length == 0) {
    events = getDefaultEvents(game.money, lastMoney)
  }

  openDialog('end_turn', {title: 'Month ' + game.month, events: events});
}

function updateFervor(county) {
  amt = Math.min(Math.abs(county.internalFervorShock), 2);
  county.internalFervorShock -= sign(county.internalFervorShock) * amt;
}

function updateConverts(county) {
  if(county.church && county.bishop) {
    var min = county.minConverts;
  } else {
    var min = 0;
  }

  if(county.church) {
    var churchMax = county.church.maxConverts();
  } else {
    var churchMax = county.population;
  }

  var growth = county.growth;
  county.converts = clamp(Math.round(county.converts * (1 + growth/100)), min, Math.min(county.population, churchMax));
}

function updateHostility(county) {
  county.hostility += randRangeFloat(county.hostilityDrift - county.hostilityRange, 
    county.hostilityDrift + county.hostilityRange);
  county.hostility = clamp(county.hostility);
}

function updateMoney(county) {
  var profit = 0;

  if(county.church && county.bishop) {
    profit += county.income * county.tithe / 100 * county.converts;
  }

  if(county.bishop) {
    profit -= county.bishopPay;
  }

  if(county.church) {
    if(county.bishop) {
      var upkeepRatio = (100 - county.bishop.pennypinching) / 100;
    } else {
      var upkeepRatio = 1;
    }
    profit -= county.church.upkeep() * upkeepRatio;
  }

  game.money += profit;
}

function updateBishopDefections(county, events) {
  var alpha = 0.5;

  if(!county.bishop)
    return;

  var probability = Math.pow(1 - county.bishop.loyalty / 100, county.bishopPay / (alpha * county.income));

  console.log('defect p=' + probability);

  if(Math.random() < probability) {
    var bishopName = county.bishop.name;
    county.bishop = undefined;

    events.push(getEvent('bishop_defect', county.name, {religion: game.name, bishop: bishopName}));

  }
}

function recruitBishop(bishops) {
  var cost = 5000;
  if(game.money < cost) {
    signalError('Not enough money! You need ' + toMoneyFormat(cost));
  } else {
    $('#alerts').html(compileSnippet('info_alert', {text: 'Looking for a new bishop! Check back in a couple of months.'}));
    game.money -= cost;

    var delay = 2;
    if(!game.pendingBishops[game.month + delay]) {
      game.pendingBishops[game.month + delay] = [];
    }

    game.pendingBishops[game.month + delay].push(generateBishop());

    updateGlobalStateUI();
  }
}

function spreadPamphlets(county) {
  var cost = 2000;
  if(game.money < cost) {
    signalError('Not enough money! You need ' + toMoneyFormat(cost));
  } else {
    var amt = randRange(2, 8);
    game.money -= cost;
    county.hostility -= amt

    updateGlobalStateUI();
    openDialog('county', county);

    openDialog('info', {
      title: 'Spread Pamphlets',
      text: 'You print up gobs of pamphlets and hand them out. It takes hours. You\'re not sure how effective it was, but people seem slightly less hateful (maybe?)'
    });
  }
}

function buildChurch(county) {
  var cost = 20000;
  if(game.money < cost) {
    signalError('Not enough money! You need ' + toMoneyFormat(cost));
  } else {
    game.money -= cost;
    addChurch(county);
    county.converts = randRange(25, 76);

    updateGlobalStateUI();
    openDialog('county', county);
  }
}

function expandChurch(county) {
  var cost = county.church.upgradeCost();
  if(game.money < cost) {
    signalError('Not enough money! You need ' + toMoneyFormat(cost));
  } else {
    game.money -= cost;
    county.church.entity.removeComponent('church' + county.church.level);
    county.church.level += 1;
    county.church.entity.addComponent('church' + county.church.level);

    if(county.church.level == 2) {
      county.church.entity.y -= 32;
      county.church.entity.x -= 16;
    } else {
      county.church.entity.x -= 32;
    }

    updateGlobalStateUI();
    openDialog('county', county);
  }
}

function removeBishop(county) {
  game.bishops.push(county.bishop);
  county.bishop = undefined;

  openDialog('county', county);
}

function addBishop(county) {
  openDialog('bishop_add', {county: county, bishops:game.bishops});
}

function addChurch(county) {
  county.church = new Church();
  var cell = county.cells[randRange(0, county.cells.length)];
  var x = cell.entity._x;
  var y = cell.entity._y - 22;
  var z = cell.entity._z + 3000;
  county.church.entity = Crafty.e('2D, DOM, church1').attr({x:x, y:y, z:z});
}

function generateBishop() {
  return new Bishop(
    getBishopName(),
    'bishop' + randRange(0, 4) + '.png',
    randRange(0, 101), // charisma
    randRange(0, 101), // fervor
    randRange(45, 100), // loyalty
    randRange(0, 101)); //penny-pinching
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
            })
            .bind('MouseOver', function(e) {
              var county = game.map.cell(x,y).county;
              county.setHighlight(true);

              var html = compileSnippet('tooltip', county);
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