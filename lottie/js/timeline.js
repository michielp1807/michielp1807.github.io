// array containing layer objects
let uiLayers = [];

let editingFrameValue = false; // true if currentFrameValue is being edited by the user

window.addEventListener("load", function () {
	const timelineAreaTable = document.getElementById("timelineAreaTable");
	const currentFrameValue = document.getElementById("currentFrameValue");
	const frameMarker = document.getElementById("frameMarker");
	const frameBlocks = document.getElementById("frameBlocks");
	const timelineColumn = document.getElementById("timelineColumn");

	// Set the current frame by clicking anywhere on the timeline
	document.getElementById("timelineArea").addEventListener("mousedown", function (ev) {
		if (ev.button === 0) { // Primary click (left in most cases)
			// Move to frame closed to where clicked if clicked inside timeline
			let rect = timelineColumn.getBoundingClientRect();
			let perc = (ev.clientX - rect.x) / rect.width;
			if (perc >= 0 && perc <= 1) {
				let frame = Math.round(perc * anim.totalFrames);
				anim.goToAndStop(frame, true);

				// Allow the user to drag to different a different frame
				startDrag(ev, function (ev) {
					let perc = (ev.clientX - rect.x) / rect.width;
					perc = Math.min(Math.max(perc, 0), 1);
					let frame = Math.round(perc * anim.totalFrames);
					anim.goToAndStop(frame, true);
				});
			}
		}
	});

	// Setup up currentFrameValue to allow for setting current frame number
	currentFrameValue.addEventListener("focusin", function () {
		editingFrameValue = true;
	});

	currentFrameValue.addEventListener("keypress", function (ev) {
		if (ev.which === 13) { // Prevent pressing enter in currentFrameValue
			ev.preventDefault();
			this.blur();
		}
	});

	currentFrameValue.addEventListener("focusout", function () {
		let value = this.innerHTML;
		value = value.replace(/^(.*?)(?=[-.0-9])/, ""); // remove characters in front first number
		value = parseInt(value);
		if (isNaN(value)) {
			value = Math.round(anim.currentFrame);
		} else {
			lottie.goToAndStop(value, true);
			updatePlayPauseButton();
		}
		this.innerHTML = value;
		editingFrameValue = false;
	});

	setInterval(timelineUIinterval, 1000 / 60);
});

// Execute 60 times per second, updates continuously changing UI elements
function timelineUIinterval() {
	// Update current frame number
	let frame = Math.round(anim.currentFrame);
	if (!editingFrameValue)
		currentFrameValue.innerHTML = (frame < 10 && frame >= 0 ? "0" : "") + frame;

	// Update frame marker
	frameMarker.style.height = timelineAreaTable.offsetHeight;
	frameMarker.style.left = anim.currentFrame / anim.totalFrames * 100 + "%"
}

// Update the entire timeline editor with json data
// TODO: this is currently inefficient because we regenerate everything
//       however, to prevent this we would need to be able to update/cast
//       different layer types
function updateTimelines() {
	updateFrameBlocks();

	// delete all layer UIs
	uiLayers = [];
	while (timelineAreaTable.rows.length > 1) {
		timelineAreaTable.deleteRow(1);
	}

	for (let i = 0; i < jsonData.layers.length; i++) {
		let type = jsonData.layers[i].ty;
		if (LAYER_TYPES[type] == null) {
			uiLayers.push(new TL_Layer(i)); // create layer
		} else {
			uiLayers.push(new LAYER_TYPES[type](i)); // create layer
		}
		uiLayers[i].update(); // set values
	}
}

// Update frame blocks
const FRAME_BLOCK_STEP_SIZE = 10;
function updateFrameBlocks() {
	// Create frame numbers for every step of FRAME_BLOCK_STEP_SIZE
	let numFrames = jsonData.op - jsonData.ip;
	let numBlocks = Math.ceil(numFrames / FRAME_BLOCK_STEP_SIZE);
	while (frameBlocks.childElementCount < numBlocks) {
		frameBlocks.appendChild(document.createElement("SPAN"));
	}
	while (frameBlocks.childElementCount > numBlocks) {
		frameBlocks.removeChild(frameBlocks.children[frameBlocks.childElementCount - 1]);
	}
	let i = jsonData.ip;
	frameBlocks.children.forEach(e => {
		e.innerHTML = i;
		if (i < jsonData.op - FRAME_BLOCK_STEP_SIZE) {
			e.style.width = (100 / numFrames * FRAME_BLOCK_STEP_SIZE) + "%";
		} else {
			e.style.width = "";
		}
		i += FRAME_BLOCK_STEP_SIZE;
	});
	// Set striped background
	let frameWidth = 100 / numFrames;
	timelineColumn.style.background = `repeating-linear-gradient(
		90deg, #ccc, #ccc ${frameWidth}%, #ddd ${frameWidth}%, #ddd ${2 * frameWidth}%
	)`;
}

// Inspired by: https://www.w3schools.com/howto/howto_js_draggable.asp
// Used by timeline layer visibility bar (and maybe other things in the future,
// like keyframes which can be dragged around)
let dragStartX;
let dragStartY;
function startDrag(ev, onmove) {
	ev.preventDefault();
	ev.stopPropagation();

	dragStartX = ev.clientX;
	dragStartY = ev.clientY;

	document.addEventListener("mouseup", stopDrag);
	document.addEventListener("mousemove", onmove);

	function stopDrag() {
		document.removeEventListener("mouseup", stopDrag);
		document.removeEventListener("mousemove", onmove);
		setCodeValue(); // apply changes from drag
	}
}
