let numpad = {};
let userCanType = false;
let userString = "";
let numberString = "";
let whichConstant = "";
let level = 0;
let currentDigit = 0;
let pressedKeys = {};
const maxLevel = 1001;

$(function () { // on document ready
	// set max level of level selector
	$("#startFrom")[0].max = maxLevel;

	// load volume from local storage
	loadVolume();

	// set up numpad
	let tds = $("td");
	for (let i=0; i<tds.length; i++) {
		tds[i].onmousedown = function() {
      onUserInput(this.innerHTML);
    };
		numpad[tds[i].innerHTML] = tds[i];
	}

	// keyboard events
	$(this).keydown(function(e) {
		if (e.keyCode == 13) {
			if ($("#menu").is(":visible")) play();
			return;
		} else if (e.keyCode == 27 || e.keyCode == 8) {
			// on esc or backspace go to menu
			userCanType = false;
			for (let numkey in numpad) {
				numpad[numkey].className = "";
			}
			$("#menu").show();
			return;
		}
		let numkey = numpad[e.key];
		if (numkey != undefined && userCanType && pressedKeys[e.which] != true) {
			pressedKeys[e.which] = true;
			numkey.className = "active";
			onUserInput(e.key);
		}
	});
	$(this).keyup(function(e) {
		let numkey = numpad[e.key];
		if (numkey != undefined) {
			pressedKeys[e.which] = false;
			numkey.className = userCanType ? "allowed" : "";
		}
	});
});

function play() {
	// activated when play button is pressed
	whichConstant = $("#whichConstant")[0].value;
	$.get("numbers/"+whichConstant+".txt", function(data) {
		numberString = data;
		level = parseInt($("#startFrom")[0].value) - 1;
		if (isNaN(level)) level = 0;
		if (level>1000) level = 1000;
		$("#menu").hide();
		startLevel();
	});
}

function startLevel() {
	level++;
	userString = "";
	userCanType = false;
	for (numkey in numpad) {
		numpad[numkey].className = "";
	}
	if (level>maxLevel) {
		$("#menu").show();
		return;
	}
	$("#levelNumber").text(level);
	currentDigit = 0;
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
	let timeout = 400+40*(currentDigit-level+1);
	if (timeout<100) timeout = 100;
	setTimeout(hideNumber, timeout, timeout);
}

function hideNumber(timeout) {
	let numkey = numpad[numberString[currentDigit]];
	numkey.className = "";
	currentDigit++;
	if (currentDigit >= level) {
		startUserInput();
	} else {
		setTimeout(sayNumber, timeout);
	}
}

function startUserInput() {
	userCanType = true;
	for (numkey in numpad) {
		numpad[numkey].className = "allowed";
	}
}

function onUserInput(key) {
	if (userCanType) {
		userString += key;
		if (userString == numberString.substring(0, userString.length)) {
			if (key == ".") {
				playSfx(0);
			} else {
				playSfx(parseInt(key)+1);
			}
			if (userString == numberString.substring(0, level)) nextLevel();
		} else {
			gameOver();
		}
	}
}

function nextLevel() {
	userCanType = false;
	for (numkey in numpad) {
		if (numberString[userString.length-1] != numkey) {
			numpad[numkey].className = "";
		}
	}
	setTimeout(startLevel, 500);
}

function gameOver() {
	userCanType = false;
	playSfx("gameover");
	for (numkey in numpad) {
		numpad[numkey].className = "";
	}
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
							$("#menu").show();
						}, 200);
					}, 100);
				}, 100);
			}, 100);
		}, 100);
	}, 100);
}

function startFromUpdate() {
	// activated by the start from level controll
	let v = parseInt($("#startFrom")[0].value);
	if (v > maxLevel) $("#startFrom")[0].value = maxLevel;
	if (v < 1) $("#startFrom")[0].value = 1;
}
