'use strict';

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

const renderer = PIXI.autoDetectRenderer(screenWidth, screenHeight, {antialias:true});
const stage = new PIXI.Container();
const graphics = new PIXI.Graphics();
const nodes = [];
const connectors = [];
const trackers = [];
const track = {x:0, y:0};
const NUM_NODES = 160;
const MAX_DIST = 200;
const FG_COLOR = 0xAAAAAA;
const BG_COLOR = 0x222222;

renderer.backgroundColor = BG_COLOR;
renderer.autoResize = true;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

document.body.appendChild(renderer.view);
window.onresize = resizeHandler;

stage.interactive = true;
stage.mousemove = updateTrackingPosition;
stage.addChild(graphics);
init();

function init() {
  let c = 0;
  while (c < NUM_NODES) {
    createNode();
    c++;
  }
  animate();
}

function resizeHandler () {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  renderer.resize(screenWidth, screenHeight);
}

function animate() {
  update();
  redraw();
  requestAnimationFrame(animate);
  renderer.render(stage);
}

function redraw() {
  graphics.clear();

  connectors.forEach(set => {
    graphics.lineStyle(3 * set[2], FG_COLOR, set[2]);
    graphics.moveTo(set[0].x, set[0].y);
    graphics.lineTo(set[1].x, set[1].y);
  });

  trackers.forEach(set => {
    graphics.lineStyle(3 * set[1], 0X191919, set[1]);
    graphics.moveTo(set[0].x, set[0].y);
    graphics.lineTo(track.x, track.y);
  });
}

/**********************
 * TRACKING
 *********************/
function updateTrackingPosition(data) {
  let pos = data.data.global;
  track.x = pos.x;
  track.y = pos.y;
}

/**********************
 * NODES
 *********************/
function randSpeed(a,b) {
  return parseFloat((((a - b) * Math.random()) + b).toFixed(1));
}

function getDistance(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function createNode() {
  nodes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: randSpeed(-2.5, 2.5),
    vy: randSpeed(-2.5, 2.5)
  });
}

function update() {
  const nn = nodes.length;
  connectors.length = 0;
  trackers.length = 0;

  nodes.forEach((n, i) => {
    n.x += n.vx; 
    n.y += n.vy;
    if (n.x < 0 || n.x > screenWidth) n.vx *= -1;
    if (n.y < 0 || n.y > screenHeight) n.vy *= -1; 

    let j = i + 1;
    let n2;
    let d;
    let dt;

    while(j < nn) {
      n2 = nodes[j];

      d = getDistance(n.x, n.y, n2.x, n2.y);
      if (d <= MAX_DIST) connectors.push([n, n2, 1 - (d / MAX_DIST)]);

      dt = getDistance(n.x, n.y, track.x, track.y);
      if (dt <= MAX_DIST) trackers.push([n, 1 - (dt / MAX_DIST)]);

      j++;
    }
  });
}
