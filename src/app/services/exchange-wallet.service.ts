import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {ExchangeCurrencyBalancesResponseDto} from '../layout/wallets/wallets.component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ExchangeWalletService {

    private exchangeWalletApiUrl = 'https://orders-api.autocoin-trader.com';
    private walletCurrencyBalancesUrl = `${this.exchangeWalletApiUrl}/wallet/currency-balances/`;

    constructor(private http: HttpClient) {
    }

    getAccountBalances(clientId: string): Observable<ExchangeCurrencyBalancesResponseDto> {
        return this.http.get<ExchangeCurrencyBalancesResponseDto>(this.walletCurrencyBalancesUrl + clientId);
    }

}
