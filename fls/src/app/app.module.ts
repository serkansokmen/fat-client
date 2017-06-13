import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FlickrSelectorComponent } from './flickr-selector/flickr-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    FlickrSelectorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
