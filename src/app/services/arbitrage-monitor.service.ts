import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {ArbitrageMonitorEndpointUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class ArbitrageMonitorService {

    constructor(private http: HttpClient,
                @Inject(ArbitrageMonitorEndpointUrlToken) private arbitrageMonitorEndpointUrl: string,
                @Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    public getTwoLegArbitrageProfitOpportunities(): Observable<TwoLegArbitrageProfit[]> {
        return this.http.get<Array<TwoLegArbitrageProfit>>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-profits`);
    }

    public getTwoLegArbitrageProfitStatistics(): Observable<TwoLegArbitrageProfitStatistic[]> {
        return this.http.get<Array<TwoLegArbitrageProfitStatistic>>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-profit-statistics`);
    }

}

export interface TwoLegArbitrageProfit {
    baseCurrency: string;
    counterCurrency: string;
    sellAtExchange: string;
    usd24hVolumeAtSellExchange: number;
    buyAtExchange: string;
    usd24hVolumeAtBuyExchange: number;
    sellPrice: number;
    buyPrice: number;
    relativeProfitPercent: number;
}

export interface ProfitOpportunityCount {
    profitPercentThreshold: number;
    count: number;
}

export interface TwoLegArbitrageProfitStatistic {
    baseCurrency: string;
    counterCurrency: string;
    firstExchange: string;
    secondExchange: string;
    minProfitPercent: number;
    maxProfitPercent: number;
    minUsd24hVolume: number;
    averageProfitPercent: number;
    profitOpportunityHistogram: ProfitOpportunityCount[];
}
