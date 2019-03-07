let cameraX;
let cameraY;
let xOffset = 0.0;
let yOffset = 0.0;
let canvasClickStatus = 0;
let zoom = 150;

function setupCamera(canvas) {
	cameraX = width/2;
	cameraY = height/2 + 50;

	canvas.touchStarted(clickDown);
	canvas.touchEnded(clickUp);
	canvas.mouseWheel(canvasZoom);
}

function clickDown() {
	canvasClickStatus = 1;
}

function clickUp() {
	canvasClickStatus = 0;
}

// global touch moved event
function touchMoved() {
	// don't rely on touchstarted, chrome android broke it
	// so instead I use this click status thing
	if (canvasClickStatus == 1) {
		xOffset = mouseX - cameraX;
		yOffset = mouseY - cameraY;
		canvasClickStatus++;
	} else if (canvasClickStatus == 2) {
  	cameraX = mouseX-xOffset;
  	cameraY = mouseY-yOffset;
		return false;
  }
}

function canvasZoom(e) {
	let sensitivity = 0.1;

	let delta = (1 - Math.sign(e.deltaY)*sensitivity);

	zoom = zoom * delta;

	cameraX += (cameraX - mouseX) * (delta-1);
	cameraY += (cameraY - mouseY) * (delta-1);
}
