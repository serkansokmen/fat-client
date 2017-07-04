import { Component, Input, Output, HostBinding, SimpleChanges, SimpleChange, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Image } from '../../models/search.models';

@Component({
  selector: 'fat-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent {

  @Input() images: Image[];
  @Input() cardOptions: any;

  @Output('onCardClick')
  clickEmitter = new EventEmitter<Image>();

  handleCardClick(image: Image) {
    this.clickEmitter.emit(image);
  }

}
