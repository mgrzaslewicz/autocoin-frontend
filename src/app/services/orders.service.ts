import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OpenOrdersRequestDto, Order} from '../models/order';
import {Observable} from 'rxjs/Observable';
import {CurrencyPair} from '../models/currency-pair';

@Injectable()
export class OrdersService {

    private ordersApiUrl = 'https://orders-api.autocoin-trader.com';

    constructor(private http: HttpClient) {
    }

    getOpenOrders(currencyPairs: CurrencyPair[]): Observable<Order[]> {
        let openOrdersRequestDto: OpenOrdersRequestDto = {
          currencyPairs = currencyPairs;
        }
        return this.http.post<Order[]>(`${this.ordersApiUrl}/client/open-orders`, openOrdersRequestDto)
            .map(result => {
                result.json().results.map(item => {
                    return new Order(
                        item.clientId,
                        item.exchangeName,
                        item.orderId,
                        item.entryCurrencyCode,
                        item.exitCurrencyCode,
                        item.orderType,
                        item.orderStatus,
                        item.orderedAmount,
                        item.filledAmount,
                        item.price,
                        item.timestamp
                    );
                });
            });
    }

}
