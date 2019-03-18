function showMenu() {
	userCanType = false;
	for (let numkey in numpad) {
		numpad[numkey].className = "";
	}
	loadHighscore();
	$("#menu").show();
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
	let highscore = localStorage.getItem(whichConstant);
	if (!highscore) highscore = 0;
	$("#highscoreNumber").text(highscore);
}
