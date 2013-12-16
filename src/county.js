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

function County(name, population, converts, skepticism, income) {
  this.name = name;
  this.population = population;
  this.converts = converts;
  this.skepticism = skepticism;
  this.income = income;
  this.incomeStr = toMoneyFormat(income);

  this.cells = [];

  this.bishop = undefined;
  this.church = undefined;

  this.blurb = 'The citizens of ' + this.name + ' are enthused about Godtology. They wake up every morning with a spring in their step and fewer dollars in their pockets.';

  this.setHighlight = function(h) {
    for(var i = 0; i < this.cells.length; ++i) {
      this.cells[i].setHighlight(h);
    }
  }
}