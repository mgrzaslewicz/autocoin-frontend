import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {ToastService} from '../../../services/toast.service';
import {AuthService} from '../../../services/auth.service';
import {HttpErrorResponse} from "@angular/common/http";
import {
    BalanceMonitorService,
    ExchangeBalanceDto,
    ExchangeCurrencyBalanceDto,
    ExchangeCurrencyBalancesResponseDto,
    ExchangeWalletBalancesResponseDto
} from "../../../services/balance-monitor.service";

interface CurrencyBalanceTableRow {
    currencyCode: string;
    available: number;
    blockedInOrders: number;
    total: number;
    usdValue?: number;
    usdValuePercent?: number;
    usdPrice?: number;
}

@Component({
    selector: 'app-exchange-balance',
    templateUrl: './exchange-balance.component.html',
    styleUrls: ['./exchange-balance.component.scss'],
    animations: [routerTransition()]
})
export class ExchangeBalanceComponent implements OnInit, OnDestroy {
    exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto[] = null;
    pricesInOtherCurrencies: Map<string, Map<string, string>> = null;
    synchronizationTimeMillis: number = null;
    isFetchWalletsRequestPending = false;
    isRefreshWalletsRequestPending = false;
    groupBalancesPerExchangeUser = false;
    hideUnder1Dollar = false;
    hideBalances = false;
    totalUsdValue: number;
    totalExchangeWalletBalances: CurrencyBalanceTableRow[] = null;
    isShowingRealBalance: boolean = null;

    constructor(
        private balanceMonitorService: BalanceMonitorService,
        private toastService: ToastService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon()
            .subscribe(() => {
                this.fetchExchangeWallets();
            });
    }

    toggleHideUnderOneDollar() {
        this.hideUnder1Dollar = !this.hideUnder1Dollar;
    }

    toggleBalancesViewType() {
        this.groupBalancesPerExchangeUser = !this.groupBalancesPerExchangeUser;
    }

    private setExchangeWalletBalances(exchangeWalletBalancesResponse: ExchangeWalletBalancesResponseDto) {
        this.exchangeCurrencyBalances = exchangeWalletBalancesResponse.exchangeCurrencyBalances;
        this.pricesInOtherCurrencies = exchangeWalletBalancesResponse.pricesInOtherCurrencies;
        this.synchronizationTimeMillis = exchangeWalletBalancesResponse.refreshTimeMillis;
        this.totalUsdValue = this.getTotalUsdValue();
        this.totalExchangeWalletBalances = this.getBalancesGroupedByCurrency(this.exchangeCurrencyBalances);
    }

    fetchExchangeWallets() {
        this.isFetchWalletsRequestPending = true;
        this.balanceMonitorService.getExchangeWallets()
            .subscribe(
                (response: ExchangeWalletBalancesResponseDto) => {
                    this.isFetchWalletsRequestPending = false;
                    this.setExchangeWalletBalances(response);
                    if (this.synchronizationTimeMillis == null) {
                        this.refreshExchangeWallets();
                    }
                },
                (error: HttpErrorResponse) => {
                    this.isFetchWalletsRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get exchange balances');
                }
            );
    }

    refreshExchangeWallets() {
        this.isRefreshWalletsRequestPending = true;
        this.balanceMonitorService.refreshExchangeWalletsBalance()
            .subscribe(
                (response: ExchangeWalletBalancesResponseDto) => {
                    this.isRefreshWalletsRequestPending = false;
                    this.setExchangeWalletBalances(response)
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isRefreshWalletsRequestPending = false;
                    this.toastService.danger('Something went wrong, could not refresh exchange balances');
                }
            );
    }

    ngOnDestroy() {
    }

    countApiKeys(): number {
        let sum = 0;
        this.exchangeCurrencyBalances.forEach(it => {
            it.exchangeBalances.forEach(() => {
                sum++;
            });
        });
        return sum;
    }

    getSortedCurrencyBalances(exchangeBalance: ExchangeBalanceDto): CurrencyBalanceTableRow[] {
        const totalExchangeUsdValue = this.getTotalExchangeUsdValue(exchangeBalance);
        return this.getSortedCurrencyTableRows(exchangeBalance.currencyBalances
            .map(currencyBalance => this.toCurrencyBalanceTableRow(currencyBalance, totalExchangeUsdValue))
        );
    }

    getSortedCurrencyTableRows(currencyTableRows: CurrencyBalanceTableRow[]): CurrencyBalanceTableRow[] {
        return currencyTableRows
            .filter(row => !this.hideUnder1Dollar || row.usdValue == null || row.usdValue > 1)
            .sort((a, b) => b.usdValue - a.usdValue);
    }

    private toCurrencyBalanceTableRow(currencyBalance: ExchangeCurrencyBalanceDto, totalExchangeUsdValue: number): CurrencyBalanceTableRow {
        return {
            currencyCode: currencyBalance.currencyCode,
            available: Number(currencyBalance.amountAvailable),
            blockedInOrders: Number(currencyBalance.amountInOrders),
            total: Number(currencyBalance.totalAmount),
            usdValue: Number(currencyBalance.valueInOtherCurrency["USD"]),
            usdValuePercent: totalExchangeUsdValue > 0 ? Number(currencyBalance.valueInOtherCurrency["USD"]) / totalExchangeUsdValue * 100 : null,
        };
    }

    getTotalUsdValue(): number {
        let totalUsd = 0;
        this.exchangeCurrencyBalances.forEach(it => {
            const usdValue = this.getTotalExchangeUserUsdValue(it);
            if (usdValue != null) {
                totalUsd += usdValue;
            } else {
                return null;
            }
        });
        return totalUsd;
    }

    getTotalExchangeUserUsdValue(exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto): number {
        let totalUsd = 0.0;
        exchangeCurrencyBalances.exchangeBalances.forEach(it => {
            const usdValue = this.getTotalExchangeUsdValue(it);
            if (usdValue == null) {
                return null;
            } else {
                totalUsd += usdValue;
            }
        });
        return totalUsd;
    }

    getTotalExchangeUsdValue(exchangeBalance: ExchangeBalanceDto): number {
        let usdValueSum = 0;
        exchangeBalance.currencyBalances.forEach(it => {
            if (it.valueInOtherCurrency["USD"] != null) {
                const usdValue = Number(it.valueInOtherCurrency["USD"]);
                usdValueSum += usdValue;
            } else {
                return null;
            }
        });
        return usdValueSum;
    }

    toggleHideBalances() {
        this.hideBalances = !this.hideBalances;
    }

    private getUsdPrice(currency: string): number {
        const priceInOtherCurrencies = this.pricesInOtherCurrencies[currency];
        if (priceInOtherCurrencies != null && priceInOtherCurrencies["USD"] != null) {
            return Number(priceInOtherCurrencies["USD"]);
        } else {
            return null;
        }
    }

    private getBalancesGroupedByCurrency(exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto[]): CurrencyBalanceTableRow[] {
        let result: Map<string, CurrencyBalanceTableRow> = new Map();
        exchangeCurrencyBalances.forEach(exchangeCurrencyBalances => {
            exchangeCurrencyBalances.exchangeBalances.forEach(exchangeBalance => {
                exchangeBalance.currencyBalances.forEach(currencyBalance => {
                    if (result.has(currencyBalance.currencyCode)) {
                        const existingRow = result.get(currencyBalance.currencyCode);
                        const usdValue = existingRow.usdValue != null && currencyBalance.valueInOtherCurrency["USD"] != null ? existingRow.usdValue + Number(currencyBalance.valueInOtherCurrency["USD"]) : null;
                        existingRow.total = existingRow.total + Number(currencyBalance.totalAmount);
                        existingRow.blockedInOrders = existingRow.blockedInOrders + Number(currencyBalance.amountInOrders);
                        existingRow.usdValue = usdValue;
                        existingRow.available = existingRow.available + Number(currencyBalance.amountAvailable);
                    } else {
                        const usdValue = currencyBalance.valueInOtherCurrency["USD"] != null ? Number(currencyBalance.valueInOtherCurrency["USD"]) : null;
                        result.set(currencyBalance.currencyCode, {
                            currencyCode: currencyBalance.currencyCode,
                            total: Number(currencyBalance.totalAmount),
                            usdValue: usdValue,
                            usdPrice: this.getUsdPrice(currencyBalance.currencyCode),
                            available: Number(currencyBalance.amountAvailable),
                            blockedInOrders: Number(currencyBalance.amountInOrders)
                        } as CurrencyBalanceTableRow);
                    }
                });
            });
        });
        result.forEach((value, key) => {
            value.usdValuePercent = value.usdValue != null ? value.usdValue / this.totalUsdValue * 100 : null;
        });
        return Array.from(result.values());
    }

    private getBalancesGroupedByExchangeUser(exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto): CurrencyBalanceTableRow[] {
        const exchangeBalances: ExchangeBalanceDto[] = exchangeCurrencyBalances.exchangeBalances;
        let result: Map<string, CurrencyBalanceTableRow> = new Map();
        exchangeBalances.forEach(exchangeBalance => {
            exchangeBalance.currencyBalances.forEach(currencyBalance => {
                if (result.has(currencyBalance.currencyCode)) {
                    const existingRow = result.get(currencyBalance.currencyCode);
                    const usdValue = existingRow.usdValue != null && currencyBalance.valueInOtherCurrency["USD"] != null ? existingRow.usdValue + Number(currencyBalance.valueInOtherCurrency["USD"]) : null;
                    existingRow.total = existingRow.total + Number(currencyBalance.totalAmount);
                    existingRow.blockedInOrders = existingRow.blockedInOrders + Number(currencyBalance.amountInOrders);
                    existingRow.usdValue = usdValue;
                    existingRow.available = existingRow.available + Number(currencyBalance.amountAvailable);
                } else {
                    const usdValue = currencyBalance.valueInOtherCurrency["USD"] != null ? Number(currencyBalance.valueInOtherCurrency["USD"]) : null;
                    result.set(currencyBalance.currencyCode, {
                        currencyCode: currencyBalance.currencyCode,
                        total: Number(currencyBalance.totalAmount),
                        usdValue: usdValue,
                        available: Number(currencyBalance.amountAvailable),
                        blockedInOrders: Number(currencyBalance.amountInOrders)
                    });
                }
            });
        });
        const totalExchangeUserUsdValue = this.getTotalExchangeUserUsdValue(exchangeCurrencyBalances);
        result.forEach((value, key) => {
            value.usdValuePercent = value.usdValue != null ? value.usdValue / totalExchangeUserUsdValue * 100 : null;
        });
        return Array.from(result.values());
    }
}
