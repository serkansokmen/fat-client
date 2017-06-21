import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { FlickrService } from '../services/flickr.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { SearchState } from '../reducers/flickr.reducer';
import { FlickrActions } from '../actions/flickr.actions';
import { FlickrSearch, FlickrImage } from '../models/flickr.models';


@Component({
  selector: 'fls-flickr-search',
  templateUrl: './flickr-search.component.html',
  styleUrls: ['./flickr-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlickrSearchComponent implements OnInit, OnDestroy {

  state$: Observable<SearchState>;
  form: FormGroup;
  images: FlickrImage[];

  private sub: any;

  constructor(
    private flickrService: FlickrService,
    private authenticationService: AuthenticationService,
    private actions: FlickrActions,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: Store<SearchState>,
  ) {
    this.state$ = store.select('flickr');
    this.images = [];
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      query: ['', Validators.required],
      exclude: [''],
      userID: [''],
      tagMode: ['', Validators.required],
      perPage: [10, Validators.required]
    });

    // this.route.params
    //   .switchMap((params: Params) => this.flickrService.getSearch(params['id']))
    //   .subscribe((survey: any) => {
    //     // update the form controls
    //   });

    this.state$.subscribe(state => {
      this.images = state.images;
      if (state.instance.query != this.form.value.query) {
        this.form.patchValue(state.instance);
        this.store.dispatch(this.actions.requestFlickrSearch(state.instance));
      }
    });

    this.sub = this.route.params.subscribe(params => {
      if (params.slug) {
        console.log(params.slug);
      }
    });

  }

  getLicence(id: number) {
    return this.flickrService.getLicence(id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleImageClick(image: FlickrImage) {
    this.store.dispatch(this.actions.toggleImageDiscarded(image));
  }

  handleSearch(event) {
    this.store.dispatch(
      this.actions.requestFlickrSearch(
        new FlickrSearch(this.form.value)));
  }

  // selectImage(image) {
  //   this.selectedImage == image ? this.selectedImage = null : this.selectedImage = image;
  // }

  handleSave(event) {
    this.store.dispatch(
      this.actions.saveSearch(new FlickrSearch(this.form.value), this.images));
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
  //           this.selectedImage = null;
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
