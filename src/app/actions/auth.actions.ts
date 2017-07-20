import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


@Injectable()
export class AuthActions {

  static LOGIN = '[Auth] Login';
  login(username: string, password: string): Action {
    return {
      type: AuthActions.LOGIN,
      payload: {
        username,
        password
      }
    }
  }

  static LOGIN_COMPLETE = '[Auth] Login Complete';
  loginComplete(response: any): Action {
    return {
      type: AuthActions.LOGIN_COMPLETE,
      payload: {
        response,
      }
    }
  }

  static LOGIN_ERROR = '[Auth] Login Error';
  loginError(response: any): Action {
    return {
      type: AuthActions.LOGIN_ERROR,
      payload: {
        response,
      }
    }
  }

  static LOGOUT = '[Auth] Logout';
  logout(): Action {
    return {
      type: AuthActions.LOGOUT,
      payload: {}
    }
  }

  static LOGOUT_COMPLETE = '[Auth] Logout Complete';
  logoutComplete(): Action {
    return {
      type: AuthActions.LOGOUT_COMPLETE,
      payload: {}
    }
  }

}
