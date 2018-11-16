import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
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
        return this.http.get<CurrencyPrice>(`${this.coinMarketCapApiUrl}?convert=${currencyCode}&limit=1`)
            .map(item => this.toCurrencyPrice(item, currencyCode));
    }

    private toCurrencyPrice(item: any, currencyCode: string): CurrencyPrice {
        return {
            currencyCode: currencyCode,
            priceInBtc: item.data['1'].quotes[currencyCode].price,
            btcUsdPrice: item.data['1'].quotes['USD'].price
        };
    }

}
