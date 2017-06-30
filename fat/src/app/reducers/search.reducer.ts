import { Action } from '@ngrx/store';
import { Search, Image, TagMode, License, ImageState } from '../models/search.models';
import { SearchActions } from '../actions/search.actions';
import { union, without } from 'underscore';


export interface SearchState {
  isRequesting: boolean,
  instance: Search,
  tagModes: TagMode[],
  images: Image[],
  licenses: License[],
  selectedLicenses: License[],
  page: number,
  perpage: number,
  pages: number,
  total: number
};

const initialState: SearchState = {
  isRequesting: false,
  instance: new Search({
    query: 'train, child',
    exclude: 'drawing, sketch'
  }),
  tagModes: [TagMode.all, TagMode.any],
  images: [],
  licenses: License.licensesAvailable,
  selectedLicenses: [
    License.getLicense('4'),
    License.getLicense('5'),
    License.getLicense('6'),
    License.getLicense('7')
  ],
  page: 1,
  perpage: 20,
  pages: 0,
  total: 0,
};

export function searchReducer(state: SearchState = initialState, action: Action) {

  switch (action.type) {

    case SearchActions.REQUEST_PAGE:
      return {
        ...state,
        isRequesting: true,
        page: action.payload.page
      };

    case SearchActions.REQUEST_SEARCH:
      return {
        ...state,
        isRequesting: true,
        instance: action.payload.search,
        images: [],
        total: 0,
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
        images: action.payload.images
      };

    case SearchActions.TOGGLE_IMAGE_DISCARDED:
      return {
        ...state,
        isRequesting: false,
        images: state.images.map(image => {
          return image == action.payload.image ? new Image({
            ...image,
            state: image.state == ImageState.discarded ? null : ImageState.discarded
          }) : image;
        })
      };

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
    //     search: state.instance,
    //     images: state.images
    //   };

    case SearchActions.SAVE_SEARCH:
      return {
        ...state,
        isRequesting: true,
        instance: state.instance,
        images: state.images
      };

    case SearchActions.SAVE_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        instance: action.payload.search,
        images: action.payload.images
      };

    default: {
      return state;
    }
  }
}
