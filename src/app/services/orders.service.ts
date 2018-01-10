import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Order } from '../models/order';
import * as _ from 'underscore';

@Injectable()
export class OrdersService {

  constructor() { }

  get() {
    return Observable.of([
      {
        userId: '5b6ed6161870659cf7ed2f83b480bace',
        exchangeName: 'bittrex',
        orderId: '3467871236',
        entryCurrencyCode: 'ETH',
        exitCurrencyCode: 'BTC',
        orderType: 'sell',
        orderStatus: 'open',
        orderedAmount: 45.3534,
        filledAmount: null,
        price: 0.09074390,
        timestamp: 1515603683
      },
      {
        userId: '5b6ed6161870659cf7ed2f83b480bace',
        exchangeName: 'binance',
        orderId: '3248758743',
        entryCurrencyCode: 'XRP',
        exitCurrencyCode: 'BTC',
        orderType: 'sell',
        orderStatus: 'open',
        orderedAmount: 6453.35,
        filledAmount: null,
        price: 0.00013722,
        timestamp: 1514962868
      },
      {
        userId: 'dcfc0a8380b711902655ebbd35a24224',
        exchangeName: 'binance',
        orderId: '3984722437',
        entryCurrencyCode: 'ETH',
        exitCurrencyCode: 'BTC',
        orderType: 'buy',
        orderStatus: 'open',
        orderedAmount: 1900.83,
        filledAmount: null,
        price: 0.08443000,
        timestamp: 1514962868
      },
    ]).map(list => {
      return _(list).map(order => _.extend(new Order, order));
    });
  }

}
