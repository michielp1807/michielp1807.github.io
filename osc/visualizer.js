let analyser;
let bufferLength;
let dataArray;
let waveformCtx;
let freqbarCtx;
let freqSingleBarWidth;
let showFiltersInVisualizer = false;
const waveformWidth = 400;
const waveformHeight = 160;
const freqbarWidth = 600;
const freqbarHeight = 200;

function visualizerCanvasSetup() {
	waveformCtx = $("#waveform")[0].getContext("2d");
	waveformCtx.fillStyle = '#eee';
	waveformCtx.fillRect(0, 0, waveformWidth, waveformHeight);

	freqbarCtx = $("#freqbar")[0].getContext("2d");
	freqbarCtx.fillStyle = '#eee';
	freqbarCtx.fillRect(0, 0, freqbarWidth, freqbarHeight);
}

function visualizerSetup() {
	analyser = ctx.createAnalyser();
	//analyser.connect(ctx.destination); NOW DONE IN MAIN.JS
	analyser.fftSize = 1024;
	bufferLength = analyser.frequencyBinCount;
	freqSingleBarWidth = (freqbarWidth / bufferLength) * 2;
	dataArray = new Uint8Array(bufferLength);

	// listen for mouse events (mouse events are located in filter.js)
	$("#freqbar").mousedown(function (e) {
		handleMouseDown(e);
	});
	$("#freqbar").mousemove(function (e) {
		handleMouseMove(e);
	});
	$("#freqbar").mouseup(function (e) {
		handleMouseUpOrOut(e);
	});
	$("#freqbar").mouseout(function (e) {
		handleMouseUpOrOut(e);
	});

	waveformDraw();
	freqbarDraw();
}

function waveformDraw() {
	drawWaveform = requestAnimationFrame(waveformDraw);
	analyser.getByteTimeDomainData(dataArray);
	waveformCtx.fillStyle = '#eee';
	waveformCtx.fillRect(0, 0, waveformWidth, waveformHeight);
	waveformCtx.lineWidth = 2;
	waveformCtx.strokeStyle = '#555';
	waveformCtx.beginPath();
	let sliceWidth = waveformWidth * 1.0 / bufferLength;
	let x = 0;
	for (let i = 0; i < bufferLength; i++) {
		let v = dataArray[i] / 128.0;
		let y = v * waveformHeight / 2;
		if (i === 0) {
			waveformCtx.moveTo(x, y);
		} else {
			waveformCtx.lineTo(x, y);
		}
		x += sliceWidth;
	}
	//waveformCtx.lineTo(waveformWidth, waveformHeight/2);
	waveformCtx.stroke();
}

function freqbarDraw() {
	drawFreqbar = requestAnimationFrame(freqbarDraw);
	analyser.getByteFrequencyData(dataArray);
	freqbarCtx.fillStyle = '#eee';
	freqbarCtx.fillRect(0, 0, freqbarWidth, freqbarHeight);
	let barHeight;

	// draw frequency bars
	let x = 0;
	for (var i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i] / 255 * freqbarHeight;
		freqbarCtx.fillStyle = 'hsla(0, 0%, 33%, ' + dataArray[i] / 255 + ')';
		freqbarCtx.fillRect(x, freqbarHeight - barHeight, freqSingleBarWidth, barHeight);
		x += freqSingleBarWidth;
	}

	// draw filters
	if (filters[0] != undefined && showFiltersInVisualizer) {
		for (let i = 0; i < totalFilters; i++) {
			filters[i].draw(freqbarCtx, i);
		}
	}
}
