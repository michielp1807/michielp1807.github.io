let osc1;

$(function(){
	visualizerSetup();
	osc1 = new osc("sine", 220);
});

let ctx = new (window.AudioContext || window.webkitAudioContext)();

function inputChange(name, value) {
	console.log(name + ": " + value);
	switch(name) {
		case "volume":
			osc1.setVolume(value, 0.05);
			break;
		case "waveType":
			osc1.osc.type = value;
			break;
		case "frequency":
			let hz = 10**value;
			osc1.setFrequency(hz, 0.05);
			$("#hertz").text(hz.toFixed(1));
			break;
	}
}
