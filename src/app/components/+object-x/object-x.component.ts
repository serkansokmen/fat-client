import { Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  fabric,
  Canvas,
  StaticCanvas,
  Image
} from 'fabric';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { ObjectXState } from '../../reducers/object-x.reducer';
import { ObjectXActions } from '../../actions/object-x.actions';
import { ObjectX, ObjectXType, DrawMode } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';

@Component({
  selector: 'fat-object-x',
  templateUrl: './object-x.component.html',
  styleUrls: ['./object-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ObjectXActions]
})
export class ObjectXComponent implements OnInit, AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  objectX$: Observable<ObjectXState>;
  objects: ObjectX[];
  visibleObjectTypes: ObjectXType[];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;

  private canvas: Canvas;
  private context: CanvasRenderingContext2D;
  private subscriptions: any[] = [];

  private selectedObjectType;
  private isStarted;
  private drawX: number;
  private drawY: number;
  private fabricImage: any;

  constructor(
    public store: Store<AnnotateState>,
    public actions: AnnotateActions,
    public objectXStore: Store<ObjectXState>,
    public objectXActions: ObjectXActions,
    private route: ActivatedRoute,
  )
  {
    this.annotate$ = store.select('annotate');
    this.objectX$ = objectXStore.select('objectX');
    this.objects = [];
    this.visibleObjectTypes = [];
  }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      if (params.image_id) {
        this.store.dispatch(this.actions.requestImage(params.image_id));
      }
      if (params.annotation_id) {
        this.store.dispatch(this.actions.requestAnnotation(params.annotation_id));
      }
    }));
  }

  ngAfterViewInit() {

    this.canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      isDrawingMode: false,
    });
    this.context = this.canvas.getContext('2d');

    const annotateSubscription = this.annotate$.subscribe(state => {
      if (state.selectedImage && !this.fabricImage) {
        fabric.Image.fromURL(state.selectedImage.flickr_url, (img) => {
          this.fabricImage = img
          img.lockRotation = true;
          img.lockUniScaling = true;
          this.canvas.setBackgroundImage(img,
            this.canvas.renderAll.bind(this.canvas));
          this.canvas.setWidth(img.width);
          this.canvas.setHeight(img.height);
        });
        this.objectXStore.dispatch(this.objectXActions.setDrawMode(DrawMode.add));
      }
    });

    const objectXSubscription = this.objectX$.subscribe((state: ObjectXState) => {

      this.selectedObjectType = state.selectedObjectType;
      this.visibleObjectTypes = state.visibleObjectTypes;
      this.objects = state.objects;

      this.canvas.off('mouse:down');
      this.canvas.off('mouse:move');
      this.canvas.off('mouse:up');
      this.canvas.off('object:modified');
      this.canvas.off('object:selected');
      this.canvas.clear();
      this.canvas.setBackgroundImage(this.fabricImage,
        this.canvas.renderAll.bind(this.canvas));

      let objects = state.objects.filter(object => this.visibleObjectTypes.indexOf(object.type) > -1);
      for (let object of objects) {
        let graphics = object.graphics;
        object.graphics.off('selected');
        graphics.lockRotation = true;
        graphics.lockMovementX = false;
        graphics.lockMovementY = false;
        graphics.lockScalingY = false;
        graphics.lockScalingY = false;
        graphics.lockUniScaling = false;
        this.canvas.add(graphics);
      }

      if (state.selectedObject) {
        this.canvas.setActiveObject(state.selectedObject.graphics);
      }
      this.canvas.renderAll();

      switch (state.drawMode) {
        case DrawMode.add:
          this.canvas.on('mouse:down', (event) => { this.onAddCanvasMouseDown(event); });
          this.canvas.on('mouse:move', (event) => { this.onAddCanvasMouseMove(event); });
          this.canvas.on('mouse:up', (event) => { this.onAddCanvasMouseUp(event); });
          break;
        case DrawMode.remove:
          // for (let object of this.canvas.getObjects()) {
          //   object.set('selectable', true);
          //   object.set('selected', false);
          // }
          this.canvas.on('object:selected', (event) => { this.onRemoveCanvasMouseDown(event); });
          break;
        case DrawMode.edit:
          // for (let object of this.canvas.getObjects()) {
          //   object.set('selectable', true);
          //   object.set('selected', false);
          // }
          this.canvas.on('object:modified', (event) => { this.onEditCanvasMouseDown(event); });
          break;
        default: break;
      }
    });

    this.subscriptions = [annotateSubscription, objectXSubscription];
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }

  isTypeVisible(type?: ObjectXType) {
    return this.visibleObjectTypes.indexOf(type) > -1;
  }

  getTypeCount(type: ObjectXType) {
    return this.objects.filter(object => object.type == type).length;
  }

  onAddCanvasMouseDown(event) {
    this.isStarted = true;
    var pointer = this.canvas.getPointer(event.e);
    this.drawX = pointer.x;
    this.drawY = pointer.y;

    var rect = new fabric.Rect({
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
    let graphics = new fabric.Group();
    graphics.addWithUpdate(new fabric.Rect({
      left: graphics.getLeft(),
      top: graphics.getTop(),
      width: rect.getWidth(),
      height: rect.getHeight(),
      originX: 'center',
      originY: 'center',
      fill: this.selectedObjectType.color,
      stroke: 'transparent',
      opacity: 0.25
    }));
    graphics.addWithUpdate(new fabric.Text(this.selectedObjectType.name, {
      fontFamily: 'Arial',
      fontSize: (rect.getWidth() + rect.getHeight()) / 20,
      fill: this.selectedObjectType.color,
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    }));
    graphics.set('top', rect.getTop());
    graphics.set('left', rect.getLeft());

    this.canvas.remove(rect);
    this.canvas.add(graphics);
    this.canvas.renderAll();

    let object = new ObjectX(graphics, this.selectedObjectType);
    object.graphics = graphics;
    // graphics.off('selected');
    // graphics.on('selected', (e) => {
    //   this.store.dispatch(this.actions.selectObject(object));
    // });
    // this.canvas.setActiveObject(graphics);
    this.objectXStore.dispatch(this.objectXActions.addObject(object));
    this.objectXStore.dispatch(this.objectXActions.setVisibleObjectTypes(object.type, true));
  }

  onRemoveCanvasMouseDown(event) {
    let graphics = this.canvas.getActiveObject();
    this.canvas.remove(graphics);
    this.objectXStore.dispatch(this.objectXActions.removeObject(graphics));
  }

  onEditCanvasMouseDown(event) {
    let graphics = this.canvas.getActiveObject();
    if (graphics) {
      let object = new ObjectX(graphics, this.selectedObjectType);
      this.objectXStore.dispatch(this.objectXActions.updateObject(object, graphics));
    }
  }

  handleNext() {
    console.log('wip');
  }
}
