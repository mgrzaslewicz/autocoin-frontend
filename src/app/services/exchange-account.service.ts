import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AccountInfoResponseDto} from '../layout/wallets/wallets.component';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ExchangeAccountService {

    private exchangeAccountApiUrl = 'https://orders-api.autocoin-trader.com';
    private accountBalancesUrl = `${this.exchangeAccountApiUrl}/account-balances/`;

    constructor(private http: HttpClient) {
    }

    getAccountBalances(clientId: string): Observable<AccountInfoResponseDto> {
        return this.http.get<AccountInfoResponseDto>(this.accountBalancesUrl + clientId);
    }

}
