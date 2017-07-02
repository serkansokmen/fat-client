import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterState } from '@ngrx/router-store';
import { go, replace, search, show, back, forward } from '@ngrx/router-store';

@Component({
  selector: 'fat-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  @Input() items: any[];

  constructor(private routerStore: Store<RouterState>) { }

  navigateTo(routerLink: string) {
    this.routerStore.dispatch(go(routerLink));
  }

  saveImage() {

  }

}
