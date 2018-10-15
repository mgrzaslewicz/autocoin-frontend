import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings.component';
import {PageHeaderModule} from '../../shared/index';
import {WatchedCurrencyPairsComponent} from './watched-currency-pairs/watched-currency-pairs.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TwoFactorAuthenticationSettingsComponent} from './two-factor-authentication-settings/two-factor-authentication-settings.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SettingsComponent, WatchedCurrencyPairsComponent, TwoFactorAuthenticationSettingsComponent]
})
export class SettingsModule {
}
