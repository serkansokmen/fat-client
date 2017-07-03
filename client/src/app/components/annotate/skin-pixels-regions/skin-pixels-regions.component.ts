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

  artboardTools = [ArtboardTool.polygon, ArtboardTool.lasso, ArtboardTool.brush];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;
  @ViewChild('bgCanvas') bgCanvas: ElementRef;
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
        artboard: artboard.value,
        annotate: annotate.value
      }))
      .subscribe((state: any) => {
        console.log(this.artboard$, this.annotate$);
        console.log(state.value);
        // this.image = state.selectedImage;
        // if (state.selectedImage && this.image.id != state.selectedImage.id) {
        //   this.initCanvas();
        // }
      });

    // this.subscription = this.state$.subscribe((state: ArtboardState) => {

    //   this.initCanvas(state);

    // });
  }

  initCanvas(state?) {

    if (state.selectedImage == null) {
      return;
    }

    var canvas: Canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      // backgroundColor: 'white'
    });
    canvas.clear();
    canvas.isDrawingMode = true;
    canvas.on('mouse:down', (options) => {
      this.refreshMask();
    });
    this.context = canvas.getContext('2d');

    var bgCanvas: StaticCanvas = new fabric.StaticCanvas(this.bgCanvas.nativeElement, {
      backgroundColor: 'black'
    });

    fabric.Image.fromURL(Image.getImageURL(state.selectedImage), (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      bgCanvas.setWidth(img.width)
      bgCanvas.setHeight(img.height);
      bgCanvas.setBackgroundImage(img);
      bgCanvas.renderAll();

      canvas.setWidth(img.width);
      canvas.setHeight(img.height);
    });

    fabric.Image.fromURL(Image.getThumbnail(state.selectedImage), (img) => {
      canvas.add(img);
      setTimeout(() => {
        this.refreshMask();
      });
    });

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
