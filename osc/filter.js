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
			<p><input id="f`+which+`-freq" type="range" min="0" max="4.381" value="0" step="0.001" onchange="filterSet('Frequency', `+which+`, value)" style="width: 160px;"></p>
			<p>Frequency: <span id="f`+which+`-hz">0</span> Hz</p>
			<p>Gain:<input id="f`+which+`-gain" type="range" min="-40" max="40" value="0" step="0.01" onchange="filterSet('Gain', `+which+`, value)"></p>
			<p>Q: <input id="f`+which+`-Q" type="range" min="-4" max="3" value="0" step="0.01" onchange="filterSet('Q', `+which+`, value)"></p>
		`);
		$("#filterContainer").append(this.html);

		// for drawing
		this.x = freq/(24000/2)*freqbarWidth;
		this.y = freqbarHeight/2;
	}

	setType(type) {
		if (type=="lowpass" || type=="highpass" || type=="bandpass" || type=="notch" || type=="allpass") {
			this.useGain = false;
			this.y = freqbarHeight/2;
		} else {
			this.useGain = true;
			this.y = (-this.f.gain.value+40)/80*freqbarHeight;
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
		$("#f"+which+"-hz").text(value.toFixed(1));
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
