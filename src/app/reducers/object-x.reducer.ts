import { Action } from '@ngrx/store';
import { ObjectXType, ObjectX, Gender, AgeGroup, DrawMode } from '../models/object-x.models';
import { ObjectXActions } from '../actions/object-x.actions';
import {
  fabric,
  Canvas,
  Image
} from 'fabric';


export const createGraphicFromRectangle = (rect: any, objectType: ObjectXType) => {
  let graphics = new fabric.Group();
  graphics.addWithUpdate(new fabric.Rect({
    left: graphics.getLeft(),
    top: graphics.getTop(),
    width: rect.getWidth(),
    height: rect.getHeight(),
    originX: 'center',
    originY: 'center',
    fill: objectType.color,
    stroke: 'transparent',
    opacity: 0.25
  }));
  graphics.addWithUpdate(new fabric.Text(objectType.name, {
    fontFamily: 'Arial',
    fontSize: (rect.getWidth() + rect.getHeight()) / 20,
    fill: objectType.color,
    textAlign: 'center',
    originX: 'center',
    originY: 'center'
  }));
  graphics.set('top', rect.getTop());
  graphics.set('left', rect.getLeft());

  return graphics;
}


export interface ObjectXState {
  drawMode: DrawMode,
  zoom: number,
  isShowingOriginal: boolean
};

const initialState: ObjectXState = {
  drawMode: DrawMode.add,
  zoom: 1.0,
  isShowingOriginal: true
};

export function objectXReducer(state: ObjectXState = initialState, action: Action) {
  switch (action.type) {

    case ObjectXActions.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload.zoom
      }

    case ObjectXActions.SET_DRAW_MODE:
      return {
        ...state,
        drawMode: action.payload.drawMode
      }

    case ObjectXActions.SET_IS_SHOWING_ORIGINAL:
      return {
        ...state,
        isShowingOriginal: action.payload.isShowingOriginal
      }

    default:
      return state;
  }
}
