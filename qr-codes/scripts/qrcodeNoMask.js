var funcQRCode3 = function (p) {
	p.setup = function () {
		p.createCanvas(canvasWidth, canvasWidth);
	};

	p.draw = function () {
		if (!mask || !mask[0] || !mask[0][0]) return false;
		p.stroke(200);
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < width; j++) {
				if (qrCodeOverlay[i][j]) {
					p.fill(qrCodeOverlay[i][j]); // draw from overlay
				} else {
					if (mask[i][j][0] != 0 && mask[i][j][1] != 0 && mask[i][j][2] != 0) {
						if (qrCode[i][j]) p.fill(0); // draw from qr code
						else p.fill(255);
					} else {
						if (qrCode[i][j]) p.fill(255); // draw from qr code inverted
						else p.fill(0);
					}
				}
				p.rect(i * rectWidth, j * rectWidth, rectWidth, rectWidth);
			}
		}
	};
};
var QRCode3 = new p5(funcQRCode3, 'QRCode3');
