import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class FlickrSelectorComponent implements OnInit, OnDestroy {

  @Input('query') query: string = 'nude, skin';
  @Input('exclude') exclude: string = 'drawing, sketch, sculpture';

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

  private sub: any;

  constructor(
    private flickrService: FlickrService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {

      if (params.query) {
        this.query = decodeURIComponent(params.query);
      }
      if (params.exclude) {
        this.exclude = decodeURIComponent(params.exclude);
      }
    });

    this.form = this.formBuilder.group({
      query: [this.query, Validators.required],
      exclude: [this.exclude],
      userID: [''],
      tagMode: [this.tagModes[0].value, Validators.required],
      perPage: [20, Validators.required]
    });
    this.isRequesting = true;
    this.flickrService.getExistingFlickrImages()
      .subscribe(results => {
        this.selectedImage = null;
        this.handleSearch(null);
        this.isRequesting = false;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleSearch(event) {
    this.images = [];
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
        // window.location.reload();
        // this.handleSearch(null);
        this.router.navigate([
          '/search', {
            query: encodeURIComponent(result.query),
            exclude: encodeURIComponent(result.exclude)
          }
        ], {
          replaceUrl: true
        });
        this.isRequesting = false;
      });
  }

  logout(event) {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
  }

}
