import { Component,
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
import { union } from 'underscore';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { ObjectXState, createGraphicFromRectangle } from '../../reducers/object-x.reducer';
import { ObjectXActions } from '../../actions/object-x.actions';
import { ObjectX, ObjectXType, Gender, AgeGroup, DrawMode } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';
import { FlickrService } from '../../services/flickr.service';

@Component({
  selector: 'fat-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ObjectXActions]
})
export class AttributesComponent implements OnInit, AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  objectX$: Observable<ObjectXState>;
  objects: ObjectX[] = [];
  selectedObject: ObjectX = null;

  private context: CanvasRenderingContext2D;
  private subscriptions: any[] = [];
  private canvas: Canvas;
  private fabricImage: any;
  private annotation: any;
  public params: any;

  @ViewChild('drawCanvas') drawCanvas?: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.setDimensions({
      width: event.target.innerWidth,
      height: event.target.innerHeight - 130});
    this.canvas.renderAll();
  }

  constructor(
    public objectXStore: Store<ObjectXState>,
    public objectXActions: ObjectXActions,
    public store: Store<AnnotateState>,
    public actions: AnnotateActions,
    private route: ActivatedRoute,
    private service: FlickrService,
  )
  {
    this.annotate$ = store.select('annotate');
    this.objectX$ = objectXStore.select('objectX');
  }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.params = params;
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
      isDrawingMode: false
    });
    this.context = this.canvas.getContext('2d');

    const annotateSubscription = this.annotate$.subscribe(state => {

      this.annotation = state.annotation;
      if (state.selectedImage && !this.fabricImage) {
        fabric.Image.fromURL(state.selectedImage.flickr_url, (img) => {
          this.fabricImage = img;
          img.lockRotation = true;
          img.lockUniScaling = true;
          this.canvas.setBackgroundImage(img,
            this.canvas.renderAll.bind(this.canvas));
          this.canvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight - 130});
        });
      }
      this.objects = state.objects;
      this.selectedObject = state.selectedObject;

      if (state.annotation && state.annotation.marked_objects && state.annotation.marked_objects.length > 0) {
        state.annotation.marked_objects
          .filter(object => object.type.id == ObjectXType.face.id)
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
            graphics: createGraphicFromRectangle(result.rect, ObjectXType.find(result.object.id)),
          }))
          .map(result => {
            this.store.dispatch(this.actions.addObject(new ObjectX(
              result.graphics,
              ObjectXType.find(result.object.object_type),
              new Gender(result.object.gender),
              new AgeGroup(result.object.age_group))))
            this.store.dispatch(this.actions.setVisibleObjectTypes(result.object.object_type, true));
          });
      }
      let faces = state.objects;
      for (let face of faces) {
        face.graphics.off('selected');
        let graphics = face.graphics;
        graphics.lockRotation = true;
        graphics.lockMovementX = true;
        graphics.lockMovementY = true;
        graphics.lockScalingY = true;
        graphics.lockScalingY = true;
        graphics.lockUniScaling = true;
        if (face == state.selectedObject) {
          this.canvas.setActiveObject(face.graphics);
        }
        graphics.on('selected', event => {
          this.store.dispatch(this.actions.selectObject(face));
        });

        this.canvas.add(graphics);
      }
      this.canvas.renderAll();
    });

    const objectXSubscription = this.objectX$.subscribe((state: ObjectXState) => {

      this.canvas.setBackgroundImage(this.fabricImage,
        this.canvas.renderAll.bind(this.canvas));
      this.canvas.off('object:selected');

      this.canvas.setZoom(state.zoom);
      this.canvas.renderAll();
    });
    this.subscriptions = [annotateSubscription, objectXSubscription];
    if (this.selectedObject) {
      this.store.dispatch(this.actions.selectObject(this.selectedObject));
    }
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  handleNext() {
    this.service
      .updateAnnotation(this.annotation, [], this.objects)
      .subscribe(response => {
        const result = response.json();
        console.log(result);
        let url = `/annotate/${this.params.image_id}/${this.params.annotation_id}/complete`;
        this.store.dispatch(go([url]));
      });
  }
}
