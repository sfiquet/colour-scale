import chromaCalc from './chromacalc.js';
import chromaLchCalc from './chromalchcalc.js';
import acColorsCalc from './ac-colorscalc.js';
const calcLibraries = [chromaCalc, chromaLchCalc, acColorsCalc];

(() => {
  window.onload = (e) => {
    /*
    let renderAnnotatedSwatch = (el, h, s, l) => {      
      el.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
      
      el.innerHTML = `<div>${h}</div> <div>${s}%</div> <div>${l}%</div>`;
      
      if (l < 40){
        el.style.color = `hsl(${h}, ${s}%, 100%)`;
      } else {
        el.style.color = `hsl(${h}, ${s}%, 0%)`;
      }

    };
    
    let renderPalette = () => {
      let sat = 100;
      let swatches = document.getElementsByClassName('swatch');
      Array.prototype.forEach.call(swatches, el => {
        renderAnnotatedSwatch(el, el.dataset.hue, sat, el.dataset.light);
      });
    };
        
    let render = () => {
      renderPalette();
    };
    */

    let calculatePalette = (lstarScale, lib) => ({
      grey: lib.createGreyScale(lstarScale),

      red: lib.createColourScale('#ff0000', lstarScale),
      orange: lib.createColourScale('#ff8000', lstarScale),
      yellow: lib.createColourScale('#ffff00', lstarScale),
      'lime green': lib.createColourScale('#80ff00', lstarScale),
      green: lib.createColourScale('#008000', lstarScale),
      'blue-green': lib.createColourScale('#00ff80', lstarScale),
      cyan: lib.createColourScale('#00ffff', lstarScale),
      'sky blue': lib.createColourScale('#0080ff', lstarScale),
      blue: lib.createColourScale('#0000ff', lstarScale),
      purple: lib.createColourScale('#8000ff', lstarScale),
      magenta: lib.createColourScale('#ff00ff', lstarScale),
      pink: lib.createColourScale('#ff0080', lstarScale),
    });

    let calculateAllPalettes = () => {
      // l* is perceptual lightness. It's non-linear to reflect human perception.
      // it's the l* in CIEl*a*b*
      // it's different from luminance, which is linear and expresses the amount of photons.
      let lstarScale = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

      return calcLibraries.map(lib => calculatePalette(lstarScale, lib));
    };

    let initPalette = (paletteNode, palette) => {
      let fragment = new DocumentFragment();
      
      let hues = ['grey', 'red', 'orange', 'yellow', 'lime green', 'green', 'blue-green', 'cyan', 'sky blue', 'blue', 'purple', 'magenta', 'pink'];
      
      hues.forEach((hue, id) => {
        let row = document.createElement('div');
        row.className = 'row';
        
        let name = document.createElement('div');
        name.innerText = hues[id];
        name.className = 'hue-name';
        row.appendChild(name);
        
        let scale = document.createElement('div');
        scale.className = 'hue-scale';
        row.appendChild(scale);
        

        palette[hue].forEach(cssColour => {
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
  
})();

