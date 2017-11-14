let pixelSize = 3;
let pixelCollumns = 264;
let pixelRows = 164;
let antCount = 10;
let ants = [];
let pixels = [];

function setup() {
   createCanvas(pixelCollumns*pixelSize, pixelRows*pixelSize);
   frameRate(60);
   colorMode(HSL,255);
   
   for(let i=0; i<pixelCollumns; i++) {
	   pixels[i] = [];
	   for(let j=0; j<pixelCollumns; j++) {
		   pixels[i][j] = false;
	   }
   }
   
   for (let i=0; i<antCount; i++) {
	   ants.push(new ant(i));
   }
   
}

function ant(i) {
	this.x = parseInt(random(pixelCollumns));
	this.y = parseInt(random(pixelRows));
	this.d = parseInt(random(4));
	this.c = [parseInt((255/antCount)*i),200,120];
	this.move = function() {
		switch(this.d) { // move forward
			case 0:
				this.y--;
				if (this.y < 0) this.y = pixelRows - 1;
				break;
			case 1:
				this.x++;
				if (this.x >= pixelCollumns) this.x = 0;
				break;
			case 2:
				this.y++;
				if (this.y >= pixelRows) this.y = 0;
				break;
			case 3:
				this.x--;
				if (this.x < 0) this.x = pixelCollumns - 1;
				break;
		}
		if (pixels[this.x][this.y]) {
			this.d++;
			if (this.d == 4) this.d = 0;
			pixels[this.x][this.y] = false;
			return 255;
		} else {
			this.d--;
			if (this.d == -1) this.d = 3;
			pixels[this.x][this.y] = true;
			return this.c;
		}
	}
}

function draw() {
	strokeWeight(0);

	for (let i=0; i<ants.length; i++) {
		fill(ants[i].move());
		rect(ants[i].x*pixelSize, ants[i].y*pixelSize, pixelSize, pixelSize);
	}
}