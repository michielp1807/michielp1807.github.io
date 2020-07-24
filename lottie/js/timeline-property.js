const ANIMATED_ICON = "timer";
const NOT_ANIMATED_ICON = "timer_off";

/**
 * Timeline property
 *
 * A row in the timeline table containing some property with one value
**/
class TL_Property extends TL_LayerChild {
	constructor(parent, name, suffix, label, defaultVal) {
		super(parent.valChildren, parent.tlChildren);

		this.parent = parent;
		this.label = label;
		this.defaultVal = defaultVal;

		this.name.innerHTML = name + ":";

		// Animate button
		this.animateButton = document.createElement("span");
		this.animateButton.className = "material-icons black-button";
		this.animateButton.addEventListener("click", (ev) => this.switchAnimated(ev));
		this.nameHolder.insertBefore(this.animateButton, this.name);

		// Editable value of this property
		this.value1 = new TL_Value(this, this.nameHolder, defaultVal, 0);

		// Suffix
		this.suffix = document.createTextNode(suffix);
		this.nameHolder.appendChild(this.suffix);
	}

	updateAnimateButton(data) {
		if (data == null || !data.a) {
			this.animateButton.innerHTML = NOT_ANIMATED_ICON;
			this.animateButton.classList.remove("button-active");
		} else {
			this.animateButton.innerHTML = ANIMATED_ICON;
			this.animateButton.classList.add("button-active");
		}
	}

	update() {
		let data = this.parent.getPropertyData(this.label);
		this.updateAnimateButton(data);
		if (data == null) {
			this.value1.setValue(this.defaultVal);
		} else if (data.a) {
			this.value1.setValue(data.k[0].s); // TODO: Keyframes
		} else {
			this.value1.setValue(data.k);
		}
	}

	saveValuesToData(value, _index) {
		let data = this.parent.getPropertyData(this.label, { "a": 0, "k": value });
		console.log("Setting " + this.name.innerHTML + " " + value);
		if (data.a) {
			data.k[0].s[0] = value;
		} else {
			data.k = value;
		}
		setCodeValue();
	}

	// Swap animated state (activated by animateButton)
	switchAnimated(ev) {
		// TODO: change animated state of data value
		this.update();
	}
}

/**
 * Multi-dimensional Timeline property
 *
 * A row in the timeline table containing some property with 2 or 3 values
 * 
 * TODO: add third value if 3d
**/
class TL_DimProperty extends TL_Property {
	constructor(parent, name, suffix, data, defaultVal) {
		super(parent, name, suffix, data, defaultVal);

		// Additional values of this property
		let separator1 = document.createTextNode(", ");
		this.nameHolder.insertBefore(separator1, this.suffix);
		this.value2 = new TL_Value(this, this.nameHolder, defaultVal, 1, this.suffix);

	}

	update() {
		let data = this.parent.getPropertyData(this.label);
		this.updateAnimateButton(data);

		if (data == null) {
			this.value1.setValue(this.defaultVal);
			this.value2.setValue(this.defaultVal);
		} else if (data.a) {
			this.value1.setValue(data.k[0].s[0]); // TODO: Keyframes
			this.value2.setValue(data.k[0].s[1]); // TODO: Keyframes
		} else {
			this.value1.setValue(data.k[0]);
			this.value2.setValue(data.k[1]);
		}
	}

	saveValuesToData(value, index) {
		let data = this.parent.getPropertyData(this.label, { "a": 0, "k": [this.defaultVal, this.defaultVal, this.defaultVal] });
		console.log("Setting " + this.name.innerHTML + " " + value + " for " + index);
		if (data.a) {
			data.k[0].s[index] = value;
		} else {
			data.k[index] = value;
		}
		setCodeValue();
	}
}
