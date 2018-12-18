import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ExchangeUser} from '../../models';
import {ToastService} from '../../services/toast.service';
import {ExchangeAccountService} from '../../services/exchange-account.service';
import * as _ from 'underscore';
import {CurrencyPrice, PriceService} from '../../services/price.service';
import {ExchangeUsersService} from '../../services/api';
import {forkJoin, from, Subscription} from 'rxjs';
import {forEach} from "@angular/router/src/utils/collection";

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

export class ExchangeUserWithBalance extends ExchangeUser {
    constructor(id: string, name: string, public exchangeBalances: ExchangeBalanceDto[] = []) {
        super(id, name);
    }
}

export interface AccountInfoResponseDto {
    exchangeUserId: string;
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
export class WalletsComponent implements OnInit, OnDestroy {
    exchangeUsers: ExchangeUserWithBalance[] = [];
    pending = false;
    pendingPriceRefresh = false;
    showBalancesPerExchange = true;
    private exchangeUsersSubscription: Subscription;
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
        this.exchangeUsersSubscription = forkJoin(
            this.exchangeUsersService.getExchangeUsers()
        ).subscribe(([exchangeUsers]) => {
            this.exchangeUsers = exchangeUsers.map(eu => new ExchangeUserWithBalance(eu.id, eu.name, this.balancesForExchangeUser(eu)));
            this.restorePricesFromLocalStorage();
        }, () => {
            this.exchangeUsers = [];
            this.toastService.danger('Sorry, something went wrong. Could not get exchange user list');
        });
    }

    getLastWalletRefreshTime(exchangeUser: ExchangeUser): Date {
        return this.getLocalStorageKeyAsDate('exchange-user-portfolio-refresh-time-' + exchangeUser.id);
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

    flipBalancesViewType() {
        this.showBalancesPerExchange = !this.showBalancesPerExchange;
        this.exchangeUsers.forEach(exchangeUser => exchangeUser.exchangeBalances = this.balancesForExchangeUser(exchangeUser));
    }

    private balancesForExchangeUser(exchangeUser: ExchangeUser): ExchangeBalanceDto[] {
        if (this.showBalancesPerExchange) {
            return this.exchangeBalancesForExchangeUser(exchangeUser);
        } else {
            return this.totalBalancesForExchangeUser(exchangeUser);
        }
    }

    private exchangeBalancesForExchangeUser(exchangeUser: ExchangeUser): ExchangeBalanceDto[] {
        return JSON.parse(localStorage.getItem('exchange-user-portfolio-balances-' + exchangeUser.id));
    }

    private totalBalancesForExchangeUser(exchangeUser: ExchangeUser): ExchangeBalanceDto[] {
        const currencyBalancesMap = this.exchangeBalancesForExchangeUser(exchangeUser)
            .map(dto => new Map(dto.currencyBalances.map<[string, CurrencyBalanceDto]>(balance => [balance.currencyCode, balance])))
            .reduce((acc, next) => {
                next.forEach(balance => {
                    if (acc.has(balance.currencyCode)) {
                        acc.get(balance.currencyCode).available += balance.available;
                        acc.get(balance.currencyCode).frozen += balance.frozen;
                        acc.get(balance.currencyCode).total += balance.total;
                    } else {
                        acc.set(balance.currencyCode, balance);
                    }
                });
                return acc;
            }, new Map());
        return [{
            exchangeName: 'Total',
            currencyBalances: Array.from(currencyBalancesMap.values())
        }];
    }

    fetchExchangeBalancesForExchangeUser(client: ExchangeUser) {
        this.pending = true;
        this.exchangeAccountService.getAccountBalances(client.id).subscribe(
            accountBalances => {
                const accountBalancesSortedByExchangeAZ = accountBalances.exchangeBalances
                    .sort((a, b) => a.exchangeName.localeCompare(b.exchangeName));
                localStorage.setItem('exchange-user-portfolio-refresh-time-' + client.id, new Date().getTime().toString());
                localStorage.setItem('exchange-user-portfolio-balances-' + client.id, JSON.stringify(accountBalancesSortedByExchangeAZ));
                this.pending = false;
            }, () => {
                this.pending = false;
                this.toastService.danger('Sorry, something went wrong. Could not get exchange user account balance list');
            }
        );
    }

    ngOnDestroy() {
        this.exchangeUsersSubscription.unsubscribe();
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

    get1BtcValue() {
        return this.currencyPairPrices.get(this.btcUsd);
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

    getTotalExchangeUserBtcValue(exchangeUser: ExchangeUser): number {
        let totalBtc = 0.0;
        _.filter(this.exchangeBalancesForExchangeUser(exchangeUser), exchange => exchange != null)
            .forEach(exchange => {
                totalBtc += this.getTotalExchangeBtcValue(exchange);
            });
        return totalBtc;
    }

    getTotalExchangeUserUsdValue(exchangeUser
                                     : ExchangeUser): number {
        const totalBtcValue = this.getTotalExchangeUserBtcValue(exchangeUser);
        if (this.currencyPairPrices.has(this.btcUsd) && totalBtcValue !== null) {
            const usdBtcPrice = this.currencyPairPrices.get(this.btcUsd);
            return totalBtcValue * usdBtcPrice;
        } else {
            return null;
        }
    }

    private getDistinctCurrencyCodesInWallets(): string[] {
        return _.uniq(
            _.flatten(_.filter(this.exchangeUsers, exchangeUser => exchangeUser != null).map(exchangeUser =>
                    _.filter(this.exchangeBalancesForExchangeUser(exchangeUser), balance => balance != null)
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
        from(this.priceService.getPrices(distinctCurrencyCodes))
            .subscribe({
                next: (currencyPrice: CurrencyPrice) => {
                    this.savePrice(currencyPrice);
                    console.log(`Next price for ${currencyPrice.currencyCode} is ${1 / currencyPrice.price}${currencyPrice.unit}`);
                },
                complete: () => {
                    console.log('Complete');
                    this.pendingPriceRefresh = false;
                    this.savePriceRefreshTime();
                },
                error: (err) => {
                    console.log(`Failed to refresh prices.`, err);
                    this.pendingPriceRefresh = false;
                }
            });
        return distinctCurrencyCodes;
    }

    private savePrice(currencyPrice: CurrencyPrice) {
        // This assumes all prices are in relation to BTC and USD. If other fiat or other crypto is to be used this needs to change
        if (currencyPrice.currencyCode === 'BTC' && currencyPrice.unit === 'USD') {
            localStorage.setItem(this.btcUsdPriceKey, currencyPrice.price.toString());
            this.currencyPairPrices.set(this.btcUsd, currencyPrice.price);
        } else {
            const currencyKey = `price-${currencyPrice.currencyCode}-${currencyPrice.unit}`;
            const price = 1 / currencyPrice.price;
            localStorage.setItem(currencyKey, price.toString());
            this.currencyPairPrices.set(`${currencyPrice.currencyCode}-${currencyPrice.unit}`, price);
        }
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
