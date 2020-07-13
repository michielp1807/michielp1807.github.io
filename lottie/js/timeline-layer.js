const DROPDOWN_CLOSED = "expand_more";

// Timeline layer which consist of a single row in the timeline editor table
class TL_Layer {
	constructor(index) {
		this.index = index;

		this.row = timelineAreaTable.insertRow(index + 1);
	  this.row.className = "layer";

	  let nameHolder = this.row.insertCell(0);

		// Dropdown button
	  this.dropDownButton = document.createElement("span");
	  nameHolder.appendChild(this.dropDownButton);
	  this.dropDownButton.innerHTML = DROPDOWN_CLOSED;
	  this.dropDownButton.className = "material-icons black-button dropdown-closed";
	  this.dropDownButton.addEventListener("click", (ev) => this.dropDown(ev, index));

		// Layer type icon
		this.icon = document.createElement("span");
	  nameHolder.appendChild(this.icon);
		this.icon.className = "material-icons black-button";
	  //this.icon.addEventListener("click", (ev) => this.changeType(ev, index)); // TODO

		// Layer name field
	  this.name = document.createElement("span");
	  nameHolder.appendChild(this.name);
	  this.name.className = "layer-name";
	  this.name.contentEditable = "true";
	  this.name.addEventListener("focusout", function() {
	    let name = this.innerHTML;
	    name = name.replace(/<\/?[^>]+(>|$)/g, " "); // remove HTML tags
	    name = name.split("&nbsp;").join("").replace(/\s\s+/g, " ").trim(); // fix spaces
	    this.innerHTML = name;
	    jsonData.layers[index].nm = name;
	  });

		// Visibility bar houze
	  this.barHolder = this.row.insertCell(1);
	  this.barHolder.className = "layer-bar-holder";
		this.bar = new TL_Bar(this);
	  this.row.appendChild(this.barHolder);
	}

	update() {
		let layer = jsonData.layers[this.index];
		this.name.innerHTML = layer.nm; // update name
		if (layer.ty >= 0 && layer.ty < BM_LayerTypeNames.length && Math.floor(layer.ty) === layer.ty) {
			this.icon.innerHTML = BM_LayerTypeIcons[layer.ty]; // update icon
			this.icon.title = BM_LayerTypeNames[layer.ty]; // update icon tooltip
		} else {
			this.icon.innerHTML = BM_LayerTypeUnsupportedIcon; // update icon
			this.icon.title = BM_LayerTypeUnsupported; // update icon tooltip
		}
	  this.bar.update(); // update in/out points
	}

	// Open/close drop down of layer, activated by click event of a layer's dropDownButton
	dropDown(ev) {
	  let layer = uiLayers[this.index];
	  if (layer.dropDownButton.classList.contains("dropdown-closed")) {
	    layer.dropDownButton.classList.remove("dropdown-closed");
	    // Open drop down

	    // TODO
	  } else {
	    layer.dropDownButton.classList.add("dropdown-closed");
	    // Close drop down

	    // TODO
	  }
	}
}

// remove the bottom layer UI from the layer table
function removeLayerUI() {
  let layer = uiLayers.pop();
  timelineAreaTable.deleteRow(timelineAreaTable.rows.length - 1);
}
