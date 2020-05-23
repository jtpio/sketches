const RADIUS = 300;
const ROTATION_SPEED = 0.0001;
const S = 0.5;
const N_ARCS = 30;
const N_LINES = 10;
const COLORS = ["#ffffff", "#494949", "#7c7a7a", "#ff5b5b"];
const SCALE = 16 / 9 / 1000;
const SQRT_2 = 2 ** 0.5;

let keys = [];
let transition = { value: 1 };
let lineAngle = { value: 0 };
let pool = [];
let lineDirection = 1;
let target = { value: 1 };
let flashEffect = { value: 1 };
let offset = 0;
let slowMotion = false;
let dot = true;
let currentEffect = 0;

let current, ratio, tween, effects;

function preload(){
  sound = loadSound("./loop.wav");
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  ellipseMode(CENTER);
  rectMode(CENTER);
  smooth();
  noFill();
  windowResized();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  amplitude.setInput(sound);
  peakDetect = new p5.PeakDetect();

  tween = new TWEEN.Tween(transition)
        .to(target, 100)
        .easing(TWEEN.Easing.Quadratic.Out);

  rot = new TWEEN.Tween(lineAngle)
        .to({ value: `+${HALF_PI}`}, 100)
        .easing(TWEEN.Easing.Quadratic.Out);

  flash = new TWEEN.Tween(flashEffect)
        .to({ value: 0 }, 250)
        .easing(TWEEN.Easing.Quadratic.In);

  randomSeed(0);
  for (let i = 0; i < N_LINES; i++) {
    pool.push({ value: 0 });
    new TWEEN.Tween(pool[i])
          .to({ value: 1 }, 250)
          .repeat(Infinity)
          .yoyo(true)
          .delay(random(1000))
          .easing(TWEEN.Easing.Quintic.In)
          .start();
  }

  sound.loop();
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function bg() {
  return 50 * flashEffect.value;
}


function halfSquare(r) {
  const weight = 4;
  strokeWeight(weight);

  push();
  fill(255, 0, 0);
  triangle(r, 0, 0, r, -r, 0);
  noFill();
  rotate(PI);
  translate(0, weight * 2);
  triangle(r, 0, 0, r, -r, 0);
  pop();
}

function squares() {
  const radius = RADIUS / 4;
  const r = radius * pool[0].value;
  if (r < 5) {
    // bail early to avoid artefacts
    return;
  }
  const halfDiag = r * SQRT_2;

  // red color for the fill and stoke
  fill(255, 0, 0);
  stroke(255, 0, 0);
  strokeCap(ROUND);

  // 1st square in the middle
  push();
  rotate(QUARTER_PI);
  rotate(pool[1].value * QUARTER_PI)
  rect(0, 0, r, r);
  pop();

  // 2nd square to the left
  push();
  translate(-radius * 2.5, 0);
  rotate(pool[2].value * QUARTER_PI)
  halfSquare(halfDiag);
  pop();

  // 3rd square to the right
  push();
  translate(radius * 2.5, 0);
  rotate(pool[3].value * QUARTER_PI)
  rotate(PI);
  halfSquare(halfDiag);
  pop();

}

function redCross(r) {
  beginShape();
  vertex(-1.5*r, -0.5*r);
  vertex(-0.5*r, -0.5*r);
  vertex(-0.5*r, -1.5*r);
  vertex(0.5*r, -1.5*r);
  vertex(0.5*r, -0.5*r);
  vertex(1.5*r, -0.5*r);
  vertex(1.5*r, 0.5*r);
  vertex(0.5*r, 0.5*r);
  vertex(0.5*r, 1.5*r);
  vertex(-0.5*r, 1.5*r);
  vertex(-0.5*r, 0.5*r);
  vertex(-1.5*r, 0.5*r);
  endShape(CLOSE);
}

function crosses() {
  const a = pool[4].value;
  const b = pool[5].value;
  const r = RADIUS * 0.5 * b + RADIUS * 0.1;
  if (r < 10) {
    return;
  }

  const angle = a * QUARTER_PI;
  randomSeed();

  // big cross
  push();
  noFill();
  stroke(255, 0, 0);
  strokeWeight(4);
  rotate(random([-1, 1]) * angle);
  redCross(r);
  pop();

  const sr = RADIUS * 0.25 * b;
  if (sr < 10) {
    return;
  }
  // small cross
  push();
  noStroke();
  fill(255, 0, 0);
  rotate(random([-1, -1]) * angle);
  redCross(sr);
  pop();
}

function lines() {
  const c = color(255, 55 + flashEffect.value * 150);
  const c2 = 255;
  const height = RADIUS;
  const jitter = amplitude.getLevel() * 2;
  const radius = (flashEffect.value + 1) * 5;
  const space = 2 * height / N_LINES;

  push();
  rotate(lineAngle.value * lineDirection);
  translate(-height, 0);
  strokeWeight(2 + jitter);

  for (let i = 1; i < N_LINES; i++) {
    // const factor = pool[i].value;
    const factor = sin(current * 0.002 + random(N_LINES));
    const x1 = i * space;
    const y1 = - height * factor;
    const x2 = x1;
    const y2 = -y1;
    stroke(c);
    line(x1, y1, x2, y2);

    if (dot) {
      noStroke();
      fill(c2);
      ellipse(x1, y1, radius);
      ellipse(x2, y2, radius);
    } else {
      fill(bg());
      stroke(c2);
      rect(x1, y1, radius * 2);
      rect(x2, y2, radius * 2);
    }
  }
  pop();
}

function arcs() {
  const theta = current * ROTATION_SPEED + offset;
  const jitter = amplitude.getLevel();
  const baseLevel = transition.value * 0.1;
  const level = baseLevel + 1;
  const baseRadius = RADIUS * level;

  push();
  fill(bg());
  noStroke();
  circle(0, 0, baseRadius);
  noFill()
  rotate(theta);


  for (let i = 0; i < N_ARCS; i++) {
    const offset = theta;
    const angle = random([-2, 1]) * offset * random() * i + (i * N_ARCS) / 2;
    const radius = baseRadius * i / N_ARCS + jitter * 20;
    const weight = (0.05 * RADIUS * S * i) / N_ARCS + level ** 2;
    const color = COLORS[i % COLORS.length];
    const len = random() + 0.5;

    push();
    rotate(angle);
    stroke(color);
    strokeCap(SQUARE);
    strokeWeight(weight);
    arc(0, 0, radius, radius, 0, len);
    pop();
  }
  pop();
}

function draw() {
  const slow = slowMotion ? 0.1 : 1
  // update globals
  TWEEN.update();
  current = millis() * slow;
  offset += slowMotion ? 0 : flashEffect.value / 200;
  fft.analyze();
  peakDetect.update(fft);
  if (peakDetect.isDetected) {
    flashEffect.value = 1;
    flash.stop().start();
  }

  // prepare the scene
  background(bg());
  translate(innerWidth / 2, innerHeight / 2);
  scale(ratio);
  randomSeed(0);

  effects = [crosses, lines, squares, arcs];
  effects[currentEffect % effects.length]();
  // noLoop();
}

function switchEffect(dir=1) {
  currentEffect = (currentEffect + effects.length + dir) % effects.length;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    switchEffect(-1);
    return true;
  }
  if (keyCode === RIGHT_ARROW) {
    switchEffect(1);
    return true;
  }
  if (keyCode === 32) {
    slowMotion = !slowMotion;
    return false;
  }
  if (key === 's') {
    dot = !dot;
    return false;
  }
  if (key === 'e' && !rot.isPlaying()) {
    lineDirection = -1;
    rot.start();
    return false;
  }
  if (key === 'r' && !rot.isPlaying()) {
    lineDirection = 1;
    rot.start();
    return false;
  }
  const k = parseInt(key, 10);
  if (!k) {
    return true;
  }
  tween.stop();
  keys.push(k);
  target.value = k;
  tween.start();
  return false;
}

function keyReleased() {
  const k = parseInt(key, 10);
  if (keys.indexOf(k) === -1) {
    return true;
  }
  keys = keys.filter(v => v !== k);
  tween.stop();
  const lastKey = keys[keys.length - 1] || 1;
  target.value = lastKey;
  tween.start();
  return false;
}
