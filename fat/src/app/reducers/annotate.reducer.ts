import { Action } from '@ngrx/store';


export interface AnnotateState {
  navItems: any[],
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
   }]
};

export function annotateReducer(state: AnnotateState = initialState, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
