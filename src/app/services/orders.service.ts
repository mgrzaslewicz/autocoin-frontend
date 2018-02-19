import {Injectable} from '@angular/core';
import {OpenOrdersRequestDto, Order} from '../models/order';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CurrencyPair} from '../models/currency-pair';
import {ApiService} from './api/api.service';

@Injectable()
export class OrdersService {

    private ordersApiUrl = 'https://orders-api.autocoin-trader.com';
    private openOrdersUrl = `${this.ordersApiUrl}/clients/open-orders`;

    constructor(private api: ApiService) {
    }

    getOpenOrders(currencyPairs: CurrencyPair[]): Observable<Order[]> {
        const openOrdersRequestDto: OpenOrdersRequestDto = {
            currencyPairs: currencyPairs
        };
        console.log('Requesting open orders');
        return this.api.post(this.openOrdersUrl, openOrdersRequestDto)
            .map(response => Object.values(response).map(data => this.newOrder(data)));
    }

    private newOrder(data): Order {
        return new Order(
            data.clientId,
            data.exchangeName,
            data.orderId,
            data.entryCurrencyCode,
            data.exitCurrencyCode,
            data.orderType,
            data.orderStatus,
            data.orderedAmount,
            data.filledAmount,
            data.price,
            data.timestamp
        );
    }

}
