import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../flickr.service';
import { FlickrSearch, FlickrResult, FlickrQuery } from '../models/flickr.models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fls-flickr-selector',
  templateUrl: './flickr-selector.component.html',
  styleUrls: ['./flickr-selector.component.scss']
})
export class FlickrSelectorComponent implements OnInit {

  searchForm = this.fb.group({
    userID: [''],
    query: ['', Validators.required],
    exclude: [''],
    tagMode: ['', Validators.required],
    perPage: [4, Validators.required]
  });
  existing: FlickrSearch[];
  results: FlickrResult[];
  currentPage: number = 1;
  totalPages: number;

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
  }

  search(event) {
    let value = this.searchForm.value;
    var query = new FlickrQuery();
    query.userID = value.userID;
    query.query = value.query;
    query.exclude = value.exclude;
    query.tagMode = value.tagMode;
    query.perPage = value.perPage;

    this.flickrService.search(query)
      .subscribe(result => {
        this.totalPages = result.totalPages;
        this.results = result.results;
      });
  }

  toggle(result: FlickrResult) {
    result.isSelected = !result.isSelected;
  }

  prevPage(event) {
    if (this.currentPage == 0) {
      return;
    }
    this.currentPage--;
    this.search(event);
  }

  nextPage(event) {
    if (this.currentPage == this.totalPages) {
      return;
    }
    this.currentPage++;
    this.search(event);
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
    }

}
