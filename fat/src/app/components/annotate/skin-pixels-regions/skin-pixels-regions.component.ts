import { Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import {
  fabric,
  Canvas,
  StaticCanvas,
  Image,
  Polygon,
  Group
} from 'fabric';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { ArtboardState } from '../../../reducers/artboard.reducer';
import { ArtboardActions } from '../../../actions/artboard.actions';
import { ArtboardService } from '../../../services/artboard.service';
import { ArtboardTool } from '../../../models/artboard.models';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'fat-skin-pixels-regions',
  templateUrl: './skin-pixels-regions.component.html',
  styleUrls: ['./skin-pixels-regions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ArtboardActions,
    ArtboardService
  ]
})
export class SkinPixelsRegionsComponent implements OnInit, AfterViewInit, OnDestroy {

  state$: Observable<any>;
  artboardTools = [ArtboardTool.polygon, ArtboardTool.lasso, ArtboardTool.brush];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;
  @ViewChild('bgCanvas') bgCanvas: ElementRef;
  private context: CanvasRenderingContext2D;
  private subscription;

  constructor(
    public store: Store<ArtboardState>,
    public actions: ArtboardActions,
    private imageService: ImageService,
    private zone: NgZone
  )
  {
    this.state$ = store.select('artboard');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    var canvas: Canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      // backgroundColor: 'white'
    });
    canvas.isDrawingMode = true;
    canvas.on('mouse:down', (options) => {
      this.refreshMask();
    });
    this.context = canvas.getContext('2d');

    var bgCanvas: StaticCanvas = new fabric.StaticCanvas(this.bgCanvas.nativeElement, {
      backgroundColor: 'black'
    });

    fabric.Image.fromURL('https://c1.staticflickr.com/6/5595/14907092716_3223a57239_b.jpg', (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      bgCanvas.setWidth(img.width)
      bgCanvas.setHeight(img.height);
      bgCanvas.setBackgroundImage(img);
      bgCanvas.renderAll();

      canvas.setWidth(img.width);
      canvas.setHeight(img.height);
    });

    fabric.Image.fromURL('/assets/photo_2017-06-06_06-45-14.png', (img) => {
      canvas.add(img);
      setTimeout(() => {
        this.refreshMask();
      });
    });

    this.subscription = this.state$.subscribe((state: ArtboardState) => {

      // this.zone.runOutsideAngular(() => {
      canvas.setZoom(state.zoom);
      bgCanvas.setZoom(state.zoom);
      canvas.off('path:created');
      // canvas.off('mouse:up');

      // if (state.isDragging) {
      //   canvas.on('mouse:down', (options) => {
      //     console.log(options);
      //   });
      //   canvas.on('mouse:move', (options) => {
      //     console.log(options);
      //   });
      //   canvas.on('mouse:up', (options) => {
      //     console.log(options);
      //   });
      // }

      canvas.isDrawingMode = state.currentTool != ArtboardTool.polygon;

      switch (state.currentTool) {

        case ArtboardTool.polygon:
          break;

        case ArtboardTool.lasso:
          canvas.freeDrawingBrush.color = 'rgba(0,255,0,1)';
          canvas.freeDrawingBrush.width = 1.0;
          canvas.on('path:created', (options) => {
            // this.store.dispatch(this.actions.lassoPathCreated(options.path));
            let path = options.path;
            path.lockRotation = true;
            path.lockUniScaling = true;
            path.selectable = false;
            if (state.isAdding == true) {
              path.set({ fill: 'rgba(0,255,0,150)', stroke: 'transparent' });
            } else {
              path.set({ fill: 'black', stroke: 'transparent' });
            }
            canvas.add(path);
            this.refreshMask();
          });
          break;

        case ArtboardTool.brush:
          canvas.freeDrawingBrush.width = state.brushRadius;
          if (state.isAdding == true) {
            canvas.freeDrawingBrush.color = 'rgba(0,255,0,150)';
            canvas.set({ fill: 'transparent', stroke: 'rgba(0,255,0,150)' });
          } else {
            canvas.freeDrawingBrush.color = 'black';
          }
          canvas.on('path:created', (options) => {
            this.refreshMask();
          });
          break;

        default:
          break;
      }
      // this.refreshMask();
      // });

    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshMask() {
    let imgData = this.context.getImageData(
      0, 0,
      this.drawCanvas.nativeElement.width,
      this.drawCanvas.nativeElement.height
    );
    let pixels: Uint8ClampedArray = imgData.data;
    let resultData = this.imageService.analyzePixels(pixels,
      this.drawCanvas.nativeElement.width,
      this.drawCanvas.nativeElement.height);
    this.context.putImageData(resultData, 0, 0);
  }

}
