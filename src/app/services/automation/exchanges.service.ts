import { Injectable } from '@angular/core';
import { Exchange } from '../../models';
import { ClientsService } from '../api';
import { Observable } from 'rxjs';
import _ = require('underscore');

@Injectable()
export class ExchangesService {

  constructor(
    private clientsService: ClientsService
  ) { }

  public getExchanges() : Observable<Exchange[]> {
    return Observable.forkJoin([
      this.clientsService.getExchanges(),
      this.clientsService.getExchangesKeys()
    ]).map(([exchanges, exchangesKeys]) => {

      exchangesKeys = _.pluck(exchangesKeys, 'exchangeId');
      
      return exchanges.filter((exchange: Exchange) => {
        return exchangesKeys.indexOf(exchange.id) !== -1;
      });
    });
  }

}
