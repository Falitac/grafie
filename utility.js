
/**
 * @description Converts x from range (a, b) to range (c, d)
 * @param {number} x Number to convert
 * @param {number} range1_start a
 * @param {number} range1_end b
 * @param {number} range2_start c
 * @param {number} range2_end d
**/
function interpolateNum(x, range1_start, range1_end, range2_start, range2_end) {
  return (x - range1_start) / (range1_end - range1_start) * (range2_end - range2_start) + range2_start;
}

/**
 * @description Returns length of vector v
 * @param {number} v Vector to calc
**/
function length(v) {
  return Math.pow(v[0] * v[0] + v[1] * v[1], 0.5)
}

/**
 * @description Returns normalized vector v
 * @param {number} v Vector to normalize
**/
function normalize(v) {
  let len = length(v);
  if(len == 0.0) {
    return [0, 0];
  }
  let result = [
    v[0] / length(v),
    v[1] / length(v)
  ];
  return result;
}