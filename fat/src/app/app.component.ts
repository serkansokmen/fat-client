import { Component, OnInit } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'fat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private mdIconRegistry: MdIconRegistry,
  ) {
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

  ngOnInit() {
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
}
