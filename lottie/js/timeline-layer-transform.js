class TL_LayerTransform extends TL_LayerChild {
	constructor(valHolder, tlHolder, data) {
		super(valHolder, tlHolder);
		this.name.innerHTML = "Transform"
		this.data = data;

		// Create transform value UIs (anchor position, position, scale, rotation, opacity)
		this.children = [];
		this.children.push(new TL_DimProperty(this, "Anchor position", "", "a", 0, true));
		this.children.push(new TL_DimProperty(this, "Position", "", "p", 0, true));
		this.children.push(new TL_DimProperty(this, "Scale", "%", "s", 100, true));
		this.children.push(new TL_Property(this, "Rotation", "°", "r", 0, false));
		this.children.push(new TL_Property(this, "Opacity", "%", "o", 100, false));

		// For shape transforms there are also scew values (maybe another class that extends this one for shape transforms?)
	}

	// Get json data for property, set valueIfNull to create new if undefined
	getPropertyData(propertyLabel, valueIfNull) {
		if (valueIfNull != null && this.data[propertyLabel] == null) {
			this.data[propertyLabel] = valueIfNull;
		}
		return this.data[propertyLabel];
	}

	update() {
		for (let c in this.children) {
			this.children[c].update();
		}
	}
}
