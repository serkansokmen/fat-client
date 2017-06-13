import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { FlickrSelectorComponent } from './flickr-selector/flickr-selector.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: FlickrSelectorComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
