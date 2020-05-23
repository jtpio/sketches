const RADIUS = 300;
const ROTATION_SPEED = 0.0001;
const S = 0.5;
const N = 30;
const COLORS = ["#ffffff", "#494949", "#7c7a7a", "#ff5b5b"];
const SCALE = 16 / 9 / 1000;

let keys = [];
let transition = { value: 1 };
let lineAngle = { value: 0 };
let lineDirection = 1;
let target = { value: 1 };
let flashEffect = { value: 1 };
let offset = 0;
let slowMotion = false;

let current, ratio, tween;

function preload(){
  sound = loadSound("./loop.wav");
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  strokeCap(SQUARE);
  ellipseMode(CENTER);
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

  sound.loop();
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function bg() {
  return 100 * flashEffect.value;
}

function lines() {
  const n = 10;
  const c = color(255, 55 + flashEffect.value * 100);
  const c2 = 255;
  const height = RADIUS;
  const jitter = amplitude.getLevel() * 2;
  const radius = (flashEffect.value + 1) * 5;
  const space = 2 * height / n;

  push();
  rotate(lineAngle.value * lineDirection);
  translate(-height, 0);
  strokeWeight(2 + jitter);
  fill(c2);

  for (let i = 1; i < n; i++) {
    const phase = random(10);
    const x1 = i * space;
    const y1 = - height * sin(current * 0.002 + phase);
    const x2 = x1;
    const y2 = -y1;
    stroke(c);
    line(x1, y1, x2, y2);
    noStroke();
    ellipse(x1, y1, radius);
    ellipse(x2, y2, radius);
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


  for (let i = 0; i < N; i++) {
    const offset = theta;
    const angle = random([-2, 1]) * offset * random() * i + (i * N) / 2;
    const radius = baseRadius * i / N + jitter * 20;
    const weight = (0.05 * RADIUS * S * i) / N + level ** 2;
    const color = COLORS[i % COLORS.length];
    const len = random() + 0.5;

    push();
    rotate(angle);
    stroke(color);
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
  offset += flashEffect.value / 200;
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

  lines();
  arcs();
  // noLoop();
}

function keyPressed() {
  if (keyCode === 32) {
    slowMotion = !slowMotion;
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
