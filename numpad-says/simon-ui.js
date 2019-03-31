// Menu Functions
function showMenu() {
	userCanType = false;
	resetProgressBar();
	for (let numkey in numpad) {
		numpad[numkey].className = "";
	}
	loadHighscore();
	$("#menu").fadeIn(150);
}

function startFromUpdate() {
	// activated by the start from level control
	let v = parseInt($("#startFrom")[0].value);
	if (v > MAX_LEVEL) $("#startFrom")[0].value = MAX_LEVEL;
	if (v < 1) $("#startFrom")[0].value = 1;
}

function loadHighscore() {
	// update highscore
	whichConstant = $("#whichConstant")[0].value;
	let highscore = localStorage.getItem("NSNC" + whichConstant);
	if (!highscore) highscore = 1;
	$("#highscoreNumber").text(highscore);
	$("#startFrom")[0].placeholder = highscore;
}

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
	backgroundHue = (backgroundHue + 0.5) % 360;
	$('body').css('background-color', 'hsl('+backgroundHue+', 64%, 11%)');
	$('#progressBarFillPreview').css('background-color',
			'hsl('+backgroundHue+', 64%, 11%)');
	$("#menu").css('background-color', 'hsl('+backgroundHue+', 64%, 11%, 0.75)');

	// https://gordonlesti.com/change-theme-color-via-javascript/
	var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute("content", hslToHex(backgroundHue/360, 0.64, 0.11));
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
