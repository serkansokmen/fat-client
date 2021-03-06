import { Action } from '@ngrx/store';
import { AnnotateActions } from '../actions/annotate.actions';
import { Image as FlickrImage } from  '../models/search.models';
import { ObjectXType, ObjectX, Gender, AgeGroup, DrawMode } from '../models/object-x.models';
import { union, without } from 'underscore';


export interface AnnotateState {
  images: FlickrImage[],
  selectedImage?: FlickrImage,
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
