var funcVersionInfo = function(p) {
	p.setup = function() {
		var c = p.createCanvas(canvasWidth+1, canvasWidth/2+1);
		c.mouseClicked(p.clicked);
		p.noLoop();
		p.generateVersionInfo();
		document.getElementById("versionInfoNumberAddon").innerHTML = "<i>Klik op de vakjes aan de rechter kant om ze aan te passen.</i>";
	};

	p.generateVersionInfo = function() {
		for (var i=0; i<6; i++) {
			versionInfo[i] = [];
			for (var j=0; j<3; j++) {
				if (i<4) versionInfo[i][j]=[240,240,240];
				else if (i<5) versionInfo[i][j]=[0,0,0];
				else versionInfo[i][j]=[255,255,255];
			}
		}
		p.reCalculate(1);
	};

	// Mouse Interaction
	p.clicked = function(m) {
		var x = Math.floor(m.offsetX/(canvasWidth/6));
		var y = Math.floor(m.offsetY/(canvasWidth/6));
		if (x>3 && y>=0 && x<6 && y<3) {
			//console.log("x: " + x + " y: " + y);
			if (m.which == 1) {
				if (versionInfo[x][y][0]===0) {
					versionInfo[x][y] = [255,255,255];
				} else {
					versionInfo[x][y] = [0,0,0];
				}
			}
			var vNumber = 0;
			for (var i=0; i<2; i++) {
				for (var j=0; j<3; j++) {
					if (versionInfo[4+i][j][0] === 0) {
						vNumber+=Math.pow(2,j+i*3);
					}
				}
			}
			if (vNumber>0 && vNumber<=13) {
				versionNumberElement.value=""+vNumber; // set version number
				QRCode1.reload();
			}
			p.reCalculate(vNumber);
		}
		return false;
	}

	p.reCalculate = function(vNumber) {
		// Calculate Error Correction
		var vNumberB = (vNumber >>> 0).toString(2); // Convert to binary
		vNumberB="000000".substr(vNumberB.length)+vNumberB // Make string 6 long
		//console.log(vNumber + ": " + vNumberB);

		var vErrCor = vNumberB + generateErrCor("1111100100101",vNumberB,18);

		// Draw Error Correction
		for (var i=0; i<6; i++) {
			for (var j=0; j<3; j++) {
				if (vErrCor[17-(j+i*3)] === "0") {
					if (i<4) versionInfo[i][j] = [230,230,230]; //light gray
					else versionInfo[i][j] = [255,255,255]; // white
				} else {
					if (i<4) versionInfo[i][j] = [160,160,160]; // dark gray
					else versionInfo[i][j] = [0,0,0]; // black
				}
			}
		}

		// Change HTML Text
		document.getElementById("versionInfoNumber").innerHTML = "Version " + vNumber;
		if (vNumber < 7) {
			document.getElementById("versionInfoNumberAddon").innerHTML = "<i>Deze staat echter niet op de QR-Code. (pas vanaf Version 7 zie je de Version Info op de QR-Code)</i>";
		} else if (vNumber > 40) {
			document.getElementById("versionInfoNumberAddon").innerHTML = "<i>Deze version bestaat echter niet. (Version 40 is de grootste QR-Code)</i>";
		} else if (vNumber > 13) {
			document.getElementById("versionInfoNumberAddon").innerHTML = "<i>Onze site werkt alleen met Versions 1 t/m 13, hogere versies zijn zo groot dat het te onoverzichtelijk wordt.</i>";
		} else {
			document.getElementById("versionInfoNumberAddon").innerHTML = "";
		}
		p.draw();
	}

	p.draw = function() {
		var tempRectWidth = canvasWidth/6;
		p.background(0);
		p.stroke(200);
		p.strokeWeight(1);
		for (var i=0; i<6; i++) {
			for (var j=0; j<3; j++) {
				p.fill(versionInfo[i][j]);
				p.rect(i*tempRectWidth,j*tempRectWidth,i*tempRectWidth+tempRectWidth,j*tempRectWidth+tempRectWidth);
			}
		}
	};
};
var VersionInfo = new p5(funcVersionInfo, 'VersionInfo');
