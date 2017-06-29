import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../services/flickr.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SearchState } from '../reducers/search.reducer';
import { SearchActions } from '../actions/search.actions';
import { Search, Image, TagMode, ImageState, License } from '../models/search.models';
import { CardLayoutActions } from '../actions/card-layout.actions';
import { CardLayoutState } from '../reducers/card-layout.reducer';
import { ViewMode } from '../models/card-layout.models';
import { maxValue } from '../validators/max-value.validator';


@Component({
  selector: 'fls-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  state$: Observable<SearchState>;
  cardLayout$: Observable<CardLayoutState>;
  form: FormGroup;
  images: Image[];
  selectedLicenses: License[];
  currentPage: number;

  private sub: any;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: Store<SearchState>,
    private searchActions: SearchActions,
    private cardLayoutActions: CardLayoutActions,
  ) {
    this.state$ = store.select('search');
    this.cardLayout$ = store.select('cardLayout');
    this.images = [];
    this.currentPage = 0;
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      query: ['', Validators.required],
      exclude: [''],
      userID: [''],
      tagMode: ['', Validators.required],
      perpage: [20, Validators.required],
      page: [1, Validators.required]
    });

    this.state$.subscribe(state => {

      this.selectedLicenses = state.selectedLicenses;
      this.images = state.images;

      if (state.instance.query != this.form.value.query && state.licenses.length > 0) {
        this.form.patchValue(state.instance);
      }
    });

    this.form.valueChanges
      .debounceTime(500)
      .subscribe(data => {
        if (this.currentPage != data.page && data.page > 0) {
          console.log(data.page);
          this.handleSearch(null);
        }
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
      this.searchActions.requestSearch(
        new Search(this.form.value),
        this.selectedLicenses,
        this.form.value.perpage,
        this.form.value.page));
  }

  handleToggleLicense(license: License, isChecked: boolean) {
    if (isChecked == true) {
      this.store.dispatch(this.searchActions.selectLicense(license))
    } else {
      this.store.dispatch(this.searchActions.deselectLicense(license));
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

  handleDiscardAll(event) {
    this.store.dispatch(
      this.searchActions.saveSearch(
        new Search(this.form.value),
        this.images.map(image => {
          return new Image({
            ...image,
            state: ImageState.discarded
          })
        }),
        this.selectedLicenses));
  }

  handleSave(event) {
    this.store.dispatch(
      this.searchActions.saveSearch(
        new Search(this.form.value),
        this.images,
        this.selectedLicenses));
  //   let search = new Search({
  //     ...this.form.value,
  //     images: this.images
  //   });
  //   this.isRequesting = true;
  //   this.flickrService.saveSearch(search)
  //     .subscribe(result => {
  //       // window.location.reload();
  //       this.flickrService.getExistingImages()
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
