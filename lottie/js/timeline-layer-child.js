const DROPDOWN_CLOSED = "expand_more";

class TL_LayerChild {
	constructor(valHolder, tlHolder) {
		// Name holder (top part of value area)
		this.nameHolder = document.createElement("div");
		this.nameHolder.className = "layer-holder";
		valHolder.appendChild(this.nameHolder);

		// Dropdown button
		this.dropDownButton = document.createElement("span");
		this.nameHolder.appendChild(this.dropDownButton);
		this.dropDownButton.innerHTML = DROPDOWN_CLOSED;
		this.dropDownButton.className = "material-icons black-button dropdown-closed";
		this.dropDownButton.addEventListener("click", (ev) => this.dropDown(ev));

		// Layer name field (left)
		this.name = document.createElement("span");
		this.nameHolder.appendChild(this.name);
		this.name.className = "layer-name";

		// Timeline bar holder (right)
		this.barHolder = document.createElement("div");
		tlHolder.appendChild(this.barHolder);
		this.barHolder.className = "layer-holder";

		// Dropdown children (left)
		this.valChildren = document.createElement("div");
		this.valChildren.className = "layer-child-value";
		this.valChildren.style.display = "none"; // Close drop down
		valHolder.appendChild(this.valChildren);

		// Dropdown children (right)
		this.tlChildren = document.createElement("div");
		this.tlChildren.style.display = "none"; // Close drop down
		tlHolder.appendChild(this.tlChildren);
	}

	// Open/close drop down of layer, activated by click event of a layer's dropDownButton
	dropDown(ev) {
		if (this.dropDownButton.classList.contains("dropdown-closed")) {
			// Open drop down
			this.dropDownButton.classList.remove("dropdown-closed");
			this.valChildren.style.display = "block";
			this.tlChildren.style.display = "block";
		} else {
			// Close drop down
			this.dropDownButton.classList.add("dropdown-closed");
			this.valChildren.style.display = "none";
			this.tlChildren.style.display = "none";
		}
	}
}
