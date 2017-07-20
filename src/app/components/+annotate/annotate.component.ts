import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { Image, ImageState } from '../../models/search.models';
import { CardLayoutOptions } from '../../models/card-layout.models';
import { CardLayoutActions } from '../../actions/card-layout.actions';

import { environment } from '../../../environments/environment';


@Component({
  selector: 'fat-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotateComponent implements OnInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  viewMode = CardLayoutOptions.thumbs;

  private sub: any;

  constructor(
    public store: Store<AnnotateState>,
    private actions: AnnotateActions,
    private cardLayoutActions: CardLayoutActions,
    private route: ActivatedRoute,
  ) {
    this.annotate$ = store.select('annotate');
  }

  ngOnInit() {
    this.store.dispatch(this.cardLayoutActions.setActionsVisible(false));
    this.sub = this.route.params.subscribe(params => {
      this.store.dispatch(this.actions.requestImages(ImageState.approved));
      if (params.id) {
        this.store.dispatch(this.actions.requestImage(params.id));
      } else {
        this.store.dispatch(this.actions.deselectImage());
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleCardSelect(image: Image) {
    this.store.dispatch(go([`/annotate/${image.id}/skin-pixels`]));
  }

}
