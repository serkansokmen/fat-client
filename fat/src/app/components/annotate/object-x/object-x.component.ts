import { Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  fabric,
  Canvas,
  StaticCanvas,
  Image
} from 'fabric';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { ObjectXState } from '../../../reducers/object-x.reducer';
import { ObjectXActions } from '../../../actions/object-x.actions';
import { ObjectX, ObjectXType, DrawMode } from '../../../models/object-x.models';

@Component({
  selector: 'fat-object-x',
  templateUrl: './object-x.component.html',
  styleUrls: ['./object-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ObjectXActions]
})
export class ObjectXComponent implements AfterViewInit, OnDestroy {

  state$: Observable<ObjectXState>;
  objects: ObjectX[];
  visibleObjectTypes: ObjectXType[];

  @ViewChild('drawCanvas') drawCanvas: ElementRef;
  @ViewChild('bgCanvas') bgCanvas: ElementRef;
  private canvas: Canvas;
  private context: CanvasRenderingContext2D;
  private subscription;

  private selectedObjectType;
  private isStarted;
  private drawX: number;
  private drawY: number;

  constructor(
    public store: Store<ObjectXState>,
    public actions: ObjectXActions
  )
  {
    this.state$ = store.select('objectX');
    this.objects = [];
    this.visibleObjectTypes = [];
  }

  ngAfterViewInit() {

    this.canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      isDrawingMode: false
    });
    var bgCanvas: StaticCanvas = new fabric.StaticCanvas(this.bgCanvas.nativeElement, {
      backgroundColor: 'black'
    });
    this.context = this.canvas.getContext('2d');

    fabric.Image.fromURL('https://c1.staticflickr.com/6/5595/14907092716_3223a57239_b.jpg', (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      bgCanvas.setWidth(img.width)
      bgCanvas.setHeight(img.height);
      bgCanvas.setBackgroundImage(img);
      bgCanvas.renderAll();

      this.canvas.setWidth(img.width);
      this.canvas.setHeight(img.height);
    });

    this.store.dispatch(this.actions.setDrawMode(DrawMode.add));
    this.subscription = this.state$.subscribe((state: ObjectXState) => {

      this.selectedObjectType = state.selectedObjectType;
      this.visibleObjectTypes = state.visibleObjectTypes;
      this.objects = state.objects;

      this.canvas.off('mouse:down');
      this.canvas.off('mouse:move');
      this.canvas.off('mouse:up');
      this.canvas.off('object:modified');
      this.canvas.off('object:selected');
      this.canvas.clear();

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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    this.store.dispatch(this.actions.addObject(object));
    this.store.dispatch(this.actions.setVisibleObjectTypes(object.type, true));
  }

  onRemoveCanvasMouseDown(event) {
    let graphics = this.canvas.getActiveObject();
    this.canvas.remove(graphics);
    this.store.dispatch(this.actions.removeObject(graphics));
  }

  onEditCanvasMouseDown(event) {
    let graphics = this.canvas.getActiveObject();
    if (graphics) {
      let object = new ObjectX(graphics, this.selectedObjectType);
      this.store.dispatch(this.actions.updateObject(object, graphics));
    }
  }
}
