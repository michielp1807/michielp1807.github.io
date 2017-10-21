var maskNumber = 0;
var maskNumberElement;

var funcQRCode2 = function(p) {
	p.setup = function() {
		p.createCanvas(canvasWidth, canvasWidth);
		p.noLoop();
		maskNumberElement = document.getElementById("maskNumber");
	};

	p.generateMask = function() { // activated by QRCode1
		maskNumber = document.getElementById("maskNumber").value;
		for (var i=0; i<width; i++) {
			mask[i] = [];
			for (var j=0; j<width; j++) {
				mask[i][j]=p.calcMask(i,j);
			}
		}
		p.draw();
		//FormatInfo.reCalculate()
		//if (QRCode3._setupDone) QRCode3.draw();
	};

	p.draw = function() {
		if (!mask || !mask[0] || !mask[0][0]) return false;
		p.background(200);
		p.rectMode("corners");
		p.stroke(200);
		p.strokeWeight(1);
		for (var i=0; i<width; i++) {
			for (var j=0; j<width; j++) {
				p.fill(mask[i][j]);
				p.rect(i*rectWidth,j*rectWidth,i*rectWidth+rectWidth,j*rectWidth+rectWidth);
			}
		}
		DataType2.draw(); // update data type mask part
		dataLength2.draw();
	};

	p.isInFiveByFiveSquareAround = function(x,y,i,j) {
		return (i<x+3 && j<y+3 && i>x-3 && j>y-3);
	}

	p.calcMask = function(i,j) {
		if (qrCodeOverlay[i][j] != false) {
			if (qrCodeOverlay[i][j][0] == 255 && qrCodeOverlay[i][j][1] == 255 && qrCodeOverlay[i][j][2] == 255) {
				return [230,230,230]; //light gray
			} else if (qrCodeOverlay[i][j][0] == 0 && qrCodeOverlay[i][j][1] == 0 && qrCodeOverlay[i][j][2] == 0) {
				return [180,180,180]; // slightly darker gray
			}
			else return qrCodeOverlay[i][j];
		}

		if (i<7) i++; // Skip timing pattern
		if (j<7) j++;

		switch(maskNumber) {
			case "0":
				if ((i + j) % 2 == 0) return [0,0,0];
				else return [255,255,255];
			case "1":
				if ((j) % 2 == 0) return [0,0,0];
				else return [255,255,255];
			case "2":
				if ((i) % 3 == 0) return [0,0,0];
				else return [255,255,255];
			case "3":
				if ((i + j) % 3 == 0) return [0,0,0];
				else return [255,255,255];
			case "4":
				if ((Math.floor(j/2) + Math.floor(i/3)) % 2 == 0) return [0,0,0];
				else return [255,255,255];
			case "5":
				if (((i * j) % 2) + ((i * j) % 3) == 0) return [0,0,0];
				else return [255,255,255];
			case "6":
				if ((((i * j) % 2) + ((i * j) % 3)) % 2 == 0) return [0,0,0];
				else return [255,255,255];
			case "7":
				if ((((i + j) % 2) + ((i * j) % 3)) % 2 == 0) return [0,0,0];
				else return [255,255,255];
		}
	};
};
var QRCode2 = new p5(funcQRCode2, 'QRCode2');
