import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fabric, Canvas, StaticCanvas, Image } from 'fabric';

@Injectable()
export class ArtboardService {

  constructor() { }

  loadImage(src: string): Promise<Image> {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(src, (img) => {
        img.lockRotation = true;
        img.lockUniScaling = true;
        resolve(img);
      }, (error) => {
        reject(error);
      });
    });
  }

  createCanvas(element: HTMLElement, isStatic: boolean, options: any): Promise<any> {
    let _constructor = isStatic ? fabric.StaticCanvas : fabric.Canvas;
    return new Promise((resolve, reject) => resolve(_constructor(element, options)));
  }

}
