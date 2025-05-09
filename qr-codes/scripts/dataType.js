const boxWidth = canvasWidth / 9;
var dataType = "0000";
var dataTypeMask = "0000";
var dataTypeNoMask = "0000";
var dataTypeName = "Byte Mode";
var dataTypeLegitCode = false;

var funcDataType1 = function (p) {
	p.setup = function () {
		var c = p.createCanvas(boxWidth * 2, boxWidth * 2);
		c.mouseClicked(p.clicked);
		p.draw();
	};

	// Mouse Interaction
	p.clicked = function (m) {
		var x = Math.floor(m.offsetX / boxWidth);
		var y = Math.floor(m.offsetY / boxWidth);
		var i = x + 2 * y;
		//console.log("x: " + x + " y: " + y + " (" + i + ")");

		dataType = xor(dataType, ("000" + 10 ** i).substr(("000" + 10 ** i).length - 4)); // swap data at position around

		p.draw();

		return false;
	}

	p.setDataType = function (data) {
		dataType = data;
		p.draw();
	}

	p.draw = function () {
		p.stroke(200);
		for (var i = 0; i < 4; i++) {
			var x = ((i + 1) % 2);
			var y = 1 - Math.floor(i / 2);
			p.fill((1 - dataType[i]) * 255);
			p.rect(x * boxWidth, y * boxWidth, boxWidth, boxWidth);
		}
		if (DataType3._setupDone) {
			DataType3.draw();
		}
	};
};
var DataType1 = new p5(funcDataType1, 'DataType1');



var funcDataType2 = function (p) {
	p.setup = function () {
		p.createCanvas(boxWidth * 2, boxWidth * 2);
		p.draw();
	};

	p.draw = function () {
		maskToBinaryString(0, 0, 4, function (output, x, y) { // get mask
			dataTypeMask = output;
			p.stroke(200);
			for (var i = 0; i < 4; i++) {
				var x = ((i + 1) % 2);
				var y = 1 - Math.floor(i / 2);
				p.fill(140 + 100 * (1 - dataTypeMask[i])); // gray
				p.rect(x * boxWidth, y * boxWidth, boxWidth, boxWidth);
			}
			if (DataType3._setupDone) DataType3.draw();
		});
	};
};
var dataType2 = new p5(funcDataType2, 'DataType2');



var funcDataType3 = function (p) {
	p.setup = function () {
		p.createCanvas(boxWidth * 2, boxWidth * 2);
		setTimeout(function () { document.getElementById("dataTypeAddon").innerHTML = "<i>Klik op de vakjes in het linker vierkant om ze aan te passen.</i>"; }, 800);
		p.draw();
	};

	p.draw = function () {
		dataTypeNoMask = xor(dataType, dataTypeMask);

		// update data reader
		if (mainDataBytes[0] != undefined) {
			mainDataBytes[0] = dataType + mainDataBytes[0].substr(4, 4);
		} else {
			mainDataBytes[0] = dataType + "0000";
		}
		if (dataCurrentByte1._setupDone) dataCurrentByte1.reload();

		p.stroke(200);
		for (var i = 0; i < 4; i++) {
			var x = ((i + 1) % 2);
			var y = 1 - Math.floor(i / 2);
			p.fill(140 + 100 * (1 - dataTypeNoMask[i])); // gray
			p.rect(x * boxWidth, y * boxWidth, boxWidth, boxWidth);
		}

		// Set HTML text
		var htmlText = "<i>Zonder mask staat er nu <b>" + dataTypeNoMask + "</b>, ";
		switch (dataTypeNoMask) {
			case "0001": // Numeric Mode
				htmlText += "dit is de code voor <b>Numeric Mode</b>.";
				dataTypeName = "Numeric Mode";
				break;
			case "0010": // Alphanumeric Mode
				htmlText += "dit is de code voor <b>Alphanumeric Mode</b>.";
				dataTypeName = "Alphanumeric Mode";
				break;
			case "0100": // Byte Mode
				htmlText += "dit is de code voor <b>Byte Mode</b>.";
				dataTypeName = "Byte Mode";
				break;
			case "1000": // Kanji Mode
				htmlText += "dit is de code voor <b>Kanji Mode</b>.";
				dataTypeName = "Kanji Mode";
				break;
			case "0111": // ECI Mode
				htmlText += "dit is de code voor <b>ECI Mode</b>.";
				dataTypeName = "ECI Mode";
				break;
			default: // other
				htmlText += "dit is geen geldige code.";
				dataTypeName = "geen geldige code";
				break;
		}
		htmlText += "</i>";
		document.getElementById("dataTypeAddon").innerHTML = htmlText;
		updateDataLengthHTML();
		updateDataReaderHTML();
	};
};
var DataType3 = new p5(funcDataType3, 'DataType3');
