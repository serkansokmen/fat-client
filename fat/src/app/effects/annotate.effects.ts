import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Image, License, ImageState } from '../models/search.models';
import { AnnotateActions } from '../actions/annotate.actions';
import { AnnotateState } from '../reducers/annotate.reducer';
import { FlickrService } from '../services/flickr.service';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class AnnotateEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
    private store: Store<AnnotateState>,
    private service: FlickrService,
    private router: Router,
  ) {}

  @Effect() errorStatus401$ = this.actions$
    .map(action => action.payload)
    .filter(payload => payload && payload.errorStatus === 401)
    .switchMap(payload => {
        this.router.navigate(['/login']);
        return Observable.empty();
    });

  @Effect() requestAvailableImages$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGES)
    .map(toPayload)
    .switchMap(payload => this.service.getImages(payload.state))
    .switchMap(result => {
      return Observable.of({
        type: AnnotateActions.REQUEST_IMAGES_COMPLETE,
        payload: {
          ...result
        }
      });
    });

  @Effect() requestImage$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGE)
    .map(toPayload)
    .switchMap(payload => this.service.getImage(payload.id))
    .switchMap(result => {
      return Observable.of({
        type: AnnotateActions.SELECT_IMAGE,
        payload: {
          image: result
        }
      })
    });
}
