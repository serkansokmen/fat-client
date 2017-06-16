import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../flickr.service';
import { FlickrSearch, FlickrResult, FlickrImage } from '../models/flickr.models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fls-flickr-selector',
  templateUrl: './flickr-selector.component.html',
  styleUrls: ['./flickr-selector.component.scss']
})
export class FlickrSelectorComponent implements OnInit {

  searchForm = this.fb.group({
    userID: [''],
    query: ['nude', Validators.required],
    exclude: ['drawing, sketch'],
    tagMode: ['all', Validators.required],
    perPage: [10, Validators.required]
  });
  existing: FlickrSearch[];
  results: FlickrResult[];

  constructor(
    private flickrService: FlickrService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.flickrService.getExistingSearchs()
      .subscribe(result => {
        this.existing = result;
      });
    this.search(null);
  }

  search(event) {
    let value = this.searchForm.value;
    var search = new FlickrSearch();
    search.userID = value.userID;
    search.query = value.query;
    search.exclude = value.exclude;
    search.tagMode = value.tagMode;
    search.perPage = value.perPage;

    this.flickrService.search(search)
      .subscribe(result => {
        this.results = result.results;
      });
  }

  toggle(result: FlickrResult) {
    result.isSelected = !result.isSelected;
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
    }

}
