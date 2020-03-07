const R = 50;
const R2 = R * 0.6;
const D = 3 * R2;
const DURATION = 2000;
const SCALE = 16 / 9 / 1000;

let ratio;

function setup() {
  createCanvas(innerWidth, innerHeight);
  colorMode(RGB);
  noStroke();
  windowResized();
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

// from: https://gist.github.com/gre/1650294
function cubicInOut(t) {
  return t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

function big() {
  fill('red');
  arc(0, 0, R, R, 0, TWO_PI, OPEN);
}

function small() {
  let current = millis();
  [0, 1000].forEach(offset => {
    let t = ((current + offset) % DURATION) / DURATION;
    let v = cubicInOut(t) * TWO_PI - PI * 0.5;
    let x = D * cos(v);
    let y = D * sin(v);
    fill('white');
    arc(x, y, R2, R2, 0, TWO_PI, OPEN);
  });
}

function draw() {
  background(0);
  translate(innerWidth / 2, innerHeight / 2);
  scale(ratio);
  big();
  small();
}

