import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

  public token: string;

  private authURL: string;

  constructor(
    private http: Http,
    private cookieService: CookieService) {

    this.authURL = `${environment.authURL}`;

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }


  login(username: string, password: string): Observable<boolean> {
    let body = JSON.stringify({ username: username, password: password });
    let headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.authURL}login/`, body, options)
      .map((response: Response) => {
        let token = response.json() && response.json().key;
        if (token) {
          // set token property
          this.token = token;

          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser',
            JSON.stringify({ username: username, token: token }));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      });
  }

  logout(): Observable<boolean> {
    let headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.authURL}logout/`, options)
      .map((response: Response) => {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        return true;
      });
  }
}
