import { Component,
  Inject,
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
  EventEmitter,
} from '@angular/core';
import {
  fabric,
  Canvas,
  Polygon,
  Group,
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
import { Image as FlickrImage } from '../../models/search.models';

@Component({
  selector: 'fat-skin-pixels',
  templateUrl: './skin-pixels.component.html',
  styleUrls: ['./skin-pixels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkinPixelsComponent implements AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  artboard$: Observable<ArtboardState>;


  artboardTools = [ArtboardTool.polygon, ArtboardTool.lasso, ArtboardTool.brush];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;
  @ViewChild('bgCanvas') bgCanvas: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.setDimensions({
      width: event.target.innerWidth,
      height: event.target.innerHeight});
    this.canvas.renderAll();
  }

  private canvas: Canvas;
  private maskGroup: Group;
  private fabricImage: any;

  private context: CanvasRenderingContext2D;
  private subscriptions: any[] = [];
  private resultSubject = new Subject<any>();

  constructor(
    @Inject('Window') window: Window,
    public annotateStore: Store<AnnotateState>,
    public annotateActions: AnnotateActions,
    public artboardStore: Store<ArtboardState>,
    public artboardActions: ArtboardActions,
    private zone: NgZone
  )
  {
    this.annotate$ = annotateStore.select('annotate');
    this.artboard$ = artboardStore.select('artboard');

    // this.resultSubject
    //   .debounceTime(800)
    //   .subscribe((resultImage) => {

    //   });
    this.subscriptions.push(this.resultSubject);
    this.annotateStore.dispatch(this.annotateActions.selectStep(0));
  }

  ngAfterViewInit() {

    this.canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      backgroundColor: 'white'
    });
    this.context = this.canvas.getContext('2d');

    this.subscriptions.push(this.annotate$.subscribe((state: AnnotateState) => {
      if (state.selectedImage) {
        this.handleAnnotate(state.selectedImage);
      }
    }));
    this.subscriptions.push(this.artboard$.subscribe((state: ArtboardState) => {
      this.handleArtboard(state);
    }));
  }

  handleAnnotate(image: FlickrImage) {

    this.canvas.clear();
    this.canvas.isDrawingMode = true;
    this.canvas.setDimensions({
      width: window.innerWidth,
      height: window.innerHeight});
    this.canvas.renderAll();

    // fabric.Image.fromURL(image.image, (img) => {
    fabric.Image.fromURL(image.flickr_url, (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      img.selectable = false;
      // if (img.width > img.height) {
      //   img.scaleToWidth(this.canvas.getWidth());
      // } else {
      //   img.scaleToHeight(this.canvas.getHeight());
      // }
      this.fabricImage = img;
      // this.canvas.setBackgroundImage(this.fabricImage,
      //   this.canvas.renderAll.bind(this.canvas));
      this.canvas.add(this.fabricImage);

      this.maskGroup = new fabric.Group();
      this.maskGroup.globalCompositeOperation = 'source-over';
      this.maskGroup.setWidth(this.canvas.getWidth());
      this.maskGroup.setHeight(this.canvas.getHeight());
      this.maskGroup.set({ fill: 'transparent' });
      this.canvas.add(this.maskGroup);
      this.canvas.renderAll();

    }, { crossOrigin: 'Anonymous' });
  }

  handleArtboard(state: ArtboardState) {
    this.canvas.setZoom(state.zoom);
    this.canvas.off('path:created');
    // canvas.off('mouse:up');

    if (this.fabricImage) {
      this.fabricImage.set({ visible: state.isShowingOriginal });
    }
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
    const brushColor = state.isAdding ? 'rgba(0,255,0,1)' : 'rgba(255,0,0,1)';
    const fillColor = state.isAdding ? 'rgba(0,255,0,1)' : 'black';

    this.canvas.isDrawingMode = state.currentTool != ArtboardTool.polygon;
    // this.context.globalCompositeOperation = state.isAdding ? 'xor' : 'destination-out';
    // this.context.fillStyle = fillColor;
    this.canvas.freeDrawingBrush.color = brushColor;
    this.canvas.freeDrawingBrush.width = state.currentTool == ArtboardTool.brush ? state.brushRadius : 1.0;
    this.canvas.on('path:created', (options) => {
      // this.store.dispatch(this.artboardActions.lassoPathCreated(options.path));
      let path = options.path;
      path.lockRotation = true;
      path.lockUniScaling = true;
      path.selectable = false;
      path.globalCompositeOperation = state.isAdding ? 'source-over' : 'destination-out';

      switch (state.currentTool) {

        case ArtboardTool.polygon:
          break;

        case ArtboardTool.lasso:
          path.set({ fill: fillColor, stroke: 'transparent' });
          break;

        case ArtboardTool.brush:
          path.set({ fill: 'transparent', stroke: fillColor });
          break;

        default:
          break;
      }

      this.maskGroup.addWithUpdate(path);
      this.canvas.renderAll();
    });

  }

  handleNext() {
    const hideBg = () => {
      // this.canvas.backgroundImage = null;
      this.fabricImage.set({ visible: false });
    };
    const showBg = () => {
      // this.canvas.backgroundImage = this.fabricImage;
      this.fabricImage.set({ visible: true });
    };
    this.canvas.on('before:render', hideBg);
    this.canvas.on('after:render', showBg);
    this.canvas.deactivateAll();
    this.annotateStore.dispatch(
      this.annotateActions.saveSkinPixels(
        this.canvas.toDataURL({
          format: 'png',
          left: 0,
          top: 0,
          width: this.fabricImage.width,
          height: this.fabricImage.height,
        })));
    this.canvas.off('before:render', hideBg);
    this.canvas.off('after:render', showBg);
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }
}
