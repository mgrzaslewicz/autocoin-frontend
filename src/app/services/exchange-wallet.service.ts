import {Inject, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {ExchangeCurrencyBalancesResponseDto} from '../layout/wallets/wallets.component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExchangeWalletEndpointUrlToken} from '../../environments/endpoint-tokens';

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
