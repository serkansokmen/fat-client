import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { AnnotateComponent } from './components/annotate/annotate.component';
import { SkinPixelsRegionsComponent } from './components/annotate/skin-pixels-regions/skin-pixels-regions.component';
import { NudityCheckComponent } from './components/annotate/nudity-check/nudity-check.component';
import { ObjectXComponent } from './components/annotate/object-x/object-x.component';
import { AttributesComponent } from './components/annotate/attributes/attributes.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'search/:slug', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'annotate', canActivate: [AuthGuard], component: AnnotateComponent, children: [{
        path: 'step-1',
        component: SkinPixelsRegionsComponent
      }, {
        path: 'step-2',
        component: NudityCheckComponent
      }, {
        path: 'step-3',
        component: ObjectXComponent
      }, {
        path: 'step-4',
        component: AttributesComponent
      }
    ]},
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404' }
    // otherwise redirect to home
    // { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
