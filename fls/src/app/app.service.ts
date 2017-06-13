import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppService {

  private baseURL = 'http://192.168.99.100/';
  private apiURL = `${this.baseURL}api/v1/flickrsearch/?format=json`;
  private authURL = `${this.baseURL}api-token-auth/`;

  constructor(private http: Http) { }

  login(username: string, password: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200/'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.authURL, {
      username,
      password
    })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getExistingSearchs() {
    return this.http.get(this.apiURL)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
