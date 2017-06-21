import { Action } from '@ngrx/store';
import { FlickrSearch, FlickrImage, TagMode } from '../models/flickr.models';
import { FlickrActions } from '../actions/flickr.actions';
import { union, without } from 'underscore';


export interface SearchState {
  isRequesting: boolean,
  instance: FlickrSearch,
  images: FlickrImage[],
  selectedImage: FlickrImage,
  tagModes: TagMode[],
};

const initialState: SearchState = {
  isRequesting: false,
  instance: new FlickrSearch({
    query: 'nude, skin',
    exclude: 'drawing, sketch, sculpture'
  }),
  images: [],
  selectedImage: null,
  tagModes: [TagMode.all, TagMode.any]
};

export function flickrReducer(state: SearchState = initialState, action: Action) {
  switch (action.type) {

    case FlickrActions.REQUEST_FLICKR_SEARCH:
      return {
        ...state,
        instance: action.payload.search,
        isRequesting: true,
        images: []
      }

    case FlickrActions.REQUEST_FLICKR_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        images: action.payload.images
      }

    case FlickrActions.TOGGLE_IMAGE_DISCARDED:
      return {
        ...state,
        isRequesting: false,
        images: state.images.map(image => {
          return image == action.payload.image ? {
            ...image,
            is_discarded: !image.is_discarded
          } : image;
        })
      }

    default:
      return state;
  }
}
