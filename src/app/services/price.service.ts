import {Injectable} from '@angular/core';
import {
    CancelOrderRequestDto,
    CancelOrderResponseDto,
    CancelOrdersRequestDto,
    CancelOrdersResponseDto,
    OpenOrdersRequestDto,
    OpenOrdersResponseDto,
    Order
} from '../models/order';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ApiService} from './api/api.service';
import {WatchCurrencyPairsService} from './watch-currency-pairs.service';
import {CurrencyPair} from '../models';
import {HttpClient} from '@angular/common/http';

export interface CurrencyPrice {
    currencyCode: string;
    priceInBtc: number;
    btcUsdPrice: number;
}

@Injectable()
export class PriceService {

    private coinMarketCapApiUrl = 'https://api.coinmarketcap.com/v2/ticker/';

    constructor(private http: HttpClient) {
    }

    getPrice(currencyCode: string): Observable<CurrencyPrice> {
        return this.http.get(`${this.coinMarketCapApiUrl}?convert=${currencyCode}&limit=1`)
            .map(item => this.toCurrencyPrice(item, currencyCode)) as Observable<CurrencyPrice>;
    }

    private toCurrencyPrice(item: any, currencyCode: string): CurrencyPrice {
        return {
            currencyCode: currencyCode,
            priceInBtc: item.data['1'].quotes[currencyCode].price,
            btcUsdPrice: item.data['1'].quotes['USD'].price
        };
    }

}
