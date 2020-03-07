const R = 500;
const N = 100;
const MAX = 200;
const SCALE = 16 / 9 / 1000;

let a = MAX;
let x = 100;
let off = 0.5;

let ratio;

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function keyPressed() {
  a = MAX;
  x = int(random(1000));
  randomSeed();
  off = random(1);
}

function makeCircle(s) {
  strokeWeight(s);
  stroke(255);
  noFill();
  let r = R * (0.25 + off * 2);
  ellipse(0, 0, r, r);
}

function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}

function draw() {
  a *= 0.95;
  const b = easeInOutCubic(a / MAX) * MAX;
  const c = color(b, b, b, 50);
  background(c);

  translate(innerWidth / 2, innerHeight / 2);
  scale(ratio * 0.5);
  randomSeed(42);

  const tick = frameCount * off;
  for (let i = 0; i < N; i++) {
    push();
    const dir = i % 2 === 0 ? -1 : 1;
    rotate(dir * random(N / 4) * tick * 0.004);

    const amp = sin(tick * 0.001 * random(10)) * 6;
    const x = random(-100, 100) + random(N / 40) * exp(amp);
    const y = random(-100, 100);
    translate(x, y);
    scale(i / 500);
    makeCircle(random(20));
    pop();
  }
}
