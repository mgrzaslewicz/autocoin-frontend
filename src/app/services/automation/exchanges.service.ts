import {Injectable} from '@angular/core';
import {Exchange} from '../../models';
import {ExchangeUsersService} from '../api';
import {Observable} from 'rxjs';
import * as _ from 'underscore';

@Injectable()
export class ExchangesService {

    constructor(
        private clientsService: ExchangeUsersService
    ) {
    }

    public getExchanges(): Observable<Exchange[]> {
        return Observable.forkJoin([
            this.clientsService.getExchanges(),
            this.clientsService.getExchangesKeys()
        ]).map(([exchanges, exchangesKeys]) => {

            exchangesKeys = _.pluck(exchangesKeys, 'exchangeId');
            return exchanges.filter((exchange: Exchange) => {
                return exchangesKeys.indexOf(exchange.id) !== -1;
            }).sort((a, b) => a.name.localeCompare(b.name));
        });
    }

}
