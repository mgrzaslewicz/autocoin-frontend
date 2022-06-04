import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResetPasswordComponent} from "./reset-password.component";
import {RequestEmailWithResetPasswordTokenComponent} from "./request-email-with-reset-password-token.component";
import {RESET_PASSWORD_TOKEN_PARAM} from "./reset-password-routing-parameter";

const routes: Routes = [
    {
        path: 'step-1',
        component: RequestEmailWithResetPasswordTokenComponent
    },
    {
        path: `step-2/:${RESET_PASSWORD_TOKEN_PARAM}`,
        component: ResetPasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResetPasswordRoutingModule {
}
