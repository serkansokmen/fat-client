import { Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  SimpleChange,
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
  Polygon,
  Group
} from 'fabric';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { ArtboardState } from '../../reducers/artboard.reducer';
import { ArtboardActions } from '../../actions/artboard.actions';
import { ArtboardService } from '../../services/artboard.service';
import { ArtboardTool } from '../../models/artboard.models';
import { ImageService } from '../../services/image.service';
import { Image as FlickrImage } from '../../models/search.models';

@Component({
  selector: 'fat-skin-pixels-regions',
  templateUrl: './skin-pixels-regions.component.html',
  styleUrls: ['./skin-pixels-regions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkinPixelsRegionsComponent implements AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  artboard$: Observable<ArtboardState>;

  artboardTools = [ArtboardTool.polygon, ArtboardTool.lasso, ArtboardTool.brush];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;
  @ViewChild('bgCanvas') bgCanvas: ElementRef;

  onResize(event) {
    console.log(event.target.innerWidth);
  }

  private foregroundCanvas: Canvas;
  private backgroundCanvas: StaticCanvas;

  private canvasWidth: number;
  private canvasHeight: number;
  private canvasScale: number = 2.0;

  private context: CanvasRenderingContext2D;
  private subscriptions: any[];
  private resultSubject = new Subject<any>();

  constructor(
    public annotateStore: Store<AnnotateState>,
    public annotateActions: AnnotateActions,
    public artboardStore: Store<ArtboardState>,
    public artboardActions: ArtboardActions,
    private imageService: ImageService,
    private zone: NgZone
  )
  {
    this.annotate$ = annotateStore.select('annotate');
    this.artboard$ = artboardStore.select('artboard');

    Observable.fromEvent(window, 'resize')
      .debounceTime(800)
      .subscribe((event) => {
        this.onResize(event);
      });

    this.resultSubject
      .debounceTime(800)
      .subscribe((resultImage) => {
        this.annotateStore.dispatch(
          this.artboardActions.updateCanvasBase64(resultImage));
      });
    this.annotateStore.dispatch(this.annotateActions.selectStep(0));
  }

  handleNext() {
    this.annotateStore.dispatch(this.annotateActions.saveSkinPixelsImage());
  }

  ngAfterViewInit() {

    this.foregroundCanvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      // backgroundColor: 'white'
    });
    this.context = this.foregroundCanvas.getContext('2d');

    this.backgroundCanvas = new fabric.StaticCanvas(this.bgCanvas.nativeElement, {
      backgroundColor: 'black'
    });
    const annotateSubscription = this.annotate$.subscribe((state: AnnotateState) => {
      if (state.selectedImage) {
        this.initCanvas(state.selectedImage);
      }
    });
    const artboardSubscription = this.artboard$.subscribe((state: ArtboardState) => {
      this.handleCanvasRefresh(state);
    });
    this.subscriptions = [annotateSubscription, artboardSubscription];
  }

  initCanvas(image: FlickrImage) {

    this.foregroundCanvas.clear();
    this.foregroundCanvas.isDrawingMode = true;
    this.foregroundCanvas.on('mouse:down', (options) => {
      this.refreshMask();
    });

    fabric.Image.fromURL(image.image, (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      this.canvasWidth = img.width * this.canvasScale;
      this.canvasHeight = img.height * this.canvasScale;

      img.width = this.canvasWidth;
      img.height = this.canvasHeight;
      this.backgroundCanvas.setBackgroundImage(img);
      this.backgroundCanvas.setDimensions({
        width: this.canvasWidth,
        height: this.canvasHeight});
      this.backgroundCanvas.renderAll();

      this.foregroundCanvas.setDimensions({
        width: this.canvasWidth,
        height: this.canvasHeight});
      this.foregroundCanvas.renderAll();
      // this.refreshMask();

      // fabric.Image.fromURL('assets/photo_2017-06-06_06-45-14.png', (img) => {
      //   this.foregroundCanvas.add(img);
      //   img.width = this.backgroundCanvas.getWidth();
      //   img.height = this.backgroundCanvas.getHeight();
      //   setTimeout(() => {
      //     this.refreshMask();
      //   });
      // }, { crossOrigin: 'Anonymous' });
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
          this.resultSubject.next(this.foregroundCanvas.toDataURL('png'));
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
          this.resultSubject.next(this.foregroundCanvas.toDataURL('png'));
        });
        break;

      default:
        break;
    }
    // this.refreshMask();
    // });
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  refreshMask() {
    const imgData = this.context.getImageData(
      0, 0,
      this.foregroundCanvas.width,
      this.foregroundCanvas.height
    );
    const pixels: Uint8ClampedArray = imgData.data;
    const resultData = this.imageService.analyzePixels(pixels,
      this.foregroundCanvas.width,
      this.foregroundCanvas.height,
      this.canvasScale);
    const resultImage = new ImageData(resultData,
        this.foregroundCanvas.width,
        this.foregroundCanvas.height);
    this.context.putImageData(resultImage, 0, 0);
  }
}
