import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ArbitrageMonitorService, TwoLegArbitrageProfitOpportunityDto} from '../../services/arbitrage-monitor.service';
import {ToastService} from '../../services/toast.service';
import {animate, state, style, transition, trigger} from "@angular/animations";

interface LiveOpportunitiesFilter {
    isMinRelativePercentFilterOn: boolean;
    minRelativePercentFilterValue: number;
    isMaxRelativePercentFilterOn: boolean;
    isShowingUnknownWithdrawalStatus: boolean;
    isShowingUnknownDepositStatus: boolean;
    isShowingNotAvailableTransferFee: boolean;
    maxRelativePercentFilterValue: number;
    min24hUsdVolume: number;
    isMin24hUsdVolumeFilterOn: boolean;
    orderBookAmountThresholdIndexSelected: number;
    baseCurrencyBlackList: string[];
    counterCurrencyBlackList: string[];
    exchangeBuySideBlackList: string[];
    exchangeSellSideBlackList: string[];
}

@Component({
    selector: 'app-arbitrage-monitor',
    templateUrl: './arbitrage-monitor.component.html',
    styleUrls: ['./arbitrage-monitor.component.scss'],
    animations: [
        trigger('myAnimation', [
            state('in', style({
                height: '*',
                overflow: 'hidden'
            })),
            state('out', style({
                height: '0',
                overflow: 'hidden'
            })),
            transition('in => out', animate('100ms ease-in-out')),
            transition('out => in', animate('100ms ease-in-out'))
        ])
    ]
})
export class ArbitrageMonitorComponent implements OnInit, OnDestroy {
    baseCurrenciesMonitored: string[] = [];
    selectedBaseCurrenciesMonitored: string[] = [];
    counterCurrenciesMonitored: string[] = [];
    selectedCounterCurrenciesMonitored: string[] = [];
    selectedBuySideExchanges: string[] = [];
    selectedSellSideExchanges: string[] = [];

    orderBookUsdAmountThresholds: number[] = [];
    orderBookUsdAmountThresholdsIndexes: number[] = [];
    twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfitOpportunityDto[] = [];

    private defaultOpportunitiesFilter: LiveOpportunitiesFilter = {
        isMaxRelativePercentFilterOn: false,
        isMinRelativePercentFilterOn: false,
        maxRelativePercentFilterValue: null,
        minRelativePercentFilterValue: null,
        min24hUsdVolume: 1000,
        isMin24hUsdVolumeFilterOn: false,
        isShowingUnknownDepositStatus: true,
        isShowingUnknownWithdrawalStatus: true,
        isShowingNotAvailableTransferFee: true,
        orderBookAmountThresholdIndexSelected: 0,
        baseCurrencyBlackList: [],
        counterCurrencyBlackList: [],
        exchangeBuySideBlackList: [],
        exchangeSellSideBlackList: [],
    };

    opportunitiesFilter: LiveOpportunitiesFilter = Object.create(this.defaultOpportunitiesFilter);

    autoRefreshSeconds = 5;
    defaultTransactionFeePercent = "...";
    freePlanProfitPercentCutOff: string = "...";
    isIncludingProPlanOpportunities: boolean = null;
    exchangesSupportedForMonitoring: string[] = [];

    private lastTwoLegArbitrageOpportunitiesRefreshTimeKey = 'lastTwoLegArbitrageOpportunitiesRefreshTime';
    private scheduledLiveOpportunitiesRefresh: number | any = null;
    private opportunitiesFilterLocalStorageKey = 'arbitrage-monitor.opportunities-filter';

    constructor(
        private authService: AuthService,
        private arbitrageMonitorService: ArbitrageMonitorService,
        private toastService: ToastService
    ) {
        this.restoreOpportunitiesFilterFromLocalStorage();
    }

    private restoreOpportunitiesFilterFromLocalStorage() {
        const savedOpportunitiesFilter = localStorage.getItem(this.opportunitiesFilterLocalStorageKey);
        if (savedOpportunitiesFilter != null) {
            try {
                this.opportunitiesFilter = JSON.parse(savedOpportunitiesFilter);
                this.opportunitiesFilter = {...this.defaultOpportunitiesFilter, ...this.opportunitiesFilter};
                this.removeBlacklistedExchangesFromSelected();
            } catch (e) {
                localStorage.removeItem(this.opportunitiesFilterLocalStorageKey);
            }
        }
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon()
            .subscribe(() => {
                this.fetchArbitrageMetadata();
                this.fetchOpportunities();
                this.startAutoRefresh();
            });
    }

    ngOnDestroy(): void {
        this.cancelOpportunitiesRefresh();
    }

    getLastRefreshTime(): Date {
        return this.getLocalStorageKeyAsDate(this.lastTwoLegArbitrageOpportunitiesRefreshTimeKey);
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

    private selectAllExchanges() {
        this.selectedBuySideExchanges = this.exchangesSupportedForMonitoring
            .slice(0, this.exchangesSupportedForMonitoring.length)
            .sort((a, b) => {
                return a.localeCompare(b);
            });
        this.selectedSellSideExchanges = this.exchangesSupportedForMonitoring
            .slice(0, this.exchangesSupportedForMonitoring.length)
            .sort((a, b) => {
                return a.localeCompare(b);
            });
    }

    private reflectSelectedExchangesInFilter() {
        this.selectAllExchanges();
        this.removeBlacklistedExchangesFromSelected();
    }

    private reflectSelectedCurrenciesInFilter() {
        this.selectedBaseCurrenciesMonitored = this.baseCurrenciesMonitored.slice(0, this.baseCurrenciesMonitored.length);
        this.opportunitiesFilter.baseCurrencyBlackList.forEach(item => {
            const indexToRemove = this.selectedBaseCurrenciesMonitored.indexOf(item);
            if (indexToRemove >= 0) {
                this.selectedBaseCurrenciesMonitored.splice(indexToRemove, 1);
            }
        });
        this.selectedCounterCurrenciesMonitored = this.counterCurrenciesMonitored.slice(0, this.counterCurrenciesMonitored.length);
        this.opportunitiesFilter.counterCurrencyBlackList.forEach(item => {
            const indexToRemove = this.selectedCounterCurrenciesMonitored.indexOf(item);
            if (indexToRemove >= 0) {
                this.selectedCounterCurrenciesMonitored.splice(indexToRemove, 1);
            }
        });
    }

    fetchArbitrageMetadata() {
        this.arbitrageMonitorService.getArbitrageMetadata()
            .subscribe(arbitrageMetadata => {
                this.freePlanProfitPercentCutOff = arbitrageMetadata.freePlanProfitPercentCutOff;
                this.defaultTransactionFeePercent = arbitrageMetadata.defaultTransactionFeePercent;
                this.isIncludingProPlanOpportunities = arbitrageMetadata.isIncludingProPlanOpportunities;
                this.exchangesSupportedForMonitoring = arbitrageMetadata.exchangesMonitored;
                this.baseCurrenciesMonitored = arbitrageMetadata.baseCurrenciesMonitored.sort((a, b) => {
                    return a.localeCompare(b);
                });
                this.counterCurrenciesMonitored = arbitrageMetadata.counterCurrenciesMonitored.sort((a, b) => {
                    return a.localeCompare(b);
                });
                this.reflectSelectedExchangesInFilter();
                this.reflectSelectedCurrenciesInFilter();
            });
    }

    fetchOpportunities() {
        this.arbitrageMonitorService.getTwoLegArbitrageProfitOpportunities()
            .subscribe(twoLegArbitrageProfitOpportunities => {
                    this.orderBookUsdAmountThresholds = twoLegArbitrageProfitOpportunities.usdDepthThresholds;
                    this.orderBookUsdAmountThresholdsIndexes = this.orderBookUsdAmountThresholds.map((value, index) => {
                        return index;
                    });
                    this.twoLegArbitrageProfitOpportunities = twoLegArbitrageProfitOpportunities.profits;
                    localStorage.setItem(this.lastTwoLegArbitrageOpportunitiesRefreshTimeKey, new Date().getTime()
                        .toString());
                },
                error => {
                    this.toastService.danger('Sorry, something went wrong. Could not refresh arbitrage opportunities');
                }
            );
    }

    addBaseCurrencyToBlackList(event: any) {
        this.opportunitiesFilter.baseCurrencyBlackList.push(event.value);
        this.saveOpportunitiesFilter();
    }

    addAllBaseCurrenciesToBlackList() {
        this.opportunitiesFilter.baseCurrencyBlackList = this.baseCurrenciesMonitored.slice(0, this.baseCurrenciesMonitored.length);
        this.saveOpportunitiesFilter();
    }

    clearBaseCurrenciesBlackList() {
        this.opportunitiesFilter.baseCurrencyBlackList = [];
        this.selectedBaseCurrenciesMonitored = this.baseCurrenciesMonitored.slice(0, this.baseCurrenciesMonitored.length);
        this.saveOpportunitiesFilter();
    }

    removeBaseCurrencyFromBlackList(value: string | any) {
        const index = this.opportunitiesFilter.baseCurrencyBlackList.indexOf(value);
        if (index >= 0) {
            this.opportunitiesFilter.baseCurrencyBlackList.splice(index, 1);
            this.saveOpportunitiesFilter();
        }
    }

    addCounterCurrencyToBlackList(event: any) {
        this.opportunitiesFilter.counterCurrencyBlackList.push(event.value);
        this.saveOpportunitiesFilter();
    }

    addAllCounterCurrenciesToBlackList() {
        this.opportunitiesFilter.counterCurrencyBlackList = this.counterCurrenciesMonitored.slice(0, this.counterCurrenciesMonitored.length);
        this.saveOpportunitiesFilter();
    }

    clearCounterCurrenciesBlackList() {
        this.opportunitiesFilter.counterCurrencyBlackList = [];
        this.selectedCounterCurrenciesMonitored = this.counterCurrenciesMonitored.slice(0, this.counterCurrenciesMonitored.length);
        this.saveOpportunitiesFilter();
    }

    removeCounterCurrencyFromBlackList(value: string | any) {
        const index = this.opportunitiesFilter.counterCurrencyBlackList.indexOf(value);
        if (index >= 0) {
            this.opportunitiesFilter.counterCurrencyBlackList.splice(index, 1);
            this.saveOpportunitiesFilter();
        }
    }

    setOrderBookUsdAmountThreshold(orderBookUsdAmountThresholdIndex: number) {
        this.opportunitiesFilter.orderBookAmountThresholdIndexSelected = orderBookUsdAmountThresholdIndex;
        this.saveOpportunitiesFilter();
    }

    getSelectedOrderBookUsdAmountThreshold() {
        return this.orderBookUsdAmountThresholds[this.opportunitiesFilter.orderBookAmountThresholdIndexSelected];
    }

    isShowingBuySideExchange(exchangeName?: string): boolean {
        if (exchangeName == null) {
            return true;
        } else {
            return this.opportunitiesFilter.exchangeBuySideBlackList.indexOf(exchangeName.toLowerCase()) < 0;
        }
    }

    isShowingSellSideExchange(exchangeName?: string): boolean {
        if (exchangeName == null) {
            return true;
        } else {
            return this.opportunitiesFilter.exchangeSellSideBlackList.indexOf(exchangeName.toLowerCase()) < 0;
        }
    }

    toggleLiveOpportunitiesMinFilter() {
        this.opportunitiesFilter.isMinRelativePercentFilterOn = !this.opportunitiesFilter.isMinRelativePercentFilterOn;
        this.saveOpportunitiesFilter();
    }

    toggleLiveOpportunitiesMaxFilter() {
        this.opportunitiesFilter.isMaxRelativePercentFilterOn = !this.opportunitiesFilter.isMaxRelativePercentFilterOn;
        this.saveOpportunitiesFilter();
    }

    toggleShowUnknownWithdrawalStatusFilter() {
        this.opportunitiesFilter.isShowingUnknownWithdrawalStatus = !this.opportunitiesFilter.isShowingUnknownWithdrawalStatus;
        this.saveOpportunitiesFilter();
    }

    toggleShowUnknownDepositStatusFilter() {
        this.opportunitiesFilter.isShowingUnknownDepositStatus = !this.opportunitiesFilter.isShowingUnknownDepositStatus;
        this.saveOpportunitiesFilter();
    }

    toggleShowNotAvailableTransferFeeFilter() {
        this.opportunitiesFilter.isShowingNotAvailableTransferFee = !this.opportunitiesFilter.isShowingNotAvailableTransferFee;
        this.saveOpportunitiesFilter();
    }

    private cancelOpportunitiesRefresh() {
        clearInterval(this.scheduledLiveOpportunitiesRefresh);
        this.scheduledLiveOpportunitiesRefresh = null;
    }

    startAutoRefresh() {
        if (this.scheduledLiveOpportunitiesRefresh != null) {
            this.cancelOpportunitiesRefresh();
        }
        this.scheduledLiveOpportunitiesRefresh = setInterval(() => {
            this.fetchOpportunities();
        }, this.autoRefreshSeconds * 1000);
    }

    saveOpportunitiesFilter() {
        localStorage.setItem(this.opportunitiesFilterLocalStorageKey, JSON.stringify(this.opportunitiesFilter));
    }

    isFilteringOpportunitiesByMinRelativePercent(): boolean {
        return this.opportunitiesFilter.isMinRelativePercentFilterOn;
    }

    isFilteringOpportunitiesByMaxRelativePercent(): boolean {
        return this.opportunitiesFilter.isMaxRelativePercentFilterOn;
    }

    isFilteringOutOpportunitiesWithUnknownDepositStatus(): boolean {
        return this.opportunitiesFilter.isShowingUnknownDepositStatus;
    }

    isFilteringOutOpportunitiesWithUnknownWithdrawalStatus(): boolean {
        return this.opportunitiesFilter.isShowingUnknownWithdrawalStatus;
    }

    isFilteringOutOpportunitiesWithNotAvailableTransferFee(): boolean {
        return this.opportunitiesFilter.isShowingNotAvailableTransferFee;
    }

    isFilteringByMin24hVolume(): boolean {
        return this.opportunitiesFilter.isMin24hUsdVolumeFilterOn;
    }

    toggleMinUsd24hVolumeFilter() {
        if (this.isFilteringByMin24hVolume()) {
            this.opportunitiesFilter.isMin24hUsdVolumeFilterOn = false;
        } else {
            this.opportunitiesFilter.isMin24hUsdVolumeFilterOn = true;
        }
        this.saveOpportunitiesFilter();
    }

    removeExchangeBuySideFromBlackList(exchangeName: string | any) {
        const index = this.opportunitiesFilter.exchangeBuySideBlackList.indexOf(exchangeName);
        if (index >= 0) {
            this.opportunitiesFilter.exchangeBuySideBlackList.splice(index, 1);
            this.saveOpportunitiesFilter();
        }
    }

    removeExchangeSellSideFromBlackList(exchangeName: string | any) {
        const index = this.opportunitiesFilter.exchangeSellSideBlackList.indexOf(exchangeName);
        if (index >= 0) {
            this.opportunitiesFilter.exchangeSellSideBlackList.splice(index, 1);
            this.saveOpportunitiesFilter();
        }
    }

    addExchangeBuySideToBlackList(event: any) {
        this.opportunitiesFilter.exchangeBuySideBlackList.push(event.value);
        this.saveOpportunitiesFilter();
    }

    addExchangeSellSideToBlackList(event: any) {
        this.opportunitiesFilter.exchangeSellSideBlackList.push(event.value);
        this.saveOpportunitiesFilter();
    }

    addAllExchangesBuySideToBlackList() {
        this.opportunitiesFilter.exchangeBuySideBlackList = this.exchangesSupportedForMonitoring.slice(0, this.exchangesSupportedForMonitoring.length);
        this.saveOpportunitiesFilter();
    }

    addAllExchangesSellSideToBlackList() {
        this.opportunitiesFilter.exchangeSellSideBlackList = this.exchangesSupportedForMonitoring.slice(0, this.exchangesSupportedForMonitoring.length);
        this.saveOpportunitiesFilter();
    }

    clearExchangesBuySideBlackList() {
        this.opportunitiesFilter.exchangeBuySideBlackList = [];
        this.selectedBuySideExchanges = this.exchangesSupportedForMonitoring.slice(0, this.exchangesSupportedForMonitoring.length);
        this.saveOpportunitiesFilter();
    }

    clearExchangesSellSideBlackList() {
        this.opportunitiesFilter.exchangeSellSideBlackList = [];
        this.selectedSellSideExchanges = this.exchangesSupportedForMonitoring.slice(0, this.exchangesSupportedForMonitoring.length);
        this.saveOpportunitiesFilter();
    }


    private getNumber(value: any, defaultValue: number): number {
        if (value === '' || value === null) {
            return defaultValue;
        }
        if (isNaN(value)) {
            return defaultValue;
        } else {
            return Number(value);
        }
    }

    private getMin(value: any): number {
        return this.getNumber(value, 0);
    }

    private getMax(value: any): number {
        return this.getNumber(value, 99999999);
    }

    getTotalNumberOfOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfitOpportunityDto[]) {
        const orderBookAmountThresholdIndexSelected = this.opportunitiesFilter.orderBookAmountThresholdIndexSelected;
        return twoLegArbitrageProfitOpportunities
            .filter(item => {
                    return item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected] != null;
                }
            ).length;
    }

    filterOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfitOpportunityDto[]): TwoLegArbitrageProfitOpportunityDto[] {
        const orderBookAmountThresholdIndexSelected = this.opportunitiesFilter.orderBookAmountThresholdIndexSelected;
        return twoLegArbitrageProfitOpportunities
            .filter(item => {

                if (item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected] == null) {
                    return false;
                }
                let isMeetingMinRelativePercentCriteria: boolean;
                let isMeetingMaxRelativePercentCriteria: boolean;

                if (this.isFilteringOpportunitiesByMinRelativePercent()) {
                    isMeetingMinRelativePercentCriteria = item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent >= this.getMin(this.opportunitiesFilter.minRelativePercentFilterValue);
                } else {
                    isMeetingMinRelativePercentCriteria = true;
                }

                if (this.isFilteringOpportunitiesByMaxRelativePercent()) {
                    isMeetingMaxRelativePercentCriteria = item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent <= this.getMax(this.opportunitiesFilter.maxRelativePercentFilterValue);
                } else {
                    isMeetingMaxRelativePercentCriteria = true;
                }

                let isMeetingVolumeCriteria: boolean;
                if (this.isFilteringByMin24hVolume()) {
                    let usd24hVolumeAtSellExchange = item.usd24hVolumeAtSellExchange == null ? Number.MAX_VALUE : item.usd24hVolumeAtSellExchange;
                    isMeetingVolumeCriteria = usd24hVolumeAtSellExchange >= this.getMin(this.opportunitiesFilter.min24hUsdVolume) &&
                        item.usd24hVolumeAtBuyExchange >= this.getMin(this.opportunitiesFilter.min24hUsdVolume);
                } else {
                    isMeetingVolumeCriteria = true;
                }

                const isMeetingBaseCurrencyCriteria = this.opportunitiesFilter.baseCurrencyBlackList.indexOf(item.baseCurrency) < 0;
                const isMeetingCounterCurrencyCriteria = this.opportunitiesFilter.counterCurrencyBlackList.indexOf(item.counterCurrency) < 0;


                const isMeetingWithdrawalStatusCriteria = (item.withdrawalEnabled !== null || this.opportunitiesFilter.isShowingUnknownWithdrawalStatus);
                const isMeetingDepositStatusCriteria = (item.depositEnabled !== null || this.opportunitiesFilter.isShowingUnknownDepositStatus);

                const isMeetingTransferFeeCriteria = item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].fees.withdrawalFee !== null || this.opportunitiesFilter.isShowingNotAvailableTransferFee;

                return this.isShowingBuySideExchange(item.buyAtExchange) &&
                    this.isShowingSellSideExchange(item.sellAtExchange) &&
                    isMeetingMinRelativePercentCriteria &&
                    isMeetingMaxRelativePercentCriteria &&
                    isMeetingVolumeCriteria &&
                    isMeetingBaseCurrencyCriteria &&
                    isMeetingCounterCurrencyCriteria &&
                    isMeetingWithdrawalStatusCriteria &&
                    isMeetingDepositStatusCriteria &&
                    isMeetingTransferFeeCriteria;
            })
            .sort((a, b) => {
                return b.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent - a.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent;
            });
    }

    private removeBlacklistedExchangesFromSelected() {
        this.opportunitiesFilter.exchangeBuySideBlackList.forEach(it => {
            this.selectedBuySideExchanges.splice(this.selectedBuySideExchanges.indexOf(it), 1);
        });
        this.opportunitiesFilter.exchangeSellSideBlackList.forEach(it => {
            this.selectedSellSideExchanges.splice(this.selectedSellSideExchanges.indexOf(it), 1);
        });
    }

    resetFilters() {
        this.opportunitiesFilter = Object.create(this.defaultOpportunitiesFilter);
        this.saveOpportunitiesFilter();
    }

}
