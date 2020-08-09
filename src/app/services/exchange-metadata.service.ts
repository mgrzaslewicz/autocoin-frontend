import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {ExchangeMetadataEndpointUrlToken, PricesEndpointUrlToken} from '../../environments/endpoint-tokens';
import {CurrencyPair, stringToCurrencyPair} from "../models";

@Injectable()
export class ExchangeMetadataService {

    constructor(
        @Inject(ExchangeMetadataEndpointUrlToken) private exchangeMetadataEndpointUrl,
        private http: HttpClient
    ) {
    }

    getCurrencyPairs(exchangeName: string): Observable<CurrencyPair[]> {
        return this.http.get<ExchangeMetadataDto>(`${this.exchangeMetadataEndpointUrl}/${exchangeName}`)
            .map(response => {
                const keys = Object.keys(response.currencyPairMetadata);
                return keys
                    .map(it => {
                        return stringToCurrencyPair(it);
                    });
            });
    }
}

/**
 * Just keys needed to provide supported currencies and currency pairs for given exchange.
 * No need to provide the details yet
 */
export interface ExchangeMetadataDto {
    currencyPairMetadata: Map<string, object>;
    currencyMetadata: Map<string, object>;
}
