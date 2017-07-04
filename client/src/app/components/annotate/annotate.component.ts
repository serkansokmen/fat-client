import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { Image, ImageState } from '../../models/search.models';
import { ViewMode } from '../../models/card-layout.models';


@Component({
  selector: 'fat-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotateComponent implements OnInit, OnDestroy {

  state$: Observable<any>;
  private sub: any;

  viewMode = ViewMode.list;

  constructor(
    public dialog: MdDialog,
    public store: Store<AnnotateState>,
    private actions: AnnotateActions,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.state$ = store.select('annotate');
  }

  ngOnInit() {
    this.store.dispatch(this.actions.requestImages(ImageState.approved));
    this.sub = this.route.params.subscribe(params => {
      if (params.id) {
        // this.store.dispatch(this.actions.requestImage(params.id));
      } else {
        this.store.dispatch(this.actions.deselectImage());
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleCardSelect(image: Image) {
    if (image.image) {
      this.store.dispatch(this.actions.selectImage(image));
      this.router.navigate([`/annotate/${image.id}/step-1`]);
    } else {

    }
  }

}
