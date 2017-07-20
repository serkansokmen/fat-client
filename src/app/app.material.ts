import { NgModule } from '@angular/core';
import {
  // MaterialModule
  MdToolbarModule,
  MdSlideToggleModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCheckboxModule,
  MdSliderModule,
  MdInputModule,
  MdOptionModule,
  MdTabsModule,
  MdProgressSpinnerModule,
  MdExpansionModule,
  MdSelectModule,
  MdRadioModule,
  MdDialogModule,
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
    MdButtonModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdSliderModule,
    MdInputModule,
    MdOptionModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdExpansionModule,
    MdSelectModule,
    MdRadioModule,
    MdDialogModule,
    MdSidenavModule,
    MdMenuModule,
    MdListModule,
    MdIconModule
  ],
  exports: [
    // MaterialModule
    MdToolbarModule,
    MdSlideToggleModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdSliderModule,
    MdInputModule,
    MdOptionModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdExpansionModule,
    MdSelectModule,
    MdRadioModule,
    MdDialogModule,
    MdSidenavModule,
    MdMenuModule,
    MdListModule,
    MdIconModule
  ]
})
export class AppMaterial { }
