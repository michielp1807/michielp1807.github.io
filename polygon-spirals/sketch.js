const CONFIGS = [
	[5, 72, 7, -1],
  [6, 330, 6, 0],
	[7, 51, 8, -1],
	[8, 270, 7, 1],
	[12, 75, 6, -2]
];

function setup() {
	let canvas = createCanvas(windowWidth,windowHeight);
	let config = CONFIGS[Math.floor(Math.random()*CONFIGS.length)];

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

	let angle = parseFloat($("#angleSlider")[0].value);
	$("#angleNum").text(angle);

	angle = radians(angle);

	if (oldTouchAngle != touchAngle) {
		angle = realMod(angle - (touchAngle - oldTouchAngle), TWO_PI);
		let degreeAngle = degrees(angle).toFixed(3);
		$("#angleSlider")[0].value = degreeAngle;
		$("#angleNum").text(degreeAngle);
		oldTouchAngle = touchAngle;
	}


	let polygons = parseInt($("#polySlider")[0].value);
	$("#polyNum").text(polygons);

	let offsetSlider = $("#offsetSlider")[0];
  offsetSlider.min = -sides;
  offsetSlider.max = sides;
	let offset = parseInt(offsetSlider.value);
	if (offset < -sides)
	 	offset = -sides+1;
	else if (offset > sides)
	 	offset = sides-1;
	$("#offsetNum").text(offset);

	render(sides, polygons, angle, offset);
}

function angleSliderClick() {
	// when changing the angle with the slider, use steps of 1 degree,
	// when using double touch, a step size of 0.001 is used.
	$("#angleSlider")[0].step = "1";
}
