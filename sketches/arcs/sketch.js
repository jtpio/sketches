const RADIUS = 300;
const ROTATION_SPEED = 0.0001;
const S = 0.5;
const N = 30;
const COLORS = ["#ffffff", "#494949", "#7c7a7a", "#ff5b5b"];
const SCALE = 16 / 9 / 1000;

let ratio;

function setup() {
  createCanvas(innerWidth, innerHeight);
  smooth(1);
  strokeCap(SQUARE);
  noFill();
  windowResized();
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function draw() {
  background(0);
  randomSeed(0);

  const current = millis();
  const theta = current * ROTATION_SPEED;

  translate(innerWidth / 2, innerHeight / 2);
  rotate(theta);
  scale(ratio);

  for (let i = 0; i < N; i++) {
    const offset = theta;
    const angle = random([-2, 1]) * offset * random() * i + (i * N) / 2;
    const radius = (RADIUS / N) * i * 3 * S;
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
