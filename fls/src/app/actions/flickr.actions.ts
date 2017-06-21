import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { FlickrSearch, FlickrImage } from '../models/flickr.models';


@Injectable()
export class FlickrActions {

  static REQUEST_FLICKR_SEARCH = '[Flickr] Request Flickr Search';
  requestFlickrSearch(search: FlickrSearch): Action {
    return {
      type: FlickrActions.REQUEST_FLICKR_SEARCH,
      payload: {
        search
      }
    }
  }

  static REQUEST_FLICKR_SEARCH_COMPLETE = '[Flickr] Request Flickr Search Complete';
  requestFlickrSearchComplete(images: FlickrImage[]): Action {
    return {
      type: FlickrActions.REQUEST_FLICKR_SEARCH_COMPLETE,
      payload: {
        images
      }
    }
  }

  static REQUEST_EXISTING_IMAGES = '[Flickr] Request Existing Images';
  requestExistingImages(): Action {
    return {
      type: FlickrActions.REQUEST_EXISTING_IMAGES,
      payload: {}
    }
  }

  static TOGGLE_IMAGE_DISCARDED = '[Flickr] Toggle Image Discarded';
  toggleImageDiscarded(image: FlickrImage): Action {
    return {
      type: FlickrActions.TOGGLE_IMAGE_DISCARDED,
      payload: {
        image
      }
    }
  }

  static SAVE_SEARCH = '[Flickr] Save Search';
  saveSearch(search: FlickrSearch, images: FlickrImage[]): Action {
    return {
      type: FlickrActions.SAVE_SEARCH,
      payload: {
        search,
        images
      }
    }
  }

  static SAVE_SEARCH_COMPLETE = '[Flickr] Save Search Complete';
  saveSearchComplete(search: FlickrSearch, images: FlickrImage[]): Action {
    return {
      type: FlickrActions.SAVE_SEARCH_COMPLETE,
      payload: {
        search,
        images
      }
    }
  }

  // static REQUEST_EXISTING_IMAGES = '[Flickr] Request Existing Images';

}
