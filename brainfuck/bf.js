let editor, editorMatchesExecutor, editorMap, progressMarker;
let programTape, memoryTape, inputTape, outputTape, inputText, outputText;
let program, memory, input, output, stack, pp, mp, ip, op, history, runTimeout, mpMin, mpMax;
let runButton, toCursorButton, stepForwardButton, stepBackwardButton, resetButton;
let computer;

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
    stepForwardButton = document.getElementById("step-forward-button");
    stepBackwardButton = document.getElementById("step-backward-button");
    resetButton = document.getElementById("reset-button");
    computer = document.getElementById("computer");

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

    runButton.onclick = () => run();
    toCursorButton.onclick = () => {stop(); runToCursor()};
    stepForwardButton.onclick = () => {stop(); step()};
    stepBackwardButton.onclick = () => {stop(); stepBackward()};
    resetButton.onclick = () => {stop(); reset()};

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey) {
            switch (e.key) {
                case "End":
                    runButton.click();
                    e.preventDefault(); 
                    e.stopPropagation();
                    break;
                case "ArrowDown":
                    toCursorButton.click();
                    e.preventDefault(); 
                    e.stopPropagation();
                    break;
                case "ArrowRight":
                    stepForwardButton.click();
                    e.preventDefault(); 
                    e.stopPropagation();
                    break;
                case "ArrowLeft":
                    stepBackwardButton.click();
                    e.preventDefault(); 
                    e.stopPropagation();
                    break;
                case "ArrowUp":
                    resetButton.click();
                    e.preventDefault(); 
                    e.stopPropagation();
                    break;
            }
        }
    }, true);
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
    memory = [];
    input = inputText.value;
    output = "";
    stack = [];
    pp = 0;
    mp = 0;
    ip = 0;
    op = 0;
    mpMin = 0;
    mpMax = 31;
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
function stop() {
    stopping = true;
    if (runTimeout) clearTimeout(runTimeout);
    // Change button back to Run
    runButton.innerHTML = "Run";
    runButton.onclick = () => run();
    computer.style.backgroundColor = "#ffffff";
}
function run(until, backward) {
    stopping = false;
    computer.style.backgroundColor = "#fff3b0";
    if (backward) {
        const runStepBackward = function() {
            if (pp <= (until ?? 0)) stop();
            if (!stopping) {
                stepBackward();
                runTimeout = setTimeout(runStepBackward, 1);
            }
        }
        runTimeout = setTimeout(runStepBackward, 1);
    } else {
        const runStep = function() {
            if (pp >= (until ?? program.length)) stop();
            if (!stopping) {
                step();
                runTimeout = setTimeout(runStep, 1);
            }
        }
        runTimeout = setTimeout(runStep, 1);
    }
    // Change button to Stop
    runButton.innerHTML = "Stop";
    runButton.onclick = () => stop();
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
    switch (program[pp]) {
        case ">":
            mp++;
            mpMax = Math.max(mp, mpMax);
            break;
        case "<":
            mp--;
            mpMin = Math.min(mp, mpMin);
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
    update();
}

function update() { // Update HTML elements to reflect program state
    function tapeString(str, i) {
        return str.substr(0, i) + `<span class="tape-selected">${str[i] || " "}</span>` + (str.substr(i+1) || "");
    }

    programTape.innerHTML = tapeString(program, pp);
    let memoryTapeStr = "";
    const formatMem = i => {
        let v = memory[i];
        v = v ? (v<100 ? (v<10 ? "00" : "0") : "") + v : "000";
        if (i == mp) {
            return  `<span class="tape-selected">${v}</span>`;
        } else {
            return v;
        }
    };
    memoryTapeStr += formatMem(mpMin);
    for (let i=mpMin+1; i<=mpMax; i++) {
        memoryTapeStr += " " + formatMem(i);
    }
    memoryTape.innerHTML = memoryTapeStr;
    inputTape.innerHTML = tapeString(input, ip);
    outputTape.innerHTML = tapeString(output, op);
    outputText.value = output;

    programTape.getElementsByClassName("tape-selected")[0]?.scrollIntoView();
    memoryTape.getElementsByClassName("tape-selected")[0]?.scrollIntoView();
    inputTape.getElementsByClassName("tape-selected")[0]?.scrollIntoView();
    outputText.getElementsByClassName("tape-selected")[0]?.scrollIntoView();

    stepBackwardButton.disabled = pp <= 0;
    stepForwardButton.disabled = pp >= program.length;

    if (editorMatchesExecutor) {
        let position = editor.session.doc.indexToPosition(editorMap[pp], 0);
        let range = new ace.Range(position.row, position.column, position.row, position.column + 1);
        if (progressMarker != undefined) editor.session.removeMarker(progressMarker);
        progressMarker = editor.session.addMarker(range,"editor-progress", "text");
    }
}