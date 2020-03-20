const exampleAnimation = {"tgs":1,"v":"5.5.2","fr":30,"ip":0,"op":30,"w":512,"h":512,"nm":"rotate","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Shape Layer 1","sr":1,"ks":{"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":30,"s":[90]}]},"p":{"a":0,"k":[256,256,0]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":3,"s":{"a":0,"k":[256,256]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"nm":"Rectangle Path 1","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0,0,1]},"o":{"a":0,"k":100},"r":1,"bm":0,"nm":"Fill 1","hd":false},{"ty":"tr","p":{"a":0,"k":[0,-0.031]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0},"nm":"Transform"}],"nm":"Rectangle 1","bm":0,"hd":false}],"ip":0,"op":30,"st":0,"bm":0}]}


let anim;
let editor;
const TAB_SIZE = 4;

window.addEventListener("load", function() {
  const animationArea = document.getElementById("animationArea");
  const autoRefresh = document.getElementById("autoRefresh");
  const messageArea = document.getElementById("messageArea");
  const dropArea = document.getElementById("dropArea");
  
  const fileInput = document.getElementById("fileInput");
  fileInput.value = null;
  
  // Setup editor
  editor = ace.edit("codeArea");
  editor.setTheme("ace/theme/xcode");
  editor.session.setMode("ace/mode/json");
  editor.session.setTabSize(TAB_SIZE);
  editor.on("change", function() {
    if (autoRefresh.checked) {
      setAnimation();
    }
  });
  setCodeValue(exampleAnimation);
  setAnimation();
  
  // Setup drop area
  document.body.addEventListener("dragenter", function(ev) {
    dropArea.style.display = "block";
    ev.preventDefault();
  });
  dropArea.addEventListener("dragleave", function(ev) {
    dropArea.style.display = "none";
    ev.preventDefault();
  });
  dropArea.addEventListener("dragover", function(ev) {
    ev.preventDefault();
  });
  dropArea.addEventListener("drop", function(ev) {
    fileInput.files = ev.dataTransfer.files;
    loadFromFile();
    dropArea.style.display = "none";
    ev.preventDefault();
  });
  
  // Setup message area
  messageArea.addEventListener("click", function() {
    let err = messageArea.innerHTML;
    if (err.indexOf("SyntaxError: JSON.parse: ") == 0) {
      let lineCol = err.match(/\d+/g);
      let line = parseInt(lineCol[0]);
      let col = parseInt(lineCol[1]);
      editor.navigateTo(line-1, col-1);
    }
    hideMessage();
  });
  
  // Setup load file button
  fileInput.addEventListener("change", loadFromFile);
  
  // Setup save Gzip button
  document.getElementById("saveAsGzip").addEventListener("click", function() {
    let animationData = JSON.parse(editor.getValue());
    let gzipData = pako.gzip(JSON.stringify(animationData));
    //let gzipString = new TextDecoder("utf-8").decode(gzipData);
    
    downloadDataAsFile(animationData.nm, ".tgs", gzipData);
  });
  
  // Setup save JSON button
  document.getElementById("saveAsJSON").addEventListener("click", function() {
    let animationData = JSON.parse(editor.getValue());
    downloadDataAsFile(animationData.nm, ".json", JSON.stringify(animationData));
  });
});

// Load TGS or JSON data from file input field
function loadFromFile() {
  let reader = new FileReader();
  reader.readAsBinaryString(fileInput.files[0]);
  reader.addEventListener("load", function(data) {
    let jsonString;
    try {
      let jsonData = pako.ungzip(data.target.result);
      jsonString = new TextDecoder("utf-8").decode(jsonData);
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
    } catch(e) {
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

  let element = document.createElement('a');
  element.setAttribute("href", url);
  element.setAttribute("download", filename + extension);
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Set the value of the code editor (replaces everything that was there before)
function setCodeValue(json) {
  editor.setValue(JSON.stringify(json, null, TAB_SIZE), 0);
  editor.gotoLine(0);
}

// Format the code in the code editor by parsing it and stringifying it
function formatCode() {
  try {
    editor.setValue(JSON.stringify(JSON.parse(editor.getValue()), null, TAB_SIZE), 0);
    hideMessage();
  } catch (e) {
    showMessage(e);
  }
}

// Load the code from the code editor as animation in the animation area
function setAnimation() {
  try {
    let animationData = JSON.parse(editor.getValue());
    animationArea.innerHTML = "";
    let animData = {
      container: animationArea,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData
    }
    anim = bodymovin.loadAnimation(animData);
    hideMessage();
  } catch (e) {
    showMessage(e);
  }
}

// Show a error message at the bottom of the screen
function showMessage(message) {
  messageArea.innerHTML = message;
  messageArea.style.display = "block";
}

// Hide the error message at the bottom of the screen
function hideMessage() {
  messageArea.style.display = "none";
}
