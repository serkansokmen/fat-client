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
import { NudityCheckState } from '../../reducers/nudity-check.reducer';
import { NudityCheckActions } from '../../actions/nudity-check.actions';

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

   private subscriptions: any[] = [];

  constructor(
    public store: Store<NudityCheckState>,
    public actions: NudityCheckActions,
    public annotateStore: Store<AnnotateState>,
    public annotateActions: AnnotateActions,
    private route: ActivatedRoute,
  )
  {
    this.annotate$ = annotateStore.select('annotate');
    this.nudityCheck$ = store.select('nudityCheck');
  }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      if (params.annotation_id) {
        this.annotateStore.dispatch(this.annotateActions.requestAnnotation(params.annotation_id));
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
    // this.annotateStore.dispatch();
  }
}
