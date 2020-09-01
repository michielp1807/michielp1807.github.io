$(function() { // on page load
    $("#input").keydown(doKeyboardInput); // bind keypress event from input textarea
    $(document).keydown(function(e) {
        if (!e.ctrlKey)
            $("#input").focus(); // focus on input textarea
    });
    COMMANDS.CLEAR.do(); // execute clear command
    printLine("Use the command 'HELP' for info about the available commands...", "indent gray");
    $("#input").focus(); // focus on input textarea
});

// Input functions

// called whenever a key is pressed in the input textarea
const doKeyboardInput = (e) => {
    if (e.which == 13) { // if key is enter
        // get input string
        const input_string = $("#input")[0].value.trim();

        // if not empty process the input string
        if (input_string.length > 0) {
            doInput(input_string);
        }
    } else if (e.which == 38) { // up arrow
        navMove(1);
        e.preventDefault();
    } else if (e.which == 40) { // down arrow
        navMove(-1);
        e.preventDefault();
    }
}

// called when user hits enter in input textarea
const doInput = (input_string) => {
    // reset the input textarea and print input line
    $("#input")[0].value = "";
    printLine("> " + input_string, "inputLines");

    // seperate command and parameters from input string
    let split = splitFirstParameter(input_string);
    let command = split[0].toUpperCase();
    let parameters = split[1];

    doCommand(command, parameters, input_string);

    // scroll down and left to make sure output is visible
    $("body").scrollTop($("#output")[0].scrollHeight);

    resetNavigation();
}

const splitFirstParameter = (text) => {
    let output = [];
    output.push(text.split(" ")[0]);
    output.push(text.substr(output[0].length + 1));
    return output;
}

// Output functions

// writes line to output
const printLine = (text, style) => {
    let class_name = "new_line";
    if (style != null)
        class_name += " " + style;
    $("#output").append('<div class="' + class_name + '">' + text + '</div>');
}

// print table based on an array of elements and some number of columns
const printTable = (elements, columns) => {
    let table = $('<table>');
    let col = 0;
    let row = $('<tr>');
    let totalCells = Math.ceil(elements.length / columns) * columns;
    table.append(row);
    for (let i = 0; i < totalCells; i++) {
        let text = elements[i];
        row.append($('<td>').append(text));

        col++;
        if (col >= columns && i + 1 < totalCells) {
            col = 0;
            row = $('<tr>');
            table.append(row);
        }
    }
    $("#output").append(table);
}

// Navigate functions
let nav_position = 0;
let nav_temp_text = "";

// navigate up or down, dir is either 1 (up) or -1 (down)
const navMove = (dir) => {
    // array of all the input texts as a list of nodes
    let inputs = $(".inputLines").contents();

    if (dir == 1 && (inputs.length - nav_position) > 0) { // move up
        nav_position++;
        if (nav_position == 1) {
            nav_temp_text = $("#input")[0].value;
        }
        $("#input")[0].value = getPreviousCommand(nav_position, inputs);

    } else if (dir == -1 && nav_position > 0) { // mode down
        nav_position--;
        if (nav_position == 0) {
            $("#input")[0].value = nav_temp_text;
        } else {
            $("#input")[0].value = getPreviousCommand(nav_position, inputs);
        }
    }
}

// get a previous input, 1 is the first previous input, 2 the second etc...
const getPreviousCommand = (nav_position, inputs) => {
    return inputs[inputs.length - nav_position].nodeValue.substr(2);
}

// reset navigation, called in on_input
const resetNavigation = () => {
    nav_position = 0;
    nav_temp_text = "";
}