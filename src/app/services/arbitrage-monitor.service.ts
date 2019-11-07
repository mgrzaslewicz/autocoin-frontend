import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {ArbitrageMonitorEndpointUrlToken, HealthEndpointUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class ArbitrageMonitorService {

    constructor(private http: HttpClient,
                @Inject(ArbitrageMonitorEndpointUrlToken) private arbitrageMonitorEndpointUrl: string,
                @Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    public getTwoLegArbitrageProfitOpportunities(): Observable<TwoLegArbitrageProfit[]> {
        return this.http.get<Array<TwoLegArbitrageProfit>>(`${this.arbitrageMonitorEndpointUrl}/two-leg-arbitrage-profits`);
    }

}

export interface TwoLegArbitrageProfit {
    baseCurrency: string;
    counterCurrency: string;
    sellAtExchange: string;
    buyAtExchange: string;
    sellPrice: number;
    buyPrice: number;
    relativeProfitPercent: number;
}

