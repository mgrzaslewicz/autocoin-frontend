import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ArbitrageMonitorService, TwoLegArbitrageProfit, TwoLegArbitrageProfitStatistic} from '../../services/arbitrage-monitor.service';
import {ToastService} from '../../services/toast.service';
import {ExchangeNamesSupportedForGettingPublicMarketData} from '../../../environments/environment.default';

interface LiveOpportunitiesFilter {
    isMinRelativePercentFilterOn: boolean;
    minRelativePercentFilterValue: number;
    isMaxRelativePercentFilterOn: boolean;
    maxRelativePercentFilterValue: number;
    isAutoRefreshOn: boolean;
    autoRefreshSeconds: number;
}

interface CommonFilter {
    min24hUsdVolume: number;
    isMin24hUsdVolumeFilterOn: boolean;
    orderBookAmountThresholdIndexSelected: number;
    baseCurrencyBlackList: string[];
    counterCurrencyBlackList: string[];
}

@Component({
    selector: 'app-arbitrage-monitor',
    templateUrl: './arbitrage-monitor.component.html',
    styleUrls: ['./arbitrage-monitor.component.scss']
})
export class ArbitrageMonitorComponent implements OnInit, OnDestroy {
    baseCurrenciesMonitored: string[] = [];
    selectedBaseCurrenciesMonitored: string[] = [];
    counterCurrenciesMonitored: string[] = [];
    selectedCounterCurrenciesMonitored: string[] = [];

    orderBookUsdAmountThresholds: number[] = [];
    orderBookUsdAmountThresholdsIndexes: number[] = [];
    isLoadingLiveOpportunities: boolean;
    isLoadingStatistics = false;
    isOpportunitiesTabActive = true;
    twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfit[] = [];
    twoLegArbitrageProfitStatistics: TwoLegArbitrageProfitStatistic[] = [];
    exchangeVisibilityMap: Map<string, boolean> = new Map<string, boolean>();
    commonFilter: CommonFilter = {
        min24hUsdVolume: 1000,
        isMin24hUsdVolumeFilterOn: false,
        orderBookAmountThresholdIndexSelected: 0,
        baseCurrencyBlackList: [],
        counterCurrencyBlackList: []
    };
    liveOpportunitiesFilter: LiveOpportunitiesFilter = {
        isMaxRelativePercentFilterOn: false,
        isMinRelativePercentFilterOn: false,
        maxRelativePercentFilterValue: null,
        minRelativePercentFilterValue: null,
        isAutoRefreshOn: false,
        autoRefreshSeconds: 10
    };
    private lastTwoLegArbitrageOpportunitiesRefreshTimeKey = 'lastTwoLegArbitrageOpportunitiesRefreshTime';
    private scheduledLiveOpportunitiesRefresh: number = null;

    constructor(
        private authService: AuthService,
        private arbitrageMonitorService: ArbitrageMonitorService,
        private toastService: ToastService,
        @Inject(ExchangeNamesSupportedForGettingPublicMarketData)
        public exchangeNamesSupportedForGettingPublicMarketData: string[]
    ) {
        exchangeNamesSupportedForGettingPublicMarketData.forEach(exchangeName => {
            const localStorageKey = `arbitrage-monitor.show-${exchangeName}`;
            const isShowingExchange = localStorage.getItem(localStorageKey) !== 'false';
            this.exchangeVisibilityMap.set(exchangeName, isShowingExchange);
        });
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
            } catch (e) {
                localStorage.removeItem('arbitrage-monitor.common-filter');
            }
        }
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon().subscribe(() => {
            this.fetchArbitrageMetadata();
            this.fetchLiveOpportunities();
            this.onAutoRefreshChange();
        });
    }

    ngOnDestroy(): void {
        clearInterval(this.scheduledLiveOpportunitiesRefresh);
        this.scheduledLiveOpportunitiesRefresh = null;
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
        if (this.isLoadingLiveOpportunities) {
            return;
        }
        this.isLoadingLiveOpportunities = true;
        this.arbitrageMonitorService.getTwoLegArbitrageProfitOpportunities()
            .subscribe(twoLegArbitrageProfitOpportunities => {
                    this.orderBookUsdAmountThresholds = twoLegArbitrageProfitOpportunities.usdDepthThresholds;
                    this.orderBookUsdAmountThresholdsIndexes = this.orderBookUsdAmountThresholds.map((value, index) => {
                        return index;
                    });
                    this.twoLegArbitrageProfitOpportunities = twoLegArbitrageProfitOpportunities.profits;
                    this.isLoadingLiveOpportunities = false;
                    localStorage.setItem(this.lastTwoLegArbitrageOpportunitiesRefreshTimeKey, new Date().getTime().toString());
                },
                error => {
                    this.isLoadingLiveOpportunities = false;
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

    showOpportunitiesTab() {
        this.isOpportunitiesTabActive = true;
    }

    private fetchStatistics() {
        if (this.isLoadingStatistics) {
            return;
        }
        this.isLoadingStatistics = true;
        this.arbitrageMonitorService.getTwoLegArbitrageProfitStatistics()
            .subscribe(twoLegArbitrageProfitStatistics => {
                    this.twoLegArbitrageProfitStatistics = twoLegArbitrageProfitStatistics;
                    this.isLoadingStatistics = false;
                },
                error => {
                    this.isLoadingStatistics = false;
                    this.toastService.danger('Sorry, something went wrong. Could not refresh arbitrage opportunities statistics');
                }
            );
    }

    showStatisticsTab() {
        this.isOpportunitiesTabActive = false;
        this.fetchStatistics();
    }

    isOrderBookAmountThresholdSelected(orderBookUsdAmountThresholdIndex: number): boolean {
        return this.commonFilter.orderBookAmountThresholdIndexSelected === orderBookUsdAmountThresholdIndex;
    }

    setOrderBookUsdAmountThreshold(orderBookUsdAmountThresholdIndex: number) {
        this.commonFilter.orderBookAmountThresholdIndexSelected = orderBookUsdAmountThresholdIndex;
        this.saveCommonFilter();
    }

    isShowingExchange(exchangeName: string): boolean {
        return this.exchangeVisibilityMap.get(exchangeName);
    }

    toggleLiveOpportunitiesMinFilter() {
        this.liveOpportunitiesFilter.isMinRelativePercentFilterOn = !this.liveOpportunitiesFilter.isMinRelativePercentFilterOn;
        this.saveLiveOpportunitiesFilter();
    }

    isAutoRefreshingLiveOpportunities(): boolean {
        return this.liveOpportunitiesFilter.isAutoRefreshOn;
    }

    toggleLiveOpportunitiesAutoRefresh() {
        this.liveOpportunitiesFilter.isAutoRefreshOn = !this.liveOpportunitiesFilter.isAutoRefreshOn;
        this.onAutoRefreshChange();
    }

    toggleLiveOpportunitiesMaxFilter() {
        this.liveOpportunitiesFilter.isMaxRelativePercentFilterOn = !this.liveOpportunitiesFilter.isMaxRelativePercentFilterOn;
        this.saveLiveOpportunitiesFilter();
    }

    private cancelLiveOpportunitiesRefresh() {
        clearInterval(this.scheduledLiveOpportunitiesRefresh);
        this.scheduledLiveOpportunitiesRefresh = null;
    }

    onAutoRefreshChange() {
        if (this.scheduledLiveOpportunitiesRefresh != null) {
            this.cancelLiveOpportunitiesRefresh();
        }
        if (this.isAutoRefreshingLiveOpportunities()) {
            const autoRefreshMillis = this.getNumber(this.liveOpportunitiesFilter.autoRefreshSeconds, 10) * 1000;
            this.scheduledLiveOpportunitiesRefresh = setInterval(() => {
                this.fetchLiveOpportunities();
            }, autoRefreshMillis);
        }
        this.saveLiveOpportunitiesFilter();
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

    toggleExchangeFilter(exchangeName: string) {
        const localStorageKey = `arbitrage-monitor.show-${exchangeName}`;
        if (this.isShowingExchange(exchangeName)) {
            localStorage.setItem(localStorageKey, 'false');
            this.exchangeVisibilityMap.set(exchangeName, false);
        } else {
            localStorage.removeItem(localStorageKey);
            this.exchangeVisibilityMap.set(exchangeName, true);
        }
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

    getTotalNumberOfOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfit[]) {
        const orderBookAmountThresholdIndexSelected = this.commonFilter.orderBookAmountThresholdIndexSelected;
        return twoLegArbitrageProfitOpportunities
            .filter(item => {
                    return item.arbitrageProfitHistogram[orderBookAmountThresholdIndexSelected] != null;
                }
            ).length;
    }

    filterOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfit[]): TwoLegArbitrageProfit[] {
        const orderBookAmountThresholdIndexSelected = this.commonFilter.orderBookAmountThresholdIndexSelected;
        return twoLegArbitrageProfitOpportunities
            .filter(item => {

                if (item.arbitrageProfitHistogram[orderBookAmountThresholdIndexSelected] == null) {
                    return false;
                }
                let isMeetingMinRelativePercentCriteria: boolean;
                let isMeetingMaxRelativePercentCriteria: boolean;

                if (this.isFilteringOpportunitiesByMinRelativePercent()) {
                    isMeetingMinRelativePercentCriteria = item.arbitrageProfitHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent >= this.getMin(this.liveOpportunitiesFilter.minRelativePercentFilterValue);
                } else {
                    isMeetingMinRelativePercentCriteria = true;
                }

                if (this.isFilteringOpportunitiesByMaxRelativePercent()) {
                    isMeetingMaxRelativePercentCriteria = item.arbitrageProfitHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent <= this.getMax(this.liveOpportunitiesFilter.maxRelativePercentFilterValue);
                } else {
                    isMeetingMaxRelativePercentCriteria = true;
                }

                let isMeetingVolumeCriteria: boolean;
                if (this.isFilteringByMin24hVolume()) {
                    isMeetingVolumeCriteria = item.usd24hVolumeAtSecondExchange >= this.getMin(this.commonFilter.min24hUsdVolume) &&
                        item.usd24hVolumeAtFirstExchange >= this.getMin(this.commonFilter.min24hUsdVolume);
                } else {
                    isMeetingVolumeCriteria = true;
                }

                const isMeetingBaseCurrencyCriteria = this.commonFilter.baseCurrencyBlackList.indexOf(item.baseCurrency) < 0;
                const isMeetingCounterCurrencyCriteria = this.commonFilter.counterCurrencyBlackList.indexOf(item.counterCurrency) < 0;

                return this.isShowingExchange(item.secondExchange.toLowerCase()) &&
                    this.isShowingExchange(item.firstExchange.toLowerCase()) &&
                    isMeetingMinRelativePercentCriteria &&
                    isMeetingMaxRelativePercentCriteria &&
                    isMeetingVolumeCriteria &&
                    isMeetingBaseCurrencyCriteria &&
                    isMeetingCounterCurrencyCriteria;
            })
            .sort((a, b) => {
                return b.arbitrageProfitHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent - a.arbitrageProfitHistogram[orderBookAmountThresholdIndexSelected].relativeProfitPercent;
            });
    }

    filterStatistics(twoLegArbitrageProfitStatistics: TwoLegArbitrageProfitStatistic[]) {
        return twoLegArbitrageProfitStatistics
            .filter(item => {
                let isMeetingVolumeCriteria: boolean;
                if (this.isFilteringByMin24hVolume()) {
                    isMeetingVolumeCriteria = item.minUsd24hVolume >= this.getMin(this.commonFilter.min24hUsdVolume);
                } else {
                    isMeetingVolumeCriteria = true;
                }

                const hasAnyOpportunityInSelectedMarketDepth = item.profitStatisticHistogramByUsdDepth[this.commonFilter.orderBookAmountThresholdIndexSelected].profitOpportunityHistogram.some(opportunity => {
                    return opportunity.count > 0;
                });

                return this.isShowingExchange(item.firstExchange.toLowerCase())
                    && this.isShowingExchange(item.secondExchange.toLowerCase())
                    && isMeetingVolumeCriteria
                    && hasAnyOpportunityInSelectedMarketDepth;
            })
            .sort((a, b) => {
                return b.profitStatisticHistogramByUsdDepth[this.commonFilter.orderBookAmountThresholdIndexSelected].averageProfitPercent
                    - a.profitStatisticHistogramByUsdDepth[this.commonFilter.orderBookAmountThresholdIndexSelected].averageProfitPercent;
            });
    }
}
