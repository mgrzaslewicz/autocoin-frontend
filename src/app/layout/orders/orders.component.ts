import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, Observable} from 'rxjs';
import {OrdersService} from '../../services/orders.service';
import {ClientsService} from '../../services/api';
import {ToastService} from '../../services/toast.service';
import {Order, Client} from '../../models';
import {OpenOrdersResponseDto} from '../../models/order';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

    private openOrdersSubscription: Subscription;

    openOrders: OpenOrdersResponseDto[] = [];
    clients: Client[] = [];
    orderViewState: Map<string, string> = new Map();
    pending: boolean;

    selectedOrders: Order[] = [];

    constructor(
        private orderService: OrdersService,
        private clientsService: ClientsService,
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

        this.openOrdersSubscription = Observable.forkJoin(
            this.orderService.getOpenOrders(),
            this.clientsService.getClients()
        ).subscribe(([ordersResponseDto, clients]) => {
            this.openOrders = ordersResponseDto;
            this.openOrders.forEach(openOrdersAtExchange => {
                openOrdersAtExchange.openOrders.forEach(openOrder => {
                    this.orderViewState[openOrder.orderId] = 'enabled';
                });
            });
            this.clients = clients;
            this.pending = false;
        }, error => {
            this.pending = false;
            this.openOrders = [];
            this.clients = [];

            this.toastService.danger('Sorry, something went wrong. Could not get open orders');
        });
    }

    getFailedExchangesForClient(client: Client): string[] {
        return Array.from(
            this.openOrders.filter(ordersAtExchange => ordersAtExchange.clientId === client.id && ordersAtExchange.errorMessage != null)
                .map(ordersAtExchange => ordersAtExchange.exchangeName + ': ' + ordersAtExchange.errorMessage)
        );
    }

    ngOnDestroy() {
        this.openOrdersSubscription.unsubscribe();
    }

    ordersForClient(client: Client): Order[] {
        if (!client) {
            console.log(`No client`);
            return [];
        }
        const openOrdersOfClient: Order[][] = Array.from(
            this.openOrders.filter(ordersAtExchange => ordersAtExchange.clientId === client.id && ordersAtExchange.openOrders.length > 0)
                .map(ordersAtExchange => ordersAtExchange.openOrders)
                .values()
        );
        return [].concat.apply([], openOrdersOfClient);
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
