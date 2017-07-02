import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { Image, ImageState } from '../../models/search.models';

@Component({
  selector: 'fat-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.scss']
})
export class AnnotateComponent implements OnInit, OnDestroy {

  state$: Observable<any>;
  private sub: any;

  constructor(
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
        console.log(params.id);
      }
      this.store.dispatch(this.actions.selectImage(null));
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleSelectImage(image: Image) {
    this.store.dispatch(this.actions.selectImage(image));
  }

}
