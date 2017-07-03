import { Component, Input, Output, OnChanges, SimpleChanges, SimpleChange, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
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
export class CardComponent implements OnChanges {

  @Input() image: Image;
  @Input() viewMode: ViewMode;
  @Input() cardScale: number;
  @Input() isActionsVisible: boolean;

  @HostBinding('style.width') cssThumbWidth: string;

  @Output('onImageClick')
  clickEmitter = new EventEmitter<Image>();

  ngOnChanges(changes: SimpleChanges) {
    const viewMode = changes.viewMode;
    if (viewMode && viewMode.previousValue != viewMode.currentValue) {
      this.cssThumbWidth = viewMode.currentValue.id == 0 ? '100%' : this.cardScale + '%';
    }

    const cardScale = changes.cardScale;
    if (cardScale && cardScale.previousValue != cardScale.currentValue) {
      this.cssThumbWidth = this.viewMode.id == 0 ? '100%' : changes.cardScale.currentValue + '%';
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
