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
import { ObjectX, ObjectXType, DrawMode } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';
import { FlickrService } from '../../services/flickr.service';

@Component({
  selector: 'fat-annotation-complete',
  templateUrl: './annotation-complete.component.html',
  styleUrls: ['./annotation-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComplete implements OnInit, OnDestroy {

  annotate$: Observable<AnnotateState>;

  private canvas: Canvas;
  private context: CanvasRenderingContext2D;
  private subscriptions: any[] = [];

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
  )
  {
    this.annotate$ = store.select('annotate');
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

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }
}
