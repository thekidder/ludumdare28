var specialEvents = []

specialEvents.push({
  conditions: function(county) {
    return county.bishop && county.fervor < 50 && Math.random() < 0.05;
  },

  title: function(county) {
    return county.bishop.name + ' Commits Suicide!';
  },

  text: function(county) {
    return 'Sucks to be him';
  },

  effects: function(county) {
    county.converts = Math.max(0, county.converts - 50);
    county.bishop = undefined;
  }
});

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
});