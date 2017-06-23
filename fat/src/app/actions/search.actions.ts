import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Search, Image, License } from '../models/search.models';


@Injectable()
export class SearchActions {

  static REQUEST_PAGE = '[Search] Set Page';
  requestPage(page: number): Action {
    return {
      type: SearchActions.REQUEST_PAGE,
      payload: {
        page
      }
    }
  }

  static REQUEST_PAGE_COMPLETE = '[Search] Request Page';
  requestPageComplete(search: Search, images: Image[]): Action {
    return {
      type: SearchActions.REQUEST_PAGE_COMPLETE,
      payload: {
        search,
        images
      }
    }
  }

  static REQUEST_SEARCH = '[Search] Request Search';
  requestSearch(search: Search, licenses: License[], perpage: number, page: number): Action {
    return {
      type: SearchActions.REQUEST_SEARCH,
      payload: {
        search,
        licenses,
        perpage,
        page
      }
    }
  }

  static REQUEST_SEARCH_COMPLETE = '[Search] Request Search Complete';
  requestSearchComplete(search: Search, images: Image[]): Action {
    return {
      type: SearchActions.REQUEST_SEARCH_COMPLETE,
      payload: {
        search,
        images
      }
    }
  }

  static SELECT_LICENCE = '[Search] Select License';
  selectLicense(license: License): Action {
    return {
      type: SearchActions.SELECT_LICENCE,
      payload: {
        license
      }
    }
  }

  static DESELECT_LICENCE = '[Search] Deselect License';
  deselectLicense(license: License): Action {
    return {
      type: SearchActions.DESELECT_LICENCE,
      payload: {
        license
      }
    }
  }

  static TOGGLE_IMAGE_DISCARDED = '[Search] Toggle Image Discarded';
  toggleImageDiscarded(image: Image): Action {
    return {
      type: SearchActions.TOGGLE_IMAGE_DISCARDED,
      payload: {
        image
      }
    }
  }

  static REQUEST_SEARCH_PAGE = '[Search] Search Set Page';
  setSearchPage(page: number): Action {
    return {
      type: SearchActions.REQUEST_SEARCH,
      payload: {
        page
      }
    }
  }

  static SAVE_SEARCH = '[Search] Save Search';
  saveSearch(search: Search, images: Image[]): Action {
    return {
      type: SearchActions.SAVE_SEARCH,
      payload: {
        search,
        images
      }
    }
  }

  static SAVE_SEARCH_COMPLETE = '[Search] Save Search Complete';
  saveSearchComplete(search: Search, images: Image[], page: number): Action {
    return {
      type: SearchActions.SAVE_SEARCH_COMPLETE,
      payload: {
        search,
        images,
        page
      }
    }
  }

}
