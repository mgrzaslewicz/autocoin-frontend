import {Injectable} from '@angular/core';
import {CancelOrderRequestDto, OpenOrdersRequestDto, Order} from '../models/order';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ApiService} from './api/api.service';
import {WatchCurrencyPairsService} from './watch-currency-pairs.service';

@Injectable()
export class OrdersService {

    private ordersApiUrl = 'https://orders-api.autocoin-trader.com';
    private openOrdersUrl = `${this.ordersApiUrl}/get-open-orders`;
    private cancelOrderUrl = `${this.ordersApiUrl}/cancel-order`;
    private cancelOrdersUrl = `${this.ordersApiUrl}/cancel-orders`;

    constructor(private api: ApiService, private currencyPairsService: WatchCurrencyPairsService) {
    }

    getOpenOrders(): Observable<Order[]> {
        const openOrdersRequestDto: OpenOrdersRequestDto = {
            currencyPairs: this.currencyPairsService.all()
        };
        console.log('Requesting open orders');
        return this.api.post(this.openOrdersUrl, openOrdersRequestDto)
            .map(response => Object.values(response).map(data => this.newOrder(data)));
    }

    cancelOpenOrder(openOrder: Order) {
        const cancelOrderRequestDto: CancelOrderRequestDto = {
            clientId: openOrder.clientId,
            exchangeId: openOrder.exchangeId,
            orderId: openOrder.orderId,
            currencyPair: openOrder.currencyPair()
        };
        console.log('Requesting cancel order');
        return this.api.post(this.cancelOrderUrl, cancelOrderRequestDto);
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
