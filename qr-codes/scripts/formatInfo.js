var errCorLevel = "H";

var funcFormatInfo = function (p) {
	p.setup = function () {
		var c = p.createCanvas(canvasWidth, canvasWidth);
		c.mouseClicked(p.clicked);
		p.generateFormatInfo();
		document.getElementById("formatInfoNumberAddon").innerHTML = "<i>Klik op de vakjes links onder in het stuk van de code hiernaast om ze aan te passen.</i>";
	};

	p.generateFormatInfo = function () {
		for (var i = 0; i < 9; i++) {
			formatInfo[i] = [];
			for (var j = 0; j < 9; j++) {
				if ((i == 0 && j < 7) || (j == 0 && i < 7) || (i == 6 && j < 7) || (j == 6 && i < 7) || (i < 5 && j < 5 && i > 1 && j > 1) || (i == 6 && j == 8) || (j == 6 && i == 8)) formatInfo[i][j] = [160, 160, 160]; // dark gray (finder pattern)
				else if (j == 8 && i < 5) formatInfo[i][j] = [255, 255, 255]; // white
				else formatInfo[i][j] = [230, 230, 230]; // light gray
			}
		}
		p.reCalculate("10101", 0, 0);
	};

	// Mouse Interaction
	p.clicked = function (m) {
		var x = Math.floor(m.offsetX / (canvasWidth / 9));
		var y = Math.floor(m.offsetY / (canvasWidth / 9));

		if (x >= 0 && x < 5 && y == 8) { // change color of box
			if (m.which == 1) {
				if (formatInfo[x][y][0] === 0) {
					formatInfo[x][y] = [255, 255, 255];
				} else {
					formatInfo[x][y] = [0, 0, 0];
				}
			}

			var formatInfoString = "";
			for (var i = 0; i < 5; i++) { // calculate formatInfoString frow the boxes
				if (formatInfo[i][8][0] === 0) {
					formatInfoString += "1";
				} else {
					formatInfoString += "0";
				}
			}
			formatInfoString = xor(formatInfoString, "10101"); // xor it first

			var errCorNumber = binaryStringToInt(formatInfoString.substr(0, 2));
			var mNumber = binaryStringToInt(formatInfoString.substr(2, 3));

			if (mNumber != maskNumber) {
				maskNumberElement.value = "" + mNumber; // set format number
				QRCodePreview.reload();
			}

			p.reCalculate(formatInfoString, errCorNumber, mNumber);
		}
		return false;
	}

	p.reCalculate = function (formatInfoString, errCorNumber, mNumber) {

		// Calculate Error Correction

		var vErrCor = xor(formatInfoString + generateErrCor("10100110111", formatInfoString, 15), "101010000010010");

		// Draw Error Correction
		for (var i = 0; i < 6; i++) {
			if (vErrCor[i] === "0") {
				if (i >= 5) formatInfo[i][8] = [230, 230, 230]; //light gray
				else formatInfo[i][8] = [255, 255, 255]; // white
			} else {
				if (i >= 5) formatInfo[i][8] = [160, 160, 160]; // dark gray
				else formatInfo[i][8] = [0, 0, 0]; // black
			}
		}
		if (vErrCor[6] === "0") {
			formatInfo[7][8] = [230, 230, 230]; //light gray
		} else {
			formatInfo[7][8] = [160, 160, 160]; // dark gray
		}
		if (vErrCor[7] === "0") {
			formatInfo[8][8] = [230, 230, 230]; //light gray
		} else {
			formatInfo[8][8] = [160, 160, 160]; // dark gray
		}
		if (vErrCor[8] === "0") {
			formatInfo[8][7] = [230, 230, 230]; //light gray
		} else {
			formatInfo[8][7] = [160, 160, 160]; // dark gray
		}
		for (var i = 0; i < 6; i++) {
			if (vErrCor[14 - i] === "0") {
				formatInfo[8][i] = [230, 230, 230]; //light gray
			} else {
				formatInfo[8][i] = [160, 160, 160]; // dark gray
			}
		}


		// Change HTML Text
		document.getElementById("maskNumberElement").innerHTML = "" + mNumber;
		switch (errCorNumber) { // set error correction number
			case 2:
				document.getElementById("errCorElement").innerHTML = "H (30%)";
				errCorLevel = "H";
				break;
			case 0:
				document.getElementById("errCorElement").innerHTML = "M (15%)";
				errCorLevel = "M";
				break;
			case 3:
				document.getElementById("errCorElement").innerHTML = "Q (25%)";
				errCorLevel = "Q";
				break;
			case 1:
				document.getElementById("errCorElement").innerHTML = "L (7%)";
				errCorLevel = "L";
				break;
		}
		updateDataBlocksHTML();
		p.draw();
	}

	p.draw = function () {
		p.stroke(200);
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				p.fill(formatInfo[i][j]);
				p.rect(i * boxWidth, j * boxWidth, boxWidth, boxWidth);
			}
		}
	};
};
var FormatInfo = new p5(funcFormatInfo, 'FormatInfo');
