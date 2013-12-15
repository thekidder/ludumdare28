function Map(width, height) {
  this.width = width;
  this.height = height;
  this.data = new Array(width * height);

  for(var i = 0; i < this.data.length; ++i) {
    this.data[i] = {};
  }

  this.cell = function() {
    var args = this._args(arguments);

    if(args.x >= this.width || args.x < 0 || args.y >= this.height || args.y < 0) {
      return undefined;
    }

    return this.data[args.x + this.width * args.y];
  };

  this._args = function(args) {
    if(args.length == 2) {
      var x = args[0];
      var y = args[1];

    } else if(args.length > 2 || args.length < 1) {
      return undefined;
    } else {
      var index = args[0];
      var x = index % this.width;
      var y = Math.floor(index / this.width);
    }

    return {x: x, y: y};
  }

  this.neighbors = function() {
    var args = this._args(arguments);

    if(args === undefined) { return undefined; }

    results = new Array();

    var top = this.northNeighbor(args.x, args.y);
    var left = this.eastNeighbor(args.x, args.y);
    var bottom = this.southNeighbor(args.x, args.y);
    var right = this.westNeighbor(args.x, args.y);

    if(left) results.push(left);
    if(top) results.push(top);
    if(right) results.push(right);
    if(bottom) results.push(bottom);

    return results;
  };

  this.northNeighbor = function() {
    var args = this._args(arguments);
    if(args === undefined) { return undefined; }

    if(args.y % 2 == 0) {
      return this.cell(args.x, args.y - 1);
    } else {
      return this.cell(args.x + 1, args.y - 1);
    }
  };

  this.eastNeighbor = function() {
    var args = this._args(arguments);
    if(args === undefined) { return undefined; }

    if(args.y % 2 == 0) {
      return this.cell(args.x, args.y + 1);
    } else {
      return this.cell(args.x + 1, args.y + 1);
    }
  };

  this.southNeighbor = function() {
    var args = this._args(arguments);
    if(args === undefined) { return undefined; }

    if(args.y % 2 == 1) {
      return this.cell(args.x, args.y + 1);
    } else {
      return this.cell(args.x - 1, args.y + 1);
    }
  };

  this.westNeighbor = function() {
    var args = this._args(arguments);
    if(args === undefined) { return undefined; }

    if(args.y % 2 == 1) {
      return this.cell(args.x, args.y - 1);
    } else {
      return this.cell(args.x - 1, args.y - 1);
    }
  };
}