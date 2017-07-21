import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { Image, License } from '../models/search.models';
import { AnnotateActions } from '../actions/annotate.actions';
import { AnnotateState } from '../reducers/annotate.reducer';
import { FlickrService } from '../services/flickr.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

@Injectable()
export class AnnotateEffects {

  constructor(
    private http: Http,
    private actions$: Actions,
    private store$: Store<AnnotateState>,
    private service: FlickrService,
  ) {}

  @Effect() requestAvailableImages$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGES)
    .map(toPayload)
    .switchMap(payload => this.service.getImages())
    .switchMap(result => Observable.of({
        type: AnnotateActions.REQUEST_IMAGES_COMPLETE,
        payload: {
          ...result
        }
      }));

  @Effect() requestImage$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGE)
    .map(toPayload)
    .switchMap(payload => this.service.getImage(payload.id))
    .switchMap(result => Observable.of({
        type: AnnotateActions.REQUEST_IMAGE_COMPLETE,
        payload: {
          image: new Image(result.json())
        }
      }));

  @Effect() requestImageComplete$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGE_COMPLETE)
    .map(toPayload)
    .map(payload => ({
      type: AnnotateActions.SELECT_IMAGE,
      payload
    }))

  @Effect() saveSkinPixels$ = this.actions$
    .ofType(AnnotateActions.SAVE_SKIN_PIXELS)
    .withLatestFrom(this.store$, (action, state: any) => ({
      image: state.annotate.selectedImage,
      base64: action.payload.base64,
    }))
    .switchMap(object => this.service
      .saveSkinPixels(object.image, object.base64)
      .map(res => res.json())
      .catch(err => err.json()))
    .switchMap(annotation => Observable.of({
        type: AnnotateActions.SAVE_SKIN_PIXELS_COMPLETE,
        payload: {
          annotation
        }
      }));

   @Effect({ dispatch: false }) saveSkinPixelsComplete$ = this.actions$
    .ofType(AnnotateActions.SAVE_SKIN_PIXELS_COMPLETE)
    .withLatestFrom(this.store$, (action, state: any) =>
      `/annotate/${state.annotate.selectedImage.id}${state.annotate.steps[1].routePath}`)
    .map(url => {
      this.store$.dispatch(go([url]));
    })

}
