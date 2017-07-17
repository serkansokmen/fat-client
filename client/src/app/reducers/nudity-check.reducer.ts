import { Action } from '@ngrx/store';
import { ObjectXType, ObjectX, Gender, AgeGroup, DrawMode } from '../models/object-x.models';
import { NudityCheckActions } from '../actions/nudity-check.actions';
import { union, without } from 'underscore';
import { NudityCheckType } from '../models/nudity-check.models';


export interface NudityCheckState {
  checkTypes: NudityCheckType[]
};

const initialState: NudityCheckState = {
  checkTypes: [
    new NudityCheckType('beach', 100.0, true),
    new NudityCheckType('pornographic', 100.0, true),
    new NudityCheckType('nude', 100.0, true),
    new NudityCheckType('class4', 100.0, true),
    new NudityCheckType('class5', 100.0, true),
  ]
};

export function nudityCheckReducer(state: NudityCheckState = initialState, action: Action) {
  switch (action.type) {

    case NudityCheckActions.TOGGLE_TYPE_ACTIVE:
      return {
        ...state,
        checkTypes: state.checkTypes.map(type => {
          if (type == action.payload.type) {
            type.isActive = !type.isActive;
          }
          return type;
        })
      }

    case NudityCheckActions.SET_WEIGHT:
      return {
        ...state,
        checkTypes: state.checkTypes.map(type => {
          if (type == action.payload.type) {
            type.weight = action.payload.value;
          }
          return type;
        })
      }

    default:
      return state;
  }
}
