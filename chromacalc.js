const chroma = require('chroma-js');

const calc = {
  setLightness: (colour, lstar) => {
    let labCol = chroma(colour).lab();
    console.log(labCol);
    let res = chroma.lab(lstar * 100, labCol[1], labCol[2]);
    console.log(res);
    return res.hex();    
  },
  createGreyScale: (lstarScale) => lstarScale.map(lstar => chroma.lab(lstar * 100, 0, 0).hex()),
  createColourScale: (colour, lstarScale) => {
    let labCol = chroma(colour).lab();
    console.log(labCol);
    let scale = lstarScale.map(lstar => chroma.lab(lstar * 100, labCol[1], labCol[2]).hex());
    console.log(scale);
    return scale;
  },
};

export default calc;