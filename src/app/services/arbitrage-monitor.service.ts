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

export interface TwoLegArbitrageProfitOpportunityDto {
    sellPrice?: number;
    sellAmount?: number;
    buyPrice: number;
    buyAmount: number;
    sellAtExchange?: string;
    buyAtExchange: string;
    relativeProfitPercent: number;
    profitUsd: number;
    usdDepthUpTo: string;
    areDetailsHidden: boolean;
    fees: TwoLegArbitrageProfitOpportunityFeesDto;
}

export interface TwoLegArbitrageMetadataResponseDto {
    baseCurrenciesMonitored: string[];
    counterCurrenciesMonitored: string[];
    freePlanProfitPercentCutOff: string;
    isIncludingProPlanOpportunities: boolean;
}

export interface TwoLegArbitrageResponseDto {
    usdDepthThresholds: number[];
    profits: TwoLegArbitrageProfitDto[];
}

export interface TwoLegArbitrageProfitDto {
    baseCurrency: string;
    counterCurrency: string;
    firstExchange: string;
    usd24hVolumeAtFirstExchange: number;
    secondExchange: string;
    usd24hVolumeAtSecondExchange: number;
    arbitrageProfitHistogram: TwoLegArbitrageProfitOpportunityDto[];
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
