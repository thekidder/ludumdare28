var specialEvents = []

specialEvents.push({
  conditions: function(county) {
    return county.fervor < 50;
  },

  title: function(county) {
    return county.bishop.name + ' Commits Suicide!';
  },

  text: function(county) {
    return 'Sucks to be him';
  },

  effects: function(county) {
    county.converts = Math.max(0, county-converts - 50);
  }
});

specialEvents.push({
  conditions: function(county) {
    return county.fervor < 50;
  },

  title: function(county) {
    return county.bishop.name + ' Commits Suicide!';
  },

  text: function(county) {
    return 'Give him a proper burial?';
  },

  affirm: function(county) {
    game.money -= 50;
  },

  deny: function(county) {
    county.converts = Math.max(0, county-converts - 50);
  }
});