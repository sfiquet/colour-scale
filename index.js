import chromaCalc from './chromacalc.js';
import chromaLchCalc from './chromalchcalc.js';
import acColorsCalc from './ac-colorscalc.js';
import acColorsLchCalc from './ac-colorslchcalc.js';
const calcLibraries = [
  {label: 'LCh chroma interpolation with chroma.js', lib: chromaLchCalc}, 
  {label: 'LCh chroma interpolation with ac-colors.js', lib: acColorsLchCalc}, 
  {label: 'Lab and RGB clipping with chroma.js', lib: chromaCalc}, 
  {label: 'Lab and RGB clipping with ac-colors', lib: acColorsCalc},
];

const HUES = [
  {name: 'grey'},
  {name: 'red', hex: '#ff0000'}, 
  {name: 'orange', hex: '#ff8000'}, 
  {name: 'yellow', hex: '#ffff00'}, 
  {name: 'lime green', hex: '#80ff00'}, 
  {name: 'green', hex: '#00ff00'}, 
  {name: 'blue-green', hex: '#00ff80'}, 
  {name: 'cyan', hex: '#00ffff'}, 
  {name: 'sky blue', hex: '#0080ff'}, 
  {name: 'blue', hex: '#0000ff'}, 
  {name: 'purple', hex: '#8000ff'}, 
  {name: 'magenta', hex: '#ff00ff'}, 
  {name: 'pink', hex: '#ff0080'},
];

window.onload = (e) => {
  let calculatePalette = (lstarScale, lib) => HUES.reduce((accObj, hue) => {
    if (hue.name === 'grey'){
      accObj[hue.name] = lib.createGreyScale(lstarScale);
    } else {
      accObj[hue.name] = lib.createColourScale(hue.hex, lstarScale);
    }
    return accObj;
  }, {});

  let calculateAllPalettes = () => {
    // l* is perceptual lightness. It's non-linear to reflect human perception.
    // it's the l* in CIEl*a*b*
    // it's different from luminance, which is linear and expresses the amount of photons.
    let lstarScale = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    return calcLibraries.map(libObj => ({label: libObj.label, data: calculatePalette(lstarScale, libObj.lib)}));
  };

  let initPalette = (paletteNode, palette) => {
    let fragment = new DocumentFragment();

    let title = document.createElement('h2');
    title.innerText = palette.label;
    fragment.appendChild(title);
    
    HUES.forEach(hue => {
      let row = document.createElement('div');
      row.className = 'row';
      
      let name = document.createElement('div');
      name.innerText = hue.name;
      name.className = 'hue-name';
      row.appendChild(name);
      
      let scale = document.createElement('div');
      scale.className = 'hue-scale';
      row.appendChild(scale);
      

      palette.data[hue.name].forEach(cssColour => {
        let swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = cssColour;
        scale.appendChild(swatch);
      });
      
      fragment.appendChild(row);
    });
    
    paletteNode.appendChild(fragment);
  };
  
  let renderPalette = palette => {
    let paletteNode = document.createElement('div');
    
    paletteNode.className = 'palette';
    initPalette(paletteNode, palette);

    return paletteNode;
  };

  let renderAllPalettes = palettes => {
    // work in a fragment to avoid triggering intermediate renders
    let fragment = new DocumentFragment();

    // create an element and its children for each palette
    palettes.forEach(palette => {
      let el = renderPalette(palette);
      fragment.appendChild(el);
    });

    // attach to container, triggering the re-render
    let container = document.getElementById('container');
    container.appendChild(fragment);
  };

  let init = () => {
    const palettes = calculateAllPalettes();
    renderAllPalettes(palettes);
  };
  
  // Generate the colour swatches
  init();    
};
