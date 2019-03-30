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
	// hide skip button
	$("#skipButton").hide();

	// set max level of level selector
	$("#startFrom")[0].max = MAX_LEVEL;

	// load highscore in simon-ui.js
	loadHighscore();

	// load volume from local storage in simon-audio.js
	loadVolume();

	// setup io in simon-io.js
	setupIO();
});

function play() {
	// activated when play button is pressed
	whichConstant = $("#whichConstant")[0].value;
	$.get("numbers/"+whichConstant+".txt", function(data) {
		numberString = data;
		let startFrom = $("#startFrom")[0].value;
		if (startFrom == "") {
			level = parseInt($("#startFrom")[0].placeholder) - 1;
		} else {
			level = parseInt(startFrom) - 1;
		}
		if (level>1000) level = 1000;
		$("#menu").fadeOut(150);
		startLevel();
	});
}

function startLevel() {
	level++;
	userString = "";
	if (level>MAX_LEVEL) {
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

	if (numberString[currentDigit] == ".") {
		playSfx(0);
	} else {
		playSfx(parseInt(numberString[currentDigit])+1);
	}

	// calculate new timeout
	let timeout = 400+40*(currentDigit-level+1);
	if (timeout < 100) timeout = 100;

	setTimeout(hideNumber, timeout, timeout);
}

function hideNumber(timeout) {
	let numkey = numpad[numberString[currentDigit]];
	numkey.className = "";
	currentDigit++;
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
	$("#skipIcon").fadeIn(500, function() {
		$("#skipIcon").fadeOut(500, function() {
			$("#skipIcon").fadeIn(500, function() {
				$("#skipIcon").fadeOut(500, function() {
					setTimeout(function () {
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
		if (numberString[userString.length-1] != numkey) {
			numpad[numkey].className = "";
		}
	}
	if (localStorage.getItem("NSNC" + whichConstant) < level) {
		localStorage.setItem("NSNC" + whichConstant, level);
	}
	setTimeout(startLevel, 500);
}

function gameOver(key) {
	userCanType = false;
	playSfx("gameover");

	numkey = numpad[key];
	numkey.className = "wrong";

	let correctKey = numpad[numberString[userString.length-1]];
	correctKey.className = "active";
	setTimeout(function() {
		correctKey.className = "";
		setTimeout(function() {
			correctKey.className = "active";
			setTimeout(function() {
				correctKey.className = "";
				setTimeout(function() {
					correctKey.className = "active";
					setTimeout(function() {
						correctKey.className = "";
						setTimeout(function() {
							showMenu();
						}, 200);
					}, 100);
				}, 100);
			}, 100);
		}, 100);
	}, 100);
}
