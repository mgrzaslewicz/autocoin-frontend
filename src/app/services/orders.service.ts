import {Injectable} from '@angular/core';
import {
    CancelOrderRequestDto,
    OpenOrdersRequestDto,
    CancelOrderResponseDto,
    Order,
    CancelOrdersRequestDto,
    CancelOrdersResponseDto
} from '../models/order';
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

        return this.api.post(this.openOrdersUrl, openOrdersRequestDto)
            .map(response => Object.values(response).map(data => this.newOrder(data)));
    }

    cancelOpenOrder(openOrder: Order) {
        const cancelOrderRequestDto = this.prepareCancelOrderRequestDto(openOrder);

        return this.api.post(this.cancelOrderUrl, cancelOrderRequestDto) as Observable<CancelOrderResponseDto>;
    }

    cancelOpenOrders(openOrders: Order[]) {
        const orders = openOrders.map(openOrder => {
            return this.prepareCancelOrderRequestDto(openOrder);
        });

        const cancelOrdersRequestDto: CancelOrdersRequestDto = {orders};

        return this.api.post(this.cancelOrdersUrl, cancelOrdersRequestDto) as Observable<CancelOrdersResponseDto>;
    }

    private prepareCancelOrderRequestDto(openOrder: Order): CancelOrderRequestDto {
        return {
            clientId: openOrder.clientId,
            orderType: openOrder.orderType,
            exchangeId: openOrder.exchangeId,
            orderId: openOrder.orderId,
            currencyPair: openOrder.currencyPair()
        };
    }

    private newOrder(data): Order {
        return new Order(
            data.clientId,
            data.exchangeId,
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
