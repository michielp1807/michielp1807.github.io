// TODO: precomp needs some way to select which comp is used
class TL_PrecompLayer extends TL_Layer {
	constructor(index) {
		super(index);
	}

	update() {
		super.update();
	}
}
TL_PrecompLayer.ty = 0;
TL_PrecompLayer.layerName = "Precomp Layer";
TL_PrecompLayer.layerIcon = "collections";

// Null layer has no extra properties
class TL_NullLayer extends TL_Layer {}
TL_NullLayer.ty = 3;
TL_NullLayer.layerName = "Null Layer";
TL_NullLayer.layerIcon = "crop_free";

class TL_ShapeLayer extends TL_Layer {
	constructor(index) {
		super(index);
		// TODO: generate shapes UI
	}

	update() {
		super.update();
		// TODO: update shapes UI
	}
}
TL_ShapeLayer.ty = 4;
TL_ShapeLayer.layerName = "Shape Layer";
TL_ShapeLayer.layerIcon = "star";

// All later types supported by Telegram
const LAYER_TYPES = [
	TL_PrecompLayer,
	undefined,
	undefined,
	TL_NullLayer,
	TL_ShapeLayer
]

const BM_LayerTypeUnsupported = "Unsupported Layer Type";
const BM_LayerTypeUnsupportedIcon = "report";

// const BM_LayerTypeSupportedByTelegram = [
// 	true,  //  0: precomp (works)
//   false, //  1: solid
//   false, //  2: still
//   true,  //  3: null layer (works)
//   true,  //  4: shape (works)
//   false, //  5: text
//   false, //  6: audio
//   false, //  7: pholderVideo
//   false, //  8: imageSeq
//   false, //  9: video
//   false, // 10: pholderStill
//   undefined, // 11: guide             (untested)
//   undefined, // 12: adjustment        (untested)
//   undefined, // 13: camera            (untested)
//   undefined  // 14: light             (untested)
// ]
