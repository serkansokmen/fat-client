import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Image, ImageState } from '../models/search.models';


@Injectable()
export class AnnotateActions {

  static REQUEST_IMAGES = '[Annotate] Request Images';
  requestImages(state: ImageState): Action {
    return {
      type: AnnotateActions.REQUEST_IMAGES,
      payload: {
        state
      }
    }
  }

  static REQUEST_IMAGES_COMPLETE = '[Annotate] Request Images Complete';
  requestImagesComplete(images: Image[], total: number): Action {
    return {
      type: AnnotateActions.REQUEST_IMAGES_COMPLETE,
      payload: {
        images,
        total
      }
    }
  }

  static SELECT_IMAGE = '[Annotate] Select Image';
  selectImage(image: Image): Action {
    return {
      type: AnnotateActions.SELECT_IMAGE,
      payload: {
        image
      }
    }
  }

  static DESELECT_IMAGE = '[Annotate] Deselect Image';
  deselectImage(): Action {
    return {
      type: AnnotateActions.DESELECT_IMAGE,
      payload: {}
    }
  }

  static REQUEST_IMAGE = '[Annotate] Request Image';
  requestImage(id: number): Action {
    return {
      type: AnnotateActions.REQUEST_IMAGE,
      payload: {
        id
      }
    }
  }

  static REQUEST_IMAGE_COMPLETE = '[Annotate] Request Image Complete';
  requestImageComplete(image: Image): Action {
    return {
      type: AnnotateActions.REQUEST_IMAGE_COMPLETE,
      payload: {
        image
      }
    }
  }

  static SAVE_SKIN_PIXELS_IMAGE = '[Annotate] Save Skin Pixels Image';
  saveSkinPixelsImage(): Action {
    return {
      type: AnnotateActions.SAVE_SKIN_PIXELS_IMAGE,
      payload: {}
    }
  }

  static SAVE_SKIN_PIXELS_IMAGE_COMPLETE = '[Annotate] Save Skin Pixels Image Complete';
  saveSkinPixelsImageComplete(annotation: any): Action {
    return {
      type: AnnotateActions.SAVE_SKIN_PIXELS_IMAGE_COMPLETE,
      payload: {
        annotation
      }
    }
  }

}
