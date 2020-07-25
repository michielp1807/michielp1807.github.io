const PAUSE_BUTTON = "pause";
const PLAY_BUTTON = "play_arrow";

// Setup the UI seen beneath the animation
window.addEventListener("load", function () {
	const animationView = document.getElementById("animationView");
	const playPauseButton = document.getElementById("playPauseButton");
	const autoRefresh = document.getElementById("autoRefresh");
	const fileInput = document.getElementById("fileInput");
	fileInput.value = null;

	// Show material design icons
	NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
	document.getElementsByClassName("material-icons load").forEach(e => {
		e.style.opacity = 1;
	});
	document.body.style.removeProperty("color");

	// Setup load file button
	fileInput.addEventListener("change", loadFromFile);

	// Setup save Gzip button
	document.getElementById("saveAsGzip").addEventListener("click", function () {
		let gzipData = pako.gzip(JSON.stringify(jsonData));
		downloadDataAsFile(jsonData.nm, ".tgs", gzipData);
	});

	// Setup save JSON button
	document.getElementById("saveAsJSON").addEventListener("click", function () {
		downloadDataAsFile(jsonData.nm, ".json", JSON.stringify(jsonData));
	});
});

function firstFrame() {
	lottie.goToAndStop(anim.firstFrame);
	updatePlayPauseButton();
}

function prevFrame() {
	let frame = Math.round(anim.currentFrame) - 1;
	if (frame < anim.firstFrame) { // Loop around if needed
		frame += anim.totalFrames;
	}
	lottie.goToAndStop(frame, true);
	updatePlayPauseButton();
}

function playPause() {
	lottie.togglePause();
	updatePlayPauseButton();
}

function nextFrame() {
	let frame = Math.round(anim.currentFrame) + 1;
	if (frame >= anim.firstFrame + anim.totalFrames) { // Loop around if needed
		frame -= anim.totalFrames;
	}
	lottie.goToAndStop(frame, true);
	updatePlayPauseButton();
}

function lastFrame() {
	lottie.goToAndStop(anim.firstFrame + anim.totalFrames, true);
	updatePlayPauseButton();
}

function updatePlayPauseButton() {
	if (anim.isPaused) {
		playPauseButton.innerHTML = PLAY_BUTTON;
	} else {
		playPauseButton.innerHTML = PAUSE_BUTTON;
	}
}