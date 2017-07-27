import { Action } from '@ngrx/store';
import { AnnotateActions } from '../actions/annotate.actions';
import { Image } from  '../models/search.models';


export interface AnnotateState {
  images: Image[],
  selectedImage?: Image,
  annotation?: any,
  total: number,
  previous: string,
  next: string,
  isRequesting: boolean,
  defaultSemanticChecks: any[]
};

const initialState: AnnotateState = {
  images: [],
  total: 0,
  previous: null,
  next: null,
  isRequesting: false,
  defaultSemanticChecks: []
};

export function annotateReducer(state: AnnotateState = initialState, action: Action) {
  switch (action.type) {

    case AnnotateActions.REQUEST_IMAGES:
      return {
        ...state,
        isRequesting: true,
        images: [],
        total: 0
      };

    case AnnotateActions.REQUEST_IMAGES_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        images: action.payload.images,
        total: action.payload.total,
        previous: action.payload.previous,
        next: action.payload.next,
      };

    case AnnotateActions.DESELECT_IMAGE:
      return {
        ...state,
        selectedImage: null,
      };

    case AnnotateActions.REQUEST_IMAGE:
      return {
        ...state,
        isRequesting: true,
        selectedImage: null,
      };

    case AnnotateActions.REQUEST_IMAGE_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        selectedImage: action.payload.image,
      };

    case AnnotateActions.CREATE_ANNOTATION:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.CREATE_ANNOTATION_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      };

    case AnnotateActions.REQUEST_ANNOTATION:
      return {
        ...state,
        isRequesting: true,
        annotation: null,
      };

    case AnnotateActions.REQUEST_ANNOTATION_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      };


    case AnnotateActions.REQUEST_DEFAULT_SEMANTIC_CHECKS:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.REQUEST_DEFAULT_SEMANTIC_CHECKS_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        defaultSemanticChecks: action.payload.results.map(result => ({
          ...result,
          isActive: true,
          value: 0.0,
        })),
      }

    case AnnotateActions.TOGGLE_SEMANTIC_CHECK_ACTIVE:
      return {
        ...state,
        annotation: {
          ...state.annotation,
          semantic_checks: state.annotation.semantic_checks.map(check => {
            if (check == action.payload.check) {
              check.isActive = !check.isActive;
            }
            return check;
          })
        }
      }

    case AnnotateActions.SET_SEMANTIC_CHECK_WEIGHT:
      return {
        ...state,
        annotation: {
          ...state.annotation,
          semantic_checks: state.annotation.semantic_checks.map(check => {
            if (check == action.payload.check) {
              check.value = action.payload.value;
            }
            return check;
          })
        }
      }

    case AnnotateActions.UPDATE_ANNOTATION_SEMANTIC_CHECKS:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.UPDATE_ANNOTATION_OBJECTS:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.UPDATE_ANNOTATION_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      }

    default:
      return state;
  }
}
