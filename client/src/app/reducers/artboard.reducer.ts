import { Action } from '@ngrx/store';
import { ArtboardTool } from '../models/artboard.models';
import { ArtboardActions } from '../actions/artboard.actions';


export interface ArtboardState {
  currentTool: ArtboardTool,
  brushRadius: number,
  zoom: number,
  isDragging: boolean,
  isAdding: boolean,
  isShowingOriginal: boolean,
  base64?: string,
};

const initialState: ArtboardState = {
  currentTool: ArtboardTool.lasso,
  brushRadius: 24.0,
  zoom: 1.5,
  isDragging: false,
  isAdding: true,
  isShowingOriginal: true,
};

export function artboardReducer(state: ArtboardState = initialState, action: Action) {
  switch (action.type) {

    case ArtboardActions.SELECT_ARTBOARD_TOOL:
      return {
        ...state,
        currentTool: action.payload.tool
      }
    case ArtboardActions.SET_BRUSH_RADIUS:
      return {
        ...state,
        brushRadius: action.payload.radius
      }
    case ArtboardActions.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload.zoom
      }
    case ArtboardActions.SET_IS_DRAGGING:
      return {
        ...state,
        isDragging: action.payload.isDragging
      }
    case ArtboardActions.SET_IS_PIXEL_ADDING:
      return {
        ...state,
        isAdding: action.payload.isAdding
      }
    case ArtboardActions.SET_IS_SHOWING_ORIGINAL:
      return {
        ...state,
        isShowingOriginal: action.payload.isShowingOriginal
      }
    default:
      return state;
  }
}
