import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {OrdersService} from '../../services/orders.service';
import {ExchangeUsersService} from '../../services/api';
import {ToastService} from '../../services/toast.service';
import {CancelOrderResponseDto, ExchangeUser, Order} from '../../models';
import {OpenOrdersResponseDto} from '../../models/order';
import {AuthService} from '../../services/auth.service';

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
    private lastOrdersRefreshTimeKey = 'lastOrdersRefreshTime';

    constructor(
        private orderService: OrdersService,
        private exchangeUsersService: ExchangeUsersService,
        private toastService: ToastService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon().subscribe(() => {
            this.loadData();
        });
    }

    getLastOrdersRefreshTime(): Date {
        return this.getLocalStorageKeyAsDate(this.lastOrdersRefreshTimeKey);
    }

    private getLocalStorageKeyAsDate(key: string): Date {
        const timeString = localStorage.getItem(key);
        if (timeString != null) {
            const timeMs = Number(timeString);
            const date: Date = new Date();
            date.setTime(timeMs);
            return date;
        } else {
            return null;
        }
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
            localStorage.setItem(this.lastOrdersRefreshTimeKey, new Date().getTime().toString());
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

    private onCancelOrderResponse(cancelOrderResponse: CancelOrderResponseDto) {
        if (cancelOrderResponse.success) {
            this.removeOrderFromOpenOrders(cancelOrderResponse.orderId);
            this.orderViewState.delete(cancelOrderResponse.orderId);
        } else {
            this.toastService.warning(`Could not cancel order ${cancelOrderResponse.orderId}`);
            this.orderViewState[cancelOrderResponse.orderId] = 'enabled';
        }
    }

    cancelOpenOrder(openOrder: Order) {
        this.orderViewState[openOrder.orderId] = 'pending';
        this.orderService.cancelOpenOrder(openOrder).subscribe(cancelOrderResponse => {
                this.onCancelOrderResponse(cancelOrderResponse);
            },
            error => {
                this.orderViewState[openOrder.orderId] = 'enabled';
                this.toastService.warning('Something went wrong. Could not cancel order');
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
            cancelledOrders.orders.forEach(cancelOrderResponse => {
                this.onCancelOrderResponse(cancelOrderResponse);
            });
        });
    }

    private removeOrderFromOpenOrders(orderId: string) {
        this.openOrders.forEach(openOrdersAtExchange => {
            const indexToRemove = openOrdersAtExchange.openOrders.findIndex(it => it.orderId === orderId);
            if (indexToRemove !== -1) {
                openOrdersAtExchange.openOrders.splice(indexToRemove, 1);
            }
        });
    }

}
