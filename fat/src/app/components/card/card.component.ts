import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchState } from '../../reducers/search.reducer';
import { SearchActions } from '../../actions/search.actions';
import { Image } from '../../models/search.models';
import { ViewMode } from '../../models/card-layout.models';

@Component({
  selector: 'fat-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  @Input() image: Image;
  @Input() viewMode: ViewMode;
  @Input() cardScale: number;

  @Output('onImageClick')
  clickEmitter = new EventEmitter<Image>();

  getImageURL(image: Image) {
    return Image.getImageURL(image);
  }

  getThumbnail(image: Image) {
    return Image.getThumbnail(image);
  }

  handleImageClick(image: Image) {
    this.clickEmitter.emit(image);
  }

}
