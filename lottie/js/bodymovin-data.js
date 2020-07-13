const BM_LayerTypes = {
	precomp : 0,
  solid : 1,
  still : 2,
  nullLayer : 3,
  shape : 4,
  text : 5,
  audio : 6,
  pholderVideo : 7,
  imageSeq : 8,
  video : 9,
  pholderStill : 10,
  guide : 11,
  adjustment : 12,
  camera : 13,
  light : 14
};

const BM_LayerTypeUnsupported = "Unsupported Layer Type";
const BM_LayerTypeNames = [
	"Precomp Layer", //  0: precomp
  "Solid Layer",   //  1: solid
  "Still Layer",   //  2: still (aka image)
  "Null Layer",    //  3: null layer
  "Shape Layer",   //  4: shape
  "Text Layer",    //  5: text
  BM_LayerTypeUnsupported,   //  6: audio        (unsupported)
  BM_LayerTypeUnsupported,   //  7: pholderVideo (unsupported)
  BM_LayerTypeUnsupported,   //  8: imageSeq     (unsupported)
  BM_LayerTypeUnsupported,   //  9: video        (unsupported)
  BM_LayerTypeUnsupported,   // 10: pholderStill (unsupported)
  BM_LayerTypeUnsupported,   // 11: guide        (unsupported)
  BM_LayerTypeUnsupported,   // 12: adjustment   (unsupported)
  BM_LayerTypeUnsupported,   // 13: camera       (unsupported)
  BM_LayerTypeUnsupported    // 14: light        (unsupported)
]

const BM_LayerTypeSupportedByTelegram = [
	true,  //  0: precomp
  false, //  1: solid
  false, //  2: still (aka image)
  true,  //  3: null layer
  true,  //  4: shape
  "text_format", //  5: text
  false, //  6: audio        (unsupported)
  false, //  7: pholderVideo (unsupported)
  false, //  8: imageSeq     (unsupported)
  false, //  9: video        (unsupported)
  false, // 10: pholderStill (unsupported)
  false, // 11: guide        (unsupported)
  undefined, // 12: adjustment   (unsupported)
  undefined, // 13: camera       (unsupported)
  undefined  // 14: light        (unsupported)
]

const BM_LayerTypeUnsupportedIcon = "report";
const BM_LayerTypeIcons = [
  "collections", //  0: precomp
  "texture",     //  1: solid
  "image",       //  2: still (aka image)
  "crop_free",   //  3: null layer
  "star",        //  4: shape
  "text_format", //  5: text
  BM_LayerTypeUnsupportedIcon, //  6: audio        (unsupported)
  BM_LayerTypeUnsupportedIcon, //  7: pholderVideo (unsupported)
  BM_LayerTypeUnsupportedIcon, //  8: imageSeq     (unsupported)
  BM_LayerTypeUnsupportedIcon, //  9: video        (unsupported)
  BM_LayerTypeUnsupportedIcon, // 10: pholderStill (unsupported)
  BM_LayerTypeUnsupportedIcon, // 11: guide        (unsupported)
  BM_LayerTypeUnsupportedIcon, // 12: adjustment   (unsupported)
  BM_LayerTypeUnsupportedIcon, // 13: camera       (unsupported)
  BM_LayerTypeUnsupportedIcon  // 14: light        (unsupported)
];
