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
  allSelected: boolean,
  allDiscarded: boolean,
  licenses: License[],
  perpage: number,
  page: number,
  left: number,
  total: number,
  error?: string,
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
  allSelected: true,
  allDiscarded: false,
  images: [],
  tagModes: ['all', 'any'],
  licenses: License.availableLicenses,
  perpage: 25,
  page: 1,
  left: 0,
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
        left: 0,
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
        left: action.payload.left,
        total: action.payload.total,
        error: null,
        allSelected: true,
        allDiscarded: false,
      };

    case SearchActions.REQUEST_SEARCH_ERROR:
      return {
        ...state,
        isRequesting: false,
        error: action.payload.message,
      };

    case SearchActions.SELECT_ALL_IMAGES:

      return {
        ...state,
        images: state.images.map(image => ({
          ...image,
          state: ImageState.selected,
        })),
        allSelected: true,
        allDiscarded: false,
      }

    case SearchActions.DESELECT_ALL_IMAGES:

      return {
        ...state,
        images: state.images.map(image => ({
          ...image,
          state: ImageState.discarded,
        })),
        allSelected: false,
        allDiscarded: true,
      }

    case SearchActions.TOGGLE_IMAGE_DISCARDED:
      let newImages = state.images.map(image => image.id != action.payload.image.id ?
        image : new Image({
          ...image,
          state: image.state == ImageState.discarded ? ImageState.selected : ImageState.discarded
        }));
      return {
        ...state,
        isRequesting: false,
        images: newImages,
        allSelected: newImages.filter(image => image.state.value == ImageState.selected.value).length == newImages.length,
        allDiscarded: newImages.filter(image => image.state.value == ImageState.discarded.value).length == newImages.length,
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

    // case SearchActions.SAVE_SEARCH_COMPLETE:
    //   return {
    //     ...state,
    //     isRequesting: false,
    //     images: action.payload.newImages,
    //     total: action.payload.total,
    //     left: action.payload.left,
    //   };

    default: {
      return state;
    }
  }
}
