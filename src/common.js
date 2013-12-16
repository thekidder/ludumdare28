function randRange(low, high) {
  return Math.floor(Math.random() * (high - low)) + low;
}

function randRangeFloat(low, high) {
  return Math.random() * (high - low) + low;
}

function sign(x) {
  return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function clamp(x, low, high) {
  if(arguments.length == 1) {
    var low = 0;
    var high = 100;
  }
  return Math.min(high, Math.max(x, low));
}
