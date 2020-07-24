const exampleAnimation = { "tgs": 1, "v": "5.5.2", "fr": 30, "ip": 0, "op": 60, "w": 512, "h": 512, "nm": "layers", "ddd": 0, "assets": [], "layers": [{ "ddd": 0, "ind": 1, "ty": 4, "nm": "Shape Layer 1", "sr": 1, "ks": { "r": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0] }, { "t": 40, "s": [90] }] }, "p": { "a": 0, "k": [256, 256, 0] } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "ty": "rc", "d": 3, "s": { "a": 0, "k": [256, 256] }, "p": { "a": 0, "k": [0, 0] }, "r": { "a": 0, "k": 0 }, "nm": "Rectangle Path 1", "hd": false }, { "ty": "fl", "c": { "a": 0, "k": [1, 0, 0, 1] }, "o": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 30, "s": [100] }, { "t": 40, "s": [0] }] }, "r": 1, "bm": 0, "nm": "Fill 1", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [0, -0.031] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 0, "k": [100, 100] }, "r": { "a": 0, "k": 0 }, "o": { "a": 0, "k": 100 }, "sk": { "a": 0, "k": 0 }, "sa": { "a": 0, "k": 0 }, "nm": "Transform" }], "nm": "Rectangle 1", "bm": 0, "hd": false }], "ip": 0, "op": 40, "st": 0, "bm": 0 }, { "ddd": 0, "ind": 2, "ty": 4, "nm": "Shape Layer 2", "sr": 1, "ks": { "p": { "a": 0, "k": [256, 256, 0] } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "ty": "rc", "d": 3, "s": { "a": 0, "k": [256, 256] }, "p": { "a": 0, "k": [0, 0] }, "r": { "a": 0, "k": 0 }, "nm": "Rectangle Path 1", "hd": false }, { "ty": "fl", "c": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 20, "s": [1, 0, 1] }, { "t": 40, "s": [1, 0.5, 0] }] }, "o": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 20, "s": [0] }, { "t": 40, "s": [100] }] }, "r": 1, "bm": 0, "nm": "Fill 1", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [0, -0.031] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 20, "s": [120, 120] }, { "t": 60, "s": [100, 100] }] }, "r": { "a": 0, "k": 0 }, "o": { "a": 0, "k": 100 }, "sk": { "a": 0, "k": 0 }, "sa": { "a": 0, "k": 0 }, "nm": "Transform" }], "nm": "Rectangle 1", "bm": 0, "hd": false }], "ip": 20, "op": 60, "st": 0, "bm": 0 }] };

let anim;
let jsonData = exampleAnimation;
let editor;
const TAB_SIZE = 4;

window.addEventListener("load", function () {
  // Setup editor
  editor = ace.edit("codeArea");
  editor.setTheme("ace/theme/xcode");
  editor.setShowPrintMargin(false);
  editor.setOption("dragEnabled", false);
  editor.session.setMode("ace/mode/json");
  editor.session.setTabSize(TAB_SIZE);
  editor.on("change", function () {
    try {
      if (autoRefresh.checked) {
        setAnimation();
      }
    } catch (e) {
      showMessage(e);
    }
  });
  setCodeValue();
  editor.session.getUndoManager().reset();

  // Setup global CTRL+Z and global CTRL+Y
  document.body.addEventListener("keydown", function (ev) {
    if (ev.key == "z" && ev.ctrlKey) { // CTRL+Z
      editor.undo();
      ev.preventDefault();
      if (activeTab == TAB_TIMELINE_EDITOR)
        updateTimelines();
    } else if (ev.key == "y" && ev.ctrlKey) { // CTRL+Y
      editor.redo();
      ev.preventDefault();
      if (activeTab == TAB_TIMELINE_EDITOR)
        updateTimelines();
    }
  });
});

// Load TGS or JSON data from file input field
function loadFromFile() {
  let reader = new FileReader();
  reader.readAsBinaryString(fileInput.files[0]);
  reader.addEventListener("load", function (data) {
    let jsonString;
    try {
      let jsonText = pako.ungzip(data.target.result);
      jsonString = new TextDecoder("utf-8").decode(jsonText);
    } catch (e) {
      if (e == "incorrect header check") {
        jsonString = data.target.result;
      } else {
        showMessage(e);
        console.log(e);
      }
    }
    try {
      setCodeValue(JSON.parse(jsonString));
      updateTimelines();
    } catch (e) {
      showMessage("Error loading file: Only JSON and Gzip'ed JSON (such as TGS) are supported!");
      console.log(e);
    }
  });
}

// Download some data as a file
function downloadDataAsFile(filename, extension, data) {
  let blob = new Blob([data], {
    type: "application/octet-stream"
  });
  let url = window.URL.createObjectURL(blob);

  if (!filename) {
    filename = "sticker";
  }

  let linkElement = document.createElement('a');
  linkElement.setAttribute("href", url);
  linkElement.setAttribute("download", filename + extension);
  linkElement.style.display = 'none';

  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}

// Set the value of the code editor (replaces everything that was there before)
function setCodeValue(json) {
  if (json != null) {
    jsonData = json;
  }
  editor.setValue(JSON.stringify(jsonData, null, TAB_SIZE), 0);
  editor.gotoLine(0);
}

// Format the code in the code editor by parsing it and stringifying it
function formatCode() {
  try {
    setCodeValue();
    hideMessage();
  } catch (e) {
    showMessage(e);
  }
}

// Load the code from the code editor as animation in the animation area
function setAnimation() {
  try {
    if (activeTab == TAB_CODE_EDITOR)
      jsonData = JSON.parse(editor.getValue());

    // create copy of json data for Lottie Web player,
    // otherwise it will modify the json data and add extra unneeded stuff
    let jsonDataForLottieWeb = JSON.parse(JSON.stringify(jsonData));

    animationView.innerHTML = "";
    let animData = {
      container: animationView,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: jsonDataForLottieWeb
    }
    anim = bodymovin.loadAnimation(animData);
    hideMessage();
  } catch (e) {
    showMessage(e);
  }
}
