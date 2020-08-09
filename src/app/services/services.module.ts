import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ToastService} from './toast.service';
import {OrdersService} from './orders.service';
import {HealthService} from './health.service';
import {AuthService} from './auth.service';
import {PriceService} from './price.service';
import {FeatureToggleToken, LocalStorageFeatureToggle} from './feature.toogle.service';
import {ExchangeUsersService} from './api';
import {UserAccountService} from './user-account.service';
import {ExchangeKeyCapabilityService} from './exchange-key-capability.service';
import {ExchangeWalletService} from './exchange-wallet.service';
import {
    ArbitrageMonitorEndpointUrlToken,
    ChangePasswordEndpointUrlToken,
    ExchangeKeysCapabilityEndpointUrlToken, ExchangeMetadataEndpointUrlToken,
    ExchangeUsersEndpointUrlToken,
    ExchangeWalletEndpointUrlToken,
    HealthEndpointUrlToken,
    OauthEndpointUrlToken,
    OrdersEndpointUrlToken,
    PricesEndpointUrlToken,
    SignupEndpointUrlToken,
    StrategiesEndpointUrlToken,
    TwoFactorAuthenticationEndpointUrlToken
} from '../../environments/endpoint-tokens';
import {environment} from '../../environments/environment';
import {SignupService} from './signup.service';
import {ArbitrageMonitorService} from './arbitrage-monitor.service';
import {ExchangeNamesSupportedForGettingPublicMarketData, ExchangeNamesSupportedForTradingToken} from '../../environments/environment.default';
import {ExchangeMarketLink} from './exchange-market-link.service';
import {ExchangeMetadataService} from "./exchange-metadata.service";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    providers: [
        LocalStorageFeatureToggle,
        {provide: FeatureToggleToken, useClass: LocalStorageFeatureToggle},
        {provide: OauthEndpointUrlToken, useValue: environment.oauthEndpointUrl},
        {provide: ExchangeUsersEndpointUrlToken, useValue: environment.exchangeUsersApiUrl},
        {provide: ChangePasswordEndpointUrlToken, useValue: environment.changePasswordEndpointUrl},
        {provide: ExchangeWalletEndpointUrlToken, useValue: environment.exchangeWalletEndpointUrl},
        {provide: OrdersEndpointUrlToken, useValue: environment.ordersEndpointUrl},
        {provide: ExchangeKeysCapabilityEndpointUrlToken, useValue: environment.exchangeKeysCapabilityEndpointUrl},
        {provide: PricesEndpointUrlToken, useValue: environment.pricesEndpointUrl},
        {provide: ExchangeMetadataEndpointUrlToken, useValue: environment.exchangeMetadataEndpointUrlToken},
        {provide: StrategiesEndpointUrlToken, useValue: environment.strategiesEndpointUrl},
        {provide: HealthEndpointUrlToken, useValue: environment.healthEndpointUrl},
        {provide: SignupEndpointUrlToken, useValue: environment.signupEndpointUrl},
        {provide: TwoFactorAuthenticationEndpointUrlToken, useValue: environment.twoFactorAuthenticationEndpointUrl},
        {provide: ExchangeNamesSupportedForTradingToken, useValue: environment.exchangeNamesSupportedForTrading},
        {provide: ExchangeNamesSupportedForGettingPublicMarketData, useValue: environment.exchangeNamesSupportedForGettingPublicMarketData},
        {provide: ArbitrageMonitorEndpointUrlToken, useValue: environment.arbitrageMonitorEndpointUrl},
        AuthService,
        UserAccountService,
        ExchangeUsersService,
        ExchangeWalletService,
        ExchangeKeyCapabilityService,
        PriceService,
        ExchangeMetadataService,
        ToastService,
        OrdersService,
        HealthService,
        SignupService,
        ArbitrageMonitorService,
        ExchangeMarketLink
    ]
})
export class ServicesModule {
}
