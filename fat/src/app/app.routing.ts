import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'search/:slug', component: SearchComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
