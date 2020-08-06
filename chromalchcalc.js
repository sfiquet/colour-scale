const chroma = require('chroma-js');

let getValidRGB = (lstar, maxChroma, hue) => {
  let color = chroma.lch(lstar, maxChroma, hue);
  if (!color.clipped()){
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
    color = chroma.lch(lstar, chr, hue);
    if (color.clipped()){
      max = chr - 1; // exclude chr from the range, the colour is not valid
    } else {
      min = chr;
    }
  }
  return chroma.lch(lstar, min, hue);
}

const calc = {
  createGreyScale: lstarScale => lstarScale.map(lstar => chroma.lab(lstar, 0, 0).hex()),
  createColourScale: (colour, lstarScale) => {
    let [light, chr, hue] = chroma(colour).lch();

    let scale = lstarScale.map(lstar => getValidRGB(lstar, chr, hue).hex());
    return scale;
  },
};

export default calc;