function Map(width, height) {
  this.width = width;
  this.height = height;
  this.data = new Array(width * height);

  for(var i = 0; i < this.data.length; ++i) {
    this.data[i] = {};
  }

  this.cell = function() {
    if(arguments.length == 1) {
      var index = arguments[0];
      if(index >= this.width * this.height)
        return undefined;
      return this.data[index];
    } else if(arguments.length == 2) {
      var x = arguments[0];
      var y = arguments[1];

      if(x >= this.width || x < 0 || y >= this.height || y < 0) {
        return undefined;
      }

      return this.data[x + this.width * y];
    }
  };

  this.neighbors = function() {
    if(arguments.length == 2) {
      var x = arguments[0];
      var y = arguments[1];

      return this.neighbors(x + y * this.width);
    } else if(arguments.length > 2 || arguments.length < 1) {
      return undefined;
    }

    var index = arguments[0];
    var x = index % this.width;
    var y = Math.floor(index / this.width);

    results = new Array();

    var left = this.cell(x - 1, y);
    var top = this.cell(x, y - 1);
    var right = this.cell(x + 1, y);
    var bottom = this.cell(x, y + 1);

    if(left) results.push(left);
    if(top) results.push(top);
    if(right) results.push(right);
    if(bottom) results.push(bottom);

    return results;
  };
}