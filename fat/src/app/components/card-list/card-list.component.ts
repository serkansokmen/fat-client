import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ViewMode } from '../../models/card-layout.models';
import { Image } from '../../models/search.models';

@Component({
  selector: 'fat-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent {

  @Input() viewMode: ViewMode;
  @Input() cardScale: number;
  @Input() images: Image[];

  @Output('onCardClick')
  clickEmitter = new EventEmitter<Image>();

  constructor() { }

  handleCardClick(image: Image) {
    this.clickEmitter.emit(image);
  }

}
