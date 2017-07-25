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

  search(payload: any): Observable<any> {

    const { search, licenses, perpage, page } = payload;

    let url = `${this.endpoint}flickr` +
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
          state: image.state ? image.state.value : ImageState.selected.value
        }
      })
    });

    if (search.id == null) {
      return this.http.post(`${this.endpoint}flickr`, body, this.jwt())
        .catch(error => {
          console.error('Error at search', error);
          return Observable.empty();
        })
        .map((response: Response) => response.json())
    } else {
      return this.http.put(`${this.endpoint}flickr`, body, this.jwt())
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

  getImages(annotatedOnly: boolean) {
    let url = annotatedOnly ? `${this.endpoint}images?annotated_only=true` : `${this.endpoint}images`;
    return this.http.get(url, this.jwt())
      .map(res => res.json())
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

  getImage(id: number, annotatedOnly: boolean) {
    let url = `${this.endpoint}images/${id}`;
    return this.http.get(url, this.jwt());
  }

  getAnnotation(id: number) {
    let url = `${this.endpoint}annotations/${id}`;
    return this.http.get(url, this.jwt());
  }

  saveAnnotation(image: FlickrImage, base64: string, annotationID: number = null) {
    let body = JSON.stringify({
      image: image.id,
      paint_image: base64,
    });
    if (annotationID == null) {
      return this.http.post(`${this.endpoint}annotations`, body, this.jwt());
    } else {
      return this.http.put(`${this.endpoint}annotations/${annotationID}`, body, this.jwt());
    }
  }

  getSemanticChecks() {
    return this.http.get(`${this.endpoint}semantic-check-types`, this.jwt());
  }

  updateAnnotationSemanticChecks(annotationID: number, semanticCheckID: number, value: number) {
    let body = JSON.stringify({
      annotation: annotationID,
      semantic_check: semanticCheckID,
      value: value * 0.01,
    });
    console.log(body);
    return this.http.post(`${this.endpoint}semantic-checks`, body, this.jwt());
  }

  private jwt() {
    // create authorization header with jwt token
    let token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      let headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'X-CSRFToken': this.cookieService.get('csrftoken'),
        'Authorization': `Token ${token}`
      });
      return new RequestOptions({ headers: headers });
    }
  }



}
