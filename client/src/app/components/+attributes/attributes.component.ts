import { Component,
  Input,
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
import { union } from 'underscore';
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

  @Input('image') image: FlickrImage;

  state$: Observable<ObjectXState>;
  objects: ObjectX[];

  @ViewChild('drawCanvas') drawCanvas?: ElementRef;
  @ViewChild('bgCanvas') bgCanvas?: ElementRef;

  private context: CanvasRenderingContext2D;
  private subscription;
  private canvas: Canvas;

  constructor(
    public store: Store<ObjectXState>,
    public actions: ObjectXActions,
  )
  {
    this.state$ = store.select('objectX');
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

    fabric.Image.fromURL(this.image.image, (img) => {
      img.lockRotation = true;
      img.lockUniScaling = true;
      bgCanvas.setWidth(img.width);
      bgCanvas.setHeight(img.height);
      bgCanvas.setBackgroundImage(img);
      bgCanvas.renderAll();
      this.canvas.setWidth(img.width);
      this.canvas.setHeight(img.height);
    });

    this.subscription = this.state$.subscribe((state: ObjectXState) => {

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
          console.log('selected', face);
        });

        this.canvas.add(graphics);
      }

      this.canvas.renderAll();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
