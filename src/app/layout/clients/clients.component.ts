import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Observable } from 'rxjs/Observable';
import { ClientsService } from '../../services/api';
import { Client, Exchange, ExchangeKey } from '../../models';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  animations: [routerTransition()]
})
export class ClientsComponent implements OnInit {

  public clients: Client[];

  public exchanges: Exchange[];

  public exchangesKeys: ExchangeKey[];

  constructor(private clientsService: ClientsService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    Observable.forkJoin(
      this.clientsService.getClients(),
      this.clientsService.getExchanges(),
      this.clientsService.getExchangesKeys()  
    ).subscribe(([clients, exchanges, exchangesKeys]) => {
      this.clients = clients;
      this.exchanges = exchanges;
      this.exchangesKeys = exchangesKeys;
    });
  }

  getExchangesNamesOfClient(client) {
    let names = [];

    let exchangesKeys = this.exchangesKeys.filter(exchangesKey => exchangesKey.clientId == client.id);

    exchangesKeys.forEach(exchangesKey => {
      let exchange = this.exchanges.find(exchange => exchange.id == exchangesKey.exchangeId);

      names.push(exchange.name);
    });
    
    return names;
  }

}
