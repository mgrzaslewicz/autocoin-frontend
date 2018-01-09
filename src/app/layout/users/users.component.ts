import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { MarketsService } from '../../services/markets.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [routerTransition()]
})
export class UsersComponent implements OnInit {

  private users: Observable<User[]>;

  private markets = [];

  constructor(
    private usersService: UsersService,
    private marketService: MarketsService
  ) { }

  ngOnInit() {
    this.markets = this.marketService.get();
    this.users = this.usersService.get();
  }

  hasExchangeKeys(user: User, market) {
    let exchangeKeys = user.getExchangeKeysForMarket(market);

    return exchangeKeys.publicKey && exchangeKeys.secretKey;    
  }

  // destroy(user: User) {
  //   console.log(this.userDelete); 
  // }

}
