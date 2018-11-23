import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {OrdersService} from '../../services/orders.service';
import {ExchangeUsersService} from '../../services/api';
import {ToastService} from '../../services/toast.service';
import {ExchangeUser, Order} from '../../models';
import {OpenOrdersResponseDto} from '../../models/order';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

    private openOrdersSubscription: Subscription;

    openOrders: OpenOrdersResponseDto[] = [];
    exchangeUsers: ExchangeUser[] = [];
    orderViewState: Map<string, string> = new Map();
    pending: boolean;

    selectedOrders: Order[] = [];

    constructor(
        private orderService: OrdersService,
        private exchangeUsersService: ExchangeUsersService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.pending = true;
        this.selectedOrders = [];
        this.orderViewState.clear();

        this.openOrdersSubscription = forkJoin(
            this.orderService.getOpenOrders(),
            this.exchangeUsersService.getExchangeUsers()
        ).subscribe(([ordersResponseDto, exchangeUsers]) => {
            this.openOrders = ordersResponseDto;
            this.openOrders.forEach(openOrdersAtExchange => {
                openOrdersAtExchange.openOrders.forEach(openOrder => {
                    this.orderViewState[openOrder.orderId] = 'enabled';
                });
            });
            this.exchangeUsers = exchangeUsers;
            this.pending = false;
        }, error => {
            this.pending = false;
            this.openOrders = [];
            this.exchangeUsers = [];

            this.toastService.danger('Sorry, something went wrong. Could not get open orders');
        });
    }

    getFailedExchangesForExchangeUser(exchangeUser: ExchangeUser): string[] {
        return Array.from(
            this.openOrders.filter(ordersAtExchange =>
                ordersAtExchange.exchangeUserId === exchangeUser.id
                && ordersAtExchange.errorMessage != null
            ).map(ordersAtExchange =>
                ordersAtExchange.exchangeName + ': ' + ordersAtExchange.errorMessage
            )
        );
    }

    ngOnDestroy() {
        this.openOrdersSubscription.unsubscribe();
    }

    ordersForExchangeUser(exchangeUser: ExchangeUser): Order[] {
        if (!exchangeUser) {
            console.log(`No exchange user`);
            return [];
        }
        const openOrdersOfExchangeUser: Order[][] = Array.from(
            this.openOrders.filter(ordersAtExchange =>
                ordersAtExchange.exchangeUserId === exchangeUser.id &&
                ordersAtExchange.openOrders.length > 0
            ).map(ordersAtExchange => ordersAtExchange.openOrders)
                .values()
        );
        return [].concat.apply([], openOrdersOfExchangeUser);
    }

    cancelOpenOrder(openOrder: Order) {
        this.orderViewState[openOrder.orderId] = 'enabled';
        this.orderService.cancelOpenOrder(openOrder).subscribe(canceledOrder => {
            this.orderViewState[canceledOrder.orderId] = 'disabled';
        });
    }

    onSelectOrder(checked, order) {
        if (checked) {
            this.selectedOrders.push(order);
        } else {
            const index = this.selectedOrders.indexOf(order);
            this.selectedOrders.splice(index, 1);
        }
    }

    getOrderCurrencyPairSymbol(order: Order): string {
        return `${order.baseCurrencyCode}/${order.counterCurrencyCode}`;
    }

    cancelSelectedOrders() {
        this.selectedOrders.forEach(order => this.orderViewState[order.orderId] = 'pending');

        this.orderService.cancelOpenOrders(this.selectedOrders).subscribe(cancelledOrders => {
            cancelledOrders.orders.forEach(canceledOrder => {
                this.orderViewState[canceledOrder.orderId] = 'disabled';
            });
        });
    }

}
