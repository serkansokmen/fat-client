import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AnnotateState } from '../../reducers/annotate.reducer';

@Component({
  selector: 'fat-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.scss']
})
export class AnnotateComponent implements OnInit {

  state$: Observable<any>;

  constructor(
    public store: Store<AnnotateState>
  ) {
    this.state$ = store.select('annotate');
  }

  ngOnInit() {

  }

}
