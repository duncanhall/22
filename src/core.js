'use strict';

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

const renderer = PIXI.autoDetectRenderer(screenWidth, screenHeight, {antialias:true});
const stage = new PIXI.Container();
const graphics = new PIXI.Graphics();
const nodes = [];
const randSpeed = (a,b) => parseFloat((((a - b) * Math.random()) + b).toFixed(1));

renderer.backgroundColor = 0x878787;
renderer.autoResize = true;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

document.body.appendChild(renderer.view);
window.onresize = resizeHandler;

stage.addChild(graphics);
createNode();
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

function createNode() {
  nodes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: randSpeed(-2.5, 2.5),
    vy: randSpeed(-2.5, 2.5)
  });
}

function update() {
  nodes.forEach(n => {
    n.x += n.vx; 
    n.y += n.vy
    if (n.x < 0 || n.x > screenWidth) n.vx *= -1;
    if (n.y < 0 || n.y > screenHeight) n.vy *= -1; 
  });
}

function redraw(c) {
  graphics.clear();
  nodes.forEach(n => {
    graphics.beginFill(0xFFFFFF, 1);
    graphics.drawCircle(n.x, n.y, 5);
    graphics.endFill();
  })
}
