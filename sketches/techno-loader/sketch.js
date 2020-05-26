const RADIUS = 350;
const S = 5;
const N_ARCS = 30;
const COLORS = ["#ffffff", "#494949", "#7c7a7a", "#ff5b5b"];
const SCALE = 16 / 9 / 1000;

let flashEffect = { value: 0 };
let offset = 0;
let current = 0;

let ratio, flash, fft, peakDetect, amplitude;

function preload(){
  sound = loadSound("./loop-2.wav");
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  noFill();
  windowResized();

  flash = gsap.fromTo(flashEffect, { value: 0 }, {
    duration: 0.25,
    paused: true,
    ease: "power3.inOut",
    // props
    value: 1,
  });

  peakDetect = new p5.PeakDetect();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  sound.setVolume(0);

  soundButton = createButton('Mute');
  soundButton.position(20, 20);
  soundButton.mousePressed(soundClicked);
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function soundClicked() {
  if (!sound.isPlaying()) {
    sound.loop();
  }
  sound.setVolume(1 - sound.getVolume());
}

function draw() {
  const slowMotion = sound.getVolume() === 0;
  const speed = slowMotion ? 0.1 : 1

  current += deltaTime * speed * 0.0001;
  offset += slowMotion ? 0 : (1  - flashEffect.value) / 100;

  let bg = 0;
  if (!slowMotion) {
    fft.analyze();
    peakDetect.update(fft);
    bg = 30 * (1 - flashEffect.value);
  }

  if (peakDetect.isDetected) {
    flash.restart();
  }

  const theta = current + offset;
  const jitter = amplitude.getLevel() * 20 + flashEffect.value * 5;

  background(bg);
  translate(innerWidth / 2, innerHeight / 2);
  scale(ratio);
  noFill();
  strokeCap(SQUARE);
  rotate(theta);
  randomSeed(0);

  for (let i = 0; i < N_ARCS; i++) {
    const offset = theta;
    const angle = random([-2, 1]) * offset * random() * i + (i * N_ARCS) / 2;
    const radius = RADIUS * i / N_ARCS + jitter + 2;
    const weight = S * i / N_ARCS + 2;
    const color = random(COLORS);
    const len = random() + 0.5;

    push();
    rotate(angle);
    stroke(color);
    strokeWeight(weight);
    arc(0, 0, radius, radius, 0, len);
    pop();
  }
}
