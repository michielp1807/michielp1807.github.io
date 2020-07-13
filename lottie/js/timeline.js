// array containing layer objects
let uiLayers = [];

window.addEventListener("load", function() {
  const timelineAreaTable = document.getElementById("timelineAreaTable");
  const currentFrameValue = document.getElementById("currentFrameValue");
  setInterval(function () {
    let frame = Math.floor(anim.currentFrame);
    currentFrameValue.innerHTML = (frame < 10 ? "0" : "") + frame;
  }, 1000/60);
  const frameBlocks = document.getElementById("frameBlocks");
});

// Update the timeline editor with json data
function updateTimelines() {
  updateFrameBlocks();

  // delete layer UIs if there are too many
  while (jsonData.layers.length < uiLayers.length) {
    removeLayerUI();
  }

  for (let i=0; i<jsonData.layers.length; i++) {
    // create layer if it does not exist
    if (i >= uiLayers.length) {
      uiLayers.push(new TL_Layer(uiLayers.length));
    }

    // set values
    uiLayers[i].update();
  }
}

// Update frame blocks
function updateFrameBlocks() {
  while (frameBlocks.childElementCount < jsonData.op && frameBlocks.childElementCount < 300) {
    frameBlocks.appendChild(document.createElement("SPAN"));
  }
  while (frameBlocks.childElementCount > jsonData.op) {
    frameBlocks.removeChild(frameBlocks.children[frameBlocks.childElementCount - 1]);
  }
  let i = 0;
  frameBlocks.children.forEach(e => {
    if (i % 10 == 0) {
      e.innerHTML = i;
    } else {
      e.innerHTML = "";
    }
    i++;
    e.style.width = (100 / jsonData.op) + "%";
  });
}

// Inspired by: https://www.w3schools.com/howto/howto_js_draggable.asp
// Used by timeline layer visibility bar (and maybe other things in the future,
// like keyframes which can be dragged around)
let dragStartX;
let dragStartY;
function startDrag(ev, onmove) {
  ev.preventDefault();

  dragStartX = ev.clientX;
  dragStartY = ev.clientY;

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("mousemove", onmove);

  function stopDrag() {
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("mousemove", onmove);
		setCodeValue(jsonData); // apply changes from drag
  }
}

// Playback speed controls:
//     Set current frame: anim.currentRawFrame
//     Set playback speed: anim.frameModifier
