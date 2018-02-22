import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { ClientsService } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { Order, Client } from '../../models';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

    private openOrdersSubscription: Subscription;

    openOrders: Order[] = [];
    clients: Client[] = [];

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

        this.openOrdersSubscription = Observable.forkJoin(
            this.orderService.getOpenOrders(),
            this.clientsService.getClients()
        ).subscribe(([orders, clients]) => {
            this.openOrders = orders;
            this.openOrders.forEach(order => order.viewState = 'enabled');

            this.clients = clients;

            this.pending = false;
        }, error => {
            this.pending = false;
            this.openOrders = [];
            this.clients = [];

            this.toastService.danger('Sorry, something went wrong. Could not get open orders');
        });
    }

    ngOnDestroy() {
        this.openOrdersSubscription.unsubscribe();
    }

    ordersForClient(client: Client) {
        if (!client) {
            console.log(`No client`);
            return [];
        }

        return this.openOrders.filter(order => order.clientId === client.id);
    }

    cancelOpenOrder(openOrder: Order) {
        openOrder.viewState = 'pending';

        this.orderService.cancelOpenOrder(openOrder).subscribe(cancelledOrder => {
            let order = this.openOrders.find(order => order.orderId === cancelledOrder.orderId);
            order.viewState = 'disabled';
        });
    }

    onSelectOrder(checked, order) {
        if (checked) {
            this.selectedOrders.push(order);
        } else {
            let index = this.selectedOrders.indexOf(order);
            this.selectedOrders.splice(index, 1);
        }
    }

    cancelSeletedOrders() {
        this.selectedOrders.forEach(order => order.viewState = 'pending');

        this.orderService.cancelOpenOrders(this.selectedOrders).subscribe(cancelledOrders => {
            cancelledOrders.orders.forEach(cancelledOrder => {
                let order = this.openOrders.find(order => order.orderId === cancelledOrder.orderId);
                order.viewState = 'disabled';
            });
        });
    }

}
