const chroma = require('chroma-js');
const chromaCalc = require('./chromacalc');

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
    
    let chromaLabCombine = (colour, lstar) => {
      let labCol = chroma(colour).lab();
      console.log(labCol);
      let res = chroma.lab(lstar * 100, labCol[1], labCol[2]);
      /*if (res.clipped()){
        res = chroma.lab(lstar * 100, 0, 0);
      }*/
      return res;
    };
    
    let createPalette = lstarScale => ({
      grey: lstarScale.map(lstar => chroma.lab(lstar * 100, 0, 0).hex()),

      red: lstarScale.map(lstar => chromaLabCombine('red', lstar).hex()),
      yellow: lstarScale.map(lstar => chromaLabCombine('yellow', lstar).hex()),
      blue: lstarScale.map(lstar => chromaLabCombine('blue', lstar).hex()),
    });

    let createPalettes = () => {
      // l* is perceptual lightness. It's non-linear to reflect human perception.
      // it's the l* in CIEl*a*b*
      // it's different from luminance, which is linear and expresses the amount of photons.
      let lstarScale = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1];
      let chromaPalette = createPalette(lstarScale);
      console.log(chromaPalette);

      let container = document.getElementById('container');
      let fragment = new DocumentFragment();

      // chroma palette
      let paletteNode = document.createElement('div');
      paletteNode.className = 'palette';
      paletteNode.id = 'chromaPalette';
      fragment.appendChild(paletteNode);
      initPalette(paletteNode, chromaPalette);

      container.appendChild(fragment);
    };

    let init = () => {
      // debug
      let col;
      col = chromaLabCombine('blue', 0);
      console.log(col, col.clipped());
      col = chromaLabCombine('blue', .5);
      console.log(col, col.clipped());

      createPalettes();
//      render();      
    };
    
    // Generate the colour swatches
    init();    
  };
  
})();

