import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../services/flickr.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SearchState } from '../reducers/flickr.reducer';
import { FlickrActions } from '../actions/flickr.actions';
import { FlickrSearch, FlickrImage, TagMode, License } from '../models/flickr.models';
import { CardLayoutActions } from '../actions/card-layout.actions';
import { CardLayoutState } from '../reducers/card-layout.reducer';
import { ViewMode } from '../models/card-layout.models';


@Component({
  selector: 'fls-flickr-search',
  templateUrl: './flickr-search.component.html',
  styleUrls: ['./flickr-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlickrSearchComponent implements OnInit, OnDestroy {

  state$: Observable<SearchState>;
  cardLayout$: Observable<CardLayoutState>;
  form: FormGroup;
  images: FlickrImage[];
  selectedLicenses: License[];

  private sub: any;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: Store<SearchState>,
    private flickrActions: FlickrActions,
    private cardLayoutActions: CardLayoutActions,
  ) {
    this.state$ = store.select('flickr');
    this.cardLayout$ = store.select('cardLayout');
    this.images = [];
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      query: ['', Validators.required],
      exclude: [''],
      userID: [''],
      tagMode: ['', Validators.required],
      perpage: [10, Validators.required],
      page: [1, Validators.required]
    });

    this.state$.subscribe(state => {

      this.selectedLicenses = state.selectedLicenses;
      this.images = state.images;

      if (state.instance.query != this.form.value.query && state.licenses.length > 0) {
        this.form.patchValue(state.instance);
      }
    });

    this.form.valueChanges.debounceTime(500).subscribe(data => {
      this.handleSearch(null);
    });

    this.sub = this.route.params.subscribe(params => {
      if (params.slug) {
        console.log(params.slug);
      }
      this.handleSearch(null);
      this.store.dispatch(this.cardLayoutActions.selectViewMode(ViewMode.thumbnails));
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleSearch(event) {
    this.store.dispatch(
      this.flickrActions.requestSearch(
        new FlickrSearch(this.form.value),
        this.selectedLicenses,
        this.form.value.perpage,
        this.form.value.page));
  }

  handleToggleLicense(license: License, isChecked: boolean) {
    if (isChecked == true) {
      this.store.dispatch(this.flickrActions.selectLicense(license))
    } else {
      this.store.dispatch(this.flickrActions.deselectLicense(license));
    }
  }

  isLicenseSelected(license: License): boolean {
    return this.selectedLicenses.indexOf(license) > -1;
  }

  handleThumbnailScale(event) {
    this.store.dispatch(this.cardLayoutActions.setThumbnailScale(event.value));
  }

  handleViewMode(event) {
    this.store.dispatch(this.cardLayoutActions.selectViewMode(event.value));
  }

  handleSave(event) {
    this.store.dispatch(
      this.flickrActions.saveSearch(new FlickrSearch(this.form.value), this.images));
  //   let search = new FlickrSearch({
  //     ...this.form.value,
  //     images: this.images
  //   });
  //   this.isRequesting = true;
  //   this.flickrService.saveSearch(search)
  //     .subscribe(result => {
  //       // window.location.reload();
  //       this.flickrService.getExistingFlickrImages()
  //         .subscribe(results => {
  //           this.handleSearch(null);
  //           this.isRequesting = false;
  //         });
  //       // this.router.navigate([
  //       //   '/search', {
  //       //     query: encodeURIComponent(result.query),
  //       //     exclude: encodeURIComponent(result.exclude)
  //       //   }
  //       // ], {
  //       //   replaceUrl: true
  //       // });
  //       this.isRequesting = false;
  //     });
  }

  logout(event) {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
  }

}
