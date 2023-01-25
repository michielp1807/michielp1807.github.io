let osc1;
let filters = [];
const totalFilters = 4;

$(function () {
	$("#filterTable").hide();
	visualizerCanvasSetup();
	keysSetup();
});

let ctx = null
function setup() {
	console.log("Setting up audio context...");
	ctx = new (window.AudioContext || window.webkitAudioContext)();

	osc1 = new osc("sine", 440);

	visualizerSetup();

	for (let i = 0; i < totalFilters; i++) {
		filters[i] = new filter(i + 1);
		filterReset(i + 1);
	}

	connectNodes();
}

function connectNodes() {
	if (filters[0] != undefined) { // if filters are active
		osc1.vol.connect(filters[0].f); // connect osc
		for (let i = 0; i < totalFilters - 1; i++) {
			filters[i].f.connect(filters[i + 1].f);
		}
		filters[totalFilters - 1].f.connect(analyser);
	} else { // if no filters are active
		osc1.vol.connect(analyser);
	}
	analyser.connect(ctx.destination);
}

function inputChange(name, value) {
	//console.log(name + ": " + value);
	switch (name) {
		case "volume":
			osc1.setVolume(value, 0.05);
			break;
		case "waveType":
			osc1.osc.type = value;
			break;
		case "frequency":
			let hz = 10 ** value;
			osc1.setFrequency(hz, 0);
			$("#hertz").text(hz.toFixed(1));
			break;
	}
}

function openOrCloseFilters(open) {
	let filtersShowHide = $("#filtersShowHide");
	if (filtersShowHide.text() == "Show filters") {
		filtersShowHide.text("Hide filters");
		showFiltersInVisualizer = true;
		$("#filterTable").show();
	} else {
		filtersShowHide.text("Show filters");
		$("#filterTable").hide();
	}
}
