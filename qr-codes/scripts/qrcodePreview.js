var version = 1;
var width = 17 + 4*version;
var canvasWidth = 380;
var rectWidth = canvasWidth/width;
var mask = [];
var versionInfo = [];
var formatInfo = [];
var qrCode = [];
var qrCodeOverlay = [];

var versionNumberElement;

var fQRCode1 = function(p) {
	p.setup = function() {
		p.createCanvas(canvasWidth, canvasWidth);
		p.noLoop();
		for (var i=0; i<width; i++) { // Setup qrCode[][]
			qrCode[i] = [];
			qrCodeOverlay[i] = [];
			for (var j=0; j<width; j++) {
				qrCode[i][j]=false;
				qrCodeOverlay[i][j] = false;
			}
		}

		versionNumberElement = document.getElementById("versionNumber");

		// Generate basic elements of qr-code

		for (i=0; i<9; i++) { // generate formating cells top left
			qrCodeOverlay[i][8] = [140,191,255];
		}
		for (j=0; j<9; j++) { // generate formating cells top left
			qrCodeOverlay[8][j] = [140,191,255];
		}
		for (j=0; j<8; j++) { // generate formating cells bottom left
			qrCodeOverlay[8][width-j] = [140,191,255];
		}
		for (i=1; i<9; i++) { // generate formating cells top right
			qrCodeOverlay[width-i][8] = [140,191,255];
		}

		if (version > 6) { // Version Information Area
			for (var i=0; i<6; i++) {
				for (var j=0; j<3; j++) {
					qrCodeOverlay[i][width-11+j] = [140,255,140];
					qrCodeOverlay[width-11+j][i] = [140,255,140];
				}
			}
		}


		qrCodeOverlay[8][6] = [0,0,0]; // timing patterns horizontal
		for (var i=0; i<width-15; i+=2) {
			qrCodeOverlay[9+i][6] = [255,255,255];
			qrCodeOverlay[10+i][6] = [0,0,0];
		}
		qrCodeOverlay[6][8] = [0,0,0]; // timing patterns vertical
		for (var j=0; j<width-15; j+=2) {
			qrCodeOverlay[6][9+j] = [255,255,255];
			qrCodeOverlay[6][10+j] = [0,0,0];
		}

		p.setFinderPatterns(0,0); // generate finder patterns
		p.setFinderPatterns(width-7,0);
		p.setFinderPatterns(0,width-7);
		if (version > 1) { // generate alignment patterns
			p.setAlignmentPatterns(width-7,width-7);
			if (version > 6) {
				var middle = Math.round(width/2);
				p.setAlignmentPatterns(middle,6);
				p.setAlignmentPatterns(6,middle);
				p.setAlignmentPatterns(middle,middle);
				p.setAlignmentPatterns(width-7,middle);
				p.setAlignmentPatterns(middle,width-7);
			}
		}

		qrCodeOverlay[8][width-8] = [0,0,0]; // dark module

		setTimeout(QRCode2.generateMask,1000);
	};

	p.reload = function() {
		version = parseInt(versionNumberElement.value);
		width = 17 + 4*version;
		rectWidth = canvasWidth/width;
		QRCode1.setup();
		QRCode1.draw();
		QRCode2.setup();
		//QRCode3.setup();
		setTimeout(dataCurrentByte1.reset, 500);
		VersionInfo.reCalculate(version);
		updateDataLengthHTML();
		updateDataBlocksHTML();
		changeBytes(0);
	}

	p.drawAll = function() {
		﻿QRCode1.draw();
		QRCode2.draw();
		//QRCode3.draw();
		setTimeout(QRCodeBytePosition.draw,100);
	}

	p.setFinderPatterns = function(x,y) {
		for (i=-1; i<8; i++) { // outer white border
			if (x+i>-1 && x+i<width) {
				for (j=-1; j<8; j++) {
					if (y+j>-1 && y+j<width) qrCodeOverlay[x+i][y+j] = [255,255,255];
				}
			}
		}

		for (i=0; i<7; i++) { // outer black box
			for (j=0; j<7; j++) qrCodeOverlay[x+i][y+j] = [0,0,0];
		}

		for (i=1; i<6; i++) { // inner white border
			for (j=1; j<6; j++) qrCodeOverlay[x+i][y+j] = [255,255,255];
		}

		for (i=2; i<5; i++) { // inner black box
			for (j=2; j<5; j++) qrCodeOverlay[x+i][y+j] = [0,0,0];
		}
	}

	p.setAlignmentPatterns = function(x,y) {
		for (i=-2; i<3; i++) { // outer black border
			for (j=-2; j<3; j++) {
				qrCodeOverlay[x+i][y+j] = [0,0,0];
			}
		}

		for (i=-1; i<2; i++) { // outer white border
			for (j=-1; j<2; j++) {
				qrCodeOverlay[x+i][y+j] = [255,255,255];
			}
		}

		qrCodeOverlay[x][y] = [0,0,0]; // inner black dot
	}

	p.draw = function() {
		p.background(200);
		p.rectMode("corners");
		p.stroke(200);
		p.strokeWeight(1);
		for (var i=0; i<width; i++) {
			for (var j=0; j<width; j++) {
				if (qrCodeOverlay[i][j]) {
					p.fill(qrCodeOverlay[i][j]);
				} else {
					//if (qrCode[i][j]) p.fill(0);
					//else p.fill(255);
					p.fill(220)
				}
				p.rect(i*rectWidth,j*rectWidth,i*rectWidth+rectWidth,j*rectWidth+rectWidth);
			}
		}
	};
};
var QRCode1 = new p5(fQRCode1, 'QRCode1');
