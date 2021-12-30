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
  console.log(`${interpolateNum(2, -2, 6, 10, 100)}`);
  console.log(`${WIDTH}`);
}

function updateCanvasSize() {
  WIDTH = canvas.width = window.innerWidth;
  HEIGHT = canvas.height = window.innerHeight;
}

function loop(time = 1) {
  let dt = time - lastFrameTime;
  lastFrameTime = time;
  console.log(dt);

  update();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  draw();
  requestAnimationFrame(loop);
}

function update() {

}

function draw() {
  drawAxis();
  let boundaries = drawScale();

  let foo = x => {
    return x*x;
  }

  let inv = x => {
    return 1 / x;
  }

  let f = x => {
    return (x-5)*(x-20);
  }

  let g = x => {
    return 3*x;
  }

  drawFunction(Math.sin, boundaries);
  drawFunction(Math.cos, boundaries, 'blue', 2.5);
  drawFunction(Math.exp, boundaries, 'white', 1);
  drawFunction(foo, boundaries, 'cyan');
  drawFunction(inv, boundaries, 'magenta');
  drawFunction(f, boundaries, 'magenta');
  drawFunction(g, boundaries, 'black');
}

function drawAxis(thickness = 0.6) {
  ctx.fillStyle = 'lime';
  ctx.fillRect(0, HEIGHT / 2, WIDTH, thickness);
  ctx.fillRect(WIDTH / 2, 0, thickness, HEIGHT);
}

// TODO make less boilerplate
function drawScale(thickness = 0.6, scaleSize = 40, width = 10) {
  let resultBoundaries = new Boundaries();

  ctx.fillStyle = 'lime';
  // x axis
  let divisions = Math.floor(WIDTH / scaleSize);
  if(divisions % 2 === 1) {
    divisions--;
  }
  let offset = (WIDTH - scaleSize * divisions ) / 2;
  if(offset < 0) {
    offset += scaleSize;
  }
  resultBoundaries.xmin = interpolateNum(0, 0, divisions, -divisions / 2, divisions / 2);
  resultBoundaries.xmax = interpolateNum(divisions, 0, divisions, -divisions / 2, divisions / 2);

  for(let i = 0; i < divisions; i++) {
    if(Math.floor(divisions / 2) === i) {
      continue;
    }
    let x = i * scaleSize + offset;
    let y = (HEIGHT - width) / 2;
    ctx.fillRect(x, y, thickness, width);
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
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
  resultBoundaries.ymin = interpolateNum(0, 0, divisions, -divisions / 2, divisions / 2);
  resultBoundaries.ymax = interpolateNum(divisions, 0, divisions, -divisions / 2, divisions / 2);

  for(let i = 0; i < divisions; i++) {
    if(Math.floor(divisions / 2) === i) {
      continue;
    }
    let x = (WIDTH - width) / 2;
    let y = i * scaleSize + offset;
    ctx.fillStyle = 'lime';
    ctx.fillRect(x, y, width, thickness);
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    let value = interpolateNum(-i, -divisions, 0, -divisions / 2, divisions / 2);
    value = value.toFixed(2);
    ctx.fillText(`${value}`, x + width, y - width);
  }
  return resultBoundaries;
}

function drawFunction(fun, boundaries, color = 'red', thickness = 0.8) {
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.beginPath();

  for(let i = 0; i < WIDTH; i++) {
    let x = interpolateNum(i, 0, WIDTH, boundaries.xmin, boundaries.xmax);
    let y = fun(x);
    if(i > 0) {
      ctx.lineTo(i, interpolateNum(y, boundaries.ymin, boundaries.ymax, HEIGHT, 0));
    } else {
      ctx.moveTo(i, interpolateNum(y, boundaries.ymin, boundaries.ymax, HEIGHT, 0));
    }
  }

  ctx.stroke();
}

/**
 * @description Converts x from range (a, b) to range (c, d)
 * @param {number} x Number to convert
 * @param {number} range1_start a
 * @param {number} range1_end b
 * @param {number} range2_start c
 * @param {number} range2_end d
 */
function interpolateNum(x, range1_start, range1_end, range2_start, range2_end) {
  return (x - range1_start) / (range1_end - range1_start) * (range2_end - range2_start) + range2_start;
}