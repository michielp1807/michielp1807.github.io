window.addEventListener("load", function() {
  const animationView = document.getElementById("animationView");
  const messageArea = document.getElementById("messageArea");
  const infoArea = document.getElementById("infoArea");
  const dropArea = document.getElementById("dropArea");
  const overlayBackground = document.getElementById("overlayBackground");
  const autoRefresh = document.getElementById("autoRefresh");
  const fileInput = document.getElementById("fileInput");
  fileInput.value = null;
  
  
  // Show material design icons
  NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
  document.getElementsByClassName("material-icons load").forEach(e => {
    e.style.opacity = 1;
  });
  document.body.style.removeProperty("color");
  
  
  // Setup info area
  infoArea.addEventListener("click", function(ev) {
    ev.stopPropagation();
  });
  document.getElementById("infoButton").addEventListener("click", function(ev) {
    showOverlay(infoArea)
    ev.stopPropagation();
  });
  document.getElementById("closeInfoAreaButton").addEventListener("click", function(ev) {
    hideOverlay(infoArea);
  });
  document.body.addEventListener("click", function(ev) {
    hideOverlay(infoArea);
  });
  
  
  // Setup drop area
  document.body.addEventListener("dragenter", function(ev) {
    showOverlay(dropArea);
    ev.preventDefault();
  });
  overlayBackground.addEventListener("dragleave", function(ev) {
    hideOverlay(dropArea);
    ev.preventDefault();
  });
  document.body.addEventListener("click", function(ev) {
    hideOverlay(dropArea);
  });
  dropArea.addEventListener("dragover", function(ev) {
    ev.preventDefault();
  });
  dropArea.addEventListener("drop", function(ev) {
    hideOverlay(dropArea);
    ev.preventDefault();
    if (ev.dataTransfer.files.length > 0) {
      fileInput.files = ev.dataTransfer.files;
      loadFromFile();
    }
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
    let gzipData = pako.gzip(JSON.stringify(jsonData));
    downloadDataAsFile(jsonData.nm, ".tgs", gzipData);
  });
  
  // Setup save JSON button
  document.getElementById("saveAsJSON").addEventListener("click", function() {
    downloadDataAsFile(jsonData.nm, ".json", JSON.stringify(jsonData));
  });
});

function switchToTab(tab_name) {
  setCodeValue(jsonData);
  updateTimelines();
  
  // switch tab buttons
  document.getElementsByClassName("tabSwitcher").forEach(e => {
    e.classList.remove("active");
  });
  document.getElementById(tab_name + "Button").classList.add("active");
  
  // switch tabs
  document.getElementsByClassName("tab").forEach(t => {
    t.classList.remove("active");
  });
  document.getElementById(tab_name).classList.add("active");
}

// show an overlay
function showOverlay(overlay) {
  overlayBackground.style.display = "block";
  overlay.style.display = "flex";
}

// hide an overlay
function hideOverlay(overlay) {
  overlayBackground.style.display = "none";
  overlay.style.display = "none";
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
