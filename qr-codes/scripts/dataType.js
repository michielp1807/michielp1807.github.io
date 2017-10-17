var boxWidth = Math.floor(canvasWidth / 9)
var dataType = "1111";
var dataTypeMask = "1111";
var dataTypeNoMask = "1111";

var funcDataType1 = function(p) {
	p.setup = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*2);
		c.mousePressed(p.clicked);
		p.noLoop();
    p.draw();
	};

	// Mouse Interaction
	p.clicked = function(m) {
		var x = Math.floor(m.offsetX/boxWidth);
		var y = Math.floor(m.offsetY/boxWidth);
    var i = x + 2*y;
    console.log("x: " + x + " y: " + y + " (" + i + ")");

    dataType = xor(dataType,("000"+10**i).substr(("000"+10**i).length-4)); // swap data at position around

		p.draw();
	}

	p.draw = function() {
		p.background(255);
		p.stroke(200);
		p.strokeWeight(1);
		for (var i=0; i<4; i++) {
      var x = ((i+1) % 2);
      var y = 1-Math.floor(i/2);
      p.fill(dataType[i]*255);
			p.rect(x*boxWidth,y*boxWidth,x*boxWidth+boxWidth,y*boxWidth+boxWidth);
		}
		DataType3.draw();
	};
};
var DataType1 = new p5(funcDataType1, 'DataType1');



var funcDataType2 = function(p) {
	p.setup = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*2);
		p.noLoop();
    p.draw();
	};

	p.draw = function() {
		dataTypeMask = "" + (1*(mask[width-1][width-1][0] == 255)) + (1*(mask[width-2][width-1][0] == 255)) + (1*(mask[width-1][width-2][0] == 255)) + (1*(mask[width-2][width-2][0] == 255));
		p.background(255);
		p.stroke(200);
		p.strokeWeight(1);
		for (var i=0; i<4; i++) {
      var x = ((i+1) % 2);
      var y = 1-Math.floor(i/2);
      p.fill(140+100*dataTypeMask[i]); // gray
			p.rect(x*boxWidth,y*boxWidth,x*boxWidth+boxWidth,y*boxWidth+boxWidth);
		}
		DataType3.draw();
	};
};
var DataType2 = new p5(funcDataType2, 'DataType2');



var funcDataType3 = function(p) {
	p.setup = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*2);
		p.noLoop();
		setTimeout(function(){document.getElementById("dataTypeAddon").innerHTML = "<i>Klik op de vakjes in het linker vierkant om ze aan te passen.</i>";},800);
	};

	p.draw = function() {
		dataTypeNoMask = xor(dataType, dataTypeMask);
		p.background(255);
		p.stroke(200);
		p.strokeWeight(1);
		for (var i=0; i<4; i++) {
      var x = ((i+1) % 2);
      var y = 1-Math.floor(i/2);
      p.fill(140+100*(1-dataTypeNoMask[i])); // gray
			p.rect(x*boxWidth,y*boxWidth,x*boxWidth+boxWidth,y*boxWidth+boxWidth);
		}

		// Set HTML text
		var htmlText = "<i>Zonder mask staat er nu <b>"+dataTypeNoMask+"</b>, ";
		switch(dataTypeNoMask) {
			case "0001": // Numeric Mode
				htmlText += "dit is de code voor <b>Numeric Mode</b>.";
				break;
			case "0010": // Alphanumeric Mode
				htmlText += "dit is de code voor <b>Alphanumeric Mode</b>.";
				break;
			case "0100": // Byte Mode
				htmlText += "dit is de code voor <b>Byte Mode</b>.";
				break;
			case "1000": // Kanji Mode
				htmlText += "dit is de code voor <b>Kanji Mode</b>.";
				break;
			case "0111": // ECI Mode
				htmlText += "dit is de code voor <b>ECI Mode</b>.";
				break;
			default: // other
				htmlText += "dit is geen geldige code.";
				break;
		}
		htmlText += "</i>";
		document.getElementById("dataTypeAddon").innerHTML = htmlText;
	};
};
var DataType3 = new p5(funcDataType3, 'DataType3');
