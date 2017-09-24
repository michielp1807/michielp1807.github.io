/*	// Currently disabled 

var previousWidth = 0;
var collumnElements;
var qrCodeElements;
window.onload = function() {
	setTimeout(function() {
		collumnElements = document.getElementsByClassName('collumn');
		qrCodeElements = document.getElementsByClassName('QRCodes');
		setStyling();
		setInterval(setStyling, 400);
	},200);
}
function setStyling() { 
	if (window.innerWidth != previousWidth) {
		previousWidth = window.innerWidth;
		if (window.innerWidth<960) { 
			document.getElementById("content").style.width = window.innerWidth - 160 + "px";
			document.getElementById("content").style.width = "800px";
			for(var i = 0; i < collumnElements.length; i++) { 
			  collumnElements[i].style.width='100%';
			}
			for(var i = 0; i < qrCodeElements.length; i++) { 
			  qrCodeElements[i].style.textAlign='center';
			}
		} else {
			document.getElementById("content").style.width = "800px";
			for(var i = 0; i < collumnElements.length; i++) { 
			  collumnElements[i].style.width='50%';
			}
			for(var i = 0; i < qrCodeElements.length; i++) { 
			  qrCodeElements[i].style.textAlign='right';
			}
		}
	}
}
*/