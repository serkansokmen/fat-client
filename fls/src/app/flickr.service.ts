import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthenticationService } from './authentication.service';
import { FlickrSearch, FlickrResult, FlickrImage } from './models/flickr.models';
import { map, filter } from 'underscore';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';

@Injectable()
export class FlickrService {

  private baseURL = 'http://192.168.99.100/';
  private apiURL = `${this.baseURL}api/v1/search/?format=json`;
  private apiKey = '6b989cc3f4f8a9cffc10e0a7a2d0ab2c';

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) { }

  getExistingFlickrImages(): Observable<any[]> {
    return this.http.get(this.apiURL, this.jwt())
      .map((response: Response) => response.json())
      .map(values => [].concat.apply([], values.map(value => value.images)));
  }

  search(search: FlickrSearch): Observable<any> {
    let queryStr = search.query;
    let excludeStr = search.exclude.split(',').map(str => ` -${str.trim()}`).join(',');
    var searchQuery = queryStr;
    if (excludeStr != '-') {
      searchQuery += `,${excludeStr}`;
    }
    let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search` +
      `&api_key=${this.apiKey}` +
      '&format=json&nojsoncallback=1' +
      '&license=4,5,6,7' +
      '&safe_search=3' +
      '&sort=relevance' +
      '&media=photos' +
      '&content_type=7' +
      '&media=photos' +
      '&extras=license,tags' +
      `&per_page=${search.perPage + 1}` +
      // `&page=${page}` +
      `&tags=${searchQuery}` +
      `&tag_mode=${search.tagMode}`;

    return this.http.get(url)
      .map((response: Response) => response.json())
      .map((result: any) => {
        if (result.stat != 'ok') {
          alert('Unable to get photos from Flickr:' + result.message);
          return;
        }

        return {
          totalPages: result.photos.pages,
          results: result.photos.photo.map((p) => {
            var result = new FlickrResult();
            new FlickrResult();
            result.id = p.id;
            result.url = `https://farm${p.farm}.staticflickr.com/${p.server}/${p.id}_${p.secret}.jpg`;
            result.thumbnail = `https://farm${p.farm}.staticflickr.com/${p.server}/${p.id}_${p.secret}_q.jpg`;
            result.tags = p.tags;
            result.license = p.license;
            return result;
          })
        };
      });
  };

  saveSearch(search: FlickrSearch) {
    let body = JSON.stringify({
      query: search.query,
      exclude: search.exclude,
      user_id: search.userID,
      tag_mode: search.tagMode,
      images: search.images.map(image => {
        return {
          flickr_image_id: image.flickr_image_id,
          flickr_image_url: image.flickr_image_url
        };
      })
    });
    let headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'X-CSRFToken': this.authenticationService.getCSRFToken()
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiURL, body, options)
      .map((response: Response) => response.json());
  }

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Token ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }

}
