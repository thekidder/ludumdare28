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
  this.hostility = hostility;
  this.hostilityRange = 1.5;
  this.hostilityDriftShock = 0;
  this.internalFervorShock = fervor;
  this.income = income;
  this.incomeStr = toMoneyFormat(income);
  this.tithe = 0;
  this.bishopPay = 0;

  Object.defineProperty(this, 'hostilityDrift', {
    get: function() {
      return 20 * (0.1 - this.converts / this.population) + this.hostilityDriftShock;
    }
  });

  Object.defineProperty(this, 'internalFervor', {
    get: function() {
      if(!this.church) {
        return 0;
      }
      var w = this.church.bishopFervorWeight();
      var result = 10 * Math.pow(this.bishop.fervor, 1/w) + this.internalFervorShock;
      return clamp(result);
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