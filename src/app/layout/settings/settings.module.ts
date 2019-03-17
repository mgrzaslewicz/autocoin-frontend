import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings.component';
import {PageHeaderModule} from '../../shared/index';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TwoFactorAuthenticationComponent} from './two-factor-authentication/two-factor-authentication.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SettingsComponent, TwoFactorAuthenticationComponent]
})
export class SettingsModule {
}
