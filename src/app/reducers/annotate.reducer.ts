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
};

const initialState: AnnotateState = {
  images: [],
  total: 0,
  previous: null,
  next: null,
  isRequesting: false,
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

    case AnnotateActions.SELECT_IMAGE:
      return {
        ...state,
        selectedImage: action.payload.image,
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
        selectedImage: action.payload.result,
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

    case AnnotateActions.SAVE_PAINT_IMAGE:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.SAVE_PAINT_IMAGE_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      };

    default:
      return state;
  }
}
