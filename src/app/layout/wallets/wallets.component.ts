import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ExchangeUser} from '../../models';
import {ToastService} from '../../services/toast.service';
import * as _ from 'underscore';
import {CurrencyPriceDto, PriceService} from '../../services/price.service';
import {ExchangeUsersService} from '../../services/api';
import {forkJoin, Subscription} from 'rxjs';
import {ExchangeWalletService} from '../../services/exchange-wallet.service';
import {AuthService} from '../../services/auth.service';

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

export interface ExchangeCurrencyBalancesResponseDto {
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
    showBalancesPerExchange = true;
    showUnder1Dollar = false;
    private exchangeUsersSubscription: Subscription;
    private currencyPairPrices: Map<string, number> = new Map();
    private btcUsd = 'BTC-USD';
    private btcUsdPriceKey = 'price-BTC-USD';
    private lastWalletsRefreshTimeKey = 'lastWalletsRefreshTime';

    constructor(
        private exchangeUsersService: ExchangeUsersService,
        private exchangeWalletService: ExchangeWalletService,
        private toastService: ToastService,
        private priceService: PriceService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon().subscribe(() => {
            this.exchangeUsersSubscription = forkJoin(
                this.exchangeUsersService.getExchangeUsers()
            ).subscribe(([exchangeUsers]) => {
                this.exchangeUsers = exchangeUsers.map(eu => new ExchangeUserWithBalance(eu.id, eu.name));
                this.calculateAllExchangeUsersBalances();
                this.restorePricesFromLocalStorage();
            }, () => {
                this.exchangeUsers = [];
                this.toastService.danger('Sorry, something went wrong. Could not get exchange user list');
            });
        });
    }

    getLastWalletsRefreshTime(): Date {
        return this.getLocalStorageKeyAsDate(this.lastWalletsRefreshTimeKey);
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

    flipShowingUnderOneDollar() {
        this.showUnder1Dollar = !this.showUnder1Dollar;
        this.calculateAllExchangeUsersBalances();
    }

    flipBalancesViewType() {
        this.showBalancesPerExchange = !this.showBalancesPerExchange;
        this.calculateAllExchangeUsersBalances();
    }

    private calculateAllExchangeUsersBalances() {
        this.exchangeUsers.forEach(exchangeUser =>
            exchangeUser.exchangeBalances = this.showBalancesPerExchange ?
                this.exchangeBalancesForExchangeUser(exchangeUser) :
                this.totalBalancesForExchangeUser(exchangeUser));
    }

    private exchangeBalancesForExchangeUser(exchangeUser: ExchangeUser): ExchangeBalanceDto[] {
        return JSON.parse(localStorage.getItem('exchange-user-portfolio-balances-' + exchangeUser.id)) || [];
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

    refreshAllWallets() {
        this.pending = true;
        this.exchangeUsers.forEach((exchangeUser, index) => {
            this.fetchExchangeBalancesForExchangeUser(exchangeUser);
        });
        localStorage.setItem(this.lastWalletsRefreshTimeKey, new Date().getTime().toString());
    }

    private fetchExchangeBalancesForExchangeUser(exchangeUser: ExchangeUser) {
        this.exchangeWalletService.getAccountBalances(exchangeUser.id).subscribe(
            accountBalances => {
                const accountBalancesSortedByExchangeAZ = accountBalances.exchangeBalances
                    .sort((a, b) => a.exchangeName.localeCompare(b.exchangeName));
                localStorage.setItem('exchange-user-portfolio-balances-' + exchangeUser.id, JSON.stringify(accountBalancesSortedByExchangeAZ));
                this.fetchPrices();
            }, () => {
                this.toastService.danger(`Sorry, something went wrong. Could not get wallet balance for user ${exchangeUser.name}`);
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

    getTotalExchangeUserUsdValue(exchangeUser: ExchangeUser): number {
        const totalBtcValue = this.getTotalExchangeUserBtcValue(exchangeUser);
        if (this.currencyPairPrices.has(this.btcUsd) && totalBtcValue !== null) {
            const usdBtcPrice = this.currencyPairPrices.get(this.btcUsd);
            return totalBtcValue * usdBtcPrice;
        } else {
            return null;
        }
    }

    private getDistinctCurrencyCodesInWallets(): string[] {
        return Array.from(new Set(this.exchangeUsers
            .reduce((acc, next) => acc.concat(next.exchangeBalances), [] as ExchangeBalanceDto[])
            .reduce((acc, next) => acc.concat(next.currencyBalances), [] as CurrencyBalanceDto[])
            .map(balance => balance.currencyCode)))
            .sort((a, b) => a.localeCompare(b));
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

    fetchPrices() {
        console.log('Fetching prices');
        const distinctCurrencyCodes: string[] = this.getDistinctCurrencyCodesInWallets();
        console.log(distinctCurrencyCodes);

        localStorage.setItem('wallet-distinct-currency-codes', JSON.stringify(distinctCurrencyCodes));

        this.pending = true;
        this.priceService.getPrices(distinctCurrencyCodes).subscribe(
            (currencyPrices: CurrencyPriceDto[]) => {
                currencyPrices.forEach(it => {
                    this.savePrice(it);
                    console.log(`Next price for ${it.currency} is ${1 / it.price}${it.unitCurrency}`);
                });
            },
            err => {
                console.log(`Failed to refresh prices.`, err);
                this.pending = false;
            },
            () => {
                console.log('Refresh prices complete');
                this.calculateAllExchangeUsersBalances();
                this.pending = false;
            }
        );
        return distinctCurrencyCodes;
    }

    private savePrice(currencyPrice: CurrencyPriceDto) {
        // This assumes all prices are in relation to BTC and USD. If other fiat or other crypto is to be used this needs to change
        if (currencyPrice.currency === 'BTC' && currencyPrice.unitCurrency === 'USD') {
            localStorage.setItem(this.btcUsdPriceKey, currencyPrice.price.toString());
            this.currencyPairPrices.set(this.btcUsd, currencyPrice.price);
        } else {
            const currencyKey = `price-${currencyPrice.currency}-${currencyPrice.unitCurrency}`;
            const price = 1 / currencyPrice.price;
            localStorage.setItem(currencyKey, price.toString());
            this.currencyPairPrices.set(`${currencyPrice.currency}-${currencyPrice.unitCurrency}`, price);
        }
    }

    getSortedBalances(currencyBalances: CurrencyBalanceDto[]): CurrencyBalanceTableRow[] {
        return currencyBalances
            .map(currencyBalance => this.toCurrencyBalanceTableRow(currencyBalance))
            // row.usdValue == null to avoid odd situation where you have nothing shown after you log first time and refresh amounts
            // but have not refreshed prices yet and the list is empty
            .filter(row => this.showUnder1Dollar || row.usdValue == null || row.usdValue > 1)
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
