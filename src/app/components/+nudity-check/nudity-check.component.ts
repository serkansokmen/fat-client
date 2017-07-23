import { Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
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
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { NudityCheckState } from '../../reducers/nudity-check.reducer';
import { NudityCheckActions } from '../../actions/nudity-check.actions';
import { ObjectX, Gender, DrawMode } from '../../models/object-x.models';
import { Image as FlickrImage } from '../../models/search.models';

@Component({
  selector: 'fat-nudity-check',
  templateUrl: './nudity-check.component.html',
  styleUrls: ['./nudity-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NudityCheckActions]
})
export class NudityCheckComponent implements OnInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  nudityCheck$: Observable<NudityCheckState>;

  constructor(
    public store: Store<NudityCheckState>,
    public actions: NudityCheckActions,
    public annotateStore: Store<AnnotateState>,
    public annotateActions: AnnotateActions,
  )
  {
    this.annotate$ = annotateStore.select('annotate');
    this.nudityCheck$ = store.select('nudityCheck');
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  handleNext() {
    // dispatch udpate annotation action
    // this.annotateStore.dispatch();
  }
}
