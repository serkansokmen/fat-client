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

import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class AnnotateEffects {

  constructor(
    private http: Http,
    private actions$: Actions,
    private store$: Store<AnnotateState>,
    private service: FlickrService,
    private router: Router,
  ) {}

  @Effect() requestAvailableImages$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGES)
    .map(toPayload)
    .switchMap(payload => this.service.getImages(payload.state))
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

  @Effect() saveSkinPixelsImage$ = this.actions$
    .ofType(AnnotateActions.SAVE_SKIN_PIXELS_IMAGE)
    .withLatestFrom(this.store$, (action, state: any) => ({
      image: state.annotate.selectedImage,
      base64: action.payload.base64,
    }))
    .map(object => this.service
      .saveSkinPixelsImage(object.image, object.base64)
      .map(res => res.json())
      .catch(err => err.json()))
    .switchMap(annotation => Observable.of({
        type: AnnotateActions.SAVE_SKIN_PIXELS_IMAGE_COMPLETE,
        payload: {
          annotation
        }
      }));

}
