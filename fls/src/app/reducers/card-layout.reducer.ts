import { Action } from '@ngrx/store';
import { ViewMode } from '../models/card-layout.models';
import { CardLayoutActions } from '../actions/card-layout.actions';
import { union, without } from 'underscore';


export interface CardLayoutState {
  viewModes: ViewMode[],
  currentViewMode: ViewMode,
  thumbnailScale: number,
  isScaleSliderVisible: boolean,
};

const initialState: CardLayoutState = {
  viewModes: [ViewMode.list, ViewMode.thumbnails],
  currentViewMode: ViewMode.list,
  thumbnailScale: 50,
  isScaleSliderVisible: false,
};

export function cardLayoutReducer(state: CardLayoutState = initialState, action: Action) {

  switch (action.type) {

    case CardLayoutActions.SELECT_VIEW_MODE:
      return {
        ...state,
        currentViewMode: action.payload.viewMode,
        isScaleSliderVisible: action.payload.viewMode.id == state.viewModes[1].id
      };

    case CardLayoutActions.SET_THUMBNAIL_SCALE:
      return {
        ...state,
        thumbnailScale: action.payload.scale
      };

    default: {
      return state;
    }
  }
}
