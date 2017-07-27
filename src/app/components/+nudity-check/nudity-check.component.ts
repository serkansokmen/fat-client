import { Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';

@Component({
  selector: 'fat-nudity-check',
  templateUrl: './nudity-check.component.html',
  styleUrls: ['./nudity-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NudityCheckComponent implements OnInit, OnDestroy {

  annotate$: Observable<AnnotateState>;

  private subscriptions: any[] = [];

  constructor(
    public store: Store<AnnotateState>,
    public actions: AnnotateActions,
    private route: ActivatedRoute,
  )
  {
    this.annotate$ = store.select('annotate');
  }

  ngOnInit() {
    // this.store.dispatch(this.actions.requestDefaultSemanticChecks());
    this.subscriptions.push(this.route.params.subscribe(params => {
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

  handleNext() {
    // dispatch udpate annotation action
    this.store.dispatch(this.actions.updateAnnotationSemanticChecks());
  }
}
