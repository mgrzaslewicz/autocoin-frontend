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
    usdValue: number;
}

@Component({
    selector: 'app-exchange-balance',
    templateUrl: './exchange-balance.component.html',
    styleUrls: ['./exchange-balance.component.scss'],
    animations: [routerTransition()]
})
export class ExchangeBalanceComponent implements OnInit, OnDestroy {
    exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto[] = null;
    refreshTimeMillis: number = null;
    isFetchWalletsRequestPending = false;
    isRefreshWalletsRequestPending = false;
    showGroupedBalancesPerExchangeUser = false;
    showUnder1Dollar = false;
    hideBalances = false;
    totalUsdValue: number;
    totalExchangeWalletBalances: CurrencyBalanceTableRow[] = null;

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

    toggleShowUnderOneDollar() {
        this.showUnder1Dollar = !this.showUnder1Dollar;
    }

    toggleBalancesViewType() {
        this.showGroupedBalancesPerExchangeUser = !this.showGroupedBalancesPerExchangeUser;
    }

    private setExchangeWalletBalances(exchangeWalletBalancesResponse: ExchangeWalletBalancesResponseDto) {
        this.exchangeCurrencyBalances = exchangeWalletBalancesResponse.exchangeCurrencyBalances;
        this.refreshTimeMillis = exchangeWalletBalancesResponse.refreshTimeMillis;
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
                    if (this.refreshTimeMillis == null) {
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

    getSortedBalances(currencyBalances: ExchangeCurrencyBalanceDto[]): CurrencyBalanceTableRow[] {
        return this.getSortedCurrencyTableRows(currencyBalances
            .map(currencyBalance => this.toCurrencyBalanceTableRow(currencyBalance))
        );
    }

    getSortedCurrencyTableRows(currencyTableRows: CurrencyBalanceTableRow[]): CurrencyBalanceTableRow[] {
        return currencyTableRows
            .filter(row => this.showUnder1Dollar || row.usdValue == null || row.usdValue > 1)
            .sort((a, b) => b.usdValue - a.usdValue);
    }

    private toCurrencyBalanceTableRow(currencyBalance: ExchangeCurrencyBalanceDto): CurrencyBalanceTableRow {
        return {
            currencyCode: currencyBalance.currencyCode,
            available: Number(currencyBalance.amountAvailable),
            blockedInOrders: Number(currencyBalance.amountInOrders),
            total: Number(currencyBalance.totalAmount),
            usdValue: Number(currencyBalance.valueInOtherCurrency["USD"])
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
                            available: Number(currencyBalance.amountAvailable),
                            blockedInOrders: Number(currencyBalance.amountInOrders)
                        });
                    }
                });
            });
        });
        return Array.from(result.values());
    }

    private getBalancesGroupedByExchangeUser(exchangeBalances: ExchangeBalanceDto[]): CurrencyBalanceTableRow[] {
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
        return Array.from(result.values());
    }
}
