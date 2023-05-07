import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ToastService} from './toast.service';
import {HealthService} from './health.service';
import {AuthService} from './auth.service';
import {PriceService} from './price.service';
import {FeatureToggleToken, LocalStorageFeatureToggle} from './feature.toogle.service';
import {ExchangeUsersService} from './api';
import {UserAccountService} from './user-account.service';
import {ExchangeKeyCapabilityService} from './exchange-key-capability.service';
import {ArbitrageMonitorUrlToken, AuthServiceUrlToken, BalanceMonitorUrlToken, ExchangeMediatorUrlToken} from '../../environments/endpoint-tokens';
import {environment} from '../../environments/environment';
import {SignupService} from './signup.service';
import {ArbitrageMonitorService} from './arbitrage-monitor.service';
import {ExchangeMarketLink} from './exchange-market-link.service';
import {ArbitrageOpportunityExchangeMarketLinkService} from "./arbitrage-opportunity-exchange-market-link.service";
import {BalanceMonitorService} from "./balance-monitor.service";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    providers: [
        LocalStorageFeatureToggle,
        {provide: FeatureToggleToken, useClass: LocalStorageFeatureToggle},
        {provide: AuthServiceUrlToken, useValue: environment.authServiceUrl},
        {provide: BalanceMonitorUrlToken, useValue: environment.balanceMonitorUrl},
        {provide: ExchangeMediatorUrlToken, useValue: environment.exchangeMediatorUrl},
        {provide: ArbitrageMonitorUrlToken, useValue: environment.arbitrageMonitorUrl},
        AuthService,
        UserAccountService,
        ExchangeUsersService,
        ExchangeKeyCapabilityService,
        PriceService,
        ToastService,
        HealthService,
        SignupService,
        ArbitrageMonitorService,
        BalanceMonitorService,
        ExchangeMarketLink,
        ArbitrageOpportunityExchangeMarketLinkService
    ]
})
export class ServicesModule {
    constructor() {
        console.log('[ServicesModule()] Loaded environment: ', environment);
    }
}
