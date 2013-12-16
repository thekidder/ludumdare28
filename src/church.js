function Church() {
  this.entity = undefined;
  this.level = 1;

  this.bishopFervorWeight = function() {
    if(this.level == 1) {
      return 3;
    } else if(this.level == 2) {
      return 2.5;
    } else {
      return 2;
    }
  }

  this.bishopCharismaRate = function() {
    if(this.level == 1) {
      return 1/40;
    } else if(this.level == 2) {
      return 1/20;
    } else {
      return 1/10;
    }
  }

  this.upkeep = function() {
    if(this.level == 1) {
      return 10000;
    } else if(this.level == 2) {
      return 30000;
    } else {
      return 50000;
    }
  }

  this.upgradeCost = function() {
    if(this.level == 1) {
      return 100000;
    } else {
      return 200000;
    }
  }

  this.maxConverts = function() {
    if(this.level == 1) {
      return 1000;
    } else if(this.level == 2) {
      return 10000;
    } else {
      return 250000;
    }
  }
}