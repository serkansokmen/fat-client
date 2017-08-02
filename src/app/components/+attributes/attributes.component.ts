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
import { ObjectXState } from '../../reducers/object-x.reducer';
import { ObjectXActions } from '../../actions/object-x.actions';
import { ObjectX, Gender, DrawMode } from '../../models/object-x.models';
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
  objects: ObjectX[];

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
    this.objects = [];
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
      this.canvas.clear();
      this.canvas.renderAll();
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
    });

    const objectXSubscription = this.objectX$.subscribe((state: ObjectXState) => {

      this.objects = union(this.objects, state.objects);

      // if (state.objects.length == 0) {
      //   return;
      // }

      this.canvas.clear();
      this.canvas.clear();
      this.canvas.setBackgroundImage(this.fabricImage,
        this.canvas.renderAll.bind(this.canvas));
      this.canvas.off('object:selected');

      let faces = state.objects.filter(object => {
        return object.type.id == 0;
      });
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
          this.objectXStore.dispatch(this.objectXActions.selectObject(face));
        });

        this.canvas.add(graphics);
      }

      this.canvas.setZoom(state.zoom);
      this.canvas.renderAll();
    });
    this.subscriptions = [annotateSubscription, objectXSubscription];
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
