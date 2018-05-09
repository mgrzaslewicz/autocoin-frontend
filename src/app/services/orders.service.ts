import {Injectable} from '@angular/core';
import {
    CancelOrderRequestDto,
    CancelOrderResponseDto,
    CancelOrdersRequestDto,
    CancelOrdersResponseDto,
    OpenOrdersRequestDto,
    OpenOrdersResponseDto,
    Order
} from '../models/order';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ApiService} from './api/api.service';
import {WatchCurrencyPairsService} from './watch-currency-pairs.service';
import {CurrencyPair} from '../models';

@Injectable()
export class OrdersService {

    private ordersApiUrl = 'https://orders-api.autocoin-trader.com';
    private openOrdersUrl = `${this.ordersApiUrl}/get-open-orders`;
    private cancelOrderUrl = `${this.ordersApiUrl}/cancel-order`;
    private cancelOrdersUrl = `${this.ordersApiUrl}/cancel-orders`;

    constructor(private api: ApiService, private currencyPairsService: WatchCurrencyPairsService) {
    }

    getOpenOrders(): Observable<OpenOrdersResponseDto[]> {
        const openOrdersRequestDto: OpenOrdersRequestDto = {
            currencyPairs: this.currencyPairsService.all()
        };
        return this.api.post<OpenOrdersResponseDto[]>(this.openOrdersUrl, openOrdersRequestDto);
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
            currencyPair: new CurrencyPair(openOrder.entryCurrencyCode, openOrder.exitCurrencyCode)
        };
    }

}
