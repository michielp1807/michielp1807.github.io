var currentByte = 1;

var funcQRCodeBytePosition = function(p) {
	p.setup = function() {
		p.createCanvas(canvasWidth, canvasWidth);
		p.noLoop();
    setTimeout(QRCodeBytePosition.draw, 1000);
	};

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
          p.fill(220);
        }
				p.rect(i*rectWidth,j*rectWidth,i*rectWidth+rectWidth,j*rectWidth+rectWidth);
			}
		}

    var positionsOfByte = getBitPositionsOfByte(currentByte);
    if (positionsOfByte != false) {
      p.fill(249,193,255);
      p.stroke(0);
      for (var i=0; i<positionsOfByte.length; i++) {
        p.rect(width*rectWidth-positionsOfByte[i][0]*rectWidth,width*rectWidth-positionsOfByte[i][1]*rectWidth,width*rectWidth-(positionsOfByte[i][0]*rectWidth+rectWidth),width*rectWidth-(positionsOfByte[i][1]*rectWidth+rectWidth));
      }
    } else {
      setTimeout(QRCodeBytePosition.draw, 500);
    }
	};
};
var QRCodeBytePosition = new p5(funcQRCodeBytePosition, 'QRCodeBytePosition');


function updateDataReaderHTML() {
	document.getElementById("QR-Code-Reader-Byte-BinCode").innerHTML = dataCurrentByteNoMask;
	var rawDataString = "";
	var rawDataStringWithSpaces = "";
	for (var i=0; i<deepestTouchedByte; i++) {
		rawDataString += (mainDataBytesNoMask[i] || "00000000");
		rawDataStringWithSpaces += (mainDataBytesNoMask[i] || "00000000") + " ";
	}
	document.getElementById("DataReaderRawDataTextArea").innerHTML = rawDataStringWithSpaces;

	var bitAnalyserHTML = "";
	if (deepestTouchedByte <= 0) {
		document.getElementById("DataReaderTextAreaEx").innerHTML = "Hier komt alle data van de bytes te staan die je hebt ingevoerd:";
		bitAnalyserHTML = "<i>Vul eerst een byte in...</i>";
	} else if (deepestTouchedByte >= 1) {
		document.getElementById("DataReaderTextAreaEx").innerHTML = "Hier zie je alle data van de bytes die je hebt ingevoerd:";
		bitAnalyserHTML += "<b>"+rawDataString.substr(0,4)+"</b>: Mode Indicator, jij hebt hier <b>"+dataTypeName+"</b>, zie stap 4.";

		if (dataTypeName == "ECI Mode") {
			bitAnalyserHTML += "<br><br>ECI Mode kan veel verschillende soorten data bevatten, maar omdat deze niet zo vaak voorkomt hebben we besloten deze hier niet verder te analyseren.";
		} else if (dataTypeName != "geen geldige code" && deepestTouchedByte >= Math.ceil((dataLengthBits + 4) / 8)) {
			bitAnalyserHTML += "<br><b>"+rawDataString.substr(4,dataLengthBits)+"</b>: Character Count Indicator, jij hebt hier lengte <b>"+binaryStringToInt(rawDataString.substr(4,dataLengthBits))+"</b>, zie stap 5.";
			if (dataTypeName == "Kanji Mode") {
				bitAnalyserHTML += "<br><br>De rest van de data bestaat uit codes die corresponderen met Japanse Kanji teken, deze zullen we hier niet verder analyseren.";
			} else {
				if (dataTypeName == "Byte Mode") {
					for (var i=4+dataLengthBits; i<deepestTouchedByte*8-8; i+=8) {
						bitAnalyserHTML += "<br><b>"+rawDataString.substr(i,8)+"</b>: ASCII-code voor: <b>"+String.fromCharCode("0b"+rawDataString.substr(i,8))+"</b>";
					}
				}
			}
		}
	}


	document.getElementById("DataReaderBitAnalyser").innerHTML = bitAnalyserHTML;
}


/*

	ALL BYTE NUMBERS IN THE CODE ARE COUNTED IN ORDER OF THE POSITION WITHOUT TAKING THE DATABLOCKS INTO ACCOUNT
	ALL BYTE NUMBERS IN THE INTERFACE ARE IN ORDER OF THE DATA WITH TAKING THE DATABLOCKS INTO ACCOUNT

*/

function getBitPositionsOfByte(byte) {
	// !!! x1 and y1 are messured from the bottom right (starting at 0) !!!

  if (typeof mask == "undefined" || typeof mask[0] == "undefined" || typeof mask[0][0] == "undefined" || !QRCode2._setupDone || mask.length < width) {
    return false;
  }

  var x = 0;
  var y = 0;

  if (byte > 1) {
    var previousByteLastBitPosition = getBitPositionsOfByte(byte-1)[7];
    if (previousByteLastBitPosition === false) return false;
    x = previousByteLastBitPosition[0];
    y = previousByteLastBitPosition[1];
  }

  var output = [];

  var bits = 8;
	while (bits > 0) {
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

    if (byte === 1 && bits === 8) {
      x = 0;
      y = 0;
    }

    if ((mask[width-1-x][width-1-y][0] === 0 && mask[width-1-x][width-1-y][1] === 0 && mask[width-1-x][width-1-y][2] === 0)||(mask[width-1-x][width-1-y][0] === 255 && mask[width-1-x][width-1-y][1] === 255 && mask[width-1-x][width-1-y][2] === 255)) {
			output.push([x,y]);
			bits--;
		}
	}

  return output;
}


function dataBlockOfByte(byte) {
	// returns in which datablock the byte is, datablocks counted from 1
	if (byte > (totalBytes - group2DataBlocks)) { // byte is in last byte of a datablock in group 2
		var dataBlockOfGroup2 = (byte - (totalBytes-group2DataBlocks)) % group2DataBlocks; // in which datablock from group 2 the byte is, counted from 1
		if (dataBlockOfGroup2 === 0) dataBlockOfGroup2 = group2DataBlocks; // instead of returning 0 return the last datablock number of group 2
		return (totalDataBlocks - group2DataBlocks) + dataBlockOfGroup2;
	} else {
		if (byte % totalDataBlocks != 0) {
			return byte % totalDataBlocks;
		} else {
			return totalDataBlocks; // instead of returning 0 return the last datablock number
		}
	}
}


function byteNumberInBlock(byte) {
	// returns which byte of the datablock the byte is, counted from 1
	return Math.ceil(byte/totalDataBlocks);
}


function byteNumberToDataByteNumber(byte) {
	// returns the data byte number
	if (dataBlockOfByte(byte) <= (totalDataBlocks - group2DataBlocks + 1)) {
		return byteNumberInBlock(byte) + (dataBlockOfByte(byte)-1) * dataBlockLength;
	} else {
		return byteNumberInBlock(byte) + (dataBlockOfByte(byte)-1) * dataBlockLength + dataBlockOfByte(byte) - (totalDataBlocks - group2DataBlocks + 1);
	}
}


function dataByteNumberToByteNumber(dataByte) { // Could be programmed in a better way probably
	// returns the data byte number
	for (var i=1; i<=totalBytes; i++) {
		if (byteNumberToDataByteNumber(i) == dataByte) return i;
	}
}


function changeBytes(dir) {
  dir = parseInt(dir);
	switch(dir) {
		case 0:
			currentByte = dataByteNumberToByteNumber(parseInt(document.getElementById("QR-Code-Reader-Slider").value));
			break;
		case 1:
			currentByte = dataByteNumberToByteNumber(byteNumberToDataByteNumber(currentByte) + 1);
			break;
		case -1:
			currentByte = dataByteNumberToByteNumber(byteNumberToDataByteNumber(currentByte) - 1);
			break;
	}

  if (currentByte < 1) currentByte = 1; // Make sure currentByte is within acceptable region
  if (currentByte > totalBytes) currentByte = totalBytes;

  if (currentByte === 1) { // Deactivate Previous Byte Button
     document.getElementById("QR-Code-Reader-PreviousByte").disabled = true;
		 document.getElementById("QR-Code-Reader-PreviousByte").title = "Dit is de eerste byte!";
  } else {
    document.getElementById("QR-Code-Reader-PreviousByte").disabled = false;
		document.getElementById("QR-Code-Reader-PreviousByte").title = "Ga 1 byte terug...";
  }
  if (currentByte === totalBytes) { // Deactivate Next Byte Button
     document.getElementById("QR-Code-Reader-NextByte").disabled = true;
		 document.getElementById("QR-Code-Reader-NextByte").title = "Dit is de laatste byte van de data! (de rest is errorcorrectie)";
  } else {
    document.getElementById("QR-Code-Reader-NextByte").disabled = false;
		document.getElementById("QR-Code-Reader-NextByte").title = "Ga 1 byte vooruit...";
  }


  document.getElementById("QR-Code-Reader-ByteNumber").innerHTML = "<b><i>Byte " + byteNumberToDataByteNumber(currentByte) + "/" + totalBytes + "</i></b>";
  document.getElementById("QR-Code-Reader-Slider").value = byteNumberToDataByteNumber(currentByte);


	document.getElementById("QR-Code-Reader-Byte-Position").innerHTML = "Dit is byte nummer " +byteNumberInBlock(currentByte)+ " van datablock " +dataBlockOfByte(currentByte);


  if(QRCodeBytePosition._setupDone) QRCodeBytePosition.draw();
	if(dataCurrentByte1._setupDone) dataCurrentByte1.reload();
}


function maskToBinaryString(x, y, bits, callback) {
	// !!! x1 and y1 are messured from the bottom right (starting at 0) !!!

	if (typeof mask == "undefined" || typeof mask[0] == "undefined" || typeof mask[0][0] == "undefined" || !QRCode2._setupDone || mask.length < width) {
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
