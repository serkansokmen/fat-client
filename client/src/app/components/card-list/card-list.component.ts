import { Component, Input, Output, OnChanges, SimpleChanges, SimpleChange, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { ViewMode } from '../../models/card-layout.models';
import { Image } from '../../models/search.models';

@Component({
  selector: 'fat-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent implements OnChanges {

  @HostBinding('style.flex-direction') direction = 'column';

  @Input() viewMode: ViewMode;
  @Input() cardOptions: any;
  @Input() images: Image[];

  @Output('onCardClick')
  clickEmitter = new EventEmitter<Image>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const viewMode = changes.viewMode;
    if (viewMode && viewMode.previousValue != viewMode.currentValue) {
      this.direction = viewMode.currentValue.id == 0 ? 'row' : 'column';
    }
  }

  handleCardClick(image: Image) {
    this.clickEmitter.emit(image);
  }

}
