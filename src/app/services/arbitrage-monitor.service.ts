import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {ArbitrageMonitorUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class ArbitrageMonitorService {

    constructor(private http: HttpClient,
                @Inject(ArbitrageMonitorUrlToken) private arbitrageMonitorEndpointUrl: string,
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
    buyFee: string;
    isDefaultBuyFeeUsed: boolean,
    withdrawalFee?: string;
    sellFee: string;
    isDefaultSellFeeUsed: boolean;
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
    exchangesMonitored: string[];
    freePlanProfitPercentCutOff: string;
    isIncludingProPlanOpportunities: boolean;
    defaultTransactionFeePercent: string;
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
    withdrawalEnabled?: boolean;
    depositEnabled?: boolean;
    usd24hVolumeAtBuyExchange?: number;
    usd24hVolumeAtSellExchange?: number;
    areDetailsHidden: boolean;
    profitOpportunityHistogram: TwoLegArbitrageProfitOpportunityAtDepthDto[];
    ageSeconds: number;
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
