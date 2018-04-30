import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ApiService} from './api/api.service';
import {AccountInfoResponseDto} from '../layout/wallets/wallets.component';

@Injectable()
export class ExchangeAccountService {

    private exchangeAccountApiUrl = 'https://orders-api.autocoin-trader.com';
    private accountBalancesUrl = `${this.exchangeAccountApiUrl}/account-balances/`;

    constructor(private api: ApiService) {
    }

    getAccountBalances(clientId: string): Observable<AccountInfoResponseDto> {
        return this.api.get(this.accountBalancesUrl + clientId);
    }

}
