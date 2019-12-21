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

    public getTwoLegArbitrageProfitOpportunities(): Observable<TwoLegArbitrageResponseDto> {
        return this.http.get<TwoLegArbitrageResponseDto>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-profits`);
    }

    public getTwoLegArbitrageProfitStatistics(): Observable<TwoLegArbitrageProfitStatistic[]> {
        return this.http.get<Array<TwoLegArbitrageProfitStatistic>>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-profit-statistics`);
    }

}

export interface TwoLegArbitrageProfitOpportunity {
    sellPrice: number;
    sellAmount: number;
    buyPrice: number;
    buyAmount: number;
    sellAtExchange: string;
    buyAtExchange: string;
    relativeProfitPercent: number;
    usdDepthUpTo: string;
}

export interface TwoLegArbitrageResponseDto {
    usdDepthThresholds: number[];
    profits: TwoLegArbitrageProfit[];
}

export interface TwoLegArbitrageProfit {
    baseCurrency: string;
    counterCurrency: string;
    firstExchange: string;
    usd24hVolumeAtFirstExchange: number;
    secondExchange: string;
    usd24hVolumeAtSecondExchange: number;
    arbitrageProfitHistogram: TwoLegArbitrageProfitOpportunity[];
}

export interface ProfitStatisticOpportunityCount {
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
    profitOpportunityHistogram: ProfitStatisticOpportunityCount[];
}
