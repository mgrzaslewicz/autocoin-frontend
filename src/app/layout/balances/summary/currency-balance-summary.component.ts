import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {ToastService} from '../../../services/toast.service';
import {AuthService} from '../../../services/auth.service';
import {HttpErrorResponse} from "@angular/common/http";
import {BalanceMonitorService, BalanceSummaryResponseDto, CurrencyBalanceSummaryDto} from "../../../services/balance-monitor.service";

@Component({
    selector: 'app-balance-analytics',
    templateUrl: './currency-balance-summary.component.html',
    styleUrls: ['./currency-balance-summary.component.scss'],
    animations: [routerTransition()]
})
export class CurrencyBalanceSummaryComponent implements OnInit {
    isFetchBalanceRequestPending = false;
    isRefreshBalanceRequestPending = false;
    totalUsdValue: number;
    currencyBalances: CurrencyBalanceSummaryDto[] = null;
    pieChartColorScheme: any = {
        domain: ['#01579b', '#29b6f6', '#05364d']
    };

    currencySummaryChartData: any[] = null;
    btcEthVsAltcoinsChartData: any[] = null;
    cryptocurrenciesUsdValueByLocationChartData: any[] = null;

    hideUnder1Dollar = false;
    showOnlyTop10 = false;
    hideBalances = false;

    isShowingRealBalance: boolean = null;

    private usdFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    constructor(
        private balanceMonitorService: BalanceMonitorService,
        private toastService: ToastService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon()
            .subscribe(() => {
                this.fetchBalanceSummary();
            });
    }

    private getCurrencySummaryChartData(): any[] {
        let usdSum: number = 0;
        if (this.currencyBalances != null && this.currencyBalances.length > 0) {
            usdSum = this.currencyBalances.map(it => Number(it.valueInOtherCurrency['USD']))
                .reduce((acc, val) => acc + val);
        }
        const result = this.currencyBalances.map(it => {
            const usdValue = this.getUsdValue(it);
            return {
                "name": it.currency + ` ${(this.getUsdValue(it) * 100 / usdSum).toFixed(2)}%`,
                "value": usdValue == null ? 0 : usdValue
            }
        })
            .filter(it => {
                if (this.hideUnder1Dollar) {
                    return it.value > 1;
                } else {
                    return true;
                }
            });
        if (this.showOnlyTop10) {
           return result.slice(0, 10);
        } else {
           return result;
        }
    }

    private getCryptocurrenciesUsdValueByLocationChartData(currencyBalances: CurrencyBalanceSummaryDto[]): any[] {
        let blockchainWalletsTotalBalance = 0;
        let currencyAssetsTotalBalance = 0;
        let exchangesTotalBalance = 0;

        currencyBalances.forEach(it => {
            it.wallets.forEach(wallet => {
                blockchainWalletsTotalBalance += Number(wallet.valueInOtherCurrency['USD']);
            });
            it.currencyAssets.forEach(currencyAsset => {
                currencyAssetsTotalBalance += Number(currencyAsset.valueInOtherCurrency['USD']);
            });
            it.exchanges.forEach(exchange => {
                exchangesTotalBalance += Number(exchange.valueInOtherCurrency['USD']);
            });
        });
        const sum = blockchainWalletsTotalBalance + currencyAssetsTotalBalance + exchangesTotalBalance;
        const blockchainWalletsPercent = blockchainWalletsTotalBalance * 100 / sum;
        const currencyAssetsPercent = currencyAssetsTotalBalance * 100 / sum;
        const exchangesPercent = exchangesTotalBalance * 100 / sum;

        const blockchainWalletsPieSliceName = new String(`Blockchain wallets: ${blockchainWalletsPercent.toFixed(2)}%`);
        (blockchainWalletsPieSliceName as any).usdBalance = this.usdFormatter.format(blockchainWalletsTotalBalance);

        const currencyAssetsPieSliceName = new String(`Currency assets: ${currencyAssetsPercent.toFixed(2)}%`);
        (currencyAssetsPieSliceName as any).usdBalance = this.usdFormatter.format(currencyAssetsTotalBalance);

        const exchangesPieSliceName = new String(`Exchanges: ${exchangesPercent.toFixed(2)}%`);
        (exchangesPieSliceName as any).usdBalance = this.usdFormatter.format(exchangesTotalBalance);

        return [
            {
                "name": blockchainWalletsPieSliceName,
                "value": blockchainWalletsTotalBalance
            },
            {
                "name": currencyAssetsPieSliceName,
                "value": currencyAssetsTotalBalance
            },
            {
                "name": exchangesPieSliceName,
                "value": exchangesTotalBalance
            }
        ]
    }

    private getBtcEthVsAltcoinsChartData(currencyBalances: CurrencyBalanceSummaryDto[]): any[] {
        let btcEthTotalBalance = 0;
        let altcoinsTotalBalance = 0;

        currencyBalances.forEach(it => {
            if (it.currency == 'BTC' || it.currency == 'ETH') {
                btcEthTotalBalance += Number(it.valueInOtherCurrency['USD']);
            } else {
                altcoinsTotalBalance += Number(it.valueInOtherCurrency['USD']);

            }
        });
        const sum = btcEthTotalBalance + altcoinsTotalBalance;
        let exchangesPercent = altcoinsTotalBalance * 100 / sum;
        let blockchainWalletsPercent = btcEthTotalBalance * 100 / sum;

        const btcEthPieSliceName = new String(`BTC + ETH: ${blockchainWalletsPercent.toFixed(2)}%`);
        (btcEthPieSliceName as any).usdBalance = this.usdFormatter.format(btcEthTotalBalance);
        const otherCurrenciesPieSliceName = new String(`Other currencies: ${exchangesPercent.toFixed(2)}%`);
        (otherCurrenciesPieSliceName as any).usdBalance = this.usdFormatter.format(altcoinsTotalBalance);
        return [
            {
                "name": btcEthPieSliceName,
                "value": btcEthTotalBalance
            },
            {
                "name": otherCurrenciesPieSliceName,
                "value": altcoinsTotalBalance
            }
        ]
    }

    private getUsdValue(currencyBalanceSummary: CurrencyBalanceSummaryDto): number {
        if (currencyBalanceSummary.valueInOtherCurrency['USD'] != null) {
            return Number(currencyBalanceSummary.valueInOtherCurrency['USD']);
        } else {
            return null;
        }
    }

    private getUsdPrice(currencyBalanceSummary: CurrencyBalanceSummaryDto): number {
        if (currencyBalanceSummary.priceInOtherCurrency['USD'] != null) {
            return Number(currencyBalanceSummary.priceInOtherCurrency['USD']);
        } else {
            return null;
        }
    }

    private setBalanceSummary(balanceSummaryResponse: BalanceSummaryResponseDto) {
        this.isShowingRealBalance = balanceSummaryResponse.isShowingRealBalance;
        const sortedCurrencyBalances = balanceSummaryResponse.currencyBalances.sort((a, b) => this.getUsdValue(b) - this.getUsdValue(a));
        this.currencyBalances = sortedCurrencyBalances;
        this.currencySummaryChartData = this.getCurrencySummaryChartData();
        this.btcEthVsAltcoinsChartData = this.getBtcEthVsAltcoinsChartData(sortedCurrencyBalances);
        this.cryptocurrenciesUsdValueByLocationChartData = this.getCryptocurrenciesUsdValueByLocationChartData(sortedCurrencyBalances);
        this.totalUsdValue = this.getTotalUsdValue(this.currencyBalances);
    }

    getTotalUsdValue(currencyBalances: CurrencyBalanceSummaryDto[]): number {
        return currencyBalances
            .map(it => Number(it.valueInOtherCurrency['USD']))
            .reduce((acc, val) => acc + val);
    }

    fetchBalanceSummary() {
        this.isFetchBalanceRequestPending = true;
        this.balanceMonitorService.getBalanceSummary()
            .subscribe(
                (response: BalanceSummaryResponseDto) => {
                    this.isFetchBalanceRequestPending = false;
                    this.setBalanceSummary(response);
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchBalanceRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get balances');
                }
            );
    }

    toggleHideUnder1Dollar() {
        this.hideUnder1Dollar = !this.hideUnder1Dollar;
        this.currencySummaryChartData = this.getCurrencySummaryChartData();
    }

    toggleShowOnlyTop10() {
        this.showOnlyTop10 = !this.showOnlyTop10;
        this.currencySummaryChartData = this.getCurrencySummaryChartData();
    }

    toggleHideBalances() {
        this.hideBalances = !this.hideBalances;
    }

    refreshBalance() {
        this.isFetchBalanceRequestPending = true;
        this.balanceMonitorService.refreshBalanceSummary()
            .subscribe(
                (response: BalanceSummaryResponseDto) => {
                    this.isFetchBalanceRequestPending = false;
                    this.setBalanceSummary(response);
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchBalanceRequestPending = false;
                    this.toastService.danger('Something went wrong, could not refresh balances');
                }
            );
    }

    usdLabelFormatting(value: string): string {
        return '$' + Number(value)
            .toFixed(0);
    }

    /**
     * Hack needed because it's invoked in scope of the chart and 'this' does not mean this component
     * so the usdBalance is created as String property
     */
    pieChartUsdBalanceLabelFormatting(value: String): string {
        return (value as any).usdBalance;
    }

    getUsdValuePercent(currencyBalance: CurrencyBalanceSummaryDto): number {
        return Number(currencyBalance.valueInOtherCurrency['USD']) * 100 / this.totalUsdValue;
    }

    filteredCurrencyBalances(currencyBalances: CurrencyBalanceSummaryDto[]): CurrencyBalanceSummaryDto[] {
        const result = currencyBalances.filter(it => {
            const usdValue = it.valueInOtherCurrency['USD'];
            if (this.hideUnder1Dollar) {
                return usdValue != null && usdValue > 1;
            } else {
                return true;
            }
        });
        if (this.showOnlyTop10) {
            return result.slice(0, 10);
        } else {
            return result;
        }
    }
}
