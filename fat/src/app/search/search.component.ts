import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../services/flickr.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SearchState } from '../reducers/search.reducer';
import { SearchActions } from '../actions/search.actions';
import { Search, Image, License } from '../models/search.models';
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
  search: Search;
  images: Image[];
  selectedLicenses: License[];
  imageStates: any[];
  cardLayout$: Observable<CardLayoutState>;
  form: FormGroup;
  currentPage: number;
  currentPerPage: number;

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
    this.imageStates = [
      {key: 'Discarded', value: 0},
      {key: 'Approved', value: 1},
      {key: 'Processed', value: 2},
      {key: 'Indeterminate', value: 3},
    ];
    this.images = [];
    this.currentPage = 0;
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      tags: ['', Validators.required],
      userID: [''],
      tagMode: ['all', Validators.required],
      perpage: [20, Validators.required],
      page: [1, Validators.required]
    });

    this.state$.subscribe(state => {

      this.search = state.search;
      this.selectedLicenses = state.selectedLicenses;
      this.images = state.images;
      this.currentPage = state.page;
      this.currentPerPage = state.perpage;

      if (state.search && state.search.tags != this.form.value.tags) {
        this.form.patchValue(state.search);
      }
    });

    // this.form.valueChanges
    //   .debounceTime(500)
    //   .subscribe(data => {
    //     // if (this.currentPage == data.page) return;
    //     // if (this.currentPerPage == data.perPage) return;
    //     // console.log(data.page, data.perPage);
    //     // this.handleSearch(null);
    //   });

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
    if (!this.form.value) {
      return;
    }
    this.store.dispatch(
      this.searchActions.requestSearch(
        Search.fromJSON({
          ...this.form.value,
          tag_mode: this.form.value.tagMode,
          user_id: this.form.value.userID
        }),
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
    return this.selectedLicenses.map(license => license.id).indexOf(license.id) > -1;
  }

  handleThumbnailScale(event) {
    this.store.dispatch(this.cardLayoutActions.setThumbnailScale(event.value));
  }

  handleViewMode(event) {
    this.store.dispatch(this.cardLayoutActions.selectViewMode(event.value));
  }

  handleDiscardAll(event) {
    this.store.dispatch(this.searchActions.discardAll(this.search, this.images))
  }

  handleSave(event) {
    this.store.dispatch(this.searchActions.saveSearch(this.search, this.images, this.selectedLicenses));
  }

  logout(event) {
    this.authenticationService.logout()
      .subscribe(result => {
        this.router.navigate(['/login']);
      });
  }

}
