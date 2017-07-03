import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ViewMode } from '../models/card-layout.models';


@Injectable()
export class CardLayoutActions {

  static SELECT_VIEW_MODE = '[Card Layout] Select View Mode';
  selectViewMode(viewMode: ViewMode): Action {
    return {
      type: CardLayoutActions.SELECT_VIEW_MODE,
      payload: {
        viewMode
      }
    }
  }

  static SET_THUMBNAIL_SCALE = '[Card Layout] Set Thumbnail Scale';
  setThumbnailScale(scale: number): Action {
    return {
      type: CardLayoutActions.SET_THUMBNAIL_SCALE,
      payload: {
        scale
      }
    }
  }
}
