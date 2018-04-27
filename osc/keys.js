const letters = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let octaves;
let startingMIDI;

function keysSetup() {
	let keys = $("#keys")[0];
	octaves = 3;
	startingMIDI = 60 - 12 * Math.floor(octaves/2);
	let whiteKeyWidth = 100/(octaves * 7 + 1);
	let blackKeyWidth = 90/(octaves * 7 + 1);
	let totalKeys = octaves * 12 + 1;

	for (let i=0; i<totalKeys; i++) {
		let key = document.createElement("button");
		let letter = letters[i%12];
		key.innerHTML = letter;
		if (letter.length === 1) {
			key.className = "whiteKeys";
			key.style.width = whiteKeyWidth+"%";
		} else {
			key.className = "blackKeys";
			key.style.left = ((0.55+Math.floor(i/2 + i/12))*whiteKeyWidth)+"%";
			key.style.width = blackKeyWidth+"%";
		}
		key.onmousedown = function() {keyPress(i, "down");};
		key.onmouseup = function() {keyPress(i, "up");};
		keys.append(key);
	}
}

function keyPress(i, mouse) {
	let midiNumber = startingMIDI + i;
	let freq = 440 * 2**((midiNumber-69)/12);
	//console.log(letters[i%12] + " (midi: " + midiNumber + ", " + freq.toFixed(1) + "Hz) " + mouse);

	if (mouse == "down") {
		osc1.setFrequency(freq, 0);
		$("#freqSlider")[0].value = Math.log10(freq);
		$("#hertz").text(freq.toFixed(1));
	}
}
