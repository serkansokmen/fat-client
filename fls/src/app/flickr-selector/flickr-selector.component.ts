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
  images: FlickrImage[] = [];
  selectedImage: FlickrImage;
  isRequesting: boolean = false;

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
    this.isRequesting = true;
    this.flickrService.getExistingFlickrImages()
      .subscribe(results => {
        this.selectedImage = null;
        this.handleSearch(null);
        this.isRequesting = false;
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
    this.isRequesting = true;
    this.flickrService.search(search)
      .subscribe(result => {
        this.images = result.results.filter((image, key) => { return key < search.perPage });
        this.isRequesting = false;
      });
  }

  toggleDiscarded(result: FlickrImage) {
    result.is_discarded = !result.is_discarded;
  }

  selectImage(image) {
    this.selectedImage == image ? this.selectedImage = null : this.selectedImage = image;
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
    this.isRequesting = true;
    this.flickrService.saveSearch(search)
      .subscribe(result => {
        window.location.reload();
        this.isRequesting = false;
        // this.images = result.images.filter(image => !image.is_discarded);
      });
  }

  logout(event) {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
  }

}
