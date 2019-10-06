import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllowOnlyLoggedInGuard, AllowOnlyNotLoggedInGuard} from './shared';

const routes: Routes = [
    {
        path: '',
        loadChildren: './layout/layout.module#LayoutModule',
        canActivate: [AllowOnlyLoggedInGuard]
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule',
        canActivate: [AllowOnlyNotLoggedInGuard]
    },
    {path: 'signup', loadChildren: './signup/signup.module#SignupModule'},
    {path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule'},
    {path: '**', redirectTo: 'not-found'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
