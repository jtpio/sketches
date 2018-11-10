/// <reference path="../libraries/global.d.ts" />

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


function drawCube() {
  noStroke();
  rotateY(frameCount);
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
  scale(RATIO);
  translate(-CENTER_X, -CENTER_Y);
  push();
  drawCubes();
  pop();
}
