var dataCurrentByte = "00000000";
var dataCurrentByteMask = "00000000";
var dataCurrentByteNoMask = "00000000";
var dataCurrentBytePositions = [];
var mainDataBytes = []; // array of binary strings of all the bytes that have been entered
var mainDataBytesNoMask = []; // array of binary strings of all the bytes that have been entered with the mask removed
var dataCurrentByteDim = {};
var deepestTouchedByte = 0; // data byte number of the deepest touched byte (1 indexed)

var funcDataCurrentByte1 = function (p) {
	p.setup = function () {
		mainDataBytes = [];
		mainDataBytesNoMask = [];
		deepestTouchedByte = 0;
		var dim = p.getCanvasDimensions();
		if (dim === false) {
			setTimeout(dataCurrentByte1.setup, 500);
		} else {
			var c = p.createCanvas(boxWidth * dim.x, boxWidth * dim.y);
			dataCurrentByte = "00000000";
			c.mouseClicked(p.clicked);
			p.clickable = true;
			p.draw();
		}
	};

	p.reset = function () { // activated when changing QR-Code version
		mainDataBytes = [];
		mainDataBytesNoMask = [];
		deepestTouchedByte = 0;
		p.reload();
	}

	p.reload = function () { // activated when changing bytes
		p.clickable = false;

		var dim = p.getCanvasDimensions();
		if (dim === false || typeof mask == "undefined" || mask.length < width) {
			setTimeout(dataCurrentByte1.reload, 100);
		} else {
			p.resizeCanvas(boxWidth * dim.x, boxWidth * dim.y);
			dataCurrentByte = mainDataBytes[byteNumberToDataByteNumber(currentByte) - 1] || "00000000";
			p.draw();
			p.clickable = true;
			dataCurrentByte2.reload();
		}
	}

	p.getCanvasDimensions = function () {
		dataCurrentBytePositions = getBitPositionsOfByte(currentByte);
		if (dataCurrentBytePositions === false) return false;
		dataCurrentByteDim.minX = width - 1;
		dataCurrentByteDim.minY = width - 1;
		dataCurrentByteDim.maxX = 0;
		dataCurrentByteDim.maxY = 0;

		for (var i = 0; i < 8; i++) {
			if (dataCurrentBytePositions[i][0] < dataCurrentByteDim.minX) dataCurrentByteDim.minX = dataCurrentBytePositions[i][0];
			if (dataCurrentBytePositions[i][0] > dataCurrentByteDim.maxX) dataCurrentByteDim.maxX = dataCurrentBytePositions[i][0];
			if (dataCurrentBytePositions[i][1] < dataCurrentByteDim.minY) dataCurrentByteDim.minY = dataCurrentBytePositions[i][1];
			if (dataCurrentBytePositions[i][1] > dataCurrentByteDim.maxY) dataCurrentByteDim.maxY = dataCurrentBytePositions[i][1];
		}

		for (var i = 0; i < 8; i++) {
			dataCurrentBytePositions[i][0] -= dataCurrentByteDim.minX;
			dataCurrentBytePositions[i][1] -= dataCurrentByteDim.minY;
		}

		dataCurrentByteDim.width = dataCurrentByteDim.maxX - dataCurrentByteDim.minX + 1;
		dataCurrentByteDim.height = dataCurrentByteDim.maxY - dataCurrentByteDim.minY + 1;

		// Set HTML Style
		if (dataCurrentByteDim.width > 2) {
			document.getElementById("DataReaderInputColumn1").className = "column2";
			document.getElementById("DataReaderInputColumn2").className = "column2";
			document.getElementById("DataReaderInputColumn3").className = "columnNo";
		} else {
			document.getElementById("DataReaderInputColumn1").className = "column3";
			document.getElementById("DataReaderInputColumn2").className = "column3";
			document.getElementById("DataReaderInputColumn3").className = "column3";
		}

		if (dataCurrentByteDim.height > 8) {
			document.getElementById("DataReaderInputOuterWrapper").style.height = "400px";
		} else if (dataCurrentByteDim.height > 4 && dataCurrentByteDim.width > 2) {
			document.getElementById("DataReaderInputOuterWrapper").style.height = (384 + boxWidth * dataCurrentByteDim.height) + "px";
		} else {
			document.getElementById("DataReaderInputOuterWrapper").style.height = "380px";
		}


		return { x: dataCurrentByteDim.width, y: dataCurrentByteDim.height };
	}

	// Mouse Interaction
	p.clicked = function (m) {
		if (!p.clickable) return false;

		let x = dataCurrentByteDim.width - 1 - Math.floor(m.offsetX / boxWidth);
		let y = dataCurrentByteDim.height - 1 - Math.floor(m.offsetY / boxWidth);

		var i = -1;
		for (var j = 0; j < 8; j++) {
			if (dataCurrentBytePositions[j][0] === x && dataCurrentBytePositions[j][1] === y) i = 7 - j;
		}

		if (i >= 0) {
			//console.log("x: " + x + " y: " + y + " (" + i + ")");
			dataCurrentByte = xor(dataCurrentByte, ("00000000" + 10 ** i).substr(("00000000" + 10 ** i).length - 8)); // swap data at position around
			mainDataBytes[byteNumberToDataByteNumber(currentByte) - 1] = dataCurrentByte;
			document.getElementById("QR-Code-Reader-Byte-BinCode").innerHTML = dataCurrentByte;
			if (deepestTouchedByte < byteNumberToDataByteNumber(currentByte)) deepestTouchedByte = byteNumberToDataByteNumber(currentByte);
			if (currentByte === 1 && DataType1._setupDone) DataType1.setDataType(dataCurrentByte.substr(0, 4)); // set datatype
			p.draw();
		}

		return false;
	}

	p.draw = function () {
		if (dataCurrentBytePositions === false) return false;
		p.stroke(180);
		for (let i = 0; i < 8; i++) {
			var x = dataCurrentByteDim.width - 1 - dataCurrentBytePositions[i][0];
			var y = dataCurrentByteDim.height - 1 - dataCurrentBytePositions[i][1];
			p.fill((1 - dataCurrentByte[i]) * 255);
			p.rect(x * boxWidth, y * boxWidth, boxWidth, boxWidth);
		}
		if (dataCurrentByte3._setupDone) dataCurrentByte3.reload();
	};
};
var dataCurrentByte1 = new p5(funcDataCurrentByte1, 'DataReaderInput1');



var funcDataCurrentByte2 = function (p) {
	p.setup = function () {
		p.createCanvas(boxWidth * dataCurrentByteDim.width, boxWidth * dataCurrentByteDim.height);
		p.setCurrentMask();
		p.draw();
	};

	p.reload = function () { // activated when changing bytes
		if (dataCurrentByteDim === undefined || dataCurrentBytePositions === undefined || dataCurrentBytePositions[0] === undefined || !dataCurrentByte2._setupDone || !QRCodeMask._setupDone || mask.length < width) {
			setTimeout(dataCurrentByte2.reload, 250);
			return false;
		}
		p.resizeCanvas(boxWidth * dataCurrentByteDim.width, boxWidth * dataCurrentByteDim.height);
		p.setCurrentMask();
		p.draw();
	}

	p.setCurrentMask = function () {
		dataCurrentByteMask = "";
		for (let i = 0; i < 8; i++) {
			var tMask = mask[width - 1 - dataCurrentBytePositions[i][0] - dataCurrentByteDim.minX][width - 1 - dataCurrentBytePositions[i][1] - dataCurrentByteDim.minY];
			if (tMask[0] === 0 && tMask[1] === 0 && tMask[2] === 0) {
				dataCurrentByteMask += "1";
			} else {
				dataCurrentByteMask += "0";
			}
		}
	}

	p.draw = function () {
		if (dataCurrentBytePositions === false) return false;
		p.stroke(180);
		for (let i = 0; i < 8; i++) {
			var x = dataCurrentByteDim.width - 1 - dataCurrentBytePositions[i][0];
			var y = dataCurrentByteDim.height - 1 - dataCurrentBytePositions[i][1];
			p.fill(140 + 100 * (1 - dataCurrentByteMask[i])); // gray
			p.rect(x * boxWidth, y * boxWidth, boxWidth, boxWidth);
		}
		if (dataCurrentByte3._setupDone) dataCurrentByte3.reload();
	};
};
var dataCurrentByte2 = new p5(funcDataCurrentByte2, 'DataReaderInput2');



var funcDataCurrentByte3 = function (p) {
	p.setup = function () {
		p.createCanvas(boxWidth * dataCurrentByteDim.width, boxWidth * dataCurrentByteDim.height);
		p.draw();
	};

	p.reload = function () { // activated when changing bytes
		if (dataCurrentByteDim === undefined || dataCurrentBytePositions === undefined || dataCurrentBytePositions[0] === undefined || !dataCurrentByte2._setupDone || !QRCodeMask._setupDone || mask.length < width) {
			setTimeout(dataCurrentByte3.reload, 250);
			return false;
		}
		p.resizeCanvas(boxWidth * dataCurrentByteDim.width, boxWidth * dataCurrentByteDim.height);
		dataCurrentByteNoMask = xor(dataCurrentByte, dataCurrentByteMask);
		mainDataBytesNoMask[byteNumberToDataByteNumber(currentByte) - 1] = dataCurrentByteNoMask;
		updateDataReaderHTML();
		p.draw();
	}

	p.draw = function () {
		if (dataCurrentBytePositions === false) return false;
		p.stroke(180);
		for (var i = 0; i < 8; i++) {
			var x = dataCurrentByteDim.width - 1 - dataCurrentBytePositions[i][0];
			var y = dataCurrentByteDim.height - 1 - dataCurrentBytePositions[i][1];
			p.fill(140 + 100 * (1 - dataCurrentByteNoMask[i])); // gray
			p.rect(x * boxWidth, y * boxWidth, boxWidth, boxWidth);
		}
	};
};
var dataCurrentByte3 = new p5(funcDataCurrentByte3, 'DataReaderInput3');
