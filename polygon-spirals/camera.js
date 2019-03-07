let cameraX;
let cameraY;
let xOffset = 0.0;
let yOffset = 0.0;
let canvasClicked = false;
let zoom = 150;

function setupCamera(canvas) {
	cameraX = width/2;
	cameraY = height/2 + 50;

	canvas.mousePressed(function() {
		xOffset = mouseX - cameraX;
		yOffset = mouseY - cameraY;
		canvasClicked = true;
	});

	canvas.mouseReleased(function() {
		canvasClicked = false;
	});

	canvas.mouseWheel(canvasZoom);
}

function mouseDragged() {
	if (canvasClicked) {
  	cameraX = mouseX-xOffset;
  	cameraY = mouseY-yOffset;
  }
}

function canvasZoom(e) {
	let sensitivity = 0.1;

	let delta = (1 - Math.sign(e.deltaY)*sensitivity);

	zoom = zoom * delta;

	cameraX += (cameraX - mouseX) * (delta-1);
	cameraY += (cameraY - mouseY) * (delta-1);
}
