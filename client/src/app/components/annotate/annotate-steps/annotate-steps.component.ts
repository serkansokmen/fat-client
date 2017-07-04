import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
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

  @Output('onStepSelect') step = new EventEmitter<any>();

  handleStepClick(data: any) {
    this.step.emit(data);
  }

}
