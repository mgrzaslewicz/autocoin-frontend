import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {ExchangeMediatorUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class PriceService {

    constructor(
        @Inject(ExchangeMediatorUrlToken) private exchangeMediatorUrl,
        private http: HttpClient
    ) {
    }

    getPrices(currencyCode: string[]): Observable<CurrencyPriceDto[]> {
        return this.http.get<CurrencyPriceDto[]>(`${this.exchangeMediatorUrl}/prices`, {
            params: {
                currencyCodes: currencyCode.join(',')
            }
        });
    }
}

export interface CurrencyPriceDto {
    baseCurrency: string;
    price: number;
    counterCurrency: string;
}
