import { Action } from '@ngrx/store';
import { CardLayoutOptions } from '../models/card-layout.models';
import { CardLayoutActions } from '../actions/card-layout.actions';
import { union, without } from 'underscore';


export interface CardLayoutState {
  viewModes: CardLayoutOptions[],
  cardLayoutOptions: CardLayoutOptions,
  isScaleSliderVisible: boolean,
};

const initialState: CardLayoutState = {
  viewModes: [CardLayoutOptions.list, CardLayoutOptions.thumbs],
  cardLayoutOptions: CardLayoutOptions.list,
  isScaleSliderVisible: false,
};

export function cardLayoutReducer(state: CardLayoutState = initialState, action: Action) {

  switch (action.type) {

    case CardLayoutActions.SELECT_VIEW_MODE:
      return {
        ...state,
        cardLayoutOptions: action.payload.viewMode,
        isScaleSliderVisible: action.payload.viewMode.id == state.viewModes[1].id
      };

    case CardLayoutActions.SET_THUMBNAIL_SCALE:
      return {
        ...state,
        cardLayoutOptions: {
          ...state.cardLayoutOptions,
          cardScale: action.payload.scale
        }
      };

    case CardLayoutActions.SET_ACTIONS_VISIBLE:
      return {
        ...state,
        cardLayoutOptions: {
          ...state.cardLayoutOptions,
          isActionsVisible: action.payload.isActionsVisible
        }
      };

    default: {
      return state;
    }
  }
}
