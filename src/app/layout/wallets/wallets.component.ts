import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ClientsService } from '../../services/api/clients/clients.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
  animations: [routerTransition()]
})
export class WalletsComponent implements OnInit {

  constructor(
    private clientsService: ClientsService,
  ) { }

  ngOnInit() {
  }

  get clients() {
    return this.clientsService.getClients();
  }

}
