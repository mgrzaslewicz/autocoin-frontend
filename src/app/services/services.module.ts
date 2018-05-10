import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarketsService} from './markets.service';
import {ApiService} from './api/api.service';
import {HttpClientModule} from '@angular/common/http';
import {ToastService} from './toast.service';
import {WatchCurrencyPairsService} from './watch-currency-pairs.service';
import {OrdersService} from './orders.service';
import {AuthService} from './auth.service';
import {ClientsService} from './api/clients/clients.service';
import {ExchangeAccountService} from './exchange-account.service';
import {PriceService} from './price.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    providers: [
        AuthService,
        ApiService,
        ClientsService,
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
