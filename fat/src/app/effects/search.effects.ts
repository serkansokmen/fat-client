import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Search, Image, License } from '../models/search.models';
import { SearchActions } from '../actions/search.actions';
import { FlickrService } from '../services/flickr.service';


@Injectable()
export class SearchEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
    private service: FlickrService
  ) { }

  @Effect() searchPage$ = this.actions$
    .ofType(SearchActions.REQUEST_SEARCH)
    .map(toPayload)
    .switchMap(payload => this.service.search(
      payload.search,
      payload.licenses,
      payload.perpage,
      payload.page))
    .switchMap(result => {
      return Observable.of({
        type: SearchActions.REQUEST_SEARCH_COMPLETE,
        payload: {
          pages: result.pages,
          page: result.page,
          perpage: result.perpage,
          total: result.total,
          images: result.images
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
          search: new Search(result),
          images: result.images.map(data => new Image(data))
        }
      })
    });

}
