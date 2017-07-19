import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ArtboardTool } from '../models/artboard.models';


@Injectable()
export class ArtboardActions {

  static SELECT_ARTBOARD_TOOL = '[Artboard] Select Artboard Tool';
  selectArtboardTool(tool: ArtboardTool): Action {
    return {
      type: ArtboardActions.SELECT_ARTBOARD_TOOL,
      payload: {
        tool
      }
    }
  }

  static SET_BRUSH_RADIUS = '[Artboard] Set Brush Radius';
  setBrushRadius(radius: number): Action {
    return {
      type: ArtboardActions.SET_BRUSH_RADIUS,
      payload: {
        radius
      }
    }
  }

  static SET_ZOOM = '[Artboard] Set Zoom';
  setZoom(zoom: number): Action {
    return {
      type: ArtboardActions.SET_ZOOM,
      payload: {
        zoom
      }
    }
  }

  static SET_IS_DRAGGING = '[Artboard] Set Is Dragging';
  setIsDragging(isDragging: boolean): Action {
    return {
      type: ArtboardActions.SET_IS_DRAGGING,
      payload: {
        isDragging
      }
    }
  }

  static SET_IS_PIXEL_ADDING = '[Artboard] Set Is Pixel Adding';
  setPixelAdding(isAdding: boolean): Action {
    return {
      type: ArtboardActions.SET_IS_PIXEL_ADDING,
      payload: {
        isAdding
      }
    }
  }

  static SET_IS_SHOWING_ORIGINAL = '[Artboard] Set Is Showing Original';
  setIsShowingOriginal(isShowingOriginal: boolean): Action {
    return {
      type: ArtboardActions.SET_IS_SHOWING_ORIGINAL,
      payload: {
        isShowingOriginal
      }
    }
  }

}
