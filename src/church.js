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
}