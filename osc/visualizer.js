let analyser;
let bufferLength;
let dataArray;
let canvasCtx;
const visWidth = 400;
const visHeight = 160;

function visualizerSetup() {
	analyser = ctx.createAnalyser();
	analyser.connect(ctx.destination);
	analyser.fftSize = 2048;
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);

	canvasCtx = $("#visualizer")[0].getContext("2d");
	canvasCtx.clearRect(0, 0, visWidth, visHeight);

	visualizerDraw();
}

function visualizerDraw() {
	drawVisual = requestAnimationFrame(visualizerDraw);
	analyser.getByteTimeDomainData(dataArray);
	canvasCtx.fillStyle = '#eee';
	canvasCtx.fillRect(0, 0, visWidth, visHeight);
	canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = '#555';
  canvasCtx.beginPath();
	let sliceWidth = visWidth * 1.0 / bufferLength;
  let x = 0;
	for(var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = v * visHeight/2;
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
	canvasCtx.lineTo(visWidth, visHeight/2);
  canvasCtx.stroke();
}
