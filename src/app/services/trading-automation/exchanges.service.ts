import {Injectable} from '@angular/core';
import {Exchange} from '../../models';
import {ExchangeUsersService} from '../api';
import {forkJoin, Observable} from 'rxjs';
import * as _ from 'underscore';

@Injectable()
export class ExchangesService {

    constructor(
        private exchangeUsersService: ExchangeUsersService
    ) {
    }

    public getExchanges(): Observable<Exchange[]> {
        return forkJoin([
            this.exchangeUsersService.getExchanges(),
            this.exchangeUsersService.getExchangesKeysExistence()
        ]).map(([exchanges, exchangesKeys]) => {
            const exchangeIdThatUserHave = _.pluck(exchangesKeys, 'exchangeId');
            return exchanges.filter((exchange: Exchange) => {
                return exchangeIdThatUserHave.indexOf(exchange.id) !== -1;
            }).sort((a, b) => a.name.localeCompare(b.name));
        });
    }

}
