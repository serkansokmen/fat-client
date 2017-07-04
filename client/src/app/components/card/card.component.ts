import { Component, Input, Output, OnChanges, SimpleChanges, SimpleChange, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchState } from '../../reducers/search.reducer';
import { SearchActions } from '../../actions/search.actions';
import { Image } from '../../models/search.models';
import { CardLayoutOptions } from '../../models/card-layout.models';

@Component({
  selector: 'fat-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnChanges {

  @Input() image: Image;
  @Input() cardOptions: any;
  @Input() isActionsVisible: boolean;

  @HostBinding('style.flex-basis') flexBasis: string;

  @Output('onImageClick')
  clickEmitter = new EventEmitter<Image>();

  ngOnChanges(changes: SimpleChanges) {
    const cardOptions = changes.cardOptions;
    if (cardOptions && cardOptions.previousValue != cardOptions.currentValue) {
      this.flexBasis = cardOptions.currentValue.id == CardLayoutOptions.list.id ? '100%' : cardOptions.currentValue.cardScale + '%';
    }
  }

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
