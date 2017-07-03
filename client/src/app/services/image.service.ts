import { Injectable } from '@angular/core';

@Injectable()
export class ImageService {

  constructor() { }

  loadImage(src: string): any {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = function(event) {
        resolve({
          width: img.width,
          height: img.height
        });
      }
      img.src = src;
    });
  }

  analyzePixels(pixels: Uint8ClampedArray, width: number, height: number): ImageData  {

    const visibleColor = { r: 0, g: 255, b: 0, a: 150 };
    const hiddenColor = { r: 0, g: 0, b: 0, a: 0 };

    for(let i = 0, n = pixels.length; i < n; i += 4) {
      let r = pixels[i];
      let g = pixels[i+1];
      let b = pixels[i+2];
      let a = pixels[i+3];
      if (r == 0 && g == 0 && b == 0) {
        pixels[i] = hiddenColor.r;
        pixels[i + 1] = hiddenColor.g;
        pixels[i + 2] = hiddenColor.b;
        pixels[i + 3] = hiddenColor.a;
      } else {
        pixels[i] = visibleColor.r;
        pixels[i + 1] = visibleColor.g;
        pixels[i + 2] = visibleColor.b;
        pixels[i + 3] = visibleColor.a;
      }
    }

    return new ImageData(pixels, width, height);
  }

}
