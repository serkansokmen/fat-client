import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {

  private authURL: string;
  private options: RequestOptions;

  constructor(
    private http: Http,
    private cookieService: CookieService) {

    this.authURL = `${environment.authURL}`;

    const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
    this.options = new RequestOptions({ headers });
  }

  login(username: string, password: string): Observable<any> {
    let body = JSON.stringify({ username: username, password: password });
    return this.http.post(`${this.authURL}login/`, body, this.options);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authURL}logout/`, this.options);
  }
}
