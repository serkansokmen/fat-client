import { Component,
  Inject,
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
  Image
} from 'fabric';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { ObjectXState, createGraphicFromRectangle } from '../../reducers/object-x.reducer';
import { ObjectXActions } from '../../actions/object-x.actions';
import { ObjectX, ObjectXType, DrawMode, Gender, AgeGroup } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';
import { FlickrService } from '../../services/flickr.service';

import 'rxjs/add/observable/combineLatest';

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
  objectTypes: ObjectXType[] = [];
  selectedObjectType?: ObjectXType;
  visibleObjectTypes: ObjectXType[];

  private canvas: Canvas;
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
    public objectXStore: Store<ObjectXState>,
    public objectXActions: ObjectXActions,
    private route: ActivatedRoute,
    private service: FlickrService,
  )
  {
    this.annotate$ = store.select('annotate');
    this.objectX$ = objectXStore.select('objectX');
    this.objects = [];
    this.visibleObjectTypes = [];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      isDrawingMode: false,
    });

    this.context = this.canvas.getContext('2d');

        const objectXSubscription = this.objectX$.subscribe((state: ObjectXState) => {

      if (!this.canvas) {
        return;
      }

      this.canvas.off('mouse:down');
      this.canvas.off('mouse:move');
      this.canvas.off('mouse:up');
      this.canvas.off('object:modified');
      this.canvas.off('object:selected');
      this.canvas.setBackgroundImage(this.fabricImage,
        this.canvas.renderAll.bind(this.canvas));

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

      this.canvas.setZoom(state.zoom);
      this.canvas.renderAll();
    });

    const annotateSubscription = this.annotate$.subscribe(state => {
      this.annotation = state.annotation;
      if (state.selectedImage && !this.fabricImage) {
        fabric.Image.fromURL(state.selectedImage.flickr_url, (img) => {
          this.fabricImage = img
          img.lockRotation = true;
          img.lockUniScaling = true;
          this.canvas.setBackgroundImage(img,
            this.canvas.renderAll.bind(this.canvas));
          this.canvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight - 130});
        });
        if (state.annotation && state.annotation.marked_objects && state.annotation.marked_objects.length > 0) {
          state.annotation.marked_objects
            .map(data => ({
                object: data,
                rect: new fabric.Rect({
                  width: data.width,
                  height: data.height,
                  left: data.x,
                  top: data.y,
                  fill: 'transparent',
                  stroke: ObjectXType.find(data.object_type).color,
                  selectable: true
                }),
            }))
            .map(result => ({
              object: result.object,
              graphics: createGraphicFromRectangle(result.rect, ObjectXType.find(result.object.value)),
            }))
            .map(result => {
              this.store.dispatch(this.actions.addObject(new ObjectX(
                result.graphics,
                ObjectXType.find(result.object.object_type),
                new Gender(result.object.gender),
                new AgeGroup(result.object.age_group))))
              this.store.dispatch(this.actions.setVisibleObjectTypes(result.object.type, true));
            });
        }

        this.selectedObjectType = state.selectedObjectType;
        this.visibleObjectTypes = state.visibleObjectTypes;
        this.objects = state.objects;
        this.objectTypes = state.objectTypes;
        this.objectXStore.dispatch(this.objectXActions.setDrawMode(DrawMode.add));

        if (!this.canvas) {
          return;
        }
        if (state.objects.length > 0) {
          this.objects = state.objects;
          const objects = state.objects.filter(object => this.visibleObjectTypes.indexOf(object.type) > -1);
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

    this.subscriptions = [objectXSubscription, annotateSubscription];
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
    const graphics = createGraphicFromRectangle(rect, this.selectedObjectType);

    this.canvas.remove(rect);
    this.canvas.add(graphics);
    this.canvas.renderAll();

    console.log(this.selectedObjectType);
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

  handleNext() {
    this.store.dispatch(
      this.actions.updateAnnotationMarkedObjects(
        this.annotation, this.objects));
    // this.service
    //   .updateAnnotation(this.annotation, [], this.objects)
    //   .subscribe(response => {
    //     const result = response.json();
    //     let url = `/annotate/${this.params.image_id}/${this.params.annotation_id}/attributes`;
    //     this.store.dispatch(go([url]));
    //   });
  }
}
