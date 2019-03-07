let cameraX;
let cameraY;
let xOffset = 0.0;
let yOffset = 0.0;
let canvasClicked = false;

function setup() {
	let canvas = createCanvas(windowWidth,windowHeight);

	// camera movement
	cameraX = width/2;
	cameraY = height/2;
	canvas.mousePressed(function() {
		xOffset = mouseX - cameraX;
	  yOffset = mouseY - cameraY;
		canvasClicked = true;
	});
	canvas.mouseReleased(function() {
		canvasClicked = false;
	});
	canvas.mouseWheel(function(e) {
		let delta = Math.sign(e.deltaY);
		let size = $("#sizeSlider")[0].value;
		$("#sizeSlider")[0].value = parseInt(size) - 20 * delta;
	});
}

function mouseDragged() {
	if (canvasClicked) {
  	cameraX = mouseX-xOffset;
  	cameraY = mouseY-yOffset;
  }
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

	let sides = $("#sidesSlider")[0].value;
	$("#sidesNum").text(sides);

	let polygons = $("#polySlider")[0].value;
	$("#polyNum").text(polygons);

	let size = $("#sizeSlider")[0].value;
	$("#sizeNum").text(size);

	let angle = $("#angleSlider")[0].value;
	$("#angleNum").text(angle);
	angle = (angle % 360)/360 * TWO_PI;

	let x = 0;
	let y = 0;

	let coords = getCoordsOnCircle(x, y, size, sides, angle);

	for (let i=0; i<polygons; i++) {
		drawPolygonStar(coords);

		if (i < polygons-1) {
		  // new polygon is defined with corners coords[0], coords[2] and p:
			let p = intersection(coords[0], coords[2], coords[1], coords[sides-1]);
			//ellipse(p[0], p[1], 10); // for debugging

		  let a = TWO_PI/sides;
			let b = HALF_PI - a/2;

			let newSideLength = dist(coords[0][0], coords[0][1], p[0], p[1]);
			let newRadius = newSideLength / (2*cos(b));

			x = p[0] + cos(b - angle) * newRadius;
			y = p[1] - sin(b - angle) * newRadius;

			if (sides%2 == 0)
				angle += PI/sides;

			coords = getCoordsOnCircle(x, y, newRadius, sides, angle);
		}
	}
}

function intersection(c1, c2, c3, c4) {
	// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
	let px = ((c1[0]*c2[1]-c1[1]*c2[0])*(c3[0]-c4[0])-(c1[0]-c2[0])*(c3[0]*c4[1]-c3[1]*c4[0]))
	 				/ ((c1[0]-c2[0])*(c3[1]-c4[1])-(c1[1]-c2[1])*(c3[0]-c4[0]));
  let py = ((c1[0]*c2[1]-c1[1]*c2[0])*(c3[1]-c4[1])-(c1[1]-c2[1])*(c3[0]*c4[1]-c3[1]*c4[0]))
	 				/ ((c1[0]-c2[0])*(c3[1]-c4[1])-(c1[1]-c2[1])*(c3[0]-c4[0]));
  return [px, py];
}
