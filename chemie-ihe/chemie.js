const ids = ["anL73mk", "6yputNG", "kOIHkqM", "uKJLZ3M", "0rGKZmd", "ytbBGhG", "Nfhlkbm", "fMbYjfg", "SiW1u3v", "ko571pT", "NdGk9il", "HJBktrr", "l64AurK", "1DxSpj3", "B0FvoK6", "W5Z1SMz", "K7XRf3F", "WKYN1fW", "fbCBFGt", "6BFfdDU", "SGsyWzT", "vkrByE4", "GubiEzV", "fXA9zTo", "06UjJGQ", "raYfYO7", "9RrNmav", "lHmDUlS", "k4b0w8Z", "Sg5uMeU", "mfuPuRz", "TVbx0em", "nvkGnCw", "hvKx391", "tioCKaR", "9v4BbtA", "oC05Mva", "7fwYAiV", "ToPPo9i", "vAhXK1u", "XMCucVv", "nXqInRN", "3PJYoHs", "A4X34Cq", "w044nIV", "Q3NAPJL", "eUerg9O", "d2EdR9v", "uhgrHIl", "W7OYCOP", "tzVjr2u", "2Mg32RA", "E1naBaf", "wwVrcBh", "uz50kbb", "SVSmwXS", "UP0YR9G", "7cjW7mn", "ILAtdHP", "bEMUYSv", "qCb5bO2", "vRIm1q3", "XHwlwHv", "Db5HHul", "kEoth7j", "EfThTBX", "wHq420m", "ylOkhUL", "A4OmDja", "oAJnJ1s", "MUQqEar", "sODLzUK", "QLrIjoZ", "izRqt9d", "1YAhOrj", "wcsDmG3", "XXmeFxc", "qMvPIvG", "fUo192e", "reNqftc", "MkgStzU", "68CKIut", "xNxiqtn", "puH4VE4", "1h1yxZE", "wYHDKbG", "oAssGQa"];

$(function() {
	let canvas = $("canvas")[0];
	let ctx = canvas.getContext('2d');
	let img = new Image;
	img.crossOrigin = "Anonymous";
	img.onload = function() {
		canvas.width = img.width;
		canvas.height = img.height;
	  ctx.drawImage(img,0,0);
		let color = ctx.getImageData(1, img.height-2, 1, 1).data;
		$("body").css("background-color", "rgb("+color[0]+","+color[1]+","+color[2]+")");
	};
	img.src = "https://i.imgur.com/"+ids[Math.floor(ids.length*Math.random())]+".png";
	setSize();
});

$(window).resize(setSize);

function setSize() {
	let h1 = $("h1");
	h1.css("fontSize", "32px");
	for (let i=0; i<24; i++) {
		if (h1.height() > 48) {
			h1.css("fontSize", 32-i + "px");
		} else {
			break;
		}
	}
	let h1Height = h1.outerHeight(true);
	$("#canvasDiv").css("height", "calc(100vh - "+(h1Height+60)+"px)");
}

$(document).click(function(e) {
	location.reload();
});
