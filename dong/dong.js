let websites = [];
let destination;
let notChosen = [];
let clicked = false;

$(document).ready(function() {
  $.ajax({
    url : "websites.csv",
    dataType: "text",
    success : function (data) {
      let arr = data.match(/[^\r\n]+/g);
      for (let i=0; i<arr.length; i++) {
        arr[i] = arr[i].split(/,/);
        if (i>0) {
          websites[i-1] = {};
          for (let j=0; j<arr[i].length; j++) {
            websites[i-1][arr[0][j]] = arr[i][j];
          }
        }
      }
      resetNotChosen();
      $("#numberOfDongs").text(notChosen.length);
      $("#bookmark").attr("href", window.location.href + "bookmark/");
      //console.log(websites);
    }
  });
});

function buttonClick() {
  if (!clicked) {
    clicked = true;
    if (notChosen.length == 0) {
      resetNotChosen();
    }
    let index = notChosen.splice(Math.floor(Math.random()*notChosen.length),1)[0];
    //console.log(index);
    destination = websites[index];
    setTimeout(function() {
      window.open(destination.url, "_blank");
      clicked = false;
    }, 400);
  }
}

function resetNotChosen() {
  let j=0;
  for (let i=0; i<websites.length; i++) {
    if (websites[i].working == "") {
      notChosen[j] = i;
      j++;
    }
  }
}

function menuButtonClick() {
  $("#menu").removeClass("hidden");
  $("#overlay").removeClass("hidden");
}

$(document).click(function(event) {
    if(!$(event.target).closest('#menu').length && !$(event.target).closest('#menuButton').length) {
      $("#menu").addClass("hidden");
      $("#overlay").addClass("hidden");
    }
});
