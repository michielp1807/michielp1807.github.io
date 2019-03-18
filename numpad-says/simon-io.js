function setupIO() {
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
			showMenu();
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
}

function skipButtonClick() {
	skipping = true;
	$("#skipButton").fadeOut();
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
