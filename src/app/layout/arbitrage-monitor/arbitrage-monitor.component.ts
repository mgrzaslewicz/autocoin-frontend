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
        minRelativePercentFilterValue: null
    };
    private lastTwoLegArbitrageOpportunitiesRefreshTimeKey = 'lastTwoLegArbitrageOpportunitiesRefreshTime';

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

    isShowingExchange(exchangeName: string): boolean {
        return this.exchangeVisibilityMap.get(exchangeName);
    }

    toggleLiveOpportunitiesMinFilter() {
        this.liveOpportunitiesFilter.isMinRelativePercentFilterOn = !this.liveOpportunitiesFilter.isMinRelativePercentFilterOn;
        this.saveLiveOpportunitiesFilter();
    }

    toggleLiveOpportunitiesMaxFilter() {
        this.liveOpportunitiesFilter.isMaxRelativePercentFilterOn = !this.liveOpportunitiesFilter.isMaxRelativePercentFilterOn;
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

    private getMin(value: any): number {
        if (value === '' || value === null) {
            return 0;
        }
        if (isNaN(value)) {
            return 0;
        } else {
            return Number(value);
        }
    }

    private getMax(value: any): number {
        if (value === '' || value === null) {
            return 99999999;
        }
        if (isNaN(value)) {
            return 99999999;
        } else {
            return Number(value);
        }
    }

    filterOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfit[]) {
        return twoLegArbitrageProfitOpportunities
            .filter(item => {
                let isMeetingMinRelativePercentCriteria: boolean;
                let isMeetingMaxRelativePercentCriteria: boolean;

                if (this.isFilteringOpportunitiesByMinRelativePercent()) {
                    isMeetingMinRelativePercentCriteria = item.relativeProfitPercent >= this.getMin(this.liveOpportunitiesFilter.minRelativePercentFilterValue);
                } else {
                    isMeetingMinRelativePercentCriteria = true;
                }

                if (this.isFilteringOpportunitiesByMaxRelativePercent()) {
                    isMeetingMaxRelativePercentCriteria = item.relativeProfitPercent <= this.getMax(this.liveOpportunitiesFilter.maxRelativePercentFilterValue);
                } else {
                    isMeetingMaxRelativePercentCriteria = true;
                }

                let isMeetingVolumeCriteria: boolean;
                if (this.isFilteringByMin24hVolume()) {
                    isMeetingVolumeCriteria = item.usd24hVolumeAtBuyExchange >= this.getMin(this.commonFilter.min24hUsdVolume) &&
                        item.usd24hVolumeAtSellExchange >= this.getMin(this.commonFilter.min24hUsdVolume);
                } else {
                    isMeetingVolumeCriteria = true;
                }

                return this.isShowingExchange(item.buyAtExchange.toLowerCase()) &&
                    this.isShowingExchange(item.sellAtExchange.toLowerCase()) &&
                    isMeetingMinRelativePercentCriteria &&
                    isMeetingMaxRelativePercentCriteria &&
                    isMeetingVolumeCriteria;
            })
            .sort((a, b) => {
                return b.relativeProfitPercent - a.relativeProfitPercent;
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
