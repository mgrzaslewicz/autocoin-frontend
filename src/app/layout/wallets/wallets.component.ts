import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ClientsService} from '../../services/api/clients/clients.service';
import {Client} from '../../models';
import {Observable, Subscription} from '../../../../node_modules/rxjs';
import {ToastService} from '../../services/toast.service';
import {ExchangeAccountService} from '../../services/exchange-account.service';
import * as _ from 'underscore';
import {CurrencyPrice, PriceService} from '../../services/price.service';

export interface CurrencyBalanceDto {
    currencyCode: string;
    available: number;
}

export interface ExchangeBalanceDto {
    exchangeName: string;
    currencyBalances: CurrencyBalanceDto[];
    errorMessage?: string;
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
    pendingPriceRefresh: boolean = false;
    private clientsSubscription: Subscription;
    private currencyPairPrices: Map<string, number> = new Map<string, number>();

    constructor(
        private clientsService: ClientsService,
        private exchangeAccountService: ExchangeAccountService,
        private toastService: ToastService,
        private priceService: PriceService
    ) {
    }

    ngOnInit() {
        this.clientsSubscription = Observable.forkJoin(
            this.clientsService.getClients()
        ).subscribe(([clients]) => {
            this.clients = clients;
            this.restorePricesFromLocalStorage();
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
            const currencyPrice = this.currencyPairPrices.get(currencyPair);
            if (currencyPrice !== 0) {
                return (currencyBalance.available / currencyPrice);
            } else {
                return 0.0;
            }
        } else {
            return null;
        }
    }

    private getDistinctCurrencyCodesInWallets(): string[] {
        return _.uniq(
            _.flatten(_.filter(this.clients, client => client != null).map(client =>
                    _.filter(this.exchangeBalancesForClient(client), balance => balance != null)
                        .map(exchangeBalanceDto =>
                            exchangeBalanceDto.currencyBalances
                                .map(exchangeCurrencyBalance => exchangeCurrencyBalance.currencyCode)
                        )
                )
            )
        ).sort(function (a, b) {
            return a.localeCompare(b);
        });
    }

    private restorePricesFromLocalStorage() {
        console.log('Restoring prices from local storage');
        this.currencyPairPrices.clear();
        const distinctCurrencyCodesString = localStorage.getItem('wallet-distinct-currency-codes');
        if (distinctCurrencyCodesString != null) {
            const btcUsdPrice = Number(localStorage.getItem('price-BTC-USD'));
            this.currencyPairPrices['BTC-USD'] = btcUsdPrice;
            const distinctCurrencyCodes: string[] = JSON.parse(distinctCurrencyCodesString);
            console.log(`Found ${distinctCurrencyCodes.length} prices to restore`);
            distinctCurrencyCodes.forEach(currencyCode => {
                const currencyBtcPrice = Number(localStorage.getItem(`price-${currencyCode}-BTC`));
                this.currencyPairPrices.set(`${currencyCode}-BTC`, currencyBtcPrice);
            });
        }
        console.log('Prices restored');
        console.log(this.currencyPairPrices);
    }

    fetchPrices() {
        console.log('Fetching prices');
        const distinctCurrencyCodes: string[] = this.getDistinctCurrencyCodesInWallets();
        console.log(distinctCurrencyCodes);

        localStorage.setItem('wallet-distinct-currency-codes', JSON.stringify(distinctCurrencyCodes));
        localStorage.setItem('prices-refresh-time', new Date().getTime().toString());

        this.pendingPriceRefresh = true;

        const numberOfCurrencyCodes = distinctCurrencyCodes.length;
        let numberOfFetchedCurrencyCodes = 0;

        distinctCurrencyCodes.forEach(currencyCode => {
            this.priceService.getPrice(currencyCode).subscribe(currencyPrice => {
                    this.savePrice(currencyPrice);
                    numberOfFetchedCurrencyCodes++;
                    if (numberOfCurrencyCodes === numberOfFetchedCurrencyCodes) {
                        this.pendingPriceRefresh = false;
                    }
                },
                error => {
                    numberOfFetchedCurrencyCodes++;
                    if (numberOfCurrencyCodes === numberOfFetchedCurrencyCodes) {
                        this.pendingPriceRefresh = false;
                    }
                });
        });
        return distinctCurrencyCodes;
    }

    private savePrice(currencyPrice: CurrencyPrice) {
        const currencyKey = `price-${currencyPrice.currencyCode}-BTC`;
        localStorage.setItem(currencyKey, currencyPrice.priceInBtc.toString());
        localStorage.setItem('price-BTC-USD', currencyPrice.btcUsdPrice.toString());
        this.currencyPairPrices.set(`${currencyPrice.currencyCode}-BTC`, currencyPrice.priceInBtc);
        this.currencyPairPrices.set('BTC-USD', currencyPrice.btcUsdPrice);
    }

}
