import { Action } from '@ngrx/store';
import { AnnotateActions } from '../actions/annotate.actions';
import { Image } from  '../models/search.models';


export interface AnnotateState {
  navItems: any[],
  isRequesting: boolean,
  images: Image[],
  selectedImage: Image,
  total: number,
  previous: string,
  next: string,
};

const initialState: AnnotateState = {
  navItems: [{
    routerLink: '/step-1',
    label: 'Skin Pixel Regions',
    iconName: 'fa-chevron-right'
   }, {
    routerLink: '/step-2',
    label: 'Semantic Nudity Percentage',
    iconName: 'fa-chevron-right'
   }, {
    routerLink: '/step-3',
    label: 'Mark Objects',
    iconName: 'fa-chevron-right'
   }, {
    routerLink: '/step-4',
    label: 'Gender and Age Group',
    iconName: 'fa-check'
   }],
   isRequesting: false,
   images: [],
   selectedImage: null,
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
        selectedImage: new Image(action.payload.image)
      };

    case AnnotateActions.DESELECT_IMAGE:
      return {
        ...state,
        selectedImage: null
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
      };

    default:
      return state;
  }
}
