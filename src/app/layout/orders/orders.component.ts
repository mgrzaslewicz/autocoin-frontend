import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrdersService} from '../../services/orders.service';
import {Subscription, Observable} from 'rxjs';
import {Order} from '../../models/order';
import {ClientsService} from '../../services/api';
import {Client} from '../../models';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

    private openOrdersSubsciprion: Subscription;
    
    openOrders: Order[] = [];
    clients: Client[] = [];

    pending: boolean;

    constructor(private orderService: OrdersService, private clientsService: ClientsService) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.pending = true;

        this.openOrdersSubsciprion = Observable.forkJoin(
            this.orderService.getOpenOrders(),
            this.clientsService.getClients()
        ).subscribe(([orders, clients]) => {
            this.openOrders = orders;
            this.openOrders.forEach(order => order.viewState = 'enabled');
            
            this.clients = clients;

            this.pending = false;
        });
    }

    ngOnDestroy() {
        this.openOrdersSubsciprion.unsubscribe();
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
            let order = this.openOrders.find(order => order.orderId == cancelledOrder.orderId);
            order.viewState = 'disabled';
        });
    }

}
