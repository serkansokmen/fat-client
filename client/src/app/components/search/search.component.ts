import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SearchState } from '../../reducers/search.reducer';
import { SearchActions } from '../../actions/search.actions';
import { Image, License, ImageState } from '../../models/search.models';
import { CardLayoutActions } from '../../actions/card-layout.actions';
import { CardLayoutState } from '../../reducers/card-layout.reducer';
import { CardLayoutOptions } from '../../models/card-layout.models';
import { maxValue } from '../../validators/max-value.validator';


@Component({
  selector: 'fat-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  state$: Observable<SearchState>;
  images: Image[];
  selectedLicenses: License[];
  imageStates: any[];
  cardLayout$: Observable<CardLayoutState>;
  form: FormGroup;
  currentPage: number;
  currentPerPage: number;
  maxPerPage: number = 100;

  private sub: any;

  constructor(
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
      { key: 'Indeterminate', value: 0 },
      { key: 'Discarded', value: 1 },
      { key: 'Approved', value: 2 },
      { key: 'Completed', value: 3 },
    ];
    this.images = [];
    this.currentPage = 0;
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      id: [null],
      tags: ['train,child,-drawing', Validators.required],
      userID: [''],
      tagMode: ['all', Validators.required],
      perpage: [10, Validators.required],
      page: [1, Validators.required],
    });
    this.store.dispatch(this.cardLayoutActions.setActionsVisible(true));

    this.state$.subscribe(state => {
      if (this.images != state.images && state.images.length == 0 && state.total > 0) {
        this.handleSearch(null);
      }

      if (state.search && state.search.id != this.form.value.id) {
        this.form.patchValue(state.search);
      }

      this.selectedLicenses = state.selectedLicenses;
      this.images = state.images;
      this.currentPerPage = state.perpage;


    });

    // this.form.valueChanges
    //   .debounceTime(100)
    //   .subscribe(data => {
        // if (this.currentPage == data.page) return;
        // if (this.currentPerPage == data.perpage) return;
        // console.log(data.page, data.perpage);
        // this.handleSearch(null);
    // });

    this.sub = this.route.params.subscribe(params => {
      if (params.slug) {
        console.log(params.slug);
      }
      this.handleSearch(null);
      this.store.dispatch(this.cardLayoutActions.selectViewMode(CardLayoutOptions.thumbs));
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleImageDiscarded(image) {
    this.store.dispatch(this.searchActions.toggleImageDiscarded(image));
  }

  handleSearch(event) {
    if (!this.form.value) {
      return;
    }
    this.store.dispatch(
      this.searchActions.requestSearch(
        this.form.value,
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

  handlePerpageKeypress(event) {
    event.preventDefault();
    let perpage = parseInt(event.target.value, 10);
    if (event.keyCode == 13 && perpage > this.maxPerPage) {
      perpage = this.maxPerPage;
    }
    this.store.dispatch(this.searchActions.setPerpage(perpage));
  }

  handleDiscardAll(event) {
    this.store.dispatch(this.searchActions.saveSearch(
      this.form.value,
      this.images.map(image => new Image({
        ...image,
        state: ImageState.discarded
      })),
      this.selectedLicenses));
  }

  handleSave(event) {
    this.store.dispatch(this.searchActions.saveSearch(
      this.form.value,
      this.images,
      this.selectedLicenses));
  }

}
