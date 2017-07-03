import { Action } from '@ngrx/store';
import { Image, License, ImageState } from '../models/search.models';
import { SearchActions } from '../actions/search.actions';
import { union, without } from 'underscore';

export interface SearchState {
  isRequesting: boolean,
  search: any,
  images: Image[],
  tagModes: string[],
  selectedLicenses: License[],
  imageStates: number[],
  licenses: License[],
  perpage: number,
  page: number,
  total: number
};

const initialState: SearchState = {
  isRequesting: false,
  search: {
    id: null
  },
  selectedLicenses: [
    License.getLicense('4'),
    License.getLicense('5'),
    License.getLicense('6'),
    License.getLicense('7'),
  ],
  imageStates: [0, 1, 2, 3],
  images: [],
  tagModes: ['all', 'any'],
  licenses: License.availableLicenses,
  perpage: 10,
  page: 1,
  total: 0,
};

export function searchReducer(state: SearchState = initialState, action: Action) {

  switch (action.type) {

    case SearchActions.SET_PER_PAGE:
      return {
        ...state,
        perpage: action.payload.perpage
      };

    case SearchActions.REQUEST_SEARCH:
      return {
        ...state,
        isRequesting: true,
        search: action.payload.search,
        perpage: action.payload.perpage,
        page: action.payload.page,
        total: 0,
      };

    case SearchActions.REQUEST_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        search: action.payload.search,
        images: action.payload.images,
        perpage: action.payload.perpage,
        page: action.payload.page,
        total: action.payload.total,
      };

    case SearchActions.TOGGLE_IMAGE_DISCARDED:

      return {
        ...state,
        isRequesting: false,
        images: state.images.map(image => image.id != action.payload.image.id ?
          image : new Image({
            ...image,
            state: image.state == ImageState.discarded ? ImageState.indeterminate : ImageState.discarded
          }))
      }

    case SearchActions.SELECT_LICENCE:
      return {
        ...state,
        selectedLicenses: state.selectedLicenses.concat(action.payload.license)
      };

    case SearchActions.DESELECT_LICENCE:
      return {
        ...state,
        selectedLicenses: without(state.selectedLicenses, action.payload.license)
      };

    case SearchActions.SAVE_SEARCH:
      return {
        ...state,
        isRequesting: true
      };

    case SearchActions.SAVE_SEARCH_COMPLETE:
      console.log(action.payload);
      return {
        ...state,
        isRequesting: false,
        images: action.payload.newImages
      };

    default: {
      return state;
    }
  }
}
