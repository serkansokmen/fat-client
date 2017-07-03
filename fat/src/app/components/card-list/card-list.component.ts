import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { ViewMode } from '../../models/card-layout.models';
import { Image } from '../../models/search.models';

@Component({
  selector: 'fat-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent implements OnInit {

  _viewMode: ViewMode;
  get viewMode(): number {
    return this._viewMode.id;
  }

  @Input('viewMode')
  set viewMode(value: number) {
    this._viewMode = value == 0 ? ViewMode.list : ViewMode.thumbnails;
  }

  @Input() cardScale: number;
  @Input() images: Image[];

  @Output('onCardClick')
  clickEmitter = new EventEmitter<Image>();

  @HostBinding('style.flex-direction') direction = 'column';

  constructor() {}

  ngOnInit() {
    this.direction = this.viewMode == 0 ? 'column' : 'row';
  }

  handleCardClick(image: Image) {
    this.clickEmitter.emit(image);
  }

}
