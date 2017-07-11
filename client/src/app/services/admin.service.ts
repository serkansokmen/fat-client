import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AdminService {

  adminEndpoint: string;

  constructor(
    private http: Http,
    private cookieService: CookieService,
    private router: Router,) {
    this.adminEndpoint = environment.adminURL;
  }

}
