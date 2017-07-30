import { Action } from '@ngrx/store';
import { ObjectXType, ObjectX, Gender, AgeGroup, DrawMode } from '../models/object-x.models';
import { ObjectXActions } from '../actions/object-x.actions';
import { union, without } from 'underscore';
import { Image } from 'fabric';


export interface ObjectXState {
  backgroundImage: Image,
  objectTypes: ObjectXType[],
  visibleObjectTypes: ObjectXType[],
  selectedObjectType: ObjectXType,
  objects: ObjectX[],
  selectedObject: ObjectX,
  genders: Gender[],
  ageGroups: AgeGroup[],
  drawMode: DrawMode,
  zoom: number,
  isShowingOriginal: boolean
};

const objectTypes = [
  ObjectXType.face,
  ObjectXType.genital,
  ObjectXType.buttock,
  ObjectXType.breast,
  ObjectXType.foot,
  ObjectXType.hand,
  ObjectXType.arm
];

const initialState: ObjectXState = {
  backgroundImage: null,
  objectTypes,
  visibleObjectTypes: [],
  selectedObjectType: objectTypes[0],
  objects: [],
  selectedObject: null,
  genders: [Gender.male, Gender.female],
  ageGroups: [AgeGroup.child, AgeGroup.teen, AgeGroup.adult, AgeGroup.elder],
  drawMode: DrawMode.add,
  zoom: 1.0,
  isShowingOriginal: true
};

export function objectXReducer(state: ObjectXState = initialState, action: Action) {
  switch (action.type) {

    case ObjectXActions.SET_BACKGROUND:
      return {
        ...state,
        backgroundImage: action.payload.image || null
      }

    case ObjectXActions.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload.zoom
      }

    case ObjectXActions.SELECT_OBJECT:
      return {
        ...state,
        selectedObject: action.payload.object
      }

    case ObjectXActions.SELECT_OBJECT_TYPE:
      return {
        ...state,
        selectedObjectType: action.payload.objectType
      }

    case ObjectXActions.SET_VISIBLE_OBJECT_TYPES:
      return {
        ...state,
        visibleObjectTypes: action.payload.isVisible ?
          union(state.visibleObjectTypes, [action.payload.type]) :
          without(state.visibleObjectTypes, action.payload.type)
      }

    case ObjectXActions.SET_DRAW_MODE:
      return {
        ...state,
        drawMode: action.payload.drawMode
      }

    case ObjectXActions.ADD_OBJECT:
      return {
        ...state,
        objects: union(state.objects, [action.payload.object]),
        selectedObject: action.payload.object
      }

    case ObjectXActions.UPDATE_OBJECT:
      return {
        ...state,
        objects: state.objects.map(object => object == action.payload.object ? {...object, graphics: action.payload.newGraphics} : object),
        selectedObject: action.payload.object
      }

    case ObjectXActions.REMOVE_OBJECT:
      return {
        ...state,
        objects: state.objects.filter(object => object.graphics != action.payload.graphics),
        selectedObject: null
      }

    case ObjectXActions.SET_IS_SHOWING_ORIGINAL:
      return {
        ...state,
        isShowingOriginal: action.payload.isShowingOriginal
      }

    case ObjectXActions.SET_GENDER:
      return {
        ...state,
        objects: state.objects.map(object => {
          if (state.selectedObject && object.guid == state.selectedObject.guid) {
            object.gender = action.payload.gender;
          }
          return object;
        })
      }

    case ObjectXActions.SET_AGE_GROUP:
      return {
        ...state,
        objects: state.objects.map(object => {
          if (state.selectedObject && object.guid == state.selectedObject.guid) {
            object.ageGroup = action.payload.ageGroup;
          }
          return object;
        })
      }

    default:
      return state;
  }
}
