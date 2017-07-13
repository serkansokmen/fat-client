import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { NudityCheckType } from '../models/nudity-check.models';


@Injectable()
export class NudityCheckActions {

  static SET_WEIGHT = '[NudityCheck] Set Weight';
  setWeight(type: NudityCheckType, value: number): Action {
    return {
      type: NudityCheckActions.SET_WEIGHT,
      payload: {
        type,
        value
      }
    }
  }

  static TOGGLE_TYPE_ACTIVE = '[NudityCheck] Set Weight Active';
  toggleTypeActive(type: NudityCheckType): Action {
    return {
      type: NudityCheckActions.TOGGLE_TYPE_ACTIVE,
      payload: {
        type
      }
    }
  }
}
