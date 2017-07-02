import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Image, License, ImageState } from '../models/search.models';
import { SearchActions } from '../actions/search.actions';
import { FlickrService } from '../services/flickr.service';
import { SearchState } from '../reducers/search.reducer';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class SearchEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
    private store: Store<SearchState>,
    private service: FlickrService,
    private router: Router,
  ) { }

  @Effect() errorStatus401$ = this.actions$
    .map(action => action.payload)
    .filter(payload => payload && payload.errorStatus === 401)
    .switchMap(payload => {
        this.router.navigate(['/login']);
        return Observable.empty();
    });

  @Effect() searchPage$ = this.actions$
    .ofType(SearchActions.REQUEST_SEARCH)
    .map(toPayload)
    .switchMap(payload => this.service.search(
      payload.search,
      payload.licenses,
      payload.perpage))
    .switchMap(result => {
      return Observable.of({
        type: SearchActions.REQUEST_SEARCH_COMPLETE,
        payload: {
          total: result.total,
          search: result.search,
          results: result.images
        }
      })
    });

  @Effect() save$ = this.actions$
    .ofType(SearchActions.SAVE_SEARCH)
    .map(toPayload)
    .switchMap(payload => this.service.saveSearch(payload.search, payload.images, payload.licenses))
    .switchMap(result => {
      return Observable.of({
        type: SearchActions.SAVE_SEARCH_COMPLETE,
        payload: {
          search: result,
          newImages: result.images ? result.images.map(data => new Image(data)) : []
        }
      })
    });

}
