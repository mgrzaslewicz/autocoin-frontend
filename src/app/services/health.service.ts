import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FEATURE_HEALTH, FeatureToggle, FeatureToggleToken} from './feature.toogle.service';

@Injectable({
    providedIn: 'root'
})
export class HealthService {

    private healthApiUrl = 'https://orders-api.autocoin-trader.com/health';
    // private healthApiUrl = 'http://localhost:9001/health';

    exchangesHealth: Map<String, ExchangeHealth> = new Map();

    constructor(private http: HttpClient, @Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
        if (featureToggle.isActive(FEATURE_HEALTH)) {
            this.getExchangesHealth();
            Observable.interval(10000)
                .subscribe(() => {
                    this.getExchangesHealth();
                });
        }
    }

    getExchangesHealth() {
        return this.http.get<Array<ExchangeHealthDto>>(this.healthApiUrl).subscribe(
            next => {
                console.log('Received ' + next.length + ' exchanges health updates');
                next.forEach(exHealthDto => {
                    let exHealth;
                    // It can't be done with .set each time we update. This way we avoid resting UI when updating health
                    if (this.exchangesHealth.has(exHealthDto.exchange)) {
                        exHealth = this.exchangesHealth.get(exHealthDto.exchange);
                    } else {
                        exHealth = new ExchangeHealth();
                        this.exchangesHealth.set(exHealthDto.exchange, exHealth);
                    }
                    exHealth.health = exHealthDto.health;
                    exHealth.detailed.clear();
                    Object.entries(exHealthDto.detailed).forEach((values) => exHealth.detailed.set(values[0], values[1]));
                });
            },
            error => console.error(error)
        );
    }

}

class ExchangeHealthDto {
    exchange: String;
    health: Boolean;
    detailed: Object;
}

class ExchangeHealth {
    exchange: String;
    health: Boolean;
    detailed: Map<String, Boolean> = new Map();
}
