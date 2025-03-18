function setupIO() {
	// set up numpad
	let tds = $("td");
	for (let i = 0; i < tds.length; i++) {
		tds[i].onmousedown = function () {
			onUserInput(this.innerHTML);
		};
		numpad[tds[i].innerHTML] = tds[i];
	}

	// keyboard events
	$(this).keydown(ev => {
		if (ev.keyCode == 13) {
			if ($("#mainMenu").is(":visible")) play();
			return;
		} else if (ev.keyCode == 27) {
			// on esc go to menu
			if ($("#optionsMenu").is(":visible")) {
				hideOptionsMenu();
			} else {
				showMenu();
			}
			return;
		}
		let numkey = numpad[ev.key];
		if (numkey != undefined && userCanType && pressedKeys[ev.which] != true) {
			pressedKeys[ev.which] = true;
			numkey.className = "active";
			onUserInput(ev.key);
		}
	});
	$(this).keyup(ev => {
		let numkey = numpad[ev.key];
		if (numkey != undefined) {
			pressedKeys[ev.which] = false;
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
			if (!options.optMuteKeys) {
				if (key == ".") {
					playSfx(0);
				} else {
					playSfx(parseInt(key) + 1);
				}
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
