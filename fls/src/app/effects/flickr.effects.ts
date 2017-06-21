import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Observable } from 'rxjs/Observable';
import { FlickrSearch, FlickrImage } from '../models/flickr.models';
import { FlickrActions } from '../actions/flickr.actions';
import { FlickrService } from '../services/flickr.service';


@Injectable()
export class FlickrEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
    private service: FlickrService
  ) { }

  @Effect() search$ = this.actions$
    // Listen for the 'LOGIN' action
    .ofType(FlickrActions.REQUEST_FLICKR_SEARCH)
    .map(toPayload)
    .switchMap(payload => {
      return this.service.search(payload.search)
        .switchMap(result => {
          return Observable.of({
            type: FlickrActions.REQUEST_FLICKR_SEARCH_COMPLETE,
            payload: {
              images: result.results.filter((image, key) => key < payload.search.perPage)
            }
          })
        })
    });

  @Effect() save$ = this.actions$
    // Listen for the 'LOGIN' action
    .ofType(FlickrActions.SAVE_SEARCH)
    .map(toPayload)
    .switchMap(payload => {
      return this.service.saveSearch(payload.search, payload.images)
        .switchMap(result => {
          return Observable.of({
            type: FlickrActions.SAVE_SEARCH_COMPLETE,
            payload: {
              search: new FlickrSearch(result),
              images: result.images.map(data => new FlickrImage(data))
            }
          })
        })
    });
    // // Map the payload into JSON to use as the request body
    // .switchMap(payload => this.http.post('/auth', payload)
    //   // If successful, dispatch success action with result
    //   .map(res => ({ type: 'LOGIN_SUCCESS', payload: res.json() }))
    //   // If request fails, dispatch failed action
    //   .catch(() => Observable.of({ type: 'LOGIN_FAILED' }))
    // );
}
