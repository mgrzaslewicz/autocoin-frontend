import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {ResetPasswordRoutingModule} from "./reset-password-routing.module";
import {ResetPasswordComponent} from "./reset-password.component";
import {RequestEmailWithResetPasswordTokenComponent} from "./request-email-with-reset-password-token.component";

@NgModule({
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        FormsModule
    ],
    declarations: [ResetPasswordComponent, RequestEmailWithResetPasswordTokenComponent]
})
export class ResetPasswordModule {
}
