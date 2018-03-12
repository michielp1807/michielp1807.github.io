let numpad = {};
let userCanType = false;
let userString = "";
let numberString = "";
let snd = [];
let level = 0;
let currentDigit = 0;
for (let i=0; i<11; i++) {
	snd[i] = new Audio("snd/snd"+(i+1)+".mp3")
}
snd["gameover"] = new Audio("snd/gameover.mp3")
let pressedKeys = {};

$(function () {
	let tds = $("td");
	for (let i=0; i<tds.length; i++) {
		tds[i].onmousedown = function() {
      onUserInput(this.innerHTML);
    };
		numpad[tds[i].innerHTML] = tds[i];
	}

	$(this).keydown(function(e) {
		if (e.which == 13) {
			if ($("#menu").is(":visible")) play();
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
	$.get("numbers/"+$("#whichConstant")[0].value+".txt", function(data) {
		numberString = data;
		level = parseInt($("#startFrom")[0].value) - 1;
		if (isNaN(level)) level = 0;
		if (level>999) level = 999;
		$("#menu").hide();
		startLevel();
	});
}

function startLevel() {
	level++;
	$("#levelNumber").text(level);
	userString = "";
	userCanType = false;
	for (numkey in numpad) {
		numpad[numkey].className = "";
	}
	currentDigit = 0;
	setTimeout(sayNumber, 1000);
}

function sayNumber() {
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
			if (userString == numberString.substring(0, level)) {
				userCanType = false;
				for (numkey in numpad) {
					if (numberString[userString.length-1] != numkey) {
						numpad[numkey].className = "";
					}
				}
				setTimeout(startLevel, 500);
			}
		} else {
			gameOver();
		}
	}
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

function playSfx(int) {
	snd[int].currentTime = 0;
	snd[int].play();
}

function setVolume(mute) {
	let volume = parseFloat($("#volumeSlider")[0].value);
	if (mute) {
		volume = (volume > 0) ? 0 : 1;
		$("#volumeSlider")[0].value = volume;
	}
	for (audio in snd) {
		snd[audio].volume = volume;
	}
	if (volume == 0) {
		$("#volumeIcon").text("volume_off");
	} else if (volume <= 0.33) {
		$("#volumeIcon").text("volume_mute");
	} else if (volume <= 0.66) {
		$("#volumeIcon").text("volume_down");
	} else {
		$("#volumeIcon").text("volume_up");
	}
}

function startFromUpdate() {
	let v = parseInt($("#startFrom")[0].value);
	if (v > 1000) $("#startFrom")[0].value = 1000;
	if (v < 1) $("#startFrom")[0].value = 1;
}
