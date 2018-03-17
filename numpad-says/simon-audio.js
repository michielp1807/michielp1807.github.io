// set up sound effects
let snd = [];
for (let i=0; i<11; i++) {
	snd[i] = new Audio("snd/snd"+(i+1)+".mp3")
}
snd["gameover"] = new Audio("snd/gameover.mp3");

function loadVolume() {
	let volume = localStorage.getItem("volume");
	$("#volumeSlider")[0].value = volume;
	setVolume();
}

function playSfx(int) {
	// play a sound from the snd object
	snd[int].currentTime = 0;
	snd[int].play();
}

function setVolume(invert) {
	// activated by the volume controlls
	let volume = parseFloat($("#volumeSlider")[0].value);
	if (invert) { // when clicking audio icon
		volume = (volume > 0) ? 0 : 1;
		$("#volumeSlider")[0].value = volume;
	}
	for (audio in snd) {
		snd[audio].volume = volume;
	}
	if (volume == 0) {
		$("#volumeIcon").text("volume_off");
	} else if (volume <= 0.5) {
		$("#volumeIcon").text("volume_down");
	} else {
		$("#volumeIcon").text("volume_up");
	}

	// save volume
	localStorage.setItem("volume", volume);
}
