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
  licenses: [],
  selectedLicenses: [],
  page: 1,
  pages: 0,
  total: 0
};

export function flickrReducer(state: SearchState = initialState, action: Action) {

  switch (action.type) {

    case FlickrActions.REQUEST_LICENSES:
      return {
        ...state,
        isRequesting: true
      };

    case FlickrActions.REQUEST_LICENSES_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        licenses: action.payload.licenses,
        selectedLicenses: [
          action.payload.licenses[4],
          action.payload.licenses[5],
          action.payload.licenses[6],
          action.payload.licenses[7]
        ]
      };

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
        page: action.payload.page
      };

    case FlickrActions.REQUEST_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        instance: {
          ...state.instance,
          perPage: action.payload.perPage
        },
        pages: action.payload.pages,
        images: action.payload.images
        // .filter(image =>
        //   state.savedImages.filter(saved => saved.flickr_image_id != image.flickr_image_id ).length > 0)
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
