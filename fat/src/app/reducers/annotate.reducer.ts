import { Action } from '@ngrx/store';
import { AnnotateActions } from '../actions/annotate.actions';
import { Image } from  '../models/search.models';


export interface AnnotateState {
  navItems: any[],
  isRequesting: boolean,
  images: Image[],
  selectedImage: Image,
  total: number,
};

const initialState: AnnotateState = {
  navItems: [{
    routerLink: '/annotate/step-1',
    label: 'Skin Pixel Regions',
    iconName: 'fa-chevron-right'
   }, {
    routerLink: '/annotate/step-2',
    label: 'Semantic Nudity Percentage',
    iconName: 'fa-chevron-right'
   }, {
    routerLink: '/annotate/step-3',
    label: 'Mark Objects',
    iconName: 'fa-chevron-right'
   }, {
    routerLink: '/annotate/step-4',
    label: 'Gender and Age Group',
    iconName: 'fa-check'
   }],
   isRequesting: false,
   images: [],
   selectedImage: null,
   total: 0
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
        total: action.payload.total
      };

    case AnnotateActions.SELECT_IMAGE:
      return {
        ...state,
        isRequesting: true,
        selectedImage: action.payload.image
      };

    case AnnotateActions.SELECT_IMAGE_COMPLETE:
      return {
        ...state,
        isRequesting: false
      }

    default:
      return state;
  }
}
