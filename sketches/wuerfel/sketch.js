/// <reference path="../../lib/global.d.ts" />

const faces = [
  [0, -90, 0, '255, 0, 0'],
  [0, 0, 0, '0, 255, 0'],
  [0, 90, 0, '0, 0, 255'],
  [0, -180, 0, '255, 255, 255'],
  [-90, 0, 0, '255, 255, 255'],
  [90, 0, 0, '255, 255, 255'],
  ];
const edgeLength = 180;
const explodeFactor = 1.2;
const animationFrames = 300;
const transparency = 1;

const W = 32;
const H = 8;
const S = 300;
const RATIO = 0.5;
const CENTER_X = W * S * 0.5;
const CENTER_Y = H * S * 0.5;
const DURATION = 1000;

function easeInOutQuart(t) {
  return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}

function tween(offset = 0) {
  const current = millis();
  const t = ((current + offset) % DURATION) / DURATION;
  return easeInOutQuart(t);
}

function drawCube() {
  noStroke();
  rotateY(360 * tween(random(0, 500)));
  faces.forEach(face => {
	  fill(`rgba(${face[3]}, ${transparency})`);
    push();
    [rotateX, rotateY, rotateZ].forEach((fn, i) => fn(face[i]));
    translate(0, 0,90);
	  plane(edgeLength);
    pop();
  });
}

function drawCubes() {
  randomSeed(42);
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < H; j++) {
      push();
      translate(i * S, j * S);
      drawCube();
      pop();
    }
  }
}

function setup() {
  createCanvas(500, 500, WEBGL);
  angleMode(DEGREES);
  // noLoop();
}

function draw() {
  background('lightblue');
  scale(0.1);
  translate(-CENTER_X, -CENTER_Y);
  push();
  drawCubes();
  pop();
}
