import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { PlatformLocation } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { FlickrSearch, FlickrImage } from '../models/flickr.models';
import { map, filter, union } from 'underscore';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/mergeMap';

@Injectable()
export class FlickrService {

  private endpoint: string;
  private apiKey: string;
  private existingImages: FlickrImage[] = [];

  constructor(
    private http: Http,
    private cookieService: CookieService) {

    this.endpoint = `${environment.apiURL}/search/?format=json`;
    this.apiKey = `${environment.flickrApiKey}`
  }

  getLicence(id: number): any {
    let licences = [
      { id: 0, name: 'All Rights Reserved', url: ''},
      { id: 1, name: "Attribution-NonCommercial-ShareAlike License", url:"http://creativecommons.org/licenses/by-nc-sa/2.0/"},
      { id: 2, name: "Attribution-NonCommercial License", url:"http://creativecommons.org/licenses/by-nc/2.0/"},
      { id: 3, name: "Attribution-NonCommercial-NoDerivs License", url:"http://creativecommons.org/licenses/by-nc-nd/2.0/"},
      { id: 4, name: "Attribution License", url:"http://creativecommons.org/licenses/by/2.0/"},
      { id: 5, name: "Attribution-ShareAlike License", url:"http://creativecommons.org/licenses/by-sa/2.0/"},
      { id: 6, name: "Attribution-NoDerivs License", url:"http://creativecommons.org/licenses/by-nd/2.0/"},
      { id: 7, name: "No known copyright restrictions", url:"http://flickr.com/commons/usage/"},
      { id: 8, name: "United States Government Work", url:"http://www.usa.gov/copyright.shtml"}
      ];
      return licences.filter(license => license.id == id)[0];
  }

  getSearch(id: number) {
    console.log(id);
  }

  getExistingFlickrImages(): Observable<FlickrImage[]> {
    return this.http.get(this.endpoint, this.jwt())
      .map((response: Response) => response.json())
      .map(values => {
        return [].concat.apply([], values.map(value => value.images))
      })
      .map(images => {
        this.existingImages = images
          .map(data => new FlickrImage(data))
        return this.existingImages;
      });
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
      // '&license=4,5,6,7' +
      '&license=0,1,2,3,4,5,6,7,8' +
      '&safe_search=3' +
      '&sort=relevance' +
      '&media=photos' +
      '&content_type=7' +
      '&media=photos' +
      '&extras=license,tags' +
      // `&per_page=${search.perPage + 1}` +
      `&per_page=${100}` +
      // `&page=${page}` +
      `&tags=${searchQuery}` +
      `&tag_mode=${search.tagMode.value}`;

    return this.http.get(url)
      .map((response: Response) => response.json())
      .map((result: any) => {
        if (result.stat != 'ok') {
          alert('Unable to get photos from Flickr:' + result.message);
          return;
        }
        return {
          totalPages: result.photos.pages,
          results: result.photos.photo
            .filter(photo => {
              return this.existingImages
                .filter(image => image.flickr_image_id == photo.id)
                .length == 0;
            })
            .map(photo => {
              return new FlickrImage(photo);
            })
        };
      });
  };


  saveSearch(search: FlickrSearch, images: FlickrImage[]) {
    let body = JSON.stringify({
      query: search.query,
      exclude: search.exclude || '',
      user_id: search.userID,
      tag_mode: search.tagMode.value,
      images
    });
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'X-CSRFToken': this.cookieService.get('csrftoken'),
        'Authorization': `Token ${currentUser.token}`
      });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.endpoint, body, options)
        .map((response: Response) => response.json());
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
