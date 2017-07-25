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

  static UPDATE_ANNOTATION_SEMANTIC_CHECKS = '[Annotate] Update Annotation Semantic Checks';
  updateAnnotationSemanticChecks(): Action {
    return {
      type: AnnotateActions.UPDATE_ANNOTATION_SEMANTIC_CHECKS,
      payload: { }
    }
  }

  static UPDATE_ANNOTATION_SEMANTIC_CHECKS_COMPLETE = '[Annotate] Update Annotation Semantic Checks Complete';
  updateAnnotationSemanticChecksComplete(annotation: any): Action {
    return {
      type: AnnotateActions.UPDATE_ANNOTATION_SEMANTIC_CHECKS_COMPLETE,
      payload: {
        annotation
      }
    }
  }

  static REQUEST_CHECK_TYPES = '[Annotate] Request Check Types';
  requestCheckTypes(): Action {
    return {
      type: AnnotateActions.REQUEST_CHECK_TYPES,
      payload: { }
    }
  }

  static REQUEST_CHECK_TYPES_COMPLETE = '[Annotate] Request Check Types Complete';
  requestCheckTypesComplete(types: any[]): Action {
    return {
      type: AnnotateActions.REQUEST_CHECK_TYPES_COMPLETE,
      payload: {
        types
      }
    }
  }

  static SET_CHECK_TYPE_WEIGHT = '[Annotate] Set Check Type Weight';
  setWeight(type: any, value: number): Action {
    return {
      type: AnnotateActions.SET_CHECK_TYPE_WEIGHT,
      payload: {
        type,
        value
      }
    }
  }

  static TOGGLE_CHECK_TYPE_ACTIVE = '[Annotate] Set Check Type Active';
  toggleTypeActive(type: any): Action {
    return {
      type: AnnotateActions.TOGGLE_CHECK_TYPE_ACTIVE,
      payload: {
        type
      }
    }
  }

}
