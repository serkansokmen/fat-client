import { NgModule } from '@angular/core';
import {
  // MaterialModule
  MdToolbarModule,
  MdSlideToggleModule,
  MdButtonModule ,
  MdCheckboxModule,
  MdSliderModule,
  MdInputModule,
  MdOptionModule,
  MdTabsModule,
  MdGridListModule,
  MdProgressSpinnerModule,
  MdSelectModule,
  MdRadioModule,
  MdSidenavModule,
  MdMenuModule,
  MdListModule,
  MdIconModule
} from '@angular/material';

import 'hammerjs';

@NgModule({
  imports: [
    // MaterialModule
    MdToolbarModule,
    MdSlideToggleModule,
    MdButtonModule ,
    MdCheckboxModule,
    MdSliderModule,
    MdInputModule,
    MdOptionModule,
    MdTabsModule,
    MdGridListModule,
    MdProgressSpinnerModule,
    MdSelectModule,
    MdRadioModule,
    MdSidenavModule,
    MdMenuModule,
    MdListModule,
    MdIconModule
  ],
  exports: [
    // MaterialModule
    MdToolbarModule,
    MdSlideToggleModule,
    MdButtonModule ,
    MdCheckboxModule,
    MdSliderModule,
    MdInputModule,
    MdOptionModule,
    MdTabsModule,
    MdGridListModule,
    MdProgressSpinnerModule,
    MdSelectModule,
    MdRadioModule,
    MdSidenavModule,
    MdMenuModule,
    MdListModule,
    MdIconModule
  ]
})
export class AppMaterial { }
