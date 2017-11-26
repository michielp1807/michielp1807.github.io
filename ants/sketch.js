let pixelSize = 3;
let pixelCollumns = 264;
let pixelRows = 164;
let antCount = 10;
let ants = [];
let pixels = [];
let mouseAction = "";

function setup() {
   let canvas = createCanvas(pixelCollumns*pixelSize, pixelRows*pixelSize);
   canvas.parent("p5-sketch");
   canvas.mousePressed(clicked);
   frameRate(60);
   colorMode(HSL,255);

   for(let i=0; i<pixelCollumns; i++) {
	   pixels[i] = [];
	   for(let j=0; j<pixelCollumns; j++) {
		   pixels[i][j] = false;
	   }
   }

   for (let i=0; i<antCount; i++) {
     let x = parseInt(random(pixelCollumns));
     let y = parseInt(random(pixelRows));
     let c = [parseInt((255/antCount)*i),200,120];
     ants.push(new ant(x, y, c));
   }

   background(255);
}

function restart() {
  antCount = document.getElementById("antCount").value;
  ants = [];

  for(let i=0; i<pixelCollumns; i++) {
    pixels[i] = [];
    for(let j=0; j<pixelCollumns; j++) {
      pixels[i][j] = false;
    }
  }

  for (let i=0; i<antCount; i++) {
    let x = parseInt(random(pixelCollumns));
    let y = parseInt(random(pixelRows));
    let c = [parseInt((255/antCount)*i),200,120];
    ants.push(new ant(x, y, c));
  }

  background(255);
}

function clicked(m) {
  let x = Math.floor(m.offsetX/pixelSize);
  let y = Math.floor(m.offsetY/pixelSize);
  //console.log("Clicked (x: "+x+",y: "+y+")");

  switch (mouseAction) {
    case "Add Ants":
      let c = [parseInt(random(255)),200,120];
      ants.push(new ant(x, y, c));
      break;
    case "Draw Blocks":
      fill(0);
      rect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
      pixels[x][y] = true;
      break;
  }
  return false;
}

function setMouseAction() {
  mouseAction = document.getElementById("mouseAction").value;
}

function setFrameRateFromHTML() {
  setFrameRate(parseInt(document.getElementById("frameRate").value));
  console.log("setFrameRate");
}

function ant(_x, _y, _c) {
	this.x = _x;
	this.y = _y;
	this.d = parseInt(random(4));
	this.c = _c;
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
