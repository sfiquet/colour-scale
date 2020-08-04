const Color = require('ac-colors');

let isValidRGBValue = val => val >= 0 && val <= 255;
let isValidRGB = ([r, g, b]) => isValidRGBValue(r) && isValidRGBValue(g) && isValidRGBValue(b);
let clipRGBValue = val => Math.max(Math.min(val, 255), 0);
let clipRGB = ([r, g, b]) => [clipRGBValue(r), clipRGBValue(g), clipRGBValue(b)];

const calc = {
  setLightness: (colour, lstar) => {
    /*
    let labCol = chroma(colour).lab();
    console.log(labCol);
    let res = chroma.lab(lstar, labCol[1], labCol[2]);
    console.log(res);
    return res.hex();    
    */
  },
  createGreyScale: lstarScale => lstarScale.map(lstar => {
    let grey =  new Color({color: [lstar, 0, 0], type: 'lab'});
    return grey.hex;
  }),
  createColourScale: (hexColour, lstarScale) => {
    let hexCol = new Color({color: hexColour, type: 'hex'});
    let labArr = hexCol.lab;
    //console.log(labArr, hexCol.rgb, isValidRGB(hexCol.rgb));

    let scale = lstarScale.map(lstar => {
      let col = new Color({color: [lstar, labArr[1], labArr[2]], type: 'lab'});
      //console.log(col.lab, col.rgb);
      col.rgb = clipRGB(col.rgb);
      return isValidRGB(col.rgb) ? col.hex : undefined;
    });
    //console.log(scale);
    return scale;
  },
};

export default calc;