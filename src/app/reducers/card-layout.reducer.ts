import { Action } from '@ngrx/store';
import { CardLayoutOptions } from '../models/card-layout.models';
import { CardLayoutActions } from '../actions/card-layout.actions';
import { union, without } from 'underscore';


export interface CardLayoutState {
  viewModes: CardLayoutOptions[],
  currentViewMode: CardLayoutOptions,
  isScaleSliderVisible: boolean,
};

const initialState: CardLayoutState = {
  viewModes: [CardLayoutOptions.list, CardLayoutOptions.thumbs],
  currentViewMode: CardLayoutOptions.list,
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
        currentViewMode: {
          ...state.currentViewMode,
          cardScale: action.payload.scale
        }
      };

    case CardLayoutActions.SET_ACTIONS_VISIBLE:
      return {
        ...state,
        currentViewMode: {
          ...state.currentViewMode,
          isActionsVisible: action.payload.isActionsVisible
        }
      };

    default: {
      return state;
    }
  }
}
