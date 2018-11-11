import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ExchangeUser} from '../../models';
import {Observable, Subscription} from '../../../../node_modules/rxjs';
import {ToastService} from '../../services/toast.service';
import {ExchangeAccountService} from '../../services/exchange-account.service';
import * as _ from 'underscore';
import {CurrencyPrice, PriceService} from '../../services/price.service';
import {ExchangeUsersService} from '../../services/api';

export interface CurrencyBalanceDto {
    currencyCode: string;
    available: number;
    frozen: number;
    total: number;
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

interface CurrencyBalanceTableRow {
    currencyCode: string;
    available: number;
    frozen: number;
    total: number;
    btcPrice: number;
    btcValue: number;
    usdValue: number;
}

@Component({
    selector: 'app-wallets',
    templateUrl: './wallets.component.html',
    styleUrls: ['./wallets.component.scss'],
    animations: [routerTransition()]
})
export class WalletsComponent implements OnInit {
    clients: ExchangeUser[] = [];
    pending: boolean = false;
    pendingPriceRefresh: boolean = false;
    private clientsSubscription: Subscription;
    private currencyPairPrices: Map<string, number> = new Map();
    private btcUsd = 'BTC-USD';
    private btcUsdPriceKey = 'price-BTC-USD';

    constructor(
        private exchangeUsersService: ExchangeUsersService,
        private exchangeAccountService: ExchangeAccountService,
        private toastService: ToastService,
        private priceService: PriceService
    ) {
    }

    ngOnInit() {
        this.clientsSubscription = Observable.forkJoin(
            this.exchangeUsersService.getExchangeUsers()
        ).subscribe(([clients]) => {
            this.clients = clients;
            this.restorePricesFromLocalStorage();
        }, error => {
            this.clients = [];
            this.toastService.danger('Sorry, something went wrong. Could not get client list');
        });
    }

    getLastClientWalletRefreshTime(client: ExchangeUser): Date {
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

    exchangeBalancesForClient(exchangeUser: ExchangeUser): ExchangeBalanceDto[] {
        return JSON.parse(localStorage.getItem('client-portfolio-balances-' + exchangeUser.id));
    }

    fetchExchangeBalancesForClient(client: ExchangeUser) {
        this.pending = true;
        this.exchangeAccountService.getAccountBalances(client.id).subscribe(
            accountBalances => {
                const accountBalancesSortedByExchangeAZ = accountBalances.exchangeBalances
                    .sort((a, b) => a.exchangeName.localeCompare(b.exchangeName));
                localStorage.setItem('client-portfolio-refresh-time-' + client.id, new Date().getTime().toString());
                localStorage.setItem('client-portfolio-balances-' + client.id, JSON.stringify(accountBalancesSortedByExchangeAZ));
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

    getBtcPrice(currencyBalance: CurrencyBalanceDto): number {
        const currencyPair = `${currencyBalance.currencyCode}-BTC`;
        if (this.currencyPairPrices.has(currencyPair)) {
            const currencyPrice = this.currencyPairPrices.get(currencyPair);
            return 1 / currencyPrice;
        } else {
            return null;
        }
    }

    getBtcValue(currencyBalance: CurrencyBalanceDto): number {
        const currencyPair = `${currencyBalance.currencyCode}-BTC`;
        if (this.currencyPairPrices.has(currencyPair)) {
            const currencyPrice = this.currencyPairPrices.get(currencyPair);
            if (currencyPrice !== 0) {
                return (currencyBalance.total / currencyPrice);
            } else {
                return 0.0;
            }
        } else {
            return null;
        }
    }

    getUsdValue(currencyBalance: CurrencyBalanceDto): number {
        const currencyBtcValue = this.getBtcValue(currencyBalance);
        if (this.currencyPairPrices.has(this.btcUsd) && currencyBtcValue !== null) {
            const usdBtcPrice = this.currencyPairPrices.get(this.btcUsd);
            return currencyBtcValue * usdBtcPrice;
        } else {
            console.log(`No USD-BTC price when calculating value of currency ${currencyBalance.currencyCode}`);
            return null;
        }
    }

    getTotalExchangeBtcValue(exchangeBalance: ExchangeBalanceDto): number {
        let totalBtc = 0.0;
        exchangeBalance.currencyBalances.forEach(item => {
            totalBtc += this.getBtcValue(item);
        });
        return totalBtc;
    }

    getTotalExchangeUsdValue(exchangeBalance: ExchangeBalanceDto): number {
        const totalBtcValue = this.getTotalExchangeBtcValue(exchangeBalance);
        if (this.currencyPairPrices.has(this.btcUsd) && totalBtcValue !== null) {
            const usdBtcPrice = this.currencyPairPrices.get(this.btcUsd);
            return totalBtcValue * usdBtcPrice;
        } else {
            return null;
        }
    }

    getTotalClientBtcValue(client: ExchangeUser): number {
        let totalBtc = 0.0;
        _.filter(this.exchangeBalancesForClient(client), exchange => exchange != null)
            .forEach(exchange => {
                totalBtc += this.getTotalExchangeBtcValue(exchange);
            });
        return totalBtc;
    }

    getTotalClientUsdValue(client: ExchangeUser): number {
        const totalBtcValue = this.getTotalClientBtcValue(client);
        if (this.currencyPairPrices.has(this.btcUsd) && totalBtcValue !== null) {
            const usdBtcPrice = this.currencyPairPrices.get(this.btcUsd);
            return totalBtcValue * usdBtcPrice;
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
            const btcUsdPrice = Number(localStorage.getItem(this.btcUsdPriceKey));
            this.currencyPairPrices.set(this.btcUsd, btcUsdPrice);
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

    private savePriceRefreshTime() {
        localStorage.setItem('prices-refresh-time', new Date().getTime().toString());
    }

    fetchPrices() {
        console.log('Fetching prices');
        const distinctCurrencyCodes: string[] = this.getDistinctCurrencyCodesInWallets();
        console.log(distinctCurrencyCodes);

        localStorage.setItem('wallet-distinct-currency-codes', JSON.stringify(distinctCurrencyCodes));

        this.pendingPriceRefresh = true;
        Observable.from(distinctCurrencyCodes)
            .flatMap(currencyCode => {
                return Observable.of(currencyCode)
                    .flatMap(ccy => {
                        return this.priceService.getPrice(ccy);
                    })
                    .catch(() => Observable.empty<CurrencyPrice>());
            })
            .subscribe({
                next: (currencyPrice) => {
                    this.savePrice(currencyPrice);
                    console.log(`Next price for ${ currencyPrice.currencyCode } is ${ 1 / currencyPrice.priceInBtc } ($ ${ currencyPrice.btcUsdPrice })`);
                },
                complete: () => {
                    console.log('Complete'),
                        this.pendingPriceRefresh = false;
                    this.savePriceRefreshTime();
                }
            });
        return distinctCurrencyCodes;
    }

    private savePrice(currencyPrice: CurrencyPrice) {
        const currencyKey = `price-${currencyPrice.currencyCode}-BTC`;
        localStorage.setItem(currencyKey, currencyPrice.priceInBtc.toString());
        localStorage.setItem(this.btcUsdPriceKey, currencyPrice.btcUsdPrice.toString());
        this.currencyPairPrices.set(`${currencyPrice.currencyCode}-BTC`, currencyPrice.priceInBtc);
        this.currencyPairPrices.set(this.btcUsd, currencyPrice.btcUsdPrice);
    }

    getSortedBalances(currencyBalances: CurrencyBalanceDto[]): CurrencyBalanceTableRow[] {
        return currencyBalances
            .map(currencyBalance => this.toCurrencyBalanceTableRow(currencyBalance))
            .sort((a, b) => b.btcValue - a.btcValue);
    }

    private toCurrencyBalanceTableRow(currencyBalance: CurrencyBalanceDto): CurrencyBalanceTableRow {
        return {
            currencyCode: currencyBalance.currencyCode,
            available: currencyBalance.available,
            frozen: currencyBalance.frozen,
            total: currencyBalance.total,
            btcPrice: this.getBtcPrice(currencyBalance),
            btcValue: this.getBtcValue(currencyBalance),
            usdValue: this.getUsdValue(currencyBalance)
        };
    }
}
