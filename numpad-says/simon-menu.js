function showMenu() {
	userCanType = false;
	resetProgressBar();
	for (let numkey in numpad) {
		numpad[numkey].className = "";
	}
	selectConstant();
	$("#level").animate({ opacity: 0.3 }, 150);
	$("#menu").fadeIn(150);
}

function hideMenu() {
	$("#level").animate({ opacity: 1 }, 150);
	$("#menu").fadeOut(150);
}

// Main menu functions:
function startFromUpdate() {
	// activated by the start from level control
	let v = parseInt($("#startFrom")[0].value);
	if (v > MAX_LEVEL)
		$("#startFrom")[0].value = MAX_LEVEL;
	if (v < 1)
		$("#startFrom")[0].value = 1;
}

function selectConstant() {
	if ($("#whichConstant")[0].value != whichConstant) {
		whichConstant = $("#whichConstant")[0].value;
		userString = "";
		$.get("numbers/" + whichConstant + ".txt", data => {
			numberString = data;
			selectConstant();
		});
		return;
	}

	// update highscore
	let highscore = localStorage.getItem("NSNC" + whichConstant);
	if (!highscore) highscore = 0;
	$("#highscoreNumber").text(highscore);

	// update start from place holder
	let startFromLevel = parseInt(highscore) + options.optDigPerRound;
	startFromLevel = Math.min(startFromLevel, MAX_LEVEL);
	startFromLevel = Math.max(startFromLevel, 1);
	$("#startFrom")[0].placeholder = startFromLevel;

	// update preview
	if (userString == "") {
		$("#previewContext").text(numberString.slice(0, 12));
		$("#previewMistake").text("");
		$("#previewCorrection").text("");
	} else {
		$("#previewContext").text((userString.length > 10 ? "..." : "") + userString.slice(-10, -1));
		$("#previewMistake").text(userString[userString.length - 1]);
		$("#previewCorrection").text(numberString[userString.length - 1]);
	}
}

// Option menu functions:
function showOptionsMenu() {
	$("#optionsMenu").fadeIn(150);
	$("#mainMenu").fadeOut(150);
}

function hideOptionsMenu() {
	// reload for potential startFrom update
	selectConstant();

	$("#optionsMenu").fadeOut(150);
	$("#mainMenu").fadeIn(150);
}

// global options object containing all settings, with default values:
let options = {
	'optMuteKeys': 0,
	'optDisBgColor': 0,
	'optDigPerRound': 1,
	'optPrevSpeed': 1
};

function loadOptions() {
	tempOptions = localStorage.getItem("NSNCoptions");
	if (tempOptions)
		options = JSON.parse(tempOptions);
	$("#optMuteKeys").prop('checked', options.optMuteKeys);
	$("#optDisBgColor").prop('checked', options.optDisBgColor);
	$("#optDigPerRound").val(options.optDigPerRound);
	$("#optPrevSpeed").val(options.optPrevSpeed);
}

function saveOptions() {
	options.optMuteKeys = 0 + $("#optMuteKeys").is(":checked");
	options.optDisBgColor = 0 + $("#optDisBgColor").is(":checked");
	options.optDigPerRound = parseInt($("#optDigPerRound").val());
	if (options.optDigPerRound > 99) {
		options.optDigPerRound = 99;
	} else if (options.optDigPerRound < 1) {
		options.optDigPerRound = 1;
	}
	if (isNaN(options.optDigPerRound)) {
		options.optDigPerRound = 1;
	} else {
		$("#optDigPerRound").val(options.optDigPerRound);
	}
	options.optPrevSpeed = parseFloat($("#optPrevSpeed").val());
	localStorage.setItem("NSNCoptions", JSON.stringify(options));
}
