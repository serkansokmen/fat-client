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
import { SearchActions } from './actions/search.actions';
import { FlickrService } from './services/flickr.service';
import { SearchEffects } from './effects/search.effects';
import { searchReducer } from './reducers/search.reducer';
import { CardLayoutActions } from './actions/card-layout.actions';
import { cardLayoutReducer } from './reducers/card-layout.reducer';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';

import { StoreModule } from '@ngrx/store';
// import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SafeStylePipe } from './pipes/safe-style.pipe';
import { SearchCardComponent } from './search-card/search-card.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    SafeStylePipe,
    SearchCardComponent,
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
      search: searchReducer,
      cardLayout: cardLayoutReducer,
    }),
    EffectsModule.runAfterBootstrap(SearchEffects),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    SearchActions,
    FlickrService,
    CookieService,
    CardLayoutActions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
