const CONFIGS = [
  [6, 330, 6, 0],
	[5, 72, 7, -1]
];

function setup() {
	let canvas = createCanvas(windowWidth,windowHeight);
	let config = CONFIGS[Math.floor(Math.random()*CONFIGS.length)];

	console.log(config);

	$("#sidesSlider")[0].value = config[0];
	$("#angleSlider")[0].value = config[1];
	$("#polySlider")[0].value = config[2];
	$("#offsetSlider")[0].value = config[3];

	setupCamera(canvas);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(255);
	stroke(0);
	strokeWeight(1);
	noFill();

	translate(cameraX, cameraY);

	let sides = parseInt($("#sidesSlider")[0].value);
	$("#sidesNum").text(sides);

	let angle = parseInt($("#angleSlider")[0].value);
	$("#angleNum").text(angle);
	angle = (angle % 360)/360 * TWO_PI;

	let polygons = parseInt($("#polySlider")[0].value);
	$("#polyNum").text(polygons);

	let offsetSlider = $("#offsetSlider")[0];
  offsetSlider.min = -sides+1;
  offsetSlider.max = sides-1;
	let offset = parseInt(offsetSlider.value);
	if (offset < -sides+1)
	 	offset = -sides+1;
	else if (offset > sides-1)
	 	offset = sides-1;
	$("#offsetNum").text(offset);

	render(sides, polygons, angle, offset);
}
