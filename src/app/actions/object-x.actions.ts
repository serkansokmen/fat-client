import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ObjectX, ObjectXType, Gender, AgeGroup, DrawMode } from '../models/object-x.models';
import { Image } from 'fabric';


@Injectable()
export class ObjectXActions {

  static SET_BACKGROUND = '[ObjectX] Set Background';
  setBackground(image: Image): Action {
    return {
      type: ObjectXActions.SET_BACKGROUND,
      payload: {
        image
      }
    }
  }

  static SET_ZOOM = '[ObjectX] Set Zoom';
  setZoom(zoom: number): Action {
    return {
      type: ObjectXActions.SET_ZOOM,
      payload: {
        zoom
      }
    }
  }

  static SELECT_OBJECT = '[ObjectX] Select Object';
  selectObject(object: ObjectX): Action {
    return {
      type: ObjectXActions.SELECT_OBJECT,
      payload: {
        object
      }
    }
  }

  static SELECT_OBJECT_TYPE = '[ObjectX] Select Object Type';
  selectObjectType(objectType: ObjectXType): Action {
    return {
      type: ObjectXActions.SELECT_OBJECT_TYPE,
      payload: {
        objectType
      }
    }
  }

  static SET_VISIBLE_OBJECT_TYPES = '[ObjectX] Set Visible Object Types';
  setVisibleObjectTypes(type: ObjectXType, isVisible: boolean) {
    return {
      type: ObjectXActions.SET_VISIBLE_OBJECT_TYPES,
      payload: {
        type,
        isVisible
      }
    }
  }

  static SET_DRAW_MODE = '[ObjectX] Set Draw Mode';
  setDrawMode(drawMode: DrawMode): Action {
    return {
      type: ObjectXActions.SET_DRAW_MODE,
      payload: {
        drawMode
      }
    }
  }

  static ADD_OBJECT = '[ObjectX] Add Object';
  addObject(object: ObjectX): Action {
    return {
      type: ObjectXActions.ADD_OBJECT,
      payload: {
        object
      }
    }
  }

  static UPDATE_OBJECT = '[ObjectX] Update Object';
  updateObject(object: ObjectX, newGraphics: any): Action {
    return {
      type: ObjectXActions.UPDATE_OBJECT,
      payload: {
        object,
        newGraphics
      }
    }
  }

  static REMOVE_OBJECT = '[ObjectX] Remove Object';
  removeObject(graphics: any): Action {
    return {
      type: ObjectXActions.REMOVE_OBJECT,
      payload: {
        graphics
      }
    }
  }

  static SET_IS_SHOWING_ORIGINAL = '[ObjectX] Set Is Showing Original';
  setIsShowingOriginal(isShowingOriginal: boolean): Action {
    return {
      type: ObjectXActions.SET_IS_SHOWING_ORIGINAL,
      payload: {
        isShowingOriginal
      }
    }
  }

  static SET_GENDER = '[ObjectX] Set Gender';
  setGender(gender: Gender): Action {
    return {
      type: ObjectXActions.SET_GENDER,
      payload: {
        gender
      }
    }
  }

  static SET_AGE_GROUP = '[ObjectX] Set Age Group';
  setAgeGroup(ageGroup: AgeGroup): Action {
    return {
      type: ObjectXActions.SET_AGE_GROUP,
      payload: {
        ageGroup
      }
    }
  }
}
