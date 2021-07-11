let editor, editorMatchesExecutor, editorMap, progressMarker;
let programTape, memoryTape, inputTape, outputTape, inputText, outputText;
let program, memory, input, output, stack, pp, mp, ip, op, history;
let runButton, toCursorButton, stepBackwardButton;

window.addEventListener("load", function () {
    // Get elements by ID
    programTape = document.getElementById("program-tape");
    memoryTape = document.getElementById("memory-tape");
    inputTape = document.getElementById("input-tape");
    outputTape = document.getElementById("output-tape");
    inputText = document.getElementById("input-text");
    outputText = document.getElementById("output-text");
    runButton = document.getElementById("run-button");
    toCursorButton = document.getElementById("to-cursor-button");
    stepBackwardButton = document.getElementById("step-backward-button")

    // Define brainfuck ace mode
    define('ace/mode/bf', [], function(require, exports, module) {
        const oop = require("ace/lib/oop");
        const TextMode = require("ace/mode/text").Mode;
        const Tokenizer = require("ace/tokenizer").Tokenizer;
        const BfHighlightRules = require("ace/mode/bf_highlight_rules").BfHighlightRules;
    
        const Mode = function() {
            this.HighlightRules = BfHighlightRules;
        };
        oop.inherits(Mode, TextMode);
        exports.Mode = Mode;
    });
    
    define('ace/mode/bf_highlight_rules', [], function(require, exports, module) {
        const oop = require("ace/lib/oop");
        const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
        const BfHighlightRules = function() {
            this.$rules = {
                "start" : [
                    {token : "paren.lparen", regex : /[\[]/},
                    {token : "paren.rparen", regex : /[\]]/},
                    {token : "keyword", regex : /[<>+-.,]/},
                    {token : "comment", regex : /[^<>+-.,\[\]]/}
                ]
            };
        };
        oop.inherits(BfHighlightRules, TextHighlightRules);
        exports.BfHighlightRules = BfHighlightRules;
    });

	// Setup editor
	editor = ace.edit("code-area");
	editor.setTheme("ace/theme/xcode");
	editor.setShowPrintMargin(false);
	editor.setOption("dragEnabled", false);
	editor.session.setMode("ace/mode/bf");
	editor.session.setTabSize(2);
    editor.setFontSize("16px");

    fetch("./hello-world.bf").then(res => res.text()).then(prog => {
        editor.setValue(prog, 0);
        editor.gotoLine(0);
        
        reset();
    });

    editor.on("change", function(e) {
        if (progressMarker != undefined) editor.session.removeMarker(progressMarker);
        editorMatchesExecutor = false;
        toCursorButton.disabled = true;
    });
});

function reset() {
    let code = editor.getValue();
    program = code.replaceAll(/[^<>+-.,\[\]]/g, "");
    editorMap = [];
    history = [];
    for (let i=0, j=0; i<program.length; i++) {
        while (code[j] != program[i]) {
            j++;
        }
        editorMap[i] = j;
        j++;
    }
    editorMatchesExecutor = true;
    toCursorButton.disabled = false;
    stepBackwardButton.disabled = true;
    memory = new Array(32).fill(0);
    input = inputText.value;
    output = "";
    stack = [];
    pp = 0;
    mp = 0;
    ip = 0;
    op = 0;
    update();
}

function runToCursor() {
    let index = editor.session.doc.positionToIndex(editor.getCursorPosition());
    let i;
    for (i=0; i<editorMap.length; i++) {
        if (editorMap[i] >= index) break;
    }
    let backward = pp > i;
    run(i, backward);
}

let stopping = false;
function run(until, backward) {
    stopping = false;
    if (backward) {
        const runStepBackward = function() {
            if (pp > (until ?? 0) && !stopping) {
                stepBackward();
                setTimeout(runStepBackward, 1);
            } else {
                // Change button back to Run
                runButton.innerHTML = "Run";
                runButton.onclick = () => run();
            }
        }
        setTimeout(runStepBackward, 1);
    } else {
        const runStep = function() {
            if (pp < (until ?? program.length) && !stopping) {
                step();
                setTimeout(runStep, 1);
            } else {
                // Change button back to Run
                runButton.innerHTML = "Run";
                runButton.onclick = () => run();
            }
        }
        setTimeout(runStep, 1);
    }
    // Change button to Stop
    runButton.innerHTML = "Stop";
    runButton.onclick = () => stopping = true;
}

function goToMatchingClosingBracket() {
    let lvl = 1;
    while (lvl > 0) {
        pp++;
        if (program[pp] == "[")
            lvl++;
        else if (program[pp] == "]")
            lvl--;
    }
}

function step() {
    stepBackwardButton.disabled = false;
    switch (program[pp]) {
        case ">":
            mp++;
            break;
        case "<":
            mp--;
            break;
        case "+":
            memory[mp] = ((memory[mp] || 0) + 1) % 256;
            break;
        case "-":
            memory[mp] = ((memory[mp] || 0) + 255) % 256;
            break;
        case ".":
            output += String.fromCharCode(memory[mp]);
            op++;
            break;
        case ",":
            history.push(memory[mp]);
            memory[mp] = input.charCodeAt(ip);
            ip++;
            break;
        case "[":
            if (memory[mp]) { // enter loop
                stack.push(pp);
                history.push(false);
            } else { // skip loop
                history.push(pp);
                goToMatchingClosingBracket();
                history.push(false);
            }
            break;
        case "]":
            if (memory[mp]) { // restart loop
                pp = stack[stack.length-1];
                history.push(true);
            } else { // exit loop
                history.push(stack.pop());
                history.push(true);
            }
            break;
    }
    pp++;
    update();
}

function stepBackward() {
    pp--;
    switch (program[pp]) {
        case ">":
            mp--;
            break;
        case "<":
            mp++;
            break;
        case "+":
            memory[mp] = ((memory[mp] || 0) + 255) % 256;
            break;
        case "-":
            memory[mp] = ((memory[mp] || 0) + 1) % 256;
            break;
        case ".":
            output = output.slice(0, -1);
            op--;
            break;
        case ",":
            memory[mp] = history.pop();
            ip--;
            break;
        case "[":
            let cameFromRestart = history.pop();
            if (cameFromRestart) {
                goToMatchingClosingBracket(); // Is dit goed of moet het eentje meer of minder zijn?
            } else {
                stack.pop();
            }
            break;
        case "]":
            let cameFromInsideLoop = history.pop();
            if (cameFromInsideLoop) {
                stack.push(history.pop());
            } else {
                pp = history.pop();
            }
            break;
    }
    if (pp == 0) stepBackwardButton.disabled = true;
    update();
}

function update() { // Update HTML elements to reflect program state
    function tapeString(str, i) {
        return str.substr(0, i) + `<span class="tape-selected">${str[i] || " "}</span>` + (str.substr(i+1) || "");
    }

    programTape.innerHTML = tapeString(program, pp);
    memoryTape.innerHTML = memory.reduce((a, b, i) => {
        b = (b<100 ? (b<10 ? "00" : "0") : "") + b;
        if (i == mp) {
            return a + ` <span class="tape-selected">${b}</span>`;
        } else {
            return a + " " + b;
        }
    }, "");
    inputTape.innerHTML = tapeString(input, ip);
    outputTape.innerHTML = tapeString(output, op);
    outputText.value = output;

    programTape.getElementsByClassName("tape-selected")[0]?.scrollIntoView();
    memoryTape.getElementsByClassName("tape-selected")[0]?.scrollIntoView();
    inputTape.getElementsByClassName("tape-selected")[0]?.scrollIntoView();
    outputText.getElementsByClassName("tape-selected")[0]?.scrollIntoView();

    if (editorMatchesExecutor) {
        let position = editor.session.doc.indexToPosition(editorMap[pp], 0);
        let range = new ace.Range(position.row, position.column, position.row, position.column + 1);
        if (progressMarker != undefined) editor.session.removeMarker(progressMarker);
        progressMarker = editor.session.addMarker(range,"editor-progress", "text");
    }
}