import { Injectable } from '@angular/core';

@Injectable()
export class FiltersService {

  private tmpCanvas: HTMLCanvasElement;
  private tmpCtx: CanvasRenderingContext2D;

  constructor() {
    this.tmpCanvas = document.createElement('canvas');
    this.tmpCtx = this.tmpCanvas.getContext('2d');
  }

  getPixels(image: HTMLImageElement, scale: number) {
    return new Promise((resolve, reject) => {
      var c, ctx;
      if (!ctx) {
        c = this.getCanvas(image.width, image.height);
        ctx = c.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);
      }
      resolve(ctx.getImageData(0,0,c.width,c.height));
    });
  }

  createImageData(w: number, h: number) {
    return this.tmpCtx.createImageData(w, h);
  }

  getCanvas(w: number, h: number) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  threshold(pixels, threshold, high, low) {
    var output = this.createImageData(pixels.width, pixels.height);
    if (high == null) high = 255;
    if (low == null) low = 0;
    var d = pixels.data;
    var dst = output.data;
    for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
      var v = (0.3*r + 0.59*g + 0.11*b >= threshold) ? high : low;
      dst[i] = dst[i+1] = dst[i+2] = v;
      dst[i+3] = d[i+3];
    }
    return output;
  }

  toCanvas(pixels) {
    var canvas = this.getCanvas(pixels.width, pixels.height);
    canvas.getContext('2d')
      .putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
    return canvas;
  }

  toImageData(pixels) {
    return this.identity(pixels);
  }

  identity(pixels, args: any = null) {
    var output = this.createImageData(pixels.width, pixels.height);
    var dst = output.data;
    var d = pixels.data;
    for (var i=0; i<d.length; i++) {
      dst[i] = d[i];
    }
    return output;
  }

}
