import { Component, Input, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchState } from '../reducers/search.reducer';
import { SearchActions } from '../actions/search.actions';
import { Image } from '../models/search.models';
import { ViewMode } from '../models/card-layout.models';

@Component({
  selector: 'fls-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchCardComponent implements OnInit {

  @Input() image: Image;
  @Input() viewMode: ViewMode;
  @Input() thumbnailScale: number;

  constructor(
    private store: Store<SearchState>,
    private actions: SearchActions,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {

  }

  getImageURL(image: Image) {
    return Image.getImageURL(image);
  }

  getThumbnail(image: Image) {
    return Image.getThumbnail(image);
  }

  handleImageClick(image: Image) {
    this.store.dispatch(this.actions.toggleImageDiscarded(image));
  }

}
