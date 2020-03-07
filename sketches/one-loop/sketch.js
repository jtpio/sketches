let CX, CY;
let R = 50;
let R2 = R * 0.6;
let D = 3 * R2;
let DURATION = 2000;

function setup() {
	createCanvas(innerWidth, innerHeight);
	colorMode(RGB);
	noStroke();
	CX = innerWidth / 2;
	CY = innerHeight / 2;
}

// from: https://gist.github.com/gre/1650294
function cubicInOut(t) {
	return t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

function big() {
	fill('red');
	arc(CX, CY, R, R, 0, TWO_PI, OPEN);
}

function small() {
	let current = millis();
	[0, 1000].forEach(offset => {
		let t = ((current + offset) % DURATION) / DURATION;
		let v = cubicInOut(t) * TWO_PI - PI * 0.5;
		let x = CX + D * cos(v);
		let y = CY + D * sin(v);
		fill('white');
		arc(x, y, R2, R2, 0, TWO_PI, OPEN);
	});
}

function draw() {
	background(0);
	big();
	small();
}

