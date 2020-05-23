const RADIUS = 300;
const ROTATION_SPEED = 0.0001;
const S = 0.5;
const N = 30;
const COLORS = ["#ffffff", "#494949", "#7c7a7a", "#ff5b5b"];
const SCALE = 16 / 9 / 1000;

let keys = [];
let transition = { value: 1 };
let target = { value: 1 };
let flashEffect = { value: 1 };
let offset = 0;
let ratio, tween;


function preload(){
  sound = loadSound("./loop.wav");
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  strokeCap(SQUARE);
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

  flash = new TWEEN.Tween(flashEffect)
        .to({ value: 0 }, 250)
        .easing(TWEEN.Easing.Quadratic.In);

  sound.loop();
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function draw() {
  // update globals
  TWEEN.update();
  offset += flashEffect.value / 200;
  fft.analyze();
  peakDetect.update(fft);
  if (peakDetect.isDetected) {
    flashEffect.value = 1;
    flash.stop().start();
  }

  // time based animation
  const current = millis();
  const theta = current * ROTATION_SPEED + offset;
  const bg = 100 * flashEffect.value;

  // prepare the scene
  background(bg);
  translate(innerWidth / 2, innerHeight / 2);
  rotate(theta);
  scale(ratio);
  randomSeed(0);

  // draw arcs
  const jitter = amplitude.getLevel();
  const baseLevel = transition.value * 0.1;
  const level = baseLevel + 1;

  for (let i = 0; i < N; i++) {
    const offset = theta;
    const angle = random([-2, 1]) * offset * random() * i + (i * N) / 2;
    const radius = level * ((RADIUS / N) * i + jitter * 20);
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
}

function keyPressed() {
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
