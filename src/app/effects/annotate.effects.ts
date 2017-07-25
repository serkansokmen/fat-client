import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { Image, License } from '../models/search.models';
import { AnnotateActions } from '../actions/annotate.actions';
import { AnnotateState } from '../reducers/annotate.reducer';
import { FlickrService } from '../services/flickr.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';

@Injectable()
export class AnnotateEffects {

  constructor(
    private http: Http,
    private actions$: Actions,
    private store$: Store<AnnotateState>,
    private service: FlickrService,
  ) {}

  @Effect() requestImages$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGES)
    .map(toPayload)
    .switchMap(payload => this.service.getImages(true))
    .switchMap(result => Observable.of({
        type: AnnotateActions.REQUEST_IMAGES_COMPLETE,
        payload: {
          ...result
        }
      }));

  @Effect() requestImage$ = this.actions$
    .ofType(AnnotateActions.REQUEST_IMAGE)
    .map(toPayload)
    .switchMap(payload => this.service.getImage(payload.id, false))
    .switchMap(result => Observable.of({
        type: AnnotateActions.REQUEST_IMAGE_COMPLETE,
        payload: {
          image: new Image(result.json())
        }
      }));

  @Effect() savePaintImage$ = this.actions$
    .ofType(AnnotateActions.SAVE_PAINT_IMAGE)
    .withLatestFrom(this.store$, (action, state: any) => ({
      image: state.annotate.selectedImage,
      base64: action.payload.base64,
      annotationID: state.annotate ? state.annotate.id : null,
    }))
    .switchMap(object => this.service
      .saveAnnotation(object.image, object.base64, object.annotationID)
      .map(res => res.json())
      .catch(err => err.json()))
    .switchMap(annotation => Observable.of({
        type: AnnotateActions.SAVE_PAINT_IMAGE_COMPLETE,
        payload: {
          annotation
        }
      }));

   @Effect({ dispatch: false }) savePaintImageComplete$ = this.actions$
    .ofType(AnnotateActions.SAVE_PAINT_IMAGE_COMPLETE)
    .withLatestFrom(this.store$, (action, state: any) => {
      return `/annotate/${state.annotate.selectedImage.id}/${state.annotate.annotation.id}/nudity-check`;
    })
    .map(url => {
      this.store$.dispatch(go([url]));
    })

  @Effect() requestAnnotation$ = this.actions$
    .ofType(AnnotateActions.REQUEST_ANNOTATION)
    .map(toPayload)
    .switchMap(payload => this.service.getAnnotation(payload.id))
    .switchMap(result => Observable.of({
        type: AnnotateActions.REQUEST_ANNOTATION_COMPLETE,
        payload: {
          annotation: result.json()
        }
      }));

  @Effect() requestAnnotationComplete$ = this.actions$
    .ofType(AnnotateActions.REQUEST_ANNOTATION_COMPLETE)
    .map(toPayload)
    .switchMap(payload => this.service.getSemanticChecks())
    .switchMap(result => Observable.of({
        type: AnnotateActions.REQUEST_CHECK_TYPES_COMPLETE,
        payload: {
          types: result.json().results.map(result => ({
            ...result,
            isActive: true,
          })),
        }
      }));

  @Effect() updateAnnotationSemanticChecks$ = this.actions$
    .ofType(AnnotateActions.UPDATE_ANNOTATION_SEMANTIC_CHECKS)
    .withLatestFrom(this.store$, (action, state: any) => {
      return {
        image: state.annotate.selectedImage.id,
        annotation: state.annotate.annotation.id,
        checkTypes: state.annotate.checkTypes
      }
    })

    .map(object => {
      return `/annotate/${object.image}/${object.annotation}/object-x`;
    })
    .map(url => {
      this.store$.dispatch(go([url]));
    })

    // .mergeMap(data => {
    //   let requests = [];
    //   for (let type of data.checkTypes) {
    //     requests.push(this.service.updateAnnotationSemanticChecks(data.annotation.id, type.id, type.value));
    //   }
    //   requests.push(go([`annotate/${data.annotation.image}/${data.annotation.id}/object-x`]));
    //   requests.push({
    //     type: AnnotateActions.UPDATE_ANNOTATION_SEMANTIC_CHECKS_COMPLETE,
    //     payload: {}
    //   })
    //   return Observable.forkJoin(requests)
    // })
    // .map(results => {
    //   console.log(results);
    //   return results[results.length - 1];
    // })
    // .map(result => {
    //   console.log(result);
    //   return result;
    // })
    // // .map(toPayload)
    // // .switchMap(payload => )
    // .switchMap(annotation => Observable.of({
    //     type: AnnotateActions.UPDATE_ANNOTATION_SEMANTIC_CHECKS_COMPLETE,
    //     payload: {
    //       annotation
    //     }
    //   }));

}
