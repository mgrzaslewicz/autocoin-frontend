import {Inject, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExchangeWalletEndpointUrlToken} from '../../environments/endpoint-tokens';
import {ExchangeCurrencyBalancesResponseDto} from "../layout/balances/exchange-wallets/exchange-wallets.component";

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
