import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchState } from '../reducers/flickr.reducer';
import { FlickrActions } from '../actions/flickr.actions';
import { FlickrImage } from '../models/flickr.models';
import { ViewMode } from '../models/card-layout.models';

@Component({
  selector: 'fls-flickr-card',
  templateUrl: './flickr-card.component.html',
  styleUrls: ['./flickr-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlickrCardComponent implements OnInit {

  @Input() flickrImage: FlickrImage;
  @Input() viewMode: ViewMode;

  constructor(
    private store: Store<SearchState>,
    private actions: FlickrActions,
  ) { }

  ngOnInit() {
  }

  getImageURL(image: FlickrImage) {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
  }

  getThumbnail(image: FlickrImage) {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_q.jpg`;
  }

  handleImageClick(image: FlickrImage) {
    this.store.dispatch(this.actions.toggleImageDiscarded(image));
  }

}
