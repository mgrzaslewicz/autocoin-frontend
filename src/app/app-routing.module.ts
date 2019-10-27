import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllowOnlyLoggedInGuard, AllowOnlyNotLoggedInGuard} from './shared';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
        canActivate: [AllowOnlyLoggedInGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        canActivate: [AllowOnlyNotLoggedInGuard]
    },
    {
        path: 'signup',
        loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule),
        canActivate: [AllowOnlyNotLoggedInGuard]
    },
    {path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)},
    {path: '**', redirectTo: 'not-found'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
