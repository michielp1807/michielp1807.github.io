const filterRadius = 9;

class filter {
	constructor(which) {
		this.f =  ctx.createBiquadFilter();
		this.f.type = "peaking";

		let freq = (24000/2/(totalFilters+1))*which;
		this.f.frequency.setTargetAtTime(freq, ctx.currentTime, 0);

		this.useGain = true;

		// create HTML controlls
		this.html = $("<td></td>");
		this.html.append(`
			<h3>Filter `+which+`</h3>
			<button onclick="filterReset(`+which+`)">Reset values</button>
			<p>Type <select id="f`+which+`-type" onchange="filterSet('Type', `+which+`, value)">
				<option value="peaking">peaking</option>
				<option value="lowpass">lowpass</option>
				<option value="highpass">highpass</option>
				<option value="bandpass">bandpass</option>
				<option value="lowshelf">lowshelf</option>
				<option value="highshelf">highshelf</option>
				<option value="notch">notch</option>
				<option value="allpass">allpass</option>
			</select></p>
			<p><input id="f`+which+`-freq" type="range" min="0" max="4.38" value="0" step="0.001" onchange="filterSet('Frequency', `+which+`, value)" style="width: 160px;"></p>
			<p>Frequency: <span id="f`+which+`-hz">0</span> Hz</p>
			<p>Gain:<input id="f`+which+`-gain" type="range" min="-40" max="40" value="0" step="0.01" onchange="filterSet('Gain', `+which+`, value)"></p>
			<p>Q: <input id="f`+which+`-Q" type="range" min="-4" max="3" value="0" step="0.01" onchange="filterSet('Q', `+which+`, value)"></p>
		`);
		$("#filterContainer").append(this.html);

		// for drawing
		this.x = freq/(24000/2)*freqbarWidth;
		this.y = freqbarHeight/2;
		this.selected = false;
	}

	draw(canvas, i) {
		if (this.selected) {
			canvas.strokeStyle= 'hsl('+360/totalFilters*i+', 75%, 50%)';
		} else {
			canvas.strokeStyle= 'hsl('+360/totalFilters*i+', 50%, 25%)';
		}
		canvas.lineWidth=3;
		canvas.beginPath();
		canvas.arc(this.x, this.y, filterRadius,0,2*Math.PI);
		canvas.stroke();
	}

	pointOnFilter(x, y) {
		let dist = Math.sqrt((this.x - x)**2 + (this.y - y)**2);
		return (dist <= filterRadius);
	}

	updateFromCoordinates(which) {
		let freq = Math.log10(this.x/freqbarWidth*(24000/2));
		if (freq<0 || freq == NaN) freq = 0;
		$("#f"+which+"-freq").val(freq);
		filterSet("Frequency", which, freq);

		let gain = -this.y/freqbarHeight*80+40;
		$("#f"+which+"-gain").val(gain);
		filterSet("Gain", which, gain);
	}

	setType(type) {
		if (type=="lowpass" || type=="highpass" || type=="bandpass" || type=="notch" || type=="allpass") {
			this.useGain = false;
			this.y = freqbarHeight/2; // y is in the middle of the canvas
		} else {
			this.useGain = true;
			this.y = (-this.f.gain.value+40)/80*freqbarHeight; // calculate y based on gain value
		}
		this.f.type = type;
	}

	setQ(q, speed) {
		this.f.Q.setTargetAtTime(q, ctx.currentTime, speed);
	}

	setGain(gain, speed) {
		this.f.gain.setTargetAtTime(gain, ctx.currentTime, speed);
		if (this.useGain) {
			this.y = (-gain+40)/80*freqbarHeight;
		}
	}

	setFrequency(freq, speed) {
		this.f.frequency.setTargetAtTime(freq, ctx.currentTime, speed);
		this.x = freq/(24000/2)*freqbarWidth;
	}
}

function filterSet(property, which, value) {
	if (property=="Frequency") {
		value = 10**value;
		let fixedAmount = 1;
		if (value >= 100) fixedAmount = 0;
		$("#f"+which+"-hz").text(value.toFixed(fixedAmount));
	} else if (property=="Q") {
		value = 10**value;
	}
	filters[which-1]["set"+property](value, 0.05);
}

function filterReset(which) {
	$("#f"+which+"-type").val("peaking");
	filterSet("Type", which, "peaking");
	let freq = Math.log10((24000/2/(totalFilters+1))*which);
	$("#f"+which+"-freq").val(freq);
	filterSet("Frequency", which, freq);
	$("#f"+which+"-gain").val(0);
	filterSet("Gain", which, 0);
	$("#f"+which+"-Q").val(0);
	filterSet("Q", which, 0);
}

// MOUSE INPUT EVENTS
// http://jsfiddle.net/m1erickson/AGd6u/

let freqBarMouseStartX;
let freqBarMouseStartY;
let selectedFilter = -1;

function handleMouseDown(e) {
  e.preventDefault();
  freqBarMouseStartX = e.offsetX;
  freqBarMouseStartY = e.offsetY;

  // Put your mousedown stuff here
  for (let i=0; i<totalFilters; i++) {
    if (filters[i].pointOnFilter(freqBarMouseStartX, freqBarMouseStartY)) {
        selectedFilter = i;
				filters[i].selected = true;
    }
  }
}

function handleMouseUpOrOut(e) { // done dragging
  e.preventDefault();
  selectedFilter = -1;
	for (let i=0; i<totalFilters; i++) {
		filters[i].selected = false;
	}
}

function handleMouseMove(e) {
    if (selectedFilter < 0) {
        return;
    }
    e.preventDefault();
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;

    let dx = mouseX - freqBarMouseStartX;
    let dy = mouseY - freqBarMouseStartY;
    freqBarMouseStartX = mouseX;
    freqBarMouseStartY = mouseY;

    filters[selectedFilter].x += dx;
    if (filters[selectedFilter].useGain) filters[selectedFilter].y += dy;

		if (filters[selectedFilter].x<0) filters[selectedFilter].x=0;
		if (filters[selectedFilter].y<0) filters[selectedFilter].y=0;
		if (filters[selectedFilter].x>freqbarWidth) filters[selectedFilter].x=freqbarWidth;
		if (filters[selectedFilter].y>freqbarHeight) filters[selectedFilter].y=freqbarHeight;

		filters[selectedFilter].updateFromCoordinates(selectedFilter+1);
}
