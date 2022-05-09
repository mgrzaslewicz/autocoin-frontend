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

    public getTwoLegArbitrageProfitOpportunities(): Observable<TwoLegArbitrageProfitOpportunitiesResponseDto> {
        return this.http.get<TwoLegArbitrageProfitOpportunitiesResponseDto>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-profits`);
    }

    public getArbitrageMetadata(): Observable<TwoLegArbitrageMetadataResponseDto> {
        return this.http.get<TwoLegArbitrageMetadataResponseDto>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-metadata`);
    }

    public getTwoLegArbitrageProfitStatistics(): Observable<TwoLegArbitrageProfitStatistic[]> {
        return this.http.get<Array<TwoLegArbitrageProfitStatistic>>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-profit-statistics`);
    }

}

export interface TwoLegArbitrageProfitOpportunityFeesDto {
    buyFee?: string;
    withdrawalFee?: string;
    sellFee?: string;
}

export interface TwoLegArbitrageProfitOpportunityAtDepthDto {
    buyPrice: number;
    buyAmount: number;
    sellPrice?: number;
    sellAmount?: number;
    relativeProfitPercent: number;
    profitUsd: number;
    usdDepthUpTo: string;
    fees: TwoLegArbitrageProfitOpportunityFeesDto;
}

export interface TwoLegArbitrageMetadataResponseDto {
    baseCurrenciesMonitored: string[];
    counterCurrenciesMonitored: string[];
    freePlanProfitPercentCutOff: string;
    isIncludingProPlanOpportunities: boolean;
}

export interface TwoLegArbitrageProfitOpportunitiesResponseDto {
    usdDepthThresholds: number[];
    profits: TwoLegArbitrageProfitOpportunityDto[];
}

export interface TwoLegArbitrageProfitOpportunityDto {
    baseCurrency: string;
    counterCurrency: string;
    buyAtExchange: string;
    sellAtExchange?: string;
    usd24hVolumeAtBuyExchange: number;
    usd24hVolumeAtSellExchange?: number;
    areDetailsHidden: boolean;
    profitOpportunityHistogram: TwoLegArbitrageProfitOpportunityAtDepthDto[];
}

export interface ProfitStatisticOpportunityCount {
    profitPercentThreshold: number;
    count: number;
}

export interface ProfitStatisticHistogramByUsdDepth {
    averageProfitPercent: number;
    minProfitPercent: number;
    maxProfitPercent: number;
    profitOpportunityHistogram: ProfitStatisticOpportunityCount[];
}

export interface TwoLegArbitrageProfitStatistic {
    baseCurrency: string;
    counterCurrency: string;
    firstExchange: string;
    secondExchange: string;
    minUsd24hVolume: number;
    profitStatisticHistogramByUsdDepth: ProfitStatisticHistogramByUsdDepth[];
}
