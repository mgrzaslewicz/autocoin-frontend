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
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {WatchCurrencyPairsService} from './watch-currency-pairs.service';
import {CurrencyPair} from '../models';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OrdersService {

    private ordersApiUrl = 'https://orders-api.autocoin-trader.com';
    private openOrdersUrl = `${this.ordersApiUrl}/get-open-orders`;
    private cancelOrderUrl = `${this.ordersApiUrl}/cancel-order`;
    private cancelOrdersUrl = `${this.ordersApiUrl}/cancel-orders`;

    constructor(private http: HttpClient, private currencyPairsService: WatchCurrencyPairsService) {
    }

    getOpenOrders(): Observable<OpenOrdersResponseDto[]> {
        const openOrdersRequestDto: OpenOrdersRequestDto = {
            currencyPairs: this.currencyPairsService.all()
        };
        return this.http.post<OpenOrdersResponseDto[]>(this.openOrdersUrl, openOrdersRequestDto);
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
