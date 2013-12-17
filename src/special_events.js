var specialEvents = []

var baseChance = 1;

specialEvents.push({
  setup: function(county) {
    this.amt = randRange(50, 150);
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'The world is a cruel, scary place&hellip;';
  },

  text: function(county) {
    return '&hellip;At least that\'s what the evening news says. The church of ' + county.name + ' has gained ' + this.amt + ' new followers.';
  },

  effects: function(county) {
    county.converts += this.amt;
  }
});

specialEvents.push({
  setup: function(county) {
    this.amt = randRange(50, 100);
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'War for Minds';
  },

  text: function(county) {
    return 'Oh no! ' + this.amt + ' members have turned to Scientology instead. Better go fire a bishop.';
  },

  effects: function(county) {
    county.converts -= this.amt;
  }
});

specialEvents.push({
  setup: function(county) {
    this.amt = Math.min(county.converts, randRange(25, 50));
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Accident!';
  },

  text: function(county) {
    return 'A bus transporting ' + game.name + ' youth members was derailed, resulting in ' + this.amt + ' deaths. It\'s a dangerous world, and our lives hang in the balance. So give us your money and get a ticket to heaven.';
  },

  effects: function(county) {
    county.converts -= this.amt;
  }
});

specialEvents.push({
  setup: function(county) {
    this.amt = randRange(25, 30);
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Well, That\'s Weird.';
  },

  text: function(county) {
    return 'Some members of the congregation decided to get freaky at a church retreat. We\'ve gained ' + this.amt + ' new bundles of joy. It\'s a miracle!';
  },

  effects: function(county) {
    county.converts += this.amt;
  }
});

specialEvents.push({
  setup: function(county) {
    this.languages = ['Spanish', 'Portuguese', 'Pig Latin', 'French', 'German'];
    this.remarks = ['¡Bienvenidos!', 'Bem-vindo!', 'Elcomeway!', 'Bienvenue!', 'Willkommen!'];
    this.i = randRange(0, 5);
    this.amt = randRange(100, 200);
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'So Multicultural!';
  },

  text: function(county) {
    return 'Our Great Leader\'s books have been published in ' + this.languages[this.i] + '. We\'ve gained ' + this.amt + ' new converts. ' + this.remarks[this.i];
  },

  effects: function(county) {
    county.converts += this.amt;
  }
});
/*
specialEvents.push({
  conditions: function(county) {
    return county.bishop && county.fervor < 50 && Math.random() < 0;
  },

  title: function(county) {
    return county.bishop.name + ' Commits Suicide!';
  },

  text: function(county) {
    return 'Give him a proper burial?';
  },

  affirmButton: function(county) {
    return 'Yes';
  },

  denyButton: function(county) {
    return 'No';
  },

  affirm: function(county) {
    game.money -= 50;
  },

  deny: function(county) {
    county.converts = Math.max(0, county.converts - 50);
    county.bishop = undefined;
  }
});*/