import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterState } from '@ngrx/router-store';
import { go, replace, search, show, back, forward } from '@ngrx/router-store';
import { Image } from '../../../models/search.models';

@Component({
  selector: 'fat-annotate-steps',
  templateUrl: './annotate-steps.component.html',
  styleUrls: ['./annotate-steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotateStepsComponent {

  @Input() items: any[];
  @Input() selectedImage: Image;

  constructor(private routerStore: Store<RouterState>) { }

  navigateTo(routerLink: string) {
    this.routerStore.dispatch(go(routerLink));
  }

  saveImage() {

  }

}
