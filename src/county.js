var countyNames = [
  'Washington',
  'Jefferson',
  'Franklin',
  'Jackson',
  'Lincoln',
  'Madison',
  'Clay',
  'Montgomery',
  'Union',
  'Marion',
  'Monroe',
  'Wayne',
  'Grant',
  'Greene',
  'Warren',
  'Carroll',
  'Adams',
  'Clark',
  'Douglas',
  'Johnson',
  'Lake',
  'Lee',
  'Marshall',
  'Polk',
  'Calhoun',
  'Crawford',
  'Fayette',
  'Lawrence',
  'Morgan',
  'Scott',
  'Hamilton',
  'Hancock',
  'Henry',
  'Logan',
  'Perry',
  'Pike',
  'Benton',
  'Brown',
  'Cass',
  'Clinton',
  'Knox',
  'Putnam',
  'Shelby',
  'Boone',
  'Butler',
  'Cherokee',
  'Columbia',
  'Cumberland',
  'Fulton',
  'Harrison',
  'Jasper',
  'Mercer',
  'Orange',
  'Randolph',
  'Webster',
  'Howard',
  'Lewis',
  'Pulaski',
  'Richland',
  'Taylor'
];

countyNames = _.shuffle(countyNames);

function County(name, population, converts, income, hostility, fervor) {
  this.name = name;
  this.population = population;
  this.converts = converts;
  this.minConverts = 0;//randRange(8, 16);
  this.hostility = hostility;
  this.hostilityRange = 1.5;
  this.hostilityDriftShock = 0;
  this.internalFervorShock = fervor;
  this.income = income;
  this.incomeStr = toMoneyFormat(income);
  this.tithe = 5;
  this.bishopPay = this.income;

  Object.defineProperty(this, 'hostilityDrift', {
    get: function() {
      return 0;
      //return 20 * (0.1 - this.converts / this.population) + this.hostilityDriftShock;
    }
  });

  Object.defineProperty(this, 'internalFervor', {
    get: function() {
      if(!this.church) {
        return 0;
      }

      if(this.bishop) {
        var bishopFervor = this.bishop.fervor;
      } else {
        var bishopFervor = 0;
      }

      var w = this.church.bishopFervorWeight();
      var bishopPart = 0.7;
      var result = 10 * Math.pow(bishopPart * bishopFervor + (1 - bishopPart) * 100 * this.converts/this.population, 1/w)
        + this.internalFervorShock;
      return clamp(result);
    }
  });

  Object.defineProperty(this, 'growth', {
    get: function() {
      var growth = 0;

      if(this.church && this.bishop) {
        growth += this.church.bishopCharismaRate() * this.bishop.charisma;
      }

      growth -= this.fervorTitheModifier() * this.tithe
      growth -= 0.05 * this.hostility;

      return growth;
    }
  });

  Object.defineProperty(this, 'growthEstimate', {
    get: function() {
      var g = this.growth;
      console.log('growth is ' + g);
      if(g > 0) {
        var s = '<span class="text-success">';
        var sym = '+';
      } else {
        var s = '<span class="text-danger">';
        var sym = '-';
      }

      g = Math.abs(Math.round(g / 0.04));

      if(g == 0) {
        return '<span class="text-warning">Stable</span>';
      }

      var t = '';
      for(var i = 0; i < Math.min(12, g); ++i) {
        t += sym;
      }

      return s + t + '</span>';
    }
  });

  Object.defineProperty(this, "fervor", {
    get: function() {
      var percentLocal = 0.7;
      var neighborFervor = _.reduce(_.pluck(this.neighbors, 'internalFervor'), function(memo, f, i, l) {
          return memo + f / l.length;
      }, 0);
      return percentLocal * this.internalFervor + (1 - percentLocal) * neighborFervor;
    }
  });

  Object.defineProperty(this, "populationStr", {
    get: function() {
      return toPopulationFormat(this.population);
    }
  });

  Object.defineProperty(this, "convertsStr", {
    get: function() {
      return toPopulationFormat(this.converts);
    }
  });

  Object.defineProperty(this, "hostilityStr", {
    get: function() {
      return toFuzzyFormat(this.hostility);
    }
  });

  Object.defineProperty(this, "fervorStr", {
    get: function() {
      return toFuzzyFormat(this.fervor.toPrecision(4));
    }
  });

  this.cells = [];
  this.neighbors = [];

  this.bishop = undefined;
  this.church = undefined;

  this.blurb = 'The citizens of ' + this.name + ' are enthused about Godtology. They wake up every morning with a spring in their step and fewer dollars in their pockets.';

  this.lucrativeness = function() {
    return this.population * this.income;
  }

  this.fervorTitheModifier = function() {
    return Math.pow(2, -this.fervor/10);
  }

  this.setHighlight = function(h) {
    for(var i = 0; i < this.cells.length; ++i) {
      this.cells[i].setHighlight(h);
    }
  }

  this.setNeighbors = function() {
    for(var i = 0; i < this.cells.length; ++i) {
      var neighbors = _.compact(_.pluck(this.cells[i].neighbors(), 'county'));
      this.neighbors = _.union(neighbors, this.neighbors);
    }
  }
}