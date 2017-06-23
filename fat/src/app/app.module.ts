import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';
import { CookieService } from 'ngx-cookie';
import { AppComponent } from './app.component';
import { AppMaterial } from './app.material';
import { routing } from './app.routing';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { FlickrActions } from './actions/flickr.actions';
import { FlickrService } from './services/flickr.service';
import { FlickrEffects } from './effects/flickr.effects';
import { flickrReducer } from './reducers/flickr.reducer';
import { CardLayoutActions } from './actions/card-layout.actions';
import { cardLayoutReducer } from './reducers/card-layout.reducer';
import { LoginComponent } from './login/login.component';
import { FlickrSearchComponent } from './flickr-search/flickr-search.component';

import { StoreModule } from '@ngrx/store';
// import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SafeStylePipe } from './pipes/safe-style.pipe';
import { FlickrCardComponent } from './flickr-card/flickr-card.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FlickrSearchComponent,
    SafeStylePipe,
    FlickrCardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    AppMaterial,
    StoreModule.provideStore({
      flickr: flickrReducer,
      cardLayout: cardLayoutReducer,
    }),
    EffectsModule.runAfterBootstrap(FlickrEffects),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    FlickrActions,
    FlickrService,
    CookieService,
    CardLayoutActions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
