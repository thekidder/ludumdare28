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
    this.amt = Math.min(county.converts, randRange(50, 100));
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
    return 'Our Great Leader published a new book. It ain\'t exactly a New York Times bestseller, but folk in ' + county.name + ' seem to like it well enough.<p>Fervor increases!</p>';
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
    return game.name + ' ranked 8th on the list of "Coolest Religions" in Seventeen Magazine. As a comparison, Mormonism ranked 4th. Our youth group is devastated.<p>Fervor decreases.</p>';
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
    return game.name + ' ' + this.school + ' School of ' + county.name + ' won the province-wide ' + this.sport + ' championship. What better way to convince the congregation that God is on our side?<p>Fervor increases!</p>';
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
    return 'We\'re at war with ' + this.country + '! Quick, tell everyone how much you love God!<p>Fervor increases in ' + county.name + '.</p>';
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
    return 'Our Great Leader gaffed on national TV. Residents of ' + county.name + ' shake their heads in disbelief.<p>Fervor decreases.</p>';
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
    return 'The citizens of ' + county.name + ' are happy that they get the day off from work on Great Leader’s Day.<br/>Hostility decreases!';
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
    return 'The Church of '+ county.name + ' bake sale was a hit! People loved the ' + this.dessert + ', but they didn’t care for the kool-aid.<br/>Hostility decreases!';
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
    return 'No one likes knock-knock missionaries. Citizens in ' + county.name + ' are annoyed.<br/>Hostility increases.';
  },

  effects: function(county) {
    county.hostility *= 1.2;
  }
});

specialEvents.push({
  setup: function(county) {
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'TV Snafu in ' + county.name;
  },

  text: function(county) {
    return 'Damn it. In an interview with a major news outlet, Our Great Leader sort of...kind of...called us a cult. Should we pay $15,000.00 to cover it up or hope people don’t notice?';
  },

  affirmButton: function(county) {
    return 'Pay';
  },

  denyButton: function(county) {
    return 'Nobody will notice';
  },

  affirm: function(county) {
    game.money -= 15000;
    if(Math.random() < 0.05) {
      county.hostility *= 1.3;

      openDialog('info', {title: 'Oh Well', text: 'Looks like people noticed anyway. Hostility in ' + county.name + ' increased.'});
    }
  },

  deny: function(county) {
    county.hostility *= randRangeFloat(1.1, 1.25);
    county.converts = Math.min(county.converts, randRange(50, 100));
  }
});

specialEvents.push({
  setup: function(county) {
    this.saint = ['Kidder', 'Pedawi', 'Ossian', 'Goeringer', 'Shemary'][randRange(0, 5)];
  },

  conditions: function(county) {
    return county.bishop && county.church && Math.random() < baseChance;
  },

  title: function(county) {
    return 'Saint\'s Day ';
  },

  text: function(county) {
    return 'Saint ' + this.saint + '\'s Day is coming up and the Church of ' + county.name + ' is planning a celebratory event. Should the event be restricted to only church members or the entire community?';
  },

  affirmButton: function(county) {
    return 'Only church members';
  },

  denyButton: function(county) {
    return 'The entire community';
  },

  affirm: function(county) {
    county.internalFervorShock *= randRangeFloat(1.15, 1.25);
    county.hostility *= randRangeFloat(1.15, 1.25);

    openDialog('info', {title: 'Mixed Blessings', text: 'Fervor is up! But hostility rose too.'});
  },

  deny: function(county) {
    county.converts += randRange(75, 100);
    county.hostility *= randRangeFloat(0.75, 0.85);
    openDialog('info', {title: 'Mixed Blessings', text: 'Hostility is down and followers are up!'});
  }
});

var baseChance = 0.3 / specialEvents.length;