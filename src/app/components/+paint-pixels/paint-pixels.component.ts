import { Component,
  Inject,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  fabric,
  Canvas,
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
  selector: 'fat-paint-pixels',
  templateUrl: './paint-pixels.component.html',
  styleUrls: ['./paint-pixels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaintPixelsComponent implements OnInit, AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  artboard$: Observable<ArtboardState>;

  undoCount: number = 0;
  repeatCount: number = 0;

  artboardTools = [ArtboardTool.polygon, ArtboardTool.lasso, ArtboardTool.brush];

  private canvas: Canvas;
  private maskGroup: Group;
  private fabricImage: any;

  private context: CanvasRenderingContext2D;
  private subscriptions: any[] = [];
  private resultSubject = new Subject<any>();
  private undoItems: any[] = [];
  private repeatItems: any[] = [];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.setDimensions({
      width: event.target.innerWidth,
      height: event.target.innerHeight - 130});
    this.canvas.renderAll();
  }

  constructor(
    @Inject('Window') window: Window,
    public annotateStore: Store<AnnotateState>,
    public annotateActions: AnnotateActions,
    public artboardStore: Store<ArtboardState>,
    public artboardActions: ArtboardActions,
    private route: ActivatedRoute,
    private zone: NgZone,
  )
  {
    this.annotate$ = annotateStore.select('annotate');
    this.artboard$ = artboardStore.select('artboard');

    this.subscriptions.push(this.resultSubject);
  }

  undo() {
    let path = this.undoItems.pop();
    if (path) {
      this.repeatItems.push(path);
      this.maskGroup.remove(path);
      this.canvas.renderAll();
      this.refreshHistoryCounts();
    }
  }

  repeat() {
    let path = this.repeatItems.pop();
    if (path) {
      this.undoItems.push(path);
      this.maskGroup.add(path);
      this.canvas.renderAll();
      this.refreshHistoryCounts();
    }
  }

  private refreshHistoryCounts() {
    this.undoCount = this.undoItems.length;
    this.repeatCount = this.repeatItems.length;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    this.canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      backgroundColor: 'white'
    });
    this.context = this.canvas.getContext('2d');

    this.subscriptions.push(this.route.params.subscribe(params => {
      if (params.image_id) {
        this.annotateStore.dispatch(this.annotateActions.requestImage(params.image_id));
        this.subscriptions.push(this.annotate$.subscribe((state: AnnotateState) => {
          if (state.selectedImage) {
            this.handleAnnotate(state.selectedImage);
          }
        }));
        this.subscriptions.push(this.artboard$.subscribe((state: ArtboardState) => {
          this.handleArtboard(state);
        }));
      } else {
        this.annotateStore.dispatch(this.annotateActions.deselectImage());
      }
    }));
  }

  handleAnnotate(image: FlickrImage) {

    this.canvas.clear();
    this.canvas.isDrawingMode = true;
    this.canvas.setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 130});
    this.canvas.renderAll();
    this.fabricImage = null;

    fabric.Image.fromURL(image.flickr_url, (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      img.selectable = false;
      this.fabricImage = img;
      this.canvas.setBackgroundImage(this.fabricImage,
        this.canvas.renderAll.bind(this.canvas));

      this.maskGroup = new fabric.Group();
      this.maskGroup.globalCompositeOperation = 'source-over';
      this.maskGroup.setWidth(img.getWidth());
      this.maskGroup.setHeight(img.getHeight());
      this.maskGroup.set({ fill: 'transparent', opacity: 0.5 });
      this.canvas.add(this.maskGroup);
      this.canvas.renderAll();

    }, { crossOrigin: 'Anonymous' });
  }

  handleArtboard(state: ArtboardState) {
    this.canvas.setZoom(state.zoom);
    this.canvas.off('path:created');

    if (this.fabricImage) {
      this.fabricImage.set({ visible: state.isShowingOriginal });
    }
    const brushColor = state.isAdding ? 'rgba(0,255,0,0.5)' : 'rgba(255,0,0,0.5)';
    const fillColor = state.isAdding ? 'rgba(0,255,0,1)' : 'black';

    this.canvas.isDrawingMode = state.currentTool != ArtboardTool.polygon;
    this.canvas.freeDrawingBrush.color = brushColor;
    this.canvas.freeDrawingBrush.width = state.currentTool == ArtboardTool.brush ? state.brushRadius : 1.0;
    this.canvas.on('path:created', (options) => {

      this.zone.runOutsideAngular(() => {
        let path = options.path;
        path.lockRotation = true;
        path.lockUniScaling = true;
        path.selectable = false;
        path.globalCompositeOperation = state.isAdding ? 'source-over' : 'destination-out';
        let pathColor = state.isAdding ? 'rgba(0,255,0,1.0)' : 'rgba(255,0,0,1.0)';
        switch (state.currentTool) {
          case ArtboardTool.polygon:
            break;
          case ArtboardTool.lasso:
            path.set({ fill: pathColor, stroke: 'transparent' });
            break;
          case ArtboardTool.brush:
            path.set({ fill: 'transparent', stroke: pathColor });
            break;

          default:
            break;
        }
        this.maskGroup.addWithUpdate(path);
        this.canvas.remove(path);
        this.canvas.renderAll();

        this.zone.run(() => {
          this.undoItems.push(path);
          this.repeatItems = [];
          this.refreshHistoryCounts();
        });
      });
    });

  }

  handleNext() {
    if (window.confirm('Are you sure you are finished woth your annotation?')) {
      const hideBg = () => {
        this.canvas.backgroundImage = null;
      };
      const showBg = () => {
        this.canvas.backgroundImage = this.fabricImage;
      };
      this.canvas.on('before:render', hideBg);
      this.canvas.on('after:render', showBg);
      this.canvas.deactivateAll();
      const zoom = this.canvas.getZoom();
      this.canvas.setZoom(1.0);
      this.annotateStore.dispatch(
        this.annotateActions.createAnnotation(
          this.canvas.toDataURL({
            format: 'png',
            left: 0,
            top: 0,
            multiplier: 1,
            width: this.fabricImage.getWidth(),
            height: this.fabricImage.getHeight(),
          })));
      this.canvas.setZoom(zoom);
      this.canvas.off('before:render', hideBg);
      this.canvas.off('after:render', showBg);
    }
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }
}
