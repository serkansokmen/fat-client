import { Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef
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
import { ObjectX, ObjectXType, Gender, AgeGroup, DrawMode, genders, ageGroups } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';
import { FlickrService } from '../../services/flickr.service';

@Component({
  selector: 'fat-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributesComponent implements OnInit, AfterViewInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  objects: ObjectX[] = [];
  genders: Gender[];
  ageGroups: AgeGroup[];
  zoom: number = 1.0;

  selectedObjectIndex: number;

  public canvas: Canvas;
  private context: CanvasRenderingContext2D;
  private subscriptions: any[] = [];
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
    public store: Store<AnnotateState>,
    public actions: AnnotateActions,
    private route: ActivatedRoute,
    private service: FlickrService,
    private ref: ChangeDetectorRef,
  )
  {
    this.annotate$ = store.select('annotate');
    this.genders = genders;
    this.ageGroups = ageGroups;
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
    this.canvas.setZoom(this.zoom);

    this.subscriptions.push(this.annotate$.subscribe(state => {

      this.annotation = state.annotation;
      if (state.selectedImage && !this.fabricImage) {
        fabric.Image.fromURL(state.selectedImage.flickr_url, (img) => {
          this.fabricImage = img;
          img.lockRotation = true;
          img.lockUniScaling = true;
          this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
          this.canvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight - 130});
        });
      }
      if (state.annotation && state.annotation.marked_objects && state.annotation.marked_objects.length > 0) {
        state.annotation.marked_objects
          .map(data => new ObjectX(data))
          .map((objectX, $key) => {
            if (objectX.type.id == ObjectXType.face.id) {
              objectX.graphics.set('selectable', true);
              objectX.graphics.set('selected', false);
              objectX.graphics.on('selected', (event) => {
                this.selectedObjectIndex = $key;
                this.ref.detectChanges();
              })
              this.canvas.setActiveObject(objectX.graphics);
            } else {
              objectX.graphics.set('selectable', false);
              objectX.graphics.set('selected', false);
            }
            this.canvas.add(objectX.graphics);
            this.objects.push(objectX);
          });
      } else {
        this.objects = [];
      }
      this.canvas.renderAll();
    }));
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  setGender(gender: Gender) {
    this.objects[this.selectedObjectIndex].gender = gender;
  }

  setAgeGroup(ageGroup: AgeGroup) {
    this.objects[this.selectedObjectIndex].ageGroup = ageGroup;
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
