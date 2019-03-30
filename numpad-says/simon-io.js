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
	if (!skipping) {
		skipping = true;
		$("#skipButton").fadeOut(200);
	}
}

function onUserInput(key) {
	if (userCanType) {
		userString += key;

		// if pressed key was correct
		if (userString == numberString.substring(0, userString.length)) {
			// play sound effect
			if (key == ".") {
				playSfx(0);
			} else {
				playSfx(parseInt(key)+1);
			}

			setProgressBar();

			// start next level
			if (userString == numberString.substring(0, level))
				nextLevel();
		} else {
			gameOver(key);
		}
	}
}
