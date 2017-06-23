import { Action } from '@ngrx/store';
import { FlickrSearch, FlickrImage, TagMode, License, ImageState } from '../models/flickr.models';
import { FlickrActions } from '../actions/flickr.actions';
import { union, without } from 'underscore';


export interface SearchState {
  isRequesting: boolean,
  instance: FlickrSearch,
  tagModes: TagMode[],
  images: FlickrImage[],
  licenses: License[],
  selectedLicenses: License[],
  page: number,
  perpage: number,
  pages: number,
  total: number
};

const initialState: SearchState = {
  isRequesting: false,
  instance: new FlickrSearch({
    query: 'nude, skin',
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
  perpage: 10,
  pages: 0,
  total: 0,
};

export function flickrReducer(state: SearchState = initialState, action: Action) {

  switch (action.type) {

    case FlickrActions.REQUEST_PAGE:
      return {
        ...state,
        isRequesting: true,
        page: action.payload.page
      };

    case FlickrActions.REQUEST_PAGE_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        instance: action.payload.search,
        images: action.payload.images
      };

    case FlickrActions.REQUEST_SEARCH:
      return {
        ...state,
        isRequesting: true,
        instance: action.payload.search,
        images: [],
        total: 0,
        page: action.payload.page
      };

    case FlickrActions.REQUEST_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        pages: action.payload.pages,
        perpage: action.payload.perpage,
        page: action.payload.page,
        total: action.payload.total,
        images: action.payload.images
      };

    case FlickrActions.TOGGLE_IMAGE_DISCARDED:
      return {
        ...state,
        isRequesting: false,
        images: state.images.map(image => {
          return image == action.payload.image ? new FlickrImage({
            ...image,
            state: image.state == ImageState.discarded ? null : ImageState.discarded
          }) : image;
        })
      };


    case FlickrActions.SELECT_LICENCE:
      return {
        ...state,
        selectedLicenses: state.selectedLicenses.concat(action.payload.license)
      };

    case FlickrActions.DESELECT_LICENCE:
      return {
        ...state,
        selectedLicenses: without(state.selectedLicenses, action.payload.license)
      };

    case FlickrActions.SAVE_SEARCH:
      return {
        ...state,
        isRequesting: true,
        search: state.instance
      };

    case FlickrActions.SAVE_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        search: action.payload.search,
        images: action.payload.images
      };

    default: {
      return state;
    }
  }
}
