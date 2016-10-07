'use strict';

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

const renderer = PIXI.autoDetectRenderer(screenWidth, screenHeight, {antialias:true});
const stage = new PIXI.Container();
const graphics = new PIXI.Graphics();
const nodes = [];
const connectors = [];
const NUM_NODES = 160;
const MAX_DIST = 200;
const FG_COLOR = 0xAAAAAA;
const BG_COLOR = 0x454545;

renderer.backgroundColor = BG_COLOR;
renderer.autoResize = true;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

document.body.appendChild(renderer.view);
window.onresize = resizeHandler;

stage.addChild(graphics);
Array(NUM_NODES).fill(1).forEach(createNode);
update();
animate();

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
    graphics.lineStyle(5 * set[2], FG_COLOR, set[2]);
    graphics.moveTo(set[0].x, set[0].y);
    graphics.lineTo(set[1].x, set[1].y);
  });
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

  nodes.forEach((n, i) => {
    n.x += n.vx; 
    n.y += n.vy
    if (n.x < 0 || n.x > screenWidth) n.vx *= -1;
    if (n.y < 0 || n.y > screenHeight) n.vy *= -1; 

    let j = i + 1;
    let n2;
    let d;
    while(j < nn) {
      n2 = nodes[j];
      d = getDistance(n.x, n.y, n2.x, n2.y);
      if (d <= MAX_DIST) connectors.push([n, n2, 1 - (d / MAX_DIST)]);
      j++;
    }
  });
}
