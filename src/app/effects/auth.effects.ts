import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { go } from '@ngrx/router-store';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'ngx-cookie';
import { AuthActions } from '../actions/auth.actions';
import { AuthState } from '../reducers/auth.reducer';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthEffects {

  private authURL: string;

  constructor(
    private actions$: Actions,
    private authActions: AuthActions,
    private store$: Store<AuthState>,
    private service: AuthService,
    private http: Http,
  ) {
    this.authURL = `${environment.authURL}`;
    const token = JSON.parse(localStorage.getItem('token'));
  }

  @Effect() login$ = this.actions$
    .ofType(AuthActions.LOGIN)
    .switchMap(action => this.service
      .login(action.payload.username, action.payload.password)
      .map(res => res.json())
      .filter(res => res.key && res.key.length > 0)
      .map(res => {
        const token = res.key;
        localStorage.setItem('token', JSON.stringify(token));
        return {
          type: AuthActions.LOGIN_COMPLETE,
          payload: {
            token
          }
        }
      })
      .catch(err => {
        return Observable.of({
          type: AuthActions.LOGIN_ERROR,
          payload: {
            errors: err.json().non_field_errors
          }
        })
      }))

  @Effect() logout$ = this.actions$
    .ofType(AuthActions.LOGOUT)
    .switchMap(() => this.service
      .logout()
      .map(res => res.json())
      .map(res => {
        localStorage.removeItem('token');
        return {
          type: AuthActions.LOGOUT_COMPLETE,
        }
      }));

}
