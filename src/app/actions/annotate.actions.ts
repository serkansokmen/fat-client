import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Image } from '../models/search.models';


@Injectable()
export class AnnotateActions {

  static REQUEST_IMAGES = '[Annotate] Request Images';
  requestImages(): Action {
    return {
      type: AnnotateActions.REQUEST_IMAGES,
      payload: {
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

  static SAVE_PAINT_IMAGE = '[Annotate] Save Paint Image';
  savePaintImage(base64: string): Action {
    return {
      type: AnnotateActions.SAVE_PAINT_IMAGE,
      payload: {
        base64
      }
    }
  }

  static SAVE_PAINT_IMAGE_COMPLETE = '[Annotate] Save Paint Image Complete';
  savePaintImageComplete(annotation: any): Action {
    return {
      type: AnnotateActions.SAVE_PAINT_IMAGE_COMPLETE,
      payload: {
        annotation
      }
    }
  }

  static REQUEST_ANNOTATION = '[Annotate] Request Annotation';
  requestAnnotation(id: number): Action {
    return {
      type: AnnotateActions.REQUEST_ANNOTATION,
      payload: {
        id
      }
    }
  }

  static REQUEST_ANNOTATION_COMPLETE = '[Annotate] Request Annotation Complete';
  requestAnnotationComplete(annotation: any): Action {
    return {
      type: AnnotateActions.REQUEST_ANNOTATION_COMPLETE,
      payload: {
        annotation
      }
    }
  }

}
