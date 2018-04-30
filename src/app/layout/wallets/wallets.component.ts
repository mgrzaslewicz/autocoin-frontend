import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ClientsService} from '../../services/api/clients/clients.service';
import {Client} from '../../models';
import {Observable, Subscription} from '../../../../node_modules/rxjs';
import {ToastService} from '../../services/toast.service';
import {ExchangeAccountService} from '../../services/exchange-account.service';

export interface CurrencyBalanceDto {
    currencyCode: string;
    available: number;
}

export interface ExchangeBalanceDto {
    exchangeName: string;
    currencyBalances: CurrencyBalanceDto[];
    errorMessage: string;
}

export interface AccountInfoResponseDto {
    clientId: string;
    exchangeBalances: ExchangeBalanceDto[];
}

@Component({
    selector: 'app-wallets',
    templateUrl: './wallets.component.html',
    styleUrls: ['./wallets.component.scss'],
    animations: [routerTransition()]
})
export class WalletsComponent implements OnInit {
    private clients: Client[] = [];
    private clientsSubscription: Subscription;

    constructor(
        private clientsService: ClientsService,
        private exchangeAccountService: ExchangeAccountService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.clientsSubscription = Observable.forkJoin(
            this.clientsService.getClients()
        ).subscribe(([clients]) => {
            this.clients = clients;
        }, error => {
            this.clients = [];
            this.toastService.danger('Sorry, something went wrong. Could not get client list');
        });
    }

    getLastRefreshTime(client: Client): Date {
        const lastRefreshTimeString = localStorage.getItem('client-portfolio-refresh-time-' + client.id);
        if (lastRefreshTimeString != null) {
            const lastRefreshTimeMs = Number(localStorage.getItem('client-portfolio-refresh-time-' + client.id));
            const lastRefreshTime: Date = new Date();
            lastRefreshTime.setTime(lastRefreshTimeMs);
            return lastRefreshTime;
        } else {
            return null;
        }
    }

    exchangeBalancesForClient(client: Client): ExchangeBalanceDto[] {
        return JSON.parse(localStorage.getItem('client-portfolio-balances-' + client.id));
    }

    fetchExchangeBalancesForClient(client: Client) {
        this.exchangeAccountService.getAccountBalances(client.id).subscribe(
            accountBalances => {
                localStorage.setItem('client-portfolio-refresh-time-' + client.id, new Date().getTime().toString());
                localStorage.setItem('client-portfolio-balances-' + client.id, JSON.stringify(accountBalances.exchangeBalances));
            }, error => {
                this.toastService.danger('Sorry, something went wrong. Could not get client account balance list');
            }
        );
    }

    ngOnDestroy() {
        this.clientsSubscription.unsubscribe();
    }

}
