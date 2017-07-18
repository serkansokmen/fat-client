import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Image } from '../../models/search.models';

@Component({
  selector: 'fat-annotate-steps',
  templateUrl: './annotate-steps.component.html',
  styleUrls: ['./annotate-steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotateStepsComponent {

  @Input() items: any[];
  @Input() step: any;
  @Input() selectedImage: Image;

  @Output('onStepSelect') stepEmitter = new EventEmitter<any>();
  @Output('onNext') next = new EventEmitter();

  handleStepClick(step: any) {
    this.stepEmitter.emit(step);
  }

  handleSave() {
    this.next.emit();
  }

}
