function randRange(low, high) {
  return Math.floor(Math.random() * (high - low)) + low;
}

function sign(x) {
  return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function clamp(x) {
  return Math.min(100, Math.max(0, x));
}
