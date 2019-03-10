let cameraX;
let cameraY;
let xOffset, yOffset;
let canvasClickStatus = 0;
let zoom = 150;
let oldTouchAngle; // updated each draw()
let touchAngle; // updated each touchMoved();
let touchX, touchY, touchDist;

function setupCamera(canvas) {
	cameraX = width/2;
	cameraY = height/2 + 50;

	canvas.touchStarted(clickDown);
	canvas.touchEnded(clickUp);
	canvas.mouseWheel(canvasZoom);
}

function clickDown() {
	if (touches.length == 1) { // current touch not in there at this moment
		canvasClickStatus = 3;
	} else {
		canvasClickStatus = 1;
	}
}

function clickUp() {
	if (touches.length == 2) { // current touch still in there at this moment
		canvasClickStatus = 1;
	} else {
		canvasClickStatus = 0;
	}
}

// global touch moved event
function touchMoved() {
	// don't rely on touchstarted, chrome android broke it
	// so instead I use this click status thing:
	// canvasClickStatus = 0: no touches
	// canvasClickStatus = 1: first input of single touch
	// canvasClickStatus = 2: next inputs of single touch
	// canvasClickStatus = 3: first input of double touch
	// canvasClickStatus = 4: next inputs of double touch
	if (canvasClickStatus == 1) {
		xOffset = mouseX - cameraX;
		yOffset = mouseY - cameraY;
		canvasClickStatus = 2;
	} else if (canvasClickStatus == 2) {
  	cameraX = mouseX-xOffset;
  	cameraY = mouseY-yOffset;
		return false;
  } else if (canvasClickStatus == 3) {
		touchX = touches[0].x;
		touchY = touches[0].y;
		touchAngle = calcTouchAngle();
		oldTouchAngle = touchAngle;
		touchDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
		$("#angleSlider")[0].step = "0.001";
		canvasClickStatus = 4;
	} else if (canvasClickStatus == 4) {
		// translation
		cameraX += touches[0].x-touchX;
  	cameraY += touches[0].y-touchY;
		touchX = touches[0].x;
		touchY = touches[0].y;

		// rotation & scaling
		let newTouchAngle = calcTouchAngle();

		let newTouchDist = dist(touchX, touchY, touches[1].x, touches[1].y);
		let delta = newTouchDist / touchDist;
		zoom = zoom * delta;
		touchDist = newTouchDist;

		// set camera position correctly after rotation + scaling
		let rotatedCameraX = delta * (cos(touchAngle - newTouchAngle) * (cameraX - touchX) - sin(touchAngle - newTouchAngle) * (cameraY - touchY)) + touchX;
		let rotatedCameraY = delta * (sin(touchAngle - newTouchAngle) * (cameraX - touchX) + cos(touchAngle - newTouchAngle) * (cameraY - touchY)) + touchY;
		cameraX = rotatedCameraX;
		cameraY = rotatedCameraY;

		touchAngle = newTouchAngle;
	}
}

function calcTouchAngle() {
	if (touches[0].y < touches[1].y)
		return atan((touches[0].x-touches[1].x)/(touches[0].y-touches[1].y));
	else {
		return PI + atan((touches[0].x-touches[1].x)/(touches[0].y-touches[1].y));
	}
}

function canvasZoom(e) { // scroll wheel zoom
	let sensitivity = 0.1;

	let delta = (1 - Math.sign(e.deltaY)*sensitivity);

	zoom = zoom * delta;

	cameraX += (cameraX - mouseX) * (delta-1);
	cameraY += (cameraY - mouseY) * (delta-1);
}

function realMod(a, n) { // modulo which does not return negative values
	return ((a % n) + n) % n;
}
