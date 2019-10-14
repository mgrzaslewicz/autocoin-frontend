import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarketsService} from './markets.service';
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
    ChangePasswordEndpointUrlToken,
    ExchangeUsersEndpointUrlToken,
    ExchangeWalletEndpointUrlToken, HealthEndpointUrlToken,
    OauthEndpointUrlToken,
    OrdersEndpointUrlToken,
    PricesEndpointUrlToken, SignupEndpointUrlToken,
    StrategiesEndpointUrlToken,
    TwoFactorAuthenticationEndpointUrlToken
} from '../../environments/endpoint-tokens';
import {environment} from '../../environments/environment';
import {SignupService} from './signup.service';

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
        {provide: PricesEndpointUrlToken, useValue: environment.pricesEndpointUrl},
        {provide: StrategiesEndpointUrlToken, useValue: environment.strategiesEndpointUrl},
        {provide: HealthEndpointUrlToken, useValue: environment.healthEndpointUrl},
        {provide: SignupEndpointUrlToken, useValue: environment.signupEndpointUrl},
        {provide: TwoFactorAuthenticationEndpointUrlToken, useValue: environment.twoFactorAuthenticationEndpointUrl},
        AuthService,
        UserAccountService,
        ExchangeUsersService,
        ExchangeWalletService,
        ExchangeKeyCapabilityService,
        PriceService,
        MarketsService,
        ToastService,
        OrdersService,
        HealthService,
        SignupService
    ]
})
export class ServicesModule {
}
