// all coordinates are saved as [[x1, y1], [x2, y2], ...]

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
