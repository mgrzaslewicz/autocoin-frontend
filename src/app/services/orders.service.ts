import {Inject, Injectable} from '@angular/core';
import {
    CancelOrderRequestDto,
    CancelOrderResponseDto,
    CancelOrdersRequestDto,
    CancelOrdersResponseDto,
    OpenOrdersResponseDto,
    Order
} from '../models/order';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {CurrencyPair} from '../models';
import {HttpClient} from '@angular/common/http';
import {OrdersEndpointUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class OrdersService {

    private openOrdersUrl = `${this.ordersEndpointUrl}/open-orders`;
    private cancelOrderUrl = `${this.ordersEndpointUrl}/cancel-order`;
    private cancelOrdersUrl = `${this.ordersEndpointUrl}/cancel-orders`;

    constructor(
        @Inject(OrdersEndpointUrlToken) private ordersEndpointUrl,
        private http: HttpClient
    ) {
    }

    getOpenOrders(): Observable<OpenOrdersResponseDto[]> {
        return this.http.get<OpenOrdersResponseDto[]>(this.openOrdersUrl);
    }

    cancelOpenOrder(openOrder: Order): Observable<CancelOrderResponseDto> {
        const cancelOrderRequestDto = this.prepareCancelOrderRequestDto(openOrder);
        return this.http.post(this.cancelOrderUrl, cancelOrderRequestDto) as Observable<CancelOrderResponseDto>;
    }

    cancelOpenOrders(openOrders: Order[]): Observable<CancelOrdersResponseDto> {
        const orders = openOrders.map(openOrder => {
            return this.prepareCancelOrderRequestDto(openOrder);
        });

        const cancelOrdersRequestDto: CancelOrdersRequestDto = {orders};
        return this.http.post<CancelOrdersResponseDto>(this.cancelOrdersUrl, cancelOrdersRequestDto);
    }

    private prepareCancelOrderRequestDto(openOrder: Order): CancelOrderRequestDto {
        return {
            exchangeUserId: openOrder.exchangeUserId,
            orderType: openOrder.orderType,
            exchangeId: openOrder.exchangeId,
            orderId: openOrder.orderId,
            currencyPair: new CurrencyPair(openOrder.baseCurrencyCode, openOrder.counterCurrencyCode)
        };
    }

}
