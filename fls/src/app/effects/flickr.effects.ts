import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { FlickrSearch, FlickrImage, License } from '../models/flickr.models';
import { FlickrActions } from '../actions/flickr.actions';
import { FlickrService } from '../services/flickr.service';


@Injectable()
export class FlickrEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
    private service: FlickrService
  ) { }

  @Effect() licenses$: Observable<Action> = this.actions$
    .ofType(FlickrActions.REQUEST_LICENSES)
    .map(toPayload)
    .switchMap(payload => this.service.getLicenses())
    .switchMap(licenses => {
      return Observable.of({
        type: FlickrActions.REQUEST_LICENSES_COMPLETE,
        payload: {
          licenses
        }
      })
    });

  @Effect() searchPage$ = this.actions$
    .ofType(FlickrActions.REQUEST_SEARCH)
    .map(toPayload)
    .switchMap(payload => this.service.search(payload.search, payload.licenses, payload.page))
    .switchMap(result => {
      return Observable.of({
        type: FlickrActions.REQUEST_SEARCH_COMPLETE,
        payload: {
          totalPages: result.totalPages * 1,
          images: result.results
        }
      })
    });

  @Effect() save$ = this.actions$
    .ofType(FlickrActions.SAVE_SEARCH)
    .map(toPayload)
    .switchMap(payload => this.service.saveSearch(payload.search, payload.images))
    .switchMap(result => {
      return Observable.of({
        type: FlickrActions.SAVE_SEARCH_COMPLETE,
        payload: {
          search: new FlickrSearch(result),
          images: result.images.map(data => new FlickrImage(data))
        }
      })
    });

}
