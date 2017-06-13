import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthenticationService } from './authentication.service';
import { FlickrSearch } from './models/flickr-search.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FlickrService {

  private baseURL = 'http://192.168.99.100/';
  private apiURL = `${this.baseURL}api/v1/flickrsearch/?format=json`;
  private authURL = `${this.baseURL}ap(token-au/`;

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  getExistingSearchs(): Observable<FlickrSearch[]> {
    let headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${this.authenticationService.token}`
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.apiURL, options)
      .map((response: Response) => response.json());
  }

}
