const R = 500;
const N = 100;
const MAX = 200;
let a = MAX;
let x = 100;
let off = 0.5;
let CX, CY;

function setup() {
	createCanvas(windowWidth, windowHeight);
	CX = innerWidth / 2;
	CY = innerHeight / 2;
}

function easeInOutCubic (t) {
	return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

function keyPressed() {
	a = MAX;
	x = int(random(1000));
	randomSeed();
	off = random(1)
}

function makeCircle(s) {
	strokeWeight(s);
	stroke(255);
	noFill();
	let r = R * (0.25 + off * 2);
	ellipse(0, 0, r, r);
}

function mousePressed () {
	noLoop();
}

function mouseReleased() {
	loop();
}

function draw() {
	a *= 0.95;
	let b = easeInOutCubic(a / MAX) * MAX;
	let c = color(b, b, b, 50);
	background(c);

	translate(CX, CY);
	randomSeed(42);

	let tick = frameCount * off;
	for (let i = 0; i < N; i++) {
		push();
		let dir = i % 2  === 0 ? -1 : 1;
		rotate(dir * random(N / 4) * tick * 0.004);

		let amp = sin(tick * 0.001 * random(10)) * 6;
		let x = random(-100, 100) + random(N / 40) * exp(amp);
		let y = random(-100, 100);
		translate(x, y);
		scale(i / 500);
		makeCircle(random(20));
		pop();
	}
}