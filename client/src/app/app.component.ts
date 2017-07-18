import { Component } from '@angular/core';
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
export class AppComponent {

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
  }, {
    title: 'Review annotated images',
    routerLink: '/review',
    isDisabled: true,
    iconName: 'fa-thumbs-o-up',
  }];
  currentLink: any;
  isAuthenticated: boolean;

  constructor(
    public store: Store<AuthState>,
    public actions: AuthActions,
    private mdIconRegistry: MdIconRegistry,
  ) {
    this.store.select('auth')
      .distinctUntilChanged()
      .subscribe((state: AuthState) => {
        if (state.token) {
          go(['/search']);
        }
      this.isAuthenticated = state.token && state.token.length > 0;
    });
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

  handleLogout() {
    this.store.dispatch(this.actions.logout());
  }

}
