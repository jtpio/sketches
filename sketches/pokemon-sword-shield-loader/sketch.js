const BG = '#88ddee';
const COLORS = [
  '#d00d33', // red
  '#24a2f7', // blue
  '#7e7e7e', // grey
  '#b14ffa', // purple
];
const N_COLORS = COLORS.length;
const BLACK = '#000';
const WHITE = '#fff';
const RADIUS = 100;
const TWEEN_DURATION = 2000;
const SCALE = (16 / 9) / 1000;

let fps = 0;
let cx, cy, ratio;

// from: https://gist.github.com/gre/1650294
const easeInOutQuad = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;

function setup() {
  createCanvas(innerWidth, innerHeight);
  windowResized();
}

function windowResized() {
  ratio = SCALE * min(innerWidth, innerHeight);
  resizeCanvas(innerWidth, innerHeight);
}

function draw() {
  background(BG);

  // calculate values based on the current time and tween duration
  const current = millis();
  const n = int(current / TWEEN_DURATION);
  const t = (current % TWEEN_DURATION) / TWEEN_DURATION;
  const v = easeInOutQuad(t);

  const angle = TWO_PI + HALF_PI;
  const angleOffset = QUARTER_PI;

  // move origin to the center
  translate(innerWidth / 2, innerHeight / 2);
  rotate(angleOffset + (n + v) * angle);
  scale(ratio);

  // grey background
  fill('rgba(192, 192, 192, 0.5)');
  noStroke();
  circle(0, 0, RADIUS * 2.25);

  // calculate postion and offset
  const x = v > 0.5 ? (1 - v) : v;
  const colorId = constrain((n - 1 + round(v)) % N_COLORS, 0, N_COLORS - 1);
  const color = COLORS[colorId];
  const offset = PI - PI * (x * 2);

  // colored half
  fill(color);
  noStroke();
  arc(0, 0, RADIUS * 2, RADIUS * 2, -offset, 0);

  // white half
  fill(WHITE);
  noStroke();
  arc(0, 0, RADIUS * 2, RADIUS * 2, -offset + PI, PI);

  // junctions
  strokeCap(SQUARE);
  strokeWeight(18);
  stroke(0);
  fill('#fff');
  line(-RADIUS, 0, RADIUS, 0);
  circle(0, 0, RADIUS / 1.25);
}

