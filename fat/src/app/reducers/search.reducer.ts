import { Action } from '@ngrx/store';
import { Search, Image, License, ImageState } from '../models/search.models';
import { SearchActions } from '../actions/search.actions';
import { union, without } from 'underscore';

export interface SearchState {
  isRequesting: boolean,
  search: Search,
  images: Image[],
  tagModes: string[],
  selectedLicenses: License[],
  imageStates: number[],
  licenses: License[],
  page: number,
  perpage: number,
  pages: number,
  total: number
};

const initialState: SearchState = {
  isRequesting: false,
  search: Search.fromJSON({
    tags: 'train, child, -drawing, -sketch',
    tag_mode: 'all',
    user_id: ''
  }),
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
  page: 1,
  perpage: 20,
  pages: 0,
  total: 0,
};

export function searchReducer(state: SearchState = initialState, action: Action) {

  switch (action.type) {

    case SearchActions.REQUEST_SEARCH:
      return {
        ...state,
        isRequesting: true,
        total: 0,
        search: action.payload.search,
        page: action.payload.page
      };

    case SearchActions.REQUEST_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        pages: action.payload.pages,
        perpage: action.payload.perpage,
        page: action.payload.page,
        total: action.payload.total,
        search: action.payload.search,
        images: action.payload.results.map(image => new Image(image))
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

    case SearchActions.DISCARD_ALL:
      return {
        ...state,
        images: state.images.map(image => new Image({
          ...image,
          state: ImageState.discarded
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

    // case SearchActions.REQUEST_SEARCH_INSTANCE:
    //   return {
    //     ...state,
    //     isRequesting: true,
    //     search: state.search,
    //     images: state.images
    //   };

    case SearchActions.SAVE_SEARCH:
      return {
        ...state,
        isRequesting: true,
        search: state.search
      };

    case SearchActions.SAVE_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        images: action.payload.newImages.map(image => new Image(image))
      };

    default: {
      return state;
    }
  }
}
