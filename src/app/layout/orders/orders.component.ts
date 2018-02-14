import {Component, OnInit, OnDestroy} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {OrdersService} from '../../services/orders.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Order} from '../../models/order';
import {CurrencyPair} from '../../models/currency-pair';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    animations: [routerTransition()]
})
export class OrdersComponent implements OnInit, OnDestroy {

    private ordersSubscription: Subscription;

    private orders: Order[] = [];

    private usersService;

    constructor(private orderService: OrdersService) {
    }

    ngOnInit() {
        this.usersService = Observable.of([]);
        let currencyPairs: CurrencyPair[] = [];
        this.ordersSubscription = this.orderService.getOpenOrders(currencyPairs).subscribe(orders => {
            this.orders = orders;
        });
    }

    ngOnDestroy() {
        this.ordersSubscription.unsubscribe();
    }

    get sortedUsers() {
        return this.usersService.get();
    }

    ordersForUser(user) {
        if (!user) {
            return [];
        }

        return this.orders.filter(order => order.userId == user.id);
    }

}
