import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { FlickrSearch, FlickrImage, License } from '../models/flickr.models';


@Injectable()
export class FlickrActions {

  static REQUEST_PAGE = '[Flickr] Set Page';
  requestPage(page: number): Action {
    return {
      type: FlickrActions.REQUEST_PAGE,
      payload: {
        page
      }
    }
  }

  static REQUEST_PAGE_COMPLETE = '[Flickr] Request Page';
  requestPageComplete(search: FlickrSearch, images: FlickrImage[]): Action {
    return {
      type: FlickrActions.REQUEST_PAGE_COMPLETE,
      payload: {
        search,
        images
      }
    }
  }

  static REQUEST_SEARCH = '[Flickr] Request Flickr Search';
  requestSearch(search: FlickrSearch, licenses: License[], perpage: number, page: number): Action {
    return {
      type: FlickrActions.REQUEST_SEARCH,
      payload: {
        search,
        licenses,
        perpage,
        page
      }
    }
  }

  static REQUEST_SEARCH_COMPLETE = '[Flickr] Request Flickr Search Complete';
  requestSearchComplete(search: FlickrSearch, images: FlickrImage[]): Action {
    return {
      type: FlickrActions.REQUEST_SEARCH_COMPLETE,
      payload: {
        search,
        images
      }
    }
  }

  static SELECT_LICENCE = '[Flickr] Select License';
  selectLicense(license: License): Action {
    return {
      type: FlickrActions.SELECT_LICENCE,
      payload: {
        license
      }
    }
  }

  static DESELECT_LICENCE = '[Flickr] Deselect License';
  deselectLicense(license: License): Action {
    return {
      type: FlickrActions.DESELECT_LICENCE,
      payload: {
        license
      }
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

  static REQUEST_SEARCH_PAGE = '[Flickr] Search Set Page';
  setSearchPage(page: number): Action {
    return {
      type: FlickrActions.REQUEST_SEARCH,
      payload: {
        page
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
  saveSearchComplete(search: FlickrSearch, images: FlickrImage[], page: number): Action {
    return {
      type: FlickrActions.SAVE_SEARCH_COMPLETE,
      payload: {
        search,
        images,
        page
      }
    }
  }

  static SET_THUMBNAIL_SCALE = '[Flickr] Set Thumbnail Scale';
  setThumbnailScale(scale: number): Action {
    return {
      type: FlickrActions.SET_THUMBNAIL_SCALE,
      payload: {
        scale
      }
    }
  }

}
