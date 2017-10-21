var dataLength = "00000000";
var dataLengthMask = "00000000";
var dataLengthNoMask = "00000000";
var dataLengthBits = 0;

var funcDataLength1 = function(p) {
	p.setup = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*Math.ceil(dataLengthBits/2));
		dataLength =  "0000000000000000".substr(16-dataLengthBits);
		c.mouseClicked(p.clicked);
		p.noLoop();
    p.draw();
	};

	p.reload = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*Math.ceil(dataLengthBits/2));
		dataLength =  "0000000000000000".substr(16-dataLengthBits);
		p.draw();
	}

	// Mouse Interaction
	p.clicked = function(m) {
		let x = Math.floor(m.offsetX/boxWidth);
		let y = Math.floor(m.offsetY/boxWidth);
    let i = x + 2*y;
		if (Math.ceil(dataLengthBits/2) != dataLengthBits/2) i--;
		if (i>=0) {
			//console.log("x: " + x + " y: " + y + " (" + i + ")");
			dataLength = xor(dataLength,("000000000000000"+10**i).substr(("000000000000000"+10**i).length-dataLengthBits)); // swap data at position around
			p.draw();
		}
		return false;
	}

	p.draw = function() {
		p.background(200);
    p.rectMode("corners");
		p.stroke(200);
		p.strokeWeight(1);
		for (let i=0; i<dataLengthBits; i++) {
      let x = ((i+1) % 2);
      let y = Math.ceil(dataLengthBits/2)-1-Math.floor(i/2);
      p.fill((1-dataLength[i])*255);
			p.rect(x*boxWidth, y*boxWidth, x*boxWidth+boxWidth,y*boxWidth+boxWidth);
		}
		if (dataLength3._setupDone) dataLength3.draw();
	};
};
var dataLength1 = new p5(funcDataLength1, 'DataLength1');



var funcDataLength2 = function(p) {
	p.setup = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*Math.ceil(dataLengthBits/2));
		p.noLoop();
		p.draw();
	};

	p.reload = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*Math.ceil(dataLengthBits/2));
		p.draw();
	}

	p.draw = function() {
		maskToBinaryString(0, 2, dataLengthBits, function(output, x, y){ // get mask
			dataLengthMask = output;
			p.background(200);
	    p.rectMode("corners");
			p.stroke(200);
			p.strokeWeight(1);
			for (let i=0; i<dataLengthBits; i++) {
	      let x = ((i+1) % 2);
	      let y = Math.ceil(dataLengthBits/2)-1-Math.floor(i/2);
	      p.fill(140+100*(1-dataLengthMask[i])); // gray
				p.rect(x*boxWidth, y*boxWidth, x*boxWidth+boxWidth,y*boxWidth+boxWidth);
			}
			if (dataLength3._setupDone) dataLength3.draw();
		});
	};
};
var dataLength2 = new p5(funcDataLength2, 'DataLength2');



var funcDataLength3 = function(p) {
	p.setup = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*Math.ceil(dataLengthBits/2));
		p.noLoop();
		setTimeout(function(){p.draw()},400);
		setTimeout(function(){document.getElementById("dataLengthAddon").innerHTML = "<i>Klik op de vakjes in het linker rechthoek om ze aan te passen.</i>";},2000);
	};

	p.reload = function() {
		var c = p.createCanvas(boxWidth*2, boxWidth*Math.ceil(dataLengthBits/2));
		setTimeout(function(){p.draw()},400);
	}

	p.draw = function() {
		dataLengthNoMask = xor(dataLength, dataLengthMask);
		p.background(200);
    p.rectMode("corners");
		p.stroke(200);
		p.strokeWeight(1);
		for (let i=0; i<dataLengthBits; i++) {
			let x = ((i+1) % 2);
			let y = Math.ceil(dataLengthBits/2)-1-Math.floor(i/2);
      p.fill(140+100*(1-dataLengthNoMask[i])); // gray
			p.rect(x*boxWidth,y*boxWidth,x*boxWidth+boxWidth,y*boxWidth+boxWidth);
		}

		// Set HTML text
		document.getElementById("dataLengthAddon").innerHTML = "<i>Zonder mask staat er nu <b>"+dataLengthNoMask+"</b>, dus is jou data <b>"+binaryStringToInt(dataLengthNoMask)+"</b> lang.</i>";;
	};
};
var dataLength3 = new p5(funcDataLength3, 'DataLength3');



function maskToBinaryString(x, y, bits, callback) {
	// !!! x1 and y1 are messured from the bottom right (starting at 0) !!!

	if (typeof mask == "undefined" || typeof mask[0] == "undefined" || typeof mask[0][0] == "undefined" || !QRCode2._setupDone) {
		//console.log("mask not ready yet");
		setTimeout(maskToBinaryString,200,x, y, bits, callback);
		return;
	}

	var output = "";

	while (bits > 0) {
		if (mask[width-1-x][width-1-y][0] === 0 && mask[width-1-x][width-1-y][1] === 0 && mask[width-1-x][width-1-y][2] === 0) {
			output+="1";
			bits--;
		} else if (mask[width-1-x][width-1-y][0] === 255 && mask[width-1-x][width-1-y][1] === 255 && mask[width-1-x][width-1-y][2] === 255) {
			output+="0";
			bits--;
		}

		switch(x % 4) {
			case 0: // go left
				x++;
				break;

			case 1: // go up + right
				y++;
				x--;
				break;

			case 2: // go left
				x++;
				break;

			case 3: // go down + right
				y--;
				x--;
				break;
		}

		if (y >= width) { // move to next collumn
			x+=2;
			y = width-1;
		} else if (y < 0) { // move to next collumn
			x+=2;
			y = 0;
		}
	}

	callback(output, x, y);
}

function updateDataLengthHTML() {
	let pDataLengthBits = dataLengthBits;
	if (version < 10) {
    if (dataTypeName=="Numeric Mode") {
      dataLengthBits = 10;
    } else if (dataTypeName=="Alphanumeric Mode") {
      dataLengthBits = 9;
    } else if (dataTypeName=="Byte Mode") {
      dataLengthBits = 8;
    } else {
      console.log("Incorrect dataTypeName: " + dataTypeName);
    }
  } else {
    if (dataTypeName=="Numeric Mode") {
      dataLengthBits = 12;
    } else if (dataTypeName=="Alphanumeric Mode") {
      dataLengthBits = 11;
    } else if (dataTypeName=="Byte Mode") {
      dataLengthBits = 16;
    } else {
      console.log("Incorrect dataTypeName: " + dataTypeName);
    }
  }
  document.getElementById("dataLengthBits").innerHTML = "<i>Jij hebt <b>Version "+version+"</b> en je gebruikt <b>"+dataTypeName+"</b>, dus is de Character Count Indicator <b>"+dataLengthBits+" bits</b> lang.</i>";
	if (pDataLengthBits != dataLengthBits) {
		setTimeout(function(){
			if (dataLength1._setupDone) dataLength1.reload();
			if (dataLength2._setupDone) dataLength2.reload();
			if (dataLength3._setupDone) dataLength3.reload();
		},1000);
	}
}
