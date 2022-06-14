import {Inject, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExchangeWalletEndpointUrlToken} from '../../environments/endpoint-tokens';

export interface ExchangeCurrencyBalancesResponseDto {
    exchangeUserId: string;
    exchangeBalances: ExchangeBalanceDto[];
}

export interface CurrencyBalanceDto {
    currencyCode: string;
    available: number;
    frozen: number;
    total: number;
}

export interface ExchangeBalanceDto {
    exchangeName: string;
    currencyBalances: CurrencyBalanceDto[];
    errorMessage?: string;
}

@Injectable()
export class ExchangeWalletService {

    private walletCurrencyBalancesUrl = `${this.exchangeWalletEndpointUrl}/wallet/currency-balances/`;

    constructor(
        @Inject(ExchangeWalletEndpointUrlToken) private exchangeWalletEndpointUrl,
        private http: HttpClient
    ) {
    }

    getAccountBalances(clientId: string): Observable<ExchangeCurrencyBalancesResponseDto> {
        return this.http.get<ExchangeCurrencyBalancesResponseDto>(this.walletCurrencyBalancesUrl + clientId);
    }

}
