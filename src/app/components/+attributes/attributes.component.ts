import { Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
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
import { union } from 'underscore';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { ObjectXState } from '../../reducers/object-x.reducer';
import { ObjectXActions } from '../../actions/object-x.actions';
import { ObjectX, Gender, DrawMode } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';

@Component({
  selector: 'fat-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ObjectXActions]
})
export class AttributesComponent implements AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  objectX$: Observable<ObjectXState>;
  objects: ObjectX[];

  @ViewChild('drawCanvas') drawCanvas?: ElementRef;
  @ViewChild('bgCanvas') bgCanvas?: ElementRef;

  private context: CanvasRenderingContext2D;
  private subscriptions: any[];
  private canvas: Canvas;

  constructor(
    public store: Store<ObjectXState>,
    public actions: ObjectXActions,
    public annotateStore: Store<AnnotateState>,
    public annotateActions: AnnotateActions,
  )
  {
    this.annotate$ = store.select('annotate');
    this.objectX$ = store.select('objectX');
    this.objects = [];
  }

  ngAfterViewInit() {

    this.canvas = new fabric.Canvas(this.drawCanvas.nativeElement, {
      isDrawingMode: false
    });
    var bgCanvas: StaticCanvas = new fabric.StaticCanvas(this.bgCanvas.nativeElement, {
      backgroundColor: 'black'
    });
    this.context = this.canvas.getContext('2d');

    const annotateSubscription = this.annotate$.subscribe(state => {
      if (state.selectedImage) {
        fabric.Image.fromURL(state.selectedImage.flickr_url, (img) => {
          img.lockRotation = true;
          img.lockUniScaling = true;
          bgCanvas.setWidth(img.width);
          bgCanvas.setHeight(img.height);
          bgCanvas.setBackgroundImage(img);
          bgCanvas.renderAll();
          this.canvas.setWidth(img.width);
          this.canvas.setHeight(img.height);
        });
      }
    })
    const objectXSubscription = this.objectX$.subscribe((state: ObjectXState) => {

      this.objects = union(this.objects, state.objects);

      if (state.objects.length == 0) {
        return;
      }

      this.canvas.clear();
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
      //   // var result = face.type.name;
      //   // if (face.gender) {
      //   //   result += `\n ${face.gender.toString()}`;
      //   // }
      //   // if (face.ageGroup) {
      //   //   result += `\n ${face.ageGroup.toString()}`;
      //   // }
      //   // graphics._objects[1].set('text', result);
      //   // graphics.set('selectable', true);
      //   graphics.off('selected');

        graphics.on('selected', event => {
          this.store.dispatch(this.actions.selectObject(face));
        });

        this.canvas.add(graphics);
      }

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
    console.log('wip');
  }
}
