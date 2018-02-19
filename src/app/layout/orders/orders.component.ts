import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {OrdersService} from '../../services/orders.service';
import {Subscription} from 'rxjs/Subscription';
import {Order} from '../../models/order';
import {ClientsService} from '../../services/api';
import {Client} from '../../models';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    animations: [routerTransition()]
})
export class OrdersComponent implements OnInit, OnDestroy {

    private ordersSubscription: Subscription;
    private clientsSubscription: Subscription;
    private openOrders: Order[] = [];
    private clients: Client[] = [];

    constructor(private orderService: OrdersService, private clientsService: ClientsService) {
    }

    ngOnInit() {
        this.ordersSubscription = this.orderService.getOpenOrders()
            .subscribe(orders => {
                this.openOrders = orders;
            });
        this.clientsSubscription = this.clientsService.getClients()
            .subscribe(clients => {
                this.clients = clients;
            });
    }

    ngOnDestroy() {
        this.ordersSubscription.unsubscribe();
    }

    ordersForClient(client: Client) {
        if (!client) {
            console.log(`No client`);
            return [];
        }
        console.log(`Filtering ${this.openOrders.length} open orders for client with id ${client.id}`);
        return this.openOrders.filter(order => order.clientId === client.id);
    }

    cancelOpenOrder(openOrder: Order) {
        this.orderService.cancelOpenOrder(openOrder);
    }

}
