let numpad = {};
let userCanType = false;
let userString = "";
let numberString = "";
let whichConstant = "";
let level = 0;
let currentDigit = 0;
let pressedKeys = {};
let skipping = false;
const MAX_LEVEL = 1001;
const SKIP_SHOWS = 20;

$(function () { // on document ready
	// set max level of level selector
	$("#startFrom")[0].max = MAX_LEVEL;

	// load options in simon-menu.js
	loadOptions();

	// load sfx
	loadSfx();

	// load volume from local storage in simon-audio.js
	loadVolume();

	// setup io in simon-io.js
	setupIO();

	// setup menu
	showMenu();
});

function play() {
	// activated when play button is pressed
	let startFrom = $("#startFrom")[0].value;
	if (startFrom == "") {
		level = parseInt($("#startFrom")[0].placeholder);
	} else {
		level = parseInt(startFrom);
	}
	if (level > 1000) level = 1000;
	hideMenu();
	startLevel();
}

function startLevel() {
	userString = "";
	if (level > MAX_LEVEL) {
		showMenu();
		return;
	}
	userCanType = false;
	for (numkey in numpad) {
		numpad[numkey].className = "";
	}
	$("#levelNumber").text(level);
	currentDigit = 0;

	// show skip button
	if (level >= 50) {
		$("#skipButton").fadeIn();
	}

	setTimeout(sayNumber, 1000);
}

function sayNumber() {
	if ($("#menu").is(":visible")) return;

	let numkey = numpad[numberString[currentDigit]];
	numkey.className = "active";

	if (!options.optMuteKeys) {
		if (numberString[currentDigit] == ".") {
			playSfx(0);
		} else {
			playSfx(parseInt(numberString[currentDigit]) + 1);
		}
	}

	// calculate new timeout
	let timeout = 400 + 40 * (currentDigit - level + 1);
	if (timeout < 100) timeout = 100;
	timeout = timeout / options.optPrevSpeed;

	setTimeout(hideNumber, timeout, timeout);
}

function hideNumber(timeout) {
	let numkey = numpad[numberString[currentDigit]];
	numkey.className = "";
	currentDigit++;

	if ($("#menu").is(":visible")) return;
	setProgressBar();

	// hide skip button
	if (level - currentDigit <= SKIP_SHOWS) {
		$("#skipButton").fadeOut();
	}

	if (skipping) {
		setTimeout(skipAnimation, 200);
	} else if (currentDigit >= level) {
		startUserInput();
	} else {
		setTimeout(sayNumber, timeout);
	}
}

function skipAnimation() {
	skipping = false;
	playSfx("skip");
	skipProgressBar(2000);
	$("#skipIcon").fadeIn(500, () => {
		$("#skipIcon").fadeOut(500, () => {
			$("#skipIcon").fadeIn(500, () => {
				$("#skipIcon").fadeOut(500, () => {
					setTimeout(() => {
						currentDigit = level - SKIP_SHOWS;
						sayNumber();
					}, 500);
				});
			});
		});
	});
}

function startUserInput() {
	userCanType = true;
	for (numkey in numpad) {
		numpad[numkey].className = "allowed";
	}
}

function nextLevel() {
	userCanType = false;
	for (numkey in numpad) {
		if (numberString[userString.length - 1] != numkey) {
			numpad[numkey].className = "";
		}
	}
	if (localStorage.getItem("NSNC" + whichConstant) < level) {
		localStorage.setItem("NSNC" + whichConstant, level);
		$("#startFrom").val("");
	}
	level += options.optDigPerRound;
	setTimeout(startLevel, 500);
}

function gameOver(key) {
	userCanType = false;
	playSfx("gameover");

	numkey = numpad[key];
	numkey.className = "wrong";


	$("#previewContext").text(numberString.slice(0, 10));
	$("#previewMistake").text("");
	$("#previewCorrection").text("");

	let correctKey = numpad[numberString[userString.length - 1]];
	correctKey.className = "active";
	setTimeout(() => {
		correctKey.className = "";
		setTimeout(() => {
			correctKey.className = "active";
			setTimeout(() => {
				correctKey.className = "";
				setTimeout(() => {
					correctKey.className = "active";
					setTimeout(() => {
						correctKey.className = "";
						setTimeout(() => {
							showMenu();
						}, 200);
					}, 100);
				}, 100);
			}, 100);
		}, 100);
	}, 100);
}
