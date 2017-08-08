import { Component,
  Inject,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  fabric,
  Canvas,
  Image
} from 'fabric';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { ObjectX, ObjectXType, DrawMode, Gender, AgeGroup, objectTypes, genders, ageGroups } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';
import { FlickrService } from '../../services/flickr.service';
import { without } from 'underscore';


@Component({
  selector: 'fat-object-x',
  templateUrl: './object-x.component.html',
  styleUrls: ['./object-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectXComponent implements OnInit, AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;

  objects: ObjectX[] = [];
  objectTypes: ObjectXType[] = objectTypes;
  visibleTypes: ObjectXType[] = objectTypes;
  genders: Gender[];
  ageGroups: AgeGroup[];

  selectedObjectType = objectTypes[0];
  drawMode: DrawMode = DrawMode.add;
  drawModes: DrawMode[] = [DrawMode.add, DrawMode.remove, DrawMode.edit];
  zoom: number = 1.0;
  isShowingOriginal: boolean = true;

  public canvas: Canvas;
  private context: CanvasRenderingContext2D;
  private subscriptions: any[] = [];

  private isStarted;
  private drawX: number;
  private drawY: number;
  private fabricImage: any;
  private params: any;
  private annotation: any;

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
    public store: Store<AnnotateState>,
    public actions: AnnotateActions,
    private route: ActivatedRoute,
    private service: FlickrService,
    private zone: NgZone,
    private ref: ChangeDetectorRef,
  )
  {
    this.annotate$ = store.select('annotate');
    this.genders = genders;
    this.ageGroups = ageGroups;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      isDrawingMode: false,
    });

    this.context = this.canvas.getContext('2d');

    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.off('mouse:up');
    this.canvas.off('object:modified');
    this.canvas.off('object:selected');

    this.canvas.setZoom(this.zoom);
    this.setDrawMode(DrawMode.add);
    this.canvas.renderAll();

    const annotateSubscription = this.annotate$.subscribe(state => {
      this.annotation = state.annotation;
      if (state.selectedImage && !this.fabricImage) {
        fabric.Image.fromURL(state.selectedImage.flickr_url, (img) => {
          this.fabricImage = img
          img.lockRotation = true;
          img.lockUniScaling = true;
          this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
          this.canvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight - 130});
        });
        if (state.annotation && state.annotation.marked_objects && state.annotation.marked_objects.length > 0) {
          state.annotation.marked_objects
            .map(data => new ObjectX(data))
            .map(objectX => {
              this.canvas.add(objectX.graphics);
              this.objects.push(objectX);
            });
        } else {
          this.objects = [];
        }
        this.canvas.renderAll();
      }
    });

    this.subscriptions.push(this.route.params.subscribe(params => {
      this.params = params;
      if (params.image_id) {
        this.store.dispatch(this.actions.requestImage(params.image_id));
      }
      if (params.annotation_id) {
        this.store.dispatch(this.actions.requestAnnotation(params.annotation_id));
      }
    }));

    this.subscriptions = [annotateSubscription];
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }

  setDrawMode(mode: DrawMode) {

    this.drawMode = mode;
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.off('mouse:up');
    this.canvas.off('object:selected');
    this.canvas.off('object:modified');
    switch (this.drawMode) {
      case DrawMode.add:
        this.canvas.on('mouse:down', (event) => { this.onAddCanvasMouseDown(event); });
        this.canvas.on('mouse:move', (event) => { this.onAddCanvasMouseMove(event); });
        this.canvas.on('mouse:up', (event) => { this.onAddCanvasMouseUp(event); });
        break;
      case DrawMode.remove:
        this.canvas.on('object:selected', (event) => { this.onRemoveCanvasMouseDown(event); });
        break;
      case DrawMode.edit:
        this.canvas.on('object:modified', (event) => { this.onEditCanvasMouseDown(event); });
        break;
      default: break;
    }
  }

  toggleObjectTypeVisible(type, isVisible) {
    this.objects.map(o => {
      o.type == type ? o.graphics.set('visible', isVisible) : null;
    });
  }

  getTypeCount(type: ObjectXType) {
    return this.objects.filter(object => object.type == type).length;
  }

  onAddCanvasMouseDown(event) {
    this.isStarted = true;
    const pointer = this.canvas.getPointer(event.e);
    this.drawX = pointer.x;
    this.drawY = pointer.y;

    let rect = new fabric.Rect({
      width: 0,
      height: 0,
      left: this.drawX,
      top: this.drawY,
      fill: 'transparent',
      stroke: this.selectedObjectType.color,
      selectable: false
    });
    this.canvas.add(rect);
    this.canvas.renderAll();
    this.canvas.setActiveObject(rect);
  }

  onAddCanvasMouseMove(event) {
    if (!this.isStarted) {
      return;
    }
    let pointer = this.canvas.getPointer(event.e);
    let x = Math.min(pointer.x,  this.drawX);
    let y = Math.min(pointer.y,  this.drawY);
    let width = Math.abs(pointer.x - x);
    let height = Math.abs(pointer.y - y);

    if (!width || !height) {
      return;
    }

    let rect = this.canvas.getActiveObject();
    rect.set('width', width).set('height', height);
    rect.set('top', y);
    rect.set('left', x);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
  }

  onAddCanvasMouseUp(event) {
    if (this.isStarted) {
      this.isStarted = false;
    }
    let rect = this.canvas.getActiveObject();
    if (!rect || (rect.getWidth() <= 5 || rect.getHeight() <= 5)) {
      this.canvas.remove(rect);
      return;
    }
    const objectX = new ObjectX({
      object_type: this.selectedObjectType.id,
      width: rect.getWidth(),
      height: rect.getHeight(),
      x: rect.getLeft(),
      y: rect.getTop(),
      gender: null,
      age_group: null,
    });

    this.canvas.remove(rect);
    this.canvas.add(objectX.graphics);
    this.canvas.setActiveObject(objectX.graphics);
    this.canvas.renderAll();

    this.objects.push(objectX);
    this.ref.detectChanges();
  }

  onRemoveCanvasMouseDown(event) {
    let graphics = this.canvas.getActiveObject();
    this.canvas.remove(graphics);
    this.objects = this.objects.filter(o => {
      return o.graphics != graphics;
    });
    this.ref.detectChanges();
  }

  onEditCanvasMouseDown(event) {
    let graphics = this.canvas.getActiveObject();
    if (graphics) {
      this.objects.map(o => {
        if (o.graphics == graphics) {
          o.graphics = graphics;
        }
      });
    }
    this.ref.detectChanges();
  }

  handleNext() {
    this.store.dispatch(
      this.actions.updateAnnotationMarkedObjects(
        this.annotation, this.objects));
  }
}
