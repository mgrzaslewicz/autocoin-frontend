import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {ExchangeMediatorUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class HealthService {

    constructor(private http: HttpClient,
                @Inject(ExchangeMediatorUrlToken) private exchangeMediatorUrl: string,
                @Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    public getExchangesHealth(): Observable<ExchangeHealthDto[]> {
        return this.http.get<Array<ExchangeHealthDto>>(`${this.exchangeMediatorUrl}/health`);
    }

}

export interface ExchangeCapabilityDto {
    name: string;
    value?: string;
}

export interface ExchangeHealthDto {
    exchangeName: string;
    healthy: Boolean;
    canTrade: Boolean;
    canGetPublicMarketData: Boolean;
    okForDetailedArbitrage: Boolean;
    capabilities: ExchangeCapabilityDto[];
    comments: string[];
    warningsAndErrors: string[];
    timestamp: number;
}

