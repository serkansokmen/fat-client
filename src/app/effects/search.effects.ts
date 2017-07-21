import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Image, License } from '../models/search.models';
import { SearchActions } from '../actions/search.actions';
import { FlickrService } from '../services/flickr.service';
import { SearchState } from '../reducers/search.reducer';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

@Injectable()
export class SearchEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
    private store: Store<SearchState>,
    private service: FlickrService,
    private router: Router,
  ) { }

  @Effect() searchPage$ = this.actions$
    .ofType(SearchActions.REQUEST_SEARCH)
    .map(toPayload)
    .switchMap(payload => this.service.search(payload))
    .switchMap(result => Observable.of({
        type: SearchActions.REQUEST_SEARCH_COMPLETE,
        payload: {
          search: result.search,
          images: result.images,
          left: result.left,
          total: result.total,
          perpage: result.perpage,
          page: result.page,
        }
      }));

  @Effect() save$ = this.actions$
    .ofType(SearchActions.SAVE_SEARCH)
    .map(toPayload)
    .switchMap(payload => this.service.saveSearch(payload.search, payload.images, payload.licenses))
    .switchMap(result => Observable.of({
        type: SearchActions.SAVE_SEARCH_COMPLETE,
        payload: {
          search: result.search,
          left: result.left,
          total: result.total,
          newImages: result.images
        }
      }));

}
