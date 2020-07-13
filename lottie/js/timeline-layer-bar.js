// Visibility bar for timeline layers, used to configure ip and op values
class TL_Bar {
	constructor(tlLayer) {
		this.tlLayer = tlLayer; // The timeline layer of this bar

		this.bar = document.createElement("div");
	  this.bar.className = "layer-bar";
	  tlLayer.barHolder.appendChild(this.bar);

	  this.barIP = document.createElement("div");
	  this.barIP.className = "layer-bar-end";
	  this.barIP.addEventListener("mousedown", (ev) => startDrag(ev, (ev) => this.ipOpMove(ev, "ip")));
	  tlLayer.barHolder.appendChild(this.barIP);

	  this.barOP = document.createElement("div");
	  this.barOP.className = "layer-bar-end";
	  this.barOP.addEventListener("mousedown", (ev) => startDrag(ev, (ev) => this.ipOpMove(ev, "op")));
	  tlLayer.barHolder.appendChild(this.barOP);
	}

	update() {
		let layer = jsonData.layers[this.tlLayer.index];

		// set in/out points
		let animFrames = jsonData.op - jsonData.ip;
		let ipPosition = ((layer.ip - jsonData.ip) / animFrames * 100) + "%";
		let opPosition = ((jsonData.op - layer.op) / animFrames * 100) + "%";

		this.bar.style.left = ipPosition;
		this.bar.style.right = opPosition;
		this.barIP.style.left = ipPosition;
		this.barOP.style.right = opPosition;
	}

	ipOpMove(ev, ipOrOp) {
	  let frameLength = frameBlocks.children[0].offsetWidth;
	  let layer = jsonData.layers[this.tlLayer.index];

	  let offsetX = ev.clientX - dragStartX;
	  if (offsetX >= frameLength || offsetX <= -frameLength) {
	    let ipOpOffset = Math.floor(offsetX/frameLength);
	    if (ipOrOp == "ip") {
	      ipOpOffset = Math.min(ipOpOffset, layer.op - layer.ip - 1); // ip upperbound
	      ipOpOffset = Math.max(ipOpOffset, jsonData.ip - layer.ip); // ip underbound
	    } else {
	      ipOpOffset = Math.max(ipOpOffset, layer.ip - layer.op + 1); // op underbound
	      ipOpOffset = Math.min(ipOpOffset, jsonData.op - layer.op); // op upperbound
	    }
	    layer[ipOrOp] += ipOpOffset;
			this.tlLayer.update();
	    dragStartX += ipOpOffset * frameLength;
	  }
	}
}
