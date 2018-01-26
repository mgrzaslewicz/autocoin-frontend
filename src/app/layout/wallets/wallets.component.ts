import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
  animations: [routerTransition()]
})
export class WalletsComponent implements OnInit {

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit() {
  }

  get users() {
    return this.usersService.get();
  }

}
