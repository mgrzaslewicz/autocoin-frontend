import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UsersService } from '../../services/users.service';
import { OrdersService } from '../../services/orders.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models/user';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [routerTransition()]
})
export class OrdersComponent implements OnInit, OnDestroy {

  private ordersSubscription: Subscription;

  private orders = [];

  constructor(
    private usersService: UsersService,
    private orderService: OrdersService
  ) { }

  ngOnInit() {
    this.ordersSubscription = this.orderService.get().subscribe(orders => {
      this.orders = orders;
    });
  }

  ngOnDestroy() {
    this.ordersSubscription.unsubscribe();
  }

  get sortedUsers() {
    return this.usersService.get();
  }

  ordersForUser(user: User) {
    if (! user) {
      return [];
    }

    return this.orders.filter(order => order.userId == user.id);
  }

}
