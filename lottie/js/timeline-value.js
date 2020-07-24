/**
 * Timeline value
 *
 * A single editable value of a timeline property
 * 
 * (index and before are optional arguments for the constructor)
**/
class TL_Value {
    constructor(property, valueHolder, defaultVal, index, before) {
        this.value = document.createElement("span");
        this.value.className = "layer-value";
        this.value.contentEditable = "true";
        this.value.addEventListener("focusout", function () {
            let value = this.innerHTML;
            value = value.replace(/^(.*?)(?=[-.0-9])/, ""); // remove characters in front first number
            value = parseFloat(value);
            if (isNaN(value)) value = defaultVal;
            this.innerHTML = value;
            property.saveValuesToData(value, index);
        });

        if (before == null) {
            valueHolder.appendChild(this.value);
        } else {
            valueHolder.insertBefore(this.value, before);
        }
    }

    setValue(val) {
        this.value.innerHTML = val;
    }
}