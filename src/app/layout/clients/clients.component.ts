import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ClientsService} from '../../services/api';
import {Client, Exchange, ExchangeKey} from '../../models';
import {ToastService} from '../../services/toast.service';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

    public clients: Client[];

    public exchanges: Exchange[];

    public exchangesKeys: ExchangeKey[];

    public selectedClientsExchanges = [];

    constructor(
        private clientsService: ClientsService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.selectedClientsExchanges = [];

        Observable.forkJoin(
            this.clientsService.getClients(),
            this.clientsService.getExchanges(),
            this.clientsService.getExchangesKeys()
        ).subscribe(([clients, exchanges, exchangesKeys]) => {
            this.clients = clients;
            this.exchanges = exchanges;
            this.exchangesKeys = exchangesKeys;
        }, error => {
            this.clients = [];

            this.toastService.danger('Sorry, something went wrong. Could not get clients.');
        });
    }

    getExchangesNamesOfClient(client) {
        const names = [];
        const exchangesKeys = this.exchangesKeys.filter(exchangesKey => exchangesKey.clientId === client.id);
        exchangesKeys.forEach(exchangesKey => {
            const exchange = this.exchanges.find(it => it.id === exchangesKey.exchangeId);
            names.push(exchange.name);
        });
        return names.sort((a, b) => a.localeCompare(b));
    }

    onSelectClientExchangeName(client, exchangeName) {
        const index = this.findClientExchangeIndex(client, exchangeName);

        if (index !== -1) {
            this.selectedClientsExchanges.splice(index, 1);
        } else {
            this.selectedClientsExchanges.push({client, exchangeName});
        }
    }

    isClientExchangeSelected(client, exchangeName) {
        return this.findClientExchangeIndex(client, exchangeName) !== -1;
    }

    findClientExchangeIndex(client, exchangeName) {
        return this.selectedClientsExchanges.findIndex(object => {
            return object.client === client && object.exchangeName === exchangeName;
        });
    }

}
