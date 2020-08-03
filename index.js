const chroma = require('chroma-js');
import chromaCalc from './chromacalc.js';

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
    
    let chromaLabCombine = (colour, lstar) => {
      let labCol = chroma(colour).lab();
      console.log(labCol);
      let res = chroma.lab(lstar, labCol[1], labCol[2]);
      /*if (res.clipped()){
        res = chroma.lab(lstar, 0, 0);
      }*/
      return res;
    };

/*
    let calculatePalette = lstarScale => ({
      grey: lstarScale.map(lstar => chroma.lab(lstar, 0, 0).hex()),

      red: lstarScale.map(lstar => chromaLabCombine('red', lstar).hex()),
      yellow: lstarScale.map(lstar => chromaLabCombine('yellow', lstar).hex()),
      blue: lstarScale.map(lstar => chromaLabCombine('blue', lstar).hex()),
    });
    */
    let calculatePalette = lstarScale => ({
      grey: chromaCalc.createGreyScale(lstarScale),

      red: chromaCalc.createColourScale('red', lstarScale),
      yellow: chromaCalc.createColourScale('yellow', lstarScale),
      blue: chromaCalc.createColourScale('blue', lstarScale),
    });

    let calculateAllPalettes = () => {
      // l* is perceptual lightness. It's non-linear to reflect human perception.
      // it's the l* in CIEl*a*b*
      // it's different from luminance, which is linear and expresses the amount of photons.
      let lstarScale = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

      let chromaPalette = calculatePalette(lstarScale);
      console.log(chromaPalette);

      return [chromaPalette];
    };

    let initPalette = (paletteNode, palette) => {
      let fragment = new DocumentFragment();
      
//      let hues = ['red', 'orange', 'yellow', 'lime green', 'green', 'blue-green', 'cyan', 'sky blue', 'blue', 'purple', 'magenta', 'pink'];
      let hues = ['grey', 'red', 'yellow', 'blue'];
      
      hues.forEach((hue, id) => {
        let row = document.createElement('div');
        row.className = 'row';
        
        let name = document.createElement('div');
        name.innerText = hues[id];
        name.className = 'hue-name';
        row.appendChild(name);
        

        palette[hue].forEach(cssColour => {
          let swatch = document.createElement('div');
          swatch.className = 'swatch';
          swatch.style.backgroundColor = cssColour;
          row.appendChild(swatch);
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

