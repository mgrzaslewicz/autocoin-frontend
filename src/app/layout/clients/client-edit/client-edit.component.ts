import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExchangeUsersService} from '../../../services/api';
import {Client, Exchange, ExchangeKey} from '../../../models';
import {Observable} from 'rxjs/Observable';
import {ToastService} from '../../../services/toast.service';
import * as _ from 'underscore';

@Component({
    selector: 'app-client-edit',
    templateUrl: './client-edit.component.html',
    styleUrls: ['./client-edit.component.scss']
})
// TODO change to ExchangeUserEditComponent
export class ClientEditComponent implements OnInit {

    public loading = false;

    // TODO change to exchangeUser
    public client: Client;

    public exchanges: Exchange[];

    public exchangesKeys: ExchangeKey[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastService: ToastService,
        private exchangeUsersService: ExchangeUsersService
    ) {
    }

    ngOnInit() {
        Observable.forkJoin(
            this.exchangeUsersService.getExchanges(),
            this.exchangeUsersService.findClient(this.route.snapshot.params.clientId),
            this.exchangeUsersService.getExchangesForClient(this.route.snapshot.params.clientId)
        ).subscribe(([exchanges, client, exchangesKeys]) => {
            this.exchanges = this.sortAZ(exchanges);
            this.client = client;
            this.exchangesKeys = exchangesKeys;
        });
    }

    private sortAZ(exchanges: Exchange[]): Exchange[] {
        return exchanges.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    isExchangeKeyFilled(exchange: Exchange) {
        return _(this.exchangesKeys).find({exchangeId: exchange.id});
    }

    onSubmit(createForm) {
        this.loading = true;

        const subscriptions = [this.updateClientName()];

        const exchangesKeys = createForm.value.exchangesKeys;
        for (const exchangeId in exchangesKeys) {
            const formKeys = exchangesKeys[exchangeId];
            const requestData = this.getRequestData(exchangeId, formKeys);
            if (requestData != null) {
                const subscription = this.exchangeUsersService.updateClientExchangesKeys(this.client.id, exchangeId, requestData);
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

    private getRequestData(exchangeId: string, formKeys): any {
        const areKeysFilled = formKeys.apiKey && formKeys.secretKey;
        let formData = null;
        if (areKeysFilled) {
            if (this.exchangeIdToExchangeName(exchangeId) === 'bitstamp' && formKeys.userName) {
                formData = {
                    apiKey: formKeys.userName + '$$$' + formKeys.apiKey,
                    secretKey: formKeys.secretKey
                };
            } else {
                formData = {
                    apiKey: formKeys.apiKey,
                    secretKey: formKeys.secretKey
                };
            }
        }
        return formData;
    }

    private exchangeIdToExchangeName(exchangeId: string): string {
        return this.exchanges.find(exchange => exchange.id ===  exchangeId).name;
    }

    private updateClientName() {
        return this.exchangeUsersService.updateClient(this.client.id, {name: this.client.name});
    }

}
