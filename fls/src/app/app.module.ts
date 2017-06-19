import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppMaterial } from './app.material';
import { routing } from './app.routing';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { FlickrService } from './flickr.service';
import { LoginComponent } from './login/login.component';
import { FlickrSelectorComponent } from './flickr-selector/flickr-selector.component';

import 'mdi';


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
    BrowserAnimationsModule,
    AppMaterial,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    FlickrService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
