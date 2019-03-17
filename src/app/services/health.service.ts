import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';

@Injectable()
export class HealthService {

    private healthApiUrl = 'https://orders-api.autocoin-trader.com/health';

    constructor(private http: HttpClient,
                @Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    public getExchangesHealth(): Observable<ExchangeHealthDto[]> {
        return this.http.get<Array<ExchangeHealthDto>>(this.healthApiUrl)
            .map(response => Object.values(response).map(data => this.toExchangeHealthDto(data)));
    }

    private toExchangeHealthDto(data): ExchangeHealthDto {
        return new ExchangeHealthDto(data.exchange, data.health, data.detailed, data.timestamp);
    }

}

export class ExchangeHealthDto {
    constructor(
        public exchange: String,
        public health: Boolean,
        public detailed: Object,
        public timestamp: number) {
    }
}

