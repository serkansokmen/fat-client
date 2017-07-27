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

  }

  // case AnnotateActions.REQUEST_DEFAULT_SEMANTIC_CHECKS_COMPLETE:
  //     return {
  //       ...state,
  //       isRequesting: false,
  //       defaultSemanticChecks: action.payload.results.map(result => ({
  //         ...result,
  //         isActive: true,
  //         value: 0.0,
  //       })),
  //     }

  //   case AnnotateActions.TOGGLE_SEMANTIC_CHECK_ACTIVE:
  //     return {
  //       ...state,
  //       annotation: {
  //         ...state.annotation,
  //         semantic_checks: state.annotation.semantic_checks.map(check => {
  //           if (check == action.payload.check) {
  //             check.isActive = !check.isActive;
  //           }
  //           return check;
  //         })
  //       }
  //     }

  //   case AnnotateActions.SET_SEMANTIC_CHECK_WEIGHT:
  //     return {
  //       ...state,
  //       annotation: {
  //         ...state.annotation,
  //         semantic_checks: state.annotation.semantic_checks.map(check => {
  //           if (check == action.payload.check) {
  //             check.value = action.payload.value;
  //           }
  //           return check;
  //         })
  //       }
  //     }
}
