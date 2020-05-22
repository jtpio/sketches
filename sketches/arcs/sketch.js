const RADIUS = 300;
const ROTATION_SPEED = 0.0001;
const S = 0.5;
const N = 30;
const COLORS = ["#ffffff", "#494949", "#7c7a7a", "#ff5b5b"];
const SCALE = 16 / 9 / 1000;

let keys = [];
let transition = { value: 0 };
let target = { value: 0 };
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
  sound.loop();

  tween = new TWEEN.Tween(transition)
        .to(target, 250)
        .easing(TWEEN.Easing.Quadratic.Out);
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function draw() {
  const current = millis();
  const theta = current * ROTATION_SPEED;

  background(0);
  randomSeed(0);
  TWEEN.update();

  const spectrum = fft.analyze();
  const energy = fft.getEnergy("bass", "highMid");
  // const level = amplitude.getLevel();

  // debug
  // noStroke();
  // fill(255, 0, 255);
  // for (let i = 0; i< spectrum.length; i++){
  //   let x = map(i, 0, spectrum.length, 0, innerWidth);
  //   let h = -innerHeight + map(spectrum[i], 0, 255, innerHeight, 0);
  //   rect(x, innerHeight, innerWidth / spectrum.length, h )
  // }
  // text(kick || 'null', 20, 20);
  // noFill();

  translate(innerWidth / 2, innerHeight / 2);
  rotate(theta);
  scale(ratio);

  const level = transition.value;

  for (let i = 0; i < N; i++) {
    const offset = theta;
    const angle = random([-2, 1]) * offset * random() * i + (i * N) / 2;
    const radius = (RADIUS / N) * i * 3 * S + level * 100;
    const len = random() + 0.5;
    const weight = (0.05 * RADIUS * S * i) / N;
    const color = COLORS[i % COLORS.length];

    push();
    rotate(angle);
    stroke(color);
    strokeWeight(weight);
    arc(0, 0, radius, radius, 0, len);
    pop();
  }
}


function getLastInputNumber() {
  return keys[keys.length - 1] || 1;
}

function keyPressed() {
  const k = parseInt(key, 10);
  if (k) {
    tween.stop();
    keys.push(k);
    target.value = k / 2;
    tween.start();
  }
  return false;
}

function keyReleased() {
  const k = parseInt(key, 10);
  if (keys.indexOf(k) > -1) {
    keys = keys.filter(v => v !== k);
    tween.stop();
    const lastKey = keys[keys.length - 1] || 1;
    target.value = lastKey / 2;
    tween.start();
  }
  return false;
}