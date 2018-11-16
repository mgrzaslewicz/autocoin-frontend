import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarketsService} from './markets.service';
import {HttpClientModule} from '@angular/common/http';
import {ToastService} from './toast.service';
import {WatchCurrencyPairsService} from './watch-currency-pairs.service';
import {OrdersService} from './orders.service';
import {AuthService} from './auth.service';
import {ExchangeAccountService} from './exchange-account.service';
import {PriceService} from './price.service';
import {FeatureToggleToken, LocalStorageFeatureToggle} from './feature.toogle.service';
import {ExchangeUsersService} from './api';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    providers: [
        LocalStorageFeatureToggle,
        {provide: FeatureToggleToken, useClass: LocalStorageFeatureToggle},
        AuthService,
        ExchangeUsersService,
        ExchangeAccountService,
        PriceService,

        MarketsService,
        ToastService,
        WatchCurrencyPairsService,
        OrdersService
    ]
})
export class ServicesModule {
}
