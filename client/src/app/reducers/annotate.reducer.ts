import { Action } from '@ngrx/store';
import { AnnotateActions } from '../actions/annotate.actions';
import { Image } from  '../models/search.models';


export interface AnnotateState {
  steps: any[],
  selectedStep: any,
  isRequesting: boolean,
  images: Image[],
  selectedImage: Image,
  annotatedImage: any,
  annotationResult: any,
  total: number,
  previous: string,
  next: string,
};

const initialState: AnnotateState = {
  steps: [{
    id: 1,
    iconName: 'fa-paint-brush',
    title: 'Fine Tune Marked Skin Pixels',
    description: 'Please use the lasso & brush tool to remove or fully include regions and pixels. Try to get pixel perfect results.',
   }, {
    id: 2,
    iconName: 'fa-sliders',
    title: 'Semantic Nudity Percentage',
    description: '',
   }, {
    id: 3,
    iconName: 'fa-pencil-square-o',
    title: 'Mark Objects',
    description: 'Please select an object type and add related rectangles on top of the image by dragging and drawing the smallest bounding rectangle around each object. You can edit and remove later by selecting from the options.',
   }, {
    id: 4,
    iconName: 'fa-filter',
    title: 'Gender and Age Group',
    description: 'Please select gender and age group for each of the objects. You can edit and remove later by selecting from the options.',
  }],
  selectedStep: null,
  isRequesting: false,
  images: [],
  selectedImage: null,
  annotatedImage: null,
  annotationResult: null,
  total: 0,
  previous: null,
  next: null,
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
        images: action.payload.images.map(image => new Image(image)),
        total: action.payload.total,
        previous: action.payload.previous,
        next: action.payload.next,
      };

    case AnnotateActions.SELECT_IMAGE:
      return {
        ...state,
        selectedImage: new Image(action.payload.image),
        selectedStep: 1
      };

    case AnnotateActions.DESELECT_IMAGE:
      return {
        ...state,
        selectedImage: null,
        selectedStep: null
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
        selectedImage: new Image(action.payload.result),
        selectedStep: 1
      };

    case AnnotateActions.SELECT_STEP:
      return {
        ...state,
        selectedStep: action.payload.step,
      };

    case AnnotateActions.UPDATE_ANNOTATED_IMAGE:
      return {
        ...state,
        annotatedImage: action.payload.result,
      }

    case AnnotateActions.SAVE_ANNOTATION:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.SAVE_ANNOTATION_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotationResult: action.payload.result,
        // selectedStep: 2,
      };

    default:
      return state;
  }
}
