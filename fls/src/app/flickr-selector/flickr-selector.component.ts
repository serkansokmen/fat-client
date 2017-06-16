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

  tagModes: any[] = [{
    label: 'AND',
    value: 'all'
  }, {
    label: 'OR',
    value: 'any'
  }];

  form = this.formBuilder.group({
    query: ['nude', Validators.required],
    exclude: ['drawing, sketch'],
    userID: [this.tagModes[0].value],
    tagMode: ['all', Validators.required],
    perPage: [10, Validators.required]
  });

  existingFlickrImageIDs: string[];
  results: FlickrResult[];

  constructor(
    private flickrService: FlickrService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.flickrService.getExistingFlickrImages()
      .subscribe(results => {
        this.existingFlickrImageIDs = results.map(result => result.flickr_image_id);
        this.onSubmit(null);
      });
  }

  onSubmit(event) {
    let search = this.getFlickrSearch();
    this.flickrService.search(search)
      .subscribe(result => {
        this.results = result.results.filter(result => this.existingFlickrImageIDs.indexOf(result.id) == -1);
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

  private getFlickrSearch(): FlickrSearch {
    let value = this.form.value;
    var search = new FlickrSearch();
    search.userID = value.userID;
    search.query = value.query;
    search.exclude = value.exclude;
    search.tagMode = value.tagMode;
    search.perPage = value.perPage;
    // search.images = this.results.map();
    return search;
  }

}
