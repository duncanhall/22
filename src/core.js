'use strict';

const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias:true});
const stage = new PIXI.Container();
const graphics = new PIXI.Graphics();
const circles = [];

renderer.backgroundColor = 0x878787;
renderer.autoResize = true;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

document.body.appendChild(renderer.view);

stage.addChild(graphics);
createCircle();
animate();

function animate() {
  circles.forEach(drawCircle);
  requestAnimationFrame(animate);
  renderer.render(stage);
}

function createCircle() {
  circles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
  });
}

function drawCircle(c) {
  graphics.beginFill(0xFFFFFF, 1);
  graphics.drawCircle(c.x, c.y, 5);
  graphics.endFill();
}
