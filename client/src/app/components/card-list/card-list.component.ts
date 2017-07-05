import { Component, Input, Output, HostBinding, OnChanges, SimpleChanges, SimpleChange, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Image } from '../../models/search.models';

@Component({
  selector: 'fat-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent implements OnChanges {

  @Input() images: Image[];
  @Input() cardOptions: any;

  columnCount: number = 3;

  @Output('onCardClick')
  clickEmitter = new EventEmitter<Image>();

  handleCardClick(image: Image) {
    this.clickEmitter.emit(image);
  }

  ngOnChanges(changes: SimpleChanges) {
    const options = changes.cardOptions;
    if (options && options.currentValue != options.previousValue) {
      let scale = options.currentValue.cardScale;
      this.columnCount = Math.floor(100 / (Math.floor(scale / 5) * 5)) / 2;
    }
  }

}
