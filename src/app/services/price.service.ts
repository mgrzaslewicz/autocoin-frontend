import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';

export interface CurrencyPrice {
    currencyCode: string;
    price: number;
    unit: string;
}

@Injectable()
export class PriceService {

    private priceApiUrl = 'https://orders-api.autocoin-trader.com';

    constructor(private http: HttpClient) {
    }

    getPrices(currencyCode: string[]): Observable<CurrencyPrice> {
        return this.http.get<CurrencyPriceDto[]>(this.priceApiUrl, {
            params: {
                symbols: currencyCode.join(',')
            }
        })
            .flatMap(ccyPriceDto => ccyPriceDto)
            .map(ccyPriceDto => {
                return {
                    currencyCode: ccyPriceDto.currency,
                    price: ccyPriceDto.price,
                    unit: ccyPriceDto.unitCurrency
                };
            });
    }
}

class CurrencyPriceDto {
    currency: string;
    price: number;
    unitCurrency: string;
}
