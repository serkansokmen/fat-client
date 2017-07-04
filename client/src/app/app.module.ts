// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';
import { CookieService } from 'ngx-cookie';
import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Application
import { AppComponent } from './app.component';
import { AppMaterial } from './app.material';
import { routing } from './app.routing';
import { AuthGuard } from './guards/auth.guard';
import { SafeStylePipe } from './pipes/safe-style.pipe';

// Services
import { AuthenticationService } from './services/authentication.service';
import { FlickrService } from './services/flickr.service';
import { ImageService } from './services/image.service';

// Actions
import { SearchActions } from './actions/search.actions';
import { AnnotateActions } from './actions/annotate.actions';
import { CardLayoutActions } from './actions/card-layout.actions';

// Effects
import { SearchEffects } from './effects/search.effects';
import { AnnotateEffects } from './effects/annotate.effects';

// Reducers
import { searchReducer } from './reducers/search.reducer';
import { annotateReducer } from './reducers/annotate.reducer';
import { cardLayoutReducer } from './reducers/card-layout.reducer';
import { artboardReducer } from './reducers/artboard.reducer';
import { objectXReducer } from './reducers/object-x.reducer';
import { nudityCheckReducer } from './reducers/nudity-check.reducer';

// Components
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { CardComponent } from './components/card/card.component';
import { SkinPixelsRegionsComponent } from './components/annotate/skin-pixels-regions/skin-pixels-regions.component';
import { NudityCheckComponent } from './components/annotate/nudity-check/nudity-check.component';
import { ObjectXComponent } from './components/annotate/object-x/object-x.component';
import { AttributesComponent } from './components/annotate/attributes/attributes.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AnnotateStepsComponent } from './components/annotate/annotate-steps/annotate-steps.component';
import { AnnotateComponent } from './components/annotate/annotate.component';
import { CardListComponent } from './components/card-list/card-list.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    SafeStylePipe,
    CardComponent,
    SkinPixelsRegionsComponent,
    PageNotFoundComponent,
    NudityCheckComponent,
    ObjectXComponent,
    AttributesComponent,
    AnnotateStepsComponent,
    AnnotateComponent,
    CardListComponent,
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
      annotate: annotateReducer,
      cardLayout: cardLayoutReducer,
      router: routerReducer,
      artboard: artboardReducer,
      objectX: objectXReducer,
      nudityCheck: nudityCheckReducer,
    }),
    RouterStoreModule.connectRouter(),
    EffectsModule.runAfterBootstrap(SearchEffects),
    EffectsModule.runAfterBootstrap(AnnotateEffects),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    CookieService,
    FlickrService,
    ImageService,
    SearchActions,
    AnnotateActions,
    CardLayoutActions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
