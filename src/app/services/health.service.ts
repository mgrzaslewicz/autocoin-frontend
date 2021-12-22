import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {HealthEndpointUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class HealthService {

    constructor(private http: HttpClient,
                @Inject(HealthEndpointUrlToken) private healthEndpointUrl: string,
                @Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    public getExchangesHealth(): Observable<ExchangeHealthDto[]> {
        return this.http.get<Array<ExchangeHealthDto>>(this.healthEndpointUrl);
    }

}

export interface ExchangeCapabilityDto {
    name: string;
    capable?: Boolean;
}

export interface ExchangeHealthDto {
    exchangeName: string;
    healthy: Boolean;
    canTrade: Boolean;
    canGetPublicMarketData: Boolean;
    canGetTradingFeeRanges: Boolean;
    capabilities: ExchangeCapabilityDto[];
    comments: string[];
    timestamp: number;
}

