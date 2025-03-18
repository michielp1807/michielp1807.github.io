// Progress Bar Functions
function setProgressBar() {
	updateBackgroundColor();
	if (userCanType) {
		let percentage = (userString.length / level) * 100;
		$("#progressBarFillPreview").hide();
		$("#progressBarFillUser").width(percentage + "%");
	} else {
		let percentage = (currentDigit / level) * 100;
		$("#progressBarFillPreview").width(percentage + "%");
		$("#progressBarFillPreview").show();
	}
}

function skipProgressBar(time) {
	// activated when skipping animation starts
	let newPercentage = ((level - SKIP_SHOWS) / level) * 100 + "%";
	$("#progressBarFillPreview").animate({
		width: newPercentage
	}, time);
}

function resetProgressBar() {
	// activated in showMenu();
	$("#progressBarFillUser").width("100%");
	$('#progressBarFillPreview').width("0%");
}

// Background Color Functions
let backgroundHue = 228;
function updateBackgroundColor() {
	if (!options.optDisBgColor) {
		backgroundHue = (backgroundHue + 0.5) % 360;
		let hex =  hslToHex(Math.floor(backgroundHue)/360, 0.64, 0.11);

		$('body').css('background-color', hex);
		$('#progressBarFillPreview').css('background-color', hex);

		// https://gordonlesti.com/change-theme-color-via-javascript/
		var metaThemeColor = document.querySelector("meta[name=theme-color]");
	  metaThemeColor.setAttribute("content", hex);
	}
}

function hslToHex(h, s, l){
	// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
	// Assumes h, s, and l are contained in the set [0, 1]
  let r, g, b;

  if(s == 0){
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

	r = Math.floor(r * 255);
	g = Math.floor(g * 255);
	b = Math.floor(b * 255);

	// https://gordonlesti.com/change-theme-color-via-javascript/
	let hex = "#" + (((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
  return hex;
}
