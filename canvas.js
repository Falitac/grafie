let canvas = document.querySelector('#chart');
let ctx = canvas.getContext('2d');

let WIDTH = canvas.innerWidth;
let HEIGHT = canvas.innerHeight;
let lastFrameTime = 0;

if(ctx === undefined) {
  console.log('Error: could not get canvas context');
} else {
  init();
  loop();
}

function Boundaries(xmin = -1.0, xmax = 1.0, ymin = -1.0, ymax = 1.0) {
  this.xmin = xmin;
  this.xmax = xmax;
  this.ymin = ymin;
  this.ymax = ymax;
}

function init() {
  updateCanvasSize();
  window.onresize = updateCanvasSize;
}

function updateCanvasSize() {
  WIDTH = canvas.width = window.innerWidth;
  HEIGHT = canvas.height = window.innerHeight;
}

function loop(time = 1) {
  let dt = time - lastFrameTime;
  lastFrameTime = time;

  update();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  draw(time);
  requestAnimationFrame(loop);
}

function update() {

}

function draw(time) {
  drawAxis();

  let foo = x => {
    return x*x;
  }

  let inv = x => {
    return 1 / x;
  }

  let f = x => {
    return (x-5)*(x-20);
  }

  let w = x => {
    let result = (x-18);
    for(let i = -17; i <= 19; i++) {
      result *= x + i;
    }
    return result;
  }

  let F = (x, y) => {
    return [0, x*y * y];
  }



  let boundaries = drawScale();
  drawFunction(Math.sin, boundaries);
  drawFunction(Math.cos, boundaries, 'blue', 2.5);
  drawFunction(Math.exp, boundaries, 'white', 1);
  drawFunction(foo, boundaries, 'cyan');
  drawFunction(inv, boundaries, 'magenta');
  drawFunction(f, boundaries, 'magenta');
  drawVectorField(F, boundaries, 40, 1);
  drawScale();
  //drawFunction(w, boundaries, 'white', 1);
}

function drawAxis(thickness = 0.6) {
  ctx.fillStyle = 'lime';
  ctx.fillRect(0, HEIGHT / 2, WIDTH, thickness);
  ctx.fillRect(WIDTH / 2, 0, thickness, HEIGHT);
}

// TODO make less boilerplate, repair bad aligning and few bugs
function drawScale(thickness = 0.6, scaleSize = 40, width = 10) {
  let resultBoundaries = new Boundaries();

  ctx.fillStyle = 'lime';
  ctx.font = '0.8em Consolas';
  // x axis
  let divisions = Math.floor(WIDTH / scaleSize);
  if(divisions % 2 === 1) {
    divisions--;
  }
  let offset = (WIDTH - scaleSize * divisions ) / 2;
  if(offset < 0) {
    offset += scaleSize;
  }
  let miniOffset = offset / divisions;
  resultBoundaries.xmin = interpolateNum(0, 0, WIDTH, -divisions / 2, divisions / 2) - miniOffset;
  resultBoundaries.xmax = interpolateNum(WIDTH, 0, WIDTH, -divisions / 2, divisions / 2) + miniOffset;

  for(let i = 0; i <= divisions; i++) {
    if(Math.floor(divisions / 2) === i) {
      continue;
    }
    let x = i * scaleSize + offset;
    let y = (HEIGHT - width) / 2;
    ctx.fillRect(x, y, thickness, width);
    ctx.fillStyle = 'white';
    let value = interpolateNum(i, 0, divisions, -divisions / 2, divisions / 2);
    value = value.toFixed(2);
    let textWidth = ctx.measureText(value).width;
    ctx.fillText(`${value}`, x - textWidth / 2, y - width);
  }

  // y axis
  divisions = Math.floor(HEIGHT / scaleSize);
  if(divisions % 2 === 1) {
    divisions--;
  }
  offset = (HEIGHT - scaleSize * divisions ) / 2;
  if(offset < 0) {
    offset += scaleSize;
  }
  miniOffset = offset / divisions;
  resultBoundaries.ymin = interpolateNum(0, 0, divisions, -divisions / 2, divisions / 2) - miniOffset;
  resultBoundaries.ymax = interpolateNum(divisions, 0, divisions, -divisions / 2, divisions / 2) + miniOffset;

  for(let i = 0; i <= divisions; i++) {
    if(Math.floor(divisions / 2) === i) {
      continue;
    }
    let x = (WIDTH - width) / 2;
    let y = i * scaleSize + offset;
    ctx.fillStyle = 'lime';
    ctx.fillRect(x, y, width, thickness);
    ctx.fillStyle = 'white';
    let value = interpolateNum(-i, -divisions, 0, -divisions / 2, divisions / 2);
    value = value.toFixed(2);
    let textWidth = ctx.measureText(value).width;
    ctx.fillText(`${value}`, x - width - textWidth, y + 2);
  }
  return resultBoundaries;
}

function drawFunction(fun, boundaries, color = 'red', thickness = 0.8) {
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.beginPath();

  let j = 0;
  for(let i = 0; i < WIDTH; i++) {
    let x = interpolateNum(i, 0, WIDTH, boundaries.xmin, boundaries.xmax);
    let y = fun(x);
    if(y < 2*boundaries.ymin || y > 2*boundaries.ymax) {
      j = i;
    }
    if(i > j) {
      ctx.lineTo(i, interpolateNum(y, boundaries.ymin, boundaries.ymax, HEIGHT, 0));
    } else {
      ctx.moveTo(i, interpolateNum(y, boundaries.ymin, boundaries.ymax, HEIGHT, 0));
    }
  }

  ctx.stroke();
}

function drawVectorField(fun, boundaries, scaleSize = 40, thickness = 1) {
  ctx.fillStyle = 'lime';

  let xDivisions = Math.floor(WIDTH / scaleSize);
  if(xDivisions % 2 === 1) {
    xDivisions--;
  }
  let xOffset = (WIDTH - scaleSize * xDivisions ) / 2;
  if(xOffset < 0) {
    xOffset += scaleSize;
  }

  let yDivisions = Math.floor(HEIGHT / scaleSize);
  if(yDivisions % 2 === 1) {
    yDivisions--;
  }
  let yOffset = (HEIGHT - scaleSize * yDivisions ) / 2;
  if(yOffset < 0) {
    yOffset += scaleSize;
  }

  for(let i = 0; i <= yDivisions; i++) {
    for(let j = 0; j <= xDivisions; j++) {
      let x = interpolateNum(j, 0, xDivisions, boundaries.xmin, boundaries.ymin);
      let y = interpolateNum(i, 0, yDivisions, boundaries.ymin, boundaries.ymax);

      let vx, vy;
      [vx, vy] = fun(x, y);

      vx = interpolateNum(vx, boundaries.xmin, boundaries.xmax, 0, WIDTH);
      vy = interpolateNum(vy, boundaries.ymin, boundaries.ymax, 0, HEIGHT);
      let len = length([vx, vy]);
      [vx, vy] = normalize([vx, vy]);

      let angle = Math.atan2(vy, vx);

      let scalar = 20;
      vx *= scalar;
      vy *= scalar;
      let normalizedLen = length([vx, vy]);

      let winx = scaleSize * j + xOffset;
      let winy = scaleSize * i + yOffset;

      let hue = len;
      ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
      drawArrow(winx, winy, 20, angle);
    }
  }
}

function drawArrow(x, y, len, angle, angleDiff = .34, arrowFraction = 0.2) {
  let xEnd = x + len * Math.cos(angle);
  let yEnd = y + len * Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(xEnd, yEnd);
  angle -= angleDiff;
  ctx.lineTo(
    xEnd - Math.cos(angle) * len * arrowFraction,
    yEnd - Math.sin(angle) * len * arrowFraction
  );
  ctx.moveTo(xEnd, yEnd);
  angle += 2 * angleDiff;
  ctx.lineTo(
    xEnd - Math.cos(angle) * len * arrowFraction,
    yEnd - Math.sin(angle) * len * arrowFraction
  );
  ctx.stroke();
}

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

function length(v) {
  return Math.pow(v[0] * v[0] + v[1] * v[1], 0.5)
}

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