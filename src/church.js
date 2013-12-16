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
      return 5000;
    } else if(this.level == 2) {
      return 15000;
    } else {
      return 30000;
    }
  }

  this.upgradeCost = function() {
    if(this.level == 1) {
      return 100000;
    } else {
      return 200000;
    }
  }

  Object.defineProperty(this, 'upgradeCostStr', {
    get: function() {
      return toMoneyFormat(this.upgradeCost());
    }
  });

  this.maxConverts = function() {
    if(this.level == 1) {
      return 1000;
    } else if(this.level == 2) {
      return 10000;
    } else {
      return 250000;
    }
  }

  this.followersGainedOnExpand = function() {
    if(this.level == 1) {
      return 500;
    } else {
      return 1500;
    }
  }
}