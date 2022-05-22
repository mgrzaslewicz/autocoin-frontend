import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ArbitrageMonitorService, TwoLegArbitrageProfitOpportunityDto} from '../../services/arbitrage-monitor.service';
import {ToastService} from '../../services/toast.service';
import {animate, state, style, transition, trigger} from "@angular/animations";

interface LiveOpportunitiesFilter {
    isMinRelativePercentFilterOn: boolean;
    minRelativePercentFilterValue: number;
    isMaxRelativePercentFilterOn: boolean;
    maxRelativePercentFilterValue: number;
}

interface CommonFilter {
    min24hUsdVolume: number;
    isMin24hUsdVolumeFilterOn: boolean;
    orderBookAmountThresholdIndexSelected: number;
    baseCurrencyBlackList: string[];
    counterCurrencyBlackList: string[];
    exchangeBlackList: string[];
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
    selectedExchanges: string[] = [];

    orderBookUsdAmountThresholds: number[] = [];
    orderBookUsdAmountThresholdsIndexes: number[] = [];
    twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfitOpportunityDto[] = [];
    commonFilter: CommonFilter = {
        min24hUsdVolume: 1000,
        isMin24hUsdVolumeFilterOn: false,
        orderBookAmountThresholdIndexSelected: 0,
        baseCurrencyBlackList: [],
        counterCurrencyBlackList: [],
        exchangeBlackList: []
    };
    liveOpportunitiesFilter: LiveOpportunitiesFilter = {
        isMaxRelativePercentFilterOn: false,
        isMinRelativePercentFilterOn: false,
        maxRelativePercentFilterValue: null,
        minRelativePercentFilterValue: null,
    };

    autoRefreshSeconds = 5;
    defaultTransactionFeePercent = "...";
    freePlanProfitPercentCutOff: string = "...";
    isIncludingProPlanOpportunities: boolean = null;
    private lastTwoLegArbitrageOpportunitiesRefreshTimeKey = 'lastTwoLegArbitrageOpportunitiesRefreshTime';
    private scheduledLiveOpportunitiesRefresh: number | any = null;
    private exchangesSupportedForMonitoring: string[] = [];

    constructor(
        private authService: AuthService,
        private arbitrageMonitorService: ArbitrageMonitorService,
        private toastService: ToastService
    ) {
        const savedLiveOpportunityFilters = localStorage.getItem('arbitrage-monitor.live-opportunities-filter');
        if (savedLiveOpportunityFilters != null) {
            try {
                this.liveOpportunitiesFilter = JSON.parse(savedLiveOpportunityFilters);
            } catch (e) {
                localStorage.removeItem('arbitrage-monitor.live-opportunities-filter');
            }
        }
        const savedCommonFilters = localStorage.getItem('arbitrage-monitor.common-filter');
        if (savedCommonFilters != null) {
            try {
                this.commonFilter = JSON.parse(savedCommonFilters);
                if (this.commonFilter.baseCurrencyBlackList === undefined) {
                    this.commonFilter.baseCurrencyBlackList = [];
                }
                if (this.commonFilter.counterCurrencyBlackList === undefined) {
                    this.commonFilter.counterCurrencyBlackList = [];
                }
                if (this.commonFilter.exchangeBlackList === undefined) {
                    this.commonFilter.exchangeBlackList = [];
                }
                this.removeBlacklistedExchangesFromSelected();
            } catch (e) {
                localStorage.removeItem('arbitrage-monitor.common-filter');
            }
        }
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon()
            .subscribe(() => {
                this.fetchArbitrageMetadata();
                this.fetchLiveOpportunities();
                this.startAutoRefresh();
            });
    }

    ngOnDestroy(): void {
        this.cancelLiveOpportunitiesRefresh();
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

    fetchArbitrageMetadata() {
        this.arbitrageMonitorService.getArbitrageMetadata()
            .subscribe(arbitrageMetadata => {
                this.freePlanProfitPercentCutOff = arbitrageMetadata.freePlanProfitPercentCutOff;
                this.defaultTransactionFeePercent = arbitrageMetadata.defaultTransactionFeePercent;
                this.isIncludingProPlanOpportunities = arbitrageMetadata.isIncludingProPlanOpportunities;
                this.exchangesSupportedForMonitoring = arbitrageMetadata.exchangesMonitored;
                this.selectedExchanges = this.exchangesSupportedForMonitoring
                    .slice(0, this.exchangesSupportedForMonitoring.length)
                    .sort((a, b) => {
                        return a.localeCompare(b);
                    });

                this.removeBlacklistedExchangesFromSelected();

                this.baseCurrenciesMonitored = arbitrageMetadata.baseCurrenciesMonitored.sort((a, b) => {
                    return a.localeCompare(b);
                });
                this.selectedBaseCurrenciesMonitored = this.baseCurrenciesMonitored.slice(0, this.baseCurrenciesMonitored.length);
                this.commonFilter.baseCurrencyBlackList.forEach(item => {
                    const indexToRemove = this.selectedBaseCurrenciesMonitored.indexOf(item);
                    if (indexToRemove >= 0) {
                        this.selectedBaseCurrenciesMonitored.splice(indexToRemove, 1);
                    }
                });
                this.counterCurrenciesMonitored = arbitrageMetadata.counterCurrenciesMonitored.sort((a, b) => {
                    return a.localeCompare(b);
                });
                this.selectedCounterCurrenciesMonitored = this.counterCurrenciesMonitored.slice(0, this.counterCurrenciesMonitored.length);
                this.commonFilter.counterCurrencyBlackList.forEach(item => {
                    const indexToRemove = this.selectedCounterCurrenciesMonitored.indexOf(item);
                    if (indexToRemove >= 0) {
                        this.selectedCounterCurrenciesMonitored.splice(indexToRemove, 1);
                    }
                });
            });
    }

    fetchLiveOpportunities() {
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
        this.commonFilter.baseCurrencyBlackList.push(event.value);
        this.saveCommonFilter();
    }

    addAllBaseCurrenciesToBlackList() {
        this.commonFilter.baseCurrencyBlackList = this.baseCurrenciesMonitored.slice(0, this.baseCurrenciesMonitored.length);
        this.saveCommonFilter();
    }

    clearBaseCurrenciesBlackList() {
        this.commonFilter.baseCurrencyBlackList = [];
        this.selectedBaseCurrenciesMonitored = this.baseCurrenciesMonitored.slice(0, this.baseCurrenciesMonitored.length);
        this.saveCommonFilter();
    }

    removeBaseCurrencyFromBlackList(value: string | any) {
        const index = this.commonFilter.baseCurrencyBlackList.indexOf(value);
        if (index >= 0) {
            this.commonFilter.baseCurrencyBlackList.splice(index, 1);
            this.saveCommonFilter();
        }
    }


    addCounterCurrencyToBlackList(event: any) {
        this.commonFilter.counterCurrencyBlackList.push(event.value);
        this.saveCommonFilter();
    }

    addAllCounterCurrenciesToBlackList() {
        this.commonFilter.counterCurrencyBlackList = this.counterCurrenciesMonitored.slice(0, this.counterCurrenciesMonitored.length);
        this.saveCommonFilter();
    }

    clearCounterCurrenciesBlackList() {
        this.commonFilter.counterCurrencyBlackList = [];
        this.selectedCounterCurrenciesMonitored = this.counterCurrenciesMonitored.slice(0, this.counterCurrenciesMonitored.length);
        this.saveCommonFilter();
    }

    removeCounterCurrencyFromBlackList(value: string | any) {
        const index = this.commonFilter.counterCurrencyBlackList.indexOf(value);
        if (index >= 0) {
            this.commonFilter.counterCurrencyBlackList.splice(index, 1);
            this.saveCommonFilter();
        }
    }

    setOrderBookUsdAmountThreshold(orderBookUsdAmountThresholdIndex: number) {
        this.commonFilter.orderBookAmountThresholdIndexSelected = orderBookUsdAmountThresholdIndex;
        this.saveCommonFilter();
    }

    getSelectedOrderBookUsdAmountThreshold() {
        return this.orderBookUsdAmountThresholds[this.commonFilter.orderBookAmountThresholdIndexSelected];
    }

    isShowingExchange(exchangeName?: string): boolean {
        if (exchangeName == null) {
            return true;
        } else {
            return this.commonFilter.exchangeBlackList.indexOf(exchangeName.toLowerCase()) < 0;
        }
    }

    toggleLiveOpportunitiesMinFilter() {
        this.liveOpportunitiesFilter.isMinRelativePercentFilterOn = !this.liveOpportunitiesFilter.isMinRelativePercentFilterOn;
        this.saveLiveOpportunitiesFilter();
    }

    toggleLiveOpportunitiesMaxFilter() {
        this.liveOpportunitiesFilter.isMaxRelativePercentFilterOn = !this.liveOpportunitiesFilter.isMaxRelativePercentFilterOn;
        this.saveLiveOpportunitiesFilter();
    }

    private cancelLiveOpportunitiesRefresh() {
        clearInterval(this.scheduledLiveOpportunitiesRefresh);
        this.scheduledLiveOpportunitiesRefresh = null;
    }

    startAutoRefresh() {
        if (this.scheduledLiveOpportunitiesRefresh != null) {
            this.cancelLiveOpportunitiesRefresh();
        }
        this.scheduledLiveOpportunitiesRefresh = setInterval(() => {
            this.fetchLiveOpportunities();
        }, this.autoRefreshSeconds * 1000);
    }

    saveLiveOpportunitiesFilter() {
        localStorage.setItem('arbitrage-monitor.live-opportunities-filter', JSON.stringify(this.liveOpportunitiesFilter));
    }

    isFilteringOpportunitiesByMinRelativePercent(): boolean {
        return this.liveOpportunitiesFilter.isMinRelativePercentFilterOn;
    }

    isFilteringOpportunitiesByMaxRelativePercent(): boolean {
        return this.liveOpportunitiesFilter.isMaxRelativePercentFilterOn;
    }

    saveCommonFilter() {
        const localStorageKey = `arbitrage-monitor.common-filter`;
        localStorage.setItem(localStorageKey, JSON.stringify(this.commonFilter));
    }

    isFilteringByMin24hVolume(): boolean {
        return this.commonFilter.isMin24hUsdVolumeFilterOn;
    }

    toggleMinUsd24hVolumeFilter() {
        if (this.isFilteringByMin24hVolume()) {
            this.commonFilter.isMin24hUsdVolumeFilterOn = false;
        } else {
            this.commonFilter.isMin24hUsdVolumeFilterOn = true;
        }
        this.saveCommonFilter();
    }

    removeExchangeFromBlackList(exchangeName: string | any) {
        const index = this.commonFilter.exchangeBlackList.indexOf(exchangeName);
        if (index >= 0) {
            this.commonFilter.exchangeBlackList.splice(index, 1);
            this.saveCommonFilter();
        }
    }

    addExchangeToBlackList(event: any) {
        this.commonFilter.exchangeBlackList.push(event.value);
        this.saveCommonFilter();
    }

    addAllExchangesToBlackList() {
        this.commonFilter.exchangeBlackList = this.exchangesSupportedForMonitoring.slice(0, this.exchangesSupportedForMonitoring.length);
        this.saveCommonFilter();
    }

    clearExchangesBlackList() {
        this.commonFilter.exchangeBlackList = [];
        this.selectedExchanges = this.exchangesSupportedForMonitoring.slice(0, this.exchangesSupportedForMonitoring.length);
        this.saveCommonFilter();
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
        const orderBookAmountThresholdIndexSelected = this.commonFilter.orderBookAmountThresholdIndexSelected;
        return twoLegArbitrageProfitOpportunities
            .filter(item => {
                    return item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected] != null;
                }
            ).length;
    }

    filterOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfitOpportunityDto[]): TwoLegArbitrageProfitOpportunityDto[] {
        const orderBookAmountThresholdIndexSelected = this.commonFilter.orderBookAmountThresholdIndexSelected;
        return twoLegArbitrageProfitOpportunities
            .filter(item => {

                if (item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected] == null) {
                    return false;
                }
                let isMeetingMinRelativePercentCriteria: boolean;
                let isMeetingMaxRelativePercentCriteria: boolean;

                if (this.isFilteringOpportunitiesByMinRelativePercent()) {
                    isMeetingMinRelativePercentCriteria = item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent >= this.getMin(this.liveOpportunitiesFilter.minRelativePercentFilterValue);
                } else {
                    isMeetingMinRelativePercentCriteria = true;
                }

                if (this.isFilteringOpportunitiesByMaxRelativePercent()) {
                    isMeetingMaxRelativePercentCriteria = item.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent <= this.getMax(this.liveOpportunitiesFilter.maxRelativePercentFilterValue);
                } else {
                    isMeetingMaxRelativePercentCriteria = true;
                }

                let isMeetingVolumeCriteria: boolean;
                if (this.isFilteringByMin24hVolume()) {
                    let usd24hVolumeAtSellExchange = item.usd24hVolumeAtSellExchange == null ? Number.MAX_VALUE : item.usd24hVolumeAtSellExchange;
                    isMeetingVolumeCriteria = usd24hVolumeAtSellExchange >= this.getMin(this.commonFilter.min24hUsdVolume) &&
                        item.usd24hVolumeAtBuyExchange >= this.getMin(this.commonFilter.min24hUsdVolume);
                } else {
                    isMeetingVolumeCriteria = true;
                }

                const isMeetingBaseCurrencyCriteria = this.commonFilter.baseCurrencyBlackList.indexOf(item.baseCurrency) < 0;
                const isMeetingCounterCurrencyCriteria = this.commonFilter.counterCurrencyBlackList.indexOf(item.counterCurrency) < 0;

                return this.isShowingExchange(item.sellAtExchange) &&
                    this.isShowingExchange(item.buyAtExchange) &&
                    isMeetingMinRelativePercentCriteria &&
                    isMeetingMaxRelativePercentCriteria &&
                    isMeetingVolumeCriteria &&
                    isMeetingBaseCurrencyCriteria &&
                    isMeetingCounterCurrencyCriteria;
            })
            .sort((a, b) => {
                return b.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent - a.profitOpportunityHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent;
            });
    }

    private removeBlacklistedExchangesFromSelected() {
        this.commonFilter.exchangeBlackList.forEach(it => {
            this.selectedExchanges.splice(this.selectedExchanges.indexOf(it), 1);
        });
    }

}
