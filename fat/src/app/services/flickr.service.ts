import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { PlatformLocation } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { Image, License, ImageState } from '../models/search.models';
import { map, filter, union } from 'underscore';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/mergeMap';

@Injectable()
export class FlickrService {

  private endpoint: string;
  private apiKey: string;

  constructor(
    private http: Http,
    private cookieService: CookieService) {
    this.endpoint = environment.apiURL;
  }

  search(search: any, licenses: License[], perpage: number): Observable<any> {
    // search.query = search.query || '';
    // search.exclude = search.exclude || '';
    // var query = search.query.replace(' ', '');
    // let exclude = search.exclude.replace(' ', '').split(',').map(str => `-${str.trim()}`).join(',');
    // if (exclude != '-') {
    //   query += `,${exclude}`;
    // }

    let url = `${this.endpoint}flickr/` +
      `?licenses=${licenses.map(license => license.id).sort().join(',')}` +
      `${search.userID ? '&user_id=' + search.userID : ''}` +
      `&tags=${search.tags.split(',').map(str => str.trim()).join(',')}` +
      `&tag_mode=${search.tagMode}`;
    return this.http.get(url, this.jwt())
      .map((response: Response) => response.json())
      .map((result: any) => {
        return {
          total: result.total,
          images: result.images.filter((image, key) => key < perpage).map(photo => new Image(photo)),
          search: result.search
        };
      });
  };

  saveSearch(search: any, images: Image[], licenses: License[]) {
    let body = JSON.stringify({
      tags: search.tags.split(',').map(str => str.trim()).join(','),
      tag_mode: search.tagMode,
      user_id: search.userID || null,
      licenses: licenses.map(license => license.id),
      images: images.map(image => {
        return {
          ...image,
          license: image.license.id,
          state: image.state ? image.state.value : ImageState.indeterminate.value
        }
      })
    });

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'X-CSRFToken': this.cookieService.get('csrftoken'),
        'Authorization': `Token ${currentUser.token}`
      });
      let options = new RequestOptions({ headers: headers });
      if (search.id == null) {
        return this.http.post(`${this.endpoint}flickr/`, body, options)
          .map((response: Response) => response.json());
      } else {
        return this.http.put(`${this.endpoint}flickr/`, body, options)
          .map((response: Response) => response.json());
      }
    }
  }

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({
        'Authorization': `Token ${currentUser.token}`
      });
      return new RequestOptions({ headers: headers });
    }
  }

}
