const Color = require('ac-colors');

let isValidRGBValue = val => val >= 0 && val <= 255;
let isValidRGB = ([r, g, b]) => isValidRGBValue(r) && isValidRGBValue(g) && isValidRGBValue(b);

let getValidRGB = (lstar, maxChroma, hue) => {
  let color = new Color({color: [lstar, maxChroma, hue], type: 'lchab'});
  if (isValidRGB(color.rgb)){
    return color;
  }

  // Assumption: For a given lightness and hue, at some point on the chroma axis 
  // the colour becomes invalid in RGB. We look for that point.
  // We use integers to avoid going too deep with the divisions.
  let min = 0;
  let max = Math.floor(maxChroma);
  let chr;
  while (min < max){
    chr = Math.floor((min + max + 1) / 2); // use integers to avoid going too deep with the divisions
    color.lchab = [lstar, chr, hue];
    if (!isValidRGB(color.rgb)){
      max = chr - 1; // exclude chr from the range, the colour is not valid
    } else {
      min = chr;
    }
  }
  color.lchab = [lstar, min, hue];
  return color;
}


const calc = {
  createGreyScale: lstarScale => lstarScale.map(lstar => {
    let grey =  new Color({color: [lstar, 0, 0], type: 'lab'});
    return grey.hex;
  }),
  createColourScale: (hexColour, lstarScale) => {
    let hexCol = new Color({color: hexColour, type: 'hex'});
    let lchArr = hexCol.lchab;
    //console.log(lchArr, hexCol.rgb, isValidRGB(hexCol.rgb));

    let scale = lstarScale.map(lstar => getValidRGB(lstar, lchArr[1], lchArr[2]).hex);
    //console.log(scale);
    return scale;
  },
};

export default calc;