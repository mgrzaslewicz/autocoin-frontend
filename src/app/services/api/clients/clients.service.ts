import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { Client, Exchange, ExchangeKey } from '../../../models';
import * as _ from 'underscore';

@Injectable()
export class ClientsService {

  private clientsApiUrl = 'https://clients-api.autocoin-trader.com';

  constructor(private api: ApiService) {
    this.api.setApiUrl(this.clientsApiUrl);
  }

  getExchanges(): Observable<Exchange[]> {
    return this.api.get('/exchanges')
      .map(response => Object.values(response).map(data => this.makeExchange(data)));
  }

  getClients(): Observable<Client[]> {
    return this.api.get('/clients')
      .map(response => Object.values(response).map(data => this.makeClient(data)));
  }

  getExchangesKeys() {
    return this.api.get('/exchange-keys')
      .map(response => Object.values(response).map(data => this.makeExchangeKey(data)));
  }

  getClientExchanges(client) {
    return this.api.get(`/clients/${client.id}/exchange-keys`);
  }

  private makeClient(data): Client {
    let client = new Client;

    client.id = data.id;
    client.name = data.name;

    return client;
  }

  private makeExchange(data): Exchange {
    let exchange = new Exchange;

    exchange.id = data.id;
    exchange.name = data.name;

    return exchange;
  }

  private makeExchangeKey(data): ExchangeKey {
    let exchangeKey = new ExchangeKey;

    exchangeKey.exchangeId = data.exchangeId ? data.exchangeId : data.exchnageId;
    exchangeKey.clientId = data.clientId;
    exchangeKey.apiKey = data.apiKey;
    exchangeKey.secretKey = data.secretKey;
    exchangeKey.keyIsFilled = data.keyIsFilled;

    return exchangeKey;
  }

  createClient(data) {
    return this.api.post('/clients', data);
  }

  deleteClient(clientId) {
    return this.api.delete(`/clients/${clientId}`);
  }

  findClient(clientId): Observable<Client> {
    return this.api.get('/clients')
      .map(response => {
        let data = _(response).find({ id: clientId });

        return this.makeClient(data);
      });
  }

  getExchangesForClient(clientId): Observable<ExchangeKey[]> {
    return this.api.get(`/clients/${clientId}/exchange-keys`)
      .map(response => Object.values(response).map(data => this.makeExchangeKey(data)));
  }

  updateClient(clientId, data) {
    return this.api.put(`/clients/${clientId}`, data);
  }

  updateClientExchangesKeys(clientId, exchangeId, data) {
    return this.api.post(`/clients/${clientId}/exchange-keys/${exchangeId}`, data);
  }

}
