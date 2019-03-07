// all coordinates are saved as [[x1, y1], [x2, y2], ...]

// render polygon spiral
function render(sides, polygons, angle, offset) {
	let x = 0;
	let y = 0;

	offset = ((offset%sides) + sides) % sides;// fix negative offset

	let coords = getCoordsOnCircle(x, y, zoom, sides, angle);

	for (let i=0; i<polygons; i++) {
		drawPolygonStar(coords);

		// if this is not the last polygon, calculate the next polygon
		if (i < polygons-1) {
		  // new polygon is defined with corners coords[offset], coords[offset+1] and p:
			let p = intersection(coords[offset], coords[(offset+2)%sides], coords[(offset+1)%sides], coords[(sides-1+offset)%sides]);
			//ellipse(p[0], p[1], 10); // for debugging

		  let a = TWO_PI/sides;  // exterior angle
			let b = HALF_PI - a/2; // (interior angle)/2

			let newSideLength = dist(coords[offset][0], coords[offset][1], p[0], p[1]);
			let newRadius = newSideLength / (2*cos(b));

			x = p[0] + cos(b - angle - a*offset) * newRadius;
			y = p[1] - sin(b - angle - a*offset) * newRadius;

			if (sides%2 == 0)
				angle += PI/sides;

			angle += a*offset;

			coords = getCoordsOnCircle(x, y, newRadius, sides, angle);
		}
	}
}

// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
function intersection(c1, c2, c3, c4) {
	let px = ((c1[0]*c2[1]-c1[1]*c2[0])*(c3[0]-c4[0])-(c1[0]-c2[0])*(c3[0]*c4[1]-c3[1]*c4[0]))
	 				/ ((c1[0]-c2[0])*(c3[1]-c4[1])-(c1[1]-c2[1])*(c3[0]-c4[0]));
  let py = ((c1[0]*c2[1]-c1[1]*c2[0])*(c3[1]-c4[1])-(c1[1]-c2[1])*(c3[0]*c4[1]-c3[1]*c4[0]))
	 				/ ((c1[0]-c2[0])*(c3[1]-c4[1])-(c1[1]-c2[1])*(c3[0]-c4[0]));
  return [px, py];
}

// returns all the coordinates of a regular polygon
function getCoordsOnCircle(dx, dy, r, sides, angle) {
	let coords = [];
	let start = -0.25*TWO_PI + angle;
	let interval = TWO_PI/sides;

	for (i=0; i<sides; i++) {
		let a = start + i*interval;
    let x = r * cos(a) + dx;
    let y = r * sin(a) + dy;
		coords.push([x,y]);
	}

	return coords;
}

// draws a set of coordinates as a polygon with a star in it
function drawPolygonStar(coords) {
	let points = coords.length;

	// draw outline
  beginShape();
  for (i=0; i<points; i++) {
    vertex(coords[i][0],coords[i][1]);
  }
  endShape(CLOSE);

  // draw star
	beginShape();
  for (i=0; i<points; i+=2) {
    vertex(coords[i][0],coords[i][1]);
  }
	if (points%2 == 1)
		vertex(coords[1][0],coords[1][1]);
	else
		vertex(coords[0][0],coords[0][1]);
  endShape();

	// second star (needs to drawn separately for even-sided polygons)
	beginShape();
  for (i=1; i<points; i+=2) {
    vertex(coords[i][0],coords[i][1]);
  }
	if (points%2 == 1)
		vertex(coords[0][0],coords[0][1]);
	else
		vertex(coords[1][0],coords[1][1]);
  endShape();
}
