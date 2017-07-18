import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../reducers/auth.reducer';
import { AuthActions } from '../../actions/auth.actions';

@Component({
  selector: 'fat-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  auth$: Observable<AuthState>;
  model: any = {};

  constructor(
    private store: Store<AuthState>,
    private actions: AuthActions,
  ) {
    this.auth$ = store.select('auth');
  }

  handleLogin() {
    this.store.dispatch(this.actions.login(this.model.username, this.model.password));
  }

}
