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

import { NudityCheckState } from '../../../reducers/nudity-check.reducer';
import { NudityCheckActions } from '../../../actions/nudity-check.actions';
import { ObjectX, Gender, DrawMode } from '../../../models/object-x.models';
import { Image as FlickrImage } from '../../../models/search.models';

@Component({
  selector: 'fat-nudity-check',
  templateUrl: './nudity-check.component.html',
  styleUrls: ['./nudity-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NudityCheckActions]
})
export class NudityCheckComponent implements AfterViewInit, OnDestroy {

  @Input('image') image: FlickrImage;

  state$: Observable<NudityCheckState>;

  private subscription;

  constructor(
    public store: Store<NudityCheckState>,
    public actions: NudityCheckActions,
  )
  {
    this.state$ = store.select('nudityCheck');
  }

  ngAfterViewInit() {
    this.subscription = this.state$.subscribe((state: NudityCheckState) => {
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
