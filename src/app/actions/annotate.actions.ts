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

  static CREATE_ANNOTATION = '[Annotate] Create Annotation';
  createAnnotation(base64: string, semanticChecks: any[]): Action {
    return {
      type: AnnotateActions.CREATE_ANNOTATION,
      payload: {
        base64,
        semanticChecks
      }
    }
  }

  static CREATE_ANNOTATION_COMPLETE = '[Annotate] Create Annotation Complete';
  createAnnotationComplete(annotation: any): Action {
    return {
      type: AnnotateActions.CREATE_ANNOTATION_COMPLETE,
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
      payload: {}
    }
  }

  static UPDATE_ANNOTATION_OBJECTS = '[Annotate] Update Annotation Objects';
  updateAnnotationObjects(): Action {
    return {
      type: AnnotateActions.UPDATE_ANNOTATION_OBJECTS,
      payload: {
      }
    }
  }

  static UPDATE_ANNOTATION_COMPLETE = '[Annotate] Update Annotation Complete';
  updateAnnotationComplete(annotation: any): Action {
    return {
      type: AnnotateActions.UPDATE_ANNOTATION_COMPLETE,
      payload: {
        annotation
      }
    }
  }

  static SET_SEMANTIC_CHECK_WEIGHT = '[Annotate] Set Semantic Check Weight';
  setSemanticCheckWeight(check: any, value: number): Action {
    return {
      type: AnnotateActions.SET_SEMANTIC_CHECK_WEIGHT,
      payload: {
        check,
        value
      }
    }
  }

  static TOGGLE_SEMANTIC_CHECK_ACTIVE = '[Annotate] Set Semantic Check Active';
  toggleSemanticCheckActive(check: any): Action {
    return {
      type: AnnotateActions.TOGGLE_SEMANTIC_CHECK_ACTIVE,
      payload: {
        check
      }
    }
  }

}
