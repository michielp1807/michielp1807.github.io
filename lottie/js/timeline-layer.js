// Timeline layer which consist of a single row in the timeline editor table
class TL_Layer extends TL_LayerChild {
	constructor(index) {
		// Create row
		let row = timelineAreaTable.insertRow(index + 1);
		row.className = "layer";
		let valueArea = row.insertCell(0);	// left side
		let timelineArea = row.insertCell(1); // right side

		super(valueArea, timelineArea);

		this.index = index;

		// Layer type icon
		this.icon = document.createElement("span");
		this.nameHolder.insertBefore(this.icon, this.name);
		this.icon.className = "material-icons black-button";
		//this.icon.addEventListener("click", (ev) => this.changeType(ev, index)); // TODO

		// Make layer name editable
		this.name.contentEditable = "true";
		this.name.addEventListener("focusout", function () {
			let name = this.innerHTML;
			name = name.split("&nbsp;").join("").replace(/\s\s+/g, " ").trim(); // fix spaces
			this.innerHTML = name;
			jsonData.layers[index].nm = name;
			setCodeValue();
		});
		this.name.addEventListener("keypress", function (ev) {
			if (ev.which === 13) { // Prevent pressing enter in name
				ev.preventDefault();
				this.blur();
			}
		});

		// Visibility bar holder (top part of timeline area)
		this.bar = new TL_Bar(this);

		// Add layer transform as child
		this.transform = new TL_LayerTransform(this.valChildren, this.tlChildren, jsonData.layers[index].ks);

	}

	update() {
		let layer = jsonData.layers[this.index];
		if (layer.ddd) {
			showMessage("3D layers are currently not supported by the timeline editor (and also not by Telegram)");
		}
		this.name.innerHTML = layer.nm; // update name
		if (LAYER_TYPES[layer.ty] != null) {
			this.icon.innerHTML = LAYER_TYPES[layer.ty].layerIcon; // update icon
			this.icon.title = LAYER_TYPES[layer.ty].layerName; // update icon tooltip
		} else {
			this.icon.innerHTML = BM_LayerTypeUnsupportedIcon; // update icon
			this.icon.title = BM_LayerTypeUnsupported; // update icon tooltip
		}
		this.bar.update(); // update in/out points
		this.transform.update(); // update layer transform
	}
}
