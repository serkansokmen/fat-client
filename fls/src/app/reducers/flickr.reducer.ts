import { Action } from '@ngrx/store';
import { FlickrSearch, FlickrImage, TagMode } from '../models/flickr.models';
import { FlickrActions } from '../actions/flickr.actions';
import { union, without } from 'underscore';


export interface SearchState {
  isRequesting: boolean,
  instance: FlickrSearch,
  selectedImage: FlickrImage,
  tagModes: TagMode[],
  images: FlickrImage[]
};

const initialState: SearchState = {
  isRequesting: false,
  instance: new FlickrSearch({
    query: 'nude, skin',
    exclude: 'drawing, sketch, sculpture'
  }),
  selectedImage: null,
  tagModes: [TagMode.all, TagMode.any],
  images: []
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
          return image == action.payload.image ? new FlickrImage({
            ...image,
            is_discarded: !image.is_discarded
          }) : image;
        })
      }

    case FlickrActions.SAVE_SEARCH:
      return {
        ...state,
        isRequesting: true,
        search: state.instance
      }

    case FlickrActions.SAVE_SEARCH_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        search: action.payload.search,
        images: action.payload.images
      }

    default:
      return state;
  }
}
