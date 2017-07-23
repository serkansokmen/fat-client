import { Action } from '@ngrx/store';
import { AnnotateActions } from '../actions/annotate.actions';
import { Image } from  '../models/search.models';


export interface AnnotateState {
  images: Image[],
  steps: any[],
  selectedStep?: any,
  selectedImage?: Image,
  annotation?: any,
  total: number,
  previous: string,
  next: string,
  isRequesting: boolean,
};

const initialState: AnnotateState = {
  images: [],
  steps: [{
    id: 1,
    routePath: '/paint-pixels',
    iconName: 'fa-paint-brush',
    title: 'Paint Pixels',
    description: 'Please use the lasso & brush tools to remove or fully include regions and pixels. Try to get pixel perfect results.',
  }, {
    id: 2,
    routePath: '/nudity-check',
    iconName: 'fa-sliders',
    title: 'Semantic Nudity Percentage',
    description: '',
  }, {
    id: 3,
    routePath: '/object-x',
    iconName: 'fa-pencil-square-o',
    title: 'Mark Objects',
    description: 'Please select an object type and add related rectangles on top of the image by dragging and drawing the smallest bounding rectangle around each object. You can edit and remove later by selecting from the options.',
  }, {
    id: 4,
    routePath: '/attributes',
    iconName: 'fa-filter',
    title: 'Gender and Age Group',
    description: 'Please select gender and age group for each of the objects. You can edit and remove later by selecting from the options.',
  }],
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

    case AnnotateActions.SELECT_STEP:
      switch (typeof action.payload.step) {
        case 'number':
          return {
            ...state,
            selectedStep: state.steps[action.payload.step],
          }
        case 'object':
          return {
            ...state,
            selectedStep: state.steps.filter(step => step.id == action.payload.step.id)[0],
          }
        default:
          return state;
      }

    case AnnotateActions.SAVE_SKIN_PIXELS:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.SAVE_SKIN_PIXELS_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      };

    default:
      return state;
  }
}
