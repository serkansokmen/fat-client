import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface AuthState {
  token?: string,
  errors?: string[],
  isRequesting: boolean,
};

const initialState: AuthState = {
  isRequesting: false,
  token: JSON.parse(localStorage.getItem('token')),
};

export function authReducer(state: AuthState = initialState, action: Action) {
  switch (action.type) {

    case AuthActions.LOGIN:
      return {
        ...state,
        isRequesting: true,
        errors: null,
      }

    case AuthActions.LOGIN_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        token: action.payload.token,
      }

    case AuthActions.LOGIN_ERROR:
      return {
        ...state,
        isRequesting: false,
        errors: action.payload.errors,
      }

    case AuthActions.LOGOUT:
      return {
        ...state,
        isRequesting: true,
      }

    case AuthActions.LOGOUT_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        token: null
      }

    default:
      return state;
  }
}
