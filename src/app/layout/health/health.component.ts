import {Component, OnInit} from '@angular/core';
import {HealthService} from '../../services/health.service';
import {ToastService} from '../../services/toast.service';

export class ExchangeHealth {
    constructor(
        public exchangeName: String,
        public isHealthy: Boolean,
        public details: Map<String, Boolean>,
        public timestamp: Number
    ) {
    }
}

@Component({
    selector: 'app-health',
    templateUrl: 'health.component.html',
    styleUrls: ['health.component.scss']
})
export class HealthComponent implements OnInit {
    exchangesHealth: Map<String, ExchangeHealth> = new Map();

    constructor(private healthService: HealthService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.getExchangesHealth();
    }

    private getExchangesHealth() {
        this.healthService.getExchangesHealth().subscribe(
            healthDtoList => {
                healthDtoList.forEach(healthDto => {
                        let healthDetails: Map<String, Boolean>;
                        if (this.exchangesHealth.has(healthDto.exchange)) {
                            const existingHealth = this.exchangesHealth.get(healthDto.exchange);
                            existingHealth.timestamp = healthDto.timestamp;
                            existingHealth.details.clear();
                            healthDetails = existingHealth.details;
                        } else {
                            healthDetails = new Map();
                            const newHealth = new ExchangeHealth(healthDto.exchange, healthDto.health, healthDetails, healthDto.timestamp);
                            this.exchangesHealth.set(healthDto.exchange, newHealth);
                        }
                        Object.entries(healthDto.detailed)
                            .forEach((values) =>
                                healthDetails.set(values[0], values[1]));
                    }
                );
            },
            error => {
                this.toastService.warning('Could not get exchanges health');
            }
        );
    }

}
