import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ArbitrageMonitorService, TwoLegArbitrageProfit, TwoLegArbitrageProfitStatistic} from '../../services/arbitrage-monitor.service';
import {ToastService} from '../../services/toast.service';
import {ExchangeNamesSupportedForReadingPricesToken} from '../../../environments/environment.default';

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

    filterOpportunities(twoLegArbitrageProfitOpportunities: TwoLegArbitrageProfit[]) {
        return twoLegArbitrageProfitOpportunities.filter(item => {
            return this.isShowingExchange(item.buyAtExchange.toLowerCase()) && this.isShowingExchange(item.sellAtExchange.toLowerCase());
        });
    }

    filterStatistics(twoLegArbitrageProfitStatistics: TwoLegArbitrageProfitStatistic[]) {
        return twoLegArbitrageProfitStatistics.filter(item => {
            return this.isShowingExchange(item.firstExchange.toLowerCase()) && this.isShowingExchange(item.secondExchange.toLowerCase());
        });
    }
}
