import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

  public token: string;
  private baseURL = 'http://127.0.0.1:8000/';
  private loginURL = `${this.baseURL}auth/login/`;
  private logoutURL = `${this.baseURL}auth/logout/`;

  constructor(private http: Http) {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }


  login(username: string, password: string): Observable<boolean> {
    let body = JSON.stringify({ username: username, password: password });
    let headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'X-CSRFToken': this.getCSRFToken()
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.loginURL, body, options)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
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
      'Content-Type': 'application/json; charset=utf-8',
      'X-CSRFToken': this.getCSRFToken()
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.logoutURL, options)
      .map((response: Response) => {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        return true;
      });
  }

  getCSRFToken(): string {
    return this.getCookie('csrftoken');
  }

  private getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length == 2) {
      return parts.pop().split(';').shift();
    }
  }
}
