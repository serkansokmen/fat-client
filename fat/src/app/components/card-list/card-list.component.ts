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

  @HostBinding('style.flex-direction') direction = 'column';

  _viewMode: ViewMode;
  get viewMode(): ViewMode {
    return this._viewMode;
  }

  @Input('viewMode')
  set viewMode(value: ViewMode) {
    this._viewMode = value.id == 0 ? ViewMode.list : ViewMode.thumbnails;
  }

  @Input() cardScale: number;
  @Input() images: Image[];

  @Output('onCardClick')
  clickEmitter = new EventEmitter<Image>();

  constructor() {}

  ngOnInit() {
    this.direction = this._viewMode && this.viewMode.id == 0 ? 'column' : 'row';
  }

  handleCardClick(image: Image) {
    this.clickEmitter.emit(image);
  }

}
