import { Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  HostListener,
  Input,
  Output,
  ChangeDetectionStrategy,
  NgZone,
  EventEmitter
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
import { Image as FlickrImage } from '../../../models/search.models';
import { AnnotateState } from '../../../reducers/annotate.reducer';

import 'rxjs/add/observable/combineLatest';

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
export class SkinPixelsRegionsComponent implements AfterViewInit, OnDestroy {

  annotate$: Observable<any>;
  artboard$: Observable<any>;

  @Output('image')
  imageEmitter = new EventEmitter<FlickrImage>();

  private image: FlickrImage;

  artboardTools = [ArtboardTool.polygon, ArtboardTool.lasso, ArtboardTool.brush];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;
  @ViewChild('bgCanvas') bgCanvas: ElementRef;

  private foregroundCanvas: Canvas;
  private backgroundCanvas: StaticCanvas;

  private context: CanvasRenderingContext2D;
  private subscription;

  constructor(
    public artboardStore: Store<ArtboardState>,
    public annotateStore: Store<AnnotateState>,
    public artboardActions: ArtboardActions,
    private imageService: ImageService,
    private zone: NgZone
  )
  {
    this.artboard$ = artboardStore.select('artboard');
    this.annotate$ = annotateStore.select('annotate');
  }

  ngAfterViewInit() {

    this.subscription = Observable.combineLatest(this.artboard$, this.annotate$,
      (artboard, annotate) => Observable.of({
        artboard,
        annotate
      }))
      .subscribe((state: any) => {
        let annotateState = state.value.annotate;
        let artboardState = state.value.artboard;
        if (annotateState.selectedImage && (!this.image || this.image.id != annotateState.selectedImage.id)) {
          this.image = annotateState.selectedImage;
          this.initCanvas(this.image);
          this.handleCanvasRefresh(artboardState);
        }
      });

    // this.subscription = this.state$.subscribe((state: ArtboardState) => {

    //   this.initCanvas(state);

    // });
  }

  initCanvas(image: FlickrImage) {

    this.foregroundCanvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      // backgroundColor: 'white'
    });
    this.foregroundCanvas.clear();
    this.foregroundCanvas.isDrawingMode = true;
    this.foregroundCanvas.on('mouse:down', (options) => {
      this.refreshMask();
    });
    this.context = this.foregroundCanvas.getContext('2d');

    this.backgroundCanvas = new fabric.StaticCanvas(this.bgCanvas.nativeElement, {
      backgroundColor: 'black'
    });

    fabric.Image.fromURL(image.image, (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      this.backgroundCanvas.setWidth(img.width)
      this.backgroundCanvas.setHeight(img.height);
      this.backgroundCanvas.setBackgroundImage(img);
      this.backgroundCanvas.renderAll();

      this.foregroundCanvas.setWidth(img.width);
      this.foregroundCanvas.setHeight(img.height);
    }, { crossOrigin: 'Anonymous' });

    fabric.Image.fromURL(image.image, (img) => {
      this.foregroundCanvas.add(img);
      setTimeout(() => {
        this.refreshMask();
      });
    }, { crossOrigin: 'Anonymous' });
  }

  handleCanvasRefresh(state: ArtboardState) {
    // this.zone.runOutsideAngular(() => {
    this.foregroundCanvas.setZoom(state.zoom);
    this.backgroundCanvas.setZoom(state.zoom);
    this.foregroundCanvas.off('path:created');
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

    this.foregroundCanvas.isDrawingMode = state.currentTool != ArtboardTool.polygon;

    switch (state.currentTool) {

      case ArtboardTool.polygon:
        break;

      case ArtboardTool.lasso:
        this.foregroundCanvas.freeDrawingBrush.color = 'rgba(0,255,0,1)';
        this.foregroundCanvas.freeDrawingBrush.width = 1.0;
        this.foregroundCanvas.on('path:created', (options) => {
          // this.store.dispatch(this.artboardActions.lassoPathCreated(options.path));
          let path = options.path;
          path.lockRotation = true;
          path.lockUniScaling = true;
          path.selectable = false;
          if (state.isAdding == true) {
            path.set({ fill: 'rgba(0,255,0,150)', stroke: 'transparent' });
          } else {
            path.set({ fill: 'black', stroke: 'transparent' });
          }
          this.foregroundCanvas.add(path);
          this.refreshMask();
        });
        break;

      case ArtboardTool.brush:
        this.foregroundCanvas.freeDrawingBrush.width = state.brushRadius;
        if (state.isAdding == true) {
          this.foregroundCanvas.freeDrawingBrush.color = 'rgba(0,255,0,150)';
          this.foregroundCanvas.set({ fill: 'transparent', stroke: 'rgba(0,255,0,150)' });
        } else {
          this.foregroundCanvas.freeDrawingBrush.color = 'black';
        }
        this.foregroundCanvas.on('path:created', (options) => {
          this.refreshMask();
        });
        break;

      default:
        break;
    }
    // this.refreshMask();
    // });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshMask() {
    let imgData = this.context.getImageData(
      0, 0,
      this.foregroundCanvas.width,
      this.foregroundCanvas.height
    );
    let pixels: Uint8ClampedArray = imgData.data;
    let resultData = this.imageService.analyzePixels(pixels,
      this.foregroundCanvas.width,
      this.foregroundCanvas.height);
    this.context.putImageData(resultData, 0, 0);
  }

}
