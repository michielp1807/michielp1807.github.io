// Setup the UI for the overlays (info window, drop window, and messages at the bottom of the screen)
window.addEventListener("load", function () {
    const overlayBackground = document.getElementById("overlayBackground");
    const messageArea = document.getElementById("messageArea");
    const infoArea = document.getElementById("infoArea");
    const dropArea = document.getElementById("dropArea");

    // Setup info area
    infoArea.addEventListener("click", function (ev) {
        ev.stopPropagation();
    });
    document.getElementById("infoButton").addEventListener("click", function (ev) {
        showOverlay(infoArea)
        ev.stopPropagation();
    });
    document.getElementById("closeInfoAreaButton").addEventListener("click", function (ev) {
        hideOverlay(infoArea);
    });
    document.body.addEventListener("click", function (ev) {
        hideOverlay(infoArea);
    });

    // Setup drop area
    document.body.addEventListener("dragenter", function (ev) {
        showOverlay(dropArea);
        ev.preventDefault();
    });
    overlayBackground.addEventListener("dragleave", function (ev) {
        hideOverlay(dropArea);
        ev.preventDefault();
    });
    document.body.addEventListener("click", function (ev) {
        hideOverlay(dropArea);
    });
    dropArea.addEventListener("dragover", function (ev) {
        ev.preventDefault();
    });
    dropArea.addEventListener("drop", function (ev) {
        hideOverlay(dropArea);
        ev.preventDefault();
        if (ev.dataTransfer.files.length > 0) {
            fileInput.files = ev.dataTransfer.files;
            loadFromFile();
        }
    });

    // Setup message area
    messageArea.addEventListener("click", function () {
        let err = messageArea.innerHTML;
        if (err.indexOf("SyntaxError: JSON.parse: ") == 0) {
            let lineCol = err.match(/\d+/g);
            let line = parseInt(lineCol[0]);
            let col = parseInt(lineCol[1]);
            editor.navigateTo(line - 1, col - 1);
        }
        hideMessage();
    });
});

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
