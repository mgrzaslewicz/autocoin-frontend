import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../services/api';
import { Client, Exchange, ExchangeKey } from '../../../models';
import { Observable } from 'rxjs/Observable';
import { ToastService } from '../../../services/toast.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {

  public loading = false;

  public client: Client;

  public exchanges: Exchange[];

  public exchangesKeys: ExchangeKey[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private clientsService: ClientsService
  ) { }

  ngOnInit() {
    Observable.forkJoin(
      this.clientsService.getExchanges(),
      this.clientsService.findClient(this.route.snapshot.params.clientId),
      this.clientsService.getExchangesForClient(this.route.snapshot.params.clientId)
    ).subscribe(([ exchanges, client, exchangesKeys ]) => {
      this.exchanges = exchanges;
      this.client = client;
      this.exchangesKeys = exchangesKeys;
    });
  }

  isExchangeKeyFilled(exchange) {
    return _(this.exchangesKeys).find({ exchangeId: exchange.id });
  }

  onSubmit(createForm) { 
    this.loading = true;

    let subscriptions = [
      this.updateClientName()
    ];

    let exchangesKeys = createForm.value.exchangesKeys;
    for (let exchangeId in exchangesKeys) {
      let values = exchangesKeys[exchangeId];

      if (values.apiKey && values.secretKey) {
        let subscription = this.clientsService.updateClientExchangesKeys(this.client.id, exchangeId, values);
        subscriptions.push(subscription);
      }
    }

    Observable.forkJoin(subscriptions).subscribe(() => {
      this.toastService.success('Client has been updated.');
      this.router.navigate(['/clients']);
    }, error => {
      this.toastService.danger(error.message);
      this.loading = false;
    });
  }

  private updateClientName() {
    return this.clientsService.updateClient(this.client.id, { name: this.client.name });
  }

}
