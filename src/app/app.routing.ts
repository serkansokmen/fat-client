import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/+login/login.component';
import { SearchComponent } from './components/+search/search.component';
import { AnnotateComponent } from './components/+annotate/annotate.component';
import { PaintPixelsComponent } from './components/+paint-pixels/paint-pixels.component';
import { NudityCheckComponent } from './components/+nudity-check/nudity-check.component';
import { ObjectXComponent } from './components/+object-x/object-x.component';
import { AttributesComponent } from './components/+attributes/attributes.component';
import { AnnotationComplete } from './components/+annotation-complete/annotation-complete.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'search', component: SearchComponent, canActivate: [ AuthGuard ] },
    { path: 'annotate', component: AnnotateComponent, canActivate: [ AuthGuard ] },
    { path: 'annotate/:image_id', component: AnnotateComponent, canActivate: [ AuthGuard ] },
    { path: 'annotate/:image_id/new', component: PaintPixelsComponent, canActivate: [ AuthGuard ] },
    { path: 'annotate/:image_id/:annotation_id', component: PaintPixelsComponent, canActivate: [ AuthGuard ] },
    { path: 'annotate/:image_id/:annotation_id/nudity-check', component: NudityCheckComponent },
    { path: 'annotate/:image_id/:annotation_id/objects', component: ObjectXComponent },
    { path: 'annotate/:image_id/:annotation_id/attributes', component: AttributesComponent },
    { path: 'annotate/:image_id/:annotation_id/complete', component: AnnotationComplete },
    { path: '404', component: PageNotFoundComponent },
    { path: '', pathMatch: 'full', redirectTo: '/search' },
    { path: '**', pathMatch: 'full', redirectTo: '/404' },
];

export const routing = RouterModule.forRoot(appRoutes);
