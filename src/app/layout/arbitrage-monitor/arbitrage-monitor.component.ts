import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ArbitrageMonitorService, TwoLegArbitrageProfit, TwoLegArbitrageProfitStatistic} from '../../services/arbitrage-monitor.service';
import {ToastService} from '../../services/toast.service';
import {ExchangeNamesSupportedForReadingPricesToken} from '../../../environments/environment.default';

interface LiveOpportunitiesFilter {
    isMinRelativePercentFilterOn: boolean;
    minRelativePercentFilterValue: number;
    isMaxRelativePercentFilterOn: boolean;
    maxRelativePercentFilterValue: number;
    orderBookAmountThresholdIndexSelected: number;
    isAutoRefreshOn: boolean;
    autoRefreshSeconds: number;
}

interface CommonFilter {
    min24hUsdVolume: number;
    isMin24hUsdVolumeFilterOn: boolean;
}

@Component({
    selector: 'app-arbitrage-monitor',
    templateUrl: './arbitrage-monitor.component.html',
    styleUrls: ['./arbitrage-monitor.component.scss']
})
export class ArbitrageMonitorComponent implements OnInit {
    orderBookUsdAmountThresholds: number[] = [100, 200, 500, 1000, 2000];
    orderBookUsdAmountThresholdsIndexes: number[] = this.orderBookUsdAmountThresholds.map((value, index) => {
        return index;
    });
    isLoadingLiveOpportunities: boolean;
    isLoadingStatistics = false;
    isOpportunitiesTabActive = true;
    twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfit[] = [];
    twoLegArbitrageProfitStatistics: TwoLegArbitrageProfitStatistic[] = [];
    exchangeVisibilityMap: Map<string, boolean> = new Map<string, boolean>();
    commonFilter: CommonFilter = {
        min24hUsdVolume: 1000,
        isMin24hUsdVolumeFilterOn: false
    };
    liveOpportunitiesFilter: LiveOpportunitiesFilter = {
        isMaxRelativePercentFilterOn: false,
        isMinRelativePercentFilterOn: false,
        maxRelativePercentFilterValue: null,
        minRelativePercentFilterValue: null,
        orderBookAmountThresholdIndexSelected: 0,
        isAutoRefreshOn: false,
        autoRefreshSeconds: 10
    };
    private lastTwoLegArbitrageOpportunitiesRefreshTimeKey = 'lastTwoLegArbitrageOpportunitiesRefreshTime';
    private scheduledLiveOpportunitiesRefresh: number = null;

    constructor(
        private authService: AuthService,
        private arbitrageMonitorService: ArbitrageMonitorService,
        private toastService: ToastService,
        @Inject(ExchangeNamesSupportedForReadingPricesToken)
        public exchangeNamesSupportedForReadingPrices: string[]
    ) {
        exchangeNamesSupportedForReadingPrices.forEach(exchangeName => {
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
            } catch (e) {
                localStorage.removeItem('arbitrage-monitor.common-filter');
            }
        }
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon().subscribe(() => {
            this.fetchLiveOpportunities();
            this.onAutoRefreshChange();
        });
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

    fetchLiveOpportunities() {
        if (this.isLoadingLiveOpportunities) {
            return;
        }
        this.isLoadingLiveOpportunities = true;
        this.arbitrageMonitorService.getTwoLegArbitrageProfitOpportunities()
            .subscribe(twoLegArbitrageProfitOpportunities => {
                    this.twoLegArbitrageProfitOpportunities = twoLegArbitrageProfitOpportunities;
                    this.isLoadingLiveOpportunities = false;
                    localStorage.setItem(this.lastTwoLegArbitrageOpportunitiesRefreshTimeKey, new Date().getTime().toString());
                },
                error => {
                    this.isLoadingLiveOpportunities = false;
                    this.toastService.danger('Sorry, something went wrong. Could not refresh arbitrage opportunities');
                }
            );
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
        return this.liveOpportunitiesFilter.orderBookAmountThresholdIndexSelected === orderBookUsdAmountThresholdIndex;
    }

    setOrderBookUsdAmountThreshold(orderBookUsdAmountThresholdIndex: number) {
        this.liveOpportunitiesFilter.orderBookAmountThresholdIndexSelected = orderBookUsdAmountThresholdIndex;
        this.saveLiveOpportunitiesFilter();
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

    onAutoRefreshChange() {
        if (this.scheduledLiveOpportunitiesRefresh != null) {
            clearInterval(this.scheduledLiveOpportunitiesRefresh);
            this.scheduledLiveOpportunitiesRefresh = null;
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

    filterOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfit[]): TwoLegArbitrageProfit[] {
        const orderBookAmountThresholdIndexSelected = this.liveOpportunitiesFilter.orderBookAmountThresholdIndexSelected;
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

                return this.isShowingExchange(item.secondExchange.toLowerCase()) &&
                    this.isShowingExchange(item.firstExchange.toLowerCase()) &&
                    isMeetingMinRelativePercentCriteria &&
                    isMeetingMaxRelativePercentCriteria &&
                    isMeetingVolumeCriteria;
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
                return this.isShowingExchange(item.firstExchange.toLowerCase())
                    && this.isShowingExchange(item.secondExchange.toLowerCase())
                    && isMeetingVolumeCriteria;
            })
            .sort((a, b) => {
                return b.averageProfitPercent - a.averageProfitPercent;
            });
    }
}
