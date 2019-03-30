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
}
