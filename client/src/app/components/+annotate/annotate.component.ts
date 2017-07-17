import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AnnotateState } from '../../reducers/annotate.reducer';
import { AnnotateActions } from '../../actions/annotate.actions';
import { Image, ImageState } from '../../models/search.models';
import { CardLayoutOptions } from '../../models/card-layout.models';
import { CardLayoutActions } from '../../actions/card-layout.actions';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'fat-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotateComponent implements OnInit, OnDestroy {

  annotate$: Observable<AnnotateState>;
  viewMode = CardLayoutOptions.thumbs;
  adminURL: string;

  private sub: any;
  private base64: string;
  private image: Image;

  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MdDialog,
    public store: Store<AnnotateState>,
    private actions: AnnotateActions,
    private cardLayoutActions: CardLayoutActions,
    private router: Router,
    private route: ActivatedRoute,
    private admin: AdminService,
  ) {
    this.annotate$ = store.select('annotate');
    this.adminURL = admin.adminEndpoint;
  }

  ngOnInit() {
    this.store.dispatch(this.actions.requestImages(ImageState.approved));
    this.store.dispatch(this.cardLayoutActions.setActionsVisible(false));

    this.sub = this.route.params.subscribe(params => {
      if (!params.id) {
      //   this.store.dispatch(this.actions.requestImage(params.id));
      // } else {
        this.store.dispatch(this.actions.deselectImage());
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleCardSelect(image: Image) {
    if (image.image) {
      this.store.dispatch(this.actions.selectImage(image));
      this.router.navigate(['/annotate', image.id], {queryParams: {step: 1}});
      this.image = image;
    }
  }

  handleStepChange(data: any) {
    this.store.dispatch(this.actions.selectStep(data.step));
    this.router.navigate(['/annotate', data.image.id], { queryParams: { step: data.step }});
  }

  handleImageAnnotated(base64: string) {
    this.base64 = base64;
    this.store.dispatch(this.actions.updateBase64(this.base64));
  }

  handleNext() {
    if (!this.image) {
      return;
    }
    this.store.dispatch(this.actions.saveAnnotation(this.image, this.base64));
  }

}
