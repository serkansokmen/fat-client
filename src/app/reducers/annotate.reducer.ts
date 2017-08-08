import { Action } from '@ngrx/store';
import { AnnotateActions } from '../actions/annotate.actions';
import { Image as FlickrImage } from  '../models/search.models';
import { ObjectXType, ObjectX, Gender, AgeGroup, DrawMode } from '../models/object-x.models';
import { union, without } from 'underscore';


export interface AnnotateState {
  images: FlickrImage[],
  selectedImage?: FlickrImage,
  annotation?: any,
  total: number,
  previous: string,
  next: string,
  isRequesting: boolean,
  objectTypes: ObjectXType[],
  visibleObjectTypes: ObjectXType[],
  selectedObjectType: ObjectXType,
  objects: ObjectX[],
  selectedObject: ObjectX,
  genders: Gender[],
  ageGroups: AgeGroup[],
};

export const objectTypes = [
  ObjectXType.face,
  ObjectXType.genital,
  ObjectXType.buttock,
  ObjectXType.breast,
  ObjectXType.foot,
  ObjectXType.hand,
  ObjectXType.arm
];

const initialState: AnnotateState = {
  images: [],
  total: 0,
  previous: null,
  next: null,
  isRequesting: false,
  objectTypes,
  visibleObjectTypes: [],
  selectedObjectType: objectTypes[0],
  objects: [],
  selectedObject: null,
  genders: [Gender.male, Gender.female],
  ageGroups: [AgeGroup.child, AgeGroup.teen, AgeGroup.adult, AgeGroup.elder],
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
        total: action.payload.total,
        previous: action.payload.previous,
        next: action.payload.next,
      };

    case AnnotateActions.DESELECT_IMAGE:
      return {
        ...state,
        selectedImage: null,
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
        selectedImage: action.payload.image,
      };

    case AnnotateActions.CREATE_ANNOTATION:
      return {
        ...state,
        isRequesting: true,
      };

    case AnnotateActions.CREATE_ANNOTATION_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      };

    case AnnotateActions.REQUEST_ANNOTATION:
      return {
        ...state,
        isRequesting: true,
        annotation: null,
      };

    case AnnotateActions.REQUEST_ANNOTATION_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      };


    case AnnotateActions.UPDATE_ANNOTATION_COMPLETE:
      return {
        ...state,
        isRequesting: false,
        annotation: action.payload.annotation,
      }

    case AnnotateActions.SELECT_OBJECT:
      return {
        ...state,
        selectedObject: action.payload.object
      }

    case AnnotateActions.SELECT_OBJECT_TYPE:
      return {
        ...state,
        selectedObjectType: action.payload.objectType
      }

    case AnnotateActions.SET_VISIBLE_OBJECT_TYPES:
      return {
        ...state,
        visibleObjectTypes: action.payload.isVisible ?
          union(state.visibleObjectTypes, [action.payload.type]) :
          without(state.visibleObjectTypes, action.payload.type)
      }

    case AnnotateActions.ADD_OBJECT:
      return {
        ...state,
        objects: union(state.objects, [action.payload.object]),
        selectedObject: action.payload.object
      }

    case AnnotateActions.UPDATE_OBJECT:
      return {
        ...state,
        objects: state.objects.map(object => object == action.payload.object ? {...object, graphics: action.payload.newGraphics} : object),
        selectedObject: action.payload.object
      }

    case AnnotateActions.REMOVE_OBJECT:
      return {
        ...state,
        objects: state.objects.filter(object => object.graphics != action.payload.graphics),
        selectedObject: null
      }

    case AnnotateActions.SET_GENDER:
      return {
        ...state,
        objects: state.objects.map(object => {
          if (state.selectedObject && object.uuid == state.selectedObject.uuid) {
            object.gender = action.payload.gender;
          }
          return object;
        })
      }

    case AnnotateActions.SET_AGE_GROUP:
      return {
        ...state,
        objects: state.objects.map(object => {
          if (state.selectedObject && object.uuid == state.selectedObject.uuid) {
            object.ageGroup = action.payload.ageGroup;
          }
          return object;
        })
      }

    default:
      return state;
  }
}
