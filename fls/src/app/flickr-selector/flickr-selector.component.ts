import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../flickr.service';
import { FlickrSearch, FlickrImage } from '../models/flickr.models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fls-flickr-selector',
  templateUrl: './flickr-selector.component.html',
  styleUrls: ['./flickr-selector.component.scss']
})
export class FlickrSelectorComponent implements OnInit {

  @Input('query') query: string = 'box';
  @Input('exclude') exclude: string = 'ring';

  tagModes: any[] = [{
    label: 'AND',
    value: 'all'
  }, {
    label: 'OR',
    value: 'any'
  }];

  form: FormGroup;
  images: FlickrImage[];

  constructor(
    private flickrService: FlickrService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      query: [this.query, Validators.required],
      exclude: [this.exclude],
      userID: [''],
      tagMode: [this.tagModes[0].value, Validators.required],
      perPage: [10, Validators.required]
    });
    this.flickrService.getExistingFlickrImages()
      .subscribe(results => {
        this.images = results;
        this.handleSearch(null);
      });
  }

  handleSearch(event) {
    let value = this.form.value;
    let search = new FlickrSearch();
    search.userID = value.userID;
    search.query = value.query;
    search.exclude = value.exclude;
    search.tagMode = value.tagMode;
    search.perPage = value.perPage;
    search.images = this.images && this.images.map(result => new FlickrImage(result));
    this.flickrService.search(search)
      .subscribe(result => {
        console.log(result.results);
        this.images = result.results;
      });
  }

  toggleDiscarded(result: FlickrImage) {
    result.is_discarded = !result.is_discarded;
  }

  handleSave(event) {
    let value = this.form.value;
    let search = new FlickrSearch();
    search.userID = value.userID;
    search.query = value.query;
    search.exclude = value.exclude;
    search.tagMode = value.tagMode;
    search.perPage = value.perPage;
    search.images = this.images;
    this.flickrService.saveSearch(search)
      .subscribe(result => {
        console.log(result);
      });
  }

  logout(event) {
    console.log(event);
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
  }

}
