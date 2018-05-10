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
    clients: Client[] = [];
    pending: boolean = false;
    pendingPriceRefresh: boolean = true;
    private clientsSubscription: Subscription;
    private currencyPairPrices: Map<string, number> = new Map();

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

    getLastClientWalletRefreshTime(client: Client): Date {
        return this.getLocalStorageKeyAsDate('client-portfolio-refresh-time-' + client.id);
    }

    private getLocalStorageKeyAsDate(key: string): Date {
        const timeString = localStorage.getItem(key);
        if (timeString != null) {
            const timeMs = Number(timeString);
            const date: Date = new Date();
            date.setTime(timeMs);
            return date;
        } else {
            return null;
        }
    }

    getLastPriceRefreshTime(): Date {
        return this.getLocalStorageKeyAsDate('prices-refresh-time');
    }

    exchangeBalancesForClient(client: Client): ExchangeBalanceDto[] {
        return JSON.parse(localStorage.getItem('client-portfolio-balances-' + client.id));
    }

    fetchExchangeBalancesForClient(client: Client) {
        this.pending = true;
        this.exchangeAccountService.getAccountBalances(client.id).subscribe(
            accountBalances => {
                localStorage.setItem('client-portfolio-refresh-time-' + client.id, new Date().getTime().toString());
                localStorage.setItem('client-portfolio-balances-' + client.id, JSON.stringify(accountBalances.exchangeBalances));
                this.pending = false;
            }, error => {
                this.pending = false;
                this.toastService.danger('Sorry, something went wrong. Could not get client account balance list');
            }
        );
    }

    ngOnDestroy() {
        this.clientsSubscription.unsubscribe();
    }

    getValue(currencyBalance: CurrencyBalanceDto, targetCurrencyCode: string): number {
        const currencyPair = `${currencyBalance.currencyCode}-${targetCurrencyCode}`;
        if (this.currencyPairPrices.has(currencyPair)) {
            const currencyPrice = this.currencyPairPrices[currencyPair];
            return currencyPrice * currencyBalance.available;
        } else {
            return null;
        }
    }

    fetchPrices() {

    }

}
