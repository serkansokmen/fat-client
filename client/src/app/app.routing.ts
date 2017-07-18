import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/+login/login.component';
import { SearchComponent } from './components/+search/search.component';
import { AnnotateComponent } from './components/+annotate/annotate.component';
import { SkinPixelsRegionsComponent } from './components/+skin-pixels-regions/skin-pixels-regions.component';
import { NudityCheckComponent } from './components/+nudity-check/nudity-check.component';
import { ObjectXComponent } from './components/+object-x/object-x.component';
import { AttributesComponent } from './components/+attributes/attributes.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'search', component: SearchComponent, canActivate: [ AuthGuard ] },
    { path: 'annotate', component: AnnotateComponent, canActivate: [ AuthGuard ],
      children: [{
        path: ':id',
        component: AnnotateComponent,
        pathMatch: 'full',
        children: [{
          path: 'skin-pixels',
          component: SkinPixelsRegionsComponent
        }, {
          path: 'nudity-check',
          component: NudityCheckComponent
        }, {
          path: 'object-x',
          component: ObjectXComponent
        }, {
          path: 'attributes',
          component: AttributesComponent
        }]
      }]
    },
    // { path: 'annotate/:id', component: AnnotateComponent, canActivate: [ AuthGuard ] },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', pathMatch: 'full', redirectTo: '/404' }
];

export const routing = RouterModule.forRoot(appRoutes);
