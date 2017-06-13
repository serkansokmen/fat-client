import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { FlickrService } from './flickr.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FlickrSelectorComponent } from './flickr-selector/flickr-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FlickrSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    FlickrService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
