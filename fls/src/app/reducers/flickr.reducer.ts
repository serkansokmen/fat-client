import { Action } from '@ngrx/store';
import { FlickrSearch, FlickrImage, TagMode, License } from '../models/flickr.models';
import { FlickrActions } from '../actions/flickr.actions';
import { union, without } from 'underscore';

export interface SearchState {
  isRequesting: boolean,
  instance: FlickrSearch,
  tagModes: TagMode[],
  images: FlickrImage[],
  licenses: License[],
  selectedLicenses: License[]
};

const initialState: SearchState = {
  isRequesting: false,
  instance: new FlickrSearch({
    query: 'nude, skin',
    exclude: 'drawing, sketch, sculpture'
  }),
  tagModes: [TagMode.all, TagMode.any],
  images: [],
  licenses: [],
  selectedLicenses: []
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

    case FlickrActions.REQUEST_FLICKR_SEARCH:
      return {
        ...state,
        instance: action.payload.search,
        isRequesting: true,
        images: []
      };

    case FlickrActions.REQUEST_FLICKR_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        images: action.payload.images
      };

    case FlickrActions.TOGGLE_IMAGE_DISCARDED:
      return {
        ...state,
        isRequesting: false,
        images: state.images.map(image => {
          return image == action.payload.image ? new FlickrImage({
            ...image,
            is_discarded: !image.is_discarded
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
