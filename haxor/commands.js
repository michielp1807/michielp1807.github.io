// This file contains all the commands

// executes a command, activated by do_input()
const do_command = (command, parameters, original_input) => {
	if (COMMANDS[command] != undefined) {
		COMMANDS[command].do(parameters);
	} else {
		try {
			output_line(eval(original_input));
		} catch (e) {
			output_line("'" + original_input + "' is not recognized as a command or as valid javascript...");
			output_line(" (" + e + ")", "error");
		}
	}
}

// the commands all have a do() function and a description
const COMMANDS = {
	"ASCII": {
		"do": function (parameters) {
			// get mode
			let split = split_first_parameter(parameters);
			let mode = split[0].toUpperCase();
			parameters = split[1];

			// get base
			split = split_first_parameter(parameters);
			let base = parseInt(split[0].toLowerCase());
			let text = split[1];

			if (text.length == 0) {
				output_line("It appears you are missing a parameter, make sure you've added the mode, key and text parameters");
				output_line(" (SyntaxError: Missing parameter)", "error");
				return;
			}

			// compute result
			let output = "";
			switch (mode) {
				case "ENCODE":
					for (let i = 0; i < text.length; i++) {
						output += text.charCodeAt(i).toString(base);
						output += i < text.length - 1 ? " " : "";
					}
					break;
				case "DECODE":
					text = text.split(" ");
					for (let i = 0; i < text.length; i++) {
						output += String.fromCharCode(parseInt(text[i], base));
					}
					break;
				default:
					output_line("The first parameter should be either 'ENCODE' or 'DECODE'");
					output_line(" (SyntaxError: Incorrect parameter)", "error");
					return;
			}
			output_line(output);
		},
		"parameters": "mode base text",
		"description": "Encodes/decodes with ASCII, for example: 'ASCII DECODE 16 41 53 43 49 49 21'"
	},
	"BASE64": {
		"do": function (parameters) {
			let split = split_first_parameter(parameters);
			let mode = split[0].toUpperCase();
			let text = split[1];

			if (text.length == 0) {
				output_line("It appears you are missing a parameter, make sure you've added the mode and text parameters");
				output_line(" (SyntaxError: Missing parameter)", "error");
				return;
			}

			switch (mode) {
				case "ENCODE":
					output_line(btoa(text));
					break;
				case "DECODE":
					output_line(atob(text));
					break;
				default:
					output_line("The first parameter should be either 'ENCODE' or 'DECODE'");
					output_line(" (SyntaxError: Incorrect parameter)", "error");
			}
		},
		"parameters": "mode text",
		"description": "Encodes/decodes base64 strings, mode can either be 'ENCODE' or 'DECODE'"
	},
	"CLEAR": {
		"do": function () {
			$("#output").empty();
			output_line("Welcome to " + document.title);
		},
		"description": "Clears the screen"
	},
	"HELP": {
		"do": function () {
			output_line("Here's a list of all the available commands:");
			output_line(" ");
			for (c in COMMANDS) {
				let com = c;
				let params = COMMANDS[c].parameters;
				if (params)
					com += " " + params;
				output_line(add_spaces_until("  " + com, 24) + COMMANDS[c].description);
			}
			output_line(" ");
			output_line("It is also possible to input javascript code, for example '1+1' will return 2");
		},
		"description": "Shows help information for the available commands"
	},
	"MORSE": {
		"do": function (parameters) {
			let split = split_first_parameter(parameters.toUpperCase());
			let mode = split[0].toUpperCase();
			let output = "";
			switch (mode) {
				case "ENCODE":
					for (let i = 0; i < split[1].length; i++) {
						let c = MORSE[split[1][i]];
						if (c) output += c;
						output += " ";
					}
					output_line(output.trim());
					break;
				case "DECODE":
					let chars = split[1].split(" ");
					for (let i = 0; i < chars.length; i++) {
						let c = "#";
						for (m in MORSE) {
							if (MORSE[m] == chars[i]) c = m;
						}
						output += c;
					}
					output_line(output.trim());
					break;
				default:
					output_line("The first parameter should be either 'ENCODE' or 'DECODE'");
					output_line(" (SyntaxError: Incorrect parameter)", "error");
			}
		},
		"parameters": "mode text",
		"description": "Encodes/decodes morse code strings with dots and dashes, mode can either be 'ENCODE' or 'DECODE'"
	},
	"ROT": {
		"do": function (parameters) {
			// get x
			let split = split_first_parameter(parameters);
			let text = split[1];
			let x = parseInt(split[0]);

			if (split[0] && x) {
				text = text.replace(/[a-zA-Z]/g, function (c) {
					return rot(c, x);
				});
				output_line(text);
			} else {
				output_line("Please specify the amount of places to rotate by, for example: 'ROT 13 Ebg");
				output_line(" (SyntaxError: Incorrect parameter)", "error");
			}
		},
		"parameters": "x text",
		"description": "Rotates text by x places, for example: 'ROT 13 Ebg'"
	},
	"ROTALL": {
		"do": function (parameters) {
			for (let i = 0; i < 26; i++) {
				let text = parameters.replace(/[a-zA-Z]/g, function (c) {
					return rot(c, i);
				});
				output_line("ROT " + i + ": " + (i < 10 ? " " : "") + "'" + text + "'");
			}
		},
		"parameters": "text",
		"description": "Rotates text for all 26 possibilities, for example: 'ROTALL Ebg'"
	},
	"VIG": {
		"do": function (parameters) {
			// get mode
			let split = split_first_parameter(parameters);
			let mode = split[0].toUpperCase();
			parameters = split[1];

			let mult = 0;
			switch (mode) {
				case "ENCODE":
					mult = 1;
					break;
				case "DECODE":
					mult = -1;
					break;
				default:
					output_line("The first parameter should be either 'ENCODE' or 'DECODE'");
					output_line(" (SyntaxError: Incorrect parameter)", "error");
					return;
			}

			// get key
			split = split_first_parameter(parameters);
			let key_word = split[0].toLowerCase();
			let text = split[1];

			if (text.length == 0) {
				output_line("It appears you are missing a parameter, make sure you've added the mode, key and text parameters");
				output_line(" (SyntaxError: Missing parameter)", "error");
				return;
			}

			let key = [];
			key_word.replace(/[a-z]/g, function (c) {
				key.push(c.charCodeAt(0) - 97);
				return c;
			});

			let i = -1;
			text = text.replace(/[a-zA-Z]/g, function (c) {
				i++;
				return rot(c, mult * key[i % key.length]);
			});

			output_line(text);
		},
		"parameters": "mode key text",
		"description": "Encodes/decodes with Vigenère cipher, for example: 'VIG DECODE Key Fmeorcbi'"
	}
};

// rotates the character by x places, for example rot("A", 1) returns "B"
const rot = (c, x) => {
	x = ((x % 26) + 26) % 26; // ensure x is actually between 0 and 25 and not negative

	// http://stackoverflow.com/a/617685/987044
	return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + x) ? c : c - 26);
}
