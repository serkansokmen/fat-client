import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../flickr.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fls-flickr-selector',
  templateUrl: './flickr-selector.component.html',
  styleUrls: ['./flickr-selector.component.scss']
})
export class FlickrSelectorComponent implements OnInit {

  constructor(
    private flickrService: FlickrService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.flickrService.getExistingSearchs()
      .subscribe(result => {
        console.log(result);
      })
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
    }

}
