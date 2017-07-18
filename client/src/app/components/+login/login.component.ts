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
export class LoginComponent implements OnInit, OnDestroy {

  auth$: Observable<AuthState>;
  model: any = {};
  private sub: any;

  constructor(
    private store: Store<AuthState>,
    private actions: AuthActions,
  ) {
    this.auth$ = store.select('auth');
  }

  ngOnInit() {
    // // reset login status
    this.sub = this.auth$.subscribe(state => {
      console.log(state);
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleLogin() {
    this.store.dispatch(this.actions.login(this.model.username, this.model.password));
  }

}
