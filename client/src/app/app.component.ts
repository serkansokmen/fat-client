import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { MdIconRegistry } from '@angular/material';
import { Router, NavigationStart } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'fat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {

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

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private url: LocationStrategy,
    private mdIconRegistry: MdIconRegistry,
  ) {
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.currentLink = this.links.filter(link => link.routerLink.indexOf(event.url) > -1)[0] || this.links[0];
      }
    });
  }

  logout(event) {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
  }

  isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
