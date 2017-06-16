import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { WindowRef } from './window.service';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { FlickrService } from './flickr.service';
import { LoginComponent } from './login/login.component';
import { FlickrSelectorComponent } from './flickr-selector/flickr-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FlickrSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
  ],
  providers: [
    WindowRef,
    AuthGuard,
    AuthenticationService,
    FlickrService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
