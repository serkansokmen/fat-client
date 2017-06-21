import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { FlickrSearchComponent } from './flickr-search/flickr-search.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: FlickrSearchComponent, canActivate: [AuthGuard] },
    { path: 'search', component: FlickrSearchComponent, canActivate: [AuthGuard] },
    { path: 'search/:slug', component: FlickrSearchComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
