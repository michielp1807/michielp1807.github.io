window.addEventListener("load", function() {
  const animationArea = document.getElementById("animationArea");
  const messageArea = document.getElementById("messageArea");
  const infoArea = document.getElementById("infoArea");
  const dropArea = document.getElementById("dropArea");
  
  const autoRefresh = document.getElementById("autoRefresh");
  const fileInput = document.getElementById("fileInput");
  fileInput.value = null;
  
  
  // Show material design icons
  NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
  document.getElementsByClassName("material-icons").forEach(e => {
    e.style.opacity = 1;
  });
  document.body.style.removeProperty("color");
  
  
  // Setup info area
  infoArea.addEventListener("click", function(ev) {
    ev.stopPropagation();
  });
  document.getElementById("infoButton").addEventListener("click", function(ev) {
    infoArea.style.display = "flex";
    ev.stopPropagation();
  });
  document.getElementById("closeInfoAreaButton").addEventListener("click", function(ev) {
    infoArea.style.display = "none";
  });
  document.body.addEventListener("click", function(ev) {
    infoArea.style.display = "none";
  });
  
  
  // Setup drop area
  document.body.addEventListener("dragenter", function(ev) {
    dropArea.style.display = "flex";
    ev.preventDefault();
  });
  document.body.addEventListener("click", function(ev) {
    dropArea.style.display = "none";
  });
  dropArea.addEventListener("dragleave", function(ev) {
    dropArea.style.display = "none";
    ev.preventDefault();
  });
  dropArea.addEventListener("dragover", function(ev) {
    ev.preventDefault();
  });
  dropArea.addEventListener("drop", function(ev) {
    dropArea.style.display = "none";
    ev.preventDefault();
    fileInput.files = ev.dataTransfer.files;
    loadFromFile();
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
    downloadDataAsFile(animationData.nm, ".tgs", gzipData);
  });
  
  // Setup save JSON button
  document.getElementById("saveAsJSON").addEventListener("click", function() {
    let animationData = JSON.parse(editor.getValue());
    downloadDataAsFile(animationData.nm, ".json", JSON.stringify(animationData));
  });
});


// Show a error message at the bottom of the screen
function showMessage(message) {
  messageArea.innerHTML = message;
  messageArea.style.display = "block";
}

// Hide the error message at the bottom of the screen
function hideMessage() {
  messageArea.style.display = "none";
}
