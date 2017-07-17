import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { PlatformLocation } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { License, ImageState } from '../models/search.models';
import { Image as FlickrImage } from '../models/search.models';
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

  search(search: any, licenses: License[], perpage: number, page: number): Observable<any> {

    let url = `${this.endpoint}flickr/` +
      `?licenses=${licenses.map(license => license.id).sort().join(',')}` +
      `${search.userID ? '&user_id=' + search.userID : ''}` +
      `&tags=${search.tags.split(',').map(str => str.trim()).join(',')}` +
      `&tag_mode=${search.tagMode}` +
      `&perpage=${perpage >= 100 ? 100 : perpage}` +
      `&page=${page}`;

    return this.http.get(url, this.jwt())
      .map((response: Response) => response.json())
      .catch(error => {
         return Observable.of({
           error
         });
       })
      .map((result: any) => {
        return {
          total: result.total,
          left: result.left,
          images: result.images ? result.images.map(photo => new FlickrImage(photo)) : [],
          search: result.search,
          perpage: result.perpage,
          page: result.page,
        };
      });
  };

  saveSearch(search: any, images: FlickrImage[], licenses: License[]) {
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
          .catch(error => {
            console.error('Error at search', error);
            return Observable.empty();
          })
          .map((response: Response) => response.json())
      } else {
        return this.http.put(`${this.endpoint}flickr/`, body, options)
          .catch(error => {
            console.error('Error at search', error);
            return Observable.empty();
          })
          .map((response: Response) => response.json())
          .switchMap(result => Observable.of({
            search: result.search,
            images: result.images.map(image => new FlickrImage(image)),
            left: result.left,
            total: result.total,
          }));
      }
    }
  }

  searchExisting(query: string): Observable<any> {
    let url = `${this.endpoint}search/?q=${query}`;
    return this.http.get(url, this.jwt())
      .map((response) => response.json())
      .switchMap(result => Observable.of({
          count: result.count,
          next: result.next,
          previous: result.previous,
          results: result.results,
        }));
  }

  queryAutocomplete(query: string): Observable<any> {
    return this.searchExisting(query)
      .switchMap(result => Observable.of(result.results.map(search => ({ id: search.id, tags: search.tags }))));
  }

  getImages(state: ImageState) {
    let url = `${this.endpoint}images/?state=${state.value}`;
    return this.http.get(url, this.jwt())
      .map((response: Response) => response.json())
      .map((result: any) => {
        return {
          total: result.count,
          next: result.next,
          previous: result.previous,
          images: result.results.map(photo => new FlickrImage(photo))
        };
      })
      .catch(error => {
        console.error('Error at search', error);
        return Observable.empty();
      });
  }

  getImage(id: number) {
    if (!id) {
      return;
    }
    let url = `${this.endpoint}images/${id}/`;
    return this.http.get(url, this.jwt())
      .map((response: Response) => new FlickrImage(response.json()));
  }

  saveAnnotation(image: FlickrImage, base64: string) {
    let body = JSON.stringify({
      image: image.id,
      skin_pixels_image: base64,
    });

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'X-CSRFToken': this.cookieService.get('csrftoken'),
        'Authorization': `Token ${currentUser.token}`
      });
      let options = new RequestOptions({ headers: headers });

      return this.http.post(`${this.endpoint}annotations/`, body, options)
        .catch(error => {
          console.error('Error at search', error);
          return Observable.empty();
        })
        .map((response: Response) => response.json())
        .switchMap(result => Observable.of(result));
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
