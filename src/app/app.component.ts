import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { go } from '@ngrx/router-store';
import { MdIconRegistry } from '@angular/material';
import { Store } from '@ngrx/store';
import { AuthState } from './reducers/auth.reducer';
import { AuthActions } from './actions/auth.actions';

import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'fat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  auth$: Observable<AuthState>;
  private sub: any;

  title: string = 'FAT';
  links: any[] = [{
    title: 'Collect images',
    routerLink: '/search',
    isDisabled: false,
    iconName: 'fa-search',
  }, {
    title: 'Annotate approved images',
    routerLink: '/annotate',
    isDisabled: false,
    iconName: 'fa-paint-brush',
  }];
  currentLink: any;
  isAuthenticated: boolean;

  constructor(
    public store: Store<AuthState>,
    public actions: AuthActions,
    private mdIconRegistry: MdIconRegistry,
  ) {
    this.auth$ = store.select('auth');
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

  ngOnInit() {
    this.sub = this.auth$.subscribe((state: AuthState) => {
      if (!state.token) {
        this.store.dispatch(go(['/login']));
      }
      this.isAuthenticated = state.token && state.token.length > 0;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleLogout() {
    this.store.dispatch(this.actions.logout());
  }

}
