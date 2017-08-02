import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Image, License } from '../models/search.models';


@Injectable()
export class SearchActions {

  static SET_PER_PAGE = '[Search] Set Per Page';
  setPerpage(perpage: number): Action {
    return {
      type: SearchActions.SET_PER_PAGE,
      payload: {
        perpage,
      }
    }
  }

  static REQUEST_SEARCH = '[Search] Request Search';
  requestSearch(search: any, licenses: License[], perpage: number, page: number): Action {
    return {
      type: SearchActions.REQUEST_SEARCH,
      payload: {
        search,
        licenses,
        perpage,
        page,
      }
    }
  }

  static REQUEST_SEARCH_COMPLETE = '[Search] Request Search Complete';
  requestSearchComplete(search: any, images: Image[], left: number, total: number, perpage: number, page: number): Action {
    return {
      type: SearchActions.REQUEST_SEARCH_COMPLETE,
      payload: {
        search,
        images,
        left,
        total,
        page,
      }
    }
  }

  static REQUEST_SEARCH_ERROR = '[Search] Request Search Error';
  requestSearchError(message: string): Action {
    return {
      type: SearchActions.REQUEST_SEARCH_ERROR,
      payload: {
        message,
      }
    }
  }

  static SELECT_LICENCE = '[Search] Select License';
  selectLicense(license: License): Action {
    return {
      type: SearchActions.SELECT_LICENCE,
      payload: {
        license,
      }
    }
  }

  static DESELECT_LICENCE = '[Search] Deselect License';
  deselectLicense(license: License): Action {
    return {
      type: SearchActions.DESELECT_LICENCE,
      payload: {
        license,
      }
    }
  }

  static SELECT_ALL_IMAGES = '[Search] Select All Images';
  selectAllImages(): Action {
    return {
      type: SearchActions.SELECT_ALL_IMAGES,
      payload: { }
    }
  }

  static DESELECT_ALL_IMAGES = '[Search] Deselect All Images';
  deselectAllImages(): Action {
    return {
      type: SearchActions.DESELECT_ALL_IMAGES,
      payload: { }
    }
  }

  static TOGGLE_IMAGE_DISCARDED = '[Search] Toggle Image Discarded';
  toggleImageDiscarded(image: Image): Action {
    return {
      type: SearchActions.TOGGLE_IMAGE_DISCARDED,
      payload: {
        image,
      }
    }
  }

  static SAVE_SEARCH = '[Search] Save Search';
  saveSearch(search: any, images: Image[], licenses: License[], perpage: number, page: number): Action {
    return {
      type: SearchActions.SAVE_SEARCH,
      payload: {
        search,
        images,
        licenses,
        perpage,
        page,
      }
    }
  }

  static SAVE_SEARCH_COMPLETE = '[Search] Save Search Complete';
  saveSearchComplete(search: any, newImages: Image[], left: number, total: number): Action {
    return {
      type: SearchActions.SAVE_SEARCH_COMPLETE,
      payload: {
        search,
        newImages,
        left,
        total,
      }
    }
  }

}
