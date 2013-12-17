var specialEvents = []

/* congregation */

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
    return 'Oh no! ' + this.amt + ' members from ' + county.name + ' have turned to Scientology instead. Better go fire a bishop.';
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
    return 'A bus transporting ' + game.name + ' youth members was derailed, resulting in ' + this.amt + ' deaths in ' + county.name + '. It\'s a dangerous world, and our lives hang in the balance. So give us your money and get a ticket to heaven.';
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
    return 'Some members of the congregation decided to get freaky at a church retreat. ' + county.name +' has gained ' + this.amt + ' new bundles of joy. It\'s a miracle!';
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
    return 'Our Great Leader\'s books have been published in ' + this.languages[this.i] + '. ' + county.name +' has gained ' + this.amt + ' new converts. ' + this.remarks[this.i];
  },

  effects: function(county) {
    county.converts += this.amt;
  }
});

/* fervor */

specialEvents.push({
  setup: function(county) {
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Literary Genius';
  },

  text: function(county) {
    return 'Our Great Leader published a new book. It ain\'t exactly a New York Times bestseller, but folk in ' + county.name + ' seem to like it well enough. ';
  },

  effects: function(county) {
    county.internalFervorShock *= 1.25;
  }
});

specialEvents.push({
  setup: function(county) {
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Shootout in ' + county.name;
  },

  text: function(county) {
    return game.name + ' ranked 8th on the list of "Coolest Religions" in Seventeen Magazine. As a comparison, Mormonism ranked 4th. Our youth group is devastated.';
  },

  effects: function(county) {
    county.internalFervorShock *= 0.90;
  }
});

specialEvents.push({
  setup: function(county) {
    this.school = ['Elementary', 'Middle', 'High'][randRange(0, 3)];
    this.sport = ['football', 'basketball', 'soccer', 'tetherball', 'thumb wrestling', 'rock-paper-scissors'][randRange(0, 6)];
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Great Aptitude';
  },

  text: function(county) {
    return game.name + ' ' + this.school + ' School of ' + county.name + ' won the province-wide ' + this.sport + ' championship. What better way to convince the congregation that God is on our side?';
  },

  effects: function(county) {
    county.internalFervorShock *= 1.15;
  }
});

specialEvents.push({
  setup: function(county) {
    this.country = ['Japan', 'Iran', 'Iraq', 'Mexico', 'Luxemburg'][randRange(0, 5)];
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'War!';
  },

  text: function(county) {
    return 'We’re at war with ' + this.country + '! Quick, tell everyone how much you love God!';
  },

  effects: function(county) {
    county.internalFervorShock *= 1.1;
  }
});

specialEvents.push({
  setup: function(county) {
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Whoomp whoomp.';
  },

  text: function(county) {
    return 'Our Great Leader gaffed on national TV. Residents of ' + county.name + ' shake their heads in disbelief.';
  },

  effects: function(county) {
    county.internalFervorShock *= 0.75;
  }
});

/* hostility */

specialEvents.push({
  setup: function(county) {
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Woohoo! Day Off!';
  },

  text: function(county) {
    return 'The citizens of ' + county.name + ' are happy that they get the day off from work on Great Leader’s Day.';
  },

  effects: function(county) {
    county.hostility *= 0.9;
  }
});

specialEvents.push({
  setup: function(county) {
    this.dessert = ['brownies', 'muffins', 'donuts', 'cupcakes'][randRange(0, 4)];
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Who Doesn\'t Like Kool-Aid?';
  },

  text: function(county) {
    return 'The Church of '+ county.name + ' bake sale was a hit! People loved the ' + this.dessert + ', but they didn’t care for the kool-aid.';
  },

  effects: function(county) {
    county.hostility *= 0.8;
  }
});

specialEvents.push({
  setup: function(county) {
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Say What?';
  },

  text: function(county) {
    return 'Citizens of ' + county.name + ' agree that our congregation is too preachy. Hostility is on the rise.';
  },

  effects: function(county) {
    county.hostility *= 1.1;
  }
});

specialEvents.push({
  setup: function(county) {
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'But Pamphlets Are So Effective!';
  },

  text: function(county) {
    return 'No one likes knock-knock missionaries. Citizens in ' + county.name + ' are annoyed.';
  },

  effects: function(county) {
    county.hostility *= 1.2;
  }
});

var baseChance = 0.3 / specialEvents.length;

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